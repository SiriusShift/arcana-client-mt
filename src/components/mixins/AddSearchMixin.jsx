import { Box, TextField, debounce } from "@mui/material";
import SecondaryButton from "../SecondaryButton";
import { Add } from "@mui/icons-material";
import CommonFilter from "../CommonFilter";


function AddSearchMixin({
  endIcon,
  title,
  PageNumber,
  PageSize,
  addTitle,
  onAddOpen,
  onFilter,
  setSearch,
  clusterFilter,
  paymentMethodFilter,
  expenseTypeFilter,
  businessType,
  invoiceTypeFilter,
  validityFilter,
  uploadStatusFilter,
  frequenceFilter,
  paymentTypeFilter,
  statusFilter,
}) {
  return (
    // <Paper elevation={1}>
    <Box className="mixin" sx={{ mt: "-20px" }}>
      <Box className="mixin__left">
        <SecondaryButton
          className="addRowButtons"
          onClick={onAddOpen}
          endIcon={endIcon ? endIcon : <Add />}
        >
          {title ? title : `Add ${addTitle && addTitle}`}
        </SecondaryButton>
      </Box>
      <Box className="mixin__right">
        <CommonFilter 
            setSearch = {setSearch} 
            filter = {onFilter}
            PageSize = {PageSize && PageSize}
            PageNumber = {PageNumber && PageNumber}
            clusterFilter = {clusterFilter && clusterFilter}
            paymentMethodFilter = {paymentMethodFilter && paymentMethodFilter}
            expenseTypeFilter = {expenseTypeFilter && expenseTypeFilter}
            businessType = {businessType && businessType}
            invoiceTypeFilter = {invoiceTypeFilter && invoiceTypeFilter}
            validityFilter = {validityFilter && validityFilter} 
            uploadStatusFilter = {uploadStatusFilter && uploadStatusFilter}
            frequenceFilter = {frequenceFilter && frequenceFilter}
            paymentTypeFilter = {paymentTypeFilter && paymentTypeFilter}
            statusFilter = {statusFilter && statusFilter}
        />
      </Box>
    </Box>
    // </Paper>
  );
}

export default AddSearchMixin;
