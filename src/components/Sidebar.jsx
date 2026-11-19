import { KeyboardDoubleArrowLeft } from "@mui/icons-material";
import {
  Box,
  Collapse,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import SystemLogo from "../assets/images/SystemLogo.png";
import SystemLogoName from "../assets/images/SystemLogoName.png";
import "../assets/styles/sidebar.styles.scss";
import { AppContext } from "../context/AppContext";
import { toggleSidebarSmallScreen } from "../features/misc/reducers/disclosureSlice";
import { navigationData } from "../navigation/navigationData";
import { getIconElement } from "./GetIconElement";

function Sidebar() {
  const [activeModule, setActiveModule] = useState("");
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 1024);

  const dispatch = useDispatch();
  const location = useLocation();

  const permissions = useSelector((state) => state.permissions?.permissions);
  const permittedSidebar = navigationData.filter((item) =>
    permissions?.includes(item.name)
  );
  const sidebarToggled = useSelector((state) => state.disclosure.sidebar);
  const sidebarSmallScreenToggled = useSelector(
    (state) => state.disclosure.sidebarSmallScreen
  );

  const { notifications, isNotificationFetching } = useContext(AppContext);

  const getNavItemNotificationCount = (navItem) => {
    const permittedSub = navItem.sub?.filter(
      (sub) => permissions?.includes(sub.name) && sub.path
    ) || [];

    const keys = [
      ...(navItem.notifications || []),
      ...permittedSub.flatMap((s) => s.notifications || []),
    ];

    return keys.reduce(
      (sum, key) => sum + (parseInt(notifications[key]) || 0),
      0
    );
  };

  console.log(permittedSidebar)
  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth > 1024);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Emp

  useEffect(() => {
    const regex = /\/.*\//;

    if (regex.test(location.pathname)) {
      setActiveModule(location.pathname);
    }
  }, [location.pathname]);

  return (
    <>
      <Box
        className="sidebarWrapper"
        sx={{
          width: (isWideScreen ? sidebarToggled : sidebarSmallScreenToggled)
            ? "315px"
            : isWideScreen
              ? "80px"
              : "0px",
        }}
      >
        <Box className="sidebar">
          <Box
            className={"sidebar__logo" + (!sidebarToggled ? " untoggled" : "")}
          >
            <img
              // src={isWideScreen ? SystemLogoName : SystemLogo}
              src={!sidebarToggled ? SystemLogo : SystemLogoName}
              alt="arcana-logo"
              className={!sidebarToggled ? "small" : ""}
            />

            <IconButton
              className="sidebar__toggleRemove"
              onClick={() => {
                dispatch(toggleSidebarSmallScreen());
              }}
            >
              <KeyboardDoubleArrowLeft />
            </IconButton>
          </Box>

          <Box className="sidebar__navigation">
            {permittedSidebar.map(
              // {navigationData.map(
              (item) => (
                <React.Fragment key={item.id}>
                  <Tooltip
                    title={
                      (isWideScreen ? !sidebarToggled : false) ? item.name : ""
                    }
                    placement="right"
                    PopperProps={{
                      popperOptions: {
                        modifiers: [
                          {
                            name: "offset",
                            options: {
                              offset: [-2, -250],
                            },
                          },
                        ],
                      },
                    }}
                  >
                    <NavLink to={item.path}>
                      {({ isActive }) => (
                        <ListItem
                          disablePadding
                          sx={{
                            px: 2,
                            width: isWideScreen
                              ? !sidebarToggled
                                ? "88px"
                                : "315px"
                              : !sidebarSmallScreenToggled
                                ? "0px"
                                : "315px",
                            // whiteSpace: !sidebarToggled ? "nowrap" : null
                            whiteSpace: "nowrap",
                            transition: "width 0.4s",
                          }}
                        >
                          <ListItemButton
                            className={`sidebar__navigation__button  ${isActive ? "active" : ""
                              }`}
                            onClick={() => {
                              setActiveModule(
                                activeModule?.includes(item.path)
                                  ? ""
                                  : item.path
                              );
                            }}
                          >
                            <ListItemIcon
                              className={`sidebar__navigation__button__icon  ${isActive ? "active" : ""
                                }`}
                            >
                              {getIconElement(item.icon)}
                            </ListItemIcon>

                            {<ListItemText>{item.name}</ListItemText>}

                            {getNavItemNotificationCount(item) > 0 && !isNotificationFetching && (
                              <Box sx={{ width: "20px", height: "20px" }}>
                                <Box className="notifications">
                                  {getNavItemNotificationCount(item)}
                                </Box>
                              </Box>
                            )}

                            {/* {sidebarToggled && (
                        <ListItemText>{item.name}</ListItemText>
                      )} */}
                          </ListItemButton>
                        </ListItem>
                      )}
                    </NavLink>
                  </Tooltip>

                  {item.sub && (
                    <Collapse
                      in={
                        isWideScreen
                          ? sidebarToggled && activeModule?.includes(item.path)
                          : activeModule?.includes(item.path)
                      }
                      // in={activeModule?.includes(item.path)}
                      timeout="auto"
                      unmountOnExit
                    >
                      {item.sub
                        ?.filter(
                          (sub) => permissions?.includes(sub.name) && sub.path
                        )
                        .map((subItem) => (
                          <NavLink to={subItem.path} key={subItem.id}>
                            {({ isActive }) => (
                              <ListItem disablePadding sx={{ px: 2 }}>
                                <ListItemButton
                                  className={`sidebar__navigation__subButton  ${isActive ? "active" : ""
                                    }`}
                                >
                                  <ListItemIcon
                                    className={`sidebar__navigation__subButton__icon  ${isActive ? "active" : ""
                                      }`}
                                  >
                                    {getIconElement(subItem.icon)}
                                  </ListItemIcon>

                                  {/* {sidebarToggled && (
                              <ListItemText>{subItem.name}</ListItemText>
                            )} */}
                                  <ListItemText>{subItem.name}</ListItemText>
                                  {/* {subItem.notification && (
                                  <Box
                                    sx={{
                                      bgcolor: "notification.main",
                                      borderRadius: "50%",
                                      width: "10%",
                                      // height: "20px",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      color: "white !important",
                                    }}
                                  >
                                    {notifications[subItem.notification] > 0 &&
                                      notifications[subItem.notification]}
                                  </Box>
                                )} */}
                                  {subItem?.notifications?.reduce(
                                    (sum, notification) =>
                                      sum +
                                      parseInt(notifications[notification]),
                                    0
                                  ) > 0 && (
                                      <Box sx={{ width: "20px", height: "20px" }}>
                                        {subItem?.notifications &&
                                          !isNotificationFetching && (
                                            <Box
                                              sx={{
                                                bgcolor: "notification.main",
                                                borderRadius: "50%",
                                                // width: "12%",
                                                width: "20px",
                                                height: "20px",
                                                // height: "20px",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                color: "white !important",
                                              }}
                                            >
                                              {subItem?.notifications?.reduce(
                                                (sum, notification) =>
                                                  sum +
                                                  parseInt(
                                                    notifications[notification]
                                                  ),
                                                0
                                              )}
                                            </Box>
                                          )}
                                      </Box>
                                    )}
                                </ListItemButton>
                              </ListItem>
                            )}
                          </NavLink>
                        ))}
                    </Collapse>
                  )}
                </React.Fragment>
              )
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Sidebar;
