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
import useDisclosure from "../../hooks/useDisclosure";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { attendanceSchema, othersAttendance } from "../../schema/schema";
import CommonDrawer from "../../components/CommonDrawer";
import WebcamForm from "../../utils/webcam";
import useGeolocation from "../../hooks/useGeolocation";
import { useGetAllClientsForCheckInQuery } from "../../features/registration/api/registrationApi";
import ControlledAutocomplete from "../../components/ControlledAutocomplete";
import { useSelector } from "react-redux";
import moment from "moment/moment";
import ViewTransactionModal from "../../components/modals/sales-management/ViewTransactionModal";
import {
  useGetCheckinQuery,
  usePostCheckinMutation,
  usePatchTimeOutMutation,
} from "../../features/check-in/api/checkinApi";
import CheckInModal from "../../components/modals/CheckInModal";
import MapModal from "../../components/modals/MapModal";
import useSnackbar from "../../hooks/useSnackbar";
import useConfirm from "../../hooks/useConfirm";

function CheckIn() {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [typeCustomer, setTypeCustomer] = useState(null);
  const [search, setSearch] = useState("");
  const location = useGeolocation();
  const confirm = useConfirm();
  const snackbar = useSnackbar();
  const webcamRef = useRef(null);
  const userData = useSelector((state) => state.login.userDetails);
  const selectedRowData = useSelector((state) => state.selectedRow.value);
  console.log(typeCustomer);

  // Object for type
  const type = [
    {
      value: 0,
      label: "Direct",
    },
    {
      value: 1,
      label: "Prospecting",
    },
    {
      value: 2,
      label: "Others",
    },
  ];

  // Hooks
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
    isOpen: isMapOpen,
    onOpen: onMapOpen,
    onClose: onMapClose,
  } = useDisclosure();

  // RTK Query
  const { data, isFetching } = useGetCheckinQuery({
    PageNumber: page + 1,
    PageSize: rowsPerPage,
    Search: search,
  });

  const { data: clients, isFetching: isFetchingClients } =
    useGetAllClientsForCheckInQuery({
      Origin: typeCustomer?.label,
    });

  const [postCheckin, { isLoading: isPosting }] = usePostCheckinMutation();

  const [patchCheckin] = usePatchTimeOutMutation();

  const {
    handleSubmit,
    formState: { isValid, isDirty },
    setValue,
    reset,
    control,
    errors,
    watch,
  } = useForm({
    resolver: yupResolver(
      typeCustomer?.label === "Others"
        ? othersAttendance?.schema
        : attendanceSchema?.schema
    ),
    mode: "onChange",
    defaultValues:
      typeCustomer?.label === "Others"
        ? othersAttendance?.defaultValues
        : attendanceSchema?.defaultValues,
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

      if (typeCustomer?.label === "Others") {
        formData.append("image", data?.image);
        formData.append("latitude", data?.latitude);
        formData.append("longitude", data?.longitude);
        formData.append("userId", data?.userId);
        formData.append("BusinessName", data?.storeName);
        formData.append("City", data?.city);
        formData.append("Province", data?.province);
        formData.append("barangay", data?.barangay);
        formData.append("FullName", data?.ownersName);
        formData.append("Remarks", data?.remarks);
      } else {
        data?.image && formData.append("image", data?.image);
        data?.latitude && formData.append("latitude", data?.latitude);
        data?.longitude && formData.append("longitude", data?.longitude);
        data?.remarks && formData.append("remarks", data?.remarks);
        data?.userId && formData.append("userId", data?.userId);
        data?.storeName &&
          formData.append("clientId", data?.storeName?.clientId);
      }
      // Append current date in your preferred format (or use moment here)
      formData.append("date", moment().toISOString());

      // Log formData for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      await postCheckin(formData).unwrap();
      reset();
      setTypeCustomer(null);
      onDrawerClose();
      // Use formData in your API call here
    } catch (error) {
      console.log(error);
      snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
    }
  };

  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Handles the checkout process by prompting the user for confirmation.
   * If confirmed, it proceeds to patch the check-in data for the current user.
   * Displays a success message upon successful checkout or an error message if an exception occurs.
   */
  /******  a00bf1e3-54b4-4415-99dc-11182cac0b11  *******/ const onCheckout =
    async () => {
      try {
        await confirm({
          children: "Are you sure you want to checkout?",
/*************  ✨ Codeium Command ⭐  *************/
        /**
         * Callback function called if the user confirms the checkout.
         * Proceeds to patch the check-in data for the current user.
         */
/******  4936aa06-9bd6-4037-b93d-7014995298de  *******/          question: true,

          callback: () => {
            patchCheckin(selectedRowData?.id).unwrap();
          },
        });

        snackbar({ message: "Checked out successfully", variant: "success" });
      } catch (error) {
        console.log(error);
        snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
      }
    };

  const submitImage = (data) => {
    setValue("image", data, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const retake = () => {
    setValue("image", null, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleAddOpen = () => {
    onDrawerOpen();
    setValue("latitude", location?.coordinates?.lat);
    setValue("longitude", location?.coordinates?.lng);
    setValue("userId", userData.id);
  };
  const onView = () => {
    console.log("view");
    onViewImageOpen();
  };

  const onMap = () => {
    console.log("hello");
    onMapOpen();
  };

  const handleDrawerClose = () => {
    onDrawerClose();
    reset();
  };

  // CommonTable Props
  const tableHeads = [
    "User",
    "Business Name",
    "Business Owner",
    "Barangay",
    "City",
    "Province",
    "Time In",
    "Time Out",
    "Duration",
  ];

  const customOrderKeys = [
    "createdBy",
    "businessName",
    "fullName",
    "barangay",
    "province",
    "city",
    "createdDate",
    "timeOut",
    "duration"
  ];

  const disabledActions = ["checkout"]

  // UseEffect
  useEffect(() => {
    setPage(0);
  }, [search, rowsPerPage]);

  console.log("clients", clients);

  return (
    <Box className="commonPageLayout">
      <PageHeaderAdd
        onOpen={handleAddOpen}
        pageTitle="Check In"
        removeArchive
        setSearch={setSearch}
      />

      {isFetching ? (
        <CommonTableSkeleton evenLesserCompact />
      ) : (
        <CommonTable
          checkIn
          compact
          moveNoDataUp
          mapData={data?.checkIn}
          tableHeads={tableHeads}
          attachKey={"image"}
          disableActions={selectedRowData?.timeOut && disabledActions}
          customOrderKeys={customOrderKeys}
          includeActions
          onView={onView}
          count={data?.totalCount || 0}
          rowsPerPage={rowsPerPage}
          onCheckout={onCheckout}
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
        isLoading={isPosting}
      >
        <Autocomplete
          disablePortal
          name="type"
          options={type}
          onChange={(e, value) => {
            setTypeCustomer(value);
            setValue("storeName", null, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
          isOptionEqualToValue={(option, value) =>
            option?.label === value?.label
          }
          getOptionLabel={(option) => option?.label}
          renderInput={(params) => (
            <TextField {...params} size="small" label="Type of Customer" />
          )}
        />
        {typeCustomer?.label === "Others" ? (
          <>
            <Controller
              control={control}
              name="storeName"
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  label="Business Name"
                  autoComplete="off"
                  onChange={(e) =>
                    field.onChange(e.target.value.toUpperCase())
                  }
                />
              )}
            />
            <Controller
              control={control}
              name="ownersName"
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  label="Owner's Name"
                  autoComplete="off"
                  onChange={(e) =>
                    field.onChange(e.target.value.toUpperCase())
                  }
                />
              )}
            />
            <Controller
              control={control}
              name="barangay"
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  label="Barangay"
                  autoComplete="off"
                  onChange={(e) =>
                    field.onChange(e.target.value.toUpperCase())
                  }
                />
              )}
            />
            <Controller
              control={control}
              name="city"
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  label="City"
                  autoComplete="off"
                  onChange={(e) =>
                    field.onChange(e.target.value.toUpperCase())
                  }
                />
              )}
            />
            <Controller
              control={control}
              name="province"
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  label="Province"
                  autoComplete="off"
                  onChange={(e) =>
                    field.onChange(e.target.value.toUpperCase())
                  }
                />
              )}
            />
          </>
        ) : (
          <ControlledAutocomplete
            name="storeName"
            control={control}
            options={clients}
            getOptionLabel={(option) =>
              `${option?.fullName + " - " || "N/A"}  ${
                option?.businessName
              } - ${option?.barangayName || "N/A"}, ${
                option?.municipality || "N/A"
              }, ${option?.province || "N/A"} - ${option?.clientId}`
            }
            isOptionEqualToValue={(option, value) =>
              option?.clientId === value?.clientId
            }
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                label="Business Name"
                helperText={errors?.storeName?.message}
                error={!!errors?.storeName}
              />
            )}
          />
        )}
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
              onChange={(e) =>
                field.onChange(e.target.value.toUpperCase())
              }
              maxRows={4}
            />
          )}
        />
        <WebcamForm reset={retake} submitImage={submitImage} />
      </CommonDrawer>
      <CheckInModal onClose={onViewImageClose} open={isViewImageOpen} />
      <MapModal onClose={onMapClose} open={isMapOpen} />
    </Box>
  );
}

export default CheckIn;
