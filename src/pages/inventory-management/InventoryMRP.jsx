import { Box } from "@mui/material";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import { useEffect, useState } from "react";
import { useGetInventoryMrpQuery } from "../../features/inventory-management/api/inventoryMrpApi";
import PageHeaderFilterAdd from "../../components/PageHeaderFilterAdd";
import { clusterOptions } from "../../utils/constants";
import { useSelector } from "react-redux";
import { useGetAllUsersQuery } from "../../features/user-management/api/userAccountApi";
import { useGetAllUserRolesQuery } from "../../features/user-management/api/userRoleApi";
import { useGetAllClustersQuery } from "../../features/setup/api/clusterApi";

function InventoryMRP() {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const userDetails = useSelector((state) => state.login.userDetails);
  const [clusterId, setClusterId] = useState();

  // RTK Query
  const { data, isFetching } = useGetInventoryMrpQuery(
    {
      PageNumber: page + 1,
      PageSize: rowsPerPage,
      Search: search,
      // UserId: user,
      ClusterId: clusterId,
    },
    { refetchOnMountOrArgChange: true }
  );

  const { data: clusterData, isFetching: clusterFetching, error } = useGetAllClustersQuery(
    {
      Status: true,
      PageNumber: 1,
      PageSize: 10000,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  let sortedData

  const sortSOH = () => {
    sortedData = data?.sort((a, b) => a.soh - b.soh)
  }

  console.log(sortedData);

  const tableHeads = [
    "Item Code",
    "Item Description",
    "Expected Delivery",
    "Receiving (+)",
    "Transfer In (+)",
    "Transfer Out (-)",
    "Return to Depot (-)",
    "Return (+)",
    "Freebies (-)",
    "Sampling (-)",
    "Replaced (-)",
    "Sales (-)",
    "Misc Issue (-)",
    "Misc Receipt (+)",
    "Returned by Client (+)",
    "Reserved",
    "For Releasing",
    // "Temporary Return",
    "SOH",
  ];

  const sortColumn = [
    {
      header: "SOH",
      key: "soh",
      sticky: true
    },
    {
      header: "Item Code",
      key: "itemCode"
    }
  ]

  const customOrderKeys = [
    "itemCode",
    "itemDescription",
    "fromDepot",
    "receiving",
    "transferIn",
    "transferOut",
    "returnToDepot",
    "returnSampling",
    "freebie",
    "sampling",
    "replace",
    "sales",
    "miscOut",
    "miscIn",
    "returnByClient",
    "reserve",
    "forReleasing",
    // "temporaryReturn",
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
        removeFilter={
          userDetails?.roleName.includes("TDO") ||
            userDetails?.roleName.includes("Marketing") ||
            userDetails?.roleName.includes("Depot")
            ? true
            : false
        }
        filterChoices={clusterData?.cluster}
        setSearch={setSearch}
        setFilter={setClusterId}
        // removeUser
        choiceLabel="cluster"
        choiceValue="id"
      />

      {isFetching ? (
        <CommonTableSkeleton evenLesserCompact />
      ) : (
        <CommonTable
          evenLesserCompact
          moveNoDataUp
          border
          mapData={data?.mo}
          tableHeads={tableHeads}
          customOrderKeys={customOrderKeys}
          includeActions={false}
          count={data?.totalCount || 0}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          page={page}
          sortColumn={sortColumn}
          setPage={setPage}
        />
      )}
    </Box>
  );
}

export default InventoryMRP;
