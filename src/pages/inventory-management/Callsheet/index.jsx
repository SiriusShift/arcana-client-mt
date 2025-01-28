import { Box, Typography } from "@mui/material";
import { useState } from "react";
import CommonTable from "../../../components/CommonTable";
import SearchDateRangeMixin from "../../../components/mixins/SearchDateRangeMixin";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CommonTableSkeleton from "../../../components/CommonTableSkeleton";
import moment from "moment";
import PageHeaderAddTabs from "../../../components/PageHeaderAddTabs";
import { useGetAllFreebieRequestsQuery } from "../../../features/inventory-management/api/freebiesApi";
import PageHeaderAdd from "../../../components/PageHeaderAdd";
import "../../../assets/styles/inventory.styles.scss";
import { useGetAllCallsheetsQuery } from "../../../features/inventory-management/api/callsheetApi";

function Callsheet() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const [tabViewing, setTabViewing] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState(moment().startOf("month"));
  const [dateTo, setDateTo] = useState(moment());

  const {data, isFetching} = useGetAllCallsheetsQuery();

  console.log(data);

  const tableHeads = [
    "ID",
    "Customer Name",
    "Business Name",
    "Expiration Date",
  ];

  const customOrderKeys = [
    "id",
    "clientName",
    "businessName",
    "expirationDate",
  ];

  const nestedProperty = {
    key: "businessAddress",
    nestedKeys: ["city", "province"],
  };

  const dateTimeArray = ["transactionDate"];

  const tabs = [
    {
      case: 1,
      name: "Pending Freebies",
      status: "Pending",
    },
    {
      case: 2,
      name: "Approved Freebies",
      status: "Approved",
    },
    {
      case: 3,
      name: "Rejected Freebies",
      status: "Rejected",
    },
  ];

  // Functions
  const handleView = () => {
    navigate(
      `${selectedRowData?.id}?dateFrom=${moment(dateFrom).format(
        "YYYY-MM-DD"
      )}&dateTo=${moment(dateTo).format("YYYY-MM-DD")}`
    );
  };

  const handleAdd = () => {
    navigate("freebies-form");
  };

  if (location.pathname === "/inventory-management/callsheet") {
    return (
      <Box className="commonPageLayout">
        <div className="inventory__callsheet__summaryHeader">
          <Typography className="inventory__callsheet__summaryHeader__title">Color Summmary</Typography>
          <div className="inventory__callsheet__summaryHeader__redBox">
            <div className="inventory__callsheet__summaryHeader__redBox__red"/>
            <Typography>1 - 10 Days</Typography>
          </div>
          <div className="inventory__callsheet__summaryHeader__orangeBox">
            <div className="inventory__callsheet__summaryHeader__orangeBox__orange"/>
            <Typography>11 - 15 Days</Typography>
          </div>
          <div className="inventory__callsheet__summaryHeader__greenBox">
            <div className="inventory__callsheet__summaryHeader__greenBox__green"/>
            <Typography>16 & above</Typography>
          </div>
        </div>
        <PageHeaderAdd
          pageTitle="Callsheet"
          setSearch={setSearch}
          removeArchive
          // tabsList={tabs}
          // tabViewing={tabViewing}
          // setTabViewing={setTabViewing}
          // wide
          removeAdd
          // addTitle="Add Freebie Request"
          // onOpen={handleAdd}
        />

        {/* <SearchDateRangeMixin
          setSearch={setSearch}
          setDateFrom={setDateFrom}
          setDateTo={setDateTo}
          dateFrom={dateFrom}
          dateTo={dateTo}
        /> */}

        {isFetching ? (
          <CommonTableSkeleton lowerCompact />
        ) : (
          <CommonTable
            moveNoDataUp
            lowerCompact
            mapData={data?.to}
            tableHeads={tableHeads}
            customOrderKeys={customOrderKeys}
            nestedProperty={nestedProperty}
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

export default Callsheet;
