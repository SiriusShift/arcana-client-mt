import { Box } from "@mui/material";
import PageHeaderAdd from "../../../components/PageHeaderAdd";
import CommonTable from "../../../components/CommonTable";
import GenerateMoveOrderModal from "../../../components/page-components/sales-management/sales-transaction/GenerateMoveOrderModal";
import useDisclosure from "../../../hooks/useDisclosure";
import { useContext, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetAllReceivedOrdersQuery } from "../../../features/inventory-management/api/receivingApi";
import CommonTableSkeleton from "../../../components/CommonTableSkeleton";
import SearchDateRangeMixin from "../../../components/mixins/SearchDateRangeMixin";
import moment from "moment";
import useValidate from "../../../hooks/useValidate";

function Receiving() {
  const navigate = useNavigate();
  const location = useLocation();
  const { validateEndingInventory, isNotificationFetching } = useValidate();
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState(moment().startOf("month"));
  const [dateTo, setDateTo] = useState(moment());
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  // RTK Query
  const { data, isFetching } = useGetAllReceivedOrdersQuery({
    Search: search,
    PageNumber: page + 1,
    DateFrom: dateFrom ? moment(dateFrom).format("YYYY-MM-DD") : "",
    DateTo: dateTo ? moment(dateTo).format("YYYY-MM-DD") : "",
    PageSize: rowsPerPage,
  });

  // Common Table Props
  const tableHeads = [
    "Move Order ID",
    "Series ID",
    "Customer Name",
    "Cluster",
    "Transaction Date",
    "Date Received",
  ];

  const customOrderKeys = [
    "moveOrderId",
    "seriesId",
    "customerName",
    "cluster",
    "transactionDate",
    "dateReceived",
  ];

  const dateTimeArray = ["transactionDate", "dateReceived"];

  // Disclosures
  const {
    isOpen: isGenerateOpen,
    onOpen: onGenerateOpen,
    onClose: onGenerateClose,
  } = useDisclosure();

  // Functions
  const handleView = () => {
    navigate(
      `${selectedRowData?.moveOrderId}?dateFrom=${moment(dateFrom).format(
        "YYYY-MM-DD"
      )}&dateTo=${moment(dateTo).format("YYYY-MM-DD")}`
    );
  };

  if (location.pathname === "/inventory-management/receiving") {
    return (
      <>
        <GenerateMoveOrderModal
          open={isGenerateOpen}
          onClose={onGenerateClose}
        />

        <Box className="commonPageLayout">
          <PageHeaderAdd
            pageTitle="Receiving"
            addTitle="New Delivery"
            removeArchive
            removeSearch
            onOpen={onGenerateOpen}
            setSearch={setSearch}
          />
          <SearchDateRangeMixin
            setSearch={setSearch}
            setDateFrom={setDateFrom}
            setDateTo={setDateTo}
            dateFrom={dateFrom}
            dateTo={dateTo}
          />

          {isFetching || isNotificationFetching ? (
            <CommonTableSkeleton lowerCompact />
          ) : (
            <CommonTable
              lowerCompact
              moveNoDataUp
              mapData={data?.value?.mo || []}
              tableHeads={tableHeads}
              customOrderKeys={customOrderKeys}
              dateTimeArray={dateTimeArray}
              count={data?.value?.totalCount || 0}
              onView={handleView}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              page={page}
              setPage={setPage}
            />
          )}
        </Box>
      </>
    );
  }

  return <Outlet />;
}

export default Receiving;
