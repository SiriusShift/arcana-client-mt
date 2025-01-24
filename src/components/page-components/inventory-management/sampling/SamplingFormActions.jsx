import { Stack } from "@mui/material";
import DangerButton from "../../../DangerButton";
import SecondaryButton from "../../../SecondaryButton";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useConfirm from "../../../../hooks/useConfirm";
import useSnackbar from "../../../../hooks/useSnackbar";
import { handleCatchErrorMessage } from "../../../../utils/CustomFunctions";
import moment from "moment";
import { useAddSamplingMutation } from "../../../../features/inventory-management/api/samplingApi";
import { Cancel, SaveOutlined } from "@mui/icons-material";

const SamplingFormActions = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const snackbar = useSnackbar();

  const {
    formState: { isValid },
    handleSubmit,
  } = useFormContext();

  const [addSampling] = useAddSamplingMutation();

  const handleCancel = () => {
    navigate("/inventory-management/sampling", { replace: true });
  };

  const onSubmit = async (data) => {
    try {
      const transformedData = {
        freebieOrderItems: data.items.map((item) => ({
          itemId: item.item.itemId,
          quantity: item.quantity,
          reason: item.reason,
          bbd: moment(item.bbd).format("YYYY-MM-DD"),
        })),
        // transactionDate: moment(data.transactionDate).format("YYYY-MM-DD"),
        clientId: data.client.id,
        transactionType: "Sampling"
      };

      await confirm({
        children: "Are you sure you want to sample these items?",
        question: true,
        callback: () => addSampling(transformedData).unwrap(),
      });

      snackbar({
        message: "Sampling successful",
        variant: "success",
      });

      navigate("/inventory-management/sampling", { replace: true });
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

export default SamplingFormActions;
