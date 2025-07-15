import { Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import PageHeaderAdd from "../../../components/PageHeaderAdd";
import CommonTable from "../../../components/CommonTable";
import CommonDrawer from "../../../components/CommonDrawer";
import useDisclosure from "../../../hooks/useDisclosure";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonTableSkeleton from "../../../components/CommonTableSkeleton";
import { useSelector } from "react-redux";
import { otherExpensesSchema, reasonSchema } from "../../../schema/schema";
import {
  usePostReasonsMutation,
  useDeleteReasonsMutation,
  usePutReasonMutation,
  useGetReasonsQuery,
} from "../../../features/inventory-management/api/reasonApi";
import { AttachMoney } from "@mui/icons-material";
import useConfirm from "../../../hooks/useConfirm";
import useSnackbar from "../../../hooks/useSnackbar";
import { handleCatchErrorMessage } from "../../../utils/CustomFunctions";
import SessionExpired from "../../SessionExpired";
import { isAction } from "@reduxjs/toolkit";

function ReasonSetup() {
  const [drawerMode, setDrawerMode] = useState("");
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(null);

  //Hooks
  const confirm = useConfirm();
  const snackbar = useSnackbar();
  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const userInfo = useSelector((state) => state.login)

  // Drawer Disclosures
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  // Constants
  const tableHeads = ["Reason"];
  const customOrderKeys = ["reasonInfo"];

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(reasonSchema.schema),
    mode: "onChange",
    defaultValues: reasonSchema.defaultValues,
  });

  //RTK Query
  const [postReason, { isLoading: isAddLoading }] = usePostReasonsMutation();
  const { data, isFetching, error } = useGetReasonsQuery(
    {
      isActive: status,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const [putReason, { isLoading: isUpdateLoading }] = usePutReasonMutation();
  const [deleteReason] = useDeleteReasonsMutation();

  const onDrawerSubmit = async (data) => {
    try {
      if (drawerMode === "add") {
        await postReason({
          reasonInfo: data.reason,
        }).unwrap();
      } else if (drawerMode === "edit") {
        await putReason({
          reasonInfo: selectedRowData?.id,
          updatedReason: data.reason,
          updatedBy: userInfo?.userDetails.id
        }).unwrap();
      }

      onDrawerClose();
      reset();
      snackbar({
        message: `Reason ${
          drawerMode === "add" ? "added" : "updated"
        } successfully`,
        variant: "success",
      });
    } catch (error) {
      snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
    }
  };

  const onArchive = async () => {
    try {
      await confirm({
        children: (
          <>
            {" "}
            Are you sure you want to {status ? "archive" : "restore"} this
            reason ?
          </>
        ),
        question: !status,
        callback: () => deleteReason(selectedRowData?.id).unwrap(),
      });
      snackbar({
        message: `Other Expenses ${
          status ? "archived" : "restored"
        } successfully`,
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

    // Object.keys(editData).forEach((key) => {
    //   setValue(key, editData[key]);
    // });
    setValue("id", editData.id);
    setValue("reason", editData.reasonInfo);
  };

  const handleDrawerClose = () => {
    onDrawerClose();
    reset();
  };

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
          pageTitle={<>Reason Setup</>}
          onOpen={handleAddOpen}
          setSearch={setSearch}
          setStatus={setStatus}
        />

        {isFetching ? (
          <CommonTableSkeleton evenLesserCompact />
        ) : (
          <CommonTable
            evenLesserCompact
            mapData={data}
            customOrderKeys={customOrderKeys}
            onEdit={handleEditOpen}
            onArchive={onArchive}
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
          drawerHeader={(drawerMode === "add" ? "Add" : "Edit") + " Reason"}
          onSubmit={handleSubmit(onDrawerSubmit)}
          disableSubmit={!isValid}
          isLoading={drawerMode === "add" ? isAddLoading : isUpdateLoading}
        >
          <TextField
            label="Reason"
            size="small"
            autoComplete="off"
            {...register("reason")}
            error={errors?.reason}
            helperText={errors?.reason?.message}
          />
        </CommonDrawer>
      </Box>
    </>
  );
}

export default ReasonSetup;
