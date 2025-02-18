import { Stack } from "@mui/material";
import SecondaryButton from "../../../SecondaryButton";
import DangerButton from "../../../DangerButton";
import { useNavigate, useParams } from "react-router-dom";
import useSnackbar from "../../../../hooks/useSnackbar";
import useConfirm from "../../../../hooks/useConfirm";
import {
  useReceiveTransferInMutation,
  useRejectTransferInMutation,
} from "../../../../features/inventory-management/api/transferInApi";
import { handleCatchErrorMessage } from "../../../../utils/CustomFunctions";
import { MoveToInbox, ThumbDownOutlined } from "@mui/icons-material";
import useReasonConfirm from "../../../../hooks/useReasonConfirm";

function TransferInFormSubmit() {
  const { id } = useParams();

  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const confirm = useConfirm();
  const confirmReason = useReasonConfirm();

  const [receiveTransferIn] = useReceiveTransferInMutation();
  const [rejectTransferIn] = useRejectTransferInMutation();

  const handleReceive = async () => {
    try {
      await confirm({
        children: "Are you sure you want to receive this transfer in?",
        question: true,
        callback: () => receiveTransferIn(id).unwrap(),
      });

      navigate("/inventory-management/transfer-in");

      snackbar({
        variant: "success",
        message: "Transfer In received successfully",
      });
    } catch (error) {
      if (error.isConfirmed) {
        snackbar({ variant: "error", message: handleCatchErrorMessage(error) });
      }
    }
  };

  const handleReject = async () => {
    try {
      await confirmReason({
        children: "Are you sure you want to reject this transfer in?",
        question: false,
        callback: (remarks) => rejectTransferIn({ id: id, body: {
          reason: remarks
        } }).unwrap(),
      });

      navigate("/inventory-management/transfer-in");

      snackbar({
        variant: "success",
        message: "Transfer In received successfully",
      });
    } catch (error) {
      if (error.isConfirmed) {
        snackbar({ variant: "error", message: handleCatchErrorMessage(error) });
      }
    }
  };

  return (
    <Stack direction="row" justifyContent="flex-end" gap={1.5}>
      <DangerButton onClick={handleReject} endIcon={<ThumbDownOutlined />}>
        Reject
      </DangerButton>
      <SecondaryButton onClick={handleReceive} endIcon={<MoveToInbox />}>
        Receive
      </SecondaryButton>
    </Stack>
  );
}

export default TransferInFormSubmit;
