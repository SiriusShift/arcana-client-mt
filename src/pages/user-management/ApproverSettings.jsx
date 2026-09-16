import { useAutoAnimate } from "@formkit/auto-animate/react";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Settings
} from "@mui/icons-material";
import {
  Box,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import CommonDrawer from "../../components/CommonDrawer";
import CommonTable from "../../components/CommonTable";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import ControlledAutocomplete from "../../components/ControlledAutocomplete";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import { useGetTerritoryQuery } from "../../features/setup/api/territoryApi";
import { useGetApproverModulesQuery, useLazyGetApproverModuleCandidatesQuery, useLazyGetApproversOfModuleQuery, useUpdateApproversOfExpensesMutation, useUpdateApproversOfModuleMutation } from "../../features/user-management/api/approverApi";
import useDisclosure from "../../hooks/useDisclosure";
import useSnackbar from "../../hooks/useSnackbar";
import { navigationData } from "../../navigation/navigationData";
import { approverSettingsSchema } from "../../schema/schema";
import { handleCatchErrorMessage } from "../../utils/CustomFunctions";

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

  const isItemApproval =
    selectedRowData?.name === "Add Item Approval";

  const isClientEditApproval = selectedRowData?.name === "Edit Client Approval";

  const isOtherExpenses = selectedRowData?.name === "Other Expenses Approval";

  const isSalesTransactionApproval =
    selectedRowData?.name === "Transaction Approval";
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

  console.log(errors)

  const {
    fields: approverFields,
    append: approverAppend,
    remove: approverRemove,
    swap: approverSwap,
  } = useFieldArray({
    control,
    name: "approvers",
  });

  console.log(approverFields)

  const {
    fields: approverWithTerritoryFields,
    append: approverWithTerritoryAppend,
    remove: approverWithTerritoryRemove,
    swap: approverWithTerritorySwap,
  } = useFieldArray({
    control,
    name: "approversWithTerritory",
  });

  const {
    fields: approverWithLimitFields,
    append: approverWithLimitAppend,
    remove: approverWithLimitRemove,
    swap: approverWithLimitSwap,
  } = useFieldArray({
    control,
    name: "approversWithLimit",
  });

  const {
    fields: approverWithLimitDigitFields,
    append: approverWithLimitDigitAppend,
    remove: approverWithLimitDigitRemove,
    swap: approverWithLimitDigitSwap,
  } = useFieldArray({
    control,
    name: "approversWithLimitDigit",
  });

  const [parent] = useAutoAnimate();

  const {
    data: modules, isLoading: modulesLoading
  } = useGetApproverModulesQuery();

  console.log(watch())
  const [triggerCandidates, { data: moduleApprovers, isLoading: moduleApproversLoading }] = useLazyGetApproverModuleCandidatesQuery()
  const [triggerApprovers, { data: approverModule, isLoading: approverModuleLoading }] = useLazyGetApproversOfModuleQuery()
  const [updateApprovers, { isLoading: approversUpdating }] = useUpdateApproversOfModuleMutation();
  const [updateOtherExpenseApprovers, { isLoading: otherExpenseApproversUpdating }] = useUpdateApproversOfExpensesMutation();

  console.log(approverModule)
  const { data: territoryData, isFetching: isTerritoryFetching } = useGetTerritoryQuery({
    Status: true,
    Page: 1,
    PageSize: 1000,
  })


  const handleEditOpen = () => {
    onDrawerOpen();
  };

  const handleDrawerClose = () => {
    reset();
    onDrawerClose();
    setWithLimit(true);
  };

  //Drawer Functions
  const onSubmit = async (values) => {
    console.log("submit values", values);

    try {
      if (isOtherExpenses) {
        await updateOtherExpenseApprovers({
          moduleName: selectedRowData?.key,
          body: {
            approvers: {
              heads: values.approversWithTerritory.map((item) => ({
                userId: item.userId?.userId,
                territoryId: item.territory?.id,
              })),
              managers: values.approvers.map((item) => ({
                userId: item.userId?.userId,
                territoryId: null,
              })),
            }
          },
        }).unwrap();
      } else {
        await updateApprovers({
          moduleName: selectedRowData?.key,
          body: {
            approvers: (isClientEditApproval || isSalesTransactionApproval)
              ? values.approvers.map((item) => ({
                userId: item.userId?.userId,
              }))
              : values.approversWithTerritory.map((item) => ({
                userId: item.userId?.userId,
                territoryId: item.territory?.id,
              })),
          },
        }).unwrap();
      }

      handleDrawerClose();

      snackbar({
        variant: "success",
        message: "Successfully updated approvers",
      });
    } catch (err) {
      console.error(err);

      snackbar({
        variant: "error",
        message: handleCatchErrorMessage(err),
      });
    }
  };

  useEffect(() => {
    if (isDrawerOpen) {
      setValue("moduleName", selectedRowData);
      triggerCandidates(
        {
          moduleName: selectedRowData?.key,
        },
        {
          preferCacheValue: true,
        }
      );
      triggerApprovers(
        {
          moduleName: selectedRowData?.key,
        },
        {
          preferCacheValue: true,
        }
      );

      if (isRegistrationApproval || isOtherExpenses) {
        setWithLimit(false);
      }
    }
  }, [
    isDrawerOpen,
    selectedRowData,
    triggerCandidates,
    triggerApprovers,
    setValue,
    isRegistrationApproval,
    isOtherExpenses,
  ]);
  const arr = (v) => (Array.isArray(v) ? v : []);

  // Memoize derived candidates so identity is stable unless data truly changes
  const headCandidates = useMemo(
    () => arr(moduleApprovers?.approvers?.heads ?? moduleApprovers?.approvers),
    [moduleApprovers]
  );
  const managerCandidates = useMemo(
    () => arr(moduleApprovers?.approvers?.managers ?? moduleApprovers?.approvers),
    [moduleApprovers]
  );

  console.log(managerCandidates)
  console.log(headCandidates)

  useEffect(() => {
    if (!isDrawerOpen || !moduleApprovers || !approverModule) return;

    const findIn = (list, userId) =>
      list.find((c) => String(c.userId ?? c.id) === String(userId)) || null;

    const buildTerritories = (source) => [
      ...new Map(
        source
          .filter((a) => a?.territoryId != null)
          .map((a) => [a.territoryId, { id: a.territoryId, name: a.territoryName }])
      ).values(),
    ];

    console.log(headCandidates)

    if (isOtherExpenses) {
      const existingHeads = arr(approverModule?.approvers?.heads ?? approverModule?.heads);
      const existingManagers = arr(approverModule?.approvers?.managers ?? approverModule?.managers);


      const headRows = buildTerritories(headCandidates).map((territory) => {
        const match = existingHeads.find(
          (h) =>
            String(h.territoryId ?? "") === String(territory.id) ||
            h.territoryName === territory.name
        );
        return {
          territory,
          userId: match ? findIn(headCandidates, match.userId ?? match.id) : null,
        };
      });

      const managerRows =
        existingManagers.length > 0
          ? existingManagers.map((m) => ({
            userId: findIn(managerCandidates, m.userId ?? m.id),
          }))
          : [{ userId: null }];

      setValue("approversWithTerritory", headRows, { shouldValidate: true });
      setValue("approvers", managerRows, { shouldValidate: true });
      return;
    }

    const existing = arr(approverModule?.approvers);

    console.log(existing)

    if (isClientEditApproval || isSalesTransactionApproval) {
      const candidateSource = isSalesTransactionApproval
        ? headCandidates
        : managerCandidates;

      const managerRows =
        existing.length > 0
          ? existing.map((m) => ({
            userId: findIn(candidateSource, m.userId ?? m.id),
          }))
          : [{ userId: null }];

      setValue("approvers", managerRows, { shouldValidate: true });
      return;
    }

    setValue(
      "approversWithTerritory",
      buildTerritories(headCandidates).map((territory) => {
        const match = existing.find((a) => a.territoryId === territory.id);
        return {
          territory,
          userId: match ? findIn(headCandidates, match.userId) : null,
        };
      }),
      { shouldValidate: true }
    );
  }, [
    isDrawerOpen,
    moduleApprovers,
    approverModule,
    // headCandidates,
    // managerCandidates,
    // setValue,
    isOtherExpenses,
    isClientEditApproval,
  ]);

  return (
    <>
      {/* {error && <SessionExpired />} */}
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

        {modulesLoading ? <CommonTableSkeleton compact />
          : <CommonTable
            evenLesserCompact
            mapData={modules}
            customOrderKeys={customOrderKeys}
            tableHeads={tableHeads}
            onManageApprovers={handleEditOpen}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            count={approvalItem?.sub?.length}
            isLo
            status={status}
          />}

        <CommonDrawer
          open={isDrawerOpen}
          onClose={handleDrawerClose}
          drawerHeader="Approver Settings"
          onSubmit={handleSubmit(onSubmit)}
          disableSubmit={!isValid || approversUpdating || otherExpenseApproversUpdating}
          isLoading={approverModuleLoading || moduleApproversLoading || otherExpenseApproversUpdating || approversUpdating}
          width="1000px"
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
            {!(isClientEditApproval || isSalesTransactionApproval) && (<>            <Typography sx={{ fontWeight: "bold", fontSize: "20px" }}>
              List of Approvers With Territory
            </Typography>

              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
                ref={parent}
              >
                {approverWithTerritoryFields.map((item, index) => (
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
                      name={`approversWithTerritory[${index}].userId`}
                      control={control}
                      options={
                        Array.isArray(moduleApprovers?.approvers?.heads)
                          ? moduleApprovers.approvers.heads
                          : Array.isArray(moduleApprovers?.heads)
                            ? moduleApprovers.heads
                            : Array.isArray(moduleApprovers?.approvers)
                              ? moduleApprovers.approvers
                              : []
                      } getOptionLabel={(option) => option?.fullname || option?.fullName || ""}
                      sx={{ flex: 1 }}
                      disableClearable
                      getOptionDisabled={(option) => {
                        const approversWithTerritory = watch("approversWithTerritory");


                        const checkApprover =
                          approversWithTerritory?.some(
                            (item) => item?.userId?.userId === option.userId
                          )
                        return checkApprover;
                      }}
                      disabled={!watch("moduleName")}
                      loading={moduleApproversLoading}
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

                    {!(isClientEditApproval && isSalesTransactionApproval) && <ControlledAutocomplete
                      name={`approversWithTerritory[${index}].territory`}
                      control={control}
                      options={territoryData?.territories || []}
                      getOptionLabel={(option) => option.name || ""}
                      sx={{ flex: 1 }}
                      disableClearable
                      disabled={!watch("moduleName")}
                      loading={isTerritoryFetching}
                      isOptionEqualToValue={() => true}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          label="Territory Name"
                          helperText={errors?.territory?.message}
                          error={errors?.territory}
                        />
                      )}
                    />}
                    {/* 
                  <IconButton
                    sx={{ color: "error.main" }}
                    onClick={() => approverWithTerritoryRemove(index)}
                  >
                    <RemoveCircleOutline sx={{ fontSize: "30px" }} />
                  </IconButton> */}
                  </Box>
                ))}
              </Box>
            </>)}


            {(isOtherExpenses || isClientEditApproval || isSalesTransactionApproval) && <>            <Typography sx={{ fontWeight: "bold", fontSize: "20px" }}>
              List of Approvers Without Territory
            </Typography>            <Box
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
                      options={
                        isSalesTransactionApproval
                          ? headCandidates
                          : moduleApprovers?.approvers?.managers || moduleApprovers?.approvers || []
                      } getOptionLabel={(option) => option?.fullname || option?.fullName || ""}
                      // getOptionDisabled={(option) => {
                      //   const approversWithLimit = watch("approversWithLimit");
                      //   const approversWithLimitDigit = watch("approversWithLimitDigit");
                      //   const approvers = watch("approvers");

                      //   return (
                      //     approversWithLimit?.some(
                      //       (item) => item?.userId === option.userId
                      //     ) ||
                      //     approversWithLimitDigit?.some(
                      //       (item) => item?.userId === option.userId
                      //     ) ||
                      //     approvers?.some(
                      //       (item) => item?.userId === option.userId
                      //     )
                      //   );
                      // }}
                      sx={{ flex: 1 }}
                      disableClearable
                      disabled={!watch("moduleName")}
                      loading={moduleApproversLoading}
                      isOptionEqualToValue={(option, value) =>
                        option.userId === value?.userId
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          label="Approver Name"
                          helperText={errors?.userId?.message}
                          error={Boolean(errors?.userId)}
                        />
                      )}
                    />


                    {/* <IconButton
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
                    </IconButton> */}
                  </Box>
                ))}
              </Box></>
            }

          </Box>
          {/* 
          <Stack direction="row" spacing={1}>
            <SecondaryButton
              sx={{ width: "150px" }}
              onClick={() => {
                if (withLimit && !isItemApproval && !isClientEditApproval && !isOtherExpenses) {
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
                      level: approverWithLimitDigitFields.length + 1,
                    });
                  }
                } else {
                  approverWithTerritoryAppend({
                    userId: null,
                    territory: null,
                    level: approverWithTerritoryFields.length + 1,
                  });
                }
              }}
              disabled={
                !isValid &&
                !errors &&
                (approverFields.length > 0 ||
                  approverWithLimitFields.length > 0 ||
                  approverWithLimitDigitFields.length > 0)
              }
              endIcon={<Add />}
            >
              Add Approver
            </SecondaryButton>

            {!(isRegistrationApproval || isClientEditApproval || isItemApproval) && (
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
          </Stack> */}
        </CommonDrawer>
      </Box>
    </>
  );
}

export default Approver;