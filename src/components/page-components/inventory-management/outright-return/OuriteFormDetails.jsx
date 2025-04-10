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

const OuriteFormDetailsSkeleton = () => {
  return (
    <Stack direction="row" spacing={1.5}>
      <Skeleton variant="rectangular" width={400} height={40} />
      <Skeleton variant="rectangular" width={180} height={40} />
    </Stack>
  );
};
const OuriteFormDetails = ({ details, isFetching }) => {
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

  const depotRoleId = roleData?.userRoles?.find(
    (role) =>
      role.roleName === "Depot"
  )?.id;

  const [triggerCDO, { data: depotData, isFetching: isCdoFetching }] =
    useLazyGetAllUsersQuery();

    console.log(depotData);

  useEffect(() => {
    if (depotRoleId) {
      const data = triggerCDO(
        {
          UserRoleId: depotRoleId,
          Page: 1,
          PageSize: 1000,
          Status: true,
        },
        {
          preferCacheValue: true,
        }
      ).unwrap();
    }
  }, [depotRoleId, triggerCDO]);

  useEffect(() => {
    if (details) {
      setValue(
        "to",
        depotData?.users.find((user) => user.fullname === details.transferTo)
      );
      setValue("transactionDate", moment(details.transactionDate));
    }
  }, [details, setValue, depotData]);

  if (isFetching || isCdoFetching || isRolesFetching) {
    return <OuriteFormDetailsSkeleton />;
  }

  return (
    <Stack direction="row" spacing={1.5}>
      <ControlledAutocomplete
        name="to"
        control={control}
        options={depotData?.users || []}
        getOptionLabel={(option) => option?.fullname || ""}
        filterOptions={(options) => {
          const filtered = options.filter(
            (option) => option.id !== currentUser.id
          );

          return filtered;
        }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        loading={isCdoFetching || !depotData}
        disabled
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

export default OuriteFormDetails;
