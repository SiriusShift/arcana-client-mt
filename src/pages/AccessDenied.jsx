import { Box } from "@mui/material";
import AccessDeniedImg from "../assets/images/AccessDenied.svg";

function AccessDenied() {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img src={AccessDeniedImg} alt="access-denied" width="75%" />
    </Box>
  );
}

export default AccessDenied;
