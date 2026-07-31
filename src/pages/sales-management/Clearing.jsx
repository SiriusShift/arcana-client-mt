import { Box, Button, Chip } from "@mui/material";
import PageHeaderTabs from "../../components/PageHeaderTabs";
import { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../../context/AppContext";
import CommonTable from "../../components/CommonTable";
import { usePatchReadNotificationMutation } from "../../features/notification/api/notificationApi";
import SearchActionMixin from "../../components/mixins/SearchActionMixin";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import {
  useFileClearingTransactionMutation,
  useGetAllClearingTransactionQuery,
  useReturnClearingTransactionMutation,
} from "../../features/sales-management/api/clearingApi";
import ClearingModal from "../../components/modals/sales-management/ClearingModal";
import useDisclosure from "../../hooks/useDisclosure";
import {
  AssignmentReturnedOutlined,
  Autorenew,
  Download,
} from "@mui/icons-material";
import SessionExpired from "../SessionExpired";
import useConfirm from "../../hooks/useConfirm";
import useReasonConfirm from "../../hooks/useReasonConfirm";
import { downloadFile } from "../../utils/DownloadFile";
import ATagModal from "../../components/modals/sales-management/ATagModal";

function Clearing() {
  const [tabViewing, setTabViewing] = useState(1);
  const [clearingStatus, setClearingStatus] = useState("For Clearing");
  const [search, setSearch] = useState("");
  const [clusterId, setClusterId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [clearingModalMode, setClearingModalMode] = useState("Viewing");
  const [downloadLoading, setDownloadLoading] = useState(false)
  const confirm = useConfirm();
  const reasonConfirm = useReasonConfirm();

  console.log(clearingStatus);

  const [checkedArray, setCheckedArray] = useState([]);

  //Hooks
  const { notifications, isNotificationFetching } = useContext(AppContext);

  // Disclosures
  const {
    isOpen: isClearingModalOpen,
    onOpen: onClearingModalOpen,
    onClose: onClearingModalClose,
  } = useDisclosure();

    const {
    isOpen: isATagModalOpen,
    onOpen: onATagModalOpen,
    onClose: onATagModalClose,
  } = useDisclosure();


  //Constants
  const tabsList = useMemo(() => {
    return [
      {
        case: 1,
        name: "For Tagging",
        clearingStatus: "For Clearing",
        status: "For_Tagging",
        badge: notifications["forClearing"],
      },
      {
        case: 2,
        name: "For Filing",
        clearingStatus: "For Filing",
        status: "For_Filing",
        badge: notifications["forFiling"],
      },
      {
        case: 3,
        name: "Filed",
        clearingStatus: "Cleared",
        status: "Filed",
        badge: notifications["cleared"],
      },
      {
        case: 4,
        name: "Voided",
        clearingStatus: "Voided",
        status: "Status",
        badge: notifications["voided"],
      },
    ];
  }, [notifications]);

  const tableHeads = [
    "Date",
    "Business Name",
    "Business Owner",
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
    "ownersName",
    "paymentChannel",
    "paymentMethod",
    "referenceNos",
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
  const [fileClearingTransaction] = useFileClearingTransactionMutation();
  const [returnClearingTransaction] = useReturnClearingTransactionMutation();

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

  const checkedArrayData = clearingData?.transactions.filter((_, index) =>
    checkedArray.includes(index)
  ) || [];

  console.log(checkedArrayData)

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

  const onATag = () => {
    onATagModalOpen()
  }

  const onFile = async () => {
    try {
      await confirm({
        children: "Are you sure you want to file this transaction?",
        question: true,
        callback: () =>
          fileClearingTransaction({
            paymentRecords: checkedArrayData,
          }).unwrap(),
      });
      // fileClearingTransaction({ paymentRecords: checkedArrayData }).unwrap(),

      snackbar({
        message: "Transaction filed succesfully",
        variant: "success",
      });
      onClose();
      setCheckedArray([]);
    } catch (error) {
      if (error?.isConfirmed) {
        snackbar({
          message: handleCatchErrorMessage(error),
          variant: "error",
        });
      }
    }
  };

  // const onReturn = async () => {
  //   try {
  //     await reasonConfirm({
  //       children: "Are you sure you want to return this transaction?",
  //       question: false,
  //       callback: (data) =>
  //         returnClearingTransaction({
  //           paymentRecords: checkedArrayData,
  //           reason: data,
  //         }).unwrap(),
  //     });

  //     snackbar({
  //       message: "Transaction returned successfully",
  //       variant: "success",
  //     });
  //     onClose();
  //   } catch (error) {
  //     if (error?.isConfirmed) {
  //       snackbar({
  //         message: handleCatchErrorMessage(error),
  //         variant: "error",
  //       });
  //     }
  //   }
  // };

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
      <ATagModal open={isATagModalOpen} onClose={onATagModalClose} data={checkedArrayData}/>

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
        >
          {clearingStatus === "For Filing" && (
            <>
              {/* <Button
                variant="contained"
                color="secondary"
                onClick={onFile}
                disabled={checkedArrayData?.length === 0}
              >
                File
              </Button> */}

              {/* <Button
              variant="contained"
              color="secondary"
              onClick={onReturn}
              disabled={checkedArrayData.length === 0}
            >
              Return
            </Button> */}
            </>
          )}
                    {clearingStatus === "For Clearing" && (
            <>
              {/* <Button
                variant="contained"
                color="secondary"
                onClick={onATag}
                disabled={checkedArrayData?.length === 0}
              >
                Tag
              </Button> */}

              {/* <Button
              variant="contained"
              color="secondary"
              onClick={onReturn}
              disabled={checkedArrayData.length === 0}
            >
              Return
            </Button> */}
            </>
          )}
          {/* <Button
            onClick={async () => {
              try {
                setDownloadLoading(true)
                await downloadFile(
                  `clearing-transaction/export`,
                  `?${clusterId && `clusterId=${clusterId}`}&status=${encodeURI(tabsList.find((item) => item.case === tabViewing)
                    ?.clearingStatus)
                  }`,
                  `Remittance_${tabsList.find((item) => item.case === tabViewing)?.status}`
                ).finally(() => setDownloadLoading(false))
              } catch (err) {
                console.log(err)
                setDownloadLoading(false)
              }
            }

            }
            disabled={downloadLoading}
            variant="contained"
            color="secondary"
          >
            <Download />
          </Button> */}
        </SearchActionMixin>

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
            // checkboxSelection={clearingStatus === "For Filing" || clearingStatus === "For Clearing"}
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