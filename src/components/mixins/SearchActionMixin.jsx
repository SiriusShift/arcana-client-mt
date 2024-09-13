import { Box, TextField, debounce } from "@mui/material";
import SecondaryButton from "../SecondaryButton";
import CommonFilter from "../CommonFilter";
import { useSelector } from "react-redux";

function SearchActionMixin({
  setSearch,
  onFilter,
  clusterFilter,
  paymentMethodFilter,
  actionTitle,
  actionCallback,
  removeAction,
  disableAction,
}) {

  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  const userDetails = useSelector((state) => state.login.userDetails);

  return (
    // <Paper elevation={1}>
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
        {!removeAction && (
          <SecondaryButton
            size="medium"
            disabled={disableAction}
            onClick={actionCallback}
          >
            {actionTitle || "Action"}
          </SecondaryButton>
        )}
          {userDetails?.roleName === "Admin" || userDetails?.roleName === "Treasury" || userDetails?.roleName === "GAS" || userDetails?.roleName === "Finance" ? (<CommonFilter
          filter={onFilter}
          clusterFilter={clusterFilter && clusterFilter}
          paymentMethodFilter={paymentMethodFilter && paymentMethodFilter}
          // expenseTypeFilter={expenseTypeFilter && expenseTypeFilter}
          // businessTypeFilter={businessTypeFilter && businessTypeFilter}
          // invoiceTypeFilter={invoiceTypeFilter && invoiceTypeFilter}
          // validityFilter={validityFilter && validityFilter}
          // uploadStatusFilter={uploadStatusFilter && uploadStatusFilter}
          // frequenceFilter={frequenceFilter && frequenceFilter}
          // paymentChannelFilter={paymentChannelFilter && paymentChannelFilter}
          // statusFilter={statusFilter && statusFilter}
        />) : ""}
      </Box>
    </Box>
    // </Paper>
  );
}

export default SearchActionMixin;
