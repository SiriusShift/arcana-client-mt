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
import { usePostAddReturnFromSamplingMutation } from "../../../../features/inventory-management/api/samplingApi";

const ReturnSamplingFormActions = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const dispatch = useDispatch();
  const snackbar = useSnackbar();

  const {
    formState: { isValid, errors },
    handleSubmit,
    watch,
  } = useFormContext();

  console.log(watch())

  const [returnSampling] = usePostAddReturnFromSamplingMutation();

  const handleCancel = () => {
    navigate("/inventory-management/return-sampling", { replace: true });
  };

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const transformedData = {
        returnedItems: data.items.map((item) => ({
          itemId: item.item.itemId,
          quantity: item.quantity,
          reason: item.reason,
          reasonId: item.remarks?.id,
        })),
        // transactionDate: moment(data.transactionDate).format("YYYY-MM-DD"),
        freebieOrderId: data?.freebieOrderId?.id,
      };

      await confirm({
        children: "Are you sure you want to return these items?",
        question: true,
        callback: () => returnSampling(transformedData).unwrap(),
      });

      snackbar({
        message: "Return successful",
        variant: "success",
      });

      navigate("/inventory-management/return-sampling", { replace: true });
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

export default ReturnSamplingFormActions;
