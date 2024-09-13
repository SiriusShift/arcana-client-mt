import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import CommonModal from "../../CommonModal";
import {
  useClearPaymentTransactionMutation,
  useFileClearingTransactionMutation,
  useLazyGetPaymentOverviewQuery,
  useReturnClearingTransactionMutation,
  useVoidClearingTransactionMutation,
} from "../../../features/sales-management/api/clearingApi";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import DangerButton from "../../DangerButton";
import SecondaryButton from "../../SecondaryButton";
import {
  formatPesoAmount,
  handleCatchErrorMessage,
} from "../../../utils/CustomFunctions";
import useSnackbar from "../../../hooks/useSnackbar";
import moment from "moment";
import useConfirm from "../../../hooks/useConfirm";
import useReasonConfirm from "../../../hooks/useReasonConfirm";
import ClearingModalSkeleton from "../../skeletons/ClearingModalSkeleton";

// mode props options: Clearing, Filing, Viewing
const ClearingModal = ({ mode = "Viewing", open, onClose, ...props }) => {
  const [aTag, setATag] = useState("");

  const confirm = useConfirm();
  const reasonConfirm = useReasonConfirm();
  const snackbar = useSnackbar();
  const tagRef = useRef(null);
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const [clearPaymentTransaction] = useClearPaymentTransactionMutation();
  const [voidPaymentTransaction] = useVoidClearingTransactionMutation();
  const [fileClearingTransaction] = useFileClearingTransactionMutation();
  const [returnClearingTransaction] = useReturnClearingTransactionMutation();
  const [trigger, { data, isFetching }] = useLazyGetPaymentOverviewQuery();

  const transaction = data?.[0];
  const paymentTransactionIds = transaction?.transactions?.map(
    (t) => t.paymentTransactionId
  );
  const totalAmountDue = transaction?.transactions?.reduce(
    (acc, t) =>
      acc +
      t.transactionItems?.reduce((acc, item) => acc + (item.amount || 0), 0),
    0
  );

  // Functions
  const onATag = async (e) => {
    e.preventDefault();

    try {
      await confirm({
        children: "Are you sure you want to submit this A-Tag?",
        question: true,
        callback: () =>
          clearPaymentTransaction({
            aTag,
            paymentTransactionIds,
          }).unwrap(),
      });

      snackbar({ message: "A-Tag submitted succesfully", variant: "success" });
      onClose();
    } catch (error) {
      if (error?.isConfirmed) {
        snackbar({
          message: handleCatchErrorMessage(error),
          variant: "error",
        });
      }
    }
  };

  const onVoid = async () => {
    try {
      await reasonConfirm({
        children: "Are you sure you want to void this transaction?",
        question: false,
        callback: (data) =>
          voidPaymentTransaction({
            paymentTransactionIds,
            reason: data,
          }).unwrap(),
      });

      snackbar({
        message: "Payment Transaction voided successfully",
        variant: "success",
      });
      onClose();
    } catch (error) {
      if (error?.isConfirmed) {
        snackbar({
          message: handleCatchErrorMessage(error),
          variant: "error",
        });
      }
    }
  };

  const onFile = async (e) => {
    e.preventDefault();

    try {
      await confirm({
        children: "Are you sure you want to file this transaction?",
        question: true,
        callback: () =>
          fileClearingTransaction({ paymentTransactionIds }).unwrap(),
      });

      snackbar({
        message: "Transaction filed succesfully",
        variant: "success",
      });
      onClose();
    } catch (error) {
      if (error?.isConfirmed) {
        snackbar({
          message: handleCatchErrorMessage(error),
          variant: "error",
        });
      }
    }
  };

  const onReturn = async () => {
    try {
      await reasonConfirm({
        children: "Are you sure you want to return this transaction?",
        question: false,
        callback: (data) =>
          returnClearingTransaction({
            paymentTransactionIds,
            reason: data,
          }).unwrap(),
      });

      snackbar({
        message: "Transaction returned successfully",
        variant: "success",
      });
      onClose();
    } catch (error) {
      if (error?.isConfirmed) {
        snackbar({
          message: handleCatchErrorMessage(error),
          variant: "error",
        });
      }
    }
  };

  const submitFunction =
    mode === "Clearing" ? onATag : mode === "Filing" ? onFile : () => {};

  // UseEffect
  useEffect(() => {
    if (open && mode === "Clearing") {
      setTimeout(() => {
        tagRef.current.focus();
        tagRef.current.select();
      }, 0);
    } else {
      setATag("");
    }
  }, [open, mode]);

  useEffect(() => {
    if (open) {
      trigger(
        {
          ReferenceNo: selectedRowData?.referenceNo,
          PaymentMethod: selectedRowData?.paymentMethod,
        },
        { preferCacheValue: true }
      );

      if (selectedRowData?.aTag) {
        setATag(selectedRowData?.aTag);
      }
    }
  }, [
    open,
    trigger,
    selectedRowData?.referenceNo,
    selectedRowData?.paymentMethod,
    selectedRowData?.aTag,
  ]);

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      {...props}
      closeTopRight
      closeOnBackdropClick
      width="600px"
    >
      <Stack gap={2} component="form" onSubmit={submitFunction}>
        <Typography fontSize="1.2rem" fontWeight="600">
          Remittance
        </Typography>

        <Stack direction="row" justifyContent="space-between">
          <Stack gap={0.5}>
            <Typography fontSize="1rem" fontWeight="500">
              CDO: {transaction?.addedBy || null}
            </Typography>
            <Typography fontSize="1rem" fontWeight="500">
              Receipt No: {transaction?.receiptNo || "N/A"}
            </Typography>
            <Typography fontSize="1rem" fontWeight="500">
              Receipt Attachment: {transaction?.receiptAttachment || "N/A"}
            </Typography>
          </Stack>

          <Stack gap={0.5}>
          <Typography fontSize="1rem" fontWeight="500">
              Date: {moment(selectedRowData?.date).format("MMMM DD, YYYY")}
            </Typography>
            <Typography fontSize="1rem" fontWeight="500">
              Payment Method: {selectedRowData?.paymentMethod}
            </Typography>
            <Typography fontSize="1rem" fontWeight="500">
              Payment Channel: {transaction?.paymentChannel || "N/A"}
            </Typography>
          </Stack>
        </Stack>

        {isFetching ? (
          <ClearingModalSkeleton />
        ) : (
          <>
            <Stack border="1px solid gray" borderRadius="5px" p={1}>
              <Typography fontSize="1.05rem" fontWeight="500">
                Invoices Details
              </Typography>

              <TableContainer
                sx={{
                  maxHeight: "300px",
                  height: "fit-content",
                  minHeight: "200px",
                }}
              >
                <Table>
                  <TableHead sx={{ bgcolor: "white !important" }}>
                    <TableRow>
                      <TableCell sx={{ color: "black" }}>Invoice No.</TableCell>
                      <TableCell sx={{ color: "black" }}>
                        Invoice Type
                      </TableCell>
                      <TableCell sx={{ color: "black" }}>Amount Due</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {transaction?.transactions?.map((t, index) => (
                      <TableRow key={index}>
                        <TableCell>{t.invoiceNo}</TableCell>
                        <TableCell>{t.invoiceType}</TableCell>
                        <TableCell>
                          {formatPesoAmount(
                            t.transactionItems?.reduce(
                              (acc, item) => acc + (item.amount || 0),
                              0
                            ) || 0
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>

            <Stack ml="40%">
              <Stack direction="row" gap={1} justifyContent="space-between">
                <Typography>Total Invoice Amount</Typography>
                <Typography
                  fontSize="1rem"
                  color="primary.main"
                  fontWeight="500"
                >
                  {formatPesoAmount(totalAmountDue)}
                </Typography>
              </Stack>

              <Stack direction="row" gap={1} justifyContent="space-between">
                <Typography>Total Payment Amount</Typography>
                <Typography
                  fontSize="1.2rem"
                  color="primary.main"
                  fontWeight="600"
                >
                  {formatPesoAmount(transaction?.totalAmount)}
                </Typography>
              </Stack>

              {mode === "VoidedViewing" && (
                <Stack
                  direction="row"
                  gap={1}
                  mt={0.5}
                  justifyContent="space-between"
                >
                  <Typography color="error">Void Reason</Typography>
                  <Typography>{selectedRowData?.reason || "N/A"}</Typography>
                </Stack>
              )}

              {mode === "Clearing" && selectedRowData?.reason && (
                <Stack
                  direction="row"
                  gap={1}
                  mt={0.5}
                  justifyContent="space-between"
                >
                  <Typography color="error">Return Reason</Typography>
                  <Typography sx={{wordBreak: "break-word"}}>{selectedRowData?.reason || "N/A"}</Typography>
                </Stack>
              )}
            </Stack>
          </>
        )}

        {mode === "Clearing" && (
          <TextField
            label="Tag"
            fullWidth
            size="small"
            sx={{ alignSelf: "flex-end", width: "300px" }}
            inputRef={tagRef}
            value={aTag}
            onChange={(e) => setATag(e.target.value)}
          />
        )}

        <Stack direction="row" gap={1} alignSelf="flex-end">
          {mode === "Clearing" && (
            <DangerButton onClick={onVoid}>Void</DangerButton>
          )}

          {mode === "Clearing" && (
            <SecondaryButton disabled={!aTag} type="submit">
              Submit
            </SecondaryButton>
          )}

          {mode === "Filing" && (
            <DangerButton onClick={onReturn}>Return</DangerButton>
          )}

          {mode === "Filing" && (
            <SecondaryButton type="submit">File</SecondaryButton>
          )}
        </Stack>
      </Stack>
    </CommonModal>
  );
};

export default ClearingModal;
