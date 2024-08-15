import {
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

// mode props options: Clearing, Filing, Viewing
const ClearingModalSkeleton = () => {
  return (
    <>
      <Stack border="1px solid gray" borderRadius="5px" p={1}>
        <Typography fontSize="1.05rem" fontWeight="500">
          Invoices Details
        </Typography>

        <TableContainer sx={{ maxHeight: "300px", height: "fit-content" }}>
          <Table>
            <TableHead sx={{ bgcolor: "white !important" }}>
              <TableRow>
                <TableCell sx={{ color: "black" }}>Invoice No.</TableCell>
                <TableCell sx={{ color: "black" }}>Invoice Type</TableCell>
                <TableCell sx={{ color: "black" }}>Amount Due</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {Array.from({ length: 3 }).map((t, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
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
          <Skeleton width="100px" />
        </Stack>

        <Stack direction="row" gap={1} justifyContent="space-between">
          <Typography>Total Payment Amount</Typography>
          <Skeleton width="100px" />
        </Stack>
      </Stack>
    </>
  );
};

export default ClearingModalSkeleton;
