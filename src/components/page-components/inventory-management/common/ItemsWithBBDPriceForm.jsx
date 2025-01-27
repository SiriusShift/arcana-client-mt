import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import useItemsWithBbd from "../../../../hooks/page-hooks/useItemsWithBbd";
import { Add, RemoveCircleOutline } from "@mui/icons-material";
import FormItemsSkeleton from "./FormItemsSkeleton";
import ControlledAutocomplete from "../../../ControlledAutocomplete";
import { Controller, useFormContext } from "react-hook-form";
import moment from "moment";
import { NumericFormat } from "react-number-format";
import SecondaryButton from "../../../SecondaryButton";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useGetAllItemsByPriceModeIdQuery } from "../../../../features/setup/api/priceModeItemsApi.js";
import useSnackbar from "../../../../hooks/useSnackbar";
import { useGetAllItemsInventoryQuery } from "../../../../features/inventory-management/api/inventoryMrpApi.js";
import { useLazyGetAllReturnsQuery } from "../../../../features/inventory-management/api/returnApi.js";
import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
const ItemsWithBBDPriceForm = ({
  items = [],
  isFetching,
  itemsFieldName = "items",
  itemsFormTitle = "Product Information",
}) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);  
  const replace = searchParams.get('replace');
  
  const viewOnly = (items?.length > 0 || isFetching )  && !Boolean(replace);
  const snackbar = useSnackbar();

  const [parent] = useAutoAnimate();
  console.log(viewOnly);

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
    dirtyFields,
    setValue,
    control,
    itemsFieldState,
  } = useItemsWithBbd({
    items,
    appendFields: {
      item: null,
      itemDescription: "",
      price: null,
      netPrice: null,
      quantity: null,
      bbd: null,
    },
    itemsFieldName,
    // persistGlobally: true,
  });

  console.log(watchItems);

  const { data: products, isFetching: isProductFetching } =
    useGetAllItemsInventoryQuery();

  const { data: productData } = useGetAllItemsByPriceModeIdQuery(
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


  const { invalid } = itemsFieldState;

  console.log(watchItems);

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
            {itemsFormTitle}
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
                disabled={fields?.length === 0 || !dirtyFields[itemsFieldName]}
                size="small"
              >
                Clear All
              </Button>
            </Box>
          )}
        </Stack>

        <Stack
          p={2}
          height={
            viewOnly
              ? itemsFieldName === "returnItems"
                ? "calc(100dvh - 30dvh - 400px)"
                : itemsFieldName === "replaceItems"
                ? "calc(100dvh - 35dvh - 400px)"
                : "calc(100dvh - 322px)"
              : "calc(100dvh - 370px)"
          }
          overflow="auto"
          boxSizing="border-box"
          gap={1}
          ref={parent}
        >
          {isFetching && isProductsFetching ? (
            <FormItemsSkeleton />
          ) : (
            <>
              {fields.map((item, index) => (
                <Stack key={item.id} direction="row" gap={1}>
                  <ControlledAutocomplete
                    name={`${itemsFieldName}[${index}].item`}
                    control={control}
                    options={
                      itemsFieldName === "returnItems"
                        ? products || []
                        : productData?.priceModeItems || []
                    }
                    getOptionLabel={(option) => option.itemCode || ""}
                    getOptionDisabled={(option) => {
                      // Get all selected items across all rows
                      const selectedItems = watchItems || []; // Default to an empty array if watchItems is undefined
                    
                      // Extract the itemCodes of the selected items, excluding the current row's itemCode
                      const selectedCodes = selectedItems
                        .filter((_, idx) => idx !== index) // Exclude the current row to allow reselecting the same option
                        .map((item) => item?.item?.itemCode) || []; // Ensure no errors if item or itemCode is undefined
                    
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
                        `${itemsFieldName}[${index}].itemDescription`,
                        value?.itemDescription
                      );
                      setValue(
                        `${itemsFieldName}[${index}].price`,
                        value?.currentPrice
                      );
                      setValue(
                        `${itemsFieldName}[${index}].netPrice`,
                        value?.price * watchItems[index].quantity || 0
                      );
                      setValue(`${itemsFieldName}[${index}].bbd`, null);
                      setValue(`${itemsFieldName}[${index}].quantity`, null);
                      return value;
                    }}
                  />

                  <Controller
                    control={control}
                    name={`${itemsFieldName}[${index}].itemDescription`}
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
                    name={`${itemsFieldName}[${index}].price`}
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
                        disabled={viewOnly || itemsFieldName !== "returnItems"}
                        customInput={TextField}
                        thousandSeparator
                        allowLeadingZeros={false}
                        allowNegative={false}
                        prefix="₱"
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name={`${itemsFieldName}[${index}].netPrice`}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <NumericFormat
                        label="Net"
                        size="small"
                        autoComplete="off"
                        onValueChange={(e) => {
                          onChange(e.value === "" ? null : Number(e.value));
                        }}
                        onBlur={onBlur}
                        value={value || ""}
                        inputRef={ref}
                        sx={{ maxWidth: "140px" }}
                        disabled
                        customInput={TextField}
                        thousandSeparator
                        allowLeadingZeros={false}
                        allowNegative={false}
                        prefix="₱"
                      />
                    )}
                  />

                  {/* {itemsFieldName !== "returnItems" ? (
                    <ControlledAutocomplete
                      name={`${itemsFieldName}[${index}].bbd`}
                      control={control}
                      options={
                        viewOnly
                          ? viewOnlyBBDs
                          : watchItems?.[index]?.item?.bbds || []
                      }
                      getOptionLabel={(option) =>
                        moment(option.bbd).format("MMM DD, YYYY")
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

                        setValue(`${itemsFieldName}[${index}].quantity`, null);
                        return value;
                      }}
                    />
                  ) : ( */}
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    {" "}
                    {/* Wrap in LocalizationProvider */}
                    <Controller
                      control={control}
                      name={`${itemsFieldName}[${index}].bbd`}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <DatePicker
                          label="BBD"
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
                          disabled={viewOnly || !watchItems?.[index]?.item}
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
                  {/* )} */}

                  <Stack gap={0.6} alignItems="center">
                    <Controller
                      control={control}
                      name={`${itemsFieldName}[${index}].quantity`}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <NumericFormat
                          label="Quantity"
                          size="small"
                          autoComplete="off"
                          onValueChange={(e) => {
                            const enteredValue =
                              e.value === "" ? null : Number(e.value);
                            const itemPrice = watchItems?.[index]?.price || 0;
                            const net = enteredValue * itemPrice || 0;

                            // Validate against available stock before updating
                            const availQuantity =
                              watchItems[index]?.item?.availQuantity || 0;

                            console.log(watchItems[index]?.item?.availQuantity);

                            // Update the value and net price
                            onChange(enteredValue);
                            setValue(
                              `${itemsFieldName}[${index}].netPrice`,
                              net
                            );
                          }}
                          value={value || ""}
                          isAllowed={({ floatValue }) => {
                            const itemPrice = watchItems?.[index]?.price || 0;
                            const net = (floatValue || 0) * itemPrice;
                            const availQuantity =
                            watchItems[index]?.item?.availQuantity || 0;
                            

                            if (
                              floatValue != null &&
                              floatValue >                               productData?.priceModeItems.find(
                                (item) =>
                                  item.itemCode ===
                                  watchItems[index]?.item?.itemCode
                              )?.availQuantity
                              && itemsFieldName === "replaceItems"
                            ) {
                              snackbar({
                                message: `Quantity cannot exceed available stock (${availQuantity})`,
                                variant: "error",
                              });
                              return; // Prevent state update
                            }

                            // Calculate total net prices for replaceItems
                            const replaceItems = watch("replaceItems") || [];
                            const totalReplacementNet = replaceItems.reduce(
                              (sum, item, i) => {
                                if (i === index) {
                                  return sum + (net || 0); // Add net for the current input
                                }
                                return sum + (item?.netPrice || 0);
                              },
                              0
                            );

                            // Calculate total net prices for returnItems
                            const returnItems = watch("returnItems") || [];
                            const totalReturnNet = returnItems.reduce(
                              (sum, item) => sum + (item?.netPrice || 0),
                              0
                            );

                            // Ensure replacement net does not exceed return net
                            if (totalReplacementNet > (totalReturnNet + 40) && itemsFieldName === "replaceItems") {
                              snackbar({
                                message:
                                  "The total net price of replace items cannot exceed the total net price of return items",
                                variant: "error",
                              });
                              return false; // Disallow input
                            }

                            return true; // Allow valid input
                          }}
                          onBlur={onBlur}
                          inputRef={ref}
                          sx={{ maxWidth: "120px" }}
                          disabled={viewOnly || !watchItems?.[index]?.bbd}
                          customInput={TextField}
                          thousandSeparator
                          allowLeadingZeros={false}
                          allowNegative={false}
                        />
                      )}
                    />

                    {!viewOnly && itemsFieldName !== "returnItems" && (
                      <Typography
                        variant="caption"
                        color="gray"
                        lineHeight="0.5"
                      >
                        {watchItems[index]?.item?.itemCode
                          ?  `Available: ${                              productData?.priceModeItems.find(
                            (item) =>
                              item.itemCode ===
                              watchItems[index]?.item?.itemCode
                          )?.availQuantity}`

                          : "Select BBD first"}
                      </Typography>
                    )}
                  </Stack>

                  <Controller
                  control={control}
                  name={`${itemsFieldName}[${index}].reason`}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <TextField
                      label="Remarks (optional)"
                      size="small"
                      autoComplete="off"
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      ref={ref}
                      sx={{ maxWidth: "200px" }}
                      disabled={viewOnly}
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

              {!viewOnly && (
                <SecondaryButton
                  endIcon={<Add />}
                  sx={{ width: "fit-content", alignSelf: "end" }}
                  onClick={handleAddItem}
                  disabled={invalid && fields?.length > 0}
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

export default ItemsWithBBDPriceForm;
