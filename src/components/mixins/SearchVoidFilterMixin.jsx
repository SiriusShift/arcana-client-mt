import {
  Box,
  Checkbox,
  TextField,
  Typography,
  debounce
} from "@mui/material";
import { useSelector } from "react-redux";
import CommonFilter from "../CommonFilter";

function SearchVoidFilterMixin({
  status,
  setStatus,
  onFilter,
  setSearch,
  clusterFilter,
  paymentMethodFilter,
  expenseTypeFilter,
  distriTypeFilter,
  invoiceTypeFilter,
  validityFilter,
  uploadStatusFilter,
  frequenceFilter,
  paymentChannelFilter,
  statusFilter,
  selectOptions,
  children,
  setSelectValue,
}) {
  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  const userDetails = useSelector((state) => state.login.userDetails);


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

      <Box className="mixin__right">
        {children}
        {(status === "Voided" || status === "Rejected") && (
          <>
            <Checkbox
              onChange={() => {
                status === "Voided"
                  ? setStatus("Rejected")
                  : setStatus("Voided");
              }}
            />
            <Typography variant="subtitle2">Voided</Typography>
          </>
        )}
        {userDetails?.roleName === "Admin" || userDetails?.roleName === "Treasury" || userDetails?.roleName === "GAS" || userDetails?.roleName === "Finance" ? (<CommonFilter
          filter={onFilter}
          clusterFilter={clusterFilter && clusterFilter}
          paymentMethodFilter={paymentMethodFilter && paymentMethodFilter}
          expenseTypeFilter={expenseTypeFilter && expenseTypeFilter}
          distriTypeFilter={distriTypeFilter && distriTypeFilter}
          invoiceTypeFilter={invoiceTypeFilter && invoiceTypeFilter}
          validityFilter={validityFilter && validityFilter}
          uploadStatusFilter={uploadStatusFilter && uploadStatusFilter}
          frequenceFilter={frequenceFilter && frequenceFilter}
          paymentChannelFilter={paymentChannelFilter && paymentChannelFilter}
          statusFilter={statusFilter && statusFilter}
        />) : ""}

        {/* <TextField
          sx={{ width: "150px" }}
          size="small"
          label="Origin"
          defaultValue={selectOptions?.[0]?.value}
          select
          onChange={(e) => setSelectValue(e.target.value)}
        >
          {selectOptions.map((item, i) => (
            <MenuItem key={i} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </TextField> */}
      </Box>
    </Box>
  );
}

export default SearchVoidFilterMixin;
