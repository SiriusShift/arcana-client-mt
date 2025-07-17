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

function SamplingApproval() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const [tabViewing, setTabViewing] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState(moment().startOf("month"));
  const [dateTo, setDateTo] = useState(moment());

  const {
    isOpen: isPrintOpen,
    onOpen: onPrintOpen,
    onClose: onPrintClose,
  } = useDisclosure();

  const tableHeads = [
    "ID",
    // "Owner's Name",
    // "Business Name",
    "Description",
    "Total Quantity",
    "Transaction Date",
  ];

  const customOrderKeys = [
    "id",
    // "clientName",
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
      case: 3,
      name: "Released Freebies",
      status: "Released",
    },
    {
      case: 2,
      name: "Rejected Freebies",
      status: "Rejected",
    },
  ];

  const dateTimeArray = ["transactionDate"];

  //RTK QUERY
  const { data, isFetching } = useGetAllSamplingsQuery({
    Search: search,
    Page: page + 1,
    PageSize: rowsPerPage,
    DateFrom: dateFrom ? moment(dateFrom).format("YYYY-MM-DD") : "",
    DateTo: dateTo ? moment(dateTo).format("YYYY-MM-DD") : "",
    TransactionType: "Sampling",
    Status: tabs[tabViewing - 1]?.status,
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
          onView={handleView}
          onPrint={onPrintOpen}
        />
      )}
      <PrintInventoryModal
        data={selectedRowData}
        type="Sampling"
        onClose={onPrintClose}
        copies={0}
        open={isPrintOpen}
      />
    </Box>
  );
}

export default SamplingApproval;
