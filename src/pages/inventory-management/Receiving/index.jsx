import { Box } from "@mui/material";
import PageHeaderAdd from "../../../components/PageHeaderAdd";
import CommonTable from "../../../components/CommonTable";
import GenerateMoveOrderModal from "../../../components/modals/inventory-management/GenerateMoveOrderModal";
import useDisclosure from "../../../hooks/useDisclosure";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetAllReceivedOrdersQuery } from "../../../features/inventory-management/api/receivingApi";
import CommonTableSkeleton from "../../../components/CommonTableSkeleton";

function Receiving() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  // RTK Query
  const { data, isFetching } = useGetAllReceivedOrdersQuery({
    Search: search,
    Page: page + 1,
    PageSize: rowsPerPage,
  });

  // Common Table Props
  const tableHeads = [
    "Move Order ID",
    "Business Name",
    "Cluster",
    "Transaction Date",
    "Date Received",
  ];

  const customOrderKeys = [
    "moveOrderId",
    "businessName",
    "cluster",
    "transactionDate",
    "dateReceived",
  ];

  const dateTimeArray = ["transactionDate", "dateReceived"];

  // Disclosures
  const {
    isOpen: isGenerateOpen,
    onOpen: onGenerateOpen,
    onClose: onGenerateClose,
  } = useDisclosure();

  // Functions
  const handleView = () => {
    navigate(`${selectedRowData?.moveOrderId}`);
  };

  if (location.pathname === "/inventory-management/receiving") {
    return (
      <>
        <GenerateMoveOrderModal
          open={isGenerateOpen}
          onClose={onGenerateClose}
        />

        <Box className="commonPageLayout">
          <PageHeaderAdd
            pageTitle="Receiving"
            addTitle="New Delivery"
            removeArchive
            onOpen={onGenerateOpen}
            setSearch={setSearch}
          />

          {isFetching ? (
            <CommonTableSkeleton evenLesserCompact />
          ) : (
            <CommonTable
              evenLesserCompact
              moveNoDataUp
              mapData={data?.receivedOrders || []}
              tableHeads={tableHeads}
              customOrderKeys={customOrderKeys}
              dateTimeArray={dateTimeArray}
              count={data?.totalCount || 0}
              onView={handleView}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              page={page}
              setPage={setPage}
            />
          )}
        </Box>
      </>
    );
  }

  return <Outlet />;
}

export default Receiving;
