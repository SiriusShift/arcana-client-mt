import { Box, TextField } from "@mui/material";
import { debounce } from "../../utils/CustomFunctions";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useState } from "react";
import SecondaryButton from "../SecondaryButton";
import { Search } from "@mui/icons-material";
import * as _ from "lodash";

const SearchDateRangeMixin = ({
  setSearch,
  setDateFrom,
  setDateTo,
  isDataFetching,
  dateFrom,
  dateTo,
}) => {
  const [dateFromTemp, setDateFromTemp] = useState(null);
  const [dateToTemp, setDateToTemp] = useState(null);

  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  const handleSubmitDate = (e) => {
    e.preventDefault();
    setDateFrom(dateFromTemp);
    setDateTo(dateToTemp);
  };

  return (
    <Box className="mixin" sx={{ my: "-20px" }}>
      <Box className="mixin__left">
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

      <Box
        className="mixin__right"
        component="form"
        onSubmit={handleSubmitDate}
      >
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
      </Box>
    </Box>
  );
  // </Paper>
};

export default SearchDateRangeMixin;
