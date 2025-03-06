import { Box, Typography } from "@mui/material";
import { useState } from "react";
import CommonTable from "../../../components/CommonTable";
import SearchDateRangeMixin from "../../../components/mixins/SearchDateRangeMixin";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CommonTableSkeleton from "../../../components/CommonTableSkeleton";
import moment from "moment";
import { useGetAllFreebieRequestsQuery } from "../../../features/inventory-management/api/freebiesApi";
import PageHeaderFilterAdd from "../../../components/PageHeaderFilterAdd";
import "../../../assets/styles/inventory.styles.scss";
import { useGetAllCallsheetsQuery } from "../../../features/inventory-management/api/callsheetApi";
import CallsheetModal from "../../../components/modals/inventory-management/Callsheet/CallsheetModal";
import useDisclosure from "../../../hooks/useDisclosure";
import { transform } from "lodash";

function Callsheet() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedRowData = useSelector((state) => state.selectedRow?.value);

  const {
    onOpen: onCallsheetOpen,
    onClose: onCallsheetClose,
    isOpen: isCallsheetOpen,
  } = useDisclosure();

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState(moment().startOf("month"));
  const [dateTo, setDateTo] = useState(moment());

  const { data, isFetching } = useGetAllCallsheetsQuery({
    DateFrom: dateFrom ? moment(dateFrom).format("YYYY-MM-DD") : "",
    DateTo: dateTo ? moment(dateTo).format("YYYY-MM-DD") : "",
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  }, {refetchOnMountOrArgChange: true});

  console.log(data);
  const disableActions = ["view"];
  const checkIsDisabled = (date) => {
    const isDisabled = moment().isBefore(moment(date).add(1, "days"));
    console.log("checking disabled",isDisabled);
      // && totalAmount - balance === 0;
    return isDisabled;
  };


  const transformedData = data?.to?.map(({ red, orange, green, gray, ...item }) => ({
    ...item,
    expirationDate: red || orange || green || gray ? { gray, red, orange, green  } : {},
  }));

  const tableHeads = [
    "ID",
    "Customer Name",
    "Business Name",
    "Callsheet Date",
    "Expiration date",
  ];

  const customOrderKeys = [
    "clientId",
    "customerName",
    "businessName",
    "callSheetDate",
    "expirationDate",
  ];

  const nestedProperty = {
    key: "expirationDate",
    nestedKeys: ["gray", "red", "orange", "green", ],
  };

  const dateTimeArray = ["callSheetDate"];

  if (location.pathname === "/inventory-management/callsheet") {
    return (
      <>
        <Box className="commonPageLayout">
          <div className="inventory__callsheet__summaryHeader">
            <Typography className="inventory__callsheet__summaryHeader__title">
              Color Summmary
            </Typography>
            <div className="inventory__callsheet__summaryHeader__greyBox">
              <div className="inventory__callsheet__summaryHeader__greyBox__grey" />
              <Typography>Expired</Typography>
            </div>
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
          <PageHeaderFilterAdd
            pageTitle="Callsheet"
            setSearch={setSearch}
            removeArchive
            removeFilter
            // tabsList={tabs}
            // tabViewing={tabViewing}
            // setTabViewing={setTabViewing}
            // wide
            removeAdd
            // addTitle="Add Freebie Request"
            // onOpen={handleAdd}
          />

          <SearchDateRangeMixin
            setDateFrom={setDateFrom}
            setDateTo={setDateTo}
            dateFrom={dateFrom}
            dateTo={dateTo}
            removeSearch
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
              moreCompact
              mapData={transformedData}
              tableHeads={tableHeads}
              customOrderKeys={customOrderKeys}
              disableActions={
                checkIsDisabled && disableActions
              }
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
        <CallsheetModal
          width={"1250px"}
          dateFrom={dateFrom}
          dateTo={dateTo}
          open={isCallsheetOpen}
          onClose={onCallsheetClose}
        />
      </>
    );
  }
}

export default Callsheet;
