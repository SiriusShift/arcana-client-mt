import { Box, TextField, debounce } from "@mui/material";
import SecondaryButton from "../SecondaryButton";
import { Add, Search } from "@mui/icons-material";
import CommonFilter from "../CommonFilter";
import { useSelector } from "react-redux";
import { useState } from "react";
import moment from "moment";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import _ from "lodash";

function AddSearchMixin({
  endIcon,
  title,
  transactionStatus,
  disableButton,
  addTitle,
  withDate,
  onAddOpen,
  onFilter,
  setSearch,
  clusterFilter,
  paymentMethodFilter,
  expenseTypeFilter,
  businessTypeFilter,
  invoiceTypeFilter,
  validityFilter,
  uploadStatusFilter,
  frequenceFilter,
  paymentChannelFilter,
  statusFilter,
  removeAdd,
  dateFrom,
  dateTo,
  setDateFrom,
  setDateTo,
  isDataFetching,
}) {
  const [dateFromTemp, setDateFromTemp] = useState(moment().startOf("month"));
  const [dateToTemp, setDateToTemp] = useState(moment());

  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  console.log(disableButton);

  const userDetails = useSelector((state) => state.login.userDetails);

  const handleSubmitDate = (e) => {
    e.preventDefault();
    setDateFrom(dateFromTemp);
    setDateTo(dateToTemp);
  };

  return (
    // <Paper elevation={1}>
    <Box className="mixin" sx={{ mt: "-20px" }}>
      {!removeAdd && (
        <Box className="mixin__left">
          {!disableButton && (
            <SecondaryButton
              className="addRowButtons"
              onClick={onAddOpen}
              endIcon={endIcon ? endIcon : <Add />}
            >
              {title ? title : `Add ${addTitle && addTitle}`}
            </SecondaryButton>
          )}
        </Box>
      )}
      {/* {withDate && (      <Box className="mixin__right" component="form" onSubmit={handleSubmitDate}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DatePicker
            label="Date From"
            value={dateFromTemp}
            onChange={setDateFromTemp}
            slotProps={{
              textField: {
                size: "small",
              },
              actionBar: {
                actions: ["today", "clear"],
              },
            }}
            sx={{ width: "200px" }}
            maxDate={dateToTemp}
          />
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DatePicker
            label="Date To"
            value={dateToTemp}
            onChange={setDateToTemp}
            slotProps={{
              textField: {
                size: "small",
              },
              actionBar: {
                actions: ["today", "clear"],
              },
            }}
            sx={{ width: "200px" }}
            minDate={dateFromTemp}
          />
        </LocalizationProvider>

        <SecondaryButton
          size="medium"
          type="submit"
          sx={{ ml: "10px", height: "100%" }}
          disabled={
            isDataFetching ||
            (_.isEqual(dateFrom, dateFromTemp) && _.isEqual(dateTo, dateToTemp))
          }
        >
          <Search />
        </SecondaryButton>
      </Box>)} */}


      <Box className="mixin__right">
        {userDetails?.roleName === "Admin" ||
        userDetails?.roleName === "Treasury" ||
        userDetails?.roleName === "GAS" ||
        userDetails?.roleName === "Finance" ||
        userDetails?.roleName === "Customer Registration Approver" ? (
          <CommonFilter
            filter={onFilter}
            transactionStatus={transactionStatus}
            clusterFilter={clusterFilter && clusterFilter}
            paymentMethodFilter={paymentMethodFilter && paymentMethodFilter}
            expenseTypeFilter={expenseTypeFilter && expenseTypeFilter}
            businessTypeFilter={businessTypeFilter && businessTypeFilter}
            invoiceTypeFilter={invoiceTypeFilter && invoiceTypeFilter}
            validityFilter={validityFilter && validityFilter}
            uploadStatusFilter={uploadStatusFilter && uploadStatusFilter}
            frequenceFilter={frequenceFilter && frequenceFilter}
            paymentChannelFilter={paymentChannelFilter && paymentChannelFilter}
            statusFilter={statusFilter && statusFilter}
          />
        ) : (
          ""
        )}
        <TextField
          type="search"
          size="small"
          label="Search"
          onChange={(e) => {
            debouncedSetSearch(e.target.value);
          }}
          autoComplete="off"
        />
      </Box>
    </Box>
    // </Paper>
  );
}

export default AddSearchMixin;
