import {
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import ControlledAutocomplete from "../../../ControlledAutocomplete";
import SecondaryButton from "../../../SecondaryButton";
import { Add, RemoveCircleOutline } from "@mui/icons-material";
import moment from "moment";
import { NumericFormat } from "react-number-format";
import useItemsWithBbd from "../../../../hooks/page-hooks/useItemsWithBbd";
import FormItemsSkeleton from "./FormItemsSkeleton";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useGetAllItemsByPriceModeIdQuery } from "../../../../features/setup/api/priceModeItemsApi";
import useSnackbar from "../../../../hooks/useSnackbar";
import {
  useGetAllItemsInventoryQuery,
  useGetInventoryMrpQuery,
} from "../../../../features/inventory-management/api/inventoryMrpApi";
import { useGetReasonsQuery } from "../../../../features/inventory-management/api/reasonApi";
import { useEffect, useMemo } from "react";

const ItemsWithBBDForm = ({
  items = [],
  isFetching,
  misc,
  miscIssue,
  ourite,
  isTransferOut,
  withBbd,
  withReason,
  moveOrderData,
}) => {
  const viewOnly = items.length > 0 || isFetching;
  const snackbar = useSnackbar();

  console.log(moveOrderData);

  const [parent] = useAutoAnimate();
  const { watch } = useFormContext();
  console.log(watch());

  const {
    bbdCache,
    setBbdCache,
    fields,
    handleAddItem,
    handleRemove,
    handleRemoveAll,
    watchItems,
    // productData,
    isItemsWithBBDFetching,
    isValid,
    dirtyFields,
    setValue,
    control,
    errors,
  } = useItemsWithBbd({ items });

  console.log(watch());

  console.log(watchItems);

  useEffect(() => {
    if (!items && watch("type")?.value === "Outright") {
      setValue("items", [
        {
          item: null,
          itemDescription: "",
          uom: "",
          quantity: null,
          bbd: null,
          reason: "",
          remarks: null,
        },
      ]);
    } else if (!items && watch("type")?.value === "Return Sampling") {
      setValue("items", [
        {
          item: null,
          itemDescription: "",
          uom: "",
          quantity: null,
          reason: "",
          remarks: null,
        },
      ]);
    }
  }, [watch("type")]);

  const { data: productData, isFetching: isProductFetching } =
    useGetAllItemsByPriceModeIdQuery(
      {
        Status: true,
        Page: 1,
        PageSize: 1000,
        PriceModeId: 1,
        ...(watch("to")?.id && miscIssue && { ClusterId: watch("to")?.clusterId }),
      },
      {
        refetchOnMountOrArgChange: true,
      }
    );

  console.log(productData);

  const { data: mrp, isFetching: isInventoryMrpFetching } =
    useGetInventoryMrpQuery(
      {
        PageNumber: 1,
        PageSize: 1000,
      },
      { refetchOnMountOrArgChange: true }
    );

  const {
    data,
    isFetching: isFetchingReason,
    error,
  } = useGetReasonsQuery(
    {
      isActive: true,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  console.log(watch());

  const { data: products, isFetching: isItemsFetching } =
    useGetAllItemsInventoryQuery();

  // Remove duplicates
  const uniqueBBDs = new Set(items.map((item) => item.bbd));
  const viewOnlyBBDs = [...uniqueBBDs].map((bbd) => ({
    bbd: bbd,
  }));

  return (
    <Stack sx={{ padding: "1px" }}>
      <Stack component={Paper}>
        <Stack
          height="50px"
          bgcolor="primary.main"
          borderRadius="5px 5px 0 0"
          justifyContent="space-between"
          alignItems="center"
          px={2}
          direction="row"
        >
          <Typography
            fontSize="1.2rem"
            fontWeight="500"
            sx={{ color: "white !important" }}
          >
            Product Information
          </Typography>

          {!viewOnly && (
            <Box
              sx={{ backgroundColor: "white !important", borderRadius: "5px" }}
            >
              <Button
                color="error"
                variant="outlined"
                endIcon={<RemoveCircleOutline />}
                onClick={handleRemoveAll}
                disabled={fields.length === 0 || !dirtyFields.items}
                size="small"
              >
                Clear All
              </Button>
            </Box>
          )}
        </Stack>

        <Stack
          p={2}
          height={viewOnly ? "calc(100dvh - 322px)" : "calc(100dvh - 370px)"}
          overflow="auto"
          boxSizing="border-box"
          gap={1}
          ref={parent}
        >
          {isFetching || isProductFetching ? (
            <FormItemsSkeleton />
          ) : (
            <>
              {fields?.map((item, index) => (
                <Stack key={item.id} direction="row" gap={1}>
                  <ControlledAutocomplete
                    name={`items[${index}].item`}
                    control={control}
                    options={
                      misc
                        ? products
                        : watch("type")?.value === "Outright"
                          ? watch("moveOrder")?.moveItems.filter(
                            (item) => item?.actualQuantity > 0
                          ) || []
                          : watch("type") === "Return Sampling"
                            ? watch("freebieOrderId")?.freebieOrderItem || []
                            : productData?.priceModeItems || []
                    }
                    getOptionLabel={(option) => option?.itemCode || ""}
                    getOptionDisabled={(option) => {
                      // Get all selected items across all rows
                      const selectedItems = watchItems || []; // Watch all items

                      // Extract the itemCodes of the selected items, excluding the current row's itemCode
                      const selectedCodes =
                        !ourite
                          ? selectedItems
                            ?.filter((_, idx) => idx !== index) // Exclude the current row to allow reselecting the same option
                            ?.map((item) => item?.item?.itemCode)
                          : selectedItems;

                      // Disable the option if its itemCode is already selected in other rows
                      return selectedCodes?.includes(option?.itemCode);
                    }}
                    disabled={viewOnly}
                    isOptionEqualToValue={() => true}
                    loading={isItemsWithBBDFetching}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        label="Item Code"
                        required
                        sx={{ width: "200px" }}
                        helperText={errors?.items?.[index]?.item?.message}
                      />
                    )}
                    onChange={(_, value) => {
                      console.log(value);
                      setValue(
                        `items[${index}].itemDescription`,
                        value?.itemDescription
                      );
                      {
                        isTransferOut &&
                          setValue(
                            `items[${index}].price`,
                            value?.currentPrice
                          );
                      }
                      console.log(
                        products?.find(
                          (item) => item?.itemCode === value?.itemCode
                        )
                      );
                      {
                        watch("type")?.value === "Outright" &&
                          setValue(
                            `items[${index}].received`,
                            value?.actualQuantity
                          );
                        setValue(
                          `items[${index}].price`,
                          products?.find(
                            (item) => item?.itemCode === value?.itemCode
                          )?.currentPrice
                        );
                      }
                      {
                        watch("type") === "Return Sampling" &&
                          setValue(`items[${index}].released`, value?.quantity);
                      }
                      setValue(`items[${index}].uom`, value?.uom);
                      setValue(`items[${index}].bbd`, null);
                      setValue(`items[${index}].quantity`, null);
                      return value;
                    }}
                  />

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
                        helperText={
                          errors?.items?.[index]?.itemDescription?.message
                        }
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
                        helperText={errors?.items?.[index]?.uom?.message}
                        disabled
                      />
                    )}
                  />

                  {isTransferOut && (
                    <Controller
                      control={control}
                      name={`items[${index}].price`}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <NumericFormat
                          label="Price"
                          size="small"
                          autoComplete="off"
                          onValueChange={(e) => {
                            onChange(e.value === "" ? null : Number(e.value));
                          }}
                          onBlur={onBlur}
                          value={value || ""}
                          inputRef={ref}
                          sx={{ maxWidth: "140px" }}
                          disabled={viewOnly}
                          required
                          customInput={TextField}
                          thousandSeparator
                          allowLeadingZeros={false}
                          allowNegative={false}
                          prefix="₱"
                        />
                      )}
                    />
                  )}
                  {/* <ControlledAutocomplete
                    name={`items[${index}].bbd`}
                    control={control}
                    options={
                      viewOnly
                        ? viewOnlyBBDs
                        : watchItems?.[index]?.item?.bbds || []
                    }
                    getOptionLabel={(option) =>
                      moment(option.bbd).format("MMM DD, YYYY") || ""
                    }
                    getOptionDisabled={(option) => {
                      // Check if the bbd is already selected
                      const bbdMap = bbdCache.get(
                        watchItems[index].item.itemCode
                      );
                      return bbdMap?.has(option.bbd);
                    }}
                    disabled={viewOnly || !watchItems?.[index]?.item}
                    isOptionEqualToValue={() => true}
                    loading={isItemsWithBBDFetching}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        label="BBD"
                        sx={{ width: "200px" }}
                      />
                    )}
                    onChange={(_, value) => {
                      // Add the item code to bbds cache

                      setBbdCache((prev) => {
                        const newCache = new Map(prev);

                        // Remove the previous bbd if it exists
                        if (watchItems[index].bbd) {
                          const bbdMap =
                            newCache.get(watchItems[index].item.itemCode) ||
                            new Map();
                          bbdMap.delete(watchItems[index].bbd.bbd);
                        }

                        // If the item code is not in the cache, initialize empty map
                        const bbdMap =
                          newCache.get(watchItems[index].item.itemCode) ||
                          new Map();

                        if (value) {
                          // If the bbd is not in the map, add it
                          bbdMap.set(value.bbd, true);
                        }

                        // Set the new cache
                        newCache.set(watchItems[index].item.itemCode, bbdMap);
                        return newCache;
                      });

                      setValue(`items[${index}].quantity`, null);
                      return value;
                    }}
                  /> */}
                  {withBbd && (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <Controller
                        control={control}
                        name={`items[${index}].bbd`}
                        render={({
                          field: { onChange, onBlur, value, ref },
                        }) => (
                          <DatePicker
                            label="BBD"
                            size="small"
                            slotProps={{
                              textField: {
                                size: "small",
                                required: true,
                              },
                            }}
                            inputFormat="MM/dd/yyyy"
                            value={value ? moment(value) : null} // Convert value to a Moment object
                            onChange={(newValue) => onChange(newValue)} // Handle date changes
                            inputRef={ref}
                            sx={{ width: "200px" }}
                            disabled={
                              viewOnly || !watchItems?.[index]?.item
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                helperText={
                                  errors?.items?.[index]?.bbd?.message
                                }
                                error={!!errors?.items?.[index]?.bbd}
                                autoComplete="off"
                                onBlur={onBlur} // Pass blur event
                              />
                            )}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}

                  {watch("type")?.value === "Outright" && (
                    <Controller
                      control={control}
                      name={`items[${index}].received`}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <NumericFormat
                          label="Received"
                          size="small"
                          onBlur={onBlur}
                          value={value ?? ""}
                          inputRef={ref}
                          sx={{ maxWidth: "120px" }}
                          disabled
                          customInput={TextField}
                          thousandSeparator
                          helperText={errors?.items?.[index]?.received?.message}
                          error={!!errors?.items?.[index]?.received}
                          allowLeadingZeros={false}
                          allowNegative={false}
                        />
                      )}
                    />
                  )}

                  {watch("type") === "Return Sampling" && (
                    <Controller
                      control={control}
                      name={`items[${index}].released`}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <NumericFormat
                          label="Released"
                          size="small"
                          onBlur={onBlur}
                          value={value ?? ""}
                          inputRef={ref}
                          sx={{ maxWidth: "120px" }}
                          disabled
                          customInput={TextField}
                          thousandSeparator
                          helperText={errors?.items?.[index]?.released?.message}
                          error={!!errors?.items?.[index]?.released}
                          allowLeadingZeros={false}
                          allowNegative={false}
                        />
                      )}
                    />
                  )}

                  <Stack gap={0.6} alignItems="center">
                    <Controller
                      control={control}
                      name={`items[${index}].quantity`}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <NumericFormat
                          label="Quantity"
                          size="small"
                          autoComplete="off"
                          required
                          value={value ?? ""}
                          inputRef={ref}
                          customInput={TextField}
                          sx={{ maxWidth: "120px" }}
                          thousandSeparator
                          allowLeadingZeros={false}
                          allowNegative={false}
                          disabled={
                            viewOnly || (withBbd && !watchItems?.[index]?.bbd)
                          }
                          onValueChange={({ floatValue, value: rawValue }) => {
                            onChange(rawValue === "" ? null : floatValue);
                          }}
                          // isAllowed={({ floatValue, value: rawValue }) => {
                          //   // Disallow non-numeric input
                          //   if (!/^\d*$/.test(rawValue)) return false;

                          //   const selectedItem = miscIssue
                          //     ? productData?.priceModeItems?.find(
                          //       (item) =>
                          //         item.itemCode ===
                          //         watchItems[index]?.item?.itemCode
                          //     )
                          //     : mrp?.mo?.find(
                          //       (item) =>
                          //         item.itemCode ===
                          //         watchItems[index]?.item?.itemCode
                          //     );

                          //   console.log(index)
                          //   const totalQuantity =
                          //     watchItems
                          //       .filter(
                          //         (item, i) => {
                          //           console.log(i, index)
                          //           return (item?.item?.itemCode ===
                          //             selectedItem?.itemCode) && (i !== index)
                          //         }
                          //       )
                          //       .reduce((acc, curr) => acc + curr?.quantity, 0)

                          //   console.log(totalQuantity)
                          //   const tempQuantity = Number(totalQuantity) + floatValue;


                          //   const availableQty = miscIssue
                          //     ? selectedItem?.availQuantity
                          //     : selectedItem?.reserve;
                          //   console.log(tempQuantity > availableQty, tempQuantity, availableQty);

                          //   if (
                          //     floatValue != null &&
                          //     !misc &&
                          //     availableQty != null &&
                          //     floatValue > availableQty
                          //   ) {
                          //     snackbar({
                          //       message: `Quantity should not exceed available quantity (${availableQty})`,
                          //       variant: "warning",
                          //     });
                          //     return false;
                          //   } else if (
                          //     ourite &&
                          //     tempQuantity > availableQty
                          //   ) {
                          //     snackbar({
                          //       message: `Quantity should not exceed available quantity (${availableQty})`,
                          //       variant: "warning",
                          //     });
                          //     return false
                          //   } else if (
                          //     watch("type")?.value === "Outright" &&
                          //     floatValue > watch("items")[index]?.received
                          //   ) {
                          //     snackbar({
                          //       message: `Quantity should not exceed received quantity (${watch("items")[index]?.received
                          //         })`,
                          //       variant: "warning",
                          //     });
                          //     return false;
                          //   } else if (
                          //     watch("type") === "Return Sampling" &&
                          //     floatValue > watch("items")[index]?.released
                          //   ) {
                          //     snackbar({
                          //       message: `Quantity should not exceed released quantity (${watch("items")[index]?.released
                          //         })`,
                          //       variant: "warning",
                          //     });
                          //     return false;
                          //   }

                          //   return true;
                          // }}
                          onBlur={onBlur}
                        />
                      )}
                    />
{/* 
                    {!viewOnly && !misc && (
                      <Typography
                        variant="caption"
                        color={`${!watchItems[index]?.item?.itemCode
                          ? "grey"
                          : miscIssue
                            ? productData?.priceModeItems?.find(
                              (item) =>
                                item.itemCode ===
                                watchItems[index]?.item?.itemCode
                            )?.availQuantity > 5
                              ? "success.main"
                              : "error.main"
                            : mrp?.mo?.find(
                              (item) =>
                                item.itemCode ===
                                watchItems[index]?.item?.itemCode
                            )?.reserve > 5
                              ? "success.main"
                              : "error.main"
                          }`}
                        lineHeight="0.5"
                      >
                        {watchItems[index]?.item?.itemCode
                          ? `Available: ${miscIssue
                            ? productData?.priceModeItems?.find(
                              (item) =>
                                item.itemCode ===
                                watchItems[index]?.item?.itemCode
                            )?.availQuantity
                            : mrp?.mo?.find(
                              (item) =>
                                item.itemCode ===
                                watchItems[index]?.item?.itemCode
                            )?.reserve ?? "NONE"
                          }`
                          : "Select BBD first"}
                      </Typography>
                    )} */}
                  </Stack>

                  {withReason && (
                    <ControlledAutocomplete
                      name={`items[${index}].remarks`}
                      control={control}
                      options={data || []}
                      getOptionLabel={(option) => option?.reasonInfo || ""}
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                      loading={isFetchingReason || isFetching}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          label="Reason"
                          sx={{ minWidth: "200px" }}
                        />
                      )}
                      disabled={viewOnly}
                    />
                  )}

                  <Controller
                    control={control}
                    name={`items[${index}].reason`}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        disabled={viewOnly}
                        size="small"
                        label="Remarks (optional)"
                        sx={{ minWidth: "100px" }}
                      />
                    )}
                  />

                  {!viewOnly && (
                    <IconButton
                      color="error"
                      onClick={() => handleRemove(index)}
                    // disabled={watch("type")?.value === "Outright"}
                    >
                      <RemoveCircleOutline />
                    </IconButton>
                  )}
                </Stack>
              ))}

              {!viewOnly &&
                watchItems?.length !==
                (misc
                  ? products?.length
                  : watch("type") === "Return Sampling" ? watch("freebieOrderId")?.freebieOrderItem : productData?.priceModeItems?.length) && (
                  <SecondaryButton
                    endIcon={<Add />}
                    sx={{ width: "fit-content", alignSelf: "end" }}
                    onClick={handleAddItem}
                    disabled={!isValid && fields.length > 0}
                  >
                    Add Item
                  </SecondaryButton>
                )}
            </>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ItemsWithBBDForm;
