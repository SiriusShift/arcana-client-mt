import { LooksOne } from "@mui/icons-material";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import CommonDialog from "../../components/common/CommonDialog";
import CommonTable from "../../components/CommonTable";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import PageHeaderAddTabs from "../../components/PageHeaderAddTabs";
import {
  useGetChargingQuery,
  useSyncChargingMutation,
} from "../../features/user-management/api/oneChargingArcanaApi";
import useDisclosure from "../../hooks/useDisclosure";
import useSnackbar from "../../hooks/useSnackbar";

const OneCharging = () => {
  const [tabViewing, setTabViewing] = useState(1);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(null);
  const [search, setSearch] = useState(null);

  const [sync, { isLoading: syncLoading }] = useSyncChargingMutation();
  const { data, isLoading } = useGetChargingQuery({
    isActive: tabViewing === 1 ? true : false,
    PageNumber: page + 1,
    pageSize: rowsPerPage,
    // search: search,
  });

  const snackbar = useSnackbar();
  const {
    isOpen: isDialogOpen,
    onOpen: onDialogOpen,
    onClose: onDialogClose,
  } = useDisclosure();

  const tabs = [
    {
      case: 1,
      name: "Active",
      status: "Active",
    },
    {
      case: 2,
      name: "Inactive",
      status: "Inactive",
    },
  ];

  const tableHeads = [
    "Code",
    "Name",
    "Company",
    "Business Unit",
    "Department",
    "Department Unit",
    "Sub Unit",
    "Location",
    "Status",
  ];

  const customOrderKeys = [
    "code",
    "name",
    (row) => `${row.companyCode} - ${row.companyName}`,
    (row) => `${row.businessUnitCode} - ${row.businessUnitName}`,
    (row) => `${row.departmentCode} - ${row.departmentName}`,
    (row) => `${row.departmentUnitCode} - ${row.departmentUnitName}`,
    (row) => `${row.subUnitCode} - ${row.subUnitName}`,
    (row) => `${row.locationCode} - ${row.locationName}`,
    (row) => (row.isActive ? "Active" : "Inactive"),
  ];
  const handleTabChange = (data) => {
    setTabViewing(data);
  };

  const handleSync = async () => {
    try {
      await sync();
      onDialogClose()
      snackbar({ message: "Syncing successfull", variant: "success" });

    } catch (err) {
      snackbar({ message: handleCatchErrorMessage(err), variant: "error" });
    }
  };

  // useEffect: Pagination
  useEffect(() => {
    setCount(data?.totalCount);
  }, [data]);

  useEffect(() => {
    setPage(0);
  }, [rowsPerPage]);
  return (
    <>
      <Box className="commonPageLayout">
        <PageHeaderAddTabs
          pageTitle={
            <>
              One Charging <LooksOne />
            </>
          }
          tabsList={tabs}
          tabViewing={tabViewing}
          addTitle="Sync"
          onOpen={onDialogOpen}
          setTabViewing={handleTabChange}
        />
        {isLoading ? (
          <CommonTableSkeleton evenLesserCompact />
        ) : (
          <CommonTable
            evenLesserCompact
            mapData={data?.chargings}
            tableHeads={tableHeads}
            customOrderKeys={customOrderKeys}
            includeActions={false}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            count={count}
          />
        )}
      </Box>
      <CommonDialog
        onClose={onDialogClose}
        open={isDialogOpen}
        question={true}
        isLoading={syncLoading}
        onYes={handleSync}
      >
        Are you sure you want to{" "}
        <span style={{ fontWeight: "bold" }}>SYNC</span>?
      </CommonDialog>
    </>
  );
};

export default OneCharging;
