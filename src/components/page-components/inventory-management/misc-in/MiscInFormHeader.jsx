import { KeyboardDoubleArrowLeft } from "@mui/icons-material";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";



const MiscInFormHeader = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/inventory-management/miscellaneous-in", { replace: true });
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
              Miscellaneous In Form
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MiscInFormHeader;