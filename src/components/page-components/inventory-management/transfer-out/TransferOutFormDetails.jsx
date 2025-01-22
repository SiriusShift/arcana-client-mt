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

const TransferOutFormDetailsSkeleton = () => {
  return (
    <Stack direction="row" spacing={1.5}>
      <Skeleton variant="rectangular" width={400} height={40} />
      <Skeleton variant="rectangular" width={180} height={40} />
    </Stack>
  );
};
const TransferOutFormDetails = ({ details, isFetching }) => {
  const currentUser = useSelector((state) => state.login.userDetails);

  const { control, setValue } = useFormContext();
  const viewOnly = !!details;

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
          isDepot: true,
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
        cdoData?.users.find((user) => user.fullname === details.transferTo)
      );
      setValue("transactionDate", moment(details.transactionDate));
    }
  }, [details, setValue, cdoData]);

  if (isFetching || isCdoFetching || isRolesFetching) {
    return <TransferOutFormDetailsSkeleton />;
  }

  return (
    <Stack direction="row" spacing={1.5}>
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
            size="small"
            label="To"
            sx={{ minWidth: "400px" }}
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
              sx={{ width: "180px" }}
            />
          </LocalizationProvider>
        )}
      />

    </Stack>
  );
};

export default TransferOutFormDetails;
