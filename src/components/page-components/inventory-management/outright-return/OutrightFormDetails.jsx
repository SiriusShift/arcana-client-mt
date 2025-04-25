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

const OutrightFormDetailsSkeleton = () => {
  return (
    <Stack direction="row" spacing={1.5}>
      <Skeleton variant="rectangular" width={300} height={40} />
      <Skeleton variant="rectangular" width={200} height={40} />
    </Stack>
  );
};
const OutrightFormDetails = ({ details, isFetching }) => {
  const currentUser = useSelector((state) => state.login.userDetails);

  const { control, setValue } = useFormContext();
  const viewOnly = !!details;

  const {
    data,
    isFetching: isFetchingReason,
    error,
  } = useGetReasonsQuery(
    {
      isActive: true,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  // useEffect(() => {
  //   if (details) {
  //     setValue(
  //       "to",
  //       depotData?.users.find((user) => user.fullname === details.transferTo)
  //     );
  //     setValue("transactionDate", moment(details.transactionDate));
  //   }
  // }, [details, setValue, depotData]);

  if (isFetching || isFetchingReason) {
    return <OutrightFormDetailsSkeleton />;
  }

  return (
    <Stack direction="row" spacing={1.5}>
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

export default OutrightFormDetails;
