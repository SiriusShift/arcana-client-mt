import {
  Box,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const withSubmitHeight = "calc(100dvh - 355px)";
const withoutSubmitHeight = "calc(100dvh - 305px)";

const TransferInItemsSkeleton = ({ forViewing }) => {
  return (
    <Box sx={{ padding: "1px" }}>
      <TableContainer
        component={Paper}
        sx={{
          overflow: "auto",
          maxHeight: forViewing ? withoutSubmitHeight : withSubmitHeight,
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item Code</TableCell>
              <TableCell>Item Description</TableCell>
              <TableCell>UOM</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>BBD</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
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
    </Box>
  );
};

const TransferInItems = ({ items = [], isFetching, forViewing }) => {
  return isFetching ? (
    <TransferInItemsSkeleton forViewing={forViewing} />
  ) : (
    <Box sx={{ padding: "1px" }}>
      <TableContainer
        component={Paper}
        sx={{
          overflow: "auto",
          maxHeight: forViewing ? withoutSubmitHeight : withSubmitHeight,
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item Code</TableCell>
              <TableCell>Item Description</TableCell>
              <TableCell>UOM</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>BBD</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.itemCode}</TableCell>
                <TableCell>{item.itemDescription}</TableCell>
                <TableCell>{item.uom}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.bbd}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TransferInItems;
