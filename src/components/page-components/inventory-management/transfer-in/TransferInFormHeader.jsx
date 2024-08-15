import { KeyboardDoubleArrowLeft } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const DataSkeleton = () => {
  return (
    <Stack>
      <Skeleton variant="text" width={200} height={28} />
      <Skeleton variant="text" width={200} height={28} />
      <Skeleton variant="text" width={200} height={28} />
    </Stack>
  );
};

function TransferInFormHeader({
  data: { from = "", cluster = "" } = {},
  isFetching,
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/inventory-management/transfer-in", { replace: true });
  };

  return (
    <Box sx={{ padding: "1px" }}>
      <Box component={Paper} elevation={1}>
        <Box className="pageHeader" sx={{ pb: 1 }}>
          <Box className="pageHeader__left">
            <IconButton onClick={handleBack}>
              <KeyboardDoubleArrowLeft />
            </IconButton>

            <Typography className="pageHeader__title">
              Transfer In Form
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: 2,
            pb: 2,
          }}
        >
          {isFetching ? (
            <DataSkeleton />
          ) : (
            <Stack>
              <Typography variant="subtitle1" fontWeight="500">
                From: {from}
              </Typography>
              <Typography variant="subtitle1" fontWeight="500">
                Cluster: {cluster}
              </Typography>
              <Typography variant="subtitle1" fontWeight="500">
                Transaction Type: TRANSFER
              </Typography>
            </Stack>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default TransferInFormHeader;
