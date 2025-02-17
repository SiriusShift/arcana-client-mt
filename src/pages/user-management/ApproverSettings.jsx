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
import SessionExpired from "../SessionExpired";

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

  console.log(errors);

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

  const {
    fields: approverWithLimitDigitFields,
    append: approverWithLimitDigitAppend,
    remove: approverWithLimitDigitRemove,
    swap: approverWithLimitDigitSwap,
    update: approverWithLimitDigitUpdate,
  } = useFieldArray({
    control,
    name: "approversWithLimitDigit",
  });

  console.log(watch());
  console.log("errors: ", errors, isValid);

  const [parent] = useAutoAnimate();

  //RTK Query
  const { data, isLoading, error } = useGetAllApproversQuery({
    refetchOnMountOrArgChange: true,
  });


  let [
    triggerApprovers,
    { data: approversByRangeData, isFetching: isApproverByRangeFetching },
  ] = useLazyGetApproversByRangeQuery({
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    approversByRangeData = {
      approvers:
        approversByRangeData?.approvers
          ?.slice()
          .sort((a, b) => a.level - b.level) || [],
    };
  }, [approversByRangeData]);


  console.log(data, approversByRangeData);

  const [updateApprovers, { isLoading: isUpdateLoading }] =
    useUpdateApproversByRangeMutation();

  //Drawer Functions
  const onSubmit = async (values) => {
    console.log("test", values);
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

    const approversWithLimitDigit = values.approversWithLimitDigit.map(
      (item) => ({
        userId: item.userId.userId,
        minValue: item.minValue,
        // maxValue: item.maxValue,
        level:
          item.level +
          values.approvers.length +
          values.approversWithLimit.length,
      })
    );

    const combinedApprovers = [
      ...approvers,
      ...approversWithLimit,
      ...approversWithLimitDigit,
    ];

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
    console.log("hello");
    // Get the current values of the items at indexA and indexB
    const itemA = watch(
      watch("moduleName")?.name === "Sp. Discount Approval"
        ? `approversWithLimit[${indexA}]`
        : `approversWithLimitDigit[${indexA}]`
    );
    const itemB = watch(
      watch("moduleName")?.name === "Sp. Discount Approval"
        ? `approversWithLimit[${indexB}]`
        : `approversWithLimitDigit[${indexB}]`
    );

    // // Update only the userId property between items at indexA and indexB
    const updatedItemA = { ...itemB, level: itemA.level };
    const updatedItemB = { ...itemA, level: itemB.level };

    console.log(updatedItemA, updatedItemB);

    // Use update to update the specific items in the array
    // setValue(`approversWithLimit[${indexA}]`, updatedItemA);
    // setValue(`approversWithLimit[${indexB}]`, updatedItemB);
    watch("moduleName")?.name === "Sp. Discount Approval"
      ? approverWithLimitUpdate(indexA, updatedItemA)
      : approverWithLimitDigitUpdate(indexA, updatedItemA);
    watch("moduleName")?.name === "Sp. Discount Approval"
      ? approverWithLimitUpdate(indexB, updatedItemB)
      : approverWithLimitDigitUpdate(indexB, updatedItemB);

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
      console.log("test",approvers);

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

      console.log(transformedWithMinValue);

      setValue("approvers", withoutMinValue);
      if (watch("moduleName")?.name === "Sp. Discount Approval") {
        setValue("approversWithLimit", transformedWithMinValue);
      } else {
        setValue("approversWithLimitDigit", transformedWithMinValue);
      }
    }
  }, [approversByRangeData, data, selectedRowData, setValue]);

  return (
    <>
      {error && <SessionExpired />}
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
                      const approversWithLimitDigit = watch(
                        "approversWithLimitDigit"
                      );

                      const checkApprover =
                        approversWithLimit?.some(
                          (item) => item?.userId?.userId === option.userId
                        ) ||
                        approvers?.some(
                          (item) => item?.userId?.userId === option.userId
                        );
                      approversWithLimitDigit?.some(
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

              {(watch("moduleName")?.name === "Sp. Discount Approval"
                ? approverWithLimitFields
                : approverWithLimitDigitFields
              ).map((item, index) => (
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
                    name={
                      watch("moduleName")?.name === "Sp. Discount Approval"
                        ? `approversWithLimit[${index}].userId`
                        : `approversWithLimitDigit[${index}].userId`
                    }
                    control={control}
                    options={data || []}
                    getOptionLabel={(option) => option.fullname || ""}
                    getOptionDisabled={(option) => {
                      const approversWithLimit = watch("approversWithLimit");
                      const approversWithLimitDigit = watch(
                        "approversWithLimitDigit"
                      );
                      const approvers = watch("approvers");
                      console.log(approversWithLimit, option);

                      const checkApprover =
                        approversWithLimit?.some(
                          (item) => item?.userId === option.userId
                        ) ||
                        approvers?.some(
                          (item) => item?.userId === option.userId
                        );
                      approversWithLimitDigit?.some(
                        (item) => item?.userId === option.userId
                      );
                      return checkApprover;
                    }}
                    sx={{ flex: 1 }}
                    disableClearable
                    disabled={!watch("moduleName")}
                    loading={isLoading}
                    isOptionEqualToValue={(option, value) =>
                      option.userId === value?.userId
                    } // Compare userId properly
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        label="Approver Name"
                        helperText={errors?.userId?.message}
                        error={Boolean(errors?.userId)}
                      />
                    )}
                    // onChange={(_, newValue) => {
                    //   if (newValue) {
                    //     setValue(
                    //       `approversWithLimit[${index}].userId`,
                    //       newValue.userId
                    //     );
                    //   } else {
                    //     setValue(
                    //       `approversWithLimit[${index}].userId`,
                    //       null
                    //     );
                    //   }
                    // }}
                  />

                  {!isRegistrationApproval && (
                    <Controller
                      control={control}
                      name={
                        watch("moduleName")?.name === "Sp. Discount Approval"
                          ? `approversWithLimit[${index}].minValue`
                          : `approversWithLimitDigit[${index}].minValue`
                      }
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <NumericFormat
                          label="Minimum Value"
                          type="text"
                          size="small"
                          customInput={TextField}
                          autoComplete="off"
                          onValueChange={(e) => {
                            onChange(parseInt(e.value));
                          }}
                          isAllowed={(e) => {
                            if(watch("moduleName")?.name === "Sp. Discount Approval"){
                              if(e.value > 100){
                                snackbar({message: "Maximum value is 100%", variant: "error"})
                                return false
                              }
                            }
                            return true
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
                        />
                      )}
                    />
                  )}

                  <IconButton
                    sx={{ color: "secondary.main" }}
                    onClick={() =>
                      handleSwapApproverWithLimit(index - 1, index)
                    }
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
                    onClick={() =>
                      handleSwapApproverWithLimit(index, index + 1)
                    }
                    disabled={
                      watch("moduleName")?.name === "Sp. Discount Approval"
                        ? index === approverWithLimitFields.length - 1
                        : index === approverWithLimitDigitFields.length - 1
                    }
                  >
                    <KeyboardArrowDown sx={{ fontSize: "30px" }} />
                  </IconButton>

                  <IconButton
                    sx={{ color: "error.main" }}
                    onClick={() => {
                      if (
                        watch("moduleName")?.name === "Sp. Discount Approval"
                      ) {
                        approverWithLimitRemove(index);
                      } else {
                        approverWithLimitDigitRemove(index);
                      }
                    }}
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
                  if (watch("moduleName")?.name === "Sp. Discount Approval") {
                    approverWithLimitAppend({
                      userId: null,
                      minValue: null,
                      level: approverWithLimitFields.length + 1,
                    });
                  } else {
                    approverWithLimitDigitAppend({
                      userId: null,
                      minValue: null,
                      level: approverWithLimitDigitAppend.length + 1,
                    });
                  }
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
                !errors &&
                (approverFields.length > 0 ||
                  approverWithLimitFields.length > 0 ||
                  approverWithLimitFields.length > 0)
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
    </>
  );
}

export default Approver;
