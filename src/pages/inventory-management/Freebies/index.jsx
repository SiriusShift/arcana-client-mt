import { Box } from "@mui/material";
import { useState } from "react";
import CommonTable from "../../../components/CommonTable";
import SearchDateRangeMixin from "../../../components/mixins/SearchDateRangeMixin";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CommonTableSkeleton from "../../../components/CommonTableSkeleton";
import moment from "moment";
import PageHeaderAddTabs from "../../../components/PageHeaderAddTabs";
import { useGetAllFreebieRequestsQuery } from "../../../features/inventory-management/api/freebiesApi";
import useDisclosure from "../../../hooks/useDisclosure";
import PrintFreebiesModal from "../../../components/modals/PrintFreebiesModal";
import ReleaseFreebieModal from "../../../components/modals/ReleaseFreebieModal";
import CancelFreebiesModal from "../../../components/modals/CancelFreebiesModal";
import ApprovalHistoryModal from "../../../components/modals/ApprovalHistoryModal";
import useValidate from "../../../hooks/useValidate";

function Freebies() {
  const navigate = useNavigate();
  const location = useLocation();
  const {  isNotificationFetching } = useValidate();

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const {
    isOpen: isPrintOpen,
    onOpen: onPrintOpen,
    onClose: onPrintClose,
  } = useDisclosure();

  const {
    isOpen: isFreebieReleaseOpen,
    onOpen: onFreebieReleaseOpen,
    onClose: onFreebieReleaseClose,
  } = useDisclosure();

  const {
    isOpen: isFreebieCancelOpen,
    onOpen: onFreebieCancelOpen,
    onClose: onFreebieCancelClose,
  } = useDisclosure();

  const {
    isOpen: isHistoryOpen,
    onOpen: onHistoryOpen,
    onClose: onHistoryClose,
  } = useDisclosure();

  const [tabViewing, setTabViewing] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState(moment().startOf("month"));
  const [dateTo, setDateTo] = useState(moment());

  const tableHeads = [
    "ID",
    "Owner's Name",
    "Business Name",
    "Total Quantity",
    "Transaction Date",
        ...(tabViewing === 4 ? ["Reason"] : []),

  ];

  const customOrderKeys = [
    "id",
    "clientName",
    "businessName",
    "totalQuantity",
    "createdDate",
    ...(tabViewing === 4 ? ["cancellationReason"] : []),

  ];

  const nestedProperty = {
    key: "businessAddress",
    nestedKeys: ["city", "province"],
  };

  const dateTimeArray = ["transactionDate"];

  const tabs = [
    {
      case: 1,
      name: "For Approval",
      status: "Under review",
    },
    {
      case: 2,
      name: "For releasing",
      status: "For releasing",
    },
    {
      case: 3,
      name: "Released Freebies",
      status: "Released",
    },
    {
      case: 4,
      name: "Rejected Freebies",
      status: "Rejected",
    },
  ];

  //RTK QUERY
  const { data, isFetching } = useGetAllFreebieRequestsQuery({
    Search: search,
    Page: page + 1,
    PageSize: rowsPerPage,
    DateFrom: dateFrom ? moment(dateFrom).format("YYYY-MM-DD") : "",
    DateTo: dateTo ? moment(dateTo).format("YYYY-MM-DD") : "",
    TransactionType: "Freebie",
    Status: tabs[tabViewing - 1]?.status,
  }, {
    refetchOnMountOrArgChange: true
  });

  // Functions
  const handleView = () => {
    navigate(
      `${selectedRowData?.id}?dateFrom=${moment(dateFrom).format(
        "YYYY-MM-DD"
      )}&dateTo=${moment(dateTo).format("YYYY-MM-DD")}`
    );
  };

  const handleAdd = () => {
    // const error = validateEndingInventory();
    // if (error) return;
    navigate("freebies-form");
  };

  if (location.pathname === "/sales-management/freebies") {
    return (
      <Box className="commonPageLayout">
        <PageHeaderAddTabs
          pageTitle="Freebies"
          tabsList={tabs}
          tabViewing={tabViewing}
          setTabViewing={setTabViewing}
          // wide
          addTitle="Add Freebie Request"
          onOpen={() => {
            handleAdd();
          }}
        />

        <SearchDateRangeMixin
          setSearch={setSearch}
          setDateFrom={setDateFrom}
          setDateTo={setDateTo}
          dateFrom={dateFrom}
          dateTo={dateTo}
        />

        <PrintFreebiesModal
          open={isPrintOpen}
          inventory
          // open={true}
          onClose={onPrintClose}
        />

        <ReleaseFreebieModal
          open={isFreebieReleaseOpen}
          // open={true}
          onClose={onFreebieReleaseClose}
          inventory
        />

        <CancelFreebiesModal
          open={isFreebieCancelOpen}
          onClose={onFreebieCancelClose}
          reason={"Cancelled"}
          type="Freebie"
        />

        <ApprovalHistoryModal
          open={isHistoryOpen}
          onClose={onHistoryClose}
          variant="freebies"
        />

        {isFetching || isNotificationFetching ? (
          <CommonTableSkeleton lowerCompact />
        ) : (
          <CommonTable
            moveNoDataUp
            lowerCompact
            mapData={data?.to}
            tableHeads={tableHeads}
            customOrderKeys={customOrderKeys}
            nestedProperty={nestedProperty}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            page={page}
            onPrintFreebies={tabViewing === 3 && onPrintOpen}
            onReleaseFreebie={tabViewing === 2 && onFreebieReleaseOpen}
            onCancelFreebies={tabViewing === 2 && onFreebieCancelOpen}
            setPage={setPage}
            count={data?.totalCount}
            dateTimeArray={dateTimeArray}
            onView={handleView}
            onHistory={onHistoryOpen}
          />
        )}
      </Box>
    );
  }

  return <Outlet />;
}

export default Freebies;
