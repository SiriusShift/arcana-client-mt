import { Stack } from "@mui/material";
import DangerButton from "../../../DangerButton";
import SecondaryButton from "../../../SecondaryButton";
import { useFormContext } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import useConfirm from "../../../../hooks/useConfirm";
import useSnackbar from "../../../../hooks/useSnackbar";
import { handleCatchErrorMessage } from "../../../../utils/CustomFunctions";
import moment from "moment";
import { useRequestFreebiesMutation } from "../../../../features/inventory-management/api/freebiesApi";
import { Cancel, SaveOutlined } from "@mui/icons-material";
import { usePatchEndingInventoryMutation } from "../../../../features/inventory-management/api/endingInventoryApi";
import { useDispatch, useSelector } from "react-redux";
import { notificationApi } from "../../../../features/notification/api/notificationApi";

const EndingInventoryFormSubmit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const confirm = useConfirm();
  const snackbar = useSnackbar();
  const { id } = useParams();
  const {
    formState: { isValid, errors },
    handleSubmit,
    watch,
  } = useFormContext();

  const [updateEnding] = usePatchEndingInventoryMutation();

  const handleCancel = () => {
    navigate("/inventory-management/ending-inventory", { replace: true });
  };

  const onSubmit = async (data) => {
    try {
      console.log(data?.items, "test");
      const transformedData = {
        itemsToAdd: data.items.map((item) => {
          console.log(item);
          return {
            itemId: item?.itemId,
            soh: item?.soh,
            quantity: item?.actualQuantity,
          };
        }),
        adjustmentId: id,
      };

      console.log(transformedData);

      await confirm({
        children: "Are you sure you want to save ending inventory?",
        question: true,
        callback: () =>
          updateEnding({ body: transformedData, id: id })
            .unwrap()
      });

      dispatch(notificationApi.util.invalidateTags(["Notification"]))

      snackbar({
        message: "Ending inventory successful",
        variant: "success",
      });

      navigate("/inventory-management/ending-inventory", { replace: true });
    } catch (error) {
      console.log(error);
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

export default EndingInventoryFormSubmit;
