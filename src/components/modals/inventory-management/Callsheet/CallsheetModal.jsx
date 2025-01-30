import React, { useEffect } from "react";
import CommonModalForm from "../../../CommonModalForm";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { callsheetSchema } from "../../../../schema/schema";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import CommonTable from "../../../../components/CommonTable";
import { NumericFormat } from "react-number-format";
import useSnackbar from "../../../../hooks/useSnackbar";

function CallsheetModal({ width, ...props }) {
  const selectedRowData = useSelector((state) => state.selectedRow.value);
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

  console.log(fields);

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
        submitText="Update"
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
            sx={{ overflow: "auto", maxHeight: "calc(100dvh - 25dvh - 360px)" }}
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
                              field.onChange(data.value);
                            }}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>{item?.quantity}</TableCell>
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
