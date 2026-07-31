import { Autocomplete, Box, TextField } from "@mui/material";
import PageHeaderAdd from "../../../components/PageHeaderAdd";
import CommonTable from "../../../components/CommonTable";
import GenerateMoveOrderModal from "../../../components/page-components/sales-management/sales-transaction/GenerateMoveOrderModal";
import useDisclosure from "../../../hooks/useDisclosure";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetAllReceivedOrdersQuery } from "../../../features/inventory-management/api/receivingApi";
import CommonTableSkeleton from "../../../components/CommonTableSkeleton";
import AddSearchMixin from "../../../components/mixins/AddSearchMixin";
import moment from "moment";
import { useGetAllTransferOutsQuery } from "../../../features/inventory-management/api/transferOutApi";
import { useGetReturnToDepotQuery } from "../../../features/inventory-management/api/transferOutApi";
import PrintInventoryModal from "../../../components/modals/PrintInventoryModal";
import {
  useGetAdjustmentSchedulesQuery,
  useGetEndingInventoryHistoryQuery,
  useGetEndingInventoryQuery,
  usePostSetupAdjustmentScheduleMutation,
} from "../../../features/inventory-management/api/endingInventoryApi";
import { KeyboardDoubleArrowRight } from "@mui/icons-material";
import SearchDateFilterMixin from "../../../components/mixins/SearchDateFilterMixin";
import CommonDrawer from "../../../components/CommonDrawer";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { endingScheduleSchema } from "../../../schema/schema";
import useConfirm from "../../../hooks/useConfirm";
import useSnackbar from "../../../hooks/useSnackbar";

function EndingInventory() {
  const navigate = useNavigate();
  const location = useLocation();
  const snackbar = useSnackbar();
  const confirm = useConfirm();
  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const userDetail = useSelector((state) => state.login?.userDetails?.roleName);
  const [search, setSearch] = useState("");
  const [clusterId, setClusterId] = useState("");
  const [dateFrom, setDateFrom] = useState(moment().startOf("month"));
  const [dateTo, setDateTo] = useState(moment());
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  console.log(days);

  const pesoArray = ["totalAmount"];

  // REACT HOOK FORM
  const {
    handleSubmit,
    formState: { errors, isValid, isDirty },
    register,
    setValue,
    reset,
    control,
    watch,
  } = useForm({
    resolver: yupResolver(endingScheduleSchema.schema),
    mode: "onSubmit",
    defaultValues: endingScheduleSchema.defaultValues,
  });

  console.log(isValid, isDirty, errors?.days?.errors);
  console.log(watch());
  const {
    isOpen: isSettingsOpen,
    onOpen: onSettingsOpen,
    onClose: onSettingsClose,
  } = useDisclosure();

  // RTK Query
  const { data, isFetching } = useGetEndingInventoryHistoryQuery({
    Search: search,
    Page: page + 1,
    PageSize: rowsPerPage,
    ...(clusterId && { clusterId: clusterId?.id }),
    DateFrom: dateFrom ? moment(dateFrom).format("YYYY-MM-DD") : "",
    DateTo: dateTo ? moment(dateTo).format("YYYY-MM-DD") : "",
  });

  const [updateSettings, { isLoading: updateLoading }] =
    usePostSetupAdjustmentScheduleMutation();
  const { data: endingSchedule, isFetching: scheduleFetching } =
    useGetAdjustmentSchedulesQuery({
      IsActive: true,
    });

  // Common Table Props
  const tableHeads = ["Month Code", "Cluster", "Transaction Date", "Status"];

  const customOrderKeys = ["monthCode", "clusterId", "transactedDate", "status"];

  const dateTimeArray = ["transactedDate", "dateReceived"];

  // Functions

  const handleAdd = () => {
    navigate("return-form");
  };

  const onFilter = async ({ clusterId }) => {
    try {
      setClusterId(clusterId);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = () => {
    navigate(
      `ending-inventory-form/${selectedRowData?.id}?dateFrom=${moment(
        dateFrom
      ).format("YYYY-MM-DD")}&dateTo=${moment(dateTo).format("YYYY-MM-DD")}`
    );
  };

  const handleSettingsChange = (data) => {
    console.log(data);
    try {
      confirm({
        children: "Are you sure you want to update schedule?",
        question: true,
        callback: async () => {
          try {
            await updateSettings(data).unwrap();
            snackbar({
              message: "Successfully updated adjustment schedule",
              variant: "success",
            });
            handleDrawerClose();
          } catch (err) {
            console.log(err);
          }
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDrawerClose = () => {
    console.log("test")
    onSettingsClose();
    reset();
  };

  const handleView = () => {
    navigate(
      `${selectedRowData?.id}?dateFrom=${moment(dateFrom).format(
        "YYYY-MM-DD"
      )}&dateTo=${moment(dateTo).format("YYYY-MM-DD")}`
    );
  };

  useEffect(() => {
    const sched = endingSchedule?.to?.reduce((acc, curr) => {
      const exists = acc.find((item) => item.day === curr.day);
      if (!exists) acc.push(curr?.day);
      return acc;
    }, []);

    setValue("days", sched);
  }, [endingSchedule, isSettingsOpen]);

  if (location.pathname === "/inventory-management/ending-inventory") {
    return (
      <>
        {/* <GenerateMoveOrderModal
          open={isGenerateOpen}
          onClose={onGenerateClose}
        /> */}

        <Box className="commonPageLayout">
          <PageHeaderAdd
            pageTitle="Ending Inventory"
            removeArchive
            removeAdd
            removeSearch
            onOpen={handleAdd}
            setSearch={setSearch}
          />

          <SearchDateFilterMixin
            title="Pay Now"
            endIcon={<KeyboardDoubleArrowRight />}
            setSearch={setSearch}
            // disableButton={isCustomerApprover}
            removeAdd
            withDate
            isDataFetching={isFetching}
            onAddOpen={() => {
              dispatch(setSelectedRow(null));
              setPaymentMode(true);
            }}
            onFilter={onFilter}
            clusterFilter={true}
            setDateFrom={setDateFrom}
            openSettings={userDetail === "Admin" && onSettingsOpen}
            setDateTo={setDateTo}
            dateFrom={dateFrom}
            dateTo={dateTo}
            // transactionStatus={transactionStatus}
          />

          {isFetching ? (
            <CommonTableSkeleton lowerCompact />
          ) : (
            <CommonTable
              lowerCompact
              moveNoDataUp
              mapData={data?.mo || []}
              tableHeads={tableHeads}
              customOrderKeys={customOrderKeys}
              dateTimeArray={dateTimeArray}
              count={data?.totalCount || 0}
              onUpdate={selectedRowData?.status === "Pending" && handleUpdate}
              onView={selectedRowData?.status === "Completed" && handleView}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              page={page}
              pesoArray={pesoArray}
              setPage={setPage}
            />
          )}
        </Box>

        <CommonDrawer
          drawerHeader={"Date Settings"}
          open={isSettingsOpen}
          onClose={handleDrawerClose}
          disableSubmit={!isValid || !isDirty}
          isLoading={updateLoading}
          onSubmit={handleSubmit(handleSettingsChange)}
        >
          <Controller
            control={control}
            name="days"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Autocomplete
                multiple
                id="tags-standard"
                options={days}
                value={value || []} // ensure it's always an array
                onChange={(event, newValue) => onChange(newValue)}
                getOptionLabel={(option) => String(option)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Ending Inventory days"
                    placeholder="Days"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            )}
          />
        </CommonDrawer>
      </>
    );
  }

  return <Outlet />;
}

export default EndingInventory;
