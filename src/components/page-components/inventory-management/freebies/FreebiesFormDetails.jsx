import { Skeleton, Stack, TextField } from "@mui/material";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import ControlledAutocomplete from "../../../ControlledAutocomplete";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { useGetAllClientsQuery } from "../../../../features/registration/api/registrationApi";

const FreebiesFormDetailsSkeleton = () => {
  return (
    <Stack direction="row" spacing={1.5}>
      <Skeleton variant="rectangular" width={400} height={40} />
      <Skeleton variant="rectangular" width={180} height={40} />
    </Stack>
  );
};
const FreebiesFormDetails = ({ details, isFetching }) => {
  const { control, setValue } = useFormContext();
  const viewOnly = !!details;

  const { data: clientData, isFetching: isClientFetching } =
    useGetAllClientsQuery({
      RegistrationStatus: "Approved",
      PageSize: 2000,
    });

  useEffect(() => {
    if (details) {
      setValue(
        "client",
        clientData?.regularClient.find(
          (client) => client.id === details.client.clientId
        ) || null
      );
      setValue("transactionDate", moment(details.transactionDate));
    }
  }, [details, setValue, clientData]);

  if (isFetching || isClientFetching) {
    return <FreebiesFormDetailsSkeleton />;
  }
  return (
    <Stack direction="row" spacing={1.5}>
      <ControlledAutocomplete
        name="client"
        control={control}
        options={clientData?.regularClient || []}
        getOptionLabel={(option) =>
          option.businessName?.toUpperCase() +
            " " +
            option.businessAddress?.city?.toUpperCase() +
            ", " +
            option.businessAddress?.province?.toUpperCase() +
            " - " +
            option.ownersName?.toUpperCase() || ""
        }
        loading={isClientFetching}
        isOptionEqualToValue={() => true}
        disabled={viewOnly}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            placeholder="Business Name - Owner's Name"
            sx={{ width: "500px" }}
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

export default FreebiesFormDetails;
