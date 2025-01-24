import {
  Box,
  Button,
  IconButton,
  Input,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import CommonTable from "../../../components/CommonTable";
import SearchDateRangeMixin from "../../../components/mixins/SearchDateRangeMixin";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CommonTableSkeleton from "../../../components/CommonTableSkeleton";
import moment from "moment";
import PageHeaderAdd from "../../../components/PageHeaderAdd";
import { useGetAllReturnsQuery } from "../../../features/inventory-management/api/returnApi";
import { Add, Remove, Settings } from "@mui/icons-material";
import useDisclosure from "../../../hooks/useDisclosure";
import CommonModal from "../../../components/CommonModal";
import PageHeaderAddTabs from "../../../components/PageHeaderAddTabs";

function Return() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tabViewing, setTabViewing] = useState(1);
  console.log(tabViewing);
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const {
    isOpen: isSettingsOpen,
    onOpen: onSettingsOpen,
    onClose: onSettingsClose,
  } = useDisclosure();

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [margin, setMargin] = useState(50);
  const [dateFrom, setDateFrom] = useState(moment().startOf("month"));
  const [dateTo, setDateTo] = useState(moment());

  const paymentNavigation = useMemo(
    () => [
      {
        case: 1,
        name: "Pending",
        transactionStatus: "Pending",
        // badge: notifications["receivableTransaction"],
      },
      {
        case: 2,
        name: "Received",
        transactionStatus: "Received",
        // badge: notifications["paidTransaction"],
      },
    ]
    // [notifications]
  );

  const tableHeads = [
    "ID",
    "Owner's Name",
    "Business Name",
    "Total Return Price",
    "Total Exchange Price",
    "Transaction Date",
  ];

  const customOrderKeys = [
    "returnId",
    "clientName",
    "businessName",
    "totalReturnPrice",
    "totalExchangePrice",
    "createdDate",
  ];

  const nestedProperty = {
    key: "businessAddress",
    nestedKeys: ["city", "province"],
  };

  const dateTimeArray = ["transactionDate"];

  const pesoArray = ["totalReturnPrice", "totalExchangePrice"];

  const { data, isFetching } = useGetAllReturnsQuery({
    Search: search,
    Page: page + 1,
    PageSize: rowsPerPage,
    DateFrom: dateFrom ? moment(dateFrom).format("YYYY-MM-DD") : "",
    DateTo: dateTo ? moment(dateTo).format("YYYY-MM-DD") : "",
    Status: paymentNavigation.find((item) => item.case === tabViewing)?.name,
  });

  // Functions
  const handleView = () => {
    navigate(
      `${selectedRowData?.returnId}?dateFrom=${moment(dateFrom).format(
        "YYYY-MM-DD"
      )}&dateTo=${moment(dateTo).format("YYYY-MM-DD")}`
    );
  };

  const handleReplace = () => {
    navigate(
      `${selectedRowData?.returnId}?replace=true&dateFrom=${moment(dateFrom).format(
        "YYYY-MM-DD"
      )}&dateTo=${moment(dateTo).format("YYYY-MM-DD")}`
    );
  }

  const handleAdd = () => {
    navigate(`return-form?dateFrom=${moment(dateFrom).format(
        "YYYY-MM-DD"
      )}&dateTo=${moment(dateTo).format("YYYY-MM-DD")}`);
  };

  if (location.pathname === "/inventory-management/return") {
    return (
      <Box className="commonPageLayout">
        <PageHeaderAddTabs
          pageTitle="Return"
          addTitle="Add Return"
          onOpen={handleAdd}
          tabsList={paymentNavigation}
          setTabViewing={setTabViewing}
          tabViewing={tabViewing}
          small
          removeArchive
          removeSearch
        >
          {/* <IconButton onClick={onSettingsOpen} size="small">
            <Settings />
          </IconButton> */}
        </PageHeaderAddTabs>

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
            mapData={data?.to}
            tableHeads={tableHeads}
            customOrderKeys={customOrderKeys}
            nestedProperty={nestedProperty}
            pesoArray={pesoArray}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            page={page}
            setPage={setPage}
            count={data?.totalCount}
            dateTimeArray={dateTimeArray}
            onReplace={handleReplace}
            onView={handleView}
          />
        )}
        <CommonModal
          open={isSettingsOpen}
          onClose={onSettingsClose}
          title="Settings"
          closeTopRight
          closeOnBackdropClick
          width={"400px"}
        >
          <Typography fontSize="1.2rem" fontWeight="600">
            Return Settings
          </Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <TextField
              type="number"
              onChange={(e) => setMargin(e.target.value)}
              size="small"
              label="Margin"
              fullWidth={true}
              value={margin}
            />
            <div
              style={{ display: "flex", justifyContent: "end", gap: "10px" }}
            >
              <Button onClick={onSettingsClose} variant="outlined">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setMargin(0);
                  onSettingsClose();
                }}
                variant="contained"
              >
                Save
              </Button>
            </div>
          </div>
        </CommonModal>
      </Box>
    );
  }

  return <Outlet />;
}

export default Return;
