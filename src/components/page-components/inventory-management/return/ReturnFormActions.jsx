import { Stack } from "@mui/material";
import DangerButton from "../../../DangerButton";
import SecondaryButton from "../../../SecondaryButton";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useConfirm from "../../../../hooks/useConfirm";
import useSnackbar from "../../../../hooks/useSnackbar";
import { handleCatchErrorMessage } from "../../../../utils/CustomFunctions";
import { useReturnItemsMutation } from "../../../../features/inventory-management/api/returnApi";
import moment from "moment";
import {
  Cancel,
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
  SaveOutlined,
} from "@mui/icons-material";

const ReturnFormActions = ({
  StepProps: { currentStep = 0, setCurrentStep, steps = [] },
}) => {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const snackbar = useSnackbar();

  const {
    formState: { isValid },
    handleSubmit,
    watch,
  } = useFormContext();

  console.log(watch());

  const [returnItems] = useReturnItemsMutation();

  const onSubmit = async (data) => {
    try {
      const transformedData = {
        returnOrders: data.returnItems.map((item) => ({
          itemId: item.item.itemId,
          price: item.price,
          // netPrice: item.netPrice,
          quantity: item.quantity,
          bbd: moment(item.bbd.bbd).format("YYYY-MM-DD"),
        })),
        replaceOrders: data.replaceItems.map((item) => ({
          itemId: item.item.itemId,
          price: item.price,
          // netPrice: item.netPrice,
          quantity: item.quantity,
          bbd: moment(item.bbd.bbd).format("YYYY-MM-DD"),
        })),
        // transactionDate: moment(data.transactionDate).format("YYYY-MM-DD"),
        clientId: data.client.id,
      };

      await confirm({
        children: "Are you sure you want to return these items?",
        question: true,
        callback: () => returnItems(transformedData).unwrap(),
      });

      snackbar({
        message: "Return successful",
        variant: "success",
      });

      navigate("/inventory-management/return", { replace: true });
    } catch (error) {
      if (error.isConfirmed) {
        snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
      }
    }
  };

  const handleCancel = () => {
    navigate("/inventory-management/return", { replace: true });
  };

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <Stack direction="row" justifyContent="space-between" gap={1.5}>
      <Stack>
        {currentStep !== 0 && (
          <DangerButton
            onClick={handleBack}
            size="small"
            startIcon={<KeyboardDoubleArrowLeft />}
          >
            Back
          </DangerButton>
        )}
      </Stack>

      <Stack direction="row" justifyContent="flex-end" gap={1.5}>
        <DangerButton
          onClick={handleCancel}
          size="small"
          color="error"
          endIcon={<Cancel />}
        >
          Cancel
        </DangerButton>

        {currentStep !== steps.length - 1 && (
          <SecondaryButton
            onClick={handleNext}
            endIcon={<KeyboardDoubleArrowRight />}
            disabled={
              watch("client") === null ||
              !watch("returnItems")[0].quantity ||
              !watch("returnItems")[0].netPrice
            }
          >
            Next
          </SecondaryButton>
        )}

        {currentStep === steps.length - 1 && (
          <SecondaryButton
            onClick={handleSubmit(onSubmit)}
            endIcon={<SaveOutlined />}
            disabled={!isValid}
          >
            Submit
          </SecondaryButton>
        )}
      </Stack>
    </Stack>
  );
};

export default ReturnFormActions;
