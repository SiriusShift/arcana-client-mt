import { useRef, useState } from "react";
import CommonModal from "../CommonModal";
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import rdfLogo from "../../assets/images/RDF-Logo.png";

import { useSelector } from "react-redux";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import "../../assets/styles/print.styles.scss";
import SecondaryButton from "../SecondaryButton";
import { useGetAllClientsQuery } from "../../features/registration/api/registrationApi";
import { Watch } from "@mui/icons-material";
import { set } from "lodash";

import React from "react";

const PrintingComponent = ({ type, data, fullname, style }) => {
  return (
    <Box className="releaseInventoryModal">
      <Box sx={{ display: "flex", justifyContent: "space-between", ...style }}>
        <Box className="releaseInventoryModal__logo">
          <img src={rdfLogo} alt="RDF Logo" />
          <Typography>
            Purok 6, Brgy. Lara, <br /> City of San Fernando, Pampanga,
            Philippines
          </Typography>
        </Box>
        {/* <Box sx={{ display: "flex", justifyContent: "end" }}>
              <IconButton onClick={onClose}>
                <Close />
              </IconButton>
            </Box> */}
      </Box>
      <Box className="releaseInventoryModal__header">
        <Typography className="releaseInventoryModal__header__title">
          {type === "Sampling"
            ? "Sampling Insuance Form"
            : `Move Order Slip (${type})`}
        </Typography>
        {type === "Sampling" ? (
          <>
            <Box className="releaseInventoryModal__header__customerDetails">
              <Box>
                <Typography>
                  <span>Description:</span> {data?.description}
                </Typography>
              </Box>
              <Box>
                <Typography>
                  <span>Date:</span> {moment().format("MMM D, YYYY")}
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography>
                <span>Series ID:</span>{" "}
                {data?.seriesId}
              </Typography>
            </Box>
          </>
        ) : (
          <Box className="releaseInventoryModal__header__customerDetails">
            <Box>
              <Typography>
                <span>Reference No:</span> {data.referenceNo}
              </Typography>
            </Box>
            <Box>
              <Typography>
                <span>Date:</span> {moment().format("MMM D, YYYY")}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      <TableContainer className="releaseInventoryModal__tableContainer">
        <Table>
          <TableHead
            sx={{
              bgcolor: "#fff",
            }}
          >
            {type === "Sampling" ? (
              <TableRow>
                <TableCell>Qty</TableCell>
                <TableCell>Product Code</TableCell>
                <TableCell>Description</TableCell>
                {/* <TableCell>UOM</TableCell> */}
              </TableRow>
            ) : (
              <TableRow>
                <TableCell>Qty</TableCell>
                <TableCell>Product Code</TableCell>
                {/* <TableCell>Description</TableCell> */}
                {/* <TableCell>UOM</TableCell> */}
                <TableCell>BBD</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Reason</TableCell>
                {/* <TableCell>Remarks</TableCell> */}
              </TableRow>
            )}
          </TableHead>

          <TableBody>
            {type === "Sampling"
              ? data?.freebieOrderItem?.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.itemCode}</TableCell>
                    <TableCell>{item.itemDescription?.toUpperCase()}</TableCell>
                    {/* <TableCell>{item.uom}</TableCell> */}
                  </TableRow>
                ))
              : data?.transferItems?.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.itemCode}</TableCell>
                    {/* <TableCell>
                            {item.itemDescription?.toUpperCase()}
                          </TableCell> */}
                    {/* <TableCell>{item.uom}</TableCell> */}
                    <TableCell>
                      {moment(item.bbd).format("MMM D, YYYY")}
                    </TableCell>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell>{item.reasonInfo}</TableCell>
                    {/* <TableCell>{item.reason}</TableCell> */}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box className="releaseInventoryModal__footer">
        <Box sx={{ position: "relative", flex: 1 }}>
          <Typography>
            <span>Prepared by:</span> {fullname ?? "user"}
          </Typography>

          {/* <Typography className="disclaimer">
                  This document does not serve as an official receipt
                </Typography> */}
        </Box>

        <Box className="releaseInventoryModal__footer__attachments">
          <Box className="releaseInventoryModal__footer__attachments__signature">
            <Typography>
              <span>Received by:</span>
            </Typography>
            <Box className="releaseInventoryModal__footer__attachments__signature__stack">
              <Typography>_____________________</Typography>
            </Box>
          </Box>
          {/* <Box className="releaseFreebieModal__footer__attachments__photo">
                <Input
                  type="file"
                  sx={{ display: "none" }}
                  inputRef={fileUploadRef}
                  inputProps={{ accept: "image/jpeg, image/png, image/gif" }}
                  onChange={(e) => {
                    handleFileSubmit(e);
                  }}
                />

                {photoProof && (
                  <IconButton
                    className="attachments__column__content__item__viewOwner"
                    onClick={() => {
                      onViewPhotoOpen();
                    }}
                    sx={{
                      color: "secondary.main",
                      border: "none !important",
                      bgcolor: "white !important",
                      position: "absolute",
                      right: "305px",
                      bottom: "83px",
                    }}
                  >
                    <Visibility />
                  </IconButton>
                )}

                <IconButton
                  title="Upload photo"
                  className={photoProof && "filled"}
                  onClick={() => {
                    fileUploadRef.current.click();
                  }}
                  disabled
                >
                  <Attachment />
                </IconButton>
                {/* <IconButton title="Take a picture">
                  <PhotoCamera />
                </IconButton> */}
          {/* <Typography>
                Upload Photo of Customer <br />
                Receiving the Freebies
              </Typography> */}
          {/* </Box> */}
        </Box>
      </Box>
    </Box>
  );
};

function PrintInventoryModal({ data, type, copies = 1, ...otherProps }) {
  console.log(data);
  const [isLoading, setIsLoading] = useState(false);

  const { fullname } = useSelector((state) => state.login);

  const printRef = useRef(null);

  //Functions
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onBeforeGetContent: () => {
      setIsLoading(true);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 500);
      });
    },
    onAfterPrint: () => {
      setIsLoading(false);
    },
  });

  // useEffect(() => {
  //   if (direct && open) {
  //     setSignature(signatureDirect);
  //     setPhotoProof(photoProofDirect);
  //   }
  // }, [open]);

  return (
    <>
      <CommonModal width="900px" {...otherProps} closeTopRight>
        <div style={{ display: "none" }}>
          <Box ref={printRef}>
            {[...Array(copies)].map((_, index) => (
              <PrintingComponent
                type={type}
                data={data}
                index={index}
                style={{ marginTop: index === 0 ? 0 : "40px" }}
              />
            ))}
          </Box>
        </div>
        <PrintingComponent type={type} data={data} fullname={fullname} />

        <Box className="releaseInventoryModal__actionsEnd">
          {/* <DangerButton onClick={onCancelConfirmOpen}>Close</DangerButton> */}
          <SecondaryButton
            onClick={
              // onConfirmOpen
              handlePrint
            }
            disabled={isLoading}
          >
            {/* {direct ? "Save" : "Release"} */}
            {isLoading ? (
              <CircularProgress size="20px" color="white" />
            ) : (
              "Print"
            )}
          </SecondaryButton>
        </Box>
      </CommonModal>
    </>
  );
}

export default PrintInventoryModal;
