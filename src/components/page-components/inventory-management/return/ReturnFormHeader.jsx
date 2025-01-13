import { KeyboardDoubleArrowLeft } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ReturnFormHeader = ({ StepProps = {}, noStep }) => {
  const { currentStep = 0, steps = [] } = StepProps || {}; // Default destructuring ensures no TypeError
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/inventory-management/return", { replace: true });
  };

  return (
    <Box sx={{ padding: "1px" }}>
      <Box component={Paper} elevation={1}>
        <Box className="pageHeader">
          <Box className="pageHeader__left">
            <IconButton onClick={handleBack}>
              <KeyboardDoubleArrowLeft />
            </IconButton>
            <Typography className="pageHeader__title">Return Form</Typography>
          </Box>

          {!noStep && (
            <Box className="pageHeader__right">
              <Stepper activeStep={currentStep} sx={{ width: "220px" }}>
                {steps.map((step) => (
                  <Step key={step.value}>
                    <StepLabel>{step.label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ReturnFormHeader;
