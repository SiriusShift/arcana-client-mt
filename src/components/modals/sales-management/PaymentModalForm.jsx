import { useEffect, useState } from "react";
import CommonModalForm from "../../CommonModalForm";
import { yupResolver } from "@hookform/resolvers/yup";
import { paymentSchema } from "../../../schema/schema";
import { Controller, useForm } from "react-hook-form";
import ControlledAutocomplete from "../../ControlledAutocomplete";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
  Chip,
} from "@mui/material";
import { paymentTypes } from "../../../utils/Constants";
import { NumericFormat } from "react-number-format";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import useSnackbar from "../../../hooks/useSnackbar";
import { handleCatchErrorMessage } from "../../../utils/CustomFunctions";
import useConfirm from "../../../hooks/useConfirm";
import moment from "moment";
import { useLazyGetAdvancePaymentBalanceQuery } from "../../../features/sales-management/api/advancePaymentApi";
import { InfoOutlined, Visibility, ReceiptLong } from "@mui/icons-material";
import ViewPhotoModal from "../ViewPhotoModal";
import useDisclosure from "../../../hooks/useDisclosure";
import { useLazyGetListingFeeBalanceByIdQuery } from "../../../features/listing-fee/api/listingFeeApi";
import { useLazyGetOtherExpensesByClientIdQuery } from "../../../features/registration/api/registrationApi";
import { useLazyGetOtherExpensesBalanceByClientIdQuery } from "../../../features/otherExpenses/api/otherExpensesRegApi";
import { useGetAllOtherExpensesQuery } from "../../../features/setup/api/otherExpensesApi";
import { dummyOnlinePaymentPlatformsData } from "../../../utils/DummyData";
import { useGetAllOnlinePlatformsQuery } from "../../../features/setup/api/onlinePaymentPlatformsApi";

function PaymentModalForm({
  editMode,
  appendPayment,
  updatePayment,
  remainingBalance,
  selectedPayment,
  paymentFields,
  expensesFields,
  client,
  invoice,
  ...props
}) {
  const { open, onClose } = props;
  console.log(expensesFields);
  const [initialEditAmount, setInitialEditAmount] = useState(0);
  //Hooks
  const confirm = useConfirm();
  const snackbar = useSnackbar();

  //Disclosures
  const {
    isOpen: isViewPhotoOpen,
    onOpen: onViewPhotoOpen,
    onClose: onViewPhotoClose,
  } = useDisclosure();

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setValue,
    reset,
    control,
    watch,
  } = useForm({
    resolver: yupResolver(paymentSchema.schema),
    mode: "onChange",
    defaultValues: paymentSchema.defaultValues,
  });

  console.log("1",watch("paymentChannel"));

  //Watch Constants
  const otherExpenseType = watch("otherExpense");

  //RTK Query
  const { data: expensesData, isLoading: isExpensesLoading } =
    useGetAllOtherExpensesQuery({ Status: true, page: 1, pageSize: 1000 });

  const expensesArray = expensesData?.otherExpenses;
  const [triggerAdvancePaymentBalance, { data: advancePaymentData }] =
    useLazyGetAdvancePaymentBalanceQuery();
  const [triggerListingFeeBalance, { data: listingFeeBalanceData }] =
    useLazyGetListingFeeBalanceByIdQuery();
  const {data: onlinePlatforms } = useGetAllOnlinePlatformsQuery({
    pageSize: 1000
  });

  let [
    triggerOtherExpensesBalance,
    { data: otherExpensesBalanceData, error: otherExpensesBalanceError },
  ] = useLazyGetOtherExpensesBalanceByClientIdQuery();
  if (otherExpensesBalanceError) {
    otherExpensesBalanceData = null;
  }

  const remainingAdvancePayment = parseFloat(
    advancePaymentData?.remainingBalance
  );
  const remainingListingFee = parseFloat(listingFeeBalanceData?.totalBalance);
  const remainingOtherExpensesBalance = parseFloat(
    otherExpensesBalanceData?.totalBalance
  );
  //Functions
  const onSubmit = async (data) => {
    console.log("test",data.paymentChannel.onlinePlatform);
    let transformedData;

    if (data.paymentMethod.label === "Cheque") {
      transformedData = {
        paymentMethod: data.paymentMethod,
        paymentAmount: data.paymentAmount,
        // invoiceAttachment: data.invoiceAttachment,
        // chequeAmount: data.paymentAmount,
        payee: data.payee,
        chequeDate: data.chequeDate,
        bankName: data.bankName,
        chequeNo: data.chequeNo,
        dateReceived: data.dateReceived,
        // chequeAmount: Number(data.chequeAmount),
      };
    } else if (data.paymentMethod.label === "Online") {
      transformedData = {
        paymentMethod: data.paymentMethod,
        paymentAmount: data.paymentAmount,
        // invoiceAttachment: data.invoiceAttachment,
        accountName: data.accountName,
        paymentChannel: data.paymentChannel.id,
        referenceNo: data.referenceNo,
      };
    } else if (data.paymentMethod.label === "Withholding") {
      transformedData = {
        paymentMethod: data.paymentMethod,
        paymentAmount: data.paymentAmount,
        // invoiceAttachment: data.invoiceAttachment,
        attachment: data.attachment,
      };
    } else if (data.paymentMethod.label === "Others") {
      transformedData = {
        paymentMethod: data.paymentMethod,
        paymentAmount: data.paymentAmount,
        // invoiceAttachment: data.invoiceAttachment,
        otherExpense: data.otherExpense,
      };
    } else {
      transformedData = {
        paymentMethod: data.paymentMethod,
        paymentAmount: data.paymentAmount,
        // invoiceAttachment: data.invoiceAttachment,
      };
    }

    try {
      const handleCallback = () => {
        if (editMode) {
          updatePayment(selectedPayment.index, transformedData);
        } else {
          const paymentIndex = paymentFields.findIndex(
            (field) =>
              field.paymentMethod.label ===
                transformedData.paymentMethod.label &&
              (transformedData.paymentMethod.label === "Advance Payment" ||
                transformedData.paymentMethod.label === "Listing Fee")
          );

          if (paymentIndex !== -1) {
            const updatedPayment = {
              ...paymentFields[paymentIndex],
              paymentAmount:
                paymentFields[paymentIndex].paymentAmount +
                transformedData.paymentAmount,
            };

            updatePayment(paymentIndex, updatedPayment);
          } else {
            appendPayment(transformedData);
          }
        }
      };

      await confirm({
        children: "Are you sure you want to add this payment?",
        question: true,
        callback: () => handleCallback(),
      });

      // snackbar({ message: "Payment added successfully", type: "success" });
      onClose();
    } catch (error) {
      if (error.isConfirmed) {
        snackbar({ message: handleCatchErrorMessage(error), type: "error" });
      }
    }
  };

  //UseEffect
  useEffect(() => {
    if (!open) {
      reset();
      setInitialEditAmount(0);
    }
  }, [open, reset]);

  useEffect(() => {
    if (editMode && open) {
      const { index, ...paymentInfo } = selectedPayment;
      Object.keys(paymentInfo).forEach((key) => {
        console.log("key", paymentInfo[key]);
        if (key === "chequeDate" || key === "dateReceived") {
          setValue(key, paymentInfo[key] ? moment(paymentInfo[key]) : null);
          return;
        }
        setValue(key, paymentInfo[key]);
      });

      setInitialEditAmount(paymentInfo.paymentAmount);
    }
  }, [open, editMode, selectedPayment, setValue]);

  // useEffect(() => {
  //   if (watchPaymentMethod?.label === "Cash" && !editMode) {
  //     setValue("paymentAmount", remainingBalance);
  //   }
  // }, [watchPaymentMethod, setValue, remainingBalance, editMode]);

  useEffect(() => {
    if (open) {
      triggerAdvancePaymentBalance({ id: client.id });
      triggerListingFeeBalance({ id: client.id });
    }
  }, [
    open,
    triggerAdvancePaymentBalance,
    triggerListingFeeBalance,
    triggerOtherExpensesBalance,
    client,
  ]);

  // console.log(expensesType.findIndex((e) => e.label === watch("otherExpense").label));

  useEffect(() => {
    if (otherExpenseType) {
      triggerOtherExpensesBalance({
        ClientId: client.id,
        OtherExpenseId: otherExpenseType.id,
      });
    }
  }, [otherExpenseType, triggerOtherExpensesBalance, client]);

  return (
    <>
      <CommonModalForm
        title="Payment Form"
        {...props}
        // open={isModalFormOpen}
        // onClose={handleFormClose}
        onSubmit={handleSubmit(onSubmit)}
        disableSubmit={
          !isValid ||
          !isDirty ||
          (watch("paymentMethod")?.label === "Others" &&
            !otherExpensesBalanceData)
        }
        width="800px"
        // height change when in advance payment and listing fee to accomodate the payment balance for them
        height={
          watch("paymentMethod")?.label === "Listing Fee" ||
          watch("paymentMethod")?.label === "Advance Payment"
            ? "350px"
            : "auto"
        }
      >
        <Box className="paymentTransactionModal">
          <Box className="paymentTransactionModal__invoice">
            {invoice.map((invoice, index) => (
              <Chip
                key={index}
                color="primary"
                icon={<ReceiptLong />}
                label={invoice}
                variant="outlined"
              />
            ))}
          </Box>
          <Box className="paymentTransactionModal__header">
            <Box className="paymentTransactionModal__header__item">
              <Typography>Payment Type</Typography>

              <ControlledAutocomplete
                name="paymentMethod"
                control={control}
                options={paymentTypes.filter(
                  (type) =>
                    !paymentFields?.some(
                      (field) =>
                        field.paymentMethod.label === type.label &&
                        field.paymentMethod.label !== "Cheque" &&
                        field.paymentMethod.label !== "Online" &&
                        field.paymentMethod.label !== "Offset" &&
                        field.paymentMethod.label !== "Others"
                    )
                )}
                getOptionLabel={(option) => option.label.toUpperCase()}
                renderOption={(props, option) => {
                  const notifIcon = (
                    <InfoOutlined
                      sx={{
                        fontSize: "20px",
                        color: "notification.main",
                        ml: 1,
                      }}
                    />
                  );

                  const isAdvancePaymentNotif =
                    option.label === "Advance Payment" &&
                    remainingAdvancePayment > 0;

                  const isListingFeeNotif =
                    option.label === "Listing Fee" && remainingListingFee > 0;

                  return (
                    <Tooltip
                      title={
                        isAdvancePaymentNotif || isListingFeeNotif
                          ? "Balance available"
                          : ""
                      }
                      followCursor
                    >
                      <li {...props}>
                        {option.label.toUpperCase()}
                        {isAdvancePaymentNotif && notifIcon}
                        {isListingFeeNotif && notifIcon}
                      </li>
                    </Tooltip>
                  );
                }}
                disableClearable
                isOptionEqualToValue={() => true}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    label="Payment Type"
                    helperText={errors?.paymentMethod?.message}
                    error={errors?.paymentMethod}
                  />
                )}
                onChange={(_, value) => {
                  if (value.label !== "Cheque") {
                    setValue("payee", "");
                    setValue("chequeDate", null);
                    setValue("bankName", "");
                    setValue("chequeNo", "");
                    setValue("dateReceived", null);
                    // setValue("chequeAmount", "");
                  }
                  if (value.label !== "Online") {
                    setValue("accountName", "");
                    setValue("accountNo", "");
                    setValue("referenceNo", "");
                  }
                  if (value.label !== "Offset") {
                    setValue("remarks", "");
                  }

                  if (value.label !== "Withholding") {
                    setValue("attachment", "");
                  }
                  return value;
                }}
              />
            </Box>

            <Box className="paymentTransactionModal__header__item">
              <Typography>Payment Amount</Typography>

              <Controller
                control={control}
                name={"paymentAmount"}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <NumericFormat
                    label="Payment Amount"
                    type="text"
                    size="small"
                    customInput={TextField}
                    autoComplete="off"
                    onValueChange={(e) => {
                      onChange(e.value === "" ? null : Number(e.value));
                    }}
                    isAllowed={(values) => {
                      const { floatValue } = values;

                      const balanceToCompare =
                        watch("paymentMethod").label === "Others"
                          ? parseFloat(otherExpensesBalanceData?.totalBalance)
                          : editMode
                          ? remainingBalance + initialEditAmount
                          : remainingBalance;

                      console.log(balanceToCompare);

                      if (
                        floatValue != null &&
                        floatValue > balanceToCompare &&
                        watch("paymentMethod").label !== "Cheque"
                      ) {
                        snackbar({
                          message: `${
                            watch("paymentMethod").label
                          } cannot be over the remaining balance`,
                          variant: "error",
                        });
                        return false;
                      }

                      if (
                        floatValue != null &&
                        ((floatValue >
                          parseFloat(advancePaymentData?.remainingBalance) &&
                          watch("paymentMethod").label === "Advance Payment") ||
                          (floatValue >
                            parseFloat(listingFeeBalanceData?.totalBalance) &&
                            watch("paymentMethod").label === "Listing Fee"))
                      ) {
                        snackbar({
                          message: `Not enough ${
                            watch("paymentMethod").label
                          } balance`,
                          variant: "error",
                        });
                        return false;
                      }

                      return true;
                    }}
                    inputRef={ref}
                    onBlur={onBlur}
                    value={value || ""}
                    thousandSeparator=","
                    allowNegative={false}
                    allowLeadingZeros={false}
                    prefix="₱"
                    decimalScale={2}
                  />
                )}
              />
            </Box>
            {/* {watch("paymentMethod").label != "Cheque" &&
							watch("paymentMethod").label != "Online" &&
							watch("paymentMethod").label != "Withholding" && (
								<ReceiptInput control={control} errors={errors} watch={watch} />
							)} */}
          </Box>

          <Box className="paymentTransactionModal__otherFields">
            {/* {watch("paymentMethod")?.label !== "Advance Payment" &&
							watch("paymentMethod")?.label !== "Listing Fee" &&
							watch("paymentMethod")?.label !== "Offset" && (
								<ReceiptInput
									onViewPhotoOpen={onViewPhotoOpen}
									control={control}
									errors={errors}
									watch={watch}
								/>
							)} */}

            {watch("paymentMethod")?.label === "Cheque" && (
              <>
                <Controller
                  name="payee"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      label="Payee"
                      size="small"
                      autoComplete="off"
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                      helperText={errors?.payee?.message}
                      error={errors?.payee}
                    />
                  )}
                />

                <Controller
                  name="chequeDate"
                  control={control}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        {...field}
                        label="Cheque Date"
                        slotProps={{
                          textField: { size: "small" },
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            helperText={errors?.chequeDate?.message}
                            error={errors?.chequeDate}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />

                <Controller
                  name="bankName"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      label="Bank Name"
                      size="small"
                      autoComplete="off"
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                      helperText={errors?.bankName?.message}
                      error={errors?.bankName}
                    />
                  )}
                />

                <Controller
                  name="chequeNo"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      label="Cheque No."
                      size="small"
                      autoComplete="off"
                      {...field}
                      helperText={errors?.chequeNo?.message}
                      error={errors?.chequeNo}
                      type="number"
                    />
                  )}
                />

                <Controller
                  name="dateReceived"
                  control={control}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        {...field}
                        label="Date Received"
                        slotProps={{
                          textField: { size: "small" },
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            helperText={errors?.dateReceived?.message}
                            error={errors?.dateReceived}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
              </>
            )}

            {watch("paymentMethod")?.label === "Online" && (
              <>
                <ControlledAutocomplete
                  name="paymentChannel"
                  control={control}
                  options={onlinePlatforms.online.filter(
                    (option) => option.label !== "Cash"
                  )}
                  getOptionLabel={(option) => option.onlinePlatform.toUpperCase()}
                  disableClearable
                  isOptionEqualToValue={() => true}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      label="Payment Channel"
                      helperText={errors?.paymentChannel?.message}
                      error={errors?.paymentChannel}
                    />
                  )}
                />

                <Controller
                  name="accountName"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      label="Account Name"
                      size="small"
                      autoComplete="off"
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                      helperText={errors?.accountName?.message}
                      error={errors?.accountName}
                    />
                  )}
                />

                <Controller
                  name="referenceNo"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      label="Reference Number"
                      size="small"
                      autoComplete="off"
                      {...field}
                      helperText={errors?.referenceNo?.message}
                      error={errors?.referenceNo}
                      type="number"
                    />
                  )}
                />
              </>
            )}

            {watch("paymentMethod")?.label === "Withholding" && (
              <>
                <Controller
                  name="attachment"
                  control={control}
                  render={({ field: { value, onChange, ...field } }) => {
                    return (
                      <TextField
                        {...field}
                        value={value?.fileName}
                        onChange={(e) => {
                          onChange(e.target.files[0]);
                        }}
                        type="file"
                        size="small"
                        label="Attachment"
                        helperText={errors?.attachment?.message}
                        error={errors?.attachment}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          endAdornment: watch("attachment") && (
                            <InputAdornment position="end">
                              <IconButton onClick={onViewPhotoOpen}>
                                <Visibility />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    );
                  }}
                />
              </>
            )}

            {watch("paymentMethod")?.label === "Listing Fee" && (
              <Box className="paymentTransactionModal__footer">
                <Box className="paymentTransactionModal__footer__label">
                  <Typography className="paymentTransactionModal__footer__label__top">
                    Listing Fee
                  </Typography>

                  <Typography className="paymentTransactionModal__footer__label__bottom">
                    (Current Balance)
                  </Typography>
                </Box>

                <Typography className="paymentTransactionModal__footer__value">
                  ₱
                  {listingFeeBalanceData?.totalBalance?.toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </Typography>
              </Box>
            )}

            {watch("paymentMethod")?.label === "Offset" && (
              <Box className="paymentTransactionModal__otherFields">
                <Controller
                  name="remarks"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      label="Remarks"
                      size="small"
                      autoComplete="off"
                      multiline
                      maxRows={3}
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                      helperText={errors?.remarks?.message}
                      error={errors?.remarks}
                    />
                  )}
                />
              </Box>
            )}

            {watch("paymentMethod")?.label === "Advance Payment" && (
              <Box className="paymentTransactionModal__footer">
                <Box className="paymentTransactionModal__footer__label">
                  <Typography className="paymentTransactionModal__footer__label__top">
                    Advance Payment
                  </Typography>

                  <Typography className="paymentTransactionModal__footer__label__bottom">
                    (Current Balance)
                  </Typography>
                </Box>

                <Typography className="paymentTransactionModal__footer__value">
                  ₱
                  {advancePaymentData?.remainingBalance?.toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </Typography>
              </Box>
            )}

            {watch("paymentMethod")?.label === "Others" && (
              <>
                <ControlledAutocomplete
                  name="otherExpense"
                  control={control}
                  options={expensesArray.filter(
                    (type) =>
                      !expensesFields?.some(
                        (field) =>
                          field.otherExpense?.expenseType === type?.expenseType
                      )
                  )}
                  getOptionLabel={(option) => option.expenseType.toUpperCase()}
                  // renderOption={(props, option) => {
                  // 	const notifIcon = (
                  // 		<InfoOutlined
                  // 			sx={{
                  // 				fontSize: "20px",
                  // 				color: "notification.main",
                  // 				ml: 1,
                  // 			}}
                  // 		/>
                  // 	);

                  // 	const isAdvancePaymentNotif =
                  // 		option.label === "Advance Payment" && remainingAdvancePayment > 0;

                  // 	const isListingFeeNotif =
                  // 		option.label === "Listing Fee" && remainingListingFee > 0;

                  // 	return (
                  // 		<Tooltip
                  // 			title={
                  // 				isAdvancePaymentNotif || isListingFeeNotif
                  // 					? "Balance available"
                  // 					: ""
                  // 			}
                  // 			followCursor
                  // 		>
                  // 			<li {...props}>
                  // 				{option.label.toUpperCase()}
                  // 				{isAdvancePaymentNotif && notifIcon}
                  // 				{isListingFeeNotif && notifIcon}
                  // 			</li>
                  // 		</Tooltip>
                  // 	);
                  // }}
                  disableClearable
                  isOptionEqualToValue={() => true}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      label="Expense Type"
                      helperText={errors?.otherExpense?.message}
                      error={errors?.otherExpense}
                    />
                  )}
                  // onChange={(_, value) => {
                  // 	if (value.label !== "Cheque") {
                  // 		setValue("payee", "");
                  // 		setValue("chequeDate", null);
                  // 		setValue("bankName", "");
                  // 		setValue("chequeNo", "");
                  // 		setValue("dateReceived", null);
                  // 		// setValue("chequeAmount", "");
                  // 	}
                  // 	if (value.label !== "Online") {
                  // 		setValue("accountName", "");
                  // 		setValue("accountNo", "");
                  // 		setValue("referenceNo", "");
                  // 	}
                  // 	if (value.label !== "Offset") {
                  // 		setValue("remarks", "");
                  // 	}

                  // 	if (value.label !== "Withholding") {
                  // 		setValue("attachment", "");
                  // 	}
                  // 	return value;
                  // }}
                />
                <Box className="paymentTransactionModal__footer">
                  <Box className="paymentTransactionModal__footer__label">
                    <Typography className="paymentTransactionModal__footer__label__top">
                      {watch("otherExpense")?.expenseType ?? "Others"}
                    </Typography>

                    <Typography className="paymentTransactionModal__footer__label__bottom">
                      (Current Balance)
                    </Typography>
                  </Box>

                  <Typography className="paymentTransactionModal__footer__value">
                    ₱
                    {otherExpensesBalanceData
                      ? otherExpensesBalanceData?.totalBalance?.toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )
                      : "0"}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </CommonModalForm>

      <ViewPhotoModal
        currentViewPhoto={watch("attachment")}
        open={isViewPhotoOpen}
        onClose={onViewPhotoClose}
      />
    </>
  );
}

export default PaymentModalForm;
