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
import { wrongDeliverSchema } from "../../../../schema/schema";
import { useEffect } from "react";
import { Add, RemoveCircleOutline } from "@mui/icons-material";
import SecondaryButton from "../../../SecondaryButton";
import ControlledAutocomplete from "../../../ControlledAutocomplete";
import { NumericFormat } from "react-number-format";
import useSnackbar from "../../../../hooks/useSnackbar";
import { add } from "lodash";

const WrongDeliverSkeleton = () => {
  return (
    <Box sx={{ padding: "1px" }}>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "calc(100dvh - 30dvh - 360px)" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Wrong Deliver</TableCell>
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

function WrongDeliver({
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
    resolver: yupResolver(wrongDeliverSchema.schema),
    defaultValues: wrongDeliverSchema.defaultValues,
  });

  console.log("test1", watch());

  const { fields, append, remove } = useFieldArray({
    control,
    name: "wrong",
  });

  const wrong = useWatch({
    control,
    name: "wrong",
    defaultValue: [],
  });

  // console.log(wrongDeliver);

  const disableFields = wrongItems.length > 0;

  const handleAdd = () => {
    append({
      item: "",
      itemDescription: "",
      uom: "",
      quantity: null,
      reason: "",
      add: "manual",
    });
  };

  useEffect(() => {
    formData?.items?.forEach((item) => {
      console.log("watching!", item);
      if (
        item.quantity > 0 &&
        item.actualQuantity &&
        item.actualQuantity < item.quantity
      ) {
        // Check if the itemCode already exists in the form
        const existingIndex = fields.findIndex(
          (field) => field.item === item.itemCode
        );

        if (existingIndex !== -1) {
          // If exists, update quantity
          setValue(
            `wrong[${existingIndex}].quantity`,
            item.quantity - item.actualQuantity
          );
        } else {
          // If not, append new entry
          append({
            item: item.itemCode,
            itemDescription: item.itemDescription,
            uom: item.uom,
            quantity: item.quantity - item.actualQuantity,
            reason: "",
            add: "automatic",
          });
        }
      }
    });

    // Remove any existing items where actualQuantity === quantity
    fields.forEach((field, index) => {
      const matchingItem = formData?.items?.find(
        (item) => item.itemCode === field.item
      );
      if (
        matchingItem &&
        field?.add === "automatic" &&
        matchingItem.actualQuantity >= matchingItem.quantity
      ) {
        remove(index);
      }
    });
  }, [formData?.items, append, remove, fields, setValue]);

  useEffect(() => {
    if (wrongItems.length > 0) {
      const transfomedItems = wrongItems.map((item) => ({
        item: { itemCode: item.itemCode },
        ...item,
      }));
      setValue("wrong", transfomedItems);
    }
  }, [wrongItems, setValue]);

  useEffect(() => {
    if (handleFormValid && handleFormData) {
      handleFormValid((prev) => ({ ...prev, isWrongDeliverValid: isValid }));
      handleFormData((prev) => ({
        ...prev,
        wrong: wrong.map((item) => ({
          item: item?.item || "",
          quantity: Number(item.quantity),
          reason: item.reason,
          add: item.add,
        })),
      }));
    }
  }, [wrong, isValid, handleFormValid, handleFormData, disableFields]);

  return isFetching ? (
    <WrongDeliverSkeleton />
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
              <TableCell>Return to Depot</TableCell>
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
                        name={`wrong[${index}].item`}
                        options={
                          formData?.items
                            ?.filter(
                              (item, idx, self) =>
                                self.findIndex(
                                  (i) => i.itemCode === item.itemCode
                                ) === idx // Remove duplicate itemCodes
                            )
                            ?.filter(
                              (item) =>
                                !fields.some(
                                  (field) => field.item === item.itemCode
                                ) // Exclude already chosen items
                            )
                            // ?.filter((item) => item.quantity === null) || [] // Exclude items with no quantity
                        }
                        getOptionLabel={(option) => option?.itemCode || option}
                        isOptionEqualToValue={(option, value) =>
                          option?.itemCode === value?.itemCode
                        }
                        disabled={
                          disableFields ||
                          watch("wrong")[index]?.add === "automatic"
                        }
                        onChange={(_, value) => {
                          setValue(
                            `wrong[${index}].itemDescription`,
                            value?.itemDescription
                          );
                          setValue(`wrong[${index}].uom`, value?.uom);
                          return value?.itemCode;
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
                        name={`wrong[${index}].itemDescription`}
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
                        name={`wrong[${index}].uom`}
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
                        name={`wrong[${index}].quantity`}
                        render={({
                          field: { onChange, onBlur, value, ref },
                        }) => (
                          <NumericFormat
                            customInput={TextField}
                            label="Quantity"
                            size="small"
                            autoComplete="off"
                            value={value || ""}
                            onValueChange={(values) => {
                              const { value: newValue } = values; // Get only numeric value

                              watch("wrong").forEach((item) => {
                                formData.items.forEach((data) => {
                                  if (item.item === data.itemCode) {
                                    if (
                                      parseInt(newValue, 10) >
                                      data?.actualQuantity
                                    ) {
                                      snackbar({
                                        message:
                                          "Quantity exceeds actual quantity",
                                        variant: "error",
                                      });
                                    } else if (parseInt(newValue, 10) < 0) {
                                      snackbar({
                                        message:
                                          "Quantity received must not be negative",
                                        variant: "error",
                                      });
                                    } else {
                                      onChange(newValue);
                                    }
                                  }
                                });
                              });
                            }}
                            onBlur={onBlur}
                            inputRef={ref}
                            sx={{ maxWidth: "120px" }}
                            disabled={
                              disableFields ||
                              watch("wrong")[index]?.add === "automatic"
                              || watch("wrong")[index]?.item === ""
                            }
                            allowNegative={false} // Prevents negative values
                            thousandSeparator="," // Adds commas for readability
                            isAllowed={(values) => /^\d*$/.test(values.value)} // Ensures whole numbers only
                          />
                        )}
                      />

                      <Controller
                        control={control}
                        name={`wrong[${index}].reason`}
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
                            disabled={disableFields || wrongItems}
                          />
                        )}
                      />

                      {!disableFields || wrongItems && (
                        <IconButton  color="error" onClick={() => remove(index)}>
                          <RemoveCircleOutline />
                        </IconButton>
                      )}
                    </Stack>
                  ))}

                  {/* {!disableFields && (
                    <SecondaryButton
                      endIcon={<Add />}
                      sx={{ width: "fit-content", alignSelf: "end" }}
                      onClick={handleAdd}
                      disabled={!isValid || viewing}
                    >
                      Add Wrong Deliver
                    </SecondaryButton>
                  )} */}
                </Stack>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default WrongDeliver;
