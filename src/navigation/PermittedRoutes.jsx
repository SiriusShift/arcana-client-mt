import { useSelector } from "react-redux";
import { navigationData } from "./navigationData";
import { useLocation } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AccessDenied from "../pages/AccessDenied";

const PermittedRoutes = () => {
  const { pathname } = useLocation();
  const permissions = useSelector((state) => state.permissions.permissions);

  const allowedNavigationData = navigationData.filter((item) => {
    return permissions?.includes(item.name);
  });
  console.log(allowedNavigationData);

  const currentNavItem = allowedNavigationData.find(
    (item) => pathname?.includes(item.path) && item.path !== "/"
  );
  console.log(currentNavItem);

  const currentSubNav = currentNavItem?.sub?.filter((subItem) =>
    permissions?.includes(subItem.name)
  );

  const permittedParentPath = allowedNavigationData?.map((item) => {
    return permissions?.includes(item.name) ? item.path : null;
  });

  const permittedSubPath = currentSubNav?.map((item) => {
    return permissions?.includes(item.name) ? item.path : null;
  });

  if (
    permittedParentPath?.includes(pathname) ||
    permittedSubPath?.includes(pathname) ||
    pathname === "/"
  ) {
    return <MainLayout />;
  }

  // Workaround for children :id
  const hasParamsPermission =
    permittedParentPath?.includes("/inventory-management/receiving") ||
    permittedSubPath?.includes("/inventory-management/receiving");

  if (hasParamsPermission) {
    return <MainLayout />;
  }

  return <AccessDenied />;
};

export default PermittedRoutes;
