import { useEffect, useContext, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import CommonFilter from "../../../CommonFilter";
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
import CommonTable from "../../../CommonTable";
import PageHeaderTabs from "../../../../components/PageHeaderTabs";
import { AppContext } from "../../../../context/AppContext";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import SecondaryButton from "../../../SecondaryButton";
import useDisclosure from "../../../../hooks/useDisclosure";
import ViewTransactionModal from "../../../modals/sales-management/ViewTransactionModal";
import ViewAttachmentModal from "../../../modals/sales-management/ViewAttachmentModal";
import { debounce } from "../../../../utils/CustomFunctions";
import {
  useCancelSalesTransactionMutation,
  useGetAllSalesTransactionQuery,
  useVoidSalesTransactionMutation,
} from "../../../../features/sales-management/api/salesTransactionApi";
import CommonTableSkeleton from "../../../CommonTableSkeleton";
import * as _ from "lodash";
import useReasonConfirm from "../../../../hooks/useReasonConfirm";
import useSnackbar from "../../../../hooks/useSnackbar";
import {handleCatchErrorMessage} from "../../../../utils/CustomFunctions";

function TransactionsList({ setTransactionsMode }) {
  const [search, setSearch] = useState("");
  const [invoiceType, setInvoiceType] = useState("");
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

  //Slices
  const userDetails = useSelector((state) => state.login.userDetails);
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const isAdmin = userDetails?.roleName === "Admin";

  //Disclosures
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
    "Tx Number",
    "Date",
    "Time",
    "Amount",
    "Business Name",
    "Invoice Type",
    "Invoice No.",
    // "Validity",
    "Upload Status",
  ];
  const customOrderKeys = [
    "transactionNo",
    "createdAt",
    "totalAmountDue",
    "businessName",
    "invoiceType",
    "invoiceNo",
    // "status",
    "ciAttachment",
  ];
  const pesoArray = ["totalAmountDue"];
  const dateTimeSplitArray = ["createdAt"];
  const attachKey = "ciAttachment";
  const disableActions = ["void", "cancel"];

  //RTK Query
  const { data: transactionsData, isFetching: isTransactionsFetching } =
    useGetAllSalesTransactionQuery({
      ...(search ? { Search: search } : {}),
      ClusterId: clusterId?.value || "",
      InvoiceType: invoiceType?.value || "",
      TransactionStatus: transactionStatus,
      DateFrom: moment(dateFrom).format("YYYY-MM-DD"),
      DateTo: moment(dateTo).format("YYYY-MM-DD"),
      PageNumber: page + 1,
      PageSize: rowsPerPage,
    });

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

  const checkIsVoidable = (date, totalAmount, balance) => {
    const isVoidable = moment(date).isAfter(moment().subtract(1, "days"));
    // && totalAmount - balance === 0;
    return isVoidable;
  };

  const onCancel = async () => {
    try {
      await confirmReason({
        children: (
          <>
            Are you sure you want to cancel transaction number{" "}
            <span style={{ fontWeight: "bold" }}>
              {selectedRowData?.transactionNo}
            </span>
            ?
          </>
        ),
        question: false,
        callback: (remarks) =>
          cancelSalesTransaction({
            transactionId: selectedRowData?.transactionNo,
            reason: remarks,
          }).unwrap(),
      });
    } catch (error) {
      if (error.isConfirmed) {
        snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
      }
    }
  };

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
      setInvoiceType(invoiceType);
    } catch (error) {
      console.log(error);
    }
  };

  // Constants

  const paymentNavigation = useMemo(
    () => [
      {
        case: 1,
        name: "Receivable",
        transactionStatus: "Pending",
        // badge: notifications["receivableTransaction"],
      },
      {
        case: 2,
        name: "Paid",
        transactionStatus: "Paid",
        // badge: notifications["receivableTransaction"],
      },
      {
        case: 3,
        name: "Voided",
        transactionStatus: "Voided",
        // badge: notifications["voidedTransaction"],
      },
      {
        case: 4,
        name: "Cleared",
        transactionStatus: "Cleared",
        // badge: notifications["paidTransaction"],
      },
      {
        case: 5,
        name: "Cancelled",
        transactionStatus: "Cancelled",
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
    setCount(transactionsData?.totalCount);
  }, [transactionsData]);

  useEffect(() => {
    const foundItem = paymentNavigation.find(
      (item) => item.case === tabViewing
    );

    setTransactionStatus(foundItem?.transactionStatus);
  }, [tabViewing, paymentNavigation]);

  useEffect(() => {
    setPage(0);
  }, [search, rowsPerPage, dateFrom, dateTo]);

  return (
    <>
      <Box className="transactionsList">
        <PageHeaderTabs
          pageTitle="Invoices"
          tabsList={paymentNavigation}
          setTabViewing={setTabViewing}
          tabViewing={tabViewing}
          small
        >
          <IconButton
            onClick={() => {
              setTransactionsMode(false);
              sessionStorage.removeItem("transactionsMode");
            }}
            // sx={{ ml: "30px", height: "100%" }}
          >
            <KeyboardDoubleArrowLeft sx={{ fontSize: "1.6rem" }} />
          </IconButton>
        </PageHeaderTabs>
        {/* <Box className="transactionsList__header">
          <Box className="transactionsList__header__left">
            <IconButton
              onClick={() => {
                setTransactionsMode(false);
                sessionStorage.removeItem("transactionsMode");
              }}
              // sx={{ ml: "30px", height: "100%" }}
            >
              <KeyboardDoubleArrowLeft sx={{ fontSize: "1.6rem" }} />
            </IconButton>

            <Typography className="transactionsList__header__left__title">
              Invoices
            </Typography>
          </Box>
        </Box> */}

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
                isTransactionsFetching ||
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
                // paymentMethodFilter={paymentMethodFilter && paymentMethodFilter}
                // expenseTypeFilter={expenseTypeFilter && expenseTypeFilter}
                // businessTypeFilter={businessTypeFilter && businessTypeFilter}
                invoiceTypeFilter={true}
                validityFilter={true}
                uploadStatusFilter={true}
                // frequenceFilter={frequenceFilter && frequenceFilter}
                // paymentChannelFilter={paymentChannelFilter && paymentChannelFilter}
                // statusFilter={statusFilter && statusFilter}
              />
            ) : (
              ""
            )}
          </Box>
        </Box>

        {isTransactionsFetching ? (
          <CommonTableSkeleton lessCompact />
        ) : (
          <CommonTable
            tableHeads={tableHeads}
            customOrderKeys={customOrderKeys}
            mapData={transactionsData?.transactions || []}
            pesoArray={pesoArray}
            dateTimeSplitArray={dateTimeSplitArray}
            // valueDisplayOptions={valueDisplayOptions}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            count={count}
            attachKey={attachKey}
            onView={onViewOpen}
            onAttach={onAttachmentOpen}
            disableActions={
              (transactionStatus === "Pending" ||
                transactionStatus === "Paid") &&
              !isAdmin &&
              !checkIsVoidable(
                selectedRowData?.createdAt,
                selectedRowData?.totalAmountDue,
                selectedRowData?.remainingBalance
              ) &&
              disableActions
            }
            onVoid={
              (transactionStatus === "Pending" ||
                transactionStatus === "Paid") &&
              onVoid
            }
            onCancel={
              (transactionStatus === "Pending" ||
                transactionStatus === "Paid") &&
              onCancel
            }
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
    </>
  );
}

export default TransactionsList;
