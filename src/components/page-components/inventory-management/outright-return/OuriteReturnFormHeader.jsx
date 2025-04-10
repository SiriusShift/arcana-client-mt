import { KeyboardDoubleArrowLeft } from "@mui/icons-material";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const OuriteReturnFormHeader = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/inventory-management/ourite-return", { replace: true });
  };

  return (
    <Box sx={{ padding: "1px" }}>
      <Box component={Paper} elevation={1}>
        <Box className="pageHeader">
          <Box className="pageHeader__left">
            <IconButton onClick={handleBack}>
              <KeyboardDoubleArrowLeft />
            </IconButton>

            <Typography className="pageHeader__title">
              Ourite Return Form
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OuriteReturnFormHeader;