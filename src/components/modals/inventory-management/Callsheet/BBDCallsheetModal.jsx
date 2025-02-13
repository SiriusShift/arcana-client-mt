import React, { useEffect, useState } from "react";
import {
  Controller,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonModalForm from "../../../CommonModalForm";
import CommonModal from "../../../CommonModal";
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
  Stack,
} from "@mui/material";
import { useField } from "@mui/x-date-pickers/internals";
import { useSelector } from "react-redux";
import { Add, RemoveCircle } from "@mui/icons-material";
import SecondaryButton from "../../../SecondaryButton";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import useSnackbar from "../../../../hooks/useSnackbar";
import { NumericFormat } from "react-number-format";
import { useUpdateItemsWithBBDMutation } from "../../../../features/inventory-management/api/callsheetApi";
import useConfirm from "../../../../hooks/useConfirm";
import { bbdCallsheet } from "../../../../schema/schema";

function BBDCallsheetModal({ width, onClose, data, open, index, ...props }) {
  const snackbar = useSnackbar();
  const confirm = useConfirm();
  const [totalQuantity, setTotalQuantity] = useState(0);

  const validDataKey = index !== undefined && index !== null ? index : "";
  const dataInformation = data?.transactionItemsDtos?.[validDataKey] || {};
  console.log(dataInformation);

  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
    reset,
    watch,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(bbdCallsheet.schema),
    defaultValues: bbdCallsheet.defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "bbdList",
  });

  console.log(isValid)
  //RTK QUERY

  const [triggerBBD] = useUpdateItemsWithBBDMutation();

  // FUNCTIONS
  const onSubmit = (data) => {
    try {
      confirm({
        children: "Are you sure you want to update the remaining inventory?",
        question: true,
        callback: () => {
          triggerBBD({
            body: {
              itemBbds: data?.bbdList?.map((item) => ({
                quantity: item?.quantity,
                bbd: moment(item?.bbd).format("YYYY-MM-DD"),
                bbdId: item?.bbdId,
              })),
            },
            id: dataInformation?.transactionItemId,
          }).unwrap();
          snackbar({
            message: "Inventory updated successfully",
            variant: "success",
          });
          handleClose();
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  console.log(watch());

  const handleClose = () => {
    console.log("close!");
    reset();
    setTotalQuantity(0);
    onClose();
  };

  const handleAdd = () => {
    append({
      itemCode: dataInformation.itemCode || "",
      itemDescription: dataInformation.itemDescription || "",
      salesIn: dataInformation.salesIn || "",
      quantity: null,
      bbd: "",
    });
  };

  useEffect(() => {
    if (dataInformation && open) {
      reset({
        bbdList:
          dataInformation?.bbbDtos?.map((item) => ({
            itemCode: dataInformation.itemCode || "",
            itemDescription: dataInformation.itemDescription || "",
            salesIn: dataInformation.salesIn || "",
            remainingInv: dataInformation.remainingInv || "",
            quantity: null,
            bbd: item?.bbd ?? "",
            bbdId: item?.bbdId,
          })) || [],
      });
      setTotalQuantity(
        dataInformation?.bbbDtos?.reduce((acc, item) => acc + item.quantity, 0)
      );
    } else if (!open) {
      reset({
        bbdList: [],
      });
      setTotalQuantity(0);
    }
  }, [open, dataInformation, reset]); // Added watch as a dependency to ensure only when dataInformation changes

  const disableFields = fields.some((item) => item.actualQuantity);

  return (
    <>
      <CommonModalForm
        title={"BBD Monitoring"}
        disableSubmit={!isValid}
        submitText="Update"
        open={open}
        onSubmit={handleSubmit(onSubmit)}
        onClose={handleClose}
        width={width}
        {...props}
      >
        {" "}
        <Box className="callsheetModal">
          <Box className="callsheetModal__callsheetHeader">
            <Box className="callsheetModal__callsheetHeader__left">
              <Typography>Customer Name: {data?.customerName}</Typography>
            </Box>
          </Box>
          <TableContainer
            component={Paper}
            sx={{
              overflow: "auto",
              maxHeight: "calc(100dvh - 25dvh - 360px)",
            }}
          >
            <Table>
              <TableHead sx={{ position: "sticky", top: 0, zIndex: 10 }}>
                <TableRow>
                  <TableCell>BBD List</TableCell>
                </TableRow>
              </TableHead>
              <TableCell>
                <Stack spacing={1}>
                  {fields.map((item, index) => (
                    <Stack direction="row" spacing={1.5} key={index}>
                      <Controller
                        name={`bbdList[${index}].itemCode`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Item Code"
                            variant="outlined"
                            size="small"
                            placeholder="Item Code"
                            disabled
                          />
                        )}
                      />
                      <Controller
                        name={`bbdList.${index}.itemDescription`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Item Description"
                            variant="outlined"
                            size="small"
                            placeholder="Item Description"
                            disabled
                          />
                        )}
                      />
                      <Controller
                        name={`bbdList.${index}.salesIn`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Sales In"
                            variant="outlined"
                            size="small"
                            placeholder="Sales In"
                            disabled
                          />
                        )}
                      />
                      <Controller
                        name={`bbdList.${index}.remainingInv`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Remaining"
                            variant="outlined"
                            size="small"
                            placeholder="Sales In"
                            disabled
                          />
                        )}
                      />
                      <Controller
                        name={`bbdList[${index}].quantity`}
                        control={control}
                        render={({ field }) => (
                          <NumericFormat
                            {...field}
                            customInput={TextField} // Use TextField as input
                            size="small"
                            label="Quantity*"
                            type="number"
                            variant="outlined"
                            placeholder="Quantity"
                            allowNegative={false} // Prevents negative values
                            decimalScale={0} // Only whole numbers
                            thousandSeparator // Adds thousand separators for better readability
                            isAllowed={(values) => {
                              const { floatValue } = values; // Extract numerical value\
                              const totalQuantity = watch("bbdList").filter(
                                (item, i) => i !== index
                              );
                              const total =
                                totalQuantity.reduce(
                                  (acc, item) =>
                                    parseFloat(acc) +
                                    (parseFloat(item.quantity) || 0),
                                  0
                                ) + (parseFloat(floatValue) || 0);
                              if (total > dataInformation.salesIn) {
                                snackbar({
                                  message: "Quantity exceeds Sales In",
                                  variant: "error",
                                });
                                return false;
                              }
                              return true;
                            }}
                            onValueChange={(values) => {
                              const { floatValue } = values; // Extract numerical value
                              if (
                                (dataInformation.sales && (floatValue || 0 > dataInformation.remainingInv))
                              ) {
                                snackbar({
                                  message: "Quantity exceeds Sales In",
                                  variant: "error",
                                });
                                return;
                              } else {
                                field.onChange(floatValue || 0); // Ensures it's a number
                                setTotalQuantity(
                                  watch("bbdList").reduce(
                                    (acc, item) =>
                                      Number(acc) +
                                      (Number(item.quantity) || 0),
                                    0
                                  )
                                );
                              }
                            }}
                          />
                        )}
                      />

                      <Controller
                        name={`bbdList[${index}].bbd`}
                        control={control}
                        render={({ field: { onChange, value, ref } }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              slotProps={{
                                textField: {
                                  size: "small",
                                },
                              }}
                              label="BBD*"
                              size="small"
                              value={value ? moment(value) : null}
                              onChange={(newValue) =>
                                onChange(newValue?.toDate())
                              } // ✅ Convert Moment to JS Date
                              inputRef={ref}
                              sx={{ width: "200px" }}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <IconButton color="error" onClick={() => remove(index)}>
                        <RemoveCircle />
                      </IconButton>
                    </Stack>
                  ))}

                  {!disableFields &&
                    (dataInformation?.remainingInv > 0
                      ? totalQuantity < dataInformation.remainingInv
                      : totalQuantity < dataInformation.salesIn) && (
                      <SecondaryButton
                        endIcon={<Add />}
                        sx={{ width: "fit-content", alignSelf: "end" }}
                        onClick={handleAdd}
                        disabled={!isValid}
                      >
                        Add Item
                      </SecondaryButton>
                    )}
                </Stack>
              </TableCell>
            </Table>
          </TableContainer>
        </Box>
      </CommonModalForm>
    </>
  );
}

export default BBDCallsheetModal;
