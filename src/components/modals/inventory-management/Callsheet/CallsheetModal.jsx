import React from "react";
import CommonModalForm from "../../../CommonModalForm";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { callsheetSchema } from "../../../../schema/schema";
import { Box, TextField, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import CommonTable from "../../../../components/CommonTable";

function CallsheetModal({ width, ...props }) {
  const selectedRowData = useSelector((state) => state.selectedRow.value);

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

  const tableHeads = [
    "Item Code",
    "Item Description",
    "Sales-In",
    "Remaining Inv.",
    "Ending Inv.",
    "Sales-out",
    "Suggest PO",
    "Average Sales",
  ];

  const customOrderKeys = [
    "itemCode",
    "itemDescription",
    "salesIn",
    "remainingInv",
    "endingInv",
    "salesOut",
    "suggestPO",
    "averageSales",
  ];

  return (
    <>
      <CommonModalForm
        title={"Call Sheet"}
        submitText="Update"
        width={width}
        {...props}
      >
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
        <CommonTable
          moveNoDataUp
          moreCompact
          tableHeads={tableHeads}
          customOrderKeys={customOrderKeys}
          mapData={selectedRowData?.items}
        />
      </CommonModalForm>
    </>
  );
}

export default CallsheetModal;
