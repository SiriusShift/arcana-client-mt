import { Box, MenuItem, TextField } from "@mui/material";
import "../../assets/styles/common.styles.scss";
import SecondaryButton from "../SecondaryButton";
import CommonFilter from "../CommonFilter";
import { useSelector } from "react-redux";

function ButtonFilterMixin({
  onButtonClick,
  onFilter,
  clusterFilter,
  buttonIcon,
  buttonTitle,
  selectOptions,
  setSelectValue,
  removeFilter,
}) {
  const userDetails = useSelector((state) => state.login.userDetails);

  return (
    <Box className="mixin" sx={{ my: "-20px" }}>
      <Box className="mixin__left">
        <SecondaryButton
          variant="outlined"
          size="medium"
          onClick={onButtonClick}
          endIcon={buttonIcon && buttonIcon}
        >
          {buttonTitle ? buttonTitle : "Button"}
        </SecondaryButton>
      </Box>

      <Box className="mixin__right">
        {userDetails?.roleName === "Admin" || userDetails?.roleName === "Treasury" || userDetails?.roleName === "GAS" || userDetails?.roleName === "Finance" ? (<CommonFilter
          filter={onFilter}
          clusterFilter={clusterFilter && clusterFilter}
          // paymentMethodFilter={paymentMethodFilter && paymentMethodFilter}
          // expenseTypeFilter={expenseTypeFilter && expenseTypeFilter}
          // businessTypeFilter={businessTypeFilter && businessTypeFilter}
          // invoiceTypeFilter={invoiceTypeFilter && invoiceTypeFilter}
          // validityFilter={validityFilter && validityFilter}
          // uploadStatusFilter={uploadStatusFilter && uploadStatusFilter}
          // frequenceFilter={frequenceFilter && frequenceFilter}
          // paymentChannelFilter={paymentChannelFilter && paymentChannelFilter}
          // statusFilter={statusFilter && statusFilter}
        />) : ""}
        {!removeFilter && (
          <TextField
            sx={{ minWidth: "150px" }}
            size="small"
            label="Origin"
            defaultValue={selectOptions?.[0]?.value}
            select
            onChange={(e) => setSelectValue(e.target.value)}
          >
            {selectOptions?.map((item, i) => (
              <MenuItem key={i} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Box>
    </Box>
  );
}

export default ButtonFilterMixin;
