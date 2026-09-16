import { CheckCircleOutline, ExpandMore, HighlightOff } from "@mui/icons-material";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useApproveSalesTransactionRequestMutation, useRejectSalesTransactionRequestMutation } from "../../features/sales-management/api/salesTransactionApi";
import useConfirm from "../../hooks/useConfirm";
import useReasonConfirm from "../../hooks/useReasonConfirm";
import useSnackbar from "../../hooks/useSnackbar";
import { handleCatchErrorMessage } from "../../utils/CustomFunctions";
import CommonModal from "../CommonModal";

const formatCurrency = (value) =>
    new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
    }).format(value ?? 0);

const formatDate = (value) =>
    value
        ? new Date(value).toLocaleString("en-PH", {
            dateStyle: "medium",
            timeStyle: "short",
        })
        : "—";

const STATUS_CLASS = {
    "Under review": "status-pending",
    Approved: "status-approved",
    Rejected: "status-rejected",
};

const TransactionApprovalModal = ({ open, onClose, tabViewing }) => {
    const [expandedId, setExpandedId] = useState(null);
    const snackbar = useSnackbar();
    const confirm = useConfirm()
    const reasonConfirm = useReasonConfirm();
    const selectedRowData = useSelector((state) => state.selectedRow.value);
    const userDetails = useSelector((state) => state.login.userDetails);

    const items = selectedRowData?.transaction?.items ?? [];
    const isHead = userDetails?.roleName === "Head"
    const [reject, { isLoading: rejectLoading }] = useRejectSalesTransactionRequestMutation();
    const [approve, { isLoading: approveLoading }] = useApproveSalesTransactionRequestMutation();

    console.log(isHead, tabViewing)
    const isBusy = approveLoading || rejectLoading;

    const handleExpand = (id) => (_, isExpanded) => {
        setExpandedId(isExpanded ? id : null);
    };

    const handleApprove = async () => {
        try {
            await confirm({
                children: "Are you sure you want to approve this transactions?",
                question: true,
                callback: () => approve(selectedRowData.requestId).unwrap()
            });
            snackbar({ variant: "success", message: "Transaction approved" });
            onClose();
        } catch (err) {
            if (err?.isCancelled) return;
            snackbar({ variant: "error", message: handleCatchErrorMessage(err) });
        }
    };

    const handleReject = async () => {
        try {
            await reasonConfirm({
                children: "Are you sure you want to reject this transactions?",
                question: false,
                callback: async (data) => reject({
                    body: { reason: data },
                    id: selectedRowData.requestId
                }).unwrap()
            });
            snackbar({ variant: "success", message: "Transaction rejected" });
            onClose();
        } catch (err) {
            if (err?.isCancelled) return;
            snackbar({ variant: "error", message: handleCatchErrorMessage(err) });
        }
    };
    return (
        <CommonModal
            open={open}
            onClose={onClose}
            width={720}
            maxHeight="85vh"
            // overflow="auto"
            closeTopRight
            closeOnBackdropClick
        >            <Box className="transaction-approval-modal">
                <Typography className="transaction-approval-modal__title">
                    Transaction Approvals
                </Typography>

                {!selectedRowData ? (
                    <Typography className="transaction-approval-modal__empty">
                        No pending transactions to review.
                    </Typography>
                ) : (
                    <Stack spacing={2} className="transaction-approval-modal__body">
                        <Accordion
                            key={selectedRowData.requestId}
                            expanded={expandedId === selectedRowData.requestId}
                            onChange={handleExpand(selectedRowData.requestId)}
                            className="transaction-approval-modal__card"
                            disableGutters
                        >
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Box className="transaction-approval-modal__summary">
                                    <Box>
                                        <Typography className="transaction-approval-modal__requestor">
                                            {selectedRowData.requestor}
                                        </Typography>
                                        <Typography className="transaction-approval-modal__meta">
                                            Invoice #{selectedRowData.transaction?.invoiceNo ?? "—"} ·{" "}
                                            {formatDate(selectedRowData.dateCreated)}
                                        </Typography>
                                    </Box>

                                    <Box className="transaction-approval-modal__summary-right">
                                        <Typography className="transaction-approval-modal__amount">
                                            {formatCurrency(selectedRowData.amount)}
                                        </Typography>
                                        <Chip
                                            size="small"
                                            label={selectedRowData.status}
                                            className={`transaction-approval-modal__status ${STATUS_CLASS[selectedRowData.status] || "status-pending"
                                                }`}
                                        />
                                    </Box>
                                </Box>
                            </AccordionSummary>

                            <AccordionDetails>
                                <Divider className="transaction-approval-modal__divider" />

                                <Box className="transaction-approval-modal__details-grid">
                                    <Box className="transaction-approval-modal__detail-row">
                                        <Typography component="span" className="transaction-approval-modal__label">
                                            DR No.:
                                        </Typography>
                                        <Typography component="span" className="transaction-approval-modal__description">
                                            {selectedRowData.transaction?.drNo ?? "—"}
                                        </Typography>
                                    </Box>
                                    <Box className="transaction-approval-modal__detail-row">
                                        <Typography component="span" className="transaction-approval-modal__label">
                                            Discount:
                                        </Typography>
                                        <Typography component="span" className="transaction-approval-modal__description">
                                            {selectedRowData.transaction?.discount ?? 0}%
                                        </Typography>
                                    </Box>
                                    <Box className="transaction-approval-modal__detail-row">
                                        <Typography component="span" className="transaction-approval-modal__label">
                                            Invoice Type:
                                        </Typography>
                                        <Typography component="span" className="transaction-approval-modal__description">
                                            {selectedRowData.transaction?.invoiceType ?? "—"}
                                        </Typography>
                                    </Box>
                                    {/* <Box className="transaction-approval-modal__detail-row">
                                        <Typography component="span" className="transaction-approval-modal__label">
                                            Current Approver:
                                        </Typography>
                                        <Typography component="span" className="transaction-approval-modal__description">
                                            {selectedRowData.currentApprover ?? "—"}
                                        </Typography>
                                    </Box> */}
                                </Box>

                                <TableContainer className="transaction-approval-modal__table">
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Item Code</TableCell>
                                                <TableCell>Description</TableCell>
                                                <TableCell align="right">Qty</TableCell>
                                                <TableCell align="right">Unit Price</TableCell>
                                                <TableCell align="right">Total</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {items.map((item) => (
                                                <TableRow key={item.itemId}>
                                                    <TableCell>{item.itemCode}</TableCell>
                                                    <TableCell>{item.itemDescription}</TableCell>
                                                    <TableCell align="right">{item.quantity}</TableCell>
                                                    <TableCell align="right">
                                                        {formatCurrency(item.unitPrice)}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {formatCurrency(item.quantity * item.unitPrice)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                {(isHead && tabViewing === 2) && <Stack
                                    direction="row"
                                    spacing={1.5}
                                    justifyContent="flex-end"
                                    className="transaction-approval-modal__actions"
                                >
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<HighlightOff />}
                                        disabled={isBusy}
                                        onClick={handleReject}
                                    >
                                        Reject
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        startIcon={
                                            isBusy ? (
                                                <CircularProgress size={16} color="inherit" />
                                            ) : (
                                                <CheckCircleOutline />
                                            )
                                        }
                                        disabled={isBusy}
                                        onClick={handleApprove}
                                    >
                                        Approve
                                    </Button>
                                </Stack>}

                            </AccordionDetails>
                        </Accordion>
                    </Stack>
                )}
            </Box>
        </CommonModal >
    );
};

export default TransactionApprovalModal;