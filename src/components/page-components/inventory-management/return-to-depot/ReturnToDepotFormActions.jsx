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
import { Cancel, Print, SaveOutlined } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import useDisclosure from "../../../../hooks/useDisclosure";
import PrintInventoryModal from "../../../modals/PrintInventoryModal";

const ReturnToDepotFormActions = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const dispatch = useDispatch();
  const snackbar = useSnackbar();

  const {
    formState: { isValid, errors },
    handleSubmit,
    watch,
  } = useFormContext();

  const [transferOut] = useTransferOutMutation();

  const handleCancel = () => {
    navigate("/inventory-management/return-to-depot", { replace: true });
  };

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const transformedData = {
        transferItems: data.items.map((item) => ({
          itemCode: item.item.itemCode,
          quantity: item.quantity,
          reason: item.reason,
          reasonInfo: item.remarks?.id,
          bbd: moment(item.bbd).format("YYYY-MM-DD"),
          amount: item.price,
        })),
        // transactionDate: moment(data.transactionDate).format("YYYY-MM-DD"),
        to: null,
        referenceNo: data?.referenceNo,
        moveOrderId: data?.moveOrder?.moveOrderId,
        transferType: data?.type?.value,
      };
      console.log(transformedData);

      await confirm({
        children: "Are you sure you want to return these items?",
        question: true,
        callback: () => transferOut(transformedData).unwrap(),
      });

      snackbar({
        message: "Transfer out successful",
        variant: "success",
      });

      navigate("/inventory-management/return-to-depot", { replace: true });
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
        return
      </SecondaryButton>
    </Stack>
  );
};

export default ReturnToDepotFormActions;
