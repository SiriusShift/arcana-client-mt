import { Box } from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import CommonTable from "../../components/CommonTable";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import SearchFilterMixin from "../../components/mixins/SearchFilterMixin";
import ApprovalHistoryModal from "../../components/modals/ApprovalHistoryModal";
import ViewRegistrationDetailsModal from "../../components/modals/view-registration-modal/ViewRegistrationDetailsModal";
import PageHeaderTabs from "../../components/PageHeaderTabs";
import { AppContext } from "../../context/AppContext";
import { useGetEditClientRequestQuery } from "../../features/registration/api/registrationApi";
import useDisclosure from "../../hooks/useDisclosure";
import SessionExpired from "../SessionExpired";
// import { usePatchReadNotificationMutation } from "../../features/notification/api/notificationApi";

function AddItemApproval() {
  const userDetails = useSelector((state) => state.login.userDetails);

  const [tabViewing, setTabViewing] = useState(userDetails?.roleName !== "TDO" ? 2 : 1);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [origin, setOrigin] = useState("");
  const [clientStatus, setClientStatus] = useState("Under review");
  const [count, setCount] = useState(0);

  const { notifications, isNotificationFetching } = useContext(AppContext);
  //Disclosures
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

  const { data, isFetching, error } = useGetEditClientRequestQuery({
    Search: search,
    // Status: true,
    // RegistrationStatus: clientStatus,
    isApproved: tabViewing === 3 ? true : false,
    isRejected: tabViewing === 4 ? true : false,
    Origin: origin,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
    forRequestor: userDetails?.roleName === "TDO" ? true : false
  }, {
    refetchOnMountOrArgChange: true
  });

  // const [patchReadNotification] = usePatchReadNotificationMutation();

  //Constants
  const registrationNavigation = useMemo(
    () => [
      {
        case: 1,
        name: "For Approval",
        registrationStatus: "For Approval",
        // badge: notifications["rejectedClient"],
      },
      {
        case: 2,
        name: "Pending",
        registrationStatus: "Under review",
        badge: notifications["pendingClient"],
      },

      {
        case: 3,
        name: "Approved",
        registrationStatus: "Approved",
        // badge: notifications["approvedClient"],
      },
      {
        case: 4,
        name: "Rejected",
        registrationStatus: "Rejected",
        // badge: notifications["rejectedClient"],
      },

    ],
    [notifications]
  ).filter((value) =>
    userDetails?.roleName === "TDO" ? value.case === 1 || value.case === 3
      : value.case !== 1
  );

  const selectOptions = [
    {
      value: " ",
      label: "All",
    },
    {
      value: "prospecting",
      label: "Prospect",
    },
    {
      value: "direct",
      label: "Direct",
    },
  ];

  const tableHeads = [
    "Client Name",
    "Requestor",
  ];

  const customOrderKeys = [
    "clientName",
    "requestor",
  ];

  const nestedProperty = {
    key: "businessAddress",
    nestedKeys: ["city", "province"],
  };

  //Misc Functions

  useEffect(() => {
    const foundItem = registrationNavigation.find(
      (item) => item.case === tabViewing
    );

    setClientStatus(foundItem?.registrationStatus);
  }, [tabViewing, registrationNavigation]);

  // useEffect(() => {
  //   if (clientStatus === "Under review") {
  //     patchReadNotification({ Tab: "Pending Clients" });
  //   }
  // }, [clientStatus, patchReadNotification]);

  useEffect(() => {
    setCount(data?.totalCount);
  }, [data]);

  useEffect(() => {
    setPage(0);
  }, [tabViewing, search, rowsPerPage]);

  return (
    <>
      {error && <SessionExpired />}
      <Box className="commonPageLayout">
        <PageHeaderTabs
          pageTitle="Add Item Approval"
          tabsList={registrationNavigation}
          tabViewing={tabViewing}
          setTabViewing={setTabViewing}
          isNotificationFetching={isNotificationFetching}
        />

        <SearchFilterMixin
          setSearch={setSearch}
          remove
        />
        {isFetching ? (
          <CommonTableSkeleton compact />
        ) : (
          <CommonTable
            mapData={data?.editRequests || []}
            tableHeads={tableHeads}
            customOrderKeys={customOrderKeys}
            nestedProperty={nestedProperty}
            compact
            moveNoDataUp
            onView={onViewOpen}
            onHistory={onHistoryOpen}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            count={count}
          />
        )}
      </Box>

      <ViewRegistrationDetailsModal
        open={
          isViewOpen
          // true
        }
        onClose={onViewClose}
        approval
        clientStatus={clientStatus}
        module={"Add Item Approval"}
      />

      <ApprovalHistoryModal open={isHistoryOpen} onClose={onHistoryClose} />
    </>
  );
}

export default AddItemApproval;
