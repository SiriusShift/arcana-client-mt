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
import CallsheetModal from "../../../components/modals/inventory-management/Callsheet/CallsheetModal";
import useDisclosure from "../../../hooks/useDisclosure";

function Callsheet() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    onOpen: onCallsheetOpen,
    onClose: onCallsheetClose,
    isOpen: isCallsheetOpen,
  } = useDisclosure();
  

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const [tabViewing, setTabViewing] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState(moment().startOf("month"));
  const [dateTo, setDateTo] = useState(moment());

  const { data, isFetching } = useGetAllCallsheetsQuery();

  console.log(data);

  const tableHeads = [
    "ID",
    "Customer Name",
    "Business Name",
    "Callsheet Date",
    "Expiration date",
  ];

  const customOrderKeys = [
    "id",
    "customerName",
    "businessName",
    "callsheetDate",
    "expirationDate",
  ];

  const nestedProperty = {
    key: "expirationDate",
    nestedKeys: ["bbd"],
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

  const handleAdd = () => {
    navigate("freebies-form");
  };

  if (location.pathname === "/inventory-management/callsheet") {
    return (
      <>
        <Box className="commonPageLayout">
          <div className="inventory__callsheet__summaryHeader">
            <Typography className="inventory__callsheet__summaryHeader__title">
              Color Summmary
            </Typography>
            <div className="inventory__callsheet__summaryHeader__redBox">
              <div className="inventory__callsheet__summaryHeader__redBox__red" />
              <Typography>1 - 10 Days</Typography>
            </div>
            <div className="inventory__callsheet__summaryHeader__orangeBox">
              <div className="inventory__callsheet__summaryHeader__orangeBox__orange" />
              <Typography>11 - 15 Days</Typography>
            </div>
            <div className="inventory__callsheet__summaryHeader__greenBox">
              <div className="inventory__callsheet__summaryHeader__greenBox__green" />
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
              mapData={data?.data}
              tableHeads={tableHeads}
              customOrderKeys={customOrderKeys}
              nestedProperty={nestedProperty}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              page={page}
              setPage={setPage}
              count={data?.totalCount}
              dateTimeArray={dateTimeArray}
              onView={onCallsheetOpen}
            />
          )}
        </Box>
        <CallsheetModal width={"50%"} open={isCallsheetOpen} onClose={onCallsheetClose} />
      </>
    );
  }
}

export default Callsheet;
