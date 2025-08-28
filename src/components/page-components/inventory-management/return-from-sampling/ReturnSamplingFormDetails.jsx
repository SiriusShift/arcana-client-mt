import { Skeleton, Stack, TextField } from "@mui/material";
import { useLazyGetAllUsersQuery } from "../../../../features/user-management/api/userAccountApi";
import { useGetAllUserRolesQuery } from "../../../../features/user-management/api/userRoleApi";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Controller, useFormContext } from "react-hook-form";
import ControlledAutocomplete from "../../../ControlledAutocomplete";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { useGetReasonsQuery } from "../../../../features/inventory-management/api/reasonApi";
import { returnToDepot } from "../../../../utils/Constants";
import { useGetAllReceivedOrdersQuery } from "../../../../features/inventory-management/api/receivingApi";
import { useGetAllItemsInventoryQuery } from "../../../../features/inventory-management/api/inventoryMrpApi";
import { useGetReturnToDepotQuery } from "../../../../features/inventory-management/api/transferOutApi";
import { NumericFormat } from "react-number-format";
import {
  useGetAllSamplingsQuery,
  useGetSamplingReturnsQuery,
} from "../../../../features/inventory-management/api/samplingApi";

const OutrightFormDetailsSkeleton = () => {
  return (
    <Stack direction="row" spacing={1.5}>
      <Skeleton variant="rectangular" width={300} height={40} />
      <Skeleton variant="rectangular" width={200} height={40} />
    </Stack>
  );
};
const ReturnSamplingFormDetails = ({ details, isFetching, moveOrder }) => {
  console.log(details, "details!");
  const { control, setValue, watch } = useFormContext();
  const userDetails = useSelector((state) => state.login.userDetails);
  const viewOnly = !!details;

  console.log(watch());

  const { data, isFetching: isFetchingSamplings } = useGetAllSamplingsQuery({
    ...(!details && { DateFrom: moment().format("YYYY-MM-DD") }),
    ...(!details && { DateTo: moment().format("YYYY-MM-DD") }),
    TransactionType: "Sampling",
    Status: "Released",
  });

  const { data: returnSampling, isFetching: isFetchingReturnSampling } =
    useGetSamplingReturnsQuery({
      PageSize: 1000,
      DateFrom: moment().format("YYYY-MM-DD"),
      DateTo: moment().format("YYYY-MM-DD"),
    });

  console.log(returnSampling);

  const returnIds = returnSampling?.data?.map((item) => {
    return item.samplingId;
  });

  console.log(watch(), "Watch details")

  useEffect(() => {
    if (!!details && data?.to?.length > 0) {
      console.log("details!2", details, data);
      // console.log("Testing123",details, data)
      // setValue(
      //   "remarks",
      //   data?.find((user) => user?.id === details?.reasonInfo)
      // );
      if (data?.to?.length > 0) {
        setValue(
          "freebieOrderId",
          data?.to?.find((item) => item?.id === details?.samplingId)
        );
      }
      setValue("transactionDate", moment(details.returnedDate));
      setValue("type", "Return Sampling");
    }
  }, [details, data]);

  //   const { data: productData, isFetching: isItemsWithBBDFetching } =
  //     useGetAllItemsInventoryQuery();

  console.log(data);

  // useEffect(() => {
  //   if (watch("type")?.value === "Outright Return") {
  //     setValue("moveOrderId", null);
  //   }
  // }, [data]);

  console.log(data);

  if ( isFetching || isFetchingSamplings || isFetchingReturnSampling) {
    return <OutrightFormDetailsSkeleton />;
  }

  return (
    <Stack direction="row" spacing={1.5}>
      <ControlledAutocomplete
        control={control}
        name="freebieOrderId"
        options={
          data?.to?.filter((item) => !returnIds?.includes(item?.id)) || []
        }
        getOptionLabel={(option) => option?.id}
        isLoading={isFetchingSamplings || isFetchingReturnSampling || isFetching }
        onChange={(e, value) => {
          setValue("items", [
            {
              item: null,
              quantity: null,
              remarks: null,
              reason: null,
            },
          ]);
          return value;
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            label="Sampling ID"
            sx={{ width: "200px" }}
          />
        )}
        disabled={viewOnly || isFetching || isFetchingReturnSampling || isFetchingSamplings}
      />
      <Controller
        control={control}
        name="transactionDate"
        render={({ field }) => (
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              disabled
              slotProps={{
                textField: {
                  size: "small",
                  label: "Transaction Date",
                },
              }}
              {...field}
              inputRef={field.ref}
              sx={{ width: "200px" }}
            />
          </LocalizationProvider>
        )}
      />
    </Stack>
  );
};

export default ReturnSamplingFormDetails;
