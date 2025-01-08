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

function Freebies() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const [tabViewing, setTabViewing] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState(moment().startOf("month"));
  const [dateTo, setDateTo] = useState(moment());

  const { data, isFetching } = useGetAllFreebieRequestsQuery({
    Search: search,
    Page: page + 1,
    PageSize: rowsPerPage,
    DateFrom: dateFrom ? moment(dateFrom).format("YYYY-MM-DD") : "",
    DateTo: dateTo ? moment(dateTo).format("YYYY-MM-DD") : "",
    TransactionType: "Freebie"
  });

  console.log(data);

  const tableHeads = [
    "ID",
    "Owner's Name",
    "Business Name",
    "Business Address",
    "Total Quantity",
    "Transaction Date",
  ];

  const customOrderKeys = [
    "id",
    "ownersName",
    "businessName",
    "businessAddress",
    "totalQuantity",
    "transactionDate",
  ];

  const nestedProperty = {
    key: "businessAddress",
    nestedKeys: ["city", "province"],
  };

  const dateTimeArray = ["transactionDate"];

  const tabs = [
    {
      case: 1,
      name: "Pending Freebies",
      status: "Pending",
    },
    {
      case: 2,
      name: "Approved Freebies",
      status: "Approved",
    },
    {
      case: 3,
      name: "Rejected Freebies",
      status: "Rejected",
    },
  ];

  // Functions
  const handleView = () => {
    navigate(`${selectedRowData?.id}?dateFrom=${moment(dateFrom).format("YYYY-MM-DD")}&dateTo=${moment(dateTo).format("YYYY-MM-DD")}`);
  };

  const handleAdd = () => {
    navigate("freebies-form");
  };

  if (location.pathname === "/inventory-management/freebies") {
    return (
      <Box className="commonPageLayout">
        <PageHeaderAddTabs
          pageTitle="Freebies"
          // tabsList={tabs}
          // tabViewing={tabViewing}
          // setTabViewing={setTabViewing}
          // wide
          addTitle="Add Freebie Request"
          onOpen={handleAdd}
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
          />
        )}
      </Box>
    );
  }

  return <Outlet />;
}

export default Freebies;
