import { Box } from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CommonTable from "../../components/CommonTable";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import SearchFilterMixin from "../../components/mixins/SearchFilterMixin";
import ApprovalHistoryModal from "../../components/modals/ApprovalHistoryModal";
import TransactionApprovalModal from "../../components/modals/TransactionApprovalModal";
import PageHeaderTabs from "../../components/PageHeaderTabs";
import { AppContext } from "../../context/AppContext";
import { useCancelSalesTransactionRequestMutation, useGetSalesTransactionRequestQuery } from "../../features/sales-management/api/salesTransactionApi";
import useConfirm from "../../hooks/useConfirm";
import useDisclosure from "../../hooks/useDisclosure";
import { handleCatchErrorMessage } from "../../utils/CustomFunctions";
import SessionExpired from "../SessionExpired";
// import { usePatchReadNotificationMutation } from "../../features/notification/api/notificationApi";

function SalesTransactionApproval() {
    const navigate = useNavigate()
    const confirm = useConfirm();
    const userDetails = useSelector((state) => state.login.userDetails);
    const selectedRowData = useSelector((state) => state.selectedRow.value);

    const [tabViewing, setTabViewing] = useState(userDetails?.roleName !== "Depot" ? 2 : 1);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [clientStatus, setClientStatus] = useState("Under review");
    const [count, setCount] = useState(0);

    console.log(tabViewing)

    const { notifications, isNotificationFetching } = useContext(AppContext);

    //Disclosures
    const {
        isOpen: isViewOpen,
        onOpen: onViewOpen,
        onClose: onViewClose,
    } = useDisclosure();

    const {
        isOpen: isHistoryOpen,
        onOpen: onHistoryOpen,
        onClose: onHistoryClose,
    } = useDisclosure();

    const { data, isFetching, error } = useGetSalesTransactionRequestQuery({
        Search: search,
        // Status: true,
        Status: tabViewing === 1 || tabViewing === 2 ? "Under Review" : tabViewing === 3 ? "Approved" : "Rejected",
        PageNumber: page + 1,
        PageSize: rowsPerPage,
        forRequestor: userDetails?.roleName === "Depot" ? true : false

    }, {
        refetchOnMountOrArgChange: true
    });

    const [cancel, { isLoading: cancelLoading }] = useCancelSalesTransactionRequestMutation()

    console.log(notifications["pendingTransaction"])

    // const [patchReadNotification] = usePatchReadNotificationMutation();

    //Constants
    const salesTransactionNavigation = useMemo(
        () => [
            {
                case: 1,
                name: "For Approval",
                registrationStatus: "For Approval",
                badge: notifications["pendingTransaction"],
            },
            {
                case: 2,
                name: "Pending",
                registrationStatus: "Under review",
                badge: notifications["pendingTransaction"],
            },

            {
                case: 3,
                name: "Approved",
                registrationStatus: "Approved",
                // badge: notifications["approvedClient"],
            },
            {
                case: 4,
                name: "Rejected",
                registrationStatus: "Rejected",
                // badge: notifications["rejectedClient"],
            },
        ],
        [notifications]
    ).filter((value) =>
        userDetails?.roleName === "Depot" ? value.case !== 2
            : value.case !== 1
    );

    const handleCancel = async () => {
        try {
            await confirm({
                children: "Are you sure you want to cancel this transactions?",
                question: true,
                callback: () => cancel(selectedRowData?.requestId).unwrap()
            })
        } catch (err) {
            console.log(handleCatchErrorMessage(err))
        }
    }

    const tableHeads = [
        "Move Order Id",
        "Requestor",
        "DR No.",
        "Invoice No.",
    ];

    const customOrderKeys = [
        (item) => item?.transaction?.moveOrderId,   // <- not "transaction"
        "requestor",
        (item) => item?.transaction?.drNo,
        (item) => item?.transaction?.invoiceNo,
    ];
    //Misc Functions

    useEffect(() => {
        const foundItem = salesTransactionNavigation.find(
            (item) => item.case === tabViewing
        );

        setClientStatus(foundItem?.registrationStatus);
    }, [tabViewing, salesTransactionNavigation]);

    // useEffect(() => {
    //   if (clientStatus === "Under review") {
    //     patchReadNotification({ Tab: "Pending Clients" });
    //   }
    // }, [clientStatus, patchReadNotification]);

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
                <PageHeaderTabs
                    pageTitle="Sales Transaction Approval"
                    tabsList={salesTransactionNavigation}
                    tabViewing={tabViewing}
                    setTabViewing={setTabViewing}
                    isNotificationFetching={isNotificationFetching}
                />

                <SearchFilterMixin
                    setSearch={setSearch}
                />
                {isFetching ? (
                    <CommonTableSkeleton compact />
                ) : (
                    <CommonTable
                        mapData={data.requests}
                        tableHeads={tableHeads}
                        customOrderKeys={customOrderKeys}
                        compact
                        moveNoDataUp
                        onView={onViewOpen}
                        onHistory={onHistoryOpen}
                        page={page}
                        setPage={setPage}
                        rowsPerPage={rowsPerPage}
                        setRowsPerPage={setRowsPerPage}
                        onCancel={tabViewing === 1 && handleCancel}
                        count={count}
                    />
                )}
            </Box>

            <TransactionApprovalModal
                open={
                    isViewOpen
                    // true
                }
                onClose={onViewClose}
                tabViewing={tabViewing}
            />

            <ApprovalHistoryModal open={isHistoryOpen} onClose={onHistoryClose} />
        </>
    );
}

export default SalesTransactionApproval;