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

  console.log(currentNavItem);

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
    permittedSubPath?.includes("/inventory-management/receiving") ||
    permittedParentPath?.includes("/inventory-management/ending-inventory") ||
    permittedSubPath?.includes("/inventory-management/ending-inventory") ||
    permittedParentPath?.includes("/inventory-management/transfer-in") ||
    permittedSubPath?.includes("/inventory-management/transfer-in") ||
    permittedParentPath?.includes("/inventory-management/transfer-out") ||
    permittedSubPath?.includes("/inventory-management/transfer-out") ||
    permittedParentPath?.includes("/inventory-management/return-to-depot") ||
    permittedSubPath?.includes("/inventory-management/return-to-depot") ||
    permittedParentPath?.includes("/inventory-management/miscellaneous-receipt") ||
    permittedSubPath?.includes("/inventory-management/miscellaneous-receipt") ||
    permittedParentPath?.includes("/inventory-management/miscellaneous-issue") ||
    permittedSubPath?.includes("/inventory-management/miscellaneous-issue") ||
    permittedParentPath?.includes("/inventory-management/freebies") ||
    permittedSubPath?.includes("/inventory-management/freebies") ||
    permittedParentPath?.includes("/inventory-management/sampling") ||
    permittedSubPath?.includes("/inventory-management/sampling") ||
    permittedParentPath?.includes("/inventory-management/return") ||
    permittedSubPath?.includes("/inventory-management/return") ||
    permittedParentPath?.includes("/inventory-management/callsheet") ||
    permittedSubPath?.includes("/inventory-management/callsheet") || 
    permittedParentPath?.includes("/inventory-management/reason-setup") ||
    permittedSubPath?.includes("/inventory-management/reason-setup"); 

  if (hasParamsPermission) {
    return <MainLayout />;
  }

  return <AccessDenied />;
};

export default PermittedRoutes;
