import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { AppContext } from "../../../context/AppContext";
import { useGetUsersWithAdjustmentsQuery } from "../../../features/inventory-management/api/endingInventoryApi";
import {
  useLazyGetListingFeeByClientIdQuery,
  useLazyGetOtherExpensesByClientIdQuery,
  usePatchApproveEditClientRequestMutation,
  usePatchRejectEditClientRequestMutation,
  usePutApproveClientMutation,
  usePutRejectClientMutation,
} from "../../../features/registration/api/registrationApi";
import useDisclosure from "../../../hooks/useDisclosure";
import useSnackbar from "../../../hooks/useSnackbar";
import { handleCatchErrorMessage } from "../../../utils/CustomFunctions";
import CommonDialog from "../../common/CommonDialog";
import CommonModal from "../../CommonModal";
import DangerButton from "../../DangerButton";
import SecondaryButton from "../../SecondaryButton";
import ListingFeeTab from "./ListingFeeTab";
import OtherExpensesTab from "./OtherExpensesTab";
import PersonalInfoTab from "./PersonalInfoTab";
import PriceModeTab from "./PriceModeTab";
import TermsAndConditionsTab from "./TermsAndConditionsTab";

function ViewRegistrationDetailsModal({ approval, clientStatus, module, ...props }) {
  const { onClose, open } = props;
  const { notifications, isNotificationFetching } = useContext(AppContext);

  const [reason, setReason] = useState("");
  const [confirmReason, setConfirmReason] = useState(false);
  const [viewedTabs, setViewedTabs] = useState({
    "Personal Info": false,
    "Terms and Conditions": false,
    Attachments: false,
  });

  const location = useLocation();
  const isRegistrationApproval = location?.pathname === "/approval/registration-approval"
  const isAddItemsApproval = location?.pathname === "/approval/item-approval"
  const isEditClientApproval = location?.pathname === "/approval/edit-client-approval"

  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const userDetails = useSelector((state) => state.login.userDetails);
  const messageReceiverNumberApproved =
    selectedRowData?.nextApproverMobileNumber
      ? selectedRowData?.nextApproverMobileNumber
      : selectedRowData?.requestorMobileNumber;
  const messageReceiverNumberRejected = selectedRowData?.requestorMobileNumber;

  const messageReceiverNameApproved = selectedRowData?.nextApprover
    ? selectedRowData?.nextApprover
    : selectedRowData?.requestor;
  const messageReceiverNameRejected = selectedRowData?.requestor;

  const messageReceiverMessageApproved = selectedRowData?.nextApprover
    ? "You have a new customer approval."
    : `${selectedRowData?.businessName}'s registration request has been approved.`;
  const messageReceiverMessageRejected = `${selectedRowData?.businessName}'s registration request has been rejected.`;

  const snackbar = useSnackbar();

  const isHead = userDetails?.roleName === "Head";
  const isManager = userDetails?.roleName === "Manager";
  const isAdmin = userDetails?.roleName === "Admin";

  const [activeTab, setActiveTab] = useState(
    // (isHead || isManager || module === "Add Item Approval" || module === "Edit Client Approval") ? "Price Mode" : 
    "Personal Info"
  );

  //Disclosures
  const {
    isOpen: isApproveConfirmOpen,
    onOpen: onApproveConfirmOpen,
    onClose: onApproveConfirmClose,
  } = useDisclosure();

  const {
    isOpen: isRejectConfirmOpen,
    onOpen: onRejectConfirmOpen,
    onClose: onRejectConfirmClose,
  } = useDisclosure();

  //Constants
  const navigators = [
    { label: "Personal Info", disabled: false },
    { label: "Price Mode", disabled: false },
    { label: "Terms and Conditions", disabled: false },
    // { label: "Attachments", disabled: false },
    { label: "Listing Fee", disabled: false },
    { label: "Other Expenses", disabled: false },
  ]
    .filter((item) => {
      if (
        isAddItemsApproval || isEditClientApproval
      ) {
        return item.label === "Price Mode";
      }

      return true;
    });


  if (!(isHead || isManager || module === "Add Item Approval" || module === "Edit Client Approval")) {
    navigators[1].disabled = approval && !viewedTabs["Personal Info"];
    navigators[2].disabled = approval && !viewedTabs["Price Mode"];
    navigators[3].disabled = approval && !viewedTabs["Terms and Conditions"];
    // navigators[4].disabled = approval && !viewedTabs["Attachments"];
    navigators[4].disabled = approval && !viewedTabs["Listing Fee"];
  }
  // if (clientStatus !== "Approved") {
  //   for (let i = navigators.length - 1; i >= 3; i--) {
  //     navigators.splice(i, 1);
  //   }
  // }



  //RTK Query
  const [putApproveClient, { isLoading: isApproveLoading }] =
    usePutApproveClientMutation();
  const [putRejectClient, { isLoading: isRejectLoading }] =
    usePutRejectClientMutation();
  const [putApproveItemRequest, { isLoading: isRequestApproveLoading }] = usePatchApproveEditClientRequestMutation()
  const [putRejectItemRequest, { isLoading: isRequestRejectLoading }] = usePatchRejectEditClientRequestMutation()

  // const [sendMessage, { isLoading: isSendMessageLoading }] =
  //   useSendMessageMutation();


  const [triggerListingFee, { data: listingFeeData }] =
    useLazyGetListingFeeByClientIdQuery();
  const [triggerExpenses, { data: otherExpensesData }] =
    useLazyGetOtherExpensesByClientIdQuery();

  const { data: usersWithAdjustments, isFetching: adjustmentFetching } =
    useGetUsersWithAdjustmentsQuery();

  const filteredUsers = usersWithAdjustments?.filter(
    (item) => item?.pendingAdjustments === 0
  );
  //Handler Functions
  const handleClose = () => {
    onClose();
    setReason("");
    setConfirmReason(false);
    setActiveTab((module === "Add Item Approval") ? "Price Mode" : "Personal Info"); setViewedTabs({
      "Personal Info": false,
      "Terms and Conditions": false,
      Attachments: false,
    });
  };

  const customRibbonContent = (
    <Box sx={{ display: "flex", flex: 1, gap: "10px", alignItems: "center" }}>
      <Box
        className={
          selectedRowData?.terms === "COD"
            ? "viewRegistrationModal__headersFive"
            : "viewRegistrationModal__headers"
        }
      >
        {navigators.map((item, i) => (
          <Button
            key={i}
            className={
              "viewRegistrationModal__headers__item" +
              (activeTab === item.label ? " active" : "")
            }
            disabled={item.disabled}
            onClick={() => {
              setActiveTab(item.label);
            }}
          >
            <Typography>{item.label}</Typography>
          </Button>
        ))}
      </Box>
      <IconButton
        sx={{ color: "white !important", height: "40px", width: "40px" }}
        onClick={handleClose}
      >
        <Close />
      </IconButton>
    </Box>
  );

  const handleNext = () => {
    if (activeTab === "Personal Info") {
      setActiveTab("Price Mode");
    } else if (activeTab === "Price Mode") {
      setActiveTab("Terms and Conditions");
    } else if (
      activeTab === "Terms and Conditions"
    ) {
      setActiveTab("Listing Fee");
    } else if (activeTab === "Listing Fee") {
      setActiveTab("Other Expenses");
    }
  };

  const handleBack = () => {
    if (activeTab === "Price Mode") {
      setActiveTab("Personal Info");
    }
    if (activeTab === "Terms and Conditions") {
      setActiveTab("Price Mode");
    } else if (activeTab === "Listing Fee") {
      setActiveTab("Terms and Conditions");
    } else if (activeTab === "Other Expenses") {
      setActiveTab("Listing Fee");
    }
  };

  const handleApprove = async () => {
    try {
      if (!isRegistrationApproval) {
        await putApproveItemRequest(selectedRowData?.id).unwrap()
      } else {
        await putApproveClient({
          id: selectedRowData?.requestId,
          ...(listingFeeData?.listingFees?.[0]?.listingItems?.length > 0 && {
            ListingFeeRequestId: listingFeeData?.listingFees?.[0]?.requestId,
          }),
          ...(otherExpensesData?.expenses?.[0]?.expenses?.length > 0 && {
            OtherExpensesRequestId: otherExpensesData?.expenses?.[0]?.requestId,
          }),
        }).unwrap();
      }


      // await sendMessage({
      //   message: `Fresh morning ${messageReceiverNameApproved}! ${messageReceiverMessageApproved}`,
      //   mobile_number: `+63${messageReceiverNumberApproved}`,
      // }).unwrap();

      snackbar({ message: "Client approved successfully", variant: "success" });

      handleClose();
    } catch (error) {
      if (error.function !== "sendMessage") {
        onApproveConfirmClose();
        return snackbar({
          message: handleCatchErrorMessage(error),
          variant: "error",
        });
      }

      snackbar({
        message:
          "Registration approved successfully but failed to send message.",
        variant: "warning",
      });
      handleClose();
    }

    onApproveConfirmClose();
  };

  const handleRejectConfirmClose = () => {
    setReason("");
    setConfirmReason(false);
    onRejectConfirmClose();
  };

  const handleReject = async () => {
    try {
      if ((isHead && !isRegistrationApproval) || isManager) {
        await putRejectItemRequest(selectedRowData?.id).unwrap()
      } else {
        await putRejectClient({
          id: selectedRowData?.requestId,
          body: { reason },
          ...(listingFeeData?.listingFees?.[0]?.listingItems?.length > 0 && {
            ListingFeeRequestId: listingFeeData?.listingFees?.[0]?.requestId,
          }),
          ...(otherExpensesData?.expenses?.[0]?.expenses?.length > 0 && {
            OtherExpensesRequestId: otherExpensesData?.expenses?.[0]?.requestId,
          }),
        }).unwrap();
      }
      // await sendMessage({
      //   message: `Fresh morning ${messageReceiverNameRejected}! ${messageReceiverMessageRejected}`,
      //   mobile_number: `+63${messageReceiverNumberRejected}`,
      // }).unwrap();

      snackbar({ message: "Client rejected successfully", variant: "success" });
    } catch (error) {
      if (error.function !== "sendMessage") {
        return snackbar({
          message: handleCatchErrorMessage(error),
          variant: "error",
        });
      }

      snackbar({
        message:
          "Registration rejected successfully but failed to send message.",
        variant: "warning",
      });
    }

    handleRejectConfirmClose();
    handleClose();
  };

  useEffect(() => {
    setViewedTabs((prev) => ({
      ...prev,
      [activeTab]: true,
    }));
  }, [activeTab]);

  useEffect(() => {
    if (open) {
      triggerListingFee(
        {
          id: selectedRowData?.id,
        },
        { preferCacheValue: true }
      );
      triggerExpenses(
        {
          id: selectedRowData?.id,
        },
        { preferCacheValue: true }
      );
    }
  }, [open, selectedRowData?.id, triggerListingFee, triggerExpenses]);


  useEffect(() => {
    if (!open) return;
    if (isAddItemsApproval || isEditClientApproval) {
      setActiveTab("Price Mode");
    }
  }, [isAddItemsApproval, isEditClientApproval, open]);

  return (
    <>
      <CommonModal
        width="900px"
        // height="680px"
        // height="660px"
        height="90dvh"
        // overflow="auto"
        disablePadding
        ribbon
        customRibbonContent={customRibbonContent}
        ribbonPadding={"10px"}
        closeOnBackdropClick={!approval}
        {...props}
      >
        <Box className="viewRegistrationModal">
          {activeTab === "Personal Info" && <PersonalInfoTab />}
          {activeTab === "Price Mode" && <PriceModeTab />}
          {activeTab === "Terms and Conditions" && <TermsAndConditionsTab />}
          {/* {activeTab === "Attachments" && <AttachmentsTab />} */}
          {/* {activeTab === "Freebies" && <FreebiesTab />} */}
          {activeTab === "Listing Fee" && <ListingFeeTab />}
          {activeTab === "Other Expenses" && <OtherExpensesTab />}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              // gap: "10px",
              position: "absolute",
              bottom: "20px",
              // right: "20px",
              width: "calc(100% - 40px)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: "10px",
                // justifyContent: "end",
                justifyContent:
                  (activeTab === "Personal Info" || isEditClientApproval || isAddItemsApproval) ? "end" : "space-between",
                flex: 1,
              }}
            >
              {!(isEditClientApproval || isAddItemsApproval || activeTab === "Personal Info") && (
                <DangerButton onClick={handleBack}>Back</DangerButton>
              )}
              {/* <Box
                sx={{
                  display: "flex",
                  gap: "10px",
                }}
              > */}
              {/* {!approval && (
                  <AccentButton
                    sx={{ color: "white !important" }}
                    onClick={() => {
                      setEditMode(true);
                      onRegisterOpen();
                    }}
                  >
                    Edit
                  </AccentButton>
                )} */}
              {activeTab !== navigators[navigators?.length - 1]?.label && (
                <SecondaryButton onClick={handleNext}>Next</SecondaryButton>
              )}
              {/* </Box> */}
              {((activeTab ===
                // "Listing Fee"
                navigators[navigators?.length - 1]?.label &&
                approval &&
                clientStatus === "Under review") && !isAdmin) && (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "end",
                        gap: "10px",
                      }}
                    >
                      <DangerButton
                        contained
                        onClick={() => {
                          // if (filteredUsers?.length > 0) {
                          //   const error = filteredUsers?.find(
                          //     (users) =>
                          //       users?.name === selectedRowData?.requestor
                          //   );
                          //   if (error) {
                          //     snackbar({
                          //       message: `Pending Ending Inventory : ${notifications?.scheduledInventoryAdjustments}`,
                          //       variant: "warning",
                          //     });
                          //     return;
                          //   }
                          // }
                          onRejectConfirmOpen();
                        }}
                        data-testid="reject-registration"
                      >
                        Reject
                      </DangerButton>

                      <SecondaryButton
                        onClick={() => {
                          // if (filteredUsers?.length > 0) {
                          //   const error = filteredUsers?.find(
                          //     (users) =>
                          //       users?.name === selectedRowData?.requestor
                          //   );
                          //   if (error) {
                          //     snackbar({
                          //       message: `Pending Ending Inventory : ${notifications?.scheduledInventoryAdjustments}`,
                          //       variant: "warning",
                          //     });
                          //     return;
                          //   }
                          // }
                          onApproveConfirmOpen();
                        }}
                        data-testid="approve-registration"
                      >
                        Approve
                      </SecondaryButton>
                    </Box>
                  </>
                )}
            </Box>
          </Box>
        </Box>
      </CommonModal>

      {approval && (
        <>
          <CommonDialog
            onClose={onApproveConfirmClose}
            open={isApproveConfirmOpen}
            onYes={handleApprove}
            isLoading={isApproveLoading || isRequestApproveLoading}
            question
          >
            Are you sure you want to approve{" "} {isHead ? isRegistrationApproval ? " " : " additional items for " : " item changes from "}
            {selectedRowData?.clientName || "client"}
            ?
          </CommonDialog>

          <CommonDialog
            onClose={handleRejectConfirmClose}
            open={isRejectConfirmOpen}
            onYes={handleReject}
            isLoading={isRejectLoading || isRequestRejectLoading}
            disableYes={!confirmReason || !reason.trim()}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <Box>
                Are you sure you want to reject{" "}
                <span
                  style={{ fontWeight: "bold", textTransform: "uppercase" }}
                >
                  {selectedRowData?.businessName || "client"}
                </span>
                ?
              </Box>

              <TextField
                size="small"
                label="Reason"
                autoComplete="off"
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value.toUpperCase());
                }}
                multiline
                rows={3}
                data-testid="reject-reason"
              />
              <Box sx={{ display: "flex", justifyContent: "end", gap: "5x" }}>
                <Typography>Confirm reason</Typography>
                <Checkbox
                  checked={confirmReason}
                  onChange={(e) => {
                    setConfirmReason(e.target.checked);
                  }}
                  disabled={!reason.trim()}
                  data-testid="confirm-reason"
                />
              </Box>
            </Box>
          </CommonDialog>
        </>
      )
      }
    </>
  );
}

export default ViewRegistrationDetailsModal;
