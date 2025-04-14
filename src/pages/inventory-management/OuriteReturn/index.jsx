import { Box } from "@mui/material";
import PageHeaderAdd from "../../../components/PageHeaderAdd";
import CommonTable from "../../../components/CommonTable";
import GenerateMoveOrderModal from "../../../components/modals/inventory-management/GenerateMoveOrderModal";
import useDisclosure from "../../../hooks/useDisclosure";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetAllReceivedOrdersQuery } from "../../../features/inventory-management/api/receivingApi";
import CommonTableSkeleton from "../../../components/CommonTableSkeleton";
import SearchDateRangeMixin from "../../../components/mixins/SearchDateRangeMixin";
import moment from "moment";
import { useGetAllTransferOutsQuery } from "../../../features/inventory-management/api/transferOutApi";

function Outright() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState(moment().startOf("month"));
  const [dateTo, setDateTo] = useState(moment());
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const pesoArray = ["totalAmount"];

  // RTK Query
  const { data, isFetching } = useGetAllTransferOutsQuery({
    Search: search,
    Page: page + 1,
    PageSize: rowsPerPage,
    DateFrom: dateFrom ? moment(dateFrom).format("YYYY-MM-DD") : "",
    DateTo: dateTo ? moment(dateTo).format("YYYY-MM-DD") : "",
    Status: "Received",
    TransferType: "Outright",
  });

  // Common Table Props
  const tableHeads = [
    "ID",
    "CDO",
    "Transaction Date",
    "Total Amount",
    "Total Quantity",
  ];

  const customOrderKeys = [
    "id",
    "createdBy",
    "transactionDate",
    "totalAmount",
    "totalQuantity",
  ];

  const dateTimeArray = ["transactionDate", "dateReceived"];

  const handleAdd = () => {
    navigate("ourite-return-form");
  };

  // Functions
  const handleView = () => {
    navigate(
      `${selectedRowData?.id}?dateFrom=${moment(dateFrom).format(
        "YYYY-MM-DD"
      )}&dateTo=${moment(dateTo).format("YYYY-MM-DD")}`
    );
  };

  if (location.pathname === "/inventory-management/ourite-return") {
    return (
      <>
        {/* <GenerateMoveOrderModal
          open={isGenerateOpen}
          onClose={onGenerateClose}
        /> */}

        <Box className="commonPageLayout">
          <PageHeaderAdd
            pageTitle="Ourite Return"
            addTitle="Return"
            removeArchive
            removeSearch
            onOpen={handleAdd}
            setSearch={setSearch}
          />
          <SearchDateRangeMixin
            setSearch={setSearch}
            setDateFrom={setDateFrom}
            setDateTo={setDateTo}
            dateFrom={dateFrom}
            dateTo={dateTo}
          />

          {isFetching ? (
            <CommonTableSkeleton lowerCompact />
          ) : (
            <CommonTable
              lowerCompact
              moveNoDataUp
              mapData={data?.value?.to || []}
              tableHeads={tableHeads}
              customOrderKeys={customOrderKeys}
              dateTimeArray={dateTimeArray}
              count={data?.value?.totalCount || 0}
              onView={handleView}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              page={page}
              pesoArray={pesoArray}
              setPage={setPage}
            />
          )}
        </Box>
      </>
    );
  }

  return <Outlet />;
}

export default Outright;