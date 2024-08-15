import { Box } from "@mui/material";
import { useState } from "react";
import CommonTable from "../../../components/CommonTable";
import SearchDateRangeMixin from "../../../components/mixins/SearchDateRangeMixin";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CommonTableSkeleton from "../../../components/CommonTableSkeleton";
import moment from "moment";
import { useGetAllTransferOutsQuery } from "../../../features/inventory-management/api/transferOutApi";
import PageHeaderAddTabs from "../../../components/PageHeaderAddTabs";

function TransferOut() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const [tabViewing, setTabViewing] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);

  const { data, isFetching } = useGetAllTransferOutsQuery({
    Search: search,
    Page: page + 1,
    PageSize: rowsPerPage,
    DateFrom: dateFrom ? moment(dateFrom).format("YYYY-MM-DD") : "",
    DateTo: dateTo ? moment(dateTo).format("YYYY-MM-DD") : "",
    TransferOutStatus:
      tabViewing === 1 ? "Pending" : tabViewing === 2 ? "Received" : "Rejected",
  });

  const tableHeads = [
    "ID",
    "To",
    "Cluster",
    "Total Quantity",
    "Transaction Date",
  ];

  const customOrderKeys = [
    "id",
    "to",
    "cluster",
    "totalQuantity",
    "transactionDate",
  ];

  const dateTimeArray = ["transactionDate"];

  const tabs = [
    {
      case: 1,
      name: "Pending Transfer Out",
      status: "Pending",
    },
    {
      case: 2,
      name: "Received Transfer Out",
      status: "Received",
    },
    {
      case: 3,
      name: "Rejected Transfer Out",
      status: "Rejected",
    },
  ];

  // Functions
  const handleView = () => {
    navigate(`${selectedRowData?.id}`);
  };

  const handleAdd = () => {
    navigate("transfer-out-form");
  };

  if (location.pathname === "/inventory-management/transfer-out") {
    return (
      <Box className="commonPageLayout">
        <PageHeaderAddTabs
          pageTitle="Transfer Out"
          tabsList={tabs}
          tabViewing={tabViewing}
          setTabViewing={setTabViewing}
          wide
          addTitle="Add Transfer Out"
          onOpen={handleAdd}
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
            moveNoDataUp
            lowerCompact
            mapData={data?.transferOuts}
            tableHeads={tableHeads}
            customOrderKeys={customOrderKeys}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            page={page}
            setPage={setPage}
            count={data?.totalCount}
            dateTimeArray={dateTimeArray}
            onView={handleView}
          />
        )}
      </Box>
    );
  }

  return <Outlet />;
}

export default TransferOut;
