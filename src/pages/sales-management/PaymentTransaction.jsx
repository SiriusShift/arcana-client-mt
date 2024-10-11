import "../../assets/styles/paymentTransaction.styles.scss";
import { Box } from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import CommonTable from "../../components/CommonTable";
import { AppContext } from "../../context/AppContext";
import PageHeaderTabs from "../../components/PageHeaderTabs";
import AddSearchMixin from "../../components/mixins/AddSearchMixin";
import {
  useGetAllSalesTransactionQuery,
  // useCancelSalesTransactionMutation,
  useVoidSalesTransactionMutation,
} from "../../features/sales-management/api/salesTransactionApi";
import { useGetAllTransactionsQuery } from "../../features/filter/api/filterApi";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import { KeyboardDoubleArrowRight } from "@mui/icons-material";
import PaymentPage from "./PaymentPage";
import PaymentHistoriesBySalesInvoiceModal from "../../components/modals/sales-management/PaymentHistoriesBySalesInvoiceModal";
import useDisclosure from "../../hooks/useDisclosure";
import { useDispatch, useSelector } from "react-redux";
import useReasonConfirm from "../../hooks/useReasonConfirm";
import useSnackbar from "../../hooks/useSnackbar";
import { handleCatchErrorMessage } from "../../utils/CustomFunctions";
import moment from "moment";
import { setSelectedRow } from "../../features/misc/reducers/selectedRowSlice";
import ViewTransactionModal from "../../components/modals/sales-management/ViewTransactionModal";
import SessionExpired from "../SessionExpired";
import { filter } from "lodash";

function PaymentTransaction() {
  const [paymentMode, setPaymentMode] = useState(false);
  const [tabViewing, setTabViewing] = useState(1);
  // const [search, setSearch] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("Pending");
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [clusterId, setClusterId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [clientFromInvoicePage, setClientFromInvoicePage] = useState(null);
  const { notifications } = useContext(AppContext);

  //Hooks
  const confirmReason = useReasonConfirm();
  const snackbar = useSnackbar();
  const dispatch = useDispatch();
  const selectedRowData = useSelector((state) => state.selectedRow?.value);

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
  // const {
  //   data: transactionData,
  //   isFetching: isTransactionFetching,
  //   error,
  // } = useGetAllSalesTransactionQuery(
  //   {
  //     PageNumber: page + 1,
  //     PageSize: rowsPerPage,
  //     TransactionStatus: transactionStatus,
  //   },
  //   {
  //     refetchOnMountOrArgChange: true,
  //   }
  // );

  const [voidSalesTransaction] = useVoidSalesTransactionMutation();
  // const [cancelSalesTransaction] = useCancelSalesTransactionMutation();

  const {
    data: filterData,
    isFetching: isTransactionFetching,
    error,
  } = useGetAllTransactionsQuery({
    PageNumber: page + 1,
    PageSize: rowsPerPage,
    TransactionStatus: transactionStatus,
    refetchOnMountOrArgChange: true,
    ClusterId: clusterId?.value || "",
    paymentMethod: paymentMethod?.value || "",
    Search: search || "",
  });

  const filteredList = filterData?.value;
  console.log("filter", filterData);

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

  const onFilter = async ({ clusterId, paymentMethod }) => {
    try {
      setClusterId(clusterId);
      setPaymentMethod(paymentMethod);
    } catch (error) {
      console.log(error);
    }
  };

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
  //           transactionId: [selectedRowData?.transactionNo],
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
      moment(date).isAfter(moment().subtract(1, "days")) 
      // && totalAmount - balance === 0;
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
    if (filteredList) {
      setCount(setCount(filteredList?.totalCount));
    }
  }, [filteredList]);

  useEffect(() => {
    if (filteredList) {
      setCount(filteredList?.totalCount);
    }
  }, [filteredList]);

  useEffect(() => {
    setPage(0);
  }, [rowsPerPage, transactionStatus]);

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
              // setSearch={setSearch}
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
              onFilter={onFilter}
              clusterFilter={true}
              transactionStatus={transactionStatus}
              paymentMethodFilter={true}
            />

            {isTransactionFetching ? (
              <CommonTableSkeleton lowerCompact mt={"-20px"} />
            ) : (
              <CommonTable
                mapData={
                  filteredList?.transactions
                }
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
                  (transactionStatus === "Pending" || transactionStatus === "Paid") &&
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
                    // checkIsVoidable(
                    //   selectedRowData?.createdAt,
                    //   selectedRowData?.totalAmountDue,
                    //   selectedRowData?.remainingBalance
                    // ) &&
                    onVoid
                }
                onView={
                  (transactionStatus === "Paid" ||
                  transactionStatus === "Pending" ) && onViewOpen
                }
                onPaymentHistories={onPaymentHistoriesOpen}
                onPay={transactionStatus === "Pending" && onPay}
                // onCancel={transactionStatus === "Pending" || transactionStatus === "Paid" && onCancel}
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
