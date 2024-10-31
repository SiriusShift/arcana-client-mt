import {
  Box,
  TextField,
  Typography,
  Button,
  Autocomplete,
} from "@mui/material";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import { useEffect, useRef, useState } from "react";
import { useGetInventoryMrpQuery } from "../../features/inventory-management/api/inventoryMrpApi";
import useDisclosure from "../../hooks/useDisclosure";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { attendanceSchema } from "../../schema/schema";
import CommonDrawer from "../../components/CommonDrawer";
import WebcamForm from "../../utils/webcam";
import useGeolocation from "../../hooks/useGeolocation";
import CommonModal from "../../components/CommonModal";
import { useGetAllClientsForPOSQuery } from "../../features/sales-management/api/salesTransactionApi";
import ControlledAutocomplete from "../../components/ControlledAutocomplete";
import { useSelector } from "react-redux";
import moment from "moment/moment";
import ViewTransactionModal from "../../components/modals/sales-management/ViewTransactionModal";
import {
  useGetCheckinQuery,
  usePostCheckinMutation,
} from "../../features/check-in/api/checkinApi";
import CheckInModal from "../../components/modals/CheckInModal";
import MapModal from "../../components/modals/MapModal";


function CheckIn() {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const location = useGeolocation();
  const webcamRef = useRef(null);
  const userData = useSelector((state) => state.login.userDetails);
  console.log(userData);

  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  const {
    isOpen: isViewImageOpen,
    onOpen: onViewImageOpen,
    onClose: onViewImageClose,
  } = useDisclosure();

  const {
    isOpen: isWebcamOpen,
    onOpen: onWebcamOpen,
    onClose: onWebcamClose,
  } = useDisclosure();

  const {
    isOpen: isMapOpen,
    onOpen: onMapOpen,
    onClose: onMapClose,
  } = useDisclosure();

  // RTK Query
  const { data, isFetching } = useGetCheckinQuery({
    Page: page + 1,
    PageSize: rowsPerPage,
  });

  const { data: clients, isFetching: isFetchingClients } =
    useGetAllClientsForPOSQuery();

  const [postCheckin, { isLoading }] = usePostCheckinMutation();

  const {
    handleSubmit,
    formState: { isValid, isDirty },
    setValue,
    reset,
    control,
    errors,
    watch,
  } = useForm({
    resolver: yupResolver(attendanceSchema.schema),
    mode: "onChange",
    defaultValues: attendanceSchema.defaultValues,
  });

  console.log(isValid);
  console.log("error", errors);
  console.log(watch());

  //Functions
  const onDrawerSubmit = async (data) => {
    console.log("data", data);
    console.log(data?.image);
    try {
      const formData = new FormData();

      data?.image && formData.append("image", data?.image);
      data?.latitude && formData.append("latitude", data?.latitude);
      data?.longitude && formData.append("longitude", data?.longitude);
      data?.remarks && formData.append("remarks", data?.remarks);
      data?.userId && formData.append("userId", data?.userId);
      data?.storeName && formData.append("clientId", data?.storeName?.clientId);

      // Append current date in your preferred format (or use moment here)
      formData.append("date", moment().toISOString());

      // Log formData for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      await postCheckin(formData).unwrap();
      onDrawerClose();
      // Use formData in your API call here
    } catch (error) {
      console.log(error);
      snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
    }
  };

  const submitImage = (data) => {
    setValue("image", data);
    setValue("latitude", location?.coordinates?.lat);
    setValue("longitude", location?.coordinates?.lng);
    setValue("userId", userData.id);
    onWebcamClose();
  };

  const handleAddOpen = () => {
    onWebcamOpen();
    onDrawerOpen();
  };
  const onView = () => {
    console.log("view");
    onViewImageOpen();
  };

  const onMap = () => {
    console.log("hello")
    onMapOpen();
  };

  const handleDrawerClose = () => {
    onDrawerClose();
    reset();
  };

  // CommonTable Props
  const tableHeads = [
    "User",
    "Date",
    "Business Name",
    "Business Owner",
    "Barangay",
    "City",
    "Province",
    "Latitude",
    "Longitude",
    "Image",
  ];

  const customOrderKeys = [
    "createdBy",
    "createdDate",
    "businessName",
    "fullName",
    "barangay",
    "province",
    "city",
    "latitude",
    "longitude",
    "image",
  ];

  // UseEffect
  useEffect(() => {
    setPage(0);
  }, [search, rowsPerPage]);

  return (
    <Box className="commonPageLayout">
      <PageHeaderAdd
        removeSearch
        onOpen={handleAddOpen}
        pageTitle="Check In"
        removeArchive
        setSearch={setSearch}
      />

      {isFetching ? (
        <CommonTableSkeleton evenLesserCompact />
      ) : (
        <CommonTable
          evenLesserCompact
          moveNoDataUp
          mapData={data?.checkIn}
          tableHeads={tableHeads}
          attachKey={"image"}
          customOrderKeys={customOrderKeys}
          includeActions
          onView={onView}
          count={data?.totalCount || 0}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          page={page}
          setPage={setPage}
          onMap={onMap}
        />
      )}
      <CommonDrawer
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        drawerHeader={"Time in"}
        onSubmit={handleSubmit(onDrawerSubmit)}
        disableSubmit={!isValid}
        //   isLoading={drawerMode === "add" ? isAddLoading : isUpdateLoading}
      >
        <ControlledAutocomplete
          name="storeName"
          control={control}
          options={clients}
          getOptionLabel={(option) =>
            `${option?.ownersName} - ${option?.businessName} - ${option?.city}, ${option?.province} - ${option?.clientId}`
          }
          isOptionEqualToValue={(option, value) =>
            option?.clientId === value?.clientId
          }
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label="Store Name"
              helperText={errors?.storeName?.message}
              error={!!errors?.storeName}
            />
          )}
        />
        <Controller
          control={control}
          name="remarks"
          render={({ field }) => (
            <TextField
              {...field}
              size="small"
              label="Remarks"
              autoComplete="off"
              multiline
              maxRows={4}
            />
          )}
        />
      </CommonDrawer>
      <CommonModal
        open={isWebcamOpen}
        onClose={onWebcamClose}
        closeTopRight
        title="Capture Image"
      >
        <WebcamForm submitImage={submitImage} />
      </CommonModal>
      <CheckInModal onClose={onViewImageClose} open={isViewImageOpen} />
      <MapModal onClose={onMapClose} open={isMapOpen} />
    </Box>
  );
}

export default CheckIn;
