import React, { useEffect, useState } from "react";
import CommonModalForm from "../../../CommonModalForm";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { Skeleton } from "@mui/material"; // Import Skeleton from MUI

import { useDispatch, useSelector } from "react-redux";
import CommonTable from "../../../../components/CommonTable";
import { NumericFormat } from "react-number-format";
import useSnackbar from "../../../../hooks/useSnackbar";
import useDisclosure from "../../../../hooks/useDisclosure";
import BBDCallsheetModal from "./BBDCallsheetModal";
import { setSelectedRow } from "../../../../features/misc/reducers/selectedRowSlice";
import {
  useGetAllCallsheetsQuery,
  useUpdateItemsWithBBDMutation,
  useUpdateRemainingInventoryMutation,
} from "../../../../features/inventory-management/api/callsheetApi";
import useConfirm from "../../../../hooks/useConfirm";
import moment from "moment";
import { clearCallsheet } from "../../../../features/inventory-management/reducers/callsheetSlice";

function CallsheetModal({ width, dateFrom, dateTo, onClose, ...props }) {
  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const callsheetItem = useSelector((state) => state.callsheet.items);

  console.log(callsheetItem);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const snackbar = useSnackbar();
  const {
    onOpen: onBbdOpen,
    onClose: onBbdClose,
    isOpen: isBbdOpen,
  } = useDisclosure();

  const [triggerUpdate] = useUpdateItemsWithBBDMutation();

  const { data: callsheetData, isFetching } = useGetAllCallsheetsQuery({
    DateFrom: dateFrom ? moment(dateFrom).format("YYYY-MM-DD") : "",
    DateTo: dateTo ? moment(dateTo).format("YYYY-MM-DD") : "",
    PageSize: 1000,
  });

  const index = callsheetData?.to?.findIndex(
    (item) => item?.clientId === selectedRowData?.clientId
  );

  console.log("customer", index);

  const onSubmit = async () => {
    try {
      confirm({
        children: "Are you sure you want to update callsheet?",
        question: true,
        callback: () => {
          triggerUpdate({
            accessBy: 0,
            items: callsheetItem,
          }).unwrap();
          snackbar({message: "successfully updated callsheet", variant: "success"})
          handleClose();
        },
      });
    } catch (err) {
      console.log(err);
    }
  };
  const handleClose = () => {
    onClose();
    dispatch(clearCallsheet());
    setData(null);
  };

  const handleOpen = (index) => {
    // Ensure selectedRowData and transactionItemsDtos exist
    if (!selectedRowData || !Array.isArray(selectedRowData.callSheetDtos)) {
      console.error(
        "selectedRowData or transactionItemsDtos is undefined or not an array"
      );
      return;
    }

    // Ensure index is within bounds
    if (index < 0 || index >= selectedRowData.callSheetDtos.length) {
      console.error("Index out of bounds:", index);
      return;
    }

    // Set the data correctly using the index
    setData(index);

    // Open the modal
    onBbdOpen();
  };

  return (
    <>
      <CommonModalForm
        title={"Call Sheet"}
        onSubmit={onSubmit}
        onClose={handleClose}
        width={width}
        {...props}
      >
        <Box className="callsheetModal">
          <Box className="callsheetModal__callsheetHeader">
            <Box className="callsheetModal__callsheetHeader__left">
              <Typography>
                Customer Name: {selectedRowData?.customerName}
              </Typography>
            </Box>
            <Box className="callsheetModal__callsheetHeader__right">
              <Typography>
                Business Name: {selectedRowData?.businessName}
              </Typography>
            </Box>
          </Box>
          <TableContainer
            component={Paper}
            sx={{ overflow: "auto", maxHeight: "calc(100dvh - 55dvh)" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item Code</TableCell>
                  <TableCell>Item Description</TableCell>
                  <TableCell>Sales-In</TableCell>
                  <TableCell>Remaining Inv.</TableCell>
                  <TableCell>Ending Inv.</TableCell>
                  <TableCell>Sales-out</TableCell>
                  <TableCell>Suggest PO</TableCell>
                  <TableCell>Average Sales</TableCell>
                  <TableCell>BBD</TableCell>
                </TableRow>
              </TableHead>

              {/* {isFetching ? (
            <ReceivingItemsTableSkeleton />
          ) : ( */}

              <TableBody>
                {isFetching
                  ? // Skeleton Loader (Shows while fetching data)
                    [
                      ...Array(
                        callsheetData?.to[index]?.transactionItemsDtos?.length
                      ),
                    ].map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton variant="text" width={80} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width={150} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width={50} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width={50} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width={50} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width={50} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width={50} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width={50} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="circular" width={40} height={40} />
                        </TableCell>
                      </TableRow>
                    ))
                  : // Actual Data (Shows when data is available)
                    callsheetData?.to[index]?.callSheetDtos?.map(
                      (item, index) => (
                        <TableRow sx={{ height: "50px" }} key={index}>
                          <TableCell sx={{ py: 1 }}>{item?.itemCode}</TableCell>
                          <TableCell sx={{ py: 1 }}>
                            {item?.itemDescription}
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>{item?.salesIn}</TableCell>
                          <TableCell sx={{ py: 1 }}>
                            {item?.remainingInv}
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            {item?.endingInv}
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>{item?.salesOut}</TableCell>
                          <TableCell sx={{ py: 1 }}>
                            {item?.suggestedPo}
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            {item?.averageSales}
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            <IconButton onClick={() => handleOpen(index)}>
                              <Visibility />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      )
                    )}
              </TableBody>

              {/* )} */}
            </Table>
          </TableContainer>
        </Box>
      </CommonModalForm>
      <BBDCallsheetModal
        data={callsheetData?.to[index]}
        index={data}
        width={"1250px"}
        open={isBbdOpen}
        onClose={onBbdClose}
      />
    </>
  );
}

export default CallsheetModal;
