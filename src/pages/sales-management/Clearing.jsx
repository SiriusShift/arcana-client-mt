import { Box, Chip } from "@mui/material";
import PageHeaderTabs from "../../components/PageHeaderTabs";
import { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../../context/AppContext";
import CommonTable from "../../components/CommonTable";
import { usePatchReadNotificationMutation } from "../../features/notification/api/notificationApi";
import SearchActionMixin from "../../components/mixins/SearchActionMixin";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import { useGetAllClearingTransactionQuery } from "../../features/sales-management/api/clearingApi";
import ClearingModal from "../../components/modals/sales-management/ClearingModal";
import useDisclosure from "../../hooks/useDisclosure";
import { AssignmentReturnedOutlined, Autorenew } from "@mui/icons-material";
import SessionExpired from "../SessionExpired";

function Clearing() {
  const [tabViewing, setTabViewing] = useState(1);
  const [clearingStatus, setClearingStatus] = useState("For Clearing");
  const [search, setSearch] = useState("");
  const [clusterId, setClusterId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [clearingModalMode, setClearingModalMode] = useState("Viewing");

  const [checkedArray, setCheckedArray] = useState([]);

  //Hooks
  const { notifications, isNotificationFetching } = useContext(AppContext);

  // Disclosures
  const {
    isOpen: isClearingModalOpen,
    onOpen: onClearingModalOpen,
    onClose: onClearingModalClose,
  } = useDisclosure();

  //Constants
  const tabsList = useMemo(() => {
    return [
      {
        case: 1,
        name: "For Tagging",
        clearingStatus: "For Clearing",
        badge: notifications["forClearing"],
      },
      {
        case: 2,
        name: "For Filing",
        clearingStatus: "For Filing",
        badge: notifications["forFiling"],
      },
      {
        case: 3,
        name: "Filed",
        clearingStatus: "Cleared",
        badge: notifications["cleared"],
      },
      {
        case: 4,
        name: "Voided",
        clearingStatus: "Voided",
        badge: notifications["voided"],
      },
    ];
  }, [notifications]);

  const tableHeads = [
    "Date",
    "Business Name",
    "Payment Channel",
    "Payment Method",
    "Reference No",
    "Total Payment Amount",
    "A-Tag",
    ...(clearingStatus === "For Clearing" ? ["Status"] : []),
  ];

  const customOrderKeys = [
    "date",
    "businessName",
    "paymentChannel",
    "paymentMethod",
    "referenceNo",
    "totalPaymentAmount",
    "aTag",
    ...(clearingStatus === "For Clearing" ? ["reason"] : []),
  ];

  const pesoArray = ["totalPaymentAmount"];
  const dateTimeArray = ["date"];

  const valueDisplayOptions = [
    {
      keyName: "reason",
      displayOptions: {
        noValue: (
          <Chip
            icon={<Autorenew sx={{ fontSize: "1rem" }} />}
            label="New"
            color="success"
            variant="outlined"
          />
        ),
        hasValue: (
          <Chip
            icon={<AssignmentReturnedOutlined sx={{ fontSize: "1rem" }} />}
            label="Returned"
            variant="outlined"
            color="error"
          />
        ),
      },
    },
  ];

  //RTK Query
  const [patchReadNotification] = usePatchReadNotificationMutation();

  const {
    data: clearingData,
    isFetching: isClearingFetching,
    error,
  } = useGetAllClearingTransactionQuery(
    {
      Search: search,
      ClusterId: clusterId?.value || "",
      PaymentMethod: paymentMethod?.value || "",
      PageNumber: page + 1,
      PageSize: rowsPerPage,
      Status: clearingStatus,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  // Functions
  const onInspect = () => {
    if (clearingStatus === "For Clearing") {
      setClearingModalMode("Clearing");
    } else if (clearingStatus === "For Filing") {
      setClearingModalMode("Filing");
    } else if (clearingStatus === "Cleared") {
      setClearingModalMode("Viewing");
    } else if (clearingStatus === "Voided") {
      setClearingModalMode("VoidedViewing");
    }
    onClearingModalOpen();
  };

  const onFilter = async ({ clusterId, paymentMethod }) => {
	console.log(paymentMethod);
    try {
      setClusterId(clusterId);
      setPaymentMethod(paymentMethod);
    } catch (error) {
      console.log(error);
    }
  };

  // UseEffect
  useEffect(() => {
    const foundItem = tabsList.find((item) => item.case === tabViewing);

    setClearingStatus(foundItem?.clearingStatus);
  }, [tabViewing, tabsList]);

  useEffect(() => {
    if (notifications["forClearing"] > 0 && clearingStatus === "For Clearing") {
      patchReadNotification({ Tab: "For Clearing" });
    }
  }, [clearingStatus, patchReadNotification, notifications]);

  useEffect(() => {
    setPage(0);
  }, [search, rowsPerPage, tabViewing]);

  return (
    <>
      {error && <SessionExpired />}
      <ClearingModal
        open={isClearingModalOpen}
        onClose={onClearingModalClose}
        mode={clearingModalMode}
      />

      <Box className="commonPageLayout">
        <PageHeaderTabs
          // wide
          small
          pageTitle="Remittance"
          tabsList={tabsList}
          tabViewing={tabViewing}
          setTabViewing={setTabViewing}
          isNotificationFetching={isNotificationFetching}
        />

        <SearchActionMixin
          setSearch={setSearch}
          removeAction
          onFilter={onFilter}
          clusterFilter={true}
		  paymentMethodFilter={true}
        />

        {isClearingFetching ? (
          <CommonTableSkeleton lowerCompact />
        ) : (
          <CommonTable
            // actionsHead={{ onClear: onClear }}
            // mapData={paymentData?.transactions}
            customOrderKeys={customOrderKeys}
            tableHeads={tableHeads}
            mapData={clearingData?.transactions}
            pesoArray={pesoArray}
            dateTimeArray={dateTimeArray}
            valueDisplayOptions={valueDisplayOptions}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            count={clearingData?.totalCount}
            lowerCompact
            checkboxSelection={clearingStatus === "For Filing"}
            includeActions
            onView={onInspect}
            checkedArray={checkedArray}
            setCheckedArray={setCheckedArray}
            moveNoDataUp
          />
        )}
      </Box>
    </>
  );
}

export default Clearing;
