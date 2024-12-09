import { Box } from "@mui/material";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import { useEffect, useState } from "react";
import { useGetInventoryMrpQuery } from "../../features/inventory-management/api/inventoryMrpApi";

function InventoryMRP() {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

  // RTK Query
  const { data, isFetching } = useGetInventoryMrpQuery({
    Page: page + 1,
    PageSize: rowsPerPage,
    Search: search,
  });

  console.log(data);

  // CommonTable Props
  const tableHeads = [
    "Item Code",
    "Item Description",
    "Receiving",
    "Transfer In",
    "Transfer Out",
    "Freebie",
    "Sampling",
    "Replace",
    "Return",
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
    "return",
    "soh",
  ];

  // UseEffect
  useEffect(() => {
    setPage(0);
  }, [search, rowsPerPage]);

  return (
    <Box className="commonPageLayout">
      <PageHeaderAdd
        pageTitle="Inventory MRP"
        removeArchive
        removeAdd
        setSearch={setSearch}
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
