import React, { useEffect, useState } from "react";
import CommonModalForm from "../../../CommonModalForm";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { callsheetSchema } from "../../../../schema/schema";
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

import { useDispatch, useSelector } from "react-redux";
import CommonTable from "../../../../components/CommonTable";
import { NumericFormat } from "react-number-format";
import useSnackbar from "../../../../hooks/useSnackbar";
import useDisclosure from "../../../../hooks/useDisclosure";
import BBDCallsheetModal from "./BBDCallsheetModal";
import { setSelectedRow } from "../../../../features/misc/reducers/selectedRowSlice";
import { useUpdateRemainingInventoryMutation } from "../../../../features/inventory-management/api/callsheetApi";
import useConfirm from "../../../../hooks/useConfirm";

function CallsheetModal({ width, onClose, ...props }) {
  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const [data, setData] = useState([]);
  const confirm = useConfirm();
  const {
    onOpen: onBbdOpen,
    onClose: onBbdClose,
    isOpen: isBbdOpen,
  } = useDisclosure();

  const {
    handleSubmit,
    formState: { errors, isValid, dirtyFields, isDirty },
    setValue,
    reset,
    control,
    watch,
  } = useForm({
    resolver: yupResolver(callsheetSchema.schema),
    mode: "onChange",
    defaultValues: callsheetSchema.defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  //RTK QUERY
  const [updateItems] = useUpdateRemainingInventoryMutation();

  console.log(watch("items"));

  //FUNCTIONS

  const onSubmit = (data) => {
    console.log(data);
    try {
      confirm({
        children: "Are you sure you want to update the remaining inventory?",
        question: true,
        callback: () => {
          updateItems({
            body: {
              transactionItems: data.items.map((item) => ({
                transactionItemsId: item?.transactionItemId,
                remainingInv: item?.remainingInv,
              })),
            },
            id: selectedRowData?.transactionId,
          }).unwrap();
          onClose();
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
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

  useEffect(() => {
    if (selectedRowData) {
      reset({
        ...selectedRowData,
        items: selectedRowData?.transactionItemsDtos?.map((item) => ({
          ...item,
        })),
      });
    }
  }, [selectedRowData]);

  return (
    <>
      <CommonModalForm
        title={"Call Sheet"}
        disableSubmit={!isValid || !isDirty}
        submitText="Update"
        onSubmit={handleSubmit(onSubmit)}
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
                {fields.map((item, index) => {
                  const isRowDirty = !!dirtyFields.items?.[index];

                  return (
                    <TableRow sx={{ height: "50px" }} key={index}>
                      <TableCell sx={{ py: 1 }}>{item?.itemCode}</TableCell>
                      <TableCell sx={{ py: 1 }}>
                        {item?.itemDescription}
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>{item?.salesIn}</TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Controller
                          control={control}
                          name={`items[${index}].remainingInv`}
                          render={({ field }) => (
                            <NumericFormat
                              customInput={TextField}
                              size="small"
                              type="number"
                              {...field}
                              value={field.value || ""}
                              onValueChange={(data) => {
                                const saleOut = item?.salesIn - data.value;
                                const endingInv = data.value - saleOut;
                                console.log(saleOut);
                                setValue(`items[${index}].salesOut`, saleOut);
                                if (endingInv >= 0) {
                                  setValue(
                                    `items[${index}].endingInv`,
                                    endingInv
                                  );
                                } else {
                                  setValue(`items[${index}].endingInv`, 0);
                                }
                                setValue(`items[${index}].suggestPO`, saleOut);
                                setValue(`items[${index}].avgSales`, saleOut);
                                field.onChange(data.value);
                              }}
                              isAllowed={({ value }) => {
                                if (value > item?.salesIn) {
                                  snackbar({
                                    message:
                                      "Value can't be greater than Sales In",
                                    variant: "error",
                                  });
                                  return false;
                                } else {
                                  return true;
                                }
                              }}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Controller
                          control={control}
                          name={`items[${index}].endingInv`}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              size="small"
                              type="number"
                              disabled
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Controller
                          control={control}
                          name={`items[${index}].salesOut`}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              size="small"
                              type="number"
                              disabled
                            />
                          )}
                        />
                      </TableCell>

                      <TableCell sx={{ py: 1 }}>
                        <Controller
                          control={control}
                          name={`items[${index}].suggestedPo`}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              size="small"
                              type="number"
                              disabled
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Controller
                          control={control}
                          name={`items[${index}].averageSales`}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              size="small"
                              type="number"
                              disabled
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <IconButton
                          onClick={() => handleOpen(index)}
                          disabled={isRowDirty}
                        >
                          <Visibility />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              {/* )} */}
            </Table>
          </TableContainer>
        </Box>
      </CommonModalForm>
      <BBDCallsheetModal
        data={data}
        width={"50%"}
        open={isBbdOpen}
        onClose={onBbdClose}
      />
    </>
  );
}

export default CallsheetModal;
