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

const OutrightFormDetailsSkeleton = () => {
  return (
    <Stack direction="row" spacing={1.5}>
      <Skeleton variant="rectangular" width={300} height={40} />
      <Skeleton variant="rectangular" width={200} height={40} />
    </Stack>
  );
};
const ReturnToDepotFormDetails = ({ details, isFetching, moveOrder }) => {
  const { control, setValue, watch } = useFormContext();
  const userDetails = useSelector((state) => state.login.userDetails);
  const viewOnly = !!details;

  console.log(watch());

  const { data, isLoading } = useGetAllReceivedOrdersQuery({
    PageSize: 1000,
    ...(!details && { DateFrom: moment().format("YYYY-MM-DD") }),
    ...(!details && { DateTo: moment().format("YYYY-MM-DD") }),
  });

  const { data: returnOrders, isFetching: isFetchingReturnOrders } =
    useGetReturnToDepotQuery({
      PageSize: 1000,
      DateFrom: moment().format("YYYY-MM-DD"),
      DateTo: moment().format("YYYY-MM-DD"),
      Status: "Received",
      // TransferType: "Outright",
    });

  const moveOrders = returnOrders?.value?.to.map((item) => {
    return item?.transferItems?.reduce((item) => item.itemCode)?.moveOrderId;
  });

  console.log(moveOrders);

  useEffect(() => {
    if (!!details) {
      console.log("details", details);
      // console.log("Testing123",details, data)
      // setValue(
      //   "remarks",
      //   data?.find((user) => user?.id === details?.reasonInfo)
      // );
      setValue("transactionDate", moment(details.transactionDate));
      setValue(
        "type",
        returnToDepot.find((item) => item.value === details.transferType)
      );
      if (details.transferType === "Outright") {
        setValue(
          "moveOrder",
          data?.value?.mo?.find(
            (item) =>
              item?.moveOrderId === details?.transferItems[0]?.moveOrderId
          )
        );
      }
      setValue("referenceNo", details?.referenceNo);
    }
  }, [details, data]);

  const { data: productData, isFetching: isItemsWithBBDFetching } =
    useGetAllItemsInventoryQuery();

  console.log(data);

  // useEffect(() => {
  //   if (watch("type")?.value === "Outright Return") {
  //     setValue("moveOrderId", null);
  //   }
  // }, [data]);

  console.log(data);

  if (isFetching || isLoading || isFetchingReturnOrders) {
    return <OutrightFormDetailsSkeleton />;
  }

  return (
    <Stack direction="row" spacing={1.5}>
      {/* <ControlledAutocomplete
        name="remarks"
        control={control}
        options={data || []}
        getOptionLabel={(option) => option?.reasonInfo || ""}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        loading={isFetchingReason || isFetching}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            label="Remarks"
            sx={{ minWidth: "300px" }}
          />
        )}
        disabled={viewOnly}
      /> */}

      <ControlledAutocomplete
        name="type"
        control={control}
        options={returnToDepot.filter((item, index) => userDetails?.roleName === "CDO" ? item.value !== "ReturnSampling" : userDetails?.roleName === "Marketing" ? item.value === "ReturnSampling" : item) || []}
        getOptionLabel={(option) => option?.name || ""}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            label="Type"
            sx={{ width: "250px" }}
          />
        )}
        disabled={viewOnly}
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

      {watch("type")?.value === "Outright" && data && (
        <ControlledAutocomplete
          control={control}
          name="moveOrder"
          options={
            data?.value?.mo?.filter(
              (item) => !moveOrders.includes(item?.moveOrderId)
            ) || []
          }
          getOptionLabel={(option) => option?.moveOrderId}
          isLoading={
            isLoading || isItemsWithBBDFetching || isFetchingReturnOrders
          }
          onChange={(e, value) => {
            setValue("items", [
              {
                item: null,
                description: null,
                quantity: null,
                reason: null,
                bbd: null,
                price: null,
              },
            ]);
            return value;
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label="Move Order ID"
              sx={{ width: "200px" }}
            />
          )}
          disabled={viewOnly || isLoading || isItemsWithBBDFetching}
        />
      )}

      <Controller
        control={control}
        name="referenceNo"
        render={({ field: { onChange, value } }) => (
          <NumericFormat
            label="Reference No"
            size="small"
            customInput={TextField}
            value={value ?? ""}
            decimalScale={0}
            sx={{ width: "150px" }}
            onChange={(e) => {
              onChange(e.target.value);
            }}
            isAllowed={(values) => {
              const { floatValue } = values;
              return !floatValue || floatValue >= 0;
            }}
            disabled={viewOnly}
          />
        )}
      />
    </Stack>
  );
};

export default ReturnToDepotFormDetails;
