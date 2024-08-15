import { Controller, useForm } from "react-hook-form";
import CommonDrawer from "../../components/CommonDrawer";
import { approverSettingsUpdateSchema } from "../../schema/schema";
import { usePutUpdateApproversByRangeMutation } from "../../features/user-management/api/approverSettingsApi";
import { navigationData } from "../../navigation/navigationData";
import { TextField } from "@mui/material";
import ControlledAutocomplete from "../../components/ControlledAutocomplete";
import { useGetAllApproversQuery } from "../../features/user-management/api/approverApi";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import useSnackbar from "../../hooks/useSnackbar";
import { NumericFormat } from "react-number-format";

function ApproverSettingsEditDrawer({ open, onClose }) {
  const snackbar = useSnackbar();

  const approvalItem = navigationData.find((item) => item.name === "Approval");
  const approvalSettingsModules =
    approvalItem?.sub?.filter(
      (subItem) => subItem.name !== "Registration Approval"
    ) || [];
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const {
    handleSubmit,
    formState: { isValid, errors },
    register,
    control,
    watch,
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(approverSettingsUpdateSchema.schema),
    defaultValues: approverSettingsUpdateSchema.defaultValues,
  });

  const onSubmit = async (data) => {
    try {
      const { moduleName, userId, minValue, maxValue } = data;

      const body = {
        moduleName: moduleName.name,
        userId: userId.userId,
        minValue,
        maxValue,
      };

      await updateApproverSettings({
        id: selectedRowData?.id,
        body,
      }).unwrap();
      onClose();

      snackbar({
        variant: "success",
        message: "Approver settings updated successfully",
      });
    } catch (error) {
      console.log(error);
      snackbar({
        variant: "error",
        message: error?.data?.error?.message || error?.data,
      });
    }
  };

  const { data, isFetching } = useGetAllApproversQuery();
  const [updateApproverSettings, { isLoading: isUpdateLoading }] =
    usePutUpdateApproversByRangeMutation();

  useEffect(() => {
    if (open) {
      setValue(
        "moduleName",
        approvalSettingsModules.find(
          (item) => item.name === selectedRowData?.moduleName
        )
      );
      setValue(
        "userId",
        data?.find((approver) => approver.userId === selectedRowData?.userId)
      );
      setValue("minValue", selectedRowData?.minValue);
      setValue("maxValue", selectedRowData?.maxValue);
    } else {
      reset();
    }
  }, [open]);

  return (
    <CommonDrawer
      open={open}
      onClose={onClose}
      drawerHeader="Edit Approver Settings"
      onSubmit={handleSubmit(onSubmit)}
      disableSubmit={!isValid}
      isLoading={isUpdateLoading}
      width="400px"
    >
      <ControlledAutocomplete
        name={"moduleName"}
        control={control}
        options={approvalSettingsModules}
        getOptionLabel={(option) => option.name || ""}
        disableClearable
        isOptionEqualToValue={() => true}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            label="Module Name"
            helperText={errors?.userId?.message}
            error={errors?.userId}
          />
        )}
      />

      <ControlledAutocomplete
        name="userId"
        control={control}
        options={data || []}
        getOptionLabel={(option) => option.fullname || ""}
        disableClearable
        disabled={!watch("moduleName")}
        loading={isFetching}
        isOptionEqualToValue={() => true}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            label="Approver Name"
            helperText={errors?.userId?.message}
            error={errors?.userId}
          />
        )}
      />

      <Controller
        control={control}
        name="minValue"
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <NumericFormat
            label="Minimum Value"
            type="text"
            size="small"
            customInput={TextField}
            autoComplete="off"
            onValueChange={(e) => {
              onChange(Number(e.value));
            }}
            onBlur={onBlur}
            value={value || ""}
            inputRef={ref}
            thousandSeparator=","
            allowNegative={false}
            allowLeadingZeros={false}
            prefix={
              watch("moduleName")?.name === "Listing Fee Approval" ||
              watch("moduleName")?.name === "Other Expenses Approval"
                ? "₱"
                : ""
            }
            suffix={
              watch("moduleName")?.name === "Sp. Discount Approval" ? "%" : ""
            }
            disabled={!watch("moduleName")}
          />
        )}
      />

      <Controller
        control={control}
        name="maxValue"
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <NumericFormat
            label="Maximum Value"
            type="text"
            size="small"
            customInput={TextField}
            autoComplete="off"
            onValueChange={(e) => {
              onChange(Number(e.value));
            }}
            onBlur={onBlur}
            value={value || ""}
            inputRef={ref}
            thousandSeparator=","
            allowNegative={false}
            allowLeadingZeros={false}
            prefix={
              watch("moduleName")?.name === "Listing Fee Approval" ||
              watch("moduleName")?.name === "Other Expenses Approval"
                ? "₱"
                : ""
            }
            suffix={
              watch("moduleName")?.name === "Sp. Discount Approval" ? "%" : ""
            }
            min={watch("minValue") || 0}
            disabled={!watch("moduleName")}
          />
        )}
      />
    </CommonDrawer>
  );
}

export default ApproverSettingsEditDrawer;
