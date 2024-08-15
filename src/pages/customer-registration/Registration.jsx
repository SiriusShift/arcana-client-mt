import { useContext, useEffect, useMemo, useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import CommonTable from "../../components/CommonTable";
import useDisclosure from "../../hooks/useDisclosure";
import PageHeaderAddTabs from "../../components/PageHeaderAddTabs";
import DirectRegisterForm from "./registration/DirectRegisterForm";
import {
  useGetAllClientsQuery,
  usePutVoidClientRegistrationMutation,
} from "../../features/registration/api/registrationApi";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import ViewRegistrationDetailsModal from "../../components/modals/view-registration-modal/ViewRegistrationDetailsModal";
import CommonDialog from "../../components/common/CommonDialog";
import useSnackbar from "../../hooks/useSnackbar";
import { useSelector } from "react-redux";
import ApprovalHistoryModal from "../../components/modals/ApprovalHistoryModal";
import PrintFreebiesModal from "../../components/modals/PrintFreebiesModal";
import { AppContext } from "../../context/AppContext";
import SearchVoidFilterMixin from "../../components/mixins/SearchVoidFilterMixin";
import { usePatchReadNotificationMutation } from "../../features/notification/api/notificationApi";
import PrintTTAModal from "../../components/modals/registration/PrintTTAModal";

function DirectRegistration() {
  const [search, setSearch] = useState("");
  const [origin, setOrigin] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const [voidConfirmBox, setVoidConfirmBox] = useState("");

  const snackbar = useSnackbar();
  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const userDetails = useSelector((state) => state.login.userDetails);

  const isApprovedOnly =
    userDetails?.permission?.includes("Approved Clients") &&
    !userDetails?.permission?.includes("Pending Clients") &&
    !userDetails?.permission?.includes("Rejected Clients");

  const [clientStatus, setClientStatus] = useState(
    isApprovedOnly ? "Approved" : "Under review"
  );
  const [tabViewing, setTabViewing] = useState(isApprovedOnly ? 2 : 1);

  const { notifications, isNotificationFetching } = useContext(AppContext);

  //Disclosures
  const {
    isOpen: isRegisterOpen,
    onOpen: onRegisterOpen,
    onClose: onRegisterClose,
  } = useDisclosure();

  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();

  const {
    isOpen: isVoidOpen,
    onOpen: onVoidOpen,
    onClose: onVoidClose,
  } = useDisclosure();

  const {
    isOpen: isHistoryOpen,
    onOpen: onHistoryOpen,
    onClose: onHistoryClose,
  } = useDisclosure();

  const {
    isOpen: isPrintTTAOpen,
    onOpen: onPrintTTAOpen,
    onClose: onPrintTTAClose,
  } = useDisclosure();

  const {
    isOpen: isPrintOpen,
    onOpen: onPrintOpen,
    onClose: onPrintClose,
  } = useDisclosure();

  //RTK Query
  const { data, isFetching } = useGetAllClientsQuery({
    Search: search,
    // Status: status,
    RegistrationStatus: clientStatus,
    Origin: origin,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });
  const [putVoidClientRegistration, { isLoading: isVoidLoading }] =
    usePutVoidClientRegistrationMutation();

  const [patchReadNotification] = usePatchReadNotificationMutation();

  //Constants
  const registrationNavigation = useMemo(
    () => [
      ...(userDetails?.permission?.includes("Pending Clients")
        ? [
            {
              case: 1,
              name: "Pending Clients",
              registrationStatus: "Under review",
              // badge: notifications["pendingClient"],
            },
          ]
        : []),
      {
        case: 2,
        name: "Approved Clients",
        registrationStatus: "Approved",
        badge: notifications["approvedClient"],
      },
      ...(userDetails?.permission?.includes("Rejected Clients")
        ? [
            {
              case: 3,
              name: "Rejected Clients",
              registrationStatus: "Rejected",
              badge: notifications["rejectedClient"],
            },
          ]
        : []),
    ],
    [notifications, userDetails?.permission]
  );

  const selectOptions = [
    {
      value: " ",
      label: "All",
    },
    {
      value: "prospecting",
      label: "Prospect",
    },
    {
      value: "direct",
      label: "Direct",
    },
  ];

  const tableHeads = [
    "Business Name",
    "Owner's Name",
    "Contact Number",
    "Business Type",
    "Business Address",
    "Cluster",
    "Origin",
  ];

  const customOrderKeys = [
    "businessName",
    "ownersName",
    "phoneNumber",
    "storeType",
    "businessAddress",
    "clusterName",
    "origin",
  ];

  const nestedProperty = {
    key: "businessAddress",
    nestedKeys: ["city", "province"],
  };

  const disableActions = ["printFreebies"];

  const handleEditOpen = () => {
    setEditMode(true);
    onRegisterOpen();
  };

  const onVoidSubmit = async () => {
    try {
      await putVoidClientRegistration(selectedRowData?.id).unwrap();
      onVoidClose();
      snackbar({ message: "Client voided successfully", variant: "success" });
    } catch (error) {
      if (error?.data?.error?.message) {
        snackbar({ message: error?.data?.error?.message, variant: "error" });
      } else {
        snackbar({ message: "Error voiding client", variant: "error" });
      }
    }
  };

  useEffect(() => {
    const foundItem = registrationNavigation.find(
      (item) => item.case === tabViewing
    );

    setClientStatus(foundItem?.registrationStatus);
  }, [tabViewing, registrationNavigation]);

  useEffect(() => {
    if (notifications["rejectedClient"] > 0 && clientStatus === "Rejected") {
      patchReadNotification({ Tab: "Rejected Clients" });
    }

    if (notifications["approvedClient"] > 0 && clientStatus === "Approved") {
      patchReadNotification({ Tab: "Approved Clients" });
    }
  }, [clientStatus, patchReadNotification, notifications]);

  useEffect(() => {
    setCount(data?.totalCount);
  }, [data]);

  useEffect(() => {
    setPage(0);
  }, [tabViewing, search, rowsPerPage]);

  return (
    <>
      <Box className="commonPageLayout">
        <PageHeaderAddTabs
          pageTitle="Registration"
          tabsList={registrationNavigation}
          tabViewing={tabViewing}
          setTabViewing={setTabViewing}
          onOpen={onRegisterOpen}
          addTitle="Register Direct"
          isNotificationFetching={isNotificationFetching}
          removeAdd={isApprovedOnly}
        />

        <SearchVoidFilterMixin
          setSearch={setSearch}
          selectOptions={selectOptions}
          setSelectValue={setOrigin}
          status={clientStatus}
          setStatus={setClientStatus}
        />

        {isFetching ? (
          <CommonTableSkeleton lowerCompact />
        ) : (
          <CommonTable
            mapData={data?.regularClient}
            lowerCompact
            moveNoDataUp
            count={count}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            page={page}
            setPage={setPage}
            tableHeads={tableHeads}
            customOrderKeys={customOrderKeys}
            nestedProperty={nestedProperty}
            onView={onViewOpen}
            onHistory={onHistoryOpen}
            onEdit={
              clientStatus !== "Voided" &&
              (userDetails?.roleName === "Admin"
                ? handleEditOpen
                : userDetails?.roleName !== "Admin"
                ? clientStatus !== "Approved" && handleEditOpen
                : null)
            }
            // onArchive={onArchiveOpen}
            onVoid={clientStatus === "Rejected" && onVoidOpen}
            onPrintFreebies={onPrintOpen}
            onPrintTTA={clientStatus === "Approved" && onPrintTTAOpen}
            disableActions={
              (!selectedRowData?.freebies ||
                selectedRowData?.freebies?.length === 0) &&
              disableActions
            }
          />
        )}
      </Box>

      <DirectRegisterForm
        open={isRegisterOpen}
        onClose={onRegisterClose}
        editMode={editMode}
        setEditMode={setEditMode}
        clientStatus={clientStatus}
      />

      <ViewRegistrationDetailsModal
        open={isViewOpen}
        onClose={onViewClose}
        clientStatus={clientStatus}
      />

      <PrintTTAModal open={isPrintTTAOpen} onClose={onPrintTTAClose} />

      <CommonDialog
        open={isVoidOpen}
        onClose={onVoidClose}
        isLoading={isVoidLoading}
        onYes={onVoidSubmit}
        disableYes={voidConfirmBox !== selectedRowData?.businessName}
      >
        Are you sure you want to void client{" "}
        <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
          {selectedRowData?.businessName}
        </span>
        ? <br />
        <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>
          (This action cannot be reversed)
        </span>
        <br />
        <Box
          sx={{ display: "flex", flexDirection: "column", marginTop: "20px" }}
        >
          <Typography sx={{ textAlign: "left", fontWeight: "bold" }}>
            To confirm, type &quot;{selectedRowData?.businessName}&quot; in the
            box below
          </Typography>
          <TextField
            size="small"
            // fullWidth
            autoComplete="off"
            onChange={(e) => {
              setVoidConfirmBox(e.target.value);
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "error.main", // Set your desired border color here
                },
              },
            }}
          />
        </Box>
      </CommonDialog>

      <ApprovalHistoryModal open={isHistoryOpen} onClose={onHistoryClose} />

      <PrintFreebiesModal
        open={isPrintOpen}
        // open={true}
        onClose={onPrintClose}
      />
    </>
  );
}

export default DirectRegistration;
