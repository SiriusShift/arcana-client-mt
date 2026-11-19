import {
  Autocomplete,
  InputAdornment,
  Skeleton,
  TextField,
  createFilterOptions,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { useSelector } from "react-redux";
import { useGetAllDistributionQuery } from "../../../../features/setup/api/distributionApi";
import { useGetTerritoryQuery } from "../../../../features/setup/api/territoryApi";
import { useGetChargingQuery } from "../../../../features/user-management/api/oneChargingApi";
import { useLazyGetAllEmployeesQuery } from "../../../../features/user-management/api/sedarApi";
import { useGetAllUserRolesQuery } from "../../../../features/user-management/api/userRoleApi";
import CommonDrawer from "../../../CommonDrawer";
import ControlledAutocomplete from "../../../ControlledAutocomplete";
import ControlledAutocompleteMultiple from "../../../ControlledAutocompleteMultiple";
import useUserForm from "./useUserForm.hooks";

const UserDrawer = ({ editMode, approveMode, ...props }) => {
  const { onClose, open } = props;
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [inputValue, setInputValue] = useState("")

  // States
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  // RTK Query: Autocomplete Datas
  const { data: userRoleData, isLoading: isUserRoleLoading } = useGetAllUserRolesQuery({
    Status: true,
    PageSize: 1000,
  });
  const { data: chargingData, isFetching: chargingFetching } = useGetChargingQuery()

  const [triggerSedar, { data: sedarData = [] }] =
    useLazyGetAllEmployeesQuery();
  const { data: clusterData, isLoading: isClusterLoading } =
    useGetTerritoryQuery({ Status: true, PageSize: 1000 });
  const { data: distributionType, isLoading: isDistributionLoading } = useGetAllDistributionQuery({
    isActive: true,
    PageNumber: 1,
    PageSize: 10000,
  })

  // Form Hook
  const {
    handleSubmit,
    control,
    errors,
    isValid,
    watch,
    onSubmit,
    setValue,
    isAddUserLoading,
    isEditUserLoading,
  } = useUserForm({
    editMode,
    setSelectedEmployee,
    selectedRowData,
    sedarData,
    approveMode,
    userRoleData,
    chargingData,
    clusterData,
    distributionType,
    onClose,
    open,
  });



  const employee = watch("fullIdNo")
  const userRole = watch("userRoleId");


  const filterOptions = useMemo(() =>
    createFilterOptions({
      matchFrom: "any",
      limit: 50,
    }), []
  );


  const FieldSkeleton = ({ loading, children }) => {
    if (loading) return <Skeleton sx={{ width: "100%", height: 42 }} />;
    return children;
  };

  useEffect(() => {
    triggerSedar({
      search: "RDFFLFI"
    })
  }, [])

  useEffect(() => {
    if (inputValue === "") return;
    const delay = setTimeout(() => {
      triggerSedar({ search: inputValue });
    }, 500);
    return () => clearTimeout(delay);
  }, [inputValue]);

  return (
    <CommonDrawer
      {...props}
      drawerHeader={(!editMode ? "Add" : "Edit") + " User Account"}
      onSubmit={handleSubmit(onSubmit)}
      disableSubmit={
        userRole?.roleName === "TDO"
          ? !isValid || !watch("territoryId")
          : !isValid
      }
      isLoading={!editMode ? isAddUserLoading : isEditUserLoading}
    >
      {!editMode && !approveMode ? (
        <Controller
          name="fullIdNo"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Autocomplete
              clearOnBlur
              disableClearable
              options={sedarData}
              inputValue={inputValue}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue)
              }}
              filterOptions={filterOptions}
              value={selectedEmployee}
              getOptionLabel={(option) =>
                option.general_info.full_id_number_full_name
              }
              isOptionEqualToValue={(option, value) =>
                option.general_info.full_id_number === value?.general_info?.full_id_number
              }
              onChange={(_, emp) => {
                if (!emp) return;

                const generateUsername = (firstName, lastName) =>
                  firstName
                    .split(" ")
                    .map((i) => i.charAt(0))
                    .join("")
                    .toLowerCase() +
                  lastName.replace(/\s/g, "").toLowerCase();

                setSelectedEmployee(emp); // <-- store object locally

                // Set form values
                setValue("fullIdNo", emp.general_info.full_id_number);
                setValue("fullname", emp.general_info.full_name);
                setValue("location", emp.unit_info.location_name);
                setValue("department", emp.unit_info.department_name);
                setValue("company", emp.unit_info.company_name);
                const username = generateUsername(
                  emp.general_info.first_name,
                  emp.general_info.last_name
                );
                setValue("username", username);
                setValue("password", username);

                onChange(emp.general_info.full_id_number); // RHF
              }}
              renderInput={(params) => (
                <TextField {...params} size="small" label="Employee ID" />
              )}
            />
          )}
        />

      ) : (
        <TextField
          label="Employee ID"
          size="small"
          disabled
          value={employee}
        />
      )}

      <Controller
        control={control}
        name={"fullname"}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <TextField
            disabled
            size="small"
            label="Full Name"
            autoComplete="off"
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            inputRef={ref}
          />
        )}
      />


      <Controller
        control={control}
        name={"username"}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <TextField
            size="small"
            label="Username"
            disabled={editMode}
            autoComplete="off"
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            inputRef={ref}
          />
        )}
      />


      <Controller
        control={control}
        name="mobileNumber"
        render={({ field: { onChange, onBlur, value, ref } }) => {
          const formattedValue = value?.replace(/-/g, "");
          let format = "";

          if (formattedValue?.length <= 3) {
            format = "####";
          } else if (formattedValue?.length <= 6) {
            format = "###-####";
          } else if (formattedValue?.length <= 10) {
            format = "###-###-####";
          }

          return (
            <PatternFormat
              format={format}
              label="Phone Number"
              type="tel"
              size="small"
              customInput={TextField}
              autoComplete="off"
              getInputRef={ref}
              onValueChange={(e) => {
                onChange(e.value);
              }}
              onBlur={onBlur}
              value={value || ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">+63</InputAdornment>
                ),
              }}
              helperText={errors?.mobileNumber?.message}
              error={!!errors?.mobileNumber}
            />
          );
        }}
      />

      <FieldSkeleton loading={isUserRoleLoading}>
        <ControlledAutocomplete
          name={"userRoleId"}
          control={control}
          options={userRoleData?.userRoles || []}
          getOptionLabel={(option) => option.roleName}
          disableClearable
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label="User Role"
              helperText={errors?.userRoleId?.message}
              error={errors?.userRoleId}
            />
          )}
        />
      </FieldSkeleton>



      <FieldSkeleton loading={isClusterLoading}>
        {/* If role is CDO, require cluster selection */}
        {(userRole?.roleName === "TDO" || userRole?.roleName === "Head") && (
          <ControlledAutocompleteMultiple
            name={"territoryId"}
            control={control}
            options={clusterData?.territories || []}
            getOptionLabel={(option) => option.name}
            disableClearable
            loading={isClusterLoading}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                label="Territory"
                helperText={errors?.territoryId?.message}
                error={errors?.territoryId}
              />
            )}
          />
        )}
      </FieldSkeleton>

      <FieldSkeleton loading={isDistributionLoading}>
        {/* If role is CDO, require cluster selection */}
        {(userRole?.roleName === "Manager") && (
          <ControlledAutocompleteMultiple
            name={"distributionTypeId"}
            control={control}
            options={distributionType?.distributionTypes || []}
            getOptionLabel={(option) => option.name}
            disableClearable
            loading={isDistributionLoading}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                label="Distribution"
                helperText={errors?.distributionTypeId?.message}
                error={errors?.distributionTypeId}
              />
            )}
          />
        )}
      </FieldSkeleton>

      <FieldSkeleton loading={chargingFetching}>
        {(userRole?.roleName === "TDO" || userRole?.roleName === "Head" || userRole?.roleName === "Marketing") && (<Controller
          name="charging"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <Autocomplete
              options={chargingData}
              value={field.value}
              onChange={(event, newValue) => {
                field.onChange(newValue);
              }}
              getOptionLabel={(option) => `${option.code} - ${option.name}`}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="One Charging"
                  placeholder="Select Charging"
                />
              )}
            />
          )}
        />
        )}

      </FieldSkeleton>



    </CommonDrawer>
  );
};

export default UserDrawer;
