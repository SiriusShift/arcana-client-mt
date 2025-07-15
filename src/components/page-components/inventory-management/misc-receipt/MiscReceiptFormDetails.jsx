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

const MiscReceiptFormDetailsSkeleton = () => {
  return (
    <Stack
      direction="row"
      style={{ display: "flex", justifyContent: "space-between" }}
      spacing={1.5}
    >
      <div style={{ display: "flex", gap: 10 }}>
        <Skeleton variant="rectangular" width={300} height={40} />
        <Skeleton variant="rectangular" width={200} height={40} />
      </div>
      <Skeleton variant="rectangular" width={300} height={40} />
    </Stack>
  );
};
const MiscReceiptFormDetails = ({ details, isFetching }) => {
  const currentUser = useSelector((state) => state.login.userDetails);

  const { control, setValue, watch } = useFormContext();
  const viewOnly = !!details;

  console.log(watch())
  //Get reasons
  const {
    data,
    isFetching: isFetchingReason,
    error,
  } = useGetReasonsQuery(
    {
      isActive: !viewOnly && true,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  console.log(data)

  // Get role CDO ID
  const { data: roleData, isFetching: isRolesFetching } =
    useGetAllUserRolesQuery({
      Page: 1,
      PageSize: 1000,
      Status: true,
    });

  const cdoRoleId = roleData?.userRoles?.find(
    (role) =>
      role.roleName === "CDO" ||
      role.roleName?.toLowerCase() === "Chief Distribution Officer"
  )?.id;

  const [triggerCDO, { data: cdoData, isFetching: isCdoFetching }] =
    useLazyGetAllUsersQuery();

  useEffect(() => {
    if (cdoRoleId) {
      triggerCDO(
        {
          UserRoleId: cdoRoleId,
          Page: 1,
          PageSize: 1000,
          Status: true,
          // isDepot: true,
        },
        {
          preferCacheValue: true,
        }
      );
    }
  }, [cdoRoleId, triggerCDO]);

  useEffect(() => {
    if (details) {
      setValue(
        "to",
        cdoData?.users.find((user) => user.id === details.toCDO)
      );
      setValue("transactionDate", moment(details.dateReceived));
      setValue(
        "remarks",
        data?.find((item) => item?.id === details?.reasonId)
      );
    }
  }, [details, setValue, cdoData]);

  if (isFetching || isCdoFetching || isRolesFetching) {
    return <MiscReceiptFormDetailsSkeleton />;
  }

  return (
    <Stack
      direction="row"
      style={{ display: "flex", justifyContent: "space-between", paddingTop: 5, overflow: "auto" }}
      spacing={1.5}
    >
      <div style={{ display: "flex", gap: 10 }}>
        {" "}
        <ControlledAutocomplete
          name="to"
          control={control}
          options={cdoData?.users || []}
          getOptionLabel={(option) => option?.fullname || ""}
          filterOptions={(options) => {
            const filtered = options.filter(
              (option) => option.id !== currentUser.id
            );

            return filtered;
          }}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          loading={isCdoFetching || !cdoData}
          disabled={viewOnly}
          renderInput={(params) => (
            <TextField
              {...params}
              required
              size="small"
              label="To"
              sx={{ minWidth: "300px" }}
            />
          )}
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
      </div>

      <ControlledAutocomplete
        name="remarks"
        control={control}
        options={data || []}
        getOptionLabel={(option) => option?.reasonInfo || ""}
        // isOptionEqualToValue={(option, value) => option.id === value.id}
        loading={isFetchingReason}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            label="Remarks"
            sx={{ minWidth: "300px" }}
          />
        )}
        disabled={viewOnly}
      />
  
    </Stack>
  );
};

export default MiscReceiptFormDetails;
