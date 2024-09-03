import { Box, Button } from "@mui/material";
import Unauthorized from "../assets/images/Unauthorized.svg";
import SecondaryButton from "../components/SecondaryButton";
import { useNavigate } from "react-router-dom";
import {
  setFullname,
  setToken,
} from "../features/authentication/reducers/loginSlice";
import { useDispatch } from "react-redux";

function SessionExpired() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(setToken(""));
    dispatch(setFullname(""));
    dispatch(setPermissisons(""));
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("fullname");
    sessionStorage.removeItem("permissions");

    //Reset API state
    dispatch(api.util.resetApiState());

    navigate("/login");
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100dvh",
        width: "100vw",
      }}
    >
      <img
        src={Unauthorized}
        alt="401-Unauthorized"
        width="50%"
        height="50%"
      />
      <SecondaryButton onClick={handleLogout}>Return to Login</SecondaryButton>
    </Box>
  );
}

export default SessionExpired;
