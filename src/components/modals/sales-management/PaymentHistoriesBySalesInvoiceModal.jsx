import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Visibility,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  Collapse,
  IconButton,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import noData from "../../../assets/images/noRecordsFound.svg";
import { useLazyGetAllPaymentHistoriesQuery } from "../../../features/sales-management/api/paymentTransactionApi";
import { useGetAllOtherExpensesQuery } from "../../../features/setup/api/otherExpensesApi";
import useDisclosure from "../../../hooks/useDisclosure";
import { paymentTypes } from "../../../utils/Constants";
import { formatPesoAmount } from "../../../utils/CustomFunctions";
import CommonModal from "../../CommonModal";
import { getIconElement } from "../../GetIconElement";
import ViewHistoriesAttachment from "./ViewHistoryAttachment";


function PaymentHistoriesBySalesInvoiceModal({ ...props }) {
  const { open } = props;

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const [expandedPaymentType, setExpandedPaymentType] = useState({});
  const [receiptImage, setReceiptImage] = useState(null);

  const {
    isOpen: isViewOpenReceipt,
    onOpen: onViewOpenReceipt,
    onClose: onViewCloseReceipt,
  } = useDisclosure();

  const {
    isOpen: isViewOpenAttachment,
    onOpen: onViewOpenAttachment,
    onClose: onViewCloseAttachment,
  } = useDisclosure();

  const [
    triggerHistories,
    { data: paymentHistoriesData, isFetching: isPaymentHistoriesFetching },
  ] = useLazyGetAllPaymentHistoriesQuery();

  const { data: expensesData, isLoading: isExpensesLoading } =
    useGetAllOtherExpensesQuery({ Status: true, page: 1, pageSize: 1000 });
  const expensesArray = expensesData?.otherExpenses;

  //Functions
  const getPaymentTypeIcon = (paymentType) => {
    return getIconElement(
      paymentTypes.find((type) => type.value === paymentType)?.icon,
      "gray",
      "1.3rem"
    );
  };

  const handlePaymentDropdown = (itemId, newState) => {
    setExpandedPaymentType((prevStates) => {
      // Create a new object to hold the updated states
      const updatedStates = {};

      // Loop through previous states to set all to false except the clicked one
      Object.keys(prevStates).forEach((key) => {
        updatedStates[key] = key == itemId ? newState : false;
      });

      return updatedStates;
    });
  };

  const handlePaymentReceipt = (itemId, newState) => {
    setExpandedPaymentType((prevStates) => {
      // Create a new object to hold the updated states
      const updatedStates = {};

      // Loop through previous states to set all to false except the clicked one
      Object.keys(prevStates).forEach((key) => {
        updatedStates[key] = key == itemId ? newState : false;
      });

      return updatedStates;
    });
  };

  //UseEffect
  useEffect(() => {
    if (open) {
      const initialStates = {};
      paymentHistoriesData?.transactions?.forEach((item) => {
        // Assuming item.id is unique for each item
        initialStates[item.paymentRecordId] = false; // Assuming initially all dropdowns are closed
      });
      setExpandedPaymentType(initialStates);
    } else {
      setExpandedPaymentType({});
    }
  }, [paymentHistoriesData, open]);

  useEffect(() => {
    if (open) {
      triggerHistories(
        {
          Status: true,
          PageSize: 1000,
          PageNumber: 1,
          TransactionId: selectedRowData?.transactionNo,
        },
        { preferCacheValue: true }
      );
    }
  }, [open, triggerHistories, selectedRowData]);

  return (
    <>
      <CommonModal {...props} closeTopRight height="70dvh">
        <Box className="paymentHistoriesBySalesInvoiceModal">
          <Typography className="paymentHistoriesBySalesInvoiceModal__title">
            Payment Histories
          </Typography>

          {paymentHistoriesData?.transactions?.length != 0 ? (
            <Box className="paymentHistoriesBySalesInvoiceModal__body">
              <Stepper
                orientation="vertical"
                sx={{
                  "& .MuiStepConnector-root": {
                    flex: "none",
                    WebkitFlex: "none",
                  },
                }}
              >
                {paymentHistoriesData?.transactions?.map((paymentRecord) => (
                  <Step key={paymentRecord.paymentRecordId} active expanded>
                    <StepLabel StepIconProps={{ icon: "" }}>
                      <span style={{ fontWeight: "600", marginRight: "5px" }}>
                        {moment(paymentRecord.createdAt).format("MMMM D, YYYY")}
                      </span>

                      <span>
                        {moment(paymentRecord.createdAt).format("hh:mm a")}
                      </span>
                    </StepLabel>

                    <StepContent>
                      <Box className="paymentHistoriesBySalesInvoiceModal__body__stepContent">
                        <Box className="paymentHistoriesBySalesInvoiceModal__body__stepContent__total">
                          <Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__total__label">
                            Total:
                          </Typography>

                          <Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__total__value">
                            {formatPesoAmount(paymentRecord.totalPayment)}
                          </Typography>
                        </Box>


                        <Box className="paymentHistoriesBySalesInvoiceModal__body__stepContent__number">
                          <Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__number__label">
                            {selectedRowData?.invoiceType === "Sales"
                              ? "AR"
                              : "CR"}{" "}
                            No:
                          </Typography>

                          <Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__number__value">
                            {paymentRecord.receiptNo}
                          </Typography>
                        </Box>

                        <Box
                          className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentTypes"
                          onClick={() =>
                            handlePaymentDropdown(
                              paymentRecord.paymentRecordId,
                              !expandedPaymentType[paymentRecord.paymentRecordId]
                            )
                          }
                        >
                          <Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentTypes__label">
                            Payment Type(s):
                          </Typography>

                          <Box className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentTypes__chips">
                            {paymentRecord.paymentTransactions.map(
                              (paymentTransaction, index) => (
                                <Chip
                                  key={index}
                                  label={paymentTransaction.paymentMethod}
                                  variant="outlined"
                                  color="primary"
                                  icon={getPaymentTypeIcon(
                                    paymentTransaction.paymentMethod
                                  )}
                                />
                              )
                            )}
                          </Box>

                          <IconButton>
                            {expandedPaymentType[
                              paymentRecord.paymentRecordId
                            ] ? (
                              <KeyboardArrowUp color="secondary" />
                            ) : (
                              <KeyboardArrowDown color="secondary" />
                            )}
                          </IconButton>
                        </Box>

                        <Collapse
                          in={expandedPaymentType[paymentRecord.paymentRecordId]}
                        >
                          <Box className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed">
                            {paymentRecord.paymentTransactions.map(
                              (paymentTransaction, index) => (
                                <Box
                                  key={index}
                                  className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item"
                                >
                                  <Box className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__title">
                                    <Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__title__number">
                                      {index + 1}.
                                    </Typography>

                                    <Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__title__label">
                                      {paymentTransaction.paymentMethod}
                                    </Typography>

                                    {getPaymentTypeIcon(
                                      paymentTransaction.paymentMethod
                                    )}
                                  </Box>

                                  <Box className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content">
                                    <Box className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row">
                                      <Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__label">
                                        Amount:
                                      </Typography>

                                      <Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__value">
                                        {formatPesoAmount(
                                          paymentTransaction.paymentAmount
                                        )}
                                      </Typography>
                                    </Box>

                                    {/* Withholding Fields */}
                                    {paymentTransaction.paymentMethod ===
                                      "Withholding" &&
                                      paymentTransaction.withholdingAttachment && (
                                        <Box className="paymentHistoriesBySalesInvoiceModal__body__stepContent__attachment">
                                          <Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__attachment__label">
                                            Attachment:
                                          </Typography>

                                          <Typography
                                            className="paymentHistoriesBySalesInvoiceModal__body__stepContent__attachment__value"
                                            onClick={() =>
                                              setReceiptImage(
                                                paymentTransaction.withholdingAttachment
                                              )
                                            }
                                          >
                                            <IconButton
                                              sx={{
                                                color: "secondary.main",
                                                p: 0,
                                              }}
                                              onClick={onViewOpenAttachment}
                                            >
                                              <Visibility />
                                            </IconButton>
                                            {/* {formatPesoAmount(paymentRecord.totalPayment)} */}
                                          </Typography>
                                        </Box>
                                      )}

                                    {/* Cheque Fields */}
                                    {paymentTransaction.paymentMethod ===
                                      "Cheque" && (
                                        <>
                                          <Box className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row">
                                            <Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__label">
                                              Payee:
                                            </Typography>

                                            <Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__value">
                                              {paymentTransaction.payee}
                                            </Typography>
                                          </Box>

                                          <Box className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row">
                                            <Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__label">
                                              Cheque Date:
                                            </Typography>

                                            <Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__value">
                                              {moment(
                                                paymentTransaction.chequeDate
                                              ).format("MMM D, YYYY")}
                                            </Typography>
                                          </Box>

                                          <Box className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row">
                                            <Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__label">
                                              Bank:
                                            </Typography>

                                            <Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__value">
                                              {paymentTransaction.bankName}
                                            </Typography>
                                          </Box>

                                          <Box className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row">
                                            <Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__label">
                                              Cheque Number:
                                            </Typography>

                                            <Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__value">
                                              {paymentTransaction.chequeNo}
                                            </Typography>
                                          </Box>

                                          <Box className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row">
                                            <Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__label">
                                              Date Received:
                                            </Typography>

                                            <Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__value">
                                              {moment(
                                                paymentTransaction.dateReceived
                                              ).format("MMM D, YYYY")}
                                            </Typography>
                                          </Box>
                                        </>
                                      )}

                                    {/* Online Fields */}
                                    {paymentTransaction.paymentMethod ===
                                      "Online" && (
                                        <>
                                          <Box className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row">
                                            <Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__label">
                                              Account Name:
                                            </Typography>

                                            <Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__value">
                                              {paymentTransaction.accountName}
                                            </Typography>
                                          </Box>

                                          <Box className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row">
                                            <Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__label">
                                              Account Number:
                                            </Typography>

                                            <Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__value">
                                              {paymentTransaction.accountNo}
                                            </Typography>
                                          </Box>

                                          <Box className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row">
                                            <Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__label">
                                              Reference Number:
                                            </Typography>

                                            <Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__value">
                                              {paymentTransaction.transactionId}
                                            </Typography>
                                          </Box>
                                        </>
                                      )}

                                    {/* Offset Fields */}
                                    {paymentTransaction.paymentMethod ===
                                      "Offset" && (
                                        <>
                                          <Box className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row">
                                            <Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__label">
                                              Remarks:
                                            </Typography>

                                            <Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__value">
                                              {paymentTransaction.remarks}
                                            </Typography>
                                          </Box>
                                        </>
                                      )}
                                    {/* Others Fields */}
                                    {paymentTransaction.paymentMethod ===
                                      "Others" && (
                                        <>
                                          <Box className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row">
                                            <Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__label">
                                              Payment Channel:
                                            </Typography>

                                            <Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__value">
                                              {expensesArray.map((item) => {
                                                if (
                                                  item.id === paymentTransaction?.paymentChannel) {
                                                  return item.expenseType
                                                }
                                              })}
                                            </Typography>
                                          </Box>
                                        </>
                                      )}
                                    {paymentTransaction.paymentMethod ===
                                      "Others With Remarks" && (
                                        <>
                                          <Box className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row">
                                            <Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__label">
                                              Remarks:
                                            </Typography>

                                            <Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__value">
                                              {paymentTransaction.reason}
                                            </Typography>
                                          </Box>
                                        </>
                                      )}
                                  </Box>
                                </Box>
                              )
                            )}
                          </Box>
                        </Collapse>
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </Box>
          ) : (
            <Box className="paymentHistoriesBySalesInvoiceModal__noData">
              <img src={noData} alt="No Data Found" className="paymentHistoriesBySalesInvoiceModal__noData__image" />
            </Box>
          )}
        </Box>
      </CommonModal>
      <ViewHistoriesAttachment
        image={receiptImage}
        title={"Receipt"}
        open={isViewOpenReceipt}
        onClose={onViewCloseReceipt}
      />
      <ViewHistoriesAttachment
        image={receiptImage}
        title={"Attachment"}
        open={isViewOpenAttachment}
        onClose={onViewCloseAttachment}
      />
    </>
  );
}

export default PaymentHistoriesBySalesInvoiceModal;
