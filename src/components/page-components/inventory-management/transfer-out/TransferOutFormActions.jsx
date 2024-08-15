import { Stack } from "@mui/material";
import DangerButton from "../../../DangerButton";
import SecondaryButton from "../../../SecondaryButton";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useTransferOutMutation } from "../../../../features/inventory-management/api/transferOutApi";
import useConfirm from "../../../../hooks/useConfirm";
import useSnackbar from "../../../../hooks/useSnackbar";
import { handleCatchErrorMessage } from "../../../../utils/CustomFunctions";
import moment from "moment";
import { Cancel, SaveOutlined } from "@mui/icons-material";

const TransferOutFormActions = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const snackbar = useSnackbar();

  const {
    formState: { isValid },
    handleSubmit,
  } = useFormContext();

  const [transferOut] = useTransferOutMutation();

  const handleCancel = () => {
    navigate("/inventory-management/transfer-out", { replace: true });
  };

  const onSubmit = async (data) => {
    try {
      const transformedData = {
        items: data.items.map((item) => ({
          itemId: item.item.itemId,
          quantity: item.quantity,
          bbd: moment(item.bbd.bbd).format("YYYY-MM-DD"),
        })),
        transactionDate: moment(data.transactionDate).format("YYYY-MM-DD"),
        to: data.to.id,
      };

      await confirm({
        children: "Are you sure you want to transfer out these items?",
        question: true,
        callback: () => transferOut(transformedData).unwrap(),
      });

      snackbar({
        message: "Transfer out successful",
        variant: "success",
      });

      navigate("/inventory-management/transfer-out", { replace: true });
    } catch (error) {
      if (error.isConfirmed) {
        snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
      }
    }
  };

  return (
    <Stack direction="row" justifyContent="flex-end" gap={1.5}>
      <DangerButton onClick={handleCancel} endIcon={<Cancel />}>
        Cancel
      </DangerButton>

      <SecondaryButton
        onClick={handleSubmit(onSubmit)}
        disabled={!isValid}
        endIcon={<SaveOutlined />}
      >
        Transfer Out
      </SecondaryButton>
    </Stack>
  );
};

export default TransferOutFormActions;
