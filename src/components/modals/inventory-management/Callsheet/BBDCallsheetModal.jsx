import React, { useEffect, useState } from "react";
import { bbdCallsheet } from "../../../../schema/schema";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonModalForm from "../../../CommonModalForm";
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

function BBDCallsheetModal({ width, onClose, data, ...props }) {
  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const snackbar = useSnackbar();
  const confirm = useConfirm();
  const [totalQuantity, setTotalQuantity] = useState(0);
  console.log(totalQuantity);
  const validDataKey = data !== undefined && data !== null ? data : "";
  const dataInformation =
    selectedRowData?.transactionItemsDtos?.[validDataKey] || {};

  console.log(dataInformation);

  const {
    handleSubmit,
    formState: { errors, isValid, dirtyFields, isDirty },
    setValue,
    reset,
    control,
    watch,
  } = useForm({
    resolver: yupResolver(bbdCallsheet.schema),
    mode: "onChange",
    defaultValues: bbdCallsheet.defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "bbdList",
  });
  //RTK QUERY

  const [triggerBBD] = useUpdateItemsWithBBDMutation();

  //FUNCTIONS
  const onSubmit = (data) => {
    console.log(data);
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
              })),
            },
            id: dataInformation?.transactionItemId,
          }).unwrap();
          console.log("test");
          onClose();
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  console.log(watch());

  const handleClose = () => {
    reset(bbdCallsheet.defaultValues);
    console.log(watch());
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
    if (dataInformation) {
      reset({
        bbdList: [
          ...(Array.isArray(dataInformation?.bbbDtos) &&
          dataInformation?.bbbDtos.length > 0
            ? dataInformation.bbbDtos.map((item) => ({
                itemCode: dataInformation.itemCode || "",
                itemDescription: dataInformation.itemDescription || "",
                salesIn: dataInformation.salesIn || "",
                quantity: item?.quantity ?? null,
                bbd: item?.bbd ?? "",
              }))
            : []),

          // {
          //   itemCode: dataInformation.itemCode || "",
          //   itemDescription: dataInformation.itemDescription || "",
          //   salesIn: dataInformation.salesIn || "",
          //   quantity: null,
          //   bbd: "",
          // },
        ],
      });
    }
  }, [data, reset]);

  const disableFields = fields.some((item) => item.actualQuantity);

  return (
    <>
      <CommonModalForm
        title={"BBD Monitoring"}
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
                              if ((floatValue || 0) > dataInformation.salesIn) {
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
                    totalQuantity < dataInformation.salesIn && (
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
