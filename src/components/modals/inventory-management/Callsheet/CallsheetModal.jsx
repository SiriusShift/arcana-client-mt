import React, { useEffect } from "react";
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
  IconButton
} from "@mui/material";
import { Visibility } from "@mui/icons-material";

import { useSelector } from "react-redux";
import CommonTable from "../../../../components/CommonTable";
import { NumericFormat } from "react-number-format";
import useSnackbar from "../../../../hooks/useSnackbar";

function CallsheetModal({ width, onClose, ...props }) {
  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const [endingInv, setEndingInv] = React.useState(0);
  const [salesOut, setSalesOut] = React.useState(0);
  const snackbar = useSnackbar();

  const {
    handleSubmit,
    formState: { errors, isValid, isDirty },
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

  console.log(watch("items"));

  const handleClose = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    if (selectedRowData) {
      reset({
        ...selectedRowData,
      });
    }
  }, [selectedRowData]);

  return (
    <>
      <CommonModalForm
        title={"Call Sheet"}
        disableSubmit={!isValid || !isDirty}
        submitText="Update"
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
                {fields.map((item, index) => (
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
                              console.log(saleOut);
                              setValue(`items[${index}].salesOut`, saleOut);
                              setValue(
                                `items[${index}].endingInv`,
                                data.value - saleOut
                              );
                              setValue(`items[${index}].suggestPO`, saleOut);
                              setValue(`items[${index}].avgSales`, saleOut);
                              field.onChange(data.value);
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
                        name={`items[${index}].suggestPO`}
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
                        name={`items[${index}].avgSales`}
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
                      <IconButton>
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              {/* )} */}
            </Table>
          </TableContainer>
        </Box>
      </CommonModalForm>
    </>
  );
}

export default CallsheetModal;
