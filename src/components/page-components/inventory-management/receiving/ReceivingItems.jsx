import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { receivingItemsSchema } from "../../../../schema/schema";
import { useEffect } from "react";

const ReceivingItemsTableSkeleton = () => {
  return (
    <TableBody>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell sx={{ py: 1 }}>
            <Skeleton />
          </TableCell>
          <TableCell sx={{ py: 1 }}>
            <Skeleton />
          </TableCell>
          <TableCell sx={{ py: 1 }}>
            <Skeleton />
          </TableCell>
          <TableCell sx={{ py: 1 }}>
            <Skeleton />
          </TableCell>
          <TableCell sx={{ py: 1 }}>
            <Skeleton />
          </TableCell>
          <TableCell sx={{ py: 1 }}>
            <Skeleton />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

function ReceivingItems({
  items = [],
  handleFormValid,
  handleFormData,
  isFetching,
}) {
  const {
    control,
    setValue,
    formState: { isValid },
  } = useForm({
    resolver: yupResolver(receivingItemsSchema.schema),
    defaultValues: receivingItemsSchema.defaultValues,
  });

  const { fields } = useFieldArray({
    control,
    name: "items",
  });

  const watchItems = useWatch({
    control,
    name: "items",
    defaultValue: [],
  });

  const disableFields = items.some((item) => item.quantityReceived);

  useEffect(() => {
    setValue("items", items);
  }, [items, setValue]);

  useEffect(() => {
    if (handleFormValid && handleFormData) {
      handleFormValid((prev) => ({ ...prev, isItemsValid: isValid }));
      handleFormData((prev) => ({
        ...prev,
        items: watchItems.map((item) => ({
          itemCode: item.itemCode,
          quantityReceived: Number(item.quantityReceived),
        })),
      }));
    }
  }, [watchItems, isValid, handleFormValid, handleFormData, disableFields]);

  return (
    <Box sx={{ padding: "1px" }}>
      <TableContainer
        component={Paper}
        sx={{ overflow: "auto", maxHeight: "calc(100dvh - 30dvh - 360px)" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Line</TableCell>
              <TableCell>Item Code</TableCell>
              <TableCell>Item Description</TableCell>
              <TableCell>UOM</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Quantity Received</TableCell>
            </TableRow>
          </TableHead>

          {isFetching ? (
            <ReceivingItemsTableSkeleton />
          ) : (
            <TableBody>
              {fields.map((item, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ py: 1 }}>{index + 1}</TableCell>
                  <TableCell sx={{ py: 1 }}>{item.itemCode}</TableCell>
                  <TableCell sx={{ py: 1 }}>{item.itemDescription}</TableCell>
                  <TableCell sx={{ py: 1 }}>{item.uom}</TableCell>
                  <TableCell sx={{ py: 1 }}>{item.quantity}</TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Controller
                      control={control}
                      name={`items[${index}].quantityReceived`}
                      render={({ field }) => (
                        <TextField
                          size="small"
                          type="number"
                          {...field}
                          value={field.value || ""}
                          inputRef={field.ref}
                          disabled={disableFields}
                        />
                      )}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ReceivingItems;
