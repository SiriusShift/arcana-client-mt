import {
  Add,
  EditOutlined,
  KeyboardDoubleArrowLeft,
  Payment,
  Receipt,
  RemoveCircleOutline,
  Visibility,
} from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  InputAdornment,
  Button,
  Checkbox,
  Divider,
  IconButton,
  TextField,
  Input,
  Tooltip,
  Typography,
} from "@mui/material";
import { useGetAllClientsQuery } from "../../features/registration/api/registrationApi";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SecondaryButton from "../../components/SecondaryButton";
import useDisclosure from "../../hooks/useDisclosure";
import PaymentModalForm from "../../components/modals/sales-management/PaymentModalForm";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { paymentTransactionSchema } from "../../schema/schema";
import useConfirm from "../../hooks/useConfirm";
import useSnackbar from "../../hooks/useSnackbar";
import {
  formatPesoAmount,
  handleCatchErrorMessage,
} from "../../utils/CustomFunctions";
import { getIconElement } from "../../components/GetIconElement";
import { paymentTransactionApi, useCreatePaymentTransactionMutation } from "../../features/sales-management/api/paymentTransactionApi";
import PaymentListSkeleton from "../../components/skeletons/PaymentListSkeleton";
import PaymentHistoriesModal from "../../components/modals/sales-management/PaymentHistoriesModal";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useLazyGetAllSalesTransactionQuery } from "../../features/sales-management/api/salesTransactionApi";
import moment from "moment";
import ReceiptInput from "../../components/modals/sales-management/ReceiptInput";
import ViewPhotoModal from "../../components/modals/ViewPhotoModal";
import { useDispatch } from "react-redux";

function PaymentPage({
  setPaymentMode,
  clientFromInvoicePage,
  invoiceId,
  invoiceNo,
}) {
  console.log(invoiceId, invoiceNo);
  const [client, setClient] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState({});

  //Hooks
  const confirm = useConfirm();
  const snackbar = useSnackbar();
  const dispatch = useDispatch();
  const checkboxRef = useRef(null);
  const receiptUploadRef = useRef();
  const [parent] = useAutoAnimate();

  // Disclosures
  const {
    isOpen: isModalFormOpen,
    onOpen: onModalFormOpen,
    onClose: onModalFormClose,
  } = useDisclosure();

  const {
    isOpen: isPaymentHistoriesOpen,
    onOpen: onPaymentHistoriesOpen,
    onClose: onPaymentHistoriesClose,
  } = useDisclosure();

  const {
    isOpen: isViewPhotoOpen,
    onOpen: onViewPhotoOpen,
    onClose: onViewPhotoClose,
  } = useDisclosure();

  //React Hook Form
  const {
    handleSubmit,
    formState: { isValid, isDirty },
    setValue,
    reset,
    control,
    errors,
    watch,
  } = useForm({
    resolver: yupResolver(paymentTransactionSchema.schema),
    mode: "onChange",
    defaultValues: paymentTransactionSchema.defaultValues,
  });

  const {
    fields: paymentFields,
    fields: expensesFields,
    append: appendPayment,
    remove: removePayment,
    update: updatePayment,
  } = useFieldArray({
    control,
    name: "payments",
  });

  console.log(watch());

  //Watch Constants
  const watchTransactionIds = watch("transactionId");
  const watchInvoiceNo = watch("invoiceNo");

  //RTK Query
  const [
    triggerTransactions,
    { data: transactionsData, isFetching: isTransactionsFetching },
  ] = useLazyGetAllSalesTransactionQuery();

  const { data: clientData, isFetching: isClientFetching } =
    useGetAllClientsQuery({
      RegistrationStatus: "Approved",
      PageNumber: 1,
      PageSize: 2000,
    });

  const [createPaymentTransaction] = useCreatePaymentTransactionMutation();

  //Functions
  const onSubmit = async (data) => {
    const formData = new FormData();

    data.transactionId.map((id, index) => formData.append(`transactionId`, id));
    formData.append(`receiptNo`, data.receiptNo);
    formData.append(`receipt`, data.receiptAttachment);

    data.payments.map((payment, index) => {
      const { paymentMethod, ...others } = payment;
      formData.append(
        `Payments[${index}].paymentMethod`,
        payment.paymentMethod.value
      );
      formData.append(
        `Payments[${index}].paymentAmount`,
        payment.paymentAmount
      );

      // IF PAYMENT METHOD IS CHEQUE
      payment.payee &&
        formData.append(`Payments[${index}].payee`, payment.payee);
      payment.chequeDate &&
        formData.append(
          `Payments[${index}].chequeDate`,
          moment(payment.chequeDate).format("YYYY-MM-DD")
        );
      payment.bankName &&
        formData.append(`Payments[${index}].bankName`, payment.bankName);
      payment.chequeNo &&
        formData.append(`Payments[${index}].chequeNo`, payment.chequeNo);
      payment.dateReceived &&
        formData.append(
          `Payments[${index}].dateReceived`,
          moment(payment.dateReceived).format("YYYY-MM-DD")
        );
      // IF PAYMENT METHOD IS ONLINE
      payment.accountName &&
        formData.append(`Payments[${index}].accountName`, payment.accountName);
      payment.paymentChannel &&
        formData.append(
          `Payments[${index}].paymentChannel`,
          payment.paymentChannel
        );
      payment.referenceNo &&
        formData.append(`Payments[${index}].referenceNo`, payment.referenceNo);
      // IF PAYMENT METHOD IS WITHHOLDING
      payment.attachment &&
        formData.append(
          `Payments[${index}].withholdingAttachment`,
          payment.attachment
        );
      // IF PAYMENT IS OTHERS
      payment.otherExpense &&
        formData.append(
          `Payments[${index}].othersPayment`,
          payment.otherExpense.id
        );
      //IF PAYMENT IS OTHERS WITH REMARKS
      payment.remarks && 
        formData.append(`Payments[${index}].reason`, payment.remarks);

      payment.returnId && 
        formData.append(`Payments[${index}].returnId`, payment.returnId?.returnId);
    });

    try {
      await confirm({
        children: "Are you sure you want to submit payment transaction?",
        question: true,
        callback: () => createPaymentTransaction(formData).unwrap(),
      });

      dispatch(paymentTransactionApi.util.invalidateTags(["Payment Transaction Histories"]))

      handleReset();
      snackbar({
        message: "Payment Transaction submitted successfully",
        variant: "success",
      });
    } catch (error) {
      if (error.isConfirmed) {
        snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
      }
    }
  };

  //Constants
  const isAllChecked =
    watch("transactionId")?.length === transactionsData?.transactions?.length;
  const isAllIndeterminate =
    watch("transactionId")?.length > 0 &&
    watch("transactionId")?.length !== transactionsData?.transactions?.length;

  //Functions
  const handleReset = useCallback(async () => {
    reset({
      transactionId: [],
      invoiceNo: [],
      payments: [],
      receiptNo: "",
      receiptAttachment: null,
    });
    receiptUploadRef.current.value = null;
    checkboxRef.current.checked = false;
  }, [reset]);

  const handleBack = async () => {
    try {
      if (watch("payments").length > 0) {
        await confirm({
          children:
            "Are you sure you want to go back? All unsaved changes will be lost.",
          question: true,
          callback: () => setPaymentMode(false),
        });
      } else {
        setPaymentMode(false);
      }
    } catch (error) {
      if (error.isConfirmed) {
        snackbar({ message: handleCatchErrorMessage(error), type: "error" });
      }
    }
  };

  const handleAddOpen = () => {
    setEditMode(false);
    onModalFormOpen();
  };

  const handleEditOpen = () => {
    setEditMode(true);
    onModalFormOpen();
  };

  const handleTransactionClick = (transactionId, invoiceNo, ciAttachment) => {
    // Check if ciAttachment exists; if not, do nothing
    if (!ciAttachment) return;

    const currentTransactionIds = watch("transactionId") || [];
    const currentInvoiceNos = watch("invoiceNo") || [];
    const transactionIndex = currentTransactionIds.indexOf(transactionId);
    const invoiceIndex = currentInvoiceNos.indexOf(invoiceNo);

    if (transactionIndex === -1 && invoiceIndex === -1) {
      // If not already selected, add it to the array
      setValue("transactionId", [...currentTransactionIds, transactionId]);
      setValue("invoiceNo", [...currentInvoiceNos, invoiceNo]);
    } else {
      // If already selected, remove it from the array
      setValue(
        "transactionId",
        currentTransactionIds.filter((id) => id !== transactionId)
      );
      setValue(
        "invoiceNo",
        currentInvoiceNos.filter((id) => id !== invoiceNo)
      );
    }
  };

  const handleSelectAll = (e) => {
    const { checked } = e.target;

    const allTransactionIds = transactionsData?.transactions
      ?.filter((transaction) => transaction.ciAttachment)
      .map((transaction) => transaction.transactionNo);

    const allInvoiceNo = transactionsData?.transactions
      ?.filter((transaction) => transaction.ciAttachment)
      .map((transaction) => transaction.invoiceNo);

    if (checked) {
      // If checkbox is checked, select all transaction IDs
      setValue("transactionId", allTransactionIds);
      setValue("invoiceNo", allInvoiceNo);
    } else {
      // If checkbox is unchecked, deselect all transaction IDs
      setValue("transactionId", []);
      setValue("invoiceNo", []);
    }
  };

  const handleTotal = useMemo(() => {
    const total = transactionsData?.transactions?.reduce(
      (acc, transaction) =>
        acc +
        (watchTransactionIds?.includes(transaction.transactionNo)
          ? transaction.remainingBalance
          : 0),
      0
    );

    return total;
  }, [watchTransactionIds, transactionsData]);

  const handlePaymentTotal = useMemo(() => {
    const total = paymentFields.reduce(
      (acc, payment) => acc + payment.paymentAmount,
      0
    );

    return total;
  }, [paymentFields]);

  const handleRemainingBalance = useMemo(() => {
    let remainingBalance = 0;

    if (handleTotal) {
      remainingBalance = handleTotal;
    }

    if (handleTotal && handlePaymentTotal) {
      remainingBalance = handleTotal - handlePaymentTotal;
    }

    return remainingBalance;
  }, [handleTotal, handlePaymentTotal]);

  //UseEffect
  useEffect(() => {
    if (client) {
      triggerTransactions({
        clientId: client?.id,
        transactionStatus: "Pending",
      });
      handleReset();
    }
  }, [client, triggerTransactions, handleReset]);

  useEffect(() => {
    if (clientFromInvoicePage) {
      const foundClient = clientData?.regularClient.find(
        (client) => client.id === clientFromInvoicePage
      );

      setClient(foundClient);
    }
  }, [clientFromInvoicePage, clientData]);

  useEffect(() => {
    console.log("hello", transactionsData);
    if (invoiceId && client && transactionsData) {
      transactionsData?.transactions
        .filter((transaction) => transaction.ciAttachment)
        .map((transaction) => {
          if (transaction.transactionNo === invoiceId) {
            setValue("transactionId", [invoiceId]);
            setValue("invoiceNo", [invoiceNo]);
          }
        });
    }

    return () => {
      setValue("transactionId", []);
      setValue("invoiceNo", []);
    };
  }, [invoiceId, client, setValue, transactionsData]);

  return (
    <>
      <Box className="paymentPage">
        <Box className="paymentPage__header">
          <Box className="paymentPage__header__left">
            <IconButton onClick={handleBack}>
              <KeyboardDoubleArrowLeft sx={{ fontSize: "1.6rem" }} />
            </IconButton>

            <Typography className="paymentPage__header__left__title">
              Payment Transaction
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box className="paymentPage__filters">
          <Tooltip
            followCursor
            title={
              watch("payments").length > 0
                ? "Finish/clear payments first before changing clients"
                : ""
            }
          >
            <Autocomplete
              options={clientData?.regularClient || []}
              getOptionLabel={(option) =>
                option.businessName?.toUpperCase() +
                  " " +
                  option.businessAddress?.city?.toUpperCase() +
                  ", " +
                  option.businessAddress?.province?.toUpperCase() +
                  " - " +
                  option.ownersName?.toUpperCase() + " - " + option.id || "" 
              }
              disabled={watch("payments").length > 0}
              loading={isClientFetching}
              isOptionEqualToValue={() => true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="Business Name - Owner's Name"
                />
              )}
              value={client}
              onChange={(_, value) => setClient(value)}
              sx={{ width: "40%" }}
            />
          </Tooltip>

          <Tooltip followCursor title={!client ? "Select client first" : ""}>
            <span>
              <Button
                variant="outlined"
                endIcon={<Receipt />}
                color="secondary"
                disabled={!client}
                onClick={onPaymentHistoriesOpen}
              >
                Client Payment Histories
              </Button>
            </span>
          </Tooltip>
        </Box>

        <Box className="paymentPage__body">
          <Box
            className={`paymentPage__body__transactions ${
              watch("payments")?.length > 0 ? " paymentTransactionOverlay" : ""
            }`}
          >
            {!client ? (
              <Typography className="paymentPage__body__transactions__selectClientFirst">
                Select client first
              </Typography>
            ) : isTransactionsFetching ? (
              <PaymentListSkeleton />
            ) : transactionsData?.transactions?.length === 0 ? (
              <Typography className="paymentPage__body__transactions__selectClientFirst">
                No receivables found
              </Typography>
            ) : (
              <>
                <Box className="paymentPage__body__transactions__header">
                  <Button
                    className="paymentPage__body__transactions__header__checkAll"
                    onClick={() => {
                      if (isAllChecked) {
                        checkboxRef.current.checked = false;
                      } else {
                        checkboxRef.current.checked =
                          !checkboxRef.current.checked;
                      }

                      handleSelectAll({
                        target: { checked: checkboxRef.current.checked },
                      });
                    }}
                    disabled={transactionsData?.transactions?.length === 0}
                  >
                    <Checkbox
                      ref={checkboxRef}
                      onChange={handleSelectAll}
                      checked={isAllChecked}
                      indeterminate={isAllIndeterminate}
                    />

                    <Typography className="paymentPage__body__transactions__checkAll__label">
                      Select All
                    </Typography>
                  </Button>

                  <Box className="paymentPage__body__transactions__header__totalAmount">
                    <Typography className="paymentPage__body__transactions__header__totalAmount__label">
                      Total Balance:
                    </Typography>

                    <Typography className="paymentPage__body__transactions__header__totalAmount__value">
                      ₱
                      {handleTotal?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionsDigits: 2,
                      })}
                    </Typography>
                  </Box>
                </Box>

                <Box className="paymentPage__body__transactions__transactionsList">
                  {transactionsData?.transactions?.map((item) => (
                    <Tooltip
                      title={
                        !item.ciAttachment
                          ? "This transaction is disabled due to missing attachment"
                          : ""
                      }
                      placement="top"
                      arrow
                    >
                      <Box
                        key={item.transactionNo}
                        className="paymentPage__body__transactions__transactionsList__item"
                        onClick={() =>
                          handleTransactionClick(
                            item.transactionNo,
                            item.invoiceNo,
                            item.ciAttachment
                          )
                        }
                        sx={{
                          bgcolor: watch("transactionId")?.includes(
                            item.transactionNo
                          )
                            ? "primary.lightActive"
                            : "inherit",
                          ":hover": {
                            bgcolor: watch("transactionId")?.includes(
                              item.transactionNo
                            )
                              ? "primary.lightActive"
                              : "primary.light",
                          },
                          borderColor: item?.voidReason ? "yellow" : "",
                          borderWidth: item?.voidReason ? "1px" : "",
                          opacity: item?.ciAttachment ? 1 : 0.5,
                        }}
                      >
                        <Box
                          sx={{
                            pointerEvents: item?.ciAttachment ? "all" : "none", // Apply only to the inner content
                          }}
                        >
                          <Typography className="paymentPage__body__transactions__transactionsList__item__date">
                            {moment(item.createdAt).format("MMM-DD-YYYY")}
                          </Typography>

                          <Box className="paymentPage__body__transactions__transactionsList__item__identifiers">
                            <Box className="paymentPage__body__transactions__transactionsList__item__identifiers__transactionNumber">
                              <Box className="paymentPage__body__transactions__transactionsList__item__identifiers__transactionNumber__label">
                                Transaction Number:
                              </Box>

                              <Box className="paymentPage__body__transactions__transactionsList__item__identifiers__transactionNumber__value">
                                {item.transactionNo}
                              </Box>
                            </Box>

                            <Box className="paymentPage__body__transactions__transactionsList__item__identifiers__invoiceNumber">
                              <Typography className="paymentPage__body__transactions__transactionsList__item__identifiers__invoiceNumber__label">
                                Invoice Number:
                              </Typography>

                              <Typography className="paymentPage__body__transactions__transactionsList__item__identifiers__invoiceNumber__value">
                                {item.invoiceNo}
                              </Typography>
                            </Box>

                            <Box className="paymentPage__body__transactions__transactionsList__item__identifiers__invoiceType">
                              <Typography className="paymentPage__body__transactions__transactionsList__item__identifiers__invoiceType">
                                Invoice Type:
                              </Typography>

                              <Typography className="paymentPage__body__transactions__transactionsList__item__identifiers__invoiceType">
                                {item.invoiceType}
                              </Typography>
                            </Box>
                            {item?.voidReason && (
                              <Box className="paymentPage__body__transactions__transactionsList__item__identifiers__voidReason">
                                <Typography sx={{ marginRight: "20px" }}>
                                  Payment Void:
                                </Typography>
                                <Typography sx={{ wordBreak: "break-word" }}>
                                  {item?.voidReason || "N/A"}
                                </Typography>
                              </Box>
                            )}
                          </Box>

                          <Divider />

                          <Box className="paymentPage__body__transactions__transactionsList__item__numbers">
                            <Box className="paymentPage__body__transactions__transactionsList__item__numbers__discount">
                              <Typography className="paymentPage__body__transactions__transactionsList__item__numbers__discount__label">
                                Amount Due:
                              </Typography>
                              <Typography className="paymentPage__body__transactions__transactionsList__item__numbers__discount__value">
                                {formatPesoAmount(item.totalAmountDue)}
                              </Typography>
                            </Box>

                            <Box className="paymentPage__body__transactions__transactionsList__item__numbers__amount">
                              <Typography className="paymentPage__body__transactions__transactionsList__item__numbers__amount__label">
                                Balance:
                              </Typography>
                              <Typography className="paymentPage__body__transactions__transactionsList__item__numbers__amount__value">
                                {formatPesoAmount(item.remainingBalance)}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Tooltip>
                  ))}
                </Box>
              </>
            )}
          </Box>

          <Box className="paymentPage__body__payments">
            <Box className="paymentPage__body__payments__header">
              <Typography className="paymentPage__body__payments__header__title">
                Payments List
              </Typography>

              <SecondaryButton
                onClick={handleAddOpen}
                endIcon={<Add />}
                sx={{ width: "140px" }}
                disabled={handleRemainingBalance <= 0}
              >
                Add Payment
              </SecondaryButton>
            </Box>

            <Divider />

            <Box
              className="paymentPage__body__payments__paymentsList"
              ref={parent}
            >
              {paymentFields?.map((payment, index) => (
                <Box
                  key={payment.id}
                  className="paymentPage__body__payments__paymentsList__item"
                  onClick={() => setSelectedPayment({ index, ...payment })}
                >
                  <Box className="paymentPage__body__payments__paymentsList__item__info">
                    <Box className="paymentPage__body__payments__paymentsList__item__info__paymentType">
                      <Typography className="paymentPage__body__payments__paymentsList__item__info__paymentType__label">
                        {payment.paymentMethod.label}
                      </Typography>

                      {getIconElement(
                        payment.paymentMethod.icon,
                        "gray",
                        "1.1rem"
                      )}
                    </Box>

                    <Typography className="paymentPage__body__payments__paymentsList__item__info__amount">
                      ₱
                      {payment.paymentAmount?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionsDigits: 2,
                      })}
                    </Typography>
                  </Box>

                  <Box className="paymentPage__body__payments__paymentsList__item__actions">
                    <Tooltip title="Edit">
                      <IconButton onClick={handleEditOpen}>
                        <EditOutlined color="primary" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Remove">
                      <IconButton onClick={() => removePayment(index)}>
                        <RemoveCircleOutline color="error" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              ))}
            </Box>

            <Divider sx={{ borderStyle: "dashed" }} />
            <Box className="paymentPage__body__payments__receipt">
              <Controller
                name="receiptAttachment"
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
                      inputProps={{ ref: receiptUploadRef, accept: "image/png, image/jpeg, image/jpg" }}
                      size="small"
                      label="Attachment"
                      helperText={errors?.attachment?.message}
                      error={errors?.attachment}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        endAdornment: watch("receiptAttachment") && (
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
              {/* <button onClick={() => {receiptUploadRef.current.value = null}}></button> */}
              {/* <Controller
                name="receiptAttachment"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Receipt Attachment"
                    size="small"
                    type="file"
                    onChange={(event) => {
                      onChange(event.target.files[0]);
                    }}
                    onBlur={onBlur}
                    value={value?.fileName || ""}
                    inputRef={receiptUploadRef}
                  ></Input>
                )}
              /> */}
              {/* <Box
                className="paymentPage__body__payments__receipt__canvas"
                onClick={() => receiptUploadRef.current.click()}
              >
                <AttachFile sx={{ fontSize: "1rem", color: "#33333361" }} />

                <Typography fontWeight="500" color="#333333A8">
                  Receipt
                </Typography>
              </Box> */}

              <Controller
                name="receiptNo"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    label="Receipt No"
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
            </Box>
            <Box className="paymentPage__body__payments__footer">
              <Box className="paymentPage__body__payments__footer__paymentsInfo">
                <Box className="paymentPage__body__payments__footer__paymentsInfo__paymentTotal">
                  <Typography className="paymentPage__body__payments__footer__paymentsInfo__paymentTotal__label">
                    Payment Total:
                  </Typography>

                  <Typography className="paymentPage__body__payments__footer__paymentsInfo__paymentTotal__value">
                    ₱
                    {handlePaymentTotal?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionsDigits: 2,
                    })}
                  </Typography>
                </Box>

                <Box className="paymentPage__body__payments__footer__paymentsInfo__paymentBalance">
                  <Typography className="paymentPage__body__payments__footer__paymentsInfo__paymentBalance__label">
                    Remaining Balance:
                  </Typography>

                  <Typography
                    className={
                      "paymentPage__body__payments__footer__paymentsInfo__paymentBalance__value" +
                      (handleRemainingBalance < 0
                        ? "Advance"
                        : handleRemainingBalance === 0
                        ? "Zero"
                        : "Balance")
                    }
                  >
                    ₱
                    {handleRemainingBalance?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionsDigits: 2,
                    })}
                  </Typography>
                </Box>

                <Typography className="paymentPage__body__payments__footer__paymentsInfo__paymentBalanceNote">
                  (Negative balance will go to advance payment)
                </Typography>
              </Box>

              <SecondaryButton
                size="medium"
                endIcon={<Payment />}
                onClick={handleSubmit(onSubmit)}
                disabled={paymentFields.length === 0 || !isValid || !isDirty || watch("invoiceNo").length < 1}
              >
                Pay Now
              </SecondaryButton>
            </Box>
          </Box>
        </Box>
      </Box>

      <PaymentModalForm
        open={isModalFormOpen}
        onClose={onModalFormClose}
        editMode={editMode}
        remainingBalance={handleRemainingBalance}
        appendPayment={appendPayment}
        updatePayment={updatePayment}
        selectedPayment={selectedPayment}
        paymentFields={paymentFields}
        expensesFields={expensesFields}
        client={client}
        invoice={watchInvoiceNo}
      />

      <ViewPhotoModal
        currentViewPhoto={watch("receiptAttachment")}
        open={isViewPhotoOpen}
        onClose={onViewPhotoClose}
      />

      <PaymentHistoriesModal
        open={isPaymentHistoriesOpen}
        onClose={onPaymentHistoriesClose}
        clientId={client?.id}
      />
    </>
  );
}

export default PaymentPage;