import { Stack } from "@mui/material";
import SecondaryButton from "../../../SecondaryButton";
import DangerButton from "../../../DangerButton";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setData } from "../../../../features/inventory-management/reducers/generateReceivingSlice";
import useSnackbar from "../../../../hooks/useSnackbar";
import useConfirm from "../../../../hooks/useConfirm";
import { useReceiveMoveOrderMutation } from "../../../../features/inventory-management/api/receivingApi";
import { handleCatchErrorMessage } from "../../../../utils/CustomFunctions";
import { Cancel, MoveToInbox } from "@mui/icons-material";

function ReceivingFormSubmit({
  formData,
  isFormValid,
  handleFormData,
  handleFormValid,
}) {

  console.log(formData);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const snackbar = useSnackbar();
  const confirm = useConfirm();

  formData = {
    ...formData,
    additional: formData.items
      .filter(item => item.quantity === 0 || item.actualQuantity === 0)  // Filter for items with 0 quantity or actualQuantity
      .map(item => ({
        itemCode: item.itemCode,
        actualQuantity: item.actualQuantity,
      })),
    items: formData.items
      .filter(item => item.quantity > 0)  // Filter for items with quantity > 0
      .map(item => ({
        itemCode: item.itemCode,
        actualQuantity: item.actualQuantity,
      })),
  };
  
  console.log(formData);
  

  console.log(formData);
  

  // RTK Query
  const [receiveMoveOrder] = useReceiveMoveOrderMutation();

  const handleClearData = () => {
    setTimeout(() => {
      sessionStorage.removeItem("generateReceivingData");
      handleFormData({});
      handleFormValid({
        isItemsValid: false,
        isWrongDeliverValid: false,
      });
      dispatch(setData(null));
    }, 1000);
  };

  const handleSubmit = async () => {
    try {
      await confirm({
        children: "Are you sure you want to submit this receiving form?",
        question: true,
        callback: () => receiveMoveOrder(formData).unwrap(),
      });

      navigate(-1);

      handleClearData();

      snackbar({
        variant: "success",
        message: "Move Order received successfully",
      });
    } catch (error) {
      if (error.isConfirmed) {
        snackbar({ variant: "error", message: handleCatchErrorMessage(error) });
      }
    }
  };

  const handleCancel = () => {
    navigate(-1);
    handleClearData();
  };

  const isValid = Object.keys(isFormValid).every((key) => isFormValid[key]);

  return (
    <Stack direction="row" justifyContent="flex-end" gap={1.5}>
      <DangerButton onClick={handleCancel} endIcon={<Cancel />}>
        Cancel
      </DangerButton>
      <SecondaryButton
        onClick={handleSubmit}
        disabled={!isValid}
        endIcon={<MoveToInbox />}
      >
        Receive
      </SecondaryButton>
    </Stack>
  );
}

export default ReceivingFormSubmit;
