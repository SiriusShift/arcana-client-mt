import {
  useGetChequeQuery,
  usePostChequeMutation,
} from "../../features/cheque/api/chequeApi";
import { useGetAllClientsQuery } from "../../features/registration/api/registrationApi";
import CommonTable from "../../components/CommonTable";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import { Autocomplete, Box, TextField, Tooltip } from "@mui/material";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import { useEffect, useState } from "react";
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import SecondaryButton from "../../components/SecondaryButton";
import _ from "lodash";
import { GetApp } from "@mui/icons-material";
import SearchDateRangeMixin from "../../components/mixins/SearchDateRangeMixin";
import CommonDrawer from "../../components/CommonDrawer";
import useDisclosure from "../../hooks/useDisclosure";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { listingToChequeSchema } from "../../schema/schema";
import ControlledAutocomplete from "../../components/ControlledAutocomplete";
import useSnackbar from "../../hooks/useSnackbar";
import { NumericFormat } from "react-number-format";

function cheque() {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [dateFrom, setDateFrom] = useState(moment());
  const [dateTo, setDateTo] = useState(moment());
  const snackbar = useSnackbar();

  // Disclosure
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  const { data, isFetching } = useGetChequeQuery({
    Page: page + 1,
    PageSize: rowsPerPage,
    Search: search,
    DateFrom: moment(dateFrom).format("MM-DD-YYYY"),
    DateTo: moment(dateTo).format("MM-DD-YYYY"),
  });

  const { data: RegisteredClients, isFetching: fetchingClients } =
    useGetAllClientsQuery({
      PageSize: 1000,
      RegistrationStatus: "Approved",
    });
    

  const [postCheque, { isLoading }] = usePostChequeMutation();

  const {
    handleSubmit,
    formState: { isValid, isDirty, errors },
    setValue,
    reset,
    control,
    watch,
  } = useForm({
    resolver: yupResolver(listingToChequeSchema.schema),
    mode: "onChange",
    defaultValues: listingToChequeSchema.defaultValues,
  });

  //Functions
  const handleDrawerClose = () => {
    onDrawerClose();
    reset();
  };

  const onSubmit = async (data) => {
    const transformedData = {
      clientId: data?.clientId?.id,
      bankName: data?.bankName,
      chequeNo: data?.chequeNo,
      chequeDate: moment(data?.chequeDate).format("YYYY-MM-DD"),
      voucherNo: data?.voucherNo,
      amount: parseInt(data?.amount),
    };

    try {
      const response = await postCheque(transformedData).unwrap();
      handleDrawerClose();
      snackbar({
        message: "Successfully added cheque",
        variant: "success",
      });
    } catch (error) {
      if (error?.data?.error?.message) {
        snackbar({ message: error?.data?.error?.message, variant: "error" });
      } else {
        snackbar({
          message: "Error",
          variant: "error",
        });
      }
    }
  };

  //Use Effect

  useEffect(() => {
    if (data) {
      setCount(setCount(data?.totalCount));
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      setCount(data?.totalCount);
    }
  }, [data]);

  useEffect(() => {
    setPage(0);
  }, [rowsPerPage, data]);

  return (
    <>
      <Box className="commonPageLayout">
        <PageHeaderAdd
          onOpen={onDrawerOpen}
          pageTitle="Cheque"
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
          <CommonTableSkeleton evenLesserCompact />
        ) : (
          <CommonTable
            lowerCompact
            moveNoDataUp
            mapData={data?.transactions}
            includeActions={false}
            count={count}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            page={page}
            setPage={setPage}
          />
        )}
      </Box>
      <CommonDrawer
        drawerHeader="Listing Fee to Cheque"
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        disableSubmit={!isValid || !isDirty}
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isLoading}
      >
        <ControlledAutocomplete
          name="clientId"
          control={control}
          options={RegisteredClients?.regularClient}
          getOptionLabel={(option) =>
            option?.businessName?.toUpperCase() + " - " + String(option?.id)
          }
          disableClearable
          isOptionEqualToValue={() => true}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label="Business Name"
              helperText={errors?.clientId?.message}
              error={errors?.clientId}
            />
          )}
        />
        <Controller
          control={control}
          name="bankName"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextField
              label="Bank Name"
              size="small"
              autoComplete="off"
              onChange={onChange}
              onBlur={onBlur}
              value={value || ""}
              ref={ref}
            />
          )}
        />
        <Controller
          control={control}
          name="chequeNo"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextField
              label="Cheque Number"
              size="small"
              autoComplete="off"
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              ref={ref}
            />
          )}
        />
        <Controller
          name="chequeDate"
          control={control}
          render={({ field }) => (
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                {...field}
                label="Cheque Date"
                slotProps={{
                  textField: { size: "small" },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    helperText={errors?.chequeDate?.message}
                    error={errors?.chequeDate}
                  />
                )}
              />
              {/* <DatePicker
                {...field}
                label="Price Effectivity Date"
                slotProps={{
                  textField: { size: "small", required: true },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    helperText={errors?.effectivityDate?.message}
                    error={errors?.effectivityDate}
                  />
                )}
                minDate={moment()}
              /> */}
            </LocalizationProvider>
          )}
        />
        <Controller
          control={control}
          name="voucherNo"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextField
              label="Voucher Number"
              size="small"
              type="number"
              autoComplete="off"
              onChange={onChange}
              onBlur={onBlur}
              value={value?.toUpperCase() || ""}
              ref={ref}
            />
          )}
        />
        <Controller
          control={control}
          name={"amount"}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <NumericFormat
              label="Amount"
              type="text"
              size="small"
              customInput={TextField}
              autoComplete="off"
              onValueChange={(e) => {
                onChange(Number(e.value));
              }}
              onBlur={onBlur}
              value={value || ""}
              ref={ref}
              // required
              thousandSeparator=","
              prefix="₱"
              helperText={errors?.price?.message}
              error={errors?.price}
            />
          )}
        />
      </CommonDrawer>
    </>
  );
}

export default cheque;
