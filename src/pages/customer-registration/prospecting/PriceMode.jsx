import { yupResolver } from "@hookform/resolvers/yup";
import {
    Add,
    RemoveCircleOutline,
} from "@mui/icons-material";
import {
    Box,
    Button,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Radio,
    RadioGroup,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";

import "../../../assets/styles/drawerForms.styles.scss";

import ControlledAutocomplete from "../../../components/ControlledAutocomplete";
import { priceModeRegistrationSchema } from "../../../schema/schema";

import { useDispatch, useSelector } from "react-redux";
import {
    removePriceModeItem,
    setDirty,
    setIsPriceModeValid,
    setPriceModeId,
    setPriceModeItemPrice,
    setPriceModeItems,
    setTermsAndConditions
} from "../../../features/registration/reducers/regularRegistrationSlice";
import { useGetAllPriceModeForClientsQuery } from "../../../features/setup/api/priceModeSetupApi";
import { useGetAllProductsQuery } from "../../../features/setup/api/productsApi";
import useSnackbar from "../../../hooks/useSnackbar";

const PriceMode = ({ clientStatus, editMode, onOriginalItemsReady }) => {
    const [originalItems, setOriginalItems] = useState()
    const dispatch = useDispatch();
    const snackbar = useSnackbar();
    const isRestoredRef = useRef(false); // ← prevent restore from triggering sync

    const priceModeStore = useSelector(
        (state) => state.regularRegistration.value.priceMode
    );
    const termsAndConditions = useSelector(
        (state) => state.regularRegistration.value.termsAndConditions
    );
    const userDetails = useSelector((state) => state.login.userDetails);

    const editTDO = userDetails.roleName === "TDO" && clientStatus === "Approved" && editMode
    const editHead = userDetails.roleName === "Head" && clientStatus === "Approved" && editMode

    const { data: products } = useGetAllProductsQuery({
        PageSize: 1000,
        Status: true,
    });

    const { data: priceModeData, isLoading: isPriceModeLoading } =
        useGetAllPriceModeForClientsQuery();

    const {
        control,
        setValue,
        watch,
        formState: { errors, isValid, isDirty },
    } = useForm({
        resolver: yupResolver(priceModeRegistrationSchema.schema),
        mode: "onChange",
        defaultValues: priceModeRegistrationSchema.defaultValues,
    });


    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    const watchItems = watch("items");
    useEffect(() => {
        const { priceModeId,
            // isVATable, 

            items = [] } = priceModeStore;

        if (priceModeId != null) {
            setValue("priceMode", priceModeId);
            // setValue("isVATable", isVATable);
        }

        if (items.length) {
            setValue("items", items);

            if (!originalItems) {
                setOriginalItems(items);
                onOriginalItemsReady?.(items);
            }
        }

        isRestoredRef.current = true; // always mark init as done, whether or not there was anything to restore
    }, []);
    // useEffect(() => {
    //     if (!products?.items?.length) return;

    //     const currentItems = watch("items");

    //     currentItems.forEach((item, index) => {
    //         const srp = products.items.find(
    //             p => p.itemCode === item.itemCode?.itemCode
    //         )?.latestSRP;

    //         setValue(`items.${index}.srp`, srp ?? 0);
    //     });
    // }, [products]);
    // ✅ Sync form → Redux
    useEffect(() => {
        const subscription = watch((values) => {
            console.log(values)
            if (!isRestoredRef.current) return;

            dispatch(setPriceModeId(values.priceMode ?? null));

            dispatch(
                setPriceModeItems(
                    values?.items?.map((item) => ({ ...item })) ?? []
                )
            );

            // dispatch(setTax(values.isVATable ?? false));
        });

        return () => subscription.unsubscribe();
    }, [watch, dispatch]);

    // ✅ Sync isValid → Redux
    useEffect(() => {
        dispatch(setIsPriceModeValid(isValid));
    }, [isValid, dispatch]);

    useEffect(() => {
        if (!isDirty) return;
        dispatch(setDirty(true))
    }, [isDirty])

    const handleAddItem = () => {
        append({
            itemCode: null,
            itemDescription: "",
            price: "",
        });
    };

    const handleFixedDiscountChange = (value) => {
        const parsedValue = value !== "" ? parseFloat(value) : value;

        if (
            (parsedValue < 1 || parsedValue > 10) &&
            parsedValue !== "" &&
            parsedValue !== null
        ) {
            snackbar({
                message: "Value must be between 1% and 10%",
                variant: "error",
            });
            return;
        }

        dispatch(
            setTermsAndConditions({
                property: "fixedDiscount",
                value: { discountPercentage: parsedValue === "" ? null : parsedValue },
            })
        );
    };

    return (
        <Box className="priceMode">
            {/* PRICE MODE */}
            <Box className="priceMode__row">
                <Box className="priceMode__mode" sx={{ height: "90%" }}>
                    <Typography className="priceMode__mode__title">
                        Price Mode
                    </Typography>

                    <Controller
                        control={control}
                        name="priceMode"
                        render={({ field }) => (
                            <RadioGroup
                                {...field}
                                row
                                className="priceMode__mode__choices"
                                // ✅ Coerce value to number for RadioGroup comparison
                                value={field.value ?? ""}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    field.onChange(value);

                                    if (value !== 1) {
                                        handleFixedDiscountChange("");
                                    }

                                    dispatch(
                                        setTermsAndConditions({
                                            property: "variableDiscount",
                                            value: false,
                                        })
                                    );
                                }}
                            >
                                {priceModeData?.map((item) => (
                                    <FormControlLabel
                                        key={item.id}
                                        value={item.id}
                                        control={<Radio />}
                                        disabled={editTDO || editHead}
                                        label={item.priceModeDescription}
                                    />
                                ))}
                            </RadioGroup>
                        )}
                    />
                </Box>

                {/* ✅ Coerce to number for comparison */}
                {Number(watch("priceMode")) === 1 && (
                    <Box className="priceMode__mode" sx={{ height: "90%" }}>
                        <Typography className="priceMode__mode__title">
                            Discount
                        </Typography>

                        <RadioGroup
                            row
                            className="priceMode__mode__choices"
                            value={termsAndConditions["variableDiscount"]}
                            onChange={(e) => {
                                dispatch(
                                    setTermsAndConditions({
                                        property: "variableDiscount",
                                        value: e.target.value === "true",
                                    })
                                );
                            }}
                        >
                            <FormControlLabel
                                value={true}
                                control={<Radio />}
                                label="Variable"
                                disabled={editTDO || editHead}

                            />
                            <FormControlLabel
                                value={false}
                                control={<Radio />}
                                label="Fixed"
                                disabled={editTDO || editHead}

                            />


                            <Box className="termsAndConditionsFixedDiscount">
                                <NumericFormat
                                    customInput={TextField}
                                    size="small"
                                    value={
                                        termsAndConditions["fixedDiscount"].discountPercentage !=
                                            null
                                            ? termsAndConditions[
                                                "fixedDiscount"
                                            ].discountPercentage.toString()
                                            : ""
                                    } onValueChange={(values) => {
                                        handleFixedDiscountChange(values.floatValue ?? "");
                                    }}
                                    allowNegative={false}
                                    decimalScale={2}
                                    fixedDecimalScale
                                    sx={{
                                        width: "90px",
                                        "& .MuiInputBase-root": { height: "36px" },
                                    }}
                                    disabled={editTDO}
                                    isAllowed={(values) => {
                                        const { floatValue } = values;

                                        return floatValue == null || (floatValue >= 0 && floatValue <= 10);
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">%</InputAdornment>
                                        ),
                                    }}
                                    error={!!errors?.discount}
                                    helperText={errors?.discount?.message || ""}

                                />
                            </Box>

                        </RadioGroup>
                    </Box>
                )}
                {/* <Box className="priceMode__mode">
                    <Typography className="priceMode__mode__title">
                        Tax
                    </Typography>
                    
                    <Controller
                        control={control}
                        name="isVATable"
                        defaultValue={false}
                        render={({ field }) => (
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                        inputRef={field.ref}
                                        disabled={editTDO || editHead}
                                    />
                                }
                                label={field.value ? "Vatable" : "Non-Vatable"}
                            />
                        )}
                    />
                </Box> */}
            </Box>

            {/* PRODUCTS */}
            <Box className="priceMode__products">
                <Box className="priceMode__products__toolbar">
                    <Typography className="priceMode__products__title">
                        Products
                    </Typography>
                    {!editHead && <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleAddItem}
                    >
                        Add
                    </Button>}

                </Box>

                {fields.map((item, index) => (
                    <Stack
                        key={item.id}
                        direction={{ xs: "row" }}
                        gap={1.5}
                        alignItems="flex-start"
                    >
                        {/* ITEM CODE */}
                        <ControlledAutocomplete
                            control={control}
                            name={`items.${index}.itemCode`}
                            options={
                                products?.items?.filter((product) => {
                                    return !watchItems?.some(
                                        (existingItem, existingIndex) =>
                                            existingItem?.itemCode?.itemCode === product.itemCode &&
                                            existingIndex !== index
                                    );
                                }) || []
                            }
                            getOptionLabel={(option) => option?.itemCode || option}
                            isOptionEqualToValue={(option, value) =>
                                option?.itemCode === value?.itemCode
                            }
                            disabled={
                                originalItems?.some(
                                    (item, itemIndex) =>
                                        item.itemCode?.itemCode ===
                                        watchItems?.[index]?.itemCode?.itemCode &&
                                        itemIndex === index
                                ) && (editTDO || editHead)
                            }
                            onChange={(_, value) => {
                                setValue(
                                    `items.${index}.itemDescription`,
                                    value?.itemDescription || ""
                                );

                                setValue(
                                    `items.${index}.uom`,
                                    value?.uom || ""
                                );

                                // setValue(
                                //     `items.${index}.srp`,
                                //     value?.latestSRP || ""
                                // );


                                return value;
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

                        {/* DESCRIPTION */}
                        <Controller
                            control={control}
                            name={`items.${index}.itemDescription`}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Item Description"
                                    size="small"
                                    disabled
                                    value={field.value || ""}
                                    sx={{ flex: 1, minWidth: 250 }}
                                />
                            )}
                        />
                        {/* 
                        <Controller
                            control={control}
                            name={`items.${index}.srp`}
                            render={({ field: { onChange, onBlur, value, ref } }) => (
                                <NumericFormat
                                    customInput={TextField}
                                    label="SRP"
                                    size="small"
                                    value={value ?? ""}
                                    onBlur={onBlur}
                                    inputRef={ref}

                                    allowNegative={false}
                                    thousandSeparator
                                    decimalScale={2}
                                    disabled fixedDecimalScale
                                    prefix="₱ "
                                    sx={{ width: 170 }}
                                    error={!!errors?.items?.[index]?.price}
                                    helperText={errors?.items?.[index]?.price?.message || ""}
                                />
                            )}
                        /> */}

                        {/* PRICE */}
                        <Controller
                            control={control}
                            name={`items.${index}.price`}
                            render={({ field: { onChange, onBlur, value, ref } }) => (
                                <NumericFormat
                                    customInput={TextField}
                                    label="Price"
                                    size="small"
                                    value={value ?? ""}
                                    onBlur={onBlur}
                                    inputRef={ref}
                                    onValueChange={(values) => {
                                        if (userDetails?.roleName === "Head") {
                                            dispatch(setPriceModeItemPrice({
                                                itemCode: watchItems?.[index]?.itemCode?.itemCode, // ← use watchItems, not item (stale closure)
                                                itemId: watchItems?.[index]?.itemCode?.itemId,
                                                newPrice: values.floatValue,
                                                originalPrice: originalItems?.find(o => o.itemCode?.itemCode === item.itemCode?.itemCode)?.price
                                            }));
                                        }
                                        onChange(values.floatValue ?? "");
                                    }}
                                    allowNegative={false}
                                    thousandSeparator
                                    decimalScale={2}
                                    disabled={
                                        editTDO &&
                                        originalItems?.some(
                                            (item, itemIndex) =>
                                                item.itemCode?.itemCode ===
                                                watchItems?.[index]?.itemCode?.itemCode
                                        )
                                    } fixedDecimalScale
                                    prefix="₱ "
                                    sx={{ width: 170 }}
                                    error={!!errors?.items?.[index]?.price}
                                    helperText={errors?.items?.[index]?.price?.message || ""}
                                />
                            )}
                        />

                        {/* REMOVE */}
                        <IconButton
                            color="error"
                            onClick={() => {
                                if (userDetails?.roleName === "Head") {
                                    dispatch(removePriceModeItem({
                                        itemCode: watchItems?.[index]?.itemCode?.itemCode, // ← use watchItems
                                        itemId: watchItems?.[index]?.itemCode?.itemId,
                                        price: watchItems?.[index]?.price,
                                    }));
                                    dispatch(setDirty(true))
                                }
                                remove(index);
                            }}
                            disabled={
                                // fields.length === 1 ||  // ← combine both conditions
                                (originalItems?.some(
                                    (originalItem, itemIndex) =>
                                        originalItem.itemCode?.itemCode ===
                                        watchItems?.[index]?.itemCode?.itemCode &&
                                        itemIndex === index
                                ) && editTDO)
                            }
                        >
                            <RemoveCircleOutline />
                        </IconButton>
                    </Stack>
                ))}
            </Box>
        </Box>
    );
};

export default PriceMode;