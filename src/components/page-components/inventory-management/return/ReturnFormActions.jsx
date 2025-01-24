import { Stack } from "@mui/material";
import DangerButton from "../../../DangerButton";
import SecondaryButton from "../../../SecondaryButton";
import { useFormContext } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import useConfirm from "../../../../hooks/useConfirm";
import useSnackbar from "../../../../hooks/useSnackbar";
import { handleCatchErrorMessage } from "../../../../utils/CustomFunctions";
import {
  useLazyGetAllReturnsQuery,
  useReplaceItemsMutation,
  useReturnItemsMutation,
} from "../../../../features/inventory-management/api/returnApi";
import moment from "moment";
import {
  Cancel,
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
  SaveOutlined,
} from "@mui/icons-material";
import useDisclosure from "../../../../hooks/useDisclosure";
import CommonDialog from "../../../common/CommonDialog";
import { current } from "@reduxjs/toolkit";
import { replace } from "lodash";
import { useEffect } from "react";

const ReturnFormActions = ({
  StepProps: { currentStep = 0, setCurrentStep, steps = [] },
}) => {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const snackbar = useSnackbar();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  const {
    isOpen: isContinueOpen,
    onOpen: onContinueOpen,
    onClose: onContinueClose,
  } = useDisclosure();

  const {
    formState: { isValid },
    handleSubmit,
    watch,
  } = useFormContext();

  console.log(watch());

  const [returnItems, { isLoading: returnItemsLoading }] =
    useReturnItemsMutation();
  const [replaceItems, { isLoading: replaceItemsLoading }] =
    useReplaceItemsMutation();

  const [trigger, { data: returnData }] = useLazyGetAllReturnsQuery();

  console.log(returnData?.to[0]?.returnId);
  useEffect(() => {
    if (currentStep === steps.length - 1) {
      trigger({
        PageSize: 1000,
        DateFrom: dateFrom ? moment(dateFrom).format("YYYY-MM-DD") : "",
        DateTo: dateTo ? moment(dateTo).format("YYYY-MM-DD") : "",
        Status: "Pending",
      });
    }
  }, [dateFrom, dateTo]);

  const onSubmit = async (data) => {
    try {
      const replaceItemsPayload = {
        replaceOrders: data.replaceItems.map((item) => ({
          itemId: item.item.itemId,
          price: item.price,
          quantity: item.quantity,
          bbd: moment(item.bbd).format("YYYY-MM-DD"),
          reason: item.reason,
        })),
        returnOrderId: returnData?.to[0]?.returnId,
        clientId: data.client.id,
      };

      console.log(replaceItemsPayload);

      // Confirm before proceeding
      await confirm({
        children: "Are you sure you want to return and replace these items?",
        question: true,
        callback: () => {
          replaceItems(replaceItemsPayload).unwrap();
        },
      });

      // Show success message
      snackbar({
        message: "Return and replace operations successful!",
        variant: "success",
      });

      // Navigate to a different page after success
      navigate("/inventory-management/return", { replace: true });
    } catch (error) {
      console.error("Error in onSubmit:", error);

      // Show error message to the user
      snackbar({
        message: handleCatchErrorMessage(error),
        variant: "error",
      });
    }
  };

  const handleCancel = () => {
    navigate("/inventory-management/return", { replace: true });
  };

  const handleClose = async () => {
    try {
      console.log("test");
      const transformedData = {
        returnOrders: watch("returnItems").map((item) => ({
          itemId: item.item.itemId,
          price: item.price,
          // netPrice: item.netPrice,
          quantity: item.quantity,
          bbd: moment(item.bbd).format("YYYY-MM-DD"),
          reason: item.reason,
        })),
        clientId: watch("client").id,
      };
      console.log("testing!");
      await returnItems(transformedData).unwrap();
      onContinueClose();
      navigate("/inventory-management/return", { replace: true });
    } catch (error) {
      console.log(error);
      if (error.isConfirmed) {
        snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
      }
    }
  };

  const handleNext = async () => {
    const transformedData = {
      returnOrders: watch("returnItems").map((item) => ({
        itemId: item.item.itemId,
        price: item.price,
        // netPrice: item.netPrice,
        quantity: item.quantity,
        bbd: moment(item.bbd).format("YYYY-MM-DD"),
        reason: item.reason,
      })),
      clientId: watch("client").id,
    };
    console.log("testing!");
    await returnItems(transformedData).unwrap();
    onContinueClose();
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <>
      <Stack direction="row" justifyContent="flex-end" gap={1.5}>
        {/* <Stack>
          {currentStep !== 0 && (
            <DangerButton
              onClick={handleBack}
              size="small"
              startIcon={<KeyboardDoubleArrowLeft />}
            >
              Back
            </DangerButton>
          )}
        </Stack> */}

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
              onClick={onContinueOpen}
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
              loading={replaceItemsLoading}
            >
              Submit
            </SecondaryButton>
          )}
        </Stack>
      </Stack>
      <CommonDialog
        open={isContinueOpen}
        onClose={handleClose}
        onYes={currentStep !== steps.length - 1 && handleNext}
        isLoading={returnItemsLoading || replaceItemsLoading}
        question
      >
        Continue adding replace items ?
        {/* Confirm {direct ? "save" : "request"} of freebies for{" "}
        <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>
          {selectedRowData?.businessName && !direct
            ? selectedRowData?.businessName
            : "client"}
        </span> */}
      </CommonDialog>
    </>
  );
};

export default ReturnFormActions;
