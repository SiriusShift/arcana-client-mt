import { Box, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLazyGetSrpHistoryQuery } from "../../features/setup/api/productsApi";
import CommonModal from "../CommonModal";

const formatDate = (isoString) =>
    new Date(isoString).toLocaleString("en-PH", {
        dateStyle: "medium",
        timeStyle: "short",
    });

const formatPrice = (price) =>
    `₱${Number(price).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;

const SrpHistory = ({ open, onClose }) => {
    const selectedRowData = useSelector((state) => state.selectedRow.value);

    const [trigger, { data, isLoading, isError }] = useLazyGetSrpHistoryQuery();

    useEffect(() => {
        if (open && selectedRowData?.id) {
            trigger(selectedRowData.id);
        }
    }, [open, selectedRowData, trigger]);

    // Temporary — for testing only, remove after
    // const rows = Array.from({ length: 30 }, (_, i) => ({
    //     id: i,
    //     price: 50 + i,
    //     createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    // }));
    const rows = data?.value ?? [];
    return (
        <CommonModal
            title="Price Change"
            height="400px"
            open={open}
            onClose={onClose}
            closeTopRight
        >
            <Typography variant="h6">History</Typography>
            {isLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <CircularProgress />
                </Box>
            ) : isError || data?.isFailure ? (
                <Typography color="error">
                    {data?.error?.message || "Failed to load price history."}
                </Typography>
            ) : !rows.length ? (
                <Typography color="text.secondary">No price history found.</Typography>
            ) : (
                <Box sx={{ maxHeight: 500, overflowY: "auto" }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Price</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{formatDate(row.createdAt)}</TableCell>
                                    <TableCell>{formatPrice(row.price)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            )}
        </CommonModal>
    );
};

export default SrpHistory;