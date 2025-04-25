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
import { usePostMiscReceiptMutation } from "../../../../features/inventory-management/api/miscApi";
import { receivingApi } from "../../../../features/inventory-management/api/receivingApi";

const MiscReceiptFormActions = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const snackbar = useSnackbar();

  const {
    formState: { isValid },
    handleSubmit,
  } = useFormContext();

  const [trigger] = usePostMiscReceiptMutation();

  const handleCancel = () => {
    navigate("/inventory-management/miscellaneous-receipt", { replace: true });
  };

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const transformedData = {
        items: data.items.map((item) => ({
          itemCode: item.item.itemCode,
          actualQuantity: item.quantity,
          reason: item.reason,
          bbd: moment(item.bbd).format("YYYY-MM-DD"),
          amount: item.price,
        })),
        // transactionDate: moment(data.transactionDate).format("YYYY-MM-DD"),
        toCdo: data?.to?.id,
      };

      console.log("test")

      await confirm({
        children: "Are you sure you want to transfer out these items?",
        question: true,
        callback: () => trigger(transformedData).unwrap(),
      });


      snackbar({
        message: "Miscellaneous In successful",
        variant: "success",
      });

      // dispatch(receivingApi.util.invalidateTags(["Orders", "Order", "Generate"]));
      navigate("/inventory-management/miscellaneous-receipt", { replace: true });
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
        Submit
      </SecondaryButton>
    </Stack>
  );
};

export default MiscReceiptFormActions;
