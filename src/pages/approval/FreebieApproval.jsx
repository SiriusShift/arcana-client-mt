import { Box, TextField } from "@mui/material";
import { useState } from "react";
import CommonTable from "../../components/CommonTable";
import SearchDateRangeMixin from "../../components/mixins/SearchDateRangeMixin";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import moment from "moment";
import PageHeaderAddTabs from "../../components/PageHeaderAddTabs";
import { useGetAllFreebieRequestsQuery } from "../../features/inventory-management/api/freebiesApi";
import { useGetUsersWithAdjustmentsQuery } from "../../features/inventory-management/api/endingInventoryApi";

import useDisclosure from "../../hooks/useDisclosure";
import ViewFreebieModal from "../../components/modals/ViewFreebieModal";
import ApprovalHistoryModal from "../../components/modals/ApprovalHistoryModal";

import { debounce } from "lodash";

function FreebieApproval() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedRowData = useSelector((state) => state.selectedRow.value);

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

  const [tabViewing, setTabViewing] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  // const [dateFrom, setDateFrom] = useState(moment().startOf("month"));
  // const [dateTo, setDateTo] = useState(moment());

  const tableHeads = [
    "ID",
    "Owner's Name",
    "Business Name",
    "Total Quantity",
    "Transaction Date",
  ];

  const customOrderKeys = [
    "id",
    "clientName",
    "businessName",
    "totalQuantity",
    "createdDate",
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
      name: "Released Freebies",
      status: "Released",
    },
    {
      case: 3,
      name: "Rejected Freebies",
      status: "Rejected",
    },
  ];

  console.log(tabs[tabViewing - 1]?.status);

  //RTK QUERY
  const { data, isFetching } = useGetAllFreebieRequestsQuery({
    Search: search,
    Page: page + 1,
    PageSize: rowsPerPage,
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

  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  return (
    <Box className="commonPageLayout">
      <PageHeaderAddTabs
        pageTitle="Freebie Approval"
        tabsList={tabs}
        tabViewing={tabViewing}
        setTabViewing={setTabViewing}
        // wide
        removeAdd
      />

      <Box sx={{ padding: "15px", my: "-20px" }}>
        <TextField
          type="search"
          size="small"
          label="Search"
          onChange={(e) => {
            debouncedSetSearch(e.target.value);
          }}
          autoComplete="off"
        />
      </Box>

      <ViewFreebieModal
        open={isViewOpen}
        inventory
        status={tabs[tabViewing - 1]?.status}
        // open={true}
        approval
        onClose={onViewClose}
      />

      <ApprovalHistoryModal
        open={isHistoryOpen}
        onClose={onHistoryClose}
        variant="freebies"
      />

      {isFetching ? (
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
          // onApprove={tabViewing === 1 && onViewOpen}
          // onPrintFreebies={tabViewing === 2 && onPrintOpen}
          // onReleaseFreebie={tabViewing === 1 && onFreebieReleaseOpen}
          // onCancelFreebies={tabViewing === 1 && onFreebieCancelOpen}
          setPage={setPage}
          count={data?.totalCount}
          dateTimeArray={dateTimeArray}
          onView={onViewOpen}
          onHistory={onHistoryOpen}
        />
      )}
    </Box>
  );
}

export default FreebieApproval;
