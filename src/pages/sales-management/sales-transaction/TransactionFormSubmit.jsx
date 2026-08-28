import { Cancel, MoveToInbox } from "@mui/icons-material";
import { Stack } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DangerButton from "../../../components/DangerButton";
import CashoutModal from "../../../components/modals/sales-management/CashoutModal";
import SecondaryButton from "../../../components/SecondaryButton";
import { useReceiveMoveOrderMutation } from "../../../features/inventory-management/api/receivingApi";
import { setData } from "../../../features/inventory-management/reducers/generateReceivingSlice";
import useConfirm from "../../../hooks/useConfirm";
import useDisclosure from "../../../hooks/useDisclosure";
import useSnackbar from "../../../hooks/useSnackbar";
import { handleCatchErrorMessage } from "../../../utils/CustomFunctions";

function TransactionFormSubmit({
  formData,
  isFormValid,
  handleFormData,
  handleFormValid,
  isLoading,
  data
}) {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const snackbar = useSnackbar();
  const confirm = useConfirm();

  const {
    isOpen: isCashoutOpen,
    onOpen: onCashoutOpen,
    onClose: onCashoutClose,
  } = useDisclosure();

  const totalAmount = formData?.items?.reduce((prev, curr) => prev + curr?.amount, 0)
  const totalVAT = formData?.items?.reduce(
    (total, item) =>
      total + (item.isVatable ? item.amount * (12 / 112) : 0),
    0
  );
  console.log(formData)
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
    <>
      <Stack direction="row" justifyContent="flex-end" gap={1.5}>
        <DangerButton onClick={handleCancel} endIcon={<Cancel />}>
          Cancel
        </DangerButton>
        <SecondaryButton
          onClick={onCashoutOpen}
          disabled={!isValid || isLoading}
          endIcon={<MoveToInbox />}
        >
          Receive
        </SecondaryButton>
      </Stack>
      <CashoutModal
        total={parseFloat(totalAmount).toFixed(2)}
        // resetTransaction={reset}
        totalVat={totalVAT}
        data={data}
        orderData={formData}
        open={isCashoutOpen}
        onClose={onCashoutClose}
      />
    </>
  );
}

export default TransactionFormSubmit;
