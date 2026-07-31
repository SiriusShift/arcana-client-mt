import { Box } from "@mui/material";
import { useState } from "react";
import CommonTable from "../../../components/CommonTable";
import SearchDateRangeMixin from "../../../components/mixins/SearchDateRangeMixin";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CommonTableSkeleton from "../../../components/CommonTableSkeleton";
import moment from "moment";
import PageHeaderAdd from "../../../components/PageHeaderAdd";
import {
  useGetAllSamplingsQuery,
  useGetSamplingReturnsQuery,
} from "../../../features/inventory-management/api/samplingApi";
import useDisclosure from "../../../hooks/useDisclosure";
import PrintInventoryModal from "../../../components/modals/PrintInventoryModal";
import PageHeaderAddTabs from "../../../components/PageHeaderAddTabs";
import useValidate from "../../../hooks/useValidate";

function ReturnFromSampling() {
  const navigate = useNavigate();
  const location = useLocation();
  const { validateEndingInventory, isNotificationFetching } = useValidate();

  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState(moment().startOf("month"));
  const [dateTo, setDateTo] = useState(moment());

  const tableHeads = ["ID", "returnedDate", "Total Return", "Transaction Date"];

  const customOrderKeys = [
    "returnSamplingId",
    "returnedDate",
    "totalReturn",
    "returnedBy",
  ];

  const nestedProperty = {
    key: "businessAddress",
    nestedKeys: ["city", "province"],
  };

  const dateTimeArray = ["returnedDate"];

  //RTK QUERY
  const { data, isFetching } = useGetSamplingReturnsQuery({
    Search: search,
    Page: page + 1,
    PageSize: rowsPerPage,
    DateFrom: dateFrom ? moment(dateFrom).format("YYYY-MM-DD") : "",
    DateTo: dateTo ? moment(dateTo).format("YYYY-MM-DD") : "",
  });

  console.log(data);

  // Functions
  const handleView = () => {
    navigate(
      `${selectedRowData?.returnSamplingId}?dateFrom=${moment(dateFrom).format(
        "YYYY-MM-DD"
      )}&dateTo=${moment(dateTo).format("YYYY-MM-DD")}`
    );
  };

  const handleAdd = () => {
    const error = validateEndingInventory();
    if (error) return;
    navigate("return-form");
  };

  if (location.pathname === "/sales-management/return-sampling") {
    return (
      <Box className="commonPageLayout">
        <PageHeaderAddTabs
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

        {isFetching || isNotificationFetching ? (
          <CommonTableSkeleton lowerCompact />
        ) : (
          <CommonTable
            moveNoDataUp
            lowerCompact
            mapData={data?.data}
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

export default ReturnFromSampling;
