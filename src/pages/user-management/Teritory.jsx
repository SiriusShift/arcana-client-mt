import { Autocomplete, Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import CommonDrawer from "../../components/CommonDrawer";
import useDisclosure from "../../hooks/useDisclosure";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import { clusterSchema, territorySchema } from "../../schema/schema";
import { useSelector } from "react-redux";
import {
  useGetTerritoryIdQuery,
  useGetTerritoryQuery,
  usePatchTerritoryMutation,
  usePatchTerritoryStatusMutation,
  usePostTerritoryMutation,
} from "../../features/setup/api/territoryApi";
import ViewCDOModal from "../../components/modals/ViewCDOModal";
import { PinDrop, Business } from "@mui/icons-material";
import useConfirm from "../../hooks/useConfirm";
import useSnackbar from "../../hooks/useSnackbar";
import { handleCatchErrorMessage } from "../../utils/CustomFunctions";
import SessionExpired from "../SessionExpired";
import { useGetChargingQuery } from "../../features/user-management/api/oneChargingApi";
import { useGetAllDistributionQuery } from "../../features/setup/api/distributionApi";
function Teritory() {
  const [drawerMode, setDrawerMode] = useState("");
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(null);

  const confirm = useConfirm();
  const snackbar = useSnackbar();
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  // Drawer Disclosures
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  // const {
  //   isOpen: isTagOpen,
  //   onOpen: onTagOpen,
  //   onClose: onTagClose,
  // } = useDisclosure();

  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();

  // Constants
  const tableHeads = ["Cluster", "Users Tagged"];
  const customOrderKeys = ["name", "users"];

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
    setValue,
    reset,
    control,
    watch
  } = useForm({
    resolver: yupResolver(territorySchema.schema),
    mode: "onChange",
    defaultValues: territorySchema.defaultValues,
  });

  //RTK Query
  const [postCluster, { isLoading: isAddLoading }] = usePostTerritoryMutation();
  const { data, isFetching, error } = useGetTerritoryQuery(
    {
      Search: search,
      isActive: status,
      PageNumber: page + 1,
      PageSize: rowsPerPage,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );
    const { data: distributionData, isFetching: chargingFetching } = useGetAllDistributionQuery()

  // const { data: chargingData, isFetching: chargingFetching } = useGetChargingQuery()
  const [putCluster, { isLoading: isUpdateLoading }] = usePatchTerritoryMutation();
  const [patchClusterStatus] = usePatchTerritoryStatusMutation();

  console.log(distributionData)
  //Drawer Functions
  const onDrawerSubmit = async (data) => {
    try {
      if (drawerMode === "add") {
        await postCluster({
          name: data?.name,
          distributionTypeId: data?.distributionType.id
        }).unwrap();
      } else if (drawerMode === "edit") {
        await putCluster(data).unwrap();
      }

      onDrawerClose();
      reset();

      snackbar({
        message: `Territory ${drawerMode === "add" ? "added" : "updated"
          } successfully`,
        type: "success",
      });
    } catch (error) {
      snackbar({ message: handleCatchErrorMessage(error), type: "error" });
    }
  };

  const onArchive = async () => {
    try {
      await confirm({
        children: (
          <>
            Are you sure you want to {status ? "archive" : "restore"}{" "}
            <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
              {selectedRowData?.cluster}
            </span>
            ?
          </>
        ),
        question: !status,
        callback: () => patchClusterStatus(selectedRowData?.id).unwrap(),
      });

      snackbar({
        message: `Cluster ${status ? "archived" : "restored"} successfully`,
        variant: "success",
      });
    } catch (error) {
      if (error.isConfirmed) {
        snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
      }
    }
  };

  const handleAddOpen = () => {
    setDrawerMode("add");
    onDrawerOpen();
  };

  const handleEditOpen = (editData) => {
    setDrawerMode("edit");
    onDrawerOpen();
    console.log(editData, "data")

    Object.keys(editData).forEach((key) => {
      console.log(key === "distributionTypeId")
      if(key === "distributionTypeId"){

        const distri = distributionData?.distributionTypes?.find((item) => item.id === editData[key])
        console.log(distri)
        setValue("distributionType", distri)
      }else{
      setValue(key, editData[key]);
      }
    });
  };

  const handleDrawerClose = () => {
    reset();
    onDrawerClose();
  };

  console.log(watch())
  //UseEffect
  useEffect(() => {
    setCount(data?.totalCount);
  }, [data]);

  useEffect(() => {
    setPage(0);
  }, [search, status, rowsPerPage]);

  return (
    <>
      {error && <SessionExpired />}
      <Box className="commonPageLayout">
        <PageHeaderAdd
          pageTitle={
            <>
              Territory <PinDrop />
            </>
          }
          onOpen={handleAddOpen}
          setSearch={setSearch}
          setStatus={setStatus}
        />
        {isFetching ? (
          <CommonTableSkeleton evenLesserCompact />
        ) : (
          <CommonTable
            evenLesserCompact
            mapData={data?.territories}
            customOrderKeys={customOrderKeys}
            onEdit={handleEditOpen}
            onArchive={onArchive}
            viewMoreKey={"users"}
            onViewMoreClick={onViewOpen}            // onTagUserInCluster={onTagOpen}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            count={count}
            status={status}
            tableHeads={tableHeads}
          />
        )}

        <CommonDrawer
          open={isDrawerOpen}
          onClose={handleDrawerClose}
          drawerHeader={(drawerMode === "add" ? "Add" : "Edit") + " Territory"}
          onSubmit={handleSubmit(onDrawerSubmit)}
          disableSubmit={!isValid}
          isLoading={drawerMode === "add" ? isAddLoading : isUpdateLoading}
        >
          <TextField
            label="Territory"
            size="small"
            autoComplete="off"
            {...register("name")}
            helperText={errors?.name?.message}
            error={errors?.name}
          />

          <Controller
            name="distributionType"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <Autocomplete
                options={distributionData.distributionTypes}
                value={field.value}
                onChange={(event, newValue) => {
                  field.onChange(newValue);
                }}
                getOptionLabel={(option) =>
                  option.name
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Distribution Type"
                    placeholder="Select Distribution Type"
                  />
                )}
              />
            )}
          />
        </CommonDrawer>
      </Box>
      <ViewCDOModal
        open={isViewOpen}
        onClose={onViewClose}
        isFetching={isFetching}
        data={data?.territories}
      />
    </>
  );
}

export default Teritory;
