import {
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { Controller } from "react-hook-form";
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

const ItemsWithBBDForm = ({
  items = [],
  isFetching,
  ourite,
  isTransferOut,
  withBbd,
}) => {
  const viewOnly = items.length > 0 || isFetching;
  const snackbar = useSnackbar();

  console.log(items);

  const [parent] = useAutoAnimate();

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
  } = useItemsWithBbd({ items });

  console.log(watchItems);

  const { data: productData, isFetching: isProductFetching } =
    useGetAllItemsByPriceModeIdQuery(
      {
        Status: true,
        Page: 1,
        PageSize: 1000,
        PriceModeId: 1,
      },
      {
        refetchOnMountOrArgChange: true,
      }
    );

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
          {isFetching ? (
            <FormItemsSkeleton />
          ) : (
            <>
              {fields.map((item, index) => (
                <Stack key={item.id} direction="row" gap={1}>
                  <ControlledAutocomplete
                    name={`items[${index}].item`}
                    control={control}
                    options={productData?.priceModeItems || []}
                    getOptionLabel={(option) => option?.itemCode || ""}
                    getOptionDisabled={(option) => {
                      // Get all selected items across all rows
                      const selectedItems = watchItems || []; // Watch all items

                      // Extract the itemCodes of the selected items, excluding the current row's itemCode
                      const selectedCodes = selectedItems
                        .filter((_, idx) => idx !== index) // Exclude the current row to allow reselecting the same option
                        .map((item) => item?.item?.itemCode);

                      // Disable the option if its itemCode is already selected in other rows
                      return selectedCodes.includes(option.itemCode);
                    }}
                    disabled={viewOnly}
                    isOptionEqualToValue={() => true}
                    loading={isItemsWithBBDFetching}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        label="Item Code"
                        sx={{ width: "200px" }}
                      />
                    )}
                    onChange={(_, value) => {
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
                            label="BBD*"
                            size="small"
                            slotProps={{
                              textField: {
                                size: "small",
                              },
                            }}
                            inputFormat="MM/dd/yyyy"
                            value={value ? moment(value) : null} // Convert value to a Moment object
                            onChange={(newValue) => onChange(newValue)} // Handle date changes
                            inputRef={ref}
                            sx={{ width: "200px" }}
                            disabled={viewOnly || !watchItems?.[index]?.item || ourite}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                autoComplete="off"
                                onBlur={onBlur} // Pass blur event
                              />
                            )}
                          />
                        )}
                      />
                    </LocalizationProvider>
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
                          onValueChange={(e) => {
                            onChange(e.value === "" ? null : Number(e.value));
                          }}
                          isAllowed={(values) => {
                            const { floatValue } = values;

                            if (!/^\d*$/.test(values.value)) return false;

                            if (
                              floatValue != null &&
                              floatValue >
                                productData?.priceModeItems.find(
                                  (item) =>
                                    item.itemCode ===
                                    watchItems[index]?.item?.itemCode
                                )?.availQuantity
                            ) {
                              snackbar({
                                message:
                                  "Quantity should be less than available quantity",
                                variant: "warning",
                              });
                              return false;
                            }
                            return true;

                            // if (
                            //   floatValue != null &&
                            //   floatValue > watchItems?.[index]?.bbd?.quantity
                            // ) {
                            //   return false;
                            // }
                            // return true;
                          }}
                          onBlur={onBlur}
                          value={value || ""}
                          inputRef={ref}
                          sx={{ maxWidth: "120px" }}
                          disabled={
                            viewOnly || (withBbd && !watchItems?.[index]?.bbd)
                          }
                          customInput={TextField}
                          thousandSeparator
                          allowLeadingZeros={false}
                          allowNegative={false}
                        />
                      )}
                    />

                    {!viewOnly && (
                      <Typography
                        variant="caption"
                        color={`${
                          watchItems[index]?.item?.itemCode ? "green" : "grey"
                        }`}
                        lineHeight="0.5"
                      >
                        {watchItems[index]?.item?.itemCode
                          ? `Available: ${
                              productData?.priceModeItems.find(
                                (item) =>
                                  item.itemCode ===
                                  watchItems[index]?.item?.itemCode
                              )?.availQuantity
                            }`
                          : "Select BBD first"}
                      </Typography>
                    )}
                  </Stack>

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
                    >
                      <RemoveCircleOutline />
                    </IconButton>
                  )}
                </Stack>
              ))}

              {!viewOnly &&
                watchItems.length !== productData?.priceModeItems?.length && (
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
