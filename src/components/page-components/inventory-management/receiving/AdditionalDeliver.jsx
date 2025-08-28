import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { additionalDeliverSchema } from "../../../../schema/schema";
import { useEffect } from "react";
import { Add, RemoveCircleOutline } from "@mui/icons-material";
import SecondaryButton from "../../../SecondaryButton";
import ControlledAutocomplete from "../../../ControlledAutocomplete";
import useSnackbar from "../../../../hooks/useSnackbar";
import { useGetAllProductsQuery } from "../../../../features/setup/api/productsApi";

const AdditionalOrderSkeleton = () => {
  return (
    <Box sx={{ padding: "1px" }}>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "calc(100dvh - 30dvh - 360px)" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Additional Order</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell sx={{ borderBottom: "none" }}>
                <Stack spacing={1}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Stack direction="row" spacing={1.5} key={index}>
                      <Skeleton variant="rectangular" width={140} height={32} />
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={32}
                      />
                      <Skeleton variant="rectangular" width={120} height={32} />
                      <Skeleton variant="rectangular" width={120} height={32} />
                      <Skeleton variant="rectangular" width={120} height={32} />
                    </Stack>
                  ))}
                </Stack>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

function AdditionalDeliver({
  wrongItems = [],
  formData = [],
  items = [],
  handleFormValid,
  handleFormData,
  isFetching,
  viewing,
}) {
  const snackbar = useSnackbar();
  const {
    control,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(additionalDeliverSchema.schema),
    defaultValues: additionalDeliverSchema.defaultValues,
  });

  const { data: products, isFetching: isProductsFetching } =
    useGetAllProductsQuery({
      PageSize: 1000,
    });

  console.log(watch());

  const { fields, append, remove } = useFieldArray({
    control,
    name: "additional",
  });

  const additional = useWatch({
    control,
    name: "additional",
    defaultValue: [],
  });

  // console.log(wrongDeliver);

  const disableFields = wrongItems.length > 0;

  const handleAdd = () => {
    append({
      item: {
        itemCode: "",
        itemDescription: "",
        uom: "",
      },
      itemDescription: "",
      uom: "",
      quantity: null,
      reason: "",
    });
  };

  useEffect(() => {
    if (wrongItems.length > 0) {
      const transfomedItems = wrongItems.map((item) => ({
        item: { itemCode: item.itemCode },
        ...item,
      }));
      setValue("additional", transfomedItems);
    }
  }, [wrongItems, setValue]);

  useEffect(() => {
    if (handleFormValid && handleFormData) {
      handleFormValid((prev) => ({ ...prev, isWrongDeliverValid: isValid }));
      handleFormData((prev) => ({
        ...prev,
        additional: additional.map((item) => ({
          itemCode: item?.item?.itemCode || "",
          quantity: Number(item.quantity),
          reason: item.reason,
        })),
      }));
    }
  }, [additional, isValid, handleFormValid, handleFormData, disableFields]);

  return isFetching ? (
    <AdditionalOrderSkeleton />
  ) : (
    <Box sx={{ padding: "1px" }}>
      <TableContainer
        component={Paper}
        sx={{
          overflow: "auto",
          minHeight: "calc(100dvh - 76dvh)",
          maxHeight: "calc(100dvh - 85dvh)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Additional Order</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell sx={{ borderBottom: "none" }}>
                <Stack spacing={1}>
                  {fields.map((item, index) => (
                    <Stack direction="row" spacing={1.5} key={item.id}>
                      <ControlledAutocomplete
                        control={control}
                        name={`additional[${index}].item`}
                        options={products.items || []}
                        getOptionDisabled={(option) =>
                          fields.some(
                            (field) =>
                              field.item?.itemCode &&
                              field.item?.itemCode === option?.itemCode
                          )
                        }
                        getOptionLabel={(option) => option?.itemCode}
                        isOptionEqualToValue={() => true}
                        disabled={disableFields}
                        onChange={(_, value) => {
                          setValue(
                            `additional[${index}].itemDescription`,
                            value?.itemDescription
                          );
                          setValue(`additional[${index}].uom`, value?.uom);
                          return value;
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            label="Item Code"
                            helperText={errors?.item?.message}
                            error={!!errors?.item}
                            sx={{ width: "140px" }}
                          />
                        )}
                      />

                      <Controller
                        control={control}
                        name={`additional[${index}].itemDescription`}
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
                        name={`additional[${index}].uom`}
                        render={({
                          field: { onChange, onBlur, value, ref },
                        }) => (
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
                        name={`additional[${index}].quantity`}
                        render={({
                          field: { onChange, onBlur, value, ref },
                        }) => (
                          <TextField
                            label="Quantity"
                            size="small"
                            autoComplete="off"
                            onChange={(e) => {
                              const newValue = e.target.value;

                              // Validate input
                              if (parseFloat(newValue) < 0) {
                                snackbar({
                                  message:
                                    "Quantity received must not be a negative value",
                                  variant: "error",
                                });
                              } else {
                                // Update the field with valid value
                                onChange(newValue);

                                // Optionally check if this value affects other fields, e.g.:
                                watch("additional").forEach((item) => {
                                  formData.items.forEach((data) => {
                                    if (item.item?.itemCode === data.itemCode) {
                                      // Your logic here, e.g., comparing quantities if needed
                                      console.log(
                                        "Quantity updated for item",
                                        item
                                      );
                                    }
                                  });
                                });
                              }
                            }}
                            onBlur={onBlur}
                            value={value || ""}
                            inputRef={ref}
                            sx={{ maxWidth: "120px" }}
                            disabled={disableFields}
                          />
                        )}
                      />

                      <Controller
                        control={control}
                        name={`additional[${index}].reason`}
                        render={({
                          field: { onChange, onBlur, value, ref },
                        }) => (
                          <TextField
                            label="Reason"
                            size="small"
                            autoComplete="off"
                            onChange={onChange}
                            onBlur={onBlur}
                            value={value || ""}
                            inputRef={ref}
                            disabled={disableFields}
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
                      disabled={!isValid || viewing}
                    >
                      Add Item
                    </SecondaryButton>
                  )}
                </Stack>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default AdditionalDeliver;
