import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Menu,
  Select,
  Popover,
  TextField,
} from "@mui/material";
import React, { useRef } from "react";
import SecondaryButton from "./SecondaryButton";
import { useSelector } from "react-redux";
import useDisclosure from "../hooks/useDisclosure";
import { FilterList } from "@mui/icons-material";
import {
  clusterOptions,
  paymentTypes,
  invoiceTypes,
  returnToDepot,
  transferTypes,
  userTypes,
} from "../utils/constants";
import { useGetAllOtherExpensesQuery } from "../features/setup/api/otherExpensesApi";
import { useGetAllStoreTypesQuery } from "../features/setup/api/storeTypeApi";
import { useGetAllUsersQuery } from "../features/user-management/api/userAccountApi";
import { useGetAllUserRolesQuery } from "../features/user-management/api/userRoleApi";
import { useGetAllClustersQuery } from "../features/setup/api/clusterApi";
import { useGetAllDistributionQuery } from "../features/setup/api/distributionApi";

function CommonFilter({
  filter,
  // setSearch,
  transactionStatus,
  clusterFilter,
  paymentMethodFilter,
  // expenseTypeFilter,
  distriTypeFilter,
  userTypeFilter,
  typeFilter,
  userFilter,
  // invoiceTypeFilter,
  // validityFilter,
  // uploadStatusFilter,
  // frequenceFilter,
  // paymentChannelFilter,
  // statusFilter,
}) {
  //States
  const [filters, setFilters] = React.useState({
    // search: "",
    clusterId: null,
    // paymentType: null,
    // expenseType: null,
    distriType: null,
    // invoiceType: null,
    // validity: null,
    // uploadStatus: null,
    // frequence: null,
    paymentMethod: null,
    userId: null,
    type: null,
    userType: null,
    // status: null,
  });

  //Query
  // const { data: otherExpensesOptions } = useGetAllOtherExpensesQuery();
  const { data: storeTypeData } = useGetAllStoreTypesQuery({ Status: true });
    const { data: distriData } = useGetAllDistributionQuery({ Status: true });


  //slice
  const userDetails = useSelector((state) => state.login.userDetails);

  const { data: roleData, isFetching: isRolesFetching } =
    useGetAllUserRolesQuery({
      Page: 1,
      PageSize: 1000,
      Status: true,
    });

  const cdoRoleId = roleData?.userRoles?.find(
    (role) =>
      role.roleName === "TDO" ||
      role.roleName?.toLowerCase() === "Chief Distribution Officer"
  )?.id;

  const { data, isFetching, error } = useGetAllClustersQuery(
    {
      Status: true,
      PageNumber: 1,
      PageSize: 10000,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  //Function
  const resetFilter = () => {
    setFilters({
      // search: "",
      clusterId: null,
      // paymentType: null,
      // expenseType: null,
      distriType: null,
      // invoiceType: null,
      // validity: null,
      // uploadStatus: null,
      // frequence: null,
      paymentMethod: null,
      type: null,
      // status: null,
    });
    filter({
      // search: "",
      clusterId: null,
      // paymentType: null,
      // expenseType: null,
      distriType: null,
      // invoiceType: null,
      // validity: null,
      // uploadStatus: null,
      // frequence: null,
      paymentMethod: null,
      type: null,
      // status: null,
    });
  };

  //Disclosure
  const { isOpen, onOpen, onClose } = useDisclosure();
  const anchorRef = useRef();
  return (
    <>
      <Button
        variant="contained"
        sx={{ backgroundColor: "secondary" }}
        ref={anchorRef}
        className="filterButton"
        medium
        onClick={onOpen}
      >
        Filter <FilterList sx={{ ml: 1 }} />
      </Button>
      <Popover
        open={isOpen}
        onClose={onClose}
        sx={{ mt: 1 }}
        anchorEl={anchorRef.current}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box className="filter">
          {clusterFilter && (
            <Autocomplete
              options={data?.cluster}
              getOptionLabel={(option) => option?.cluster || option}
              onChange={(_, value) => {
                setFilters({ ...filters, clusterId: value });
              }}
              value={filters.clusterId}
              renderInput={(params) => (
                <TextField
                  {...params}
                  // value={filters.clusterId || ""}
                  size="small"
                  sx={{ width: "300px" }}
                  label="Terittory"
                />
              )}
            />
          )}

          {paymentMethodFilter && transactionStatus !== "Pending" && (
            <Autocomplete
              options={paymentTypes.filter((type) => {
                return userDetails?.username !== "rsunga" &&
                  userDetails?.username !== "admin"
                  ? type?.label !== "Withholding"
                  : type.label;
              })}
              getOptionLabel={(option) => option?.label}
              onChange={(_, value) => {
                setFilters({ ...filters, paymentMethod: value });
              }}
              value={filters.paymentMethod}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  sx={{ width: "300px" }}
                  label="Payment Method"
                />
              )}
            />
          )}

          {/* {expenseTypeFilter && (
            <Autocomplete
              options={otherExpensesOptions?.otherExpenses}
              getOptionLabel={(option) => option?.expenseType}
              onChange={(_, value) => {
                setFilters({ ...filters, expenseType: value });
              }}
              value={filters?.expenseType}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  sx={{ width: "300px" }}
                  label="Expense Type"
                />
              )}
            ></Autocomplete>
          )} */}

          {distriTypeFilter && (
            <Autocomplete
              options={distriData?.distributionTypes}
              getOptionLabel={(option) => option?.name}
              onChange={(_, value) => {
                setFilters({ ...filters, distriType: value });
              }}
              value={filters?.distriType}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  sx={{ width: "300px" }}
                  label="Business Type"
                />
              )}
            ></Autocomplete>
          )}
          {typeFilter && (
            <Autocomplete
              options={transferTypes}
              getOptionLabel={(option) => option?.name}
              onChange={(_, value) => {
                setFilters({ ...filters, type: value });
              }}
              value={filters?.type}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  sx={{ width: "300px" }}
                  label="Type"
                />
              )}
            />
          )}
          {/* {invoiceTypeFilter && (
            <Autocomplete
              options={invoiceTypes}
              getOptionLabel={(option) => option?.label}
              onChange={(_, value) => {
                setFilters({ ...filters, invoiceType: value });
              }}
              value={filters?.invoiceType}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  sx={{ width: "300px" }}
                  label="Invoice Type"
                />
              )}
            ></Autocomplete>
          )} */}
        </Box>
        <Divider sx={{ marginX: 3 }} />
        <Box className="filter__button">
          <SecondaryButton onClick={resetFilter}>Reset</SecondaryButton>
          <SecondaryButton onClick={() => filter({ ...filters })}>
            Submit
          </SecondaryButton>
        </Box>
      </Popover>
    </>
  );
}

export default CommonFilter;
