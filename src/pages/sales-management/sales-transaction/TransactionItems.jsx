import { yupResolver } from "@hookform/resolvers/yup";
import { Add, RemoveCircleOutline } from "@mui/icons-material";
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
    TextField
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import ControlledAutocomplete from "../../../components/ControlledAutocomplete";
import SecondaryButton from "../../../components/SecondaryButton";
import { useGetInventoryMrpQuery } from "../../../features/inventory-management/api/inventoryMrpApi";
import { useGetClientProductsQuery } from "../../../features/setup/api/productsApi";
import useSnackbar from "../../../hooks/useSnackbar";
import { receivingItemsSchema } from "../../../schema/schema";

const TransactionItemsTableSkeleton = () => {
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

function TransactionItems({
    client,
    handleFormValid,
    handleFormData,
    isFetching,
}) {
    const items = client?.moveItems ?? []
    const clientVatable = client?.isVatable
    // const clientVatable = true
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
        useGetClientProductsQuery({
            PageSize: 1000,
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

    const disableFields = items?.some((item) => (item.price && item.quantity));

    useEffect(() => {
        reset({
            items: items?.map((item) => {
                return {
                    itemId: item?.itemId,
                    itemCode: item?.itemCode || "",
                    itemDescription: item?.itemDescription || "",
                    uom: item?.uom || "",
                    quantity: item?.quantity || null,
                    amount: Number(item?.quantity) * Number(item?.unitPrice),
                    price: Number(item?.unitPrice),
                    reason: item?.reason || "",
                    ...(clientVatable && { isVatable: true })
                }
            }),
        });
    }, [items, reset]);


    useEffect(() => {
        if (handleFormValid && handleFormData) {
            handleFormValid((prev) => ({ ...prev, isItemsValid: isValid }));
            handleFormData((prev) => ({
                ...prev,
                items: watchItems.map((item) => ({
                    itemId: item?.itemId,
                    itemCode: item?.itemCode,
                    quantity: Number(item?.actualQuantity),
                    amount: Number(item?.amount),
                    itemDescription: item?.itemDescription,
                    uom: item?.uom,
                    reason: item?.reason,
                    price: Number(item?.price),
                    ...(clientVatable && { isVatable: item?.isVatable })
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
            amount: null,
            reason: "",
        });
    };

    const priceModeItems = products?.clients?.find((c) => c.id === client?.customerCode)?.clientItems

    return (
        <Box sx={{ padding: "1px" }}>
            <TableContainer
                component={Paper}
                sx={{ overflow: "auto", maxHeight: "calc(100dvh - 375px)" }}
            >
                <Table>
                    <TableHead sx={{ position: "sticky", top: 0, zIndex: 10 }}>
                        <TableRow>
                            <TableCell>Line</TableCell>
                        </TableRow>
                    </TableHead>

                    {isProductsFetching || isFetching ? (
                        <TransactionItemsTableSkeleton />
                    ) : (
                        <TableCell sx={{ borderBottom: "none" }}>
                            <Stack spacing={1}>
                                {fields.map((item, index) => {
                                    const itemVatable = item.isVatable; return (
                                        <Stack direction="row" spacing={1.5} key={item.id}>
                                            {/* ControlledAutocomplete for itemCode */}
                                            <ControlledAutocomplete
                                                control={control}
                                                name={`items[${index}].itemCode`}
                                                options={
                                                    priceModeItems?.filter(
                                                        (item) =>
                                                            !watchItems?.some(
                                                                (existingItem, existingIndex) =>
                                                                    existingItem.itemCode === item.itemCode && existingIndex !== index
                                                            ) // Exclude items already selected in other rows
                                                    ) || []
                                                }
                                                getOptionLabel={(option) =>
                                                    typeof option === "string" ? option : option?.itemCode ?? ""
                                                }
                                                isOptionEqualToValue={(option, value) => option?.itemCode === value?.itemCode}
                                                disabled={
                                                    disableFields ||
                                                    watchItems?.some(
                                                        (item, itemIndex) =>
                                                            item.itemCode === items?.[index]?.itemCode
                                                    )
                                                }
                                                onChange={(_, value) => {
                                                    setValue(`items[${index}].itemDescription`, value?.itemDescription || "");
                                                    setValue(`items[${index}].uom`, value?.uomDescription || "");
                                                    setValue(`items[${index}].price`, value?.price || "");
                                                    setValue(`items[${index}].itemId`, value?.id || "");

                                                    return value?.itemCode || "";
                                                }}
                                                renderInput={(params) => (
                                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                                        <TextField
                                                            {...params}
                                                            size="small"
                                                            label="Item Code"
                                                            helperText={errors?.items?.[index]?.itemCode?.message || ""}
                                                            error={!!errors?.items?.[index]?.itemCode}
                                                            sx={{ width: "140px" }}
                                                        // Do NOT override `value` here — Autocomplete already
                                                        // controls the input value via `params`. Manually setting
                                                        // it fights MUI's internal state and can freeze the field.
                                                        />
                                                        {/* 
                                                        {clientVatable && (
                                                            <Typography variant="caption" color={itemVatable ? "success.main" : "text.secondary"}>
                                                                {itemVatable ? "VATable" : "Non-VAT"}
                                                            </Typography>
                                                        )} */}
                                                    </div>
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
                                                                setValue(`items[${index}].amount`, newValue * watch("items")?.[index]?.price);
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


                                            <Controller
                                                control={control}
                                                name={`items[${index}].actualQuantity`}
                                                render={({ field: { onChange, onBlur, value, ref } }) => (
                                                    <TextField
                                                        label="Actual Quantity"
                                                        size="small"
                                                        autoComplete="off"
                                                        type="number"
                                                        onChange={(e) => {
                                                            const newValue = parseFloat(e.target.value);
                                                            if (parseFloat(newValue) < 0) {
                                                                snackbar({
                                                                    message:
                                                                        "Quantity received must not be a negative value",
                                                                    variant: "error",
                                                                });
                                                            } else {
                                                                if (!!watch("items")?.[index].quantity) {
                                                                    const variance = newValue - watch("items")?.[index].quantity
                                                                    setValue(`items[${index}].variance`, variance)
                                                                }
                                                                setValue(`items[${index}].amount`, newValue * watch("items")?.[index]?.price);
                                                                onChange(newValue);
                                                            }
                                                        }}
                                                        onBlur={onBlur}
                                                        value={value ?? ""}
                                                        inputRef={ref}
                                                        sx={{ maxWidth: "120px" }}
                                                    />
                                                )}
                                            />

                                            <Stack gap={0.6} alignItems="center">
                                                <Controller
                                                    control={control}
                                                    name={`items[${index}].price`}
                                                    render={({
                                                        field: { onChange, onBlur, value, ref },
                                                    }) => (
                                                        <NumericFormat
                                                            customInput={TextField}
                                                            label="Price"
                                                            size="small"
                                                            autoComplete="off"
                                                            type="text"
                                                            value={value}
                                                            decimalScale={2}
                                                            fixedDecimalScale
                                                            required
                                                            disabled
                                                            onValueChange={(values) => {
                                                                const numericValue = Number(values.value);

                                                                onChange(numericValue);

                                                                if (watch("items")?.[index]?.actualQuantity === null) return;

                                                                setValue(
                                                                    `items[${index}].amount`,
                                                                    numericValue * watch("items")?.[index]?.actualQuantity
                                                                );
                                                            }}
                                                            onBlur={onBlur}
                                                            inputRef={ref}
                                                            sx={{ maxWidth: "120px" }}
                                                            allowNegative={false}
                                                            thousandSeparator=","
                                                        />
                                                    )}
                                                />

                                                {/* {!disableFields && (
                                                    <Typography
                                                        variant="caption"
                                                        color={
                                                            !watchItems[index]?.itemCode
                                                                ? "gray"
                                                                : data?.mo?.find(
                                                                    (item) =>
                                                                        item.itemCode ===
                                                                        watchItems[index]?.itemCode
                                                                )?.reserve
                                                                    ? data?.mo?.find(
                                                                        (item) =>
                                                                            item.itemCode ===
                                                                            watchItems[index]?.itemCode
                                                                    )?.reserve < 5
                                                                        ? "orange"
                                                                        : "green"
                                                                    : "red"
                                                        }
                                                        lineHeight="0.5"
                                                    >
                                                        {watchItems[index]?.itemCode
                                                            ? `Available: ${data?.mo?.find(
                                                                (item) =>
                                                                    item.itemCode ===
                                                                    watchItems[index]?.itemCode
                                                            )?.soh ?? "NONE"
                                                            }`
                                                            : "Select Item first"}
                                                    </Typography>
                                                )} */}
                                            </Stack>

                                            <Controller
                                                control={control}
                                                name={`items[${index}].amount`}
                                                render={({ field: { onChange, onBlur, value, ref } }) => (
                                                    <NumericFormat
                                                        customInput={TextField}
                                                        label="Amount"
                                                        size="small"
                                                        autoComplete="off"
                                                        type="text"
                                                        value={value}
                                                        decimalScale={2}
                                                        fixedDecimalScale
                                                        required
                                                        onBlur={onBlur}
                                                        disabled
                                                        sx={{ maxWidth: "120px" }}
                                                        allowNegative={false}
                                                        thousandSeparator=","
                                                    />
                                                )}
                                            />

                                            <Controller
                                                control={control}
                                                name={`items[${index}].reason`}
                                                render={({ field: { onChange, onBlur, value, ref } }) => {
                                                    const variance = watch(`items[${index}].variance`);
                                                    const quantity = watchItems[index]?.quantity
                                                    return (
                                                        <TextField
                                                            label="Remarks"
                                                            size="small"
                                                            autoComplete="off"
                                                            onChange={onChange}
                                                            onBlur={onBlur}
                                                            value={value || ""}
                                                            inputRef={ref}
                                                            disabled={disableFields}
                                                            required={variance > 0 || variance < 0 || !quantity}

                                                        // disabled={
                                                        //   disableFields ||
                                                        //   items?.some(
                                                        //     (item, itemIndex) =>
                                                        //       item.itemCode ===
                                                        //         watch(`items[${index}].itemCode`) &&
                                                        //       itemIndex === index // Disable rows with the same itemCode except the current row
                                                        //   )
                                                        // }
                                                        />
                                                    )
                                                }}
                                            />

                                            {!disableFields && (
                                                <IconButton
                                                    disabled={
                                                        disableFields ||
                                                        items?.some(
                                                            (item, itemIndex) =>
                                                                item.itemCode ===
                                                                watch(`items[${index}].itemCode`) &&
                                                                itemIndex === index // Disable rows with the same itemCode except the current row
                                                        )
                                                    }
                                                    color="error"
                                                    onClick={() => remove(index)}
                                                >
                                                    <RemoveCircleOutline />
                                                </IconButton>
                                            )}
                                        </Stack>
                                    )
                                })}

                                {(!disableFields || fields.length > 15) && (
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

export default TransactionItems;
