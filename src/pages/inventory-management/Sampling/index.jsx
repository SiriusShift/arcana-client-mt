import { Box } from "@mui/material";
import { useState } from "react";
import CommonTable from "../../../components/CommonTable";
import SearchDateRangeMixin from "../../../components/mixins/SearchDateRangeMixin";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CommonTableSkeleton from "../../../components/CommonTableSkeleton";
import moment from "moment";
import PageHeaderAdd from "../../../components/PageHeaderAdd";
import { useGetAllSamplingsQuery } from "../../../features/inventory-management/api/samplingApi";
import useDisclosure from "../../../hooks/useDisclosure";
import PrintInventoryModal from "../../../components/modals/PrintInventoryModal";
import PageHeaderAddTabs from "../../../components/PageHeaderAddTabs";

function Sampling() {
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

  const handleAdd = () => {
    navigate("sampling-form");
  };

  if (location.pathname === "/inventory-management/sampling") {
    return (
      <Box className="commonPageLayout">
        <PageHeaderAddTabs
          pageTitle="Sampling"
          addTitle="Add Sampling"
          tabsList={tabs}
          tabViewing={tabViewing}
          setTabViewing={setTabViewing}
          onOpen={handleAdd}
          removeArchive
          removeSearch
        />

        <SearchDateRangeMixin
          setSearch={setSearch}
          setDateFrom={setDateFrom}
          setDateTo={setDateTo}
          dateFrom={dateFrom}
          dateTo={dateTo}
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

  return <Outlet />;
}

export default Sampling;
