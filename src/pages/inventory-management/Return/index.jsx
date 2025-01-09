import { Box } from "@mui/material";
import { useState } from "react";
import CommonTable from "../../../components/CommonTable";
import SearchDateRangeMixin from "../../../components/mixins/SearchDateRangeMixin";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CommonTableSkeleton from "../../../components/CommonTableSkeleton";
import moment from "moment";
import PageHeaderAdd from "../../../components/PageHeaderAdd";
import { useGetAllReturnsQuery } from "../../../features/inventory-management/api/returnApi";

function Return() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState(moment().startOf("month"));
  const [dateTo, setDateTo] = useState(moment());

  const { data, isFetching } = useGetAllReturnsQuery({
    Search: search,
    Page: page + 1,
    PageSize: rowsPerPage,
    DateFrom: dateFrom ? moment(dateFrom).format("YYYY-MM-DD") : "",
    DateTo: dateTo ? moment(dateTo).format("YYYY-MM-DD") : "",
  });

  const tableHeads = [
    "ID",
    "Owner's Name",
    "Business Name",
    "Total Return Price",
    "Total Exchange Price",
    "Transaction Date",
  ];

  const customOrderKeys = [
    "returnId",
    "clientName",
    "businessName",
    "totalReturnPrice",
    "totalExchangePrice",
    "createdDate",
  ];

  const nestedProperty = {
    key: "businessAddress",
    nestedKeys: ["city", "province"],
  };

  const dateTimeArray = ["transactionDate"];

  const pesoArray = ["totalReturnPrice", "totalExchangePrice"];

  // Functions
  const handleView = () => {
    navigate(`${selectedRowData?.id}`);
  };

  const handleAdd = () => {
    navigate("return-form");
  };

  if (location.pathname === "/inventory-management/return") {
    return (
      <Box className="commonPageLayout">
        <PageHeaderAdd
          pageTitle="Return"
          addTitle="Add Return"
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
            pesoArray={pesoArray}
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

export default Return;
