import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Menu,
  Popover,
  TextField,
} from "@mui/material";
import React, { useRef } from "react";
import SecondaryButton from "./SecondaryButton";
import useDisclosure from "../hooks/useDisclosure";
import { FilterList } from "@mui/icons-material";
import { clusterOptions, paymentTypes } from "../utils/constants";
import { useGetAllOtherExpensesQuery } from "../features/setup/api/otherExpensesApi";

function CommonFilter({
  filter,
  setSearch,
  clusterFilter,
  paymentMethodFilter,
  expenseTypeFilter,
  businessType,
  invoiceTypeFilter,
  validityFilter,
  uploadStatusFilter,
  frequenceFilter,
  paymentTypeFilter,
  statusFilter,
}) {
  //States
  const [filters, setFilters] = React.useState({
    search: "",
    clusterId: null,
    paymentType: null,
    expenseType: null,
    businessType: null,
    invoiceType: null,
    validity: null,
    uploadStatus: null,
    frequence: null,
    paymentMethod: null,
    status: null,
  });

  //Query
  const { data: otherExpensesOptions } = useGetAllOtherExpensesQuery();

  //Function
  const resetFilter = () => {
    setFilters({
      search: "",
      clusterId: null,
      paymentType: null,
      expenseType: null,
      businessType: null,
      invoiceType: null,
      validity: null,
      uploadStatus: null,
      frequence: null,
      paymentMethod: null,
      status: null,
    });
    filter({
      search: "",
      clusterId: null,
      paymentType: null,
      expenseType: null,
      businessType: null,
      invoiceType: null,
      validity: null,
      uploadStatus: null,
      frequence: null,
      paymentMethod: null,
      status: null,
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
          <TextField
            type="search"
            size="small"
            label="Search"
            value={filters.search}
            sx={{ width: "300px" }}
            onChange={(e) => {
              setFilters({ ...filters, search: e.target.value });
            }}
            autoComplete="off"
          />
          {clusterFilter && (
            <Autocomplete
              options={clusterOptions}
              getOptionLabel={(option) => option.label || option}
              onChange={(_, value) => {
                setFilters({ ...filters, clusterId: value });
              }}
              value={filters.clusterId}
              // isOptionEqualToValue={(option, value) => console.log({option, value})}
              renderInput={(params) => (
                <TextField
                  {...params}
                  // value={filters.clusterId || ""}
                  size="small"
                  sx={{ width: "300px" }}
                  label="Cluster Group"
                />
              )}
            />
          )}

          {paymentMethodFilter && (
            <Autocomplete
              options={paymentTypes}
              getOptionLabel={(option) => option.label}
              onChange={(_, value) => {
                setFilters({ ...filters, paymentMethod: value?.expenseType });
              }}
              // defaultValue={[top100Films[13], top100Films[12], top100Films[11]]}
              renderInput={(params) => (
                <TextField
                  {...params}
                  value={filters.paymentMethod}
                  size="small"
                  sx={{ width: "300px" }}
                  label="Payment Method"
                />
              )}
            />
          )}

          {expenseTypeFilter && 
          <Autocomplete
          options={otherExpensesOptions?.otherExpenses}
          getOptionLabel={(option) => option?.expenseType}
          onChange={(_, value) => {
            setFilters({ ...filters, expenseType: value?.value });
          }}
          >
            </Autocomplete>}
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
