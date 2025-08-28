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
import {
  Controller,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import {
  endingInventorySchema,
  receivingItemsSchema,
} from "../../../../schema/schema";
import { useEffect } from "react";
import useSnackbar from "../../../../hooks/useSnackbar";
import ControlledAutocomplete from "../../../ControlledAutocomplete";
import { useGetAllProductsQuery } from "../../../../features/setup/api/productsApi";
import { Add, RemoveCircleOutline } from "@mui/icons-material";
import SecondaryButton from "../../../SecondaryButton";
import { useGetInventoryMrpQuery } from "../../../../features/inventory-management/api/inventoryMrpApi";
import { NumericFormat } from "react-number-format";

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

function EndingInventoryFormItems({ items = [], isFetching, viewing }) {
  console.log(items)
  const snackbar = useSnackbar();

  const {
    watch,
    control,
    reset,
    formState: { errors, isValid },
    setValue,
  } = useFormContext();

  const { data: products, isFetching: isProductsFetching } =
    useGetAllProductsQuery({
      PageSize: 1000,
      Status: true,
    });

  const { data, isFetching: isInventoryMrpFetching } = useGetInventoryMrpQuery(
    {
      PageNumber: 1,
      PageSize: 1000,
    },
    { refetchOnMountOrArgChange: true }
  );


  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchItems = useWatch({
    control,
    name: "items",
    defaultValue: [],
  });


  const disableFields = items.some((item) => item.actualQuantity);

  useEffect(() => {
    reset({
      items: items?.map((item) => {
        console.log(item.actualCount, item?.stockOnHand);
        return {
          item: products?.items?.filter((product) => product?.itemCode === item?.itemCode)|| "",
          itemId: item?.itemId,
          itemDescription: item?.itemDescription || "",
          uom: item?.uom || "",
          soh: item?.stockOnHand ?? "",
          actualQuantity: item?.actualCount ?? null,
          variance:  item?.actualCount - item?.stockOnHand
              ?? null,
          // reason: item?.reason || "",
        };
      }),
    });
  }, [JSON.stringify(items), reset, products]);

  // console.log(watch());

  // useEffect(() => {
  //   if (handleFormValid && handleFormData) {
  //     handleFormValid((prev) => ({ ...prev, isItemsValid: isValid }));
  //     handleFormData((prev) => ({
  //       ...prev,
  //       items: watchItems.map((item) => ({
  //         itemCode: item?.itemCode,
  //         quantity: Number(item?.quantity),
  //         actualQuantity: Number(item?.actualQuantity),
  //         itemDescription: item?.itemDescription,
  //         uom: item?.uom,
  //         reason: item?.reason,
  //         variance: item?.variance,
  //       })),
  //     }));
  //   }
  // }, [watchItems, isValid, handleFormValid, handleFormData, disableFields]);

  // const handleAdd = () => {
  //   append({
  //     itemCode: "",
  //     itemDescription: "",
  //     uom: "",
  //     quantity: null,
  //     actualQuantity: null,
  //     reason: "",
  //   });
  // };

  return (
    <Box sx={{ padding: "1px" }}>
      <TableContainer
        component={Paper}
        sx={{ overflow: "auto", maxHeight: "calc(100dvh)" }}
      >
        <Table>
          <TableHead sx={{ position: "sticky", top: 0, zIndex: 10 }}>
            <TableRow>
              <TableCell>Line</TableCell>
            </TableRow>
          </TableHead>

          {isProductsFetching || isFetching || isInventoryMrpFetching ? (
            <ReceivingItemsTableSkeleton />
          ) : (
            <TableCell sx={{ borderBottom: "none" }}>
              <Stack spacing={1}>
                {fields.map((item, index) => (
                  <Stack direction="row" spacing={1.5} key={item.id}>
                    {/* ControlledAutocomplete for itemCode */}
                    <ControlledAutocomplete
                      control={control}
                      name={`items[${index}].item`}
                      options={
                        products?.items.filter((product) => {
                          const selected = watch("items") || [];
                          return !selected.some(
                            (existingItem, i) =>
                              existingItem?.itemCode === product.itemCode &&
                              i !== index
                          );
                        }) || []
                      }
                      getOptionLabel={(option) => option[0]?.itemCode}
                      isOptionEqualToValue={(option, value) =>
                        option?.itemCode === value[0]?.itemCode
                      }
                      disabled
                      // ={
                      //   disableFields ||
                      //   items?.some(
                      //     (item, itemIndex) =>
                      //       item.itemCode ===
                      //         watch(`items[${index}].itemCode`) &&
                      //       itemIndex !== index
                      //   )
                      // }
                      onChange={(_, value) => {
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
                          sx={{ flex: 1, width: "200px" }}
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
                      name={`items[${index}].soh`}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <TextField
                          label="SOH"
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
                          value={value ?? ""}
                          inputRef={ref}
                          sx={{ maxWidth: "120px" }}
                          disabled
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name={`items[${index}].actualQuantity`}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <NumericFormat
                          customInput={TextField}
                          label="Actual Quantity"
                          size="small"
                          autoComplete="off"
                          type="text"
                          value={value ?? ""}
                          required
                          onValueChange={(values) => {
                            const { value: newValue } = values;

                            // const quantity =
                            //   parseFloat(watch(`items[${index}].quantity`)) ||
                            //   0;
                            // const maxAllowed = Math.min(quantity * 1.1); // Max 10% increase or +2 units

                            // if (
                            //   parseFloat(newValue) > maxAllowed &&
                            //   watchItems[index]?.quantity !== null
                            // ) {
                            //   snackbar({
                            //     message: `Actual Quantity must not exceed ${maxAllowed}`,
                            //     variant: "warning",
                            //   });
                            // } else {
                            onChange(Number(newValue));
                            if (watch("items")?.[index]?.soh === null) return;
                            setValue(
                              `items[${index}].variance`,
                              newValue - watch("items")?.[index]?.soh
                            );
                            // }
                          }}
                          onBlur={onBlur}
                          inputRef={ref}
                          disabled={disableFields || viewing}
                          sx={{ maxWidth: "120px" }}
                          allowNegative={false} // Prevents negative numbers
                          thousandSeparator="," // Adds comma for thousands
                          isAllowed={(values) => {
                            // const quantity =
                            //   parseFloat(watch(`items[${index}].quantity`)) ||
                            //   0;
                            // const maxAllowed = Math.min(quantity * 1.1);
                            // if (
                            //   parseFloat(values.value) > maxAllowed &&
                            //   watchItems[index]?.quantity !== null
                            // ) {
                            //   snackbar({
                            //     message: `Actual Quantity must not exceed ${maxAllowed}`,
                            //     variant: "warning",
                            //   });
                            //   return false;
                            // }
                            return /^\d*$/.test(values.value);
                          }} // Only whole numbers and within limit
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name={`items[${index}].variance`}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <TextField
                          label="Variance"
                          size="small"
                          autoComplete="off"
                          onChange={onChange}
                          onBlur={onBlur}
                          value={value ?? ""}
                          inputRef={ref}
                          sx={{ maxWidth: "120px" }}
                          disabled
                        />
                      )}
                    />

                    {!disableFields && (
                      <IconButton
                        disabled
                        color="error"
                        onClick={() => remove(index)}
                      >
                        <RemoveCircleOutline />
                      </IconButton>
                    )}
                  </Stack>
                ))}
                {/* 
                {!disableFields && (
                  <SecondaryButton
                    endIcon={<Add />}
                    sx={{ width: "fit-content", alignSelf: "end" }}
                    onClick={handleAdd}
                    disabled={!isValid}
                  >
                    Add Item
                  </SecondaryButton>
                )} */}
              </Stack>
            </TableCell>
          )}
        </Table>
      </TableContainer>
    </Box>
  );
}

export default EndingInventoryFormItems;
