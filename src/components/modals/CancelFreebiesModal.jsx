import { useState } from "react";
import CommonModal from "../CommonModal";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import DangerButton from "../DangerButton";
import useDisclosure from "../../hooks/useDisclosure";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  prospectApi,
  usePutRejectFreebiesMutation,
} from "../../features/prospect/api/prospectApi";
import SuccessSnackbar from "../SuccessSnackbar";
import ErrorSnackbar from "../ErrorSnackbar";
import CommonDialog from "../common/CommonDialog";
import { useGetAllClientsQuery } from "../../features/registration/api/registrationApi";
import { freebiesApi } from "../../features/inventory-management/api/freebiesApi";

function CancelFreebiesModal({ type, reason, ...otherProps }) {
  const { onClose } = otherProps;
  const dispatch = useDispatch();

  const [snackbarMessage, setSnackbarMessage] = useState("");

  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const freebiesLength = selectedRowData?.freebies?.length;

  const { fullname } = useSelector((state) => state.login);

  const { data: clientData, isFetching: isClientFetching } =
    useGetAllClientsQuery({
      RegistrationStatus: "Approved",
      PageSize: 2000,
    });

  console.log(clientData);

  const address = selectedRowData?.ownersAddress
    ? selectedRowData?.ownersAddress
    : clientData?.regularClient?.find(
        (client) => selectedRowData?.clientId === client.id
      )?.businessAddress || {};
  const {
    isOpen: isCancelConfirmOpen,
    onOpen: onCancelConfirmOpen,
    onClose: onCancelConfirmClose,
  } = useDisclosure();

  const {
    isOpen: isSuccessOpen,
    onOpen: onSuccessOpen,
    onClose: onSuccessClose,
  } = useDisclosure();

  const {
    isOpen: isErrorOpen,
    onOpen: onErrorOpen,
    onClose: onErrorClose,
  } = useDisclosure();

  //RTK Query
  const [putRejectFreebies, { isLoading }] = usePutRejectFreebiesMutation();

  //Submit API Functions
  const handleCancelSubmit = async () => {
    const freebiesLength = selectedRowData?.freebies?.length;
    console.log("test");

    try {
      await putRejectFreebies({
        freebieRequestId:
          selectedRowData?.freebies?.[freebiesLength - 1]?.freebieRequestId ||
          selectedRowData?.id,
        freebieType: type,
        // params: {
        //   freebieId:
        //     selectedRowData?.freebies?.[freebiesLength - 1]?.freebieRequestId,
        // },
        reason: reason,
      }).unwrap();

      dispatch(freebiesApi.util.invalidateTags(["Freebies"]));
      onClose();

      setSnackbarMessage("Freebies canceled successfully");
      onSuccessOpen();
    } catch (error) {
      if (error?.data?.error?.message) {
        setSnackbarMessage(error?.data?.error?.message);
      } else {
        setSnackbarMessage("Error cancelling freebies");
      }

      onErrorOpen();
    }

    onCancelConfirmClose();
  };

  return (
    <>
      <CommonModal width="900px" closeTopRight {...otherProps}>
        <Box className="releaseFreebieModal">
          {/* <Box className="releaseFreebieModal__logo">
            <img src={rdfLogo} alt="RDF Logo" />
            <Typography>
              Purok 6, Brgy. Lara, <br /> City of San Fernando, Pampanga,
              Philippines
            </Typography>
          </Box> */}
          <Box className="releaseFreebieModal__header">
            <Typography className="releaseFreebieModal__header__title">
              Cancel Freebies Releasing
            </Typography>
            <Box className="releaseFreebieModal__header__customerDetails">
              <Box>
                <Typography>
                  <span>Customer:</span> {selectedRowData?.businessName || ""}
                </Typography>
                <Typography>
                  <span>Address: </span>
                  {`${address?.houseNumber ? `#${address.houseNumber}` : ""}${
                    address?.houseNumber &&
                    (address?.streetName || address?.barangayName)
                      ? ", "
                      : ""
                  }${address?.streetName ? `${address.streetName}` : ""}${
                    address?.streetName && address?.barangayName ? ", " : ""
                  }${address?.barangayName ? `${address.barangayName}` : ""}${
                    address?.city ? `, ${address.city}` : ""
                  }${address?.province ? `, ${address.province}` : ""}`}
                </Typography>
                <Typography>
                  <span>Series ID: </span>
                  {(selectedRowData?.freebies &&
                    selectedRowData?.freebies?.[freebiesLength - 1]
                      ?.seriesId || selectedRowData?.seriesId) ||
                    ""}
                </Typography>
              </Box>
              <Box>
                <Typography>
                  <span>Transaction no:</span>{" "}
                  {selectedRowData?.freebies?.[freebiesLength - 1]
                    ?.transactionNumber ||
                    selectedRowData?.id ||
                    ""}
                </Typography>
                <Typography>
                  <span>Date:</span> {moment().format("MMM DD, YYYY")}
                </Typography>
              </Box>
            </Box>
          </Box>
          <TableContainer className="releaseFreebieModal__tableContainer">
            <Table>
              <TableHead
                sx={{
                  bgcolor: "#fff",
                }}
              >
                <TableRow>
                  <TableCell>Qty</TableCell>
                  <TableCell>Product Code</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>UOM</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {selectedRowData?.freebies &&
                  selectedRowData?.freebies?.[
                    freebiesLength - 1
                  ]?.freebieItems?.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.itemCode}</TableCell>
                      <TableCell>{item.itemDescription}</TableCell>
                      <TableCell>{item.uom}</TableCell>
                    </TableRow>
                  ))}
                {selectedRowData?.freebieOrderItem &&
                  selectedRowData?.freebieOrderItem?.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.itemCode}</TableCell>
                      <TableCell>{item.itemDescription}</TableCell>
                      <TableCell>{item.uom}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box className="releaseFreebieModal__footerCancel">
            <Typography>
              <span>Prepared by:</span> {fullname ?? "user"}
            </Typography>
            {/* <TextField
              label="Reason"
              size="small"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value.toUpperCase());
              }}
            /> */}
          </Box>
        </Box>
        <Box className="releaseFreebieModal__actionsEnd">
          {/* <AccentButton
            sx={{ color: "white !important" }}
            onClick={handleClose}
          >
            Close
          </AccentButton> */}
          <DangerButton
            onClick={onCancelConfirmOpen}
            contained
            // disabled={!reason || /^\s*$/.test(reason)}
          >
            Cancel Freebies
          </DangerButton>
        </Box>
      </CommonModal>

      <CommonDialog
        open={isCancelConfirmOpen}
        onClose={onCancelConfirmClose}
        onYes={handleCancelSubmit}
        isLoading={isLoading}
      >
        Confirm cancel freebies for{" "}
        <span style={{ fontWeight: "bold" }}>
          {selectedRowData?.businessName}
        </span>
        ?
      </CommonDialog>

      <SuccessSnackbar
        open={isSuccessOpen}
        onClose={onSuccessClose}
        message={snackbarMessage}
      />

      <ErrorSnackbar
        open={isErrorOpen}
        onClose={onErrorClose}
        message={snackbarMessage}
      />
    </>
  );
}

export default CancelFreebiesModal;
