import "../../assets/styles/paymentTransaction.styles.scss";
import { Box } from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import CommonTable from "../../components/CommonTable";
import { AppContext } from "../../context/AppContext";
import PageHeaderTabs from "../../components/PageHeaderTabs";
import AddSearchMixin from "../../components/mixins/AddSearchMixin";
import {
  useGetAllSalesTransactionQuery,
  useVoidSalesTransactionMutation,
} from "../../features/sales-management/api/salesTransactionApi";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import { KeyboardDoubleArrowRight } from "@mui/icons-material";
import PaymentPage from "./PaymentPage";
import PaymentHistoriesBySalesInvoiceModal from "../../components/modals/sales-management/PaymentHistoriesBySalesInvoiceModal";
import useDisclosure from "../../hooks/useDisclosure";
import { useDispatch, useSelector } from "react-redux";
import useConfirm from "../../hooks/useConfirm";
import useSnackbar from "../../hooks/useSnackbar";
import { handleCatchErrorMessage } from "../../utils/CustomFunctions";
import moment from "moment";
import { setSelectedRow } from "../../features/misc/reducers/selectedRowSlice";
import ViewTransactionModal from "../../components/modals/sales-management/ViewTransactionModal";
import SessionExpired from "../SessionExpired";

function PaymentTransaction() {
  const [paymentMode, setPaymentMode] = useState(false);
  const [tabViewing, setTabViewing] = useState(1);
  const [search, setSearch] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("Pending");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [clientFromInvoicePage, setClientFromInvoicePage] = useState(null);

  const { notifications } = useContext(AppContext);

  //Hooks
  const confirm = useConfirm();
  const snackbar = useSnackbar();
  const dispatch = useDispatch();
  const selectedRowData = useSelector((state) => state.selectedRow.value);
  console.log(selectedRowData);

  //Disclosures
  const {
    isOpen: isPaymentHistoriesOpen,
    onOpen: onPaymentHistoriesOpen,
    onClose: onPaymentHistoriesClose,
  } = useDisclosure();

  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();


  //RTK Query
  const { data: transactionData, isFetching: isTransactionFetching, error } =
    useGetAllSalesTransactionQuery({
      PageNumber: page + 1,
      PageSize: rowsPerPage,
      Search: search,
      TransactionStatus: transactionStatus,
    }, {
      refetchOnMountOrArgChange: true,
    });

  const [voidSalesTransaction] = useVoidSalesTransactionMutation();

  //Constants
  const paymentNavigation = useMemo(
    () => [
      {
        case: 1,
        name: "Receivable",
        transactionStatus: "Pending",
        badge: notifications["receivableTransaction"],
      },
      {
        case: 2,
        name: "Paid",
        transactionStatus: "Paid",
        badge: notifications["paidTransaction"],
      },
      {
        case: 3,
        name: "Voided",
        transactionStatus: "Voided",
        badge: notifications["voidedTransaction"],
      },
      {
        case: 4,
        name: "Cleared",
        transactionStatus: "Cleared",
        badge: notifications["clearedTransaction"],
      },
    ],
    [notifications]
  );

  //Constants
  const customOrderKeys = [
    "transactionNo",
    "createdAt",
    "businessName",
    "invoiceNo",
    "totalAmountDue",
    ...(transactionStatus === "Pending" ? ["remainingBalance"] : []),
  ];

  const tableHeads = [
    "Tx No.",
    "Date",
    "Time",
    "Business Name",
    "Invoice No.",
    "Total Amount Due",
    ...(transactionStatus === "Pending" ? ["Remaining Balance"] : []),
  ];

  const dateTimeSplitArray = ["createdAt"];
  const pesoArray = ["totalAmountDue", "remainingBalance"];
  const disableActions = ["void"];

  //Functions
  const onVoid = async () => {
    try {
      await confirm({
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
        callback: () =>
          voidSalesTransaction({
            transactionId: [selectedRowData?.transactionNo],
            reason: "test",
          }).unwrap(),
      });

      snackbar({
        message: "Transaction voided successfully",
        variant: "success",
      });
    } catch (error) {
      if (error.isConfirmed) {
        snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
      }
    }
  };

  const checkIsVoidable = (date, totalAmount, balance) => {
    const isVoidable =
      moment(date).isAfter(moment().subtract(1, "days")) &&
      totalAmount - balance === 0;

    return isVoidable;
  };

  const onPay = () => {
    setClientFromInvoicePage(selectedRowData?.clientId);
    setPaymentMode(true);
  };

  //UseEffect
  useEffect(() => {
    const foundItem = paymentNavigation.find(
      (item) => item.case === tabViewing
    );

    setTransactionStatus(foundItem?.transactionStatus);
  }, [tabViewing, paymentNavigation]);

  useEffect(() => {
    if (transactionData) {
      setCount(setCount(transactionData?.totalCount));
    }
  }, [transactionData]);

  useEffect(() => {
    if (transactionData) {
      setCount(transactionData?.totalCount);
    }
  }, [transactionData]);

  useEffect(() => {
    setPage(0);
  }, [rowsPerPage, search, transactionStatus]);

  useEffect(() => {
    if (!paymentMode) {
      setClientFromInvoicePage(null);
    }
  }, [paymentMode]);

  console.log(
    checkIsVoidable(
      selectedRowData?.createdAt,
      selectedRowData?.totalAmountDue,
      selectedRowData?.remainingBalance
    )
  );

  return (
    <>
      {error && <SessionExpired />}
      <Box className="commonPageLayout">
        {paymentMode ? (
          <PaymentPage
            setPaymentMode={setPaymentMode}
            clientFromInvoicePage={clientFromInvoicePage}
            invoiceId={selectedRowData?.transactionNo}
            invoiceNo={selectedRowData?.invoiceNo}
          />
        ) : (
          <>
            <PageHeaderTabs
              pageTitle="Invoices"
              setSearch={setSearch}
              tabsList={paymentNavigation}
              setTabViewing={setTabViewing}
              tabViewing={tabViewing}
              small
            />

            <AddSearchMixin
              title="Pay Now"
              endIcon={<KeyboardDoubleArrowRight />}
              setSearch={setSearch}
              onAddOpen={() => {
                dispatch(setSelectedRow(null));
                setPaymentMode(true);
              }}
            />

            {isTransactionFetching ? (
              <CommonTableSkeleton lowerCompact mt={"-20px"} />
            ) : (
              <CommonTable
                mapData={transactionData?.transactions}
                customOrderKeys={customOrderKeys}
                tableHeads={tableHeads}
                dateTimeSplitArray={dateTimeSplitArray}
                warning={
                  transactionStatus === "Pending" && {
                    key: "status",
                    value: "Over due",
                  }
                }
                includeActions
                lowerCompact
                moveNoDataUp
                pesoArray={pesoArray}
                page={page}
                setPage={setPage}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                count={count}
                mt={"-20px"}
                disableActions={
                  transactionStatus === "Pending" &&
                  !checkIsVoidable(
                    selectedRowData?.createdAt,
                    selectedRowData?.totalAmountDue,
                    selectedRowData?.remainingBalance
                  ) &&
                  disableActions
                }
                onVoid={
                  transactionStatus === "Pending" &&
                  // checkIsVoidable(
                  //   selectedRowData?.createdAt,
                  //   selectedRowData?.totalAmountDue,
                  //   selectedRowData?.remainingBalance
                  // ) &&
                  onVoid
                }
                onView={transactionStatus === "Paid" && onViewOpen}
                onPaymentHistories={onPaymentHistoriesOpen}
                onPay={transactionStatus === "Pending" && onPay}
              />
            )}
          </>
        )}
      </Box>

      <PaymentHistoriesBySalesInvoiceModal
        open={isPaymentHistoriesOpen}
        onClose={onPaymentHistoriesClose}
      />

      <ViewTransactionModal open={isViewOpen} onClose={onViewClose} />

    </>
  );
}

export default PaymentTransaction;
