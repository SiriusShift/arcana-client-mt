import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { useEffect, useMemo, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { callsheetApi } from "../../../features/inventory-management/api/callsheetApi";
import { useGetAllClientsQuery } from "../../../features/registration/api/registrationApi";
import { useCreateSalesTransactionMutation, useGetAllClientsForPOSQuery } from "../../../features/sales-management/api/salesTransactionApi";
import { useGetAllDiscountTypesQuery } from "../../../features/setup/api/discountTypeApi";
import { priceModeItemsApi } from "../../../features/setup/api/priceModeItemsApi";
import useReasonConfirm from "../../../hooks/useReasonConfirm";
import useSnackbar from "../../../hooks/useSnackbar";
import { cashoutSchema } from "../../../schema/schema";
import {
  formatPesoAmount,
  handleCatchErrorMessage,
} from "../../../utils/CustomFunctions";
import CommonModalForm from "../../CommonModalForm";
function CashoutModal({ total, totalVat, resetTransaction, orderData, data: salesData, ...props }) {
  const { onClose, open } = props;
  //Hooks
  const reasonConfirm = useReasonConfirm();
  const snackbar = useSnackbar();
  const dispatch = useDispatch();
  const chargeInvoiceRef = useRef();
  const discountRef = useRef();
  const navigate = useNavigate()

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    control,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(cashoutSchema.schema),
    mode: "onSubmit",
    defaultValues: cashoutSchema.defaultValues,
  });

  //Watch Constants
  const watchDiscount = watch("discount");
  const watchSpecialDiscount = watch("specialDiscount");
  const customerVatable = watch("isVatable")
  //Calculations

  const specialDiscountAmount = useMemo(
    () => ((Number(total)) * watchSpecialDiscount) / 100,
    [watchSpecialDiscount, total]
  );

  const discountAmount = useMemo(
    () => (((Number(total))) * watchDiscount) / 100,
    [watchDiscount, total]
  );

  console.log(watchDiscount)


  const netSales = useMemo(
    () => (Number(total)) - (discountAmount ? discountAmount : 0) - (specialDiscountAmount ? specialDiscountAmount : 0),
    [total, discountAmount, specialDiscountAmount]
  );


  //RTK Query
  const [createSalesTransaction] = useCreateSalesTransactionMutation();
  const { data: variableDiscountData } = useGetAllDiscountTypesQuery({
    Status: true,
    Page: 1,
    PageSize: 1000,
  });

  console.log(variableDiscountData)
  const { data, isLoading } =
    useGetAllClientsQuery({
      RegistrationStatus: "Approved",
      PageSize: 2000,
    });
  const {
    data: clientData,
    isLoading: isClientLoading,
    error,
  } = useGetAllClientsForPOSQuery({
    refetchOnMountOrArgChange: true,
  });


  //Constants
  const client = clientData?.find((item) => item.clientId === salesData?.customerCode);
  const items = orderData?.items;

  const discountRange = useMemo(() => {
    let discountRange = null;
    variableDiscountData?.discount?.forEach((discount) => {
      if (total >= discount.minimumAmount && total <= discount.maximumAmount) {
        discountRange = {
          minimumPercentage: discount.minimumPercentage,
          maximumPercentage: discount.maximumPercentage,
        };
      }
    });
    return discountRange || { minimumPercentage: 0, maximumPercentage: 0 };
  }, [variableDiscountData, total]);

  //Functions
  const onSubmit = async (data) => {
    const transformedOrderData = {
      clientId: client?.clientId,
      items: items?.map((item) => ({
        itemId: item?.itemId,
        quantity: item?.quantity,
        unitPrice: item?.price,
      })),
    };

    const combinedData = {
      ...transformedOrderData,
      ...data,
      moveOrderId: orderData?.id,
      clientId: transformedOrderData?.clientId,
      discount: data.discount || 0,
      rebateAmount: data.rebateAmount || 0,
      specialDiscount: data.specialDiscount || 0,
      specialDiscountId: data.specialDiscountId || null,
      isOneTimeSp: data.isOneTimeSp || null,
    };

    console.log(combinedData)


    try {
      await reasonConfirm({
        children: <>Confirm finalization of transaction?</>,
        question: true,
        inputLabel: "Remarks (Optional)",
        requireReason: false,
        callback: async (remarks) => {
          try {
            // Wait for the createSalesTransaction to complete
            const response = await createSalesTransaction({
              ...combinedData,
              remarks,
            }).unwrap();

            // Once the transaction is successful, invalidate the tags
            dispatch(
              priceModeItemsApi.util.invalidateTags(["Price Mode Items"])
            );
            dispatch(callsheetApi.util.invalidateTags(["Callsheet"]));

            onClose();
            navigate("/sales-management/sales-transaction")
            return response; // Return the response so it can be handled as necessary

          } catch (error) {
            // Handle errors appropriately
            throw error; // You can throw the error or handle it differently
          }
        },
      });

      resetTransaction();
      handleClose();
      snackbar({
        message: "Transaction successfully added!",
        variant: "success",
      });
      navigate(0);
    } catch (error) {
      if (error?.isConfirmed) {
        snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
      }
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  //UseEffect
  useEffect(() => {
    if (open) {
      if (client?.variableDiscount) {
        setTimeout(() => {
          discountRef.current.focus();
          discountRef.current.select();
        }, 0);
      } else {
        setTimeout(() => {
          chargeInvoiceRef.current.focus();
          chargeInvoiceRef.current.select();
        }, 0);
      }
    }
  }, [open, client]);

  useEffect(() => {
    if (open) {
      // !client?.variableDiscount &&
      setValue("discount", Number(client?.discountPercentage) * 100);
      setValue("specialDiscount", Number(client?.specialDiscount) * 100);
      setValue("specialDiscountId", client?.specialDiscountId);
      setValue("isOneTimeSp", client?.isOnetimeSp);
      setValue("invoiceType", "Charge")
    }
  }, [open, setValue, client]);

  return (
    <CommonModalForm
      onSubmit={handleSubmit(onSubmit)}
      title="Complete Order"
      // width="800px"
      width="600px"
      disableSubmit={!isValid || !isDirty}
      {...props}
      onClose={handleClose}
    >
      <Box className="cashoutModal">

        <Box className="cashoutModal__businessInfo">
          <Box className="cashoutModal__businessInfo__business">
            <Typography fontWeight="500" fontSize="1.05rem">
              Branch Name
            </Typography>

            <Typography fontSize="1.05rem">{salesData?.customerName}</Typography>
          </Box>

          {/* <Box className="cashoutModal__businessInfo__owner">
            <Typography fontWeight="500" fontSize="1.05rem">
              Branch Name
            </Typography>

            <Typography fontSize="1.05rem">{watch("clientId")?.branchName}</Typography>
          </Box> */}

          {/* {`${client?.businessName} - ${client?.ownersName}`} */}
        </Box>

        <Box className="cashoutModal__transactionInfo">
          <Typography className="cashoutModal__transactionInfo__title">
            Sales Amount
          </Typography>

          <Box className="cashoutModal__transactionInfo__costBreakdown">
            <Box className="cashoutModal__transactionInfo__costBreakdown__item">
              <Typography className="cashoutModal__transactionInfo__costBreakdown__item__label">
                Amount Due
              </Typography>

              <Typography className="cashoutModal__transactionInfo__costBreakdown__item__value">
                {formatPesoAmount(Number(total))}
              </Typography>
            </Box>


            <Box className="cashoutModal__transactionInfo__costBreakdown__item">
              <Box className="cashoutModal__transactionInfo__costBreakdown__item__labelDiscount">
                <Typography className="cashoutModal__transactionInfo__costBreakdown__item__labelDiscount__label">
                  Discount
                </Typography>

                <Typography className="cashoutModal__transactionInfo__costBreakdown__item__labelDiscount__value">
                  {watch("clientId")?.variableDiscount ? (
                    <Controller
                      control={control}
                      name="discount"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <NumericFormat
                          type="text"
                          size="small"
                          customInput={TextField}
                          autoComplete="off"
                          value={value || ""}
                          onValueChange={(e) => onChange(Number(e.value))}
                          onBlur={onBlur}
                          inputRef={discountRef}
                          inputProps={{
                            style: {
                              width: "60px",
                              //  padding: "0.5px 10px"
                              padding: "5px 10px",
                            },
                          }}
                          isAllowed={(values) => {
                            const { floatValue } = values;
                            // Check if the floatValue is greater than maximum amount and less than minimum amount and show a snackbar
                            if (
                              floatValue != null &&
                              (floatValue <
                                discountRange.minimumPercentage * 100 ||
                                floatValue >
                                discountRange.maximumPercentage * 100)
                            ) {
                              snackbar({
                                message: `Discount should be between ${discountRange.minimumPercentage * 100
                                  }% and ${discountRange.maximumPercentage * 100
                                  }%`,
                                variant: "error",
                              });
                              return false;
                            }
                            return true;
                          }}
                          thousandSeparator=","
                          allowNegative={false}
                          allowLeadingZeros={false}
                          decimalScale={2}
                          fixedDecimalScale
                          suffix="%"
                        />
                      )}
                    />
                  ) : watch("discount") != null ? (
                    `(${watch("discount")?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}%)`
                  ) : ""}
                </Typography>
              </Box>

              <Typography className="cashoutModal__transactionInfo__costBreakdown__item__value">
                -{discountAmount ? formatPesoAmount(discountAmount) : ""}
              </Typography>
            </Box>

            {/* <Box className="cashoutModal__transactionInfo__costBreakdown__item">
              <Box className="cashoutModal__transactionInfo__costBreakdown__item__labelDiscount">
                <Typography className="cashoutModal__transactionInfo__costBreakdown__item__labelDiscount__label">
                  Rebate
                </Typography>

                <Typography className="cashoutModal__transactionInfo__costBreakdown__item__labelDiscount__value">
                  <Controller
                    control={control}
                    name="rebateAmount"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <NumericFormat
                        type="text"
                        size="small"
                        customInput={TextField}
                        autoComplete="off"
                        value={value || ""}
                        onValueChange={(e) => onChange(Number(e.value))}
                        onBlur={onBlur}
                        inputRef={discountRef}
                        inputProps={{
                          style: {
                            width: "60px",
                            //  padding: "0.5px 10px"
                            padding: "5px 10px",
                          },
                        }}
                        isAllowed={(values) => {
                          const { floatValue } = values;
                          // Check if the floatValue is greater than maximum amount and less than minimum amount and show a snackbar
                          if (floatValue != null && floatValue > (total - discountAmount - specialDiscountAmount)) { 
                            snackbar({
                              message: `Discount should not exceed the total amount`,
                              variant: "error",
                            });
                            return false;
                          }
                          return true;
                        }}
                        thousandSeparator=","
                        allowNegative={false}
                        allowLeadingZeros={false}
                        fixedDecimalScale
                      />
                    )}
                  />
                </Typography>
              </Box>

              <Typography className="cashoutModal__transactionInfo__costBreakdown__item__value">
                -{watchRebate ? formatPesoAmount(watchRebate) : ""}
              </Typography>
            </Box> */}

            <Box className="cashoutModal__transactionInfo__costBreakdown__item">
              <Box className="cashoutModal__transactionInfo__costBreakdown__item__labelDiscount">
                <Typography className="cashoutModal__transactionInfo__costBreakdown__item__labelDiscount__label">
                  Special Discount
                </Typography>

                <Typography className="cashoutModal__transactionInfo__costBreakdown__item__labelDiscount__value">
                  {watch("specialDiscount") > 0 &&
                    `(${watch("specialDiscount")?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionsDigits: 2,
                    })}%)`}
                </Typography>
              </Box>

              <Typography className="cashoutModal__transactionInfo__costBreakdown__item__value">
                -
                {specialDiscountAmount > 0 &&
                  `${formatPesoAmount(specialDiscountAmount)}`}
              </Typography>
            </Box>


            <Divider sx={{ my: "10px" }} />
            {/* 
            {customerVatable && <Box className="cashoutModal__transactionInfo__costBreakdown__vat">
              <Typography className="cashoutModal__transactionInfo__costBreakdown__vat__label">
                VAT
              </Typography>

              <Typography className="cashoutModal__transactionInfo__costBreakdown__vat__value">
                {formatPesoAmount(totalVat)}
              </Typography>
            </Box>} */}

            <Box className="cashoutModal__transactionInfo__costBreakdown__net">
              <Typography className="cashoutModal__transactionInfo__costBreakdown__net__label">
                Net of Sales
              </Typography>

              <Typography className="cashoutModal__transactionInfo__costBreakdown__net__value">
                {formatPesoAmount(netSales)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* <Controller
          name="remarks"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              label="Remarks (Optional)"
              size="small"
              autoComplete="off"
              {...field}
              inputRef={chargeInvoiceRef}
              onChange={(e) => field.onChange(e.target.value.toUpperCase())}
              helperText={errors?.payee?.message}
              error={errors?.payee}
              multiline
              maxRows={3}
            />
          )}
        /> */}

        <Box className="cashoutModal__input">
          <Controller
            control={control}
            name="invoiceType"
            render={({ field }) => (
              <RadioGroup {...field} row>
                <FormControlLabel
                  value="Charge"
                  control={<Radio />}
                  label="Charge"
                />
                {/* <FormControlLabel
                  value="Sales"
                  control={<Radio />}
                  label="Sales"
                /> */}
              </RadioGroup>
            )}
          />

          <Controller
            name="invoiceNo"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                label="Invoice No."
                size="small"
                autoComplete="off"
                type="number"
                {...field}
                inputRef={chargeInvoiceRef}
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                helperText={errors?.payee?.message}
                error={errors?.payee}
              />
            )}
          />
        </Box>
        <Box className="cashoutModal__input">
          <Controller
            name="orDate"
            control={control}
            defaultValue={null} // ✅ Use null, not empty string
            render={({ field: { onChange, value, ...rest } }) => (
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  {...rest}
                  value={value || null} // ✅ Ensure Moment or null
                  onChange={(date) => onChange(date)} // ✅ Pass Moment value to controller
                  label="OR Date"
                  shouldDisableDate={(date) => {
                    const today = moment();

                    const minDate =
                      today.date() <= 5
                        ? today.clone().subtract(1, "month").startOf("month") // First day of previous month
                        : today.clone().startOf("month"); // First day of current month

                    return (
                      date.isBefore(minDate, "day") ||
                      date.isAfter(today, "day")
                    );
                  }}                // disabled
                  slotProps={{
                    textField: { size: "small" },
                  }}
                />
              </LocalizationProvider>
            )}
          />
          <Controller
            name="drNo"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                label="DR No."
                size="small"
                autoComplete="off"
                type="number"
                {...field}
                inputRef={chargeInvoiceRef}
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                helperText={errors?.payee?.message}
                error={errors?.payee}
              />
            )}
          />
        </Box>
      </Box>

      {/* <Box className="cashoutModal">
          <TextField
            label="Business Name - Owner's Name"
            size="small"
            readOnly
            value={`${client?.businessName} - ${client?.ownersName}`}
            sx={{
              gridColumn: "span 2",
              "& .MuiInputBase-root": {
                backgroundColor: "#f1f1f1",
              },
              pointerEvents: "none",
            }}
          />

          <NumericFormat
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: "#f1f1f1",
              },
              pointerEvents: "none",
            }}
            label="Amount Due (₱)"
            type="text"
            size="small"
            customInput={TextField}
            autoComplete="off"
            value={total?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionsDigits: 2,
            })}
            thousandSeparator=","
            allowNegative={false}
            allowLeadingZeros={false}
            decimalScale={2}
            readOnly
            prefix="₱"
          />

          <NumericFormat
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: "#f1f1f1",
              },
              pointerEvents: "none",
            }}
            label="Net of Sales (₱)"
            type="text"
            size="small"
            customInput={TextField}
            autoComplete="off"
            value={netSales?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionsDigits: 2,
            })}
            thousandSeparator=","
            allowNegative={false}
            allowLeadingZeros={false}
            decimalScale={2}
            readOnly
            prefix="₱"
          />

          <NumericFormat
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: "#f1f1f1",
              },
              pointerEvents: "none",
            }}
            label="Special Discount (%)"
            type="text"
            size="small"
            customInput={TextField}
            autoComplete="off"
            value={(specialDiscount * 100)?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionsDigits: 2,
            })}
            thousandSeparator=","
            allowNegative={false}
            allowLeadingZeros={false}
            decimalScale={2}
            readOnly
            suffix="%"
          />

          <NumericFormat
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: "#f1f1f1",
              },
              pointerEvents: "none",
            }}
            label="Special Discount Amount (₱)"
            type="text"
            size="small"
            customInput={TextField}
            autoComplete="off"
            value={specialDiscountAmount?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionsDigits: 2,
            })}
            thousandSeparator=","
            allowNegative={false}
            allowLeadingZeros={false}
            decimalScale={2}
            readOnly
            prefix="₱"
          />

          <NumericFormat
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: "#f1f1f1",
              },
              pointerEvents: "none",
            }}
            label="Discount (%)"
            type="text"
            size="small"
            customInput={TextField}
            autoComplete="off"
            value={(discount * 100)?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionsDigits: 2,
            })}
            thousandSeparator=","
            allowNegative={false}
            allowLeadingZeros={false}
            decimalScale={2}
            readOnly
            suffix="%"
          />

          <NumericFormat
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: "#f1f1f1",
              },
              pointerEvents: "none",
            }}
            label="Discount Amount (₱)"
            type="text"
            size="small"
            customInput={TextField}
            autoComplete="off"
            value={discountAmount?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionsDigits: 2,
            })}
            thousandSeparator=","
            allowNegative={false}
            allowLeadingZeros={false}
            decimalScale={2}
            readOnly
            prefix="₱"
          />

          <Box></Box>

          <Controller
            name="invoiceNo"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                label="Charge Invoice No."
                size="small"
                autoComplete="off"
                type="number"
                {...field}
                inputRef={chargeInvoiceRef}
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                helperText={errors?.payee?.message}
                error={errors?.payee}
              />
            )}
          />
        </Box> */}
    </CommonModalForm>
  );
}

export default CashoutModal;
