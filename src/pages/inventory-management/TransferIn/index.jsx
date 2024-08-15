import { Box } from "@mui/material";
import PageHeaderTabs from "../../../components/PageHeaderTabs";
import { useState } from "react";
import CommonTable from "../../../components/CommonTable";
import SearchDateRangeMixin from "../../../components/mixins/SearchDateRangeMixin";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetAllTransferInsQuery } from "../../../features/inventory-management/api/transferInApi";
import CommonTableSkeleton from "../../../components/CommonTableSkeleton";
import moment from "moment";

function TransferIn() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const [tabViewing, setTabViewing] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);

  const { data, isFetching } = useGetAllTransferInsQuery({
    Search: search,
    Page: page + 1,
    PageSize: rowsPerPage,
    DateFrom: dateFrom ? moment(dateFrom).format("YYYY-MM-DD") : "",
    DateTo: dateTo ? moment(dateTo).format("YYYY-MM-DD") : "",
    TransferInStatus:
      tabViewing === 1 ? "Pending" : tabViewing === 2 ? "Received" : "Rejected",
  });

  const tableHeads = [
    "ID",
    "From",
    "Cluster",
    "Total Quantity",
    "Transaction Date",
  ];

  const customOrderKeys = [
    "id",
    "from",
    "cluster",
    "totalQuantity",
    "transactionDate",
  ];

  const dateTimeArray = ["transactionDate"];

  const tabs = [
    {
      case: 1,
      name: "Pending Transfer In",
      status: "Pending",
    },
    {
      case: 2,
      name: "Received Transfer In",
      status: "Received",
    },
    {
      case: 3,
      name: "Rejected Transfer In",
      status: "Rejected",
    },
  ];

  // Functions
  const handleView = () => {
    if (tabViewing === 1) {
      navigate(`transfer-in-form/${selectedRowData?.id}`);
    } else {
      navigate(`${selectedRowData?.id}`);
    }
  };

  if (location.pathname === "/inventory-management/transfer-in") {
    return (
      <Box className="commonPageLayout">
        <PageHeaderTabs
          pageTitle="Transfer In"
          tabsList={tabs}
          tabViewing={tabViewing}
          setTabViewing={setTabViewing}
          wide
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
            mapData={data?.transferIns}
            tableHeads={tableHeads}
            customOrderKeys={customOrderKeys}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            page={page}
            setPage={setPage}
            count={data?.totalCount}
            dateTimeArray={dateTimeArray}
            onView={tabViewing !== 1 ? handleView : null}
            onReceive={tabViewing === 1 ? handleView : null}
          />
        )}
      </Box>
    );
  }

  return <Outlet />;
}

export default TransferIn;
