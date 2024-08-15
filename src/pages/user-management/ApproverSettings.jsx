import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import CommonDrawer from "../../components/CommonDrawer";
import useDisclosure from "../../hooks/useDisclosure";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { approverSettingsSchema } from "../../schema/schema";
import { useSelector } from "react-redux";
import ControlledAutocomplete from "../../components/ControlledAutocomplete";
import {
  Add,
  KeyboardArrowDown,
  KeyboardArrowUp,
  RemoveCircleOutline,
  Settings,
} from "@mui/icons-material";
import { useGetAllApproversQuery } from "../../features/user-management/api/approverApi";
import SecondaryButton from "../../components/SecondaryButton";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { navigationData } from "../../navigation/navigationData";
import useSnackbar from "../../hooks/useSnackbar";
import { handleCatchErrorMessage } from "../../utils/CustomFunctions";
import {
  useLazyGetApproversByRangeQuery,
  useUpdateApproversByRangeMutation,
} from "../../features/user-management/api/approverSettingsApi";
import { NumericFormat } from "react-number-format";

function Approver() {
  const [status, setStatus] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [withLimit, setWithLimit] = useState(true);

  //Hooks
  const snackbar = useSnackbar();
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  // Drawer Disclosures
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  // Constants
  const tableHeads = ["Module Name"];
  const customOrderKeys = ["name"];

  const approvalItem = navigationData.find((item) => item.name === "Approval");

  const isRegistrationApproval =
    selectedRowData?.name === "Registration Approval";

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    reset,
    control,
    watch,
  } = useForm({
    resolver: yupResolver(approverSettingsSchema.schema),
    mode: "onChange",
    defaultValues: approverSettingsSchema.defaultValues,
  });

  const {
    fields: approverFields,
    append: approverAppend,
    remove: approverRemove,
    swap: approverSwap,
  } = useFieldArray({
    control,
    name: "approvers",
  });

  const {
    fields: approverWithLimitFields,
    append: approverWithLimitAppend,
    remove: approverWithLimitRemove,
    swap: approverWithLimitSwap,
    update: approverWithLimitUpdate,
  } = useFieldArray({
    control,
    name: "approversWithLimit",
  });

  const [parent] = useAutoAnimate();

  //RTK Query
  const { data, isLoading } = useGetAllApproversQuery();

  const [
    triggerApprovers,
    { data: approversByRangeData, isFetching: isApproverByRangeFetching },
  ] = useLazyGetApproversByRangeQuery();
  const [updateApprovers, { isLoading: isUpdateLoading }] =
    useUpdateApproversByRangeMutation();

  //Drawer Functions
  const onSubmit = async (values) => {
    const approvers = values.approvers.map((item) => ({
      userId: item.userId.userId,
      minValue: null,
      // maxValue: item.maxValue,
      level: item.level,
    }));

    const approversWithLimit = values.approversWithLimit.map((item) => ({
      userId: item.userId.userId,
      minValue: item.minValue,
      // maxValue: item.maxValue,
      level: item.level + values.approvers.length,
    }));

    const combinedApprovers = [...approvers, ...approversWithLimit];

    try {
      await updateApprovers({
        params: { moduleName: values.moduleName.name },
        body: { approvers: combinedApprovers },
      });

      snackbar({
        variant: "success",
        message: "Approver settings updated successfully",
      });
      handleDrawerClose();
    } catch (error) {
      snackbar({ variant: "error", message: handleCatchErrorMessage(error) });
    }
  };

  const handleEditOpen = () => {
    onDrawerOpen();
  };

  const handleSwapApprover = (indexA, indexB) => {
    // Get the current values of the items at indexA and indexB
    const itemA = watch(`approvers[${indexA}]`);
    const itemB = watch(`approvers[${indexB}]`);

    // Update only the level property between items at indexA and indexB
    const updatedItemA = { ...itemB, level: itemA.level };
    const updatedItemB = { ...itemA, level: itemB.level };

    // Swap the items in the array
    approverSwap(indexA, indexB);

    // // Use update to update the specific items in the array
    setValue(`approvers[${indexA}]`, updatedItemA);
    setValue(`approvers[${indexB}]`, updatedItemB);
  };

  const handleSwapApproverWithLimit = (indexA, indexB) => {
    // Get the current values of the items at indexA and indexB
    const itemA = watch(`approversWithLimit[${indexA}]`);
    const itemB = watch(`approversWithLimit[${indexB}]`);

    // // Update only the userId property between items at indexA and indexB
    const updatedItemA = { ...itemA, userId: itemB.userId };
    const updatedItemB = { ...itemB, userId: itemA.userId };

    // Use update to update the specific items in the array
    // setValue(`approversWithLimit[${indexA}]`, updatedItemA);
    // setValue(`approversWithLimit[${indexB}]`, updatedItemB);
    approverWithLimitUpdate(indexA, updatedItemA);
    approverWithLimitUpdate(indexB, updatedItemB);

    // Swap the items in the array
    // approverWithLimitSwap(indexA, indexB);
  };

  const handleDrawerClose = () => {
    reset();
    onDrawerClose();
    setWithLimit(true);
  };

  useEffect(() => {
    if (isDrawerOpen) {
      setValue("moduleName", selectedRowData);
      triggerApprovers(
        {
          moduleName: selectedRowData?.name,
        },
        {
          preferCacheValue: true,
        }
      );

      if (isRegistrationApproval) {
        setWithLimit(false);
      }
    }
  }, [
    isDrawerOpen,
    selectedRowData,
    triggerApprovers,
    setValue,
    isRegistrationApproval,
  ]);

  useEffect(() => {
    if (approversByRangeData) {
      const approvers = approversByRangeData?.approvers;

      // Assuming approvers is an array of objects
      const [withMinValue, withoutMinValue] = approvers.reduce(
        (acc, approver) => {
          // Check if the approver has a minValue that is not null or undefined
          if (approver.minValue != null) {
            acc[0].push({
              userId: data?.find((user) => user.userId === approver.userId),
              level: approver.level,
              minValue: approver.minValue,
            }); // Add to the first array if minValue exists
          } else {
            acc[1].push({
              userId: data?.find((user) => user.userId === approver.userId),
              level: approver.level,
              minValue: null,
            }); // Add to the second array if minValue is null or undefined
          }
          return acc?.sort((a, b) => a.level - b.level);
        },
        [[], []]
      ); // Initial accumulator is two empty arrays

      const transformedWithMinValue = withMinValue.map((item, index) => ({
        ...item,
        level: index + 1,
      }));

      setValue("approvers", withoutMinValue);
      setValue("approversWithLimit", transformedWithMinValue);
    }
  }, [approversByRangeData, data, selectedRowData, setValue]);

  return (
    <Box className="commonPageLayout">
      <PageHeaderAdd
        pageTitle={
          <>
            Approver Settings
            <Settings />
          </>
        }
        setStatus={setStatus}
        removeArchive
        removeSearch
        removeAdd
      />

      <CommonTable
        evenLesserCompact
        mapData={approvalItem?.sub}
        customOrderKeys={customOrderKeys}
        tableHeads={tableHeads}
        onManageApprovers={handleEditOpen}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        count={approvalItem?.sub?.length}
        status={status}
      />

      <CommonDrawer
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        drawerHeader="Approver Settings"
        onSubmit={handleSubmit(onSubmit)}
        disableSubmit={!isValid}
        width="1000px"
        isLoading={isUpdateLoading}
        isFetching={isApproverByRangeFetching}
      >
        <Typography sx={{ fontWeight: "bold", fontSize: "20px" }}>
          Module Name
        </Typography>

        <ControlledAutocomplete
          name={"moduleName"}
          control={control}
          options={approvalItem?.sub || []}
          getOptionLabel={(option) => option.name || ""}
          disableClearable
          loading={isLoading}
          isOptionEqualToValue={() => true}
          disabled
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label="Module Name"
              helperText={errors?.moduleName?.message}
              error={errors?.moduleName}
            />
          )}
        />

        <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Typography sx={{ fontWeight: "bold", fontSize: "20px" }}>
            List of Approvers
          </Typography>

          <Box
            sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
            ref={parent}
          >
            {approverFields.map((item, index) => (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <ControlledAutocomplete
                  name={`approvers[${index}].userId`}
                  control={control}
                  options={data || []}
                  getOptionLabel={(option) => option.fullname || ""}
                  getOptionDisabled={(option) => {
                    const approversWithLimit = watch("approversWithLimit");
                    const approvers = watch("approvers");

                    const checkApprover =
                      approversWithLimit?.some(
                        (item) => item?.userId?.userId === option.userId
                      ) ||
                      approvers?.some(
                        (item) => item?.userId?.userId === option.userId
                      );
                    return checkApprover;
                  }}
                  sx={{ flex: 1 }}
                  disableClearable
                  disabled={!watch("moduleName")}
                  loading={isLoading}
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

                {/* {!isRegistrationApproval && (
                  <>
                    <Controller
                      control={control}
                      name={`approvers[${index}].minValue`}
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
                            watch("moduleName")?.name ===
                              "Listing Fee Approval" ||
                            watch("moduleName")?.name ===
                              "Other Expenses Approval"
                              ? "₱"
                              : ""
                          }
                          suffix={
                            watch("moduleName")?.name ===
                            "Sp. Discount Approval"
                              ? "%"
                              : ""
                          }
                          sx={{ width: "180px" }}
                          disabled
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name={`approvers[${index}].maxValue`}
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
                            watch("moduleName")?.name ===
                              "Listing Fee Approval" ||
                            watch("moduleName")?.name ===
                              "Other Expenses Approval"
                              ? "₱"
                              : ""
                          }
                          suffix={
                            watch("moduleName")?.name ===
                            "Sp. Discount Approval"
                              ? "%"
                              : ""
                          }
                          min={watch(`approvers[${index}].minValue`) || 0}
                          sx={{ width: "180px" }}
                          disabled={
                            !watch("moduleName") ||
                            index !== watch("approvers").length - 1
                          }
                        />
                      )}
                    />
                  </>
                )} */}

                <IconButton
                  sx={{ color: "secondary.main" }}
                  // onClick={() => {
                  //   setValue(`approvers[${index}].level`, index);
                  //   setValue(`approvers[${index - 1}].level`, index + 1);
                  //   approverSwap(index, index - 1);
                  // }}
                  onClick={() => handleSwapApprover(index - 1, index)}
                  disabled={index === 0}
                >
                  <KeyboardArrowUp sx={{ fontSize: "30px" }} />
                </IconButton>

                <IconButton
                  sx={{ color: "secondary.main" }}
                  // onClick={() => {
                  //   setValue(`approvers[${index}].level`, index + 2);
                  //   setValue(`approvers[${index + 1}].level`, index + 1);
                  //   approverSwap(index, index + 1);
                  // }}
                  onClick={() => handleSwapApprover(index, index + 1)}
                  disabled={index === approverFields.length - 1}
                >
                  <KeyboardArrowDown sx={{ fontSize: "30px" }} />
                </IconButton>

                <IconButton
                  sx={{ color: "error.main" }}
                  onClick={() => approverRemove(index)}
                  // disabled={index !== approverFields.length - 1}
                >
                  <RemoveCircleOutline sx={{ fontSize: "30px" }} />
                </IconButton>
              </Box>
            ))}

            {approverWithLimitFields.map((item, index) => (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <ControlledAutocomplete
                  name={`approversWithLimit[${index}].userId`}
                  control={control}
                  options={data || []}
                  getOptionLabel={(option) => option.fullname || ""}
                  getOptionDisabled={(option) => {
                    const approversWithLimit = watch("approversWithLimit");
                    const approvers = watch("approvers");

                    const checkApprover =
                      approversWithLimit?.some(
                        (item) => item?.userId?.userId === option.userId
                      ) ||
                      approvers?.some(
                        (item) => item?.userId?.userId === option.userId
                      );
                    return checkApprover;
                  }}
                  sx={{ flex: 1 }}
                  disableClearable
                  disabled={!watch("moduleName")}
                  loading={isLoading}
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

                {!isRegistrationApproval && (
                  <Controller
                    control={control}
                    name={`approversWithLimit[${index}].minValue`}
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
                          watch("moduleName")?.name ===
                            "Listing Fee Approval" ||
                          watch("moduleName")?.name ===
                            "Other Expenses Approval"
                            ? "₱"
                            : ""
                        }
                        suffix={
                          watch("moduleName")?.name === "Sp. Discount Approval"
                            ? "%"
                            : ""
                        }
                        sx={{ width: "180px" }}
                      />
                    )}
                  />
                )}

                <IconButton
                  sx={{ color: "secondary.main" }}
                  onClick={() => handleSwapApproverWithLimit(index - 1, index)}
                  disabled={index === 0}
                >
                  <KeyboardArrowUp sx={{ fontSize: "30px" }} />
                </IconButton>

                <IconButton
                  sx={{ color: "secondary.main" }}
                  // onClick={() => {
                  //   setValue(`approvers[${index}].level`, index + 2);
                  //   setValue(`approvers[${index + 1}].level`, index + 1);
                  //   approverSwap(index, index + 1);
                  // }}
                  onClick={() => handleSwapApproverWithLimit(index, index + 1)}
                  disabled={index === approverWithLimitFields.length - 1}
                >
                  <KeyboardArrowDown sx={{ fontSize: "30px" }} />
                </IconButton>

                <IconButton
                  sx={{ color: "error.main" }}
                  onClick={() => approverWithLimitRemove(index)}
                >
                  <RemoveCircleOutline sx={{ fontSize: "30px" }} />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>

        <Stack direction="row" spacing={1}>
          <SecondaryButton
            sx={{ width: "150px" }}
            onClick={() => {
              if (withLimit) {
                approverWithLimitAppend({
                  userId: null,
                  minValue: null,
                  level: approverWithLimitFields.length + 1,
                });
              } else {
                approverAppend({
                  userId: null,
                  minValue: null,
                  level: approverFields.length + 1,
                });
              }
            }}
            disabled={
              !isValid &&
              (approverFields.length > 0 || approverWithLimitFields.length > 0)
            }
            endIcon={<Add />}
          >
            Add Approver
          </SecondaryButton>

          {!isRegistrationApproval && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={!withLimit}
                  onChange={(e) => setWithLimit(!e.target.checked)}
                />
              }
              label="No Limit"
            />
          )}
        </Stack>
      </CommonDrawer>
    </Box>
  );
}

export default Approver;
