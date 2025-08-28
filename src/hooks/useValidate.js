import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import useSnackbar from "./useSnackbar";

const useValidate = () => {
  const { notifications, isNotificationFetching } = useContext(AppContext);
  const snackbar = useSnackbar();

  const validateEndingInventory = () => {
    console.log("notification:",notifications?.scheduledInventoryAdjustments)
    if (notifications?.scheduledInventoryAdjustments > 0) {
      snackbar({
        message: `Pending Ending Inventory : ${notifications?.scheduledInventoryAdjustments}`,
        variant: "warning",
      }); 
      return true
    }
    return false
  };

  return {
    validateEndingInventory,
    isNotificationFetching
  }
};

export default useValidate
