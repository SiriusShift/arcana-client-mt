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
  useUpdateRemainingInventoryMutation,
} from "../../../../features/inventory-management/api/callsheetApi";
import useConfirm from "../../../../hooks/useConfirm";
import moment from "moment";

function CallsheetModal({ width, dateFrom, dateTo, onClose, ...props }) {
  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const [data, setData] = useState([]);
  const confirm = useConfirm();
  const {
    onOpen: onBbdOpen,
    onClose: onBbdClose,
    isOpen: isBbdOpen,
  } = useDisclosure();

  const { data: callsheetData, isFetching } = useGetAllCallsheetsQuery({
    DateFrom: dateFrom ? moment(dateFrom).format("YYYY-MM-DD") : "",
    DateTo: dateTo ? moment(dateTo).format("YYYY-MM-DD") : "",
    PageSize: 1000,
  });

  const index = callsheetData?.to?.findIndex(
    (item) => item?.transactionId === selectedRowData?.transactionId
  );

  console.log(index);

  //RTK QUERY
  // const [updateItems] = useUpdateRemainingInventoryMutation();

  //FUNCTIONS

  // const onSubmit = (data) => {
  //   console.log(data);
  //   try {
  //     confirm({
  //       children: "Are you sure you want to update the remaining inventory?",
  //       question: true,
  //       callback: () => {
  //         updateItems({
  //           body: {
  //             transactionItems: data.items.map((item) => ({
  //               transactionItemsId: item?.transactionItemId,
  //               remainingInv: item?.remainingInv,
  //             })),
  //           },
  //           id: selectedRowData?.transactionId,
  //         }).unwrap();
  //         onClose();
  //       },
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleClose = () => {
    onClose();
    setData(null);
  };

  const handleOpen = (index) => {
    // Ensure selectedRowData and transactionItemsDtos exist
    if (
      !selectedRowData ||
      !Array.isArray(selectedRowData.transactionItemsDtos)
    ) {
      console.error(
        "selectedRowData or transactionItemsDtos is undefined or not an array"
      );
      return;
    }

    // Ensure index is within bounds
    if (index < 0 || index >= selectedRowData.transactionItemsDtos.length) {
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
        disableButton={true}
        // onSubmit={handleSubmit(onSubmit)}
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
                    [...Array(callsheetData?.to[index]?.transactionItemsDtos?.length)].map((_, index) => (
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
                    callsheetData?.to[index]?.transactionItemsDtos?.map(
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
        width={"50%"}
        open={isBbdOpen}
        onClose={onBbdClose}
      />
    </>
  );
}

export default CallsheetModal;
