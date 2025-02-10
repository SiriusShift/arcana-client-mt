import { Box } from "@mui/material";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import { useEffect, useState } from "react";
import { useGetInventoryMrpQuery } from "../../features/inventory-management/api/inventoryMrpApi";
import PageHeaderFilterAdd from "../../components/PageHeaderFilterAdd";
import { clusterOptions } from "../../utils/constants";
import { useSelector } from "react-redux";

function InventoryMRP() {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const userDetails = useSelector((state) => state.login.userDetails);
  const [clusterId, setClusterId] = useState(userDetails?.roleName === "CDO" ? " " : 1);


  // RTK Query
  const { data, isFetching } = useGetInventoryMrpQuery(
    {
      PageNumber: page + 1,
      PageSize: rowsPerPage,
      Search: search,
      ClusterId: clusterId,
    },
    { refetchOnMountOrArgChange: true }
  );

  console.log(data);

  // CommonTable Props
  const tableHeads = [
    "Item Code",
    "Item Description",
    "Receiving (+)",
    "Transfer In (+)",
    "Transfer Out (-)",
    "Freebies (-)",
    "Sampling (-)",
    "Replaced (-)",
    "Sales (-)",
    "Returned Client (+)",
    "Returned by CDO",
    "SOH",
  ];

  const customOrderKeys = [
    "itemCode",
    "itemDescription",
    "receiving",
    "transferIn",
    "transferOut",
    "freebie",
    "sampling",
    "replace",
    "sales",
    "returnByClient",
    "returnCdo",
    "soh",
  ];

  // UseEffect
  useEffect(() => {
    setPage(0);
  }, [search, rowsPerPage]);

  return (
    <Box className="commonPageLayout">
      <PageHeaderFilterAdd
        pageTitle="Inventory MRP"
        removeArchive
        removeAdd
        removeAllItem
        removeFilter={userDetails?.roleName.includes("CDO")}
        filterChoices={clusterOptions}
        setSearch={setSearch}
        setFilter={setClusterId}
        choiceLabel="label"
        choiceValue="value"
      />

      {isFetching ? (
        <CommonTableSkeleton evenLesserCompact />
      ) : (
        <CommonTable
          evenLesserCompact
          moveNoDataUp
          mapData={data?.mo}
          tableHeads={tableHeads}
          customOrderKeys={customOrderKeys}
          includeActions={false}
          count={data?.totalCount || 0}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          page={page}
          setPage={setPage}
        />
      )}
    </Box>
  );
}

export default InventoryMRP;
