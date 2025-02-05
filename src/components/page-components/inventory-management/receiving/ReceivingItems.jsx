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
  Stack,
  TextField,
  IconButton,
  Typography,
} from "@mui/material";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { receivingItemsSchema } from "../../../../schema/schema";
import { useEffect } from "react";
import useSnackbar from "../../../../hooks/useSnackbar";
import ControlledAutocomplete from "../../../ControlledAutocomplete";
import { useGetAllProductsQuery } from "../../../../features/setup/api/productsApi";
import { Add, RemoveCircleOutline } from "@mui/icons-material";
import SecondaryButton from "../../../SecondaryButton";
import { useGetInventoryMrpQuery } from "../../../../features/inventory-management/api/inventoryMrpApi";

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
  const snackbar = useSnackbar();
  const {
    control,
    reset,
    setValue,
    watch,
    formState: { isValid, errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(receivingItemsSchema.schema),
    defaultValues: receivingItemsSchema.defaultValues,
  });

  const { data: products, isFetching: isProductsFetching } =
    useGetAllProductsQuery({
      PageSize: 1000,
    });

  const { data, isFetching: isInventoryMrpFetching } = useGetInventoryMrpQuery(
    {
      PageNumber: 1,
      PageSize: 1000,
    },
    { refetchOnMountOrArgChange: true }
  );

  console.log(data);

  console.log(watch());

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchItems = useWatch({
    control,
    name: "items",
    defaultValue: [],
  });

  console.log(watchItems);

  const disableFields = items.some((item) => item.actualQuantity);

  useEffect(() => {
    reset({
      items: items?.map((item) => ({
        itemCode: item?.itemCode || "",
        itemDescription: item?.itemDescription || "",
        uom: item?.uom || "",
        quantity: item?.quantity || null,
        actualQuantity: item?.actualQuantity || null,
        reason: item?.reason || "",
      })),
    });
  }, [items, reset]);

  useEffect(() => {
    if (handleFormValid && handleFormData) {
      handleFormValid((prev) => ({ ...prev, isItemsValid: isValid }));
      handleFormData((prev) => ({
        ...prev,
        items: watchItems.map((item) => ({
          itemCode: item?.itemCode,
          quantity: Number(item?.quantity),
          actualQuantity: Number(item?.actualQuantity),
          reason: item?.reason,
        })),
      }));
    }
  }, [watchItems, isValid, handleFormValid, handleFormData, disableFields]);

  const handleAdd = () => {
    append({
      itemCode: "",
      itemDescription: "",
      uom: "",
      quantity: null,
      actualQuantity: null,
      reason: "",
    });
  };

  return (
    <Box sx={{ padding: "1px" }}>
      <TableContainer
        component={Paper}
        sx={{ overflow: "auto", maxHeight: "calc(100dvh - 25dvh - 360px)" }}
      >
        <Table>
          <TableHead sx={{ position: "sticky", top: 0, zIndex: 10 }}>
            <TableRow>
              <TableCell>Line</TableCell>
            </TableRow>
          </TableHead>

          {isProductsFetching ? (
            <ReceivingItemsTableSkeleton />
          ) : (
            <TableCell sx={{ borderBottom: "none" }}>
              <Stack spacing={1}>
                {fields.map((item, index) => (
                  <Stack direction="row" spacing={1.5} key={item.id}>
                    {/* ControlledAutocomplete for itemCode */}
                    <ControlledAutocomplete
                      control={control}
                      name={`items[${index}].itemCode`}
                      options={products?.items || []}
                      getOptionLabel={(option) => option?.itemCode || option}
                      isOptionEqualToValue={(option, value) =>
                        option?.itemCode === value?.itemCode
                      }
                      disabled={
                        disableFields ||
                        items?.some(
                          (item, itemIndex) =>
                            item.itemCode ===
                              watch(`items[${index}].itemCode`) &&
                            itemIndex === index // Disable rows with the same itemCode except the current row
                        )
                      }
                      onChange={(_, value) => {
                        console.log(value);
                        // Set relevant fields when a product is selected
                        setValue(
                          `items[${index}].itemDescription`,
                          value?.itemDescription || ""
                        );
                        setValue(`items[${index}].uom`, value?.uom || "");
                        return value?.itemCode;
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          label="Item Code"
                          helperText={
                            errors?.items?.[index]?.itemCode?.message || ""
                          }
                          error={!!errors?.items?.[index]?.itemCode}
                          sx={{ width: "140px" }}
                          value={params.value?.itemCode || ""} // Ensure itemCode is displayed correctly
                        />
                      )}
                    />

                    {/* Controlled TextFields for other fields */}
                    <Controller
                      control={control}
                      name={`items[${index}].itemDescription`}
                      render={({ field }) => (
                        <TextField
                          label="Item Description"
                          size="small"
                          autoComplete="off"
                          {...field}
                          value={field.value || ""}
                          inputRef={field.ref}
                          disabled
                          sx={{ flex: 1 }}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name={`items[${index}].uom`}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <TextField
                          label="UOM"
                          size="small"
                          autoComplete="off"
                          onChange={onChange}
                          onBlur={onBlur}
                          value={value || ""}
                          inputRef={ref}
                          sx={{ maxWidth: "120px" }}
                          disabled
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name={`items[${index}].quantity`}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <TextField
                          label="Quantity"
                          size="small"
                          autoComplete="off"
                          type="number"
                          onChange={(e) => {
                            const newValue = e.target.value;
                            if (parseFloat(newValue) < 0) {
                              snackbar({
                                message:
                                  "Quantity received must not be a negative value",
                                variant: "error",
                              });
                            } else {
                              onChange(newValue);
                            }
                          }}
                          onBlur={onBlur}
                          value={value || ""}
                          inputRef={ref}
                          sx={{ maxWidth: "120px" }}
                          disabled
                        />
                      )}
                    />

                    <Stack gap={0.6} alignItems="center">
                      <Controller
                        control={control}
                        name={`items[${index}].actualQuantity`}
                        render={({
                          field: { onChange, onBlur, value, ref },
                        }) => (
                          <TextField
                            label="Actual Quantity"
                            size="small"
                            autoComplete="off"
                            type="number"
                            onChange={(e) => {
                              const newValue = e.target.value;
                              const quantity = watch(
                                `items[${index}].quantity`
                              ); // Watch the quantity field

                              if (
                                parseFloat(newValue) >
                                  parseFloat(quantity) * 1.1 &&
                                items?.some(
                                  (item, itemIndex) =>
                                    item.itemCode ===
                                      watch(`items[${index}].itemCode`) &&
                                    itemIndex === index // Disable rows with the same itemCode except the current row
                                )
                              ) {
                                snackbar({
                                  message:
                                    "Actual Quantity must not exceed Quantity",
                                  variant: "warning",
                                });
                              } else {
                                onChange(newValue); // Only update if the value is valid
                              }
                            }}
                            onBlur={onBlur}
                            value={value || ""}
                            inputRef={ref}
                            disabled={disableFields}
                            sx={{ maxWidth: "120px" }}
                          />
                        )}
                      />
                      
                    {!disableFields && (
                      <Typography
                        variant="caption"
                        color="gray"
                        lineHeight="0.5"
                      >
                        {watchItems[index]?.itemCode
                          ? `SOH: ${
                              data?.mo.find(
                                (item) =>
                                  item.itemCode ===
                                  watchItems[index]?.itemCode
                              )?.soh
                            }`
                          : "Select Item first"}
                      </Typography>
                    )}
                    </Stack>

                    <Controller
                      control={control}
                      name={`items[${index}].reason`}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <TextField
                          label="Remarks (optional)"
                          size="small"
                          autoComplete="off"
                          onChange={onChange}
                          onBlur={onBlur}
                          value={value || ""}
                          inputRef={ref}
                          disabled={
                            disableFields ||
                            items?.some(
                              (item, itemIndex) =>
                                item.itemCode ===
                                  watch(`items[${index}].itemCode`) &&
                                itemIndex === index // Disable rows with the same itemCode except the current row
                            )
                          }
                        />
                      )}
                    />

                    {!disableFields && (
                      <IconButton color="error" onClick={() => remove(index)}>
                        <RemoveCircleOutline />
                      </IconButton>
                    )}
                  </Stack>
                ))}

                {!disableFields && (
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
          )}
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ReceivingItems;
