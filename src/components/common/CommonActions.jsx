import { IconButton, Menu, MenuItem } from "@mui/material";
import { useRef } from "react";
import useDisclosure from "../../hooks/useDisclosure";
import {
  Archive,
  Attachment,
  Autorenew,
  Block,
  Cancel,
  CheckCircle,
  Delete,
  Edit,
  FileCopy,
  History,
  HowToReg,
  Map,
  MonetizationOn,
  More,
  MoveToInbox,
  Password,
  Payment,
  PeopleAlt,
  PersonAdd,
  Print,
  Receipt,
  RemoveCircle,
  Logout,
  RequestPage,
  Restore,
  ShoppingCart,
  Tag,
  Update,
  Visibility,
  ZoomIn,
  Download,
  ContentCopy,
} from "@mui/icons-material";

function CommonActions({
  iconColor,
  icon,
  onEdit,
  onArchive,
  onView,
  onMap,
  onCheckout,
  onTag,
  onFreebie,
  onReleaseFreebie,
  onRegularRegister,
  onUpdateFreebies,
  onCancelFreebies,
  onManageApprovers,
  onPrintTTA,
  onPrintFreebies,
  onAddPriceChange,
  onVoid,
  onDelete,
  onCancel,
  onHistory,
  onResetPassword,
  onTagUserInCluster,
  onViewCluster,
  onManageProducts,
  onPriceChange,
  onAttach,
  onRemove,
  onApprove,
  onReject,
  onReceive,
  onClear,
  onFile,
  onPaymentHistories,
  onListingHistories,
  onPay,
  onInspect,
  onDownload,
  onReplace,
  disableActions,
  item,
  status,
  disabled,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const anchorRef = useRef();

  const handleAction = (action) => {
    if (action === "edit") {
      onEdit(item);
    } else if (action === "archive") {
      onArchive(item.id);
    } else if (action === "tag") {
      onTag();
    } else if (action === "map") {
      onMap();
    }else if(action === "checkout"){
      onCheckout();
    } else if (action === "requestFreebie") {
      onFreebie();
    } else if (action === "releaseFreebie") {
      onReleaseFreebie();
    } else if (action === "regularRegister") {
      onRegularRegister();
    } else if (action === "updateFreebies") {
      onUpdateFreebies();
    } else if (action === "cancelFreebies") {
      onCancelFreebies();
    } else if (action === "viewMore") {
      onView(item);
    } else if (action === "manageApprovers") {
      onManageApprovers();
    } else if (action === "void") {
      onVoid();
    } else if (action === "history") {
      onHistory();
    } else if (action === "printTTA") {
      onPrintTTA();
    } else if (action === "printFreebies") {
      onPrintFreebies();
    } else if (action === "addPriceChange") {
      onAddPriceChange();
    } else if (action === "delete") {
      onDelete();
    } else if (action === "tagUserInCluster") {
      onTagUserInCluster();
    } else if (action === "viewCluster") {
      onViewCluster();
    } else if (action === "cancel") {
      onCancel();
    } else if (action === "resetPassword") {
      onResetPassword();
    } else if (action === "manageProducts") {
      onManageProducts();
    } else if (action === "priceChange") {
      onPriceChange();
    } else if (action === "attach") {
      onAttach();
    } else if (action === "remove") {
      onRemove();
    } else if (action === "approve") {
      onApprove();
    } else if (action === "reject") {
      onReject();
    } else if (action === "paymentHistories") {
      onPaymentHistories();
    } else if (action === "clear") {
      onClear();
    } else if (action === "receive") {
      onReceive();
    } else if (action === "file") {
      onFile();
    } else if (action === "pay") {
      onPay();
    } else if (action === "inspect") {
      onInspect();
    } else if (action === "listingHistories"){
      onListingHistories();
    } else if (action === "download"){
      onDownload();
    } else if (action === "replace"){
      onReplace();
    }

    onClose();
  };

  return (
    <>
      <IconButton
        onClick={onOpen}
        sx={{ color: iconColor ? iconColor : "secondary.main", p: 0 }}
        ref={anchorRef}
        data-testid="actions"
        data-tour="actions"
        disabled={disabled}
      >
        {icon ? icon : <More />}
      </IconButton>

      <Menu
        open={isOpen}
        onClose={onClose}
        anchorEl={anchorRef.current}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "primary.main",
            color: "white !important",
          },
        }}
      >
        {onView && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("viewMore");
            }}
            disabled={
              disableActions ? disableActions?.includes("viewMore") : false
            }
          >
            <Visibility />
            View
          </MenuItem>
        )}

        {onReceive && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("receive");
            }}
            disabled={
              disableActions ? disableActions?.includes("receive") : false
            }
          >
            <MoveToInbox />
            Receive
          </MenuItem>
        )}

        {
          onCheckout && (
            <MenuItem
              className="actionsMenuItem"
              onClick={() => {
                handleAction("checkout");
              }}
              disabled={
                disableActions ? disableActions?.includes("checkout") : false
              }
            >
              <Logout />
              Checkout
            </MenuItem>
          )
        }

        {onInspect && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("inspect");
            }}
            disabled={
              disableActions ? disableActions?.includes("inspect") : false
            }
          >
            <ZoomIn />
            Inspect
          </MenuItem>
        )}

        {onApprove && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("approve");
            }}
            disabled={
              disableActions ? disableActions?.includes("approve") : false
            }
          >
            <CheckCircle />
            Approve
          </MenuItem>
        )}

        {onTag && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("tag");
            }}
            disabled={disableActions ? disableActions?.includes("tag") : false}
          >
            <Tag />
            Tagging
          </MenuItem>
        )}

        {onMap && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("map");
            }}
            disabled={disableActions ? disableActions?.includes("map") : false}
          >
            <Map />
            Map
          </MenuItem>
        )}

        {onClear && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("clear");
            }}
            disabled={
              disableActions ? disableActions?.includes("clear") : false
            }
          >
            <Autorenew />
            Clear
          </MenuItem>
        )}

        {onViewCluster && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("tag");
            }}
            disabled={
              disableActions ? disableActions?.includes("viewCluster") : false
            }
          >
            <Visibility />
            View Cluster
          </MenuItem>
        )}

        {onTagUserInCluster && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("tagUserInCluster");
            }}
            disabled={
              disableActions
                ? disableActions?.includes("tagUserInCluster")
                : false
            }
          >
            <PersonAdd />
            Tag CDO
          </MenuItem>
        )}

        {onEdit && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("edit");
            }}
            disabled={disableActions ? disableActions?.includes("edit") : false}
          >
            <Edit />
            Edit
          </MenuItem>
        )}

        {onArchive && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("archive");
            }}
            disabled={
              disableActions ? disableActions?.includes("archive") : false
            }
          >
            {status ? <Archive /> : <Restore />}
            {status ? "Archive" : "Restore"}
          </MenuItem>
        )}

        {onPay && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("pay");
            }}
            disabled={disableActions ? disableActions?.includes("pay") : false}
          >
            <Payment />
            Pay Now
          </MenuItem>
        )}

        {onManageProducts && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("manageProducts");
            }}
            disabled={
              disableActions
                ? disableActions?.includes("manageProducts")
                : false
            }
          >
            <ShoppingCart />
            Manage Products
          </MenuItem>
        )}

        {onFile && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("file");
            }}
            disabled={disableActions ? disableActions?.includes("file") : false}
          >
            <FileCopy />
            File
          </MenuItem>
        )}

        {onPriceChange && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("priceChange");
            }}
            disabled={
              disableActions ? disableActions?.includes("priceChange") : false
            }
          >
            <MonetizationOn />
            Price Change
          </MenuItem>
        )}

        {onFreebie && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("requestFreebie");
            }}
            disabled={
              disableActions
                ? disableActions?.includes("requestFreebie")
                : false
            }
          >
            <RequestPage />
            Add Freebie(s)
          </MenuItem>
        )}

        {onReleaseFreebie && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("releaseFreebie");
            }}
            disabled={
              disableActions
                ? disableActions?.includes("releaseFreebie")
                : false
            }
          >
            <RequestPage />
            Release Freebie(s)
          </MenuItem>
        )}

        {onRegularRegister && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("regularRegister");
            }}
            disabled={
              disableActions
                ? disableActions?.includes("regularRegister")
                : false
            }
          >
            <HowToReg />
            Register as Regular
          </MenuItem>
        )}

        {onUpdateFreebies && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("updateFreebies");
            }}
            disabled={
              disableActions
                ? disableActions?.includes("updateFreebies")
                : false
            }
          >
            <Update />
            Update Freebies
          </MenuItem>
        )}

        {onCancelFreebies && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("cancelFreebies");
            }}
            disabled={
              disableActions
                ? disableActions?.includes("cancelFreebies")
                : false
            }
          >
            <Cancel />
            Cancel Freebies
          </MenuItem>
        )}

        {onManageApprovers && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("manageApprovers");
            }}
            disabled={
              disableActions
                ? disableActions?.includes("manageApprovers")
                : false
            }
          >
            <PeopleAlt />
            Manage Approvers
          </MenuItem>
        )}

        {onAddPriceChange && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("addPriceChange");
            }}
            disabled={
              disableActions
                ? disableActions?.includes("addPriceChange")
                : false
            }
          >
            <MonetizationOn />
            Add Price Change
          </MenuItem>
        )}

        {onReject && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("reject");
            }}
            disabled={
              disableActions ? disableActions?.includes("reject") : false
            }
          >
            <Cancel />
            Reject
          </MenuItem>
        )}

        {onHistory && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("history");
            }}
            disabled={
              disableActions ? disableActions?.includes("history") : false
            }
          >
            <History />
            History
          </MenuItem>
        )}

        {onPrintTTA && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("printTTA");
            }}
            disabled={
              disableActions ? disableActions?.includes("printTTA") : false
            }
          >
            <Print />
            Print TTA
          </MenuItem>
        )}

        {onPrintFreebies && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("printFreebies");
            }}
            disabled={
              disableActions ? disableActions?.includes("printFreebies") : false
            }
          >
            <Print />
            Print Freebies
          </MenuItem>
        )}

        {onAttach && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("attach");
            }}
            disabled={
              disableActions ? disableActions?.includes("onAttach") : false
            }
          >
            <Attachment />
            Invoice Attachment
          </MenuItem>
        )}

        {onDownload && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("download");
            }}
            disabled={
              disableActions ? disableActions?.includes("download") : false
            }
          >
            <Download />
            Download
          </MenuItem>
        )}

        {onResetPassword && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("resetPassword");
            }}
            disabled={
              disableActions ? disableActions?.includes("resetPassword") : false
            }
          >
            <Password />
            Reset Password
          </MenuItem>
        )}

        {onPaymentHistories && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("paymentHistories");
            }}
            disabled={
              disableActions
                ? disableActions?.includes("paymentHistories")
                : false
            }
          >
            <Receipt />
            Payment Histories
          </MenuItem>
        )}

        {onListingHistories && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("listingHistories");
            }}
            disabled={
              disableActions
                ? disableActions?.includes("listingHistories")
                : false
            }
          >
            <Receipt />
            Listing Fee History
          </MenuItem>
        )}

        {/* Negative */}

        {onVoid && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("void");
            }}
            disabled={disableActions ? disableActions?.includes("void") : false}
          >
            <Block />
            Void
          </MenuItem>
        )}

        {onDelete && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("delete");
            }}
            disabled={
              disableActions ? disableActions?.includes("delete") : false
            }
          >
            <Delete />
            Delete
          </MenuItem>
        )}

        {onRemove && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("remove");
            }}
            disabled={
              disableActions ? disableActions?.includes("remove") : false
            }
          >
            <RemoveCircle />
            Remove
          </MenuItem>
        )}

        {onCancel && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("cancel");
            }}
            disabled={
              disableActions ? disableActions?.includes("cancel") : false
            }
          >
            <Cancel />
            Cancel
          </MenuItem>
        )}

        {onReplace && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("replace");
            }}
            disabled={
              disableActions ? disableActions?.includes("replace") : false
            }
          >
            <ContentCopy />
            Replace
          </MenuItem>
        )}
      </Menu>
    </>
  );
}

export default CommonActions;
