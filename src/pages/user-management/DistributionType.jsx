import { Autocomplete, Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import CommonDrawer from "../../components/CommonDrawer";
import useDisclosure from "../../hooks/useDisclosure";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import { clusterSchema, distributionSchema } from "../../schema/schema";
import { useSelector } from "react-redux";
import {
  useGetAllClustersQuery,
  usePatchClusterStatusMutation,
  usePostClusterMutation,
  usePutClusterMutation,
} from "../../features/setup/api/clusterApi";
import ViewCDOModal from "../../components/modals/ViewCDOModal";
import { PinDrop, Business } from "@mui/icons-material";
import useConfirm from "../../hooks/useConfirm";
import useSnackbar from "../../hooks/useSnackbar";
import { handleCatchErrorMessage } from "../../utils/CustomFunctions";
import SessionExpired from "../SessionExpired";
import { useGetAllDistributionQuery, usePatchDistributionMutation, usePatchDistributionStatusMutation, usePostDistributionMutation } from "../../features/setup/api/distributionApi";

function DistributionType() {
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
  const tableHeads = ["Name"];
  const customOrderKeys = ["name"];

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
    setValue,
    reset,
    watch
  } = useForm({
    resolver: yupResolver(distributionSchema.schema),
    mode: "onChange",
    defaultValues: distributionSchema.defaultValues,
  });

  console.log(watch())
  //RTK Query
  const [postDistribution, { isLoading: isAddLoading }] = usePostDistributionMutation();
  const { data, isFetching, error } = useGetAllDistributionQuery(
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
  const [patchDistribution, { isLoading: isUpdateLoading }] = usePatchDistributionMutation();
  const [patchStatus] = usePatchDistributionStatusMutation();

  //Drawer Functions
  const onDrawerSubmit = async (data) => {
    try {
      if (drawerMode === "add") {
        await postDistribution(data).unwrap();
      } else if (drawerMode === "edit") {
        await patchDistribution(data).unwrap();
      }

      onDrawerClose();
      reset();

      snackbar({
        message: `Cluster ${
          drawerMode === "add" ? "added" : "updated"
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
        callback: () => patchStatus(selectedRowData?.id).unwrap(),
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

    Object.keys(editData).forEach((key) => {
      setValue(key, editData[key]);
    });
  };

  const handleDrawerClose = () => {
    reset();
    onDrawerClose();
  };

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
              Distribution Type <Business />
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
            mapData={data?.distributionTypes}
            customOrderKeys={customOrderKeys}
            onEdit={handleEditOpen}
            onArchive={onArchive}
            viewMoreKey={"users"}
            onViewMoreClick={onViewOpen}
            // onTagUserInCluster={onTagOpen}
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
          drawerHeader={(drawerMode === "add" ? "Add" : "Edit") + " Type"}
          onSubmit={handleSubmit(onDrawerSubmit)}
          disableSubmit={!isValid}
          isLoading={drawerMode === "add" ? isAddLoading : isUpdateLoading}
        >
          <TextField
            label="Type"
            size="small"
            autoComplete="off"
            {...register("name")}
            helperText={errors?.cluster?.message}
            error={errors?.cluster}
          />
          {/* <Autocomplete
            label="Type"
            size="small"
            options={["Marketing", "TDO"]}
            autoComplete="off"
            {...register("type")}
            renderInput={(params) => (
              <TextField {...params} size="small" label="Type" />
            )}
            helperText={errors?.cluster?.message}
            error={errors?.cluster}
          /> */}
        </CommonDrawer>
      </Box>
      <ViewCDOModal
        open={isViewOpen}
        onClose={onViewClose}
        isFetching={isFetching}
        data={data?.cluster}
      />
    </>
  );
}

export default DistributionType;
