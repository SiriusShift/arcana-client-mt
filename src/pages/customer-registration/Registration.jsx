import { useContext, useEffect, useMemo, useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { GetApp } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
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
import SessionExpired from "../SessionExpired";
import SecondaryButton from "../../components/SecondaryButton";
// import { useLazyGetConsolidateApprovedClientsExportQuery } from "../../features/registration/api/registrationApi";
import * as _ from "lodash";
import { decryptString } from "../../utils/CustomFunctions";

function DirectRegistration() {
  const [search, setSearch] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [clusterId, setClusterId] = useState("");
  const [origin, setOrigin] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [dateFrom, setDateFrom] = useState(moment());
  const [dateTo, setDateTo] = useState(moment());
  const [dateFromTemp, setDateFromTemp] = useState(moment());
  const [dateToTemp, setDateToTemp] = useState(moment());
  console.log("dateFromTemp", dateFromTemp);
  console.log("dateToTemp", dateToTemp);

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
  console.log(tabViewing);

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
  const { data, isFetching, error } = useGetAllClientsQuery(
    {
      Search: search,
      // Status: status,
      RegistrationStatus: clientStatus,
      Origin: origin,
      ClusterId: clusterId?.value || "",
      BusinessType: businessType?.id || "",
      PageNumber: page + 1,
      PageSize: rowsPerPage,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const [putVoidClientRegistration, { isLoading: isVoidLoading }] =
    usePutVoidClientRegistrationMutation();

  const [patchReadNotification] = usePatchReadNotificationMutation();

  // const [getConsolidateClients, { isFetching: isExportLoading, data: exportData }] = useLazyGetConsolidateApprovedClientsExportQuery({
  //   DateFrom: moment(dateFrom).format("YYYY-MM-DD"),
  //   DateTo: moment(dateTo).format("YYYY-MM-DD"),
  // });

  // if(exportData){
  //   console.log("hello");
  //   const fileName = `ArcanaApprovedClients_${moment(dateFrom).format("YYYY-MM-DD")}_${moment(dateTo).format("YYYY-MM-DD")}.xlsx`
  //   const url = window.URL.createObjectURL(new Blob([exportData]));
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.setAttribute("download", fileName);
  //   document.body.appendChild(link);
  //   link.click();
  // }

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

  const useDownloadExcel = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BASEURL
        }approved-clients-export?DateFrom=${moment(dateFromTemp).format(
          "MM-DD-YYYY"
        )}&DateTo=${moment(dateToTemp).format("MM-DD-YYYY")}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Accept: " application/json",
            Authorization: `Bearer ${decryptString(
              sessionStorage.getItem("token")
            )}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to download Excel file.");
      }
      console.log(response);
      const blob = await response.blob();
      const link = document.createElement("a");
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.setAttribute(
        "download",
        `ArcanaApprovedClients_${moment(dateFromTemp).format(
          "YYYYMMDD"
        )}_${moment(dateToTemp).format("YYYYMMDD")}.xlsx`
      );
      document.body.appendChild(link);
      link.click();

      // Clean up and revoke the object URL
      link.parentNode.removeChild(link);
      // const link = document.createElement("a");
      // link.href = response.url;
      // link.click();
      // link.remove();
    } catch (error) {
      console.error("Error while downloading Excel file:", error);
    }
  };

  const handleSubmitDate = () => {
    setDateFrom(dateFromTemp);
    setDateTo(dateToTemp);
    useDownloadExcel();
  };

  const onFilter = async ({ clusterId, businessType }) => {
    try {
      setClusterId(clusterId);
      setBusinessType(businessType);
    } catch (error) {
      console.log(error);
    }
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
      {error && <SessionExpired />}
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
          tabViewing={tabViewing}
          // businessTypeFilter={true}
          clusterFilter={true}
          onFilter={onFilter}
        >
          <Box className="transactionsList__filters">
            {tabViewing === 2 && (
              <Box className="transactionsList__filters__right">
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    label="Date From"
                    value={dateFromTemp}
                    onChange={setDateFromTemp}
                    slotProps={{
                      textField: {
                        size: "small",
                      },
                    }}
                    sx={{ width: "200px" }}
                    maxDate={dateToTemp}
                  />
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    label="Date To"
                    value={dateToTemp}
                    onChange={setDateToTemp}
                    slotProps={{
                      textField: {
                        size: "small",
                      },
                    }}
                    sx={{ width: "200px" }}
                    minDate={dateFromTemp}
                  />
                </LocalizationProvider>

                <SecondaryButton
                  size="medium"
                  onClick={handleSubmitDate}
                  sx={{ mr: "10px", height: "100%" }}
                  disabled={
                    // isExportLoading ||
                    _.isEqual(dateFrom, dateFromTemp) &&
                    _.isEqual(dateTo, dateToTemp)
                  }
                >
                  <GetApp />
                </SecondaryButton>
              </Box>
            )}
          </Box>
        </SearchVoidFilterMixin>

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
              (userDetails?.roleName === "Admin" ||
              userDetails.roleName === "CDO"
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
