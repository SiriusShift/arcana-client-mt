import { Stack } from "@mui/material";
import DangerButton from "../../../DangerButton";
import SecondaryButton from "../../../SecondaryButton";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useConfirm from "../../../../hooks/useConfirm";
import useSnackbar from "../../../../hooks/useSnackbar";
import { handleCatchErrorMessage } from "../../../../utils/CustomFunctions";
import moment from "moment";
import { useRequestFreebiesMutation } from "../../../../features/inventory-management/api/freebiesApi";
import { Cancel, SaveOutlined } from "@mui/icons-material";

const FreebiesFormActions = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const snackbar = useSnackbar();

  const {
    formState: { isValid },
    handleSubmit,
  } = useFormContext();

  const [requestFreebies] = useRequestFreebiesMutation();

  const handleCancel = () => {
    navigate("/inventory-management/freebies", { replace: true });
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
        transactionType: "Freebie",
        // transactionDate: moment(data.transactionDate).format("YYYY-MM-DD"),
        clientId: data.client.id,
      };
      console.log(transformedData);


      await confirm({
        children: "Are you sure you want to request these freebie items?",
        question: true,
        callback: () => requestFreebies(transformedData).unwrap(),
      });

      snackbar({
        message: "Freebie request successful",
        variant: "success",
      });

      navigate("/inventory-management/freebies", { replace: true });
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

export default FreebiesFormActions;
