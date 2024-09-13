import { Box, Checkbox, TextField, Typography, debounce } from "@mui/material";
import SecondaryButton from "../SecondaryButton";
import { Add } from "@mui/icons-material";
import CommonFilter from "../CommonFilter";
import { useSelector } from "react-redux";

function AddVoidSearchMixin({
  addTitle,
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
  setStatus,
  status,
}) {
  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  const userDetails = useSelector((state) => state.login.userDetails);

  return (
    // <Paper elevation={1}>
    <Box className="mixin" sx={{ mt: "-20px" }}>
      <Box className="mixin__left">
        <SecondaryButton
          className="addRowButtons"
          onClick={onAddOpen}
          endIcon={<Add />}
        >
          Add {addTitle && addTitle}
        </SecondaryButton>
      </Box>

      <Box className="mixin__right">
        {(status === "Voided" || status === "Rejected") && (
          <>
            <Checkbox
              onChange={() => {
                status === "Voided"
                  ? setStatus("Rejected")
                  : setStatus("Voided");
              }}
              checked={status === "Voided"}
            />
            <Typography variant="subtitle2">Voided</Typography>
          </>
        )}
         {userDetails?.roleName === "Admin" || userDetails?.roleName === "Treasury" || userDetails?.roleName === "GAS" || userDetails?.roleName === "Finance" ? (<CommonFilter
          filter={onFilter}
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
        />) : ""}


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

export default AddVoidSearchMixin;
