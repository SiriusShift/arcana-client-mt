import { Box, TextField, Typography, Button } from "@mui/material";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import { useEffect, useRef, useState } from "react";
import { useGetInventoryMrpQuery } from "../../features/inventory-management/api/inventoryMrpApi";
import useDisclosure from "../../hooks/useDisclosure";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { attendanceSchema } from "../../schema/schema";
import CommonDrawer from "../../components/CommonDrawer";
import WebcamForm from "./webcam";
import useGeolocation from "../../hooks/useGeolocation";
import CommonModal from "../../components/CommonModal";
import Webcam from "react-webcam";

function CheckIn() {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const location = useGeolocation();
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  console.log(JSON.stringify(location));

  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  const {
    isOpen: isWebcamOpen,
    onOpen: onWebcamOpen,
    onClose: onWebcamClose,
  } = useDisclosure();

  // RTK Query
  const { data, isFetching } = useGetInventoryMrpQuery({
    Page: page + 1,
    PageSize: rowsPerPage,
    Search: search,
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(attendanceSchema.schema),
    mode: "onChange",
    defaultValues: attendanceSchema.defaultValues,
  });

  console.log(watch(""));

  //Functions
  const onDrawerSubmit = async (data) => {
    try {
      if (drawerMode === "add") {
        await postProductCategory(data).unwrap();
      } else if (drawerMode === "edit") {
        await putProductCategory(data).unwrap();
      }

      onDrawerClose();
      reset();

      snackbar({
        message: `Product Category ${
          drawerMode === "add" ? "added" : "updated"
        } successfully`,
        variant: "success",
      });
    } catch (error) {
      snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
    }
  };

  const onCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setValue("image", imageSrc); // Store the captured image in the form
  };

  const onRetake = () => {
    setCapturedImage(null); // Reset captured image to show webcam again
  };

  const onSubmit = (data) => {
    console.log("Form Data:", data); // You can handle the data here (e.g., send to server)
  };

  const handleAddOpen = () => {
    onWebcamOpen();
    onDrawerOpen();
  };

  const handleDrawerClose = () => {
    onDrawerClose();
    reset();
  };

  // CommonTable Props
  const tableHeads = [
    "User Id",
    "Date",
    "Time In",
    "Store Name",
    "Latitude",
    "Longitude",
    "Image",
  ];

  const customOrderKeys = [
    "userId",
    "date",
    "timeIn",
    "storeName",
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
          mapData={data?.inventoryMrp}
          tableHeads={tableHeads}
          customOrderKeys={customOrderKeys}
          includeActions={false}
          count={data?.totalCount || 0}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          page={page}
          setPage={setPage}
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
        <TextField
          label="Store Name"
          size="small"
          autoComplete="off"
          {...register("productCategoryName")}
          error={errors?.productCategoryName}
          helperText={errors?.productCategoryName?.message}
        />
      </CommonDrawer>
      <CommonModal
        open={isWebcamOpen}
        onClose={onWebcamClose}
        closeOnBackdropClick
        closeTopRight
        title="Capture Image"
      >
        <div className="cameraModal">
          <Typography fontSize="1.2rem" fontWeight="600">
            Capture Image
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="cameraModal__image">
              {capturedImage ? (
                // Show captured image with a "Retake" option
                <>
                  <img
                    src={capturedImage}
                    alt="Captured"
                    width={400}
                    height={300}
                  />
                </>
              ) : (
                // Show webcam view with a "Capture" button
                <>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={500} // Adjust width as needed
                    height={300} // Adjust height as needed
                  />
                </>
              )}
            </div>

            {/* Hidden input to store the image data */}
            <input type="hidden" {...register("image")} />
            <div className="cameraModal__button">
              {capturedImage ? (
                <Button type="button" variant="outlined" onClick={onRetake}>
                  Retake Photo
                </Button>
              ) : (
                <Button type="button" variant="outlined" onClick={onCapture}>
                  Capture Photo
                </Button>
              )}
              <Button type="submit" variant="contained">
                Submit
              </Button>
            </div>
          </form>
        </div>
      </CommonModal>
    </Box>
  );
}

export default CheckIn;
