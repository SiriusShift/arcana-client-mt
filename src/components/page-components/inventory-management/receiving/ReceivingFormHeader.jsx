import { KeyboardDoubleArrowLeft } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const DataSkeleton = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        px: 2,
        pb: 2,
      }}
    >
      <Stack>
        <Skeleton variant="text" width={200} height={28} />
        <Skeleton variant="text" width={200} height={28} />
        <Skeleton variant="text" width={200} height={28} />
        <Skeleton variant="text" width={200} height={28} />
      </Stack>

      <Stack>
        <Skeleton variant="text" width={200} height={28} />
        <Skeleton variant="text" width={200} height={28} />
        <Skeleton variant="text" width={200} height={28} />
      </Stack>
    </Box>
  );
};

function ReceivingFormHeader({
  data: {
    businessName = "",
    route = "",
    details = "",
    area = "",
    transactionDate = "",
    moveOrderId = "",
    deliveryDate = "",
  } = {},
  isFetching,
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
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
              Receiving Form
            </Typography>
          </Box>

          <Box className="pageHeader__right">
            <Typography className="pageHeader__title">Move Order</Typography>
          </Box>
        </Box>

        {isFetching ? (
          <DataSkeleton />
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              px: 2,
              pb: 2,
            }}
          >
            <Stack>
              <Typography variant="subtitle1" fontWeight="500">
                Business Name: {businessName}
              </Typography>

              <Typography variant="subtitle1" fontWeight="500">
                Route: {route}
              </Typography>
              <Typography variant="subtitle1" fontWeight="500">
                Details: {details}
              </Typography>
              <Typography variant="subtitle1" fontWeight="500">
                Area: {area}
              </Typography>
            </Stack>

            <Stack>
              <Typography variant="subtitle1" fontWeight="500">
                Transaction Date: {moment(transactionDate).format("MM/DD/YYYY")}
              </Typography>
              <Typography variant="subtitle1" fontWeight="500">
                Move Order ID: {moveOrderId}
              </Typography>
              <Typography variant="subtitle1" fontWeight="500">
                Delivery Date: {moment(deliveryDate).format("MM/DD/YYYY")}
              </Typography>
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default ReceivingFormHeader;
