import {
  AccountCircle,
  KeyboardDoubleArrowLeft,
  Logout,
  Menu as MenuIcon,
  Password,
  Tour,
} from "@mui/icons-material";
import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import moment from "moment";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import "../assets/styles/navbar.styles.scss";
import { api } from "../features/api";
import {
  setFullname,
  setToken,
} from "../features/authentication/reducers/loginSlice";
import { setPermissisons } from "../features/authentication/reducers/permissionsSlice";
import {
  toggleSidebar,
  toggleSidebarSmallScreen,
} from "../features/misc/reducers/disclosureSlice";
import { setSelectedStoreType } from "../features/prospect/reducers/selectedStoreTypeSlice";
import useDisclosure from "../hooks/useDisclosure";
import useTour from "../hooks/useTour";
import ChangePasswordModal from "./modals/ChangePasswordModal";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { startTour } = useTour();

  const selectedStoreType = useSelector(
    (state) => state.selectedStoreType.value
  );

  const fullName = useSelector((state) => state.login.fullname);
  const role = useSelector((state) => state.login.userDetails.roleName);
  const territoryName = useSelector((state) => state.login.userDetails.territoryName);


  const {
    isOpen: isMenuOpen,
    onOpen: onMenuOpen,
    onClose: onMenuClose,
  } = useDisclosure();

  const {
    isOpen: isChangePasswordOpen,
    onOpen: onChangePasswordOpen,
    onClose: onChangePasswordClose,
  } = useDisclosure();

  const anchorRef = useRef();

  //Constants
  const routesForStoreType = ["/customer-registration/prospect"];

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

  const handleActions = (action) => {
    if (action === "changePassword") {
      onChangePasswordOpen();
    } else if (action === "logout") {
      handleLogout();
    } else if (action === "tour") {
      startTour();
    }

    onMenuClose();
  };

  return (
    <>
      <Box className="navbar">
        <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <IconButton
            sx={{ color: "secondary.main" }}
            aria-label="toggle sidebar"
            onClick={() => {
              if (window.innerWidth > 1024) {
                dispatch(toggleSidebar());
              } else {
                dispatch(toggleSidebarSmallScreen());
              }
            }}
          >
            <MenuIcon />
          </IconButton>

          <Typography className="navbar__dateToday">
            {moment().format("MMMM D, YYYY")}
          </Typography>
          {selectedStoreType &&
            routesForStoreType.includes(location.pathname) && (
              <IconButton
                onClick={() => {
                  dispatch(setSelectedStoreType(""));
                }}
                sx={{
                  backgroundColor: "secondary.main",
                  color: "white !important",
                  "&:hover": {
                    backgroundColor: "accent.main",
                  },
                }}
              >
                <KeyboardDoubleArrowLeft />
              </IconButton>
            )}
        </Box>

        <Box className="navbar__endButtons">
          {/* <Autocomplete
            options={navigationLabel}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => true}
            disableClearable
            className="navbar__endButtons__quickNavigate"
            value={currentPage}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Quick Navigate"
                sx={{ width: "300px" }}
                size="small"
              />
            )}
            onChange={handleNavigate}
          /> */}
          <Box sx={{ textAlign: "end" }}>
            <Typography>{fullName}</Typography>
            <Typography variant="subtitle">{role}{territoryName && ` - ${territoryName}`}</Typography>

          </Box>

          <IconButton
            sx={{ color: "secondary.main" }}
            onClick={onMenuOpen}
            ref={anchorRef}
            data-testid="account-menu"
          >
            <AccountCircle />
          </IconButton>
        </Box>
      </Box>

      <Menu
        open={isMenuOpen}
        onClose={onMenuClose}
        anchorEl={anchorRef.current}
      >
        <MenuItem
          className="actionsMenuItem"
          onClick={() => handleActions("tour")}
        >
          <Tour />
          Take a Tour
        </MenuItem>

        <MenuItem
          className="actionsMenuItem"
          onClick={() => handleActions("changePassword")}
        >
          <Password />
          Change Password
        </MenuItem>

        <MenuItem
          className="actionsMenuItem"
          onClick={() => handleActions("logout")}
        >
          <Logout />
          Logout
        </MenuItem>
      </Menu>

      <ChangePasswordModal
        open={isChangePasswordOpen}
        onClose={onChangePasswordClose}
      />

      {/* <CommonDialog
        onClose={onLogoutClose}
        open={isLogoutOpen}
        onYes={handleLogout}
      >
        Are you sure you want to{" "}
        <span style={{ fontWeight: "bold" }}>LOGOUT</span>?
      </CommonDialog> */}
    </>
  );
}

export default Header;
