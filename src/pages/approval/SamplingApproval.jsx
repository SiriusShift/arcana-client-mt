import { Box, TextField } from "@mui/material";
import { useState } from "react";
import CommonTable from "../../components/CommonTable";
import SearchDateRangeMixin from "../../components/mixins/SearchDateRangeMixin";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import moment from "moment";
import { useGetAllSamplingsQuery } from "../../features/inventory-management/api/samplingApi";
import useDisclosure from "../../hooks/useDisclosure";
import PrintInventoryModal from "../../components/modals/PrintInventoryModal";
import PageHeaderAddTabs from "../../components/PageHeaderAddTabs";
import { debounce } from "lodash";
import ViewSamplingModal from "../../components/modals/ViewSamplingModal";
import ApprovalHistoryModal from "../../components/modals/ApprovalHistoryModal";

function SamplingApproval() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const [tabViewing, setTabViewing] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

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

  const tableHeads = [
    "ID",
    "Requested by",
    // "Business Name",
    "Description",
    "Total Quantity",
    "Transaction Date",
  ];

  const customOrderKeys = [
    "id",
    "clientName",
    // "businessName",
    "description",
    "totalQuantity",
    "createdDate",
  ];

  const nestedProperty = {
    key: "businessAddress",
    nestedKeys: ["city", "province"],
  };

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

  console.log(tabs[tabViewing - 1]?.status, tabViewing);

  const dateTimeArray = ["transactionDate"];

  //RTK QUERY
  const { data, isFetching } = useGetAllSamplingsQuery({
    Search: search,
    Page: page + 1,
    PageSize: rowsPerPage,
    TransactionType: "Sampling",
    Status: tabs[tabViewing - 1]?.status,
  });

  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  return (
    <Box className="commonPageLayout">
      <PageHeaderAddTabs
        pageTitle="Sampling Approval"
        tabsList={tabs}
        tabViewing={tabViewing}
        setTabViewing={setTabViewing}
        removeArchive
        removeAdd
        removeSearch
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

      <ViewSamplingModal
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
        variant="sampling"
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
          setPage={setPage}
          count={data?.totalCount}
          dateTimeArray={dateTimeArray}
          onView={tabViewing === 1 && onViewOpen}
          onHistory={onHistoryOpen}
        />
      )}
    </Box>
  );
}

export default SamplingApproval;
