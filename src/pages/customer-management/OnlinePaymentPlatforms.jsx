import { Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import CommonDrawer from "../../components/CommonDrawer";
import useDisclosure from "../../hooks/useDisclosure";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import { onlinePaymentPlatformsSchema } from "../../schema/schema";
import { useSelector } from "react-redux";
import { CreditCard } from "@mui/icons-material";
import { dummyOnlinePaymentPlatformsData } from "../../utils/DummyData";
import useSnackbar from "../../hooks/useSnackbar";
import useConfirm from "../../hooks/useConfirm";
import { handleCatchErrorMessage } from "../../utils/CustomFunctions";
import {
  useCreateOnlinePlatofrmMutation,
  useGetAllOnlinePlatformsQuery,
  useUpdateOnlinePlatformMutation,
  useUpdateOnlinePlatformStatusMutation,
} from "../../features/setup/api/onlinePaymentPlatformsApi";

function OnlinePaymentPlatforms() {
  const [drawerMode, setDrawerMode] = useState("");
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(null);

  //Hooks
  const snackbar = useSnackbar();
  const confirm = useConfirm();
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  // Drawer Disclosures
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  // Constants
  const customOrderKeys = ["onlinePlatform"];

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(onlinePaymentPlatformsSchema.schema),
    mode: "onChange",
    defaultValues: onlinePaymentPlatformsSchema.defaultValues,
  });

  //RTK Query
  const [createOnlinePlatform, { isLoading: isAddLoading }] =
    useCreateOnlinePlatofrmMutation();
  const { data, isFetching } = useGetAllOnlinePlatformsQuery({
    Search: search,
    Status: status,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });
  const [updateOnlinePlatform, { isLoading: isUpdateLoading }] =
    useUpdateOnlinePlatformMutation();
  const [updateOnlinePlatformStatus] = useUpdateOnlinePlatformStatusMutation();

  //Drawer Functions
  const onDrawerSubmit = async (data) => {
    try {
      if (drawerMode === "add") {
        await createOnlinePlatform(data).unwrap();
      } else if (drawerMode === "edit") {
        await updateOnlinePlatform(data).unwrap();
      }

      const snackbarMessage = `Online Payment Platform ${
        drawerMode === "add" ? "added" : "updated"
      } successfully`;
      snackbar({ message: snackbarMessage, variant: "success" });
      onDrawerClose();
      reset();
    } catch (error) {
      snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
    }
  };

  const onArchive = async () => {
    try {
      await confirm({
        children: `Are you sure you want to ${
          status ? "archive" : "restore"
        } this Online Payment Platform?`,
        question: status ? false : true,
        callback: () =>
          updateOnlinePlatformStatus(selectedRowData?.id).unwrap(),
      });

      snackbar({
        message: `Online Payment Platform ${
          status ? "archived" : "restored"
        } successfully`,
        variant: "success",
      });
    } catch (error) {
      if (error.isConfirmed) {
        snackbar({
          message: handleCatchErrorMessage(error),
          variant: "error",
        });
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
    <Box className="commonPageLayout">
      <PageHeaderAdd
        pageTitle={
          <>
            Online Payment Platforms <CreditCard />
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
          mapData={dummyOnlinePaymentPlatformsData}
          customOrderKeys={customOrderKeys}
          onEdit={handleEditOpen}
          onArchive={onArchive}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          count={count}
          status={status}
        />
      )}

      <CommonDrawer
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        drawerHeader={
          (drawerMode === "add" ? "Add" : "Edit") + " Online Payment Platform"
        }
        onSubmit={handleSubmit(onDrawerSubmit)}
        disableSubmit={!isValid}
        isLoading={drawerMode === "add" ? isAddLoading : isUpdateLoading}
      >
        <TextField
          label="Online Payment Platform"
          size="small"
          autoComplete="off"
          {...register("onlinePlatform")}
          helperText={errors?.onlinePlatform?.message}
          error={errors?.onlinePlatform}
        />
      </CommonDrawer>
    </Box>
  );
}

export default OnlinePaymentPlatforms;
