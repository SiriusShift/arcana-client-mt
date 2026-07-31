import { useEffect, useContext, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import CommonFilter from "../../../components/CommonFilter";
import "../../../assets/styles/salesTransaction.styles.scss";
import {
  Box,
  Chip,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import {
  CheckCircle,
  KeyboardDoubleArrowLeft,
  RemoveCircle,
  Search,
  Cancel,
} from "@mui/icons-material";
import CommonTable from "../../../components/CommonTable";
import PageHeaderTabs from "../../../components/PageHeaderTabs";
import { AppContext } from "../../../context/AppContext";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import SecondaryButton from "../../../components/SecondaryButton";
import useDisclosure from "../../../hooks/useDisclosure";
import ViewTransactionModal from "../../../components/modals/sales-management/ViewTransactionModal";
import ViewAttachmentModal from "../../../components/modals/sales-management/ViewAttachmentModal";
import { debounce } from "../../../utils/CustomFunctions";
import {
  useCancelSalesTransactionMutation,
  useGetAllMoveOrderTransactionQuery,
  useGetAllSalesTransactionQuery,
  useVoidSalesTransactionMutation,
} from "../../../features/sales-management/api/salesTransactionApi";
import CommonTableSkeleton from "../../../components/CommonTableSkeleton";
import * as _ from "lodash";
import useReasonConfirm from "../../../hooks/useReasonConfirm";
import useSnackbar from "../../../hooks/useSnackbar";
import { handleCatchErrorMessage } from "../../../utils/CustomFunctions";
import PageHeaderAddTabs from "../../../components/PageHeaderAddTabs";
import GenerateMoveOrderModal from "../../../components/page-components/sales-management/sales-transaction/GenerateMoveOrderModal";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

function TransactionsList({ setTransactionsMode }) {
  const [search, setSearch] = useState("");
  const [tabViewing, setTabViewing] = useState(1);
  const [transactionStatus, setTransactionStatus] = useState("Pending");
  const [clusterId, setClusterId] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [dateFrom, setDateFrom] = useState(moment());
  const [dateTo, setDateTo] = useState(moment());
  const [dateFromTemp, setDateFromTemp] = useState(moment());
  const [dateToTemp, setDateToTemp] = useState(moment());
  const confirmReason = useReasonConfirm();
  const snackbar = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();




  //Slices
  const userDetails = useSelector((state) => state.login.userDetails);
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const isAdmin = userDetails?.roleName === "Admin";




  // Disclosures
  const {
    isOpen: isGenerateOpen,
    onOpen: onGenerateOpen,
    onClose: onGenerateClose,
  } = useDisclosure();

    const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();
  
  const {
    isOpen: isAttachmentOpen,
    onOpen: onAttachmentOpen,
    onClose: onAttachmentClose,
  } = useDisclosure();

  //Constants
  const tableHeads = [
    "Move Order ID",
    "Client Name",
    "Transact Date",
    "Date Sync",
  ];
  const customOrderKeys = [
    "moveOrderId",
    "customerName",
    "transactionDate",
    "dateReceived",];

  const tableHeads1 = [
    "Tx Number",
    "Date",
    "Time",
    "Amount",
    "Business Name",
    "Invoice Type",
    "Invoice No.",
    // "Validity",
    // "Upload Status",
    // ...((transactionStatus === "Cancelled" || transactionStatus === "Voided")
    //   ? ["Reason"]
    //   : [])
  ];
  const customOrderKeys1 = [
    "transactionNo",
    "createdAt",
    "totalAmountDue",
    "businessName",
    "invoiceType",
    "invoiceNo",
    // "status",
    // "ciAttachment",
    // ...((transactionStatus === "Cancelled" || transactionStatus === "Voided")
    //   ? ["Reason"]
    //   : [])
  ];
  // const pesoArray = ["totalAmountDue"];
  const pesoArray = ["totalAmountDue"];
  const dateTimeSplitArray = ["createdAt"];
  const dateSplitArray = ["transactionDate", "dateReceived"]
  const attachKey = "ciAttachment";  // const attachKey = "ciAttachment";
  // const disableActions = ["void", "cancel"];

  //RTK Query
  const { data: transactionsData, isFetching: isTransactionsFetching } =
    useGetAllSalesTransactionQuery({
      ...(search ? { Search: search } : {}),
      TerittoryId: clusterId?.id || "",
      // InvoiceType: invoiceType?.value || "",
      TransactionStatus: transactionStatus,
      DateFrom: moment(dateFrom).format("YYYY-MM-DD"),
      DateTo: moment(dateTo).format("YYYY-MM-DD"),
      PageNumber: page + 1,
      PageSize: rowsPerPage,
    }, {
      skip: tabViewing !== 2
    });

  const { data, isFetching } =
    useGetAllMoveOrderTransactionQuery({
      ...(search ? { Search: search } : {}),
      TerittoryId: clusterId?.id || "",
      // InvoiceType: invoiceType?.value || "",
      TransactionStatus: transactionStatus,
      DateFrom: moment(dateFrom).format("YYYY-MM-DD"),
      DateTo: moment(dateTo).format("YYYY-MM-DD"),
      PageNumber: page + 1,
      PageSize: rowsPerPage,
    }, {
      skip: tabViewing !== 1
    });

  const tableData = tabViewing === 1 ? data : transactionsData
  const tableFetching = tabViewing === 1 ? isFetching : isTransactionsFetching


  const [voidSalesTransaction] = useVoidSalesTransactionMutation();
  const [cancelSalesTransaction] = useCancelSalesTransactionMutation();

  //Functions: Others
  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  const handleSubmitDate = () => {
    setDateFrom(dateFromTemp);
    setDateTo(dateToTemp);
  };

  // const checkIsVoidable = (date, totalAmount, balance) => {
  //   const isVoidable = moment(date).isAfter(moment().subtract(1, "days"));
  //   // && totalAmount - balance === 0;
  //   return isVoidable;
  // };

  // const onCancel = async () => {
  //   try {
  //     await confirmReason({
  //       children: (
  //         <>
  //           Are you sure you want to cancel transaction number{" "}
  //           <span style={{ fontWeight: "bold" }}>
  //             {selectedRowData?.transactionNo}
  //           </span>
  //           ?
  //         </>
  //       ),
  //       question: false,
  //       callback: (remarks) =>
  //         cancelSalesTransaction({
  //           transactionId: selectedRowData?.transactionNo,
  //           reason: remarks,
  //         }).unwrap(),
  //     });
  //   } catch (error) {
  //     if (error.isConfirmed) {
  //       snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
  //     }
  //   }
  // };

  const onVoid = async () => {
    try {
      await confirmReason({
        children: (
          <>
            Are you sure you want to void transaction number{" "}
            <span style={{ fontWeight: "bold" }}>
              {selectedRowData?.transactionNo}
            </span>
            ?
          </>
        ),
        question: false,
        callback: (remarks) =>
          voidSalesTransaction({
            transactionId: selectedRowData?.transactionNo,
            reason: remarks,
            moveOrderId: selectedRowData?.moveOrderId
          }).unwrap(),
      });

      snackbar({
        message: "Transaction voided successfully",
        variant: "success",
      });
    } catch (error) {
      if (error.isConfirmed) {
        console.log(error);
        snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
      }
    }
  };

  const onFilter = async ({ clusterId, invoiceType }) => {
    try {
      setClusterId(clusterId);
    } catch (error) {
      console.log(error);
    }
  };

  const handleView = () => {
    if (tabViewing === 1) {
      navigate(`${selectedRowData?.moveOrderId}?dateFrom=${moment(dateFrom).format(
        "YYYY-MM-DD"
      )}&dateTo=${moment(dateTo).format("YYYY-MM-DD")}`)
    } else {
      onViewOpen()
    }
  }

  // Constants

  const paymentNavigation = useMemo(
    () => [
      {
        case: 1,
        name: "Pending",
        transactionStatus: "Pending",
        // badge: notifications["paidTransaction"],
      },
      {
        case: 2,
        name: "For Payment",
        transactionStatus: "Pending",
        // badge: notifications["clearedTransaction"],
      },
    ],
    []
  );

  const valueDisplayOptions = [
    {
      keyName: "status",
      displayOptions: {
        Pending: (
          <Chip
            icon={<CheckCircle sx={{ fontSize: "16px" }} />}
            label="Valid"
            color="success"
            variant="outlined"
          />
        ),
        Paid: (
          <Chip
            icon={<CheckCircle sx={{ fontSize: "16px" }} />}
            label="Valid"
            color="success"
            variant="outlined"
          />
        ),
        Cleared: (
          <Chip
            icon={<CheckCircle sx={{ fontSize: "16px" }} />}
            label="Valid"
            color="success"
            variant="outlined"
          />
        ),
        Voided: (
          <Chip
            icon={<RemoveCircle sx={{ fontSize: "16px" }} />}
            label="Voided"
            sx={{ color: "gray" }}
            variant="outlined"
          />
        ),
        Cancelled: (
          <Chip
            icon={<Cancel sx={{ fontSize: "16px" }} />}
            label="Cancelled"
            color="error"
            sx={{ color: "red" }}
            variant="outlined"
          />
        ),
      },
    },
  ];

  //UseEffect
  useEffect(() => {
    setCount(tableData?.totalCount);
  }, [tableData]);

  useEffect(() => {
    const foundItem = paymentNavigation.find(
      (item) => item.case === tabViewing
    );

    setTransactionStatus(foundItem?.transactionStatus);
  }, [tabViewing, paymentNavigation]);

  useEffect(() => {
    setPage(0);
  }, [search, rowsPerPage, dateFrom, dateTo]);




  if (location.pathname === "/sales-management/sales-transaction") {
    return (<>
      <GenerateMoveOrderModal
        open={isGenerateOpen}
        onClose={onGenerateClose}
      />
      <Box className="commonPageLayout">
        <Box className="transactionsList">
          <PageHeaderAddTabs
            pageTitle="Sales Transactions"
            tabsList={paymentNavigation}
            setTabViewing={setTabViewing}
            tabViewing={tabViewing}
            onOpen={onGenerateOpen}
            addTitle="NEW SALES"
            small
          />

          <Box className="transactionsList__filters">
            <TextField
              type="search"
              size="small"
              label="Search"
              onChange={(e) => {
                debouncedSetSearch(e.target.value);
              }}
              autoComplete="off"
            />

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
                  minDate={dateFromTemp}
                  value={dateToTemp}
                  onChange={setDateToTemp}
                  slotProps={{
                    textField: {
                      size: "small",
                    },
                  }}
                  sx={{ width: "200px" }}
                  maxDate={moment()}
                />
              </LocalizationProvider>

              <SecondaryButton
                size="medium"
                onClick={handleSubmitDate}
                sx={{ ml: "10px", height: "100%" }}
                disabled={
                  tableFetching ||
                  (_.isEqual(dateFrom, dateFromTemp) &&
                    _.isEqual(dateTo, dateToTemp))
                }
              >
                <Search />
              </SecondaryButton>
              {userDetails?.roleName === "Admin" ||
                userDetails?.roleName === "Treasury" ||
                userDetails?.roleName === "GAS" ||
                userDetails?.roleName === "Finance" ? (
                <CommonFilter
                  filter={onFilter}
                  clusterFilter={true}
                  invoiceTypeFilter={true}
                  validityFilter={true}
                  uploadStatusFilter={true}
                />
              ) : (
                ""
              )}
            </Box>
          </Box>

          {tableFetching ? (
            <CommonTableSkeleton lessCompact />
          ) : (
            <CommonTable
              tableHeads={tabViewing === 1 ? tableHeads : tableHeads1}
              customOrderKeys={tabViewing === 1 ? customOrderKeys : customOrderKeys1}
              mapData={tableData?.mo || tableData?.transactions || []}
              pesoArray={pesoArray}
              dateTimeArray={dateSplitArray}
              dateTimeSplitArray={dateTimeSplitArray}
              // valueDisplayOptions={valueDisplayOptions}
              page={page}
              setPage={setPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              count={count}
              // attachKey={attachKey}
              onView={handleView}
              // disableActions={
              //   (transactionStatus === "Pending" ||
              //     transactionStatus === "Paid") &&
              //   !isAdmin &&
              //   !checkIsVoidable(
              //     selectedRowData?.createdAt,
              //     selectedRowData?.totalAmountDue,
              //     selectedRowData?.remainingBalance
              //   ) &&
              //   disableActions
              // }
              // onAttach={tabViewing === 2 && onAttachmentOpen}
              onVoid={
                (tabViewing === 2) &&
                onVoid
              }
              // onCancel={
              //   (transactionStatus === "Pending" ||
              //     transactionStatus === "Paid") &&
              //   onCancel
              // }
              lessCompact
              moveNoDataUp
            />
          )}

          {/* <Box className="transactionsList__footer">
          <DangerButton
            size="medium"
            onClick={() => {
              setTransactionsMode(false);
              sessionStorage.removeItem("transactionsMode");
            }}
          >
            <KeyboardDoubleArrowLeft /> Back to POS
          </DangerButton>

          <Box className="transactionsList__footer__right">
            <TertiaryButton size="medium" onClick={onAttachmentOpen}>
              View Attachment
            </TertiaryButton>

            <SecondaryButton size="medium" onClick={onViewOpen}>
              View
            </SecondaryButton>
          </Box>
        </Box> */}
        </Box>

        <ViewTransactionModal open={isViewOpen} onClose={onViewClose} />

        <ViewAttachmentModal
        open={isAttachmentOpen}
        onClose={onAttachmentClose}
      />
      </Box>
    </>
    );
  }

  return <Outlet />;

}

export default TransactionsList;
