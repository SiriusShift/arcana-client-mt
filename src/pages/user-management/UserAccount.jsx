import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import CommonTable from "../../components/CommonTable";
import useDisclosure from "../../hooks/useDisclosure";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import SessionExpired from "../SessionExpired";
import {
  usePatchUserStatusMutation,
  useGetAllUsersQuery,
  usePatchResetPasswordMutation,
  useGetPendingUsersQuery,
} from "../../features/user-management/api/userAccountApi";
import { Person } from "@mui/icons-material";
import { useGetAllUserRolesQuery } from "../../features/user-management/api/userRoleApi";
import { useSelector } from "react-redux";
import PageHeaderFilterAdd from "../../components/PageHeaderFilterAdd";
import useSnackbar from "../../hooks/useSnackbar";
import useConfirm from "../../hooks/useConfirm";
import { handleCatchErrorMessage } from "../../utils/CustomFunctions";
import UserDrawer from "../../components/page-components/user-management/user-account/UserDrawer";
import { Navigate } from "react-router-dom";
import PageHeaderAddTabs from "../../components/PageHeaderAddTabs";

function UserAccount() {
  const [editMode, setEditMode] = useState(false);
  const [approveMode, setApproveMode] = useState(false)
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [tabViewing, setTabViewing] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(null);
  const [roleFilter, setRoleFilter] = useState("");

  console.log(tabViewing)
  // Hooks
  const snackbar = useSnackbar();
  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const confirm = useConfirm();

  // Disclosures
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  // Constants
  const tableHeads = [
    "Full ID Number",
    "Full Name",
    "Username",
    ...(tabViewing !== 1 ? ["Role Name"] : []),
  ];
  const customOrderKeys = ["fullIdNo", "fullname", "username", ...(tabViewing !== 1 ? ["roleName"] : [])];
  const disableActions = ["edit", "archive", "resetPassword"];


  const tabs = [
    {
      case: 1,
      name: "Pending",
      status: "Pending",
    },
    {
      case: 2,
      name: "Approved",
      status: "Approved",
    },
    {
      case: 3,
      name: "Archived",
      status: "Archived",
    },
  ];

  // RTK Query
  const { data, isFetching, error } = useGetAllUsersQuery({
    Search: search,
    Status: status,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
    ...(roleFilter ? { UserRoleId: roleFilter } : {}),
  }, { refetchOnMountOrArgChange: true, skip: tabViewing === 1 });
  const { data: pendingUsers, isFetching: pendingFetching } = useGetPendingUsersQuery({
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  }, {
    skip: tabViewing !== 1
  })

  const transformPending = pendingUsers?.result?.map((item) => ({
    ...item,
    fullname: `${item?.lastName}, ${item?.firstName} ${item?.suffix ? item?.suffix : ""} ${item?.middleName}`,
    fullIdNo: `${item?.employeePrefix}-${item?.employeeId}`
  }))
  console.log(transformPending);
  const [patchUserStatus] = usePatchUserStatusMutation();
  const [patchResetPassword] = usePatchResetPasswordMutation();
  const { data: userRoleData } = useGetAllUserRolesQuery({
    Status: true,
    PageSize: 1000,
  });

  const onArchive = async () => {
    try {
      await confirm({
        children: (
          <>
            Are you sure you want to {status ? "archive" : "restore"}{" "}
            <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
              {selectedRowData?.username}
            </span>
            ?
          </>
        ),
        question: !status,
        callback: () => patchUserStatus(selectedRowData?.id).unwrap(),
      });

      snackbar({
        message: `User Account ${status ? "archived" : "restored"
          } successfully`,
        variant: "success",
      });
    } catch (error) {
      if (error?.isConfirmed) {
        snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
      }
    }
  };

  const handleApprove = async () => {
  }

  const handleTabChange = (data) => {
    setTabViewing(data);
    if (data === 3) {
      setStatus(false);
    } else {
      setStatus(true)
    }
  }

  const onReset = async () => {
    try {
      await confirm({
        children: (
          <>
            Are you sure you want to reset password for{" "}
            <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
              {selectedRowData?.username}
            </span>
            ?
          </>
        ),
        question: true,
        callback: () => patchResetPassword(selectedRowData?.id).unwrap(),
      });

      snackbar({ message: "Password reset successfully", variant: "success" });
    } catch (error) {
      if (error?.isConfirmed) {
        snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
      }
    }
  };

  // Functions
  const handleAddOpen = () => {
    console.log("test")
    setEditMode(false);
    setApproveMode(false);
    onDrawerOpen();
  };

  const handleEditOpen = () => {
    setEditMode(true);
    setApproveMode(false);
    onDrawerOpen();
  };

  const handleApproveOpen = () => {
    setEditMode(false);
    setApproveMode(true);
    onDrawerOpen();
  }

  // useEffect: Pagination
  useEffect(() => {
    setCount(data?.totalCount);
  }, [data]);

  useEffect(() => {
    setPage(0);
  }, [search, status, rowsPerPage, roleFilter]);

  return (
    <>
      {error ? <SessionExpired /> :

        <Box className="commonPageLayout">
          {/* Page Header */}
          <PageHeaderAddTabs
            pageTitle={
              <>
                User Account <Person />
              </>
            }
            onOpen={handleAddOpen}
            setSearch={setSearch}
            setStatus={setStatus}
            tabsList={tabs}
            tabViewing={tabViewing}
            setTabViewing={handleTabChange}
            filterChoices={userRoleData?.userRoles || []}
            choiceLabel="roleName"
            choiceValue="id"
            setFilter={setRoleFilter}
          />

          {/* Main Table */}
          {(tabViewing === 1 ? pendingFetching : isFetching) ? (
            <CommonTableSkeleton evenLesserCompact />
          ) : (
            <CommonTable
              evenLesserCompact
              //Data Props
              mapData={tabViewing !== 1 ? data?.users : transformPending}
              tableHeads={tableHeads}
              customOrderKeys={customOrderKeys}
              //Action Props
              onEdit={tabViewing !== 1 && handleEditOpen}
              onArchive={tabViewing !== 1 && onArchive}
              // onResetPassword={onReset}
              disableActions={
                selectedRowData?.fullname === "Admin" && disableActions
              }
              onApprove={tabViewing === 1 && handleApproveOpen}
              //Pagination Props
              page={page}
              setPage={setPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              count={count}
              //Other Props
              status={status}
            />
          )}
        </Box>
      }

      {/* Drawer Form */}
      <UserDrawer
        open={isDrawerOpen}
        onClose={onDrawerClose}
        editMode={editMode}
        approveMode={approveMode}
      />
    </>
  );
}

export default UserAccount;
