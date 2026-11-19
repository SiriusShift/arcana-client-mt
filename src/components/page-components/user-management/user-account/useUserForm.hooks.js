import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  usePostUserMutation,
  usePutUserMutation,
} from "../../../../features/user-management/api/userAccountApi";
import useSnackbar from "../../../../hooks/useSnackbar";
import { userAccountSchema } from "../../../../schema/schema";
import { handleCatchErrorMessage } from "../../../../utils/CustomFunctions";

const useUserForm = ({
  editMode,
  approveMode,
  selectedRowData,
  userRoleData,
  setSelectedEmployee,
  clusterData,
  chargingData,
  sedarData,
  distributionType,
  onClose,
  open,
}) => {
  const snackbar = useSnackbar();

  const {
    // React Hook Form: Form and Field State
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset,
    control,
  } = useForm({
    resolver: yupResolver(userAccountSchema.schema),
    mode: "onChange",
    defaultValues: userAccountSchema.defaultValues,
  });

  console.log(watch())
  const watchUserRole = watch("userRoleId");

  // RTK Query: User Operations
  const [postUser, { isLoading: isAddUserLoading }] = usePostUserMutation();
  const [putUser, { isLoading: isEditUserLoading }] = usePutUserMutation();

  const onSubmit = async (data) => {
    const {
      userRoleId: { id, roleName },
      territoryId,
      charging,
      distributionTypeId,
      ...restData
    } = data;

    // Only Managers have a distribution type
    const distributionPayload =
      roleName === "Manager"
        ? { distributionTypeId: distributionTypeId?.id }
        : {};

    try {
      if (!editMode) {
        await postUser({
          ...restData,
          userRoleId: id,
          territoryId: territoryId?.id,
          chargingId: charging?.id,
          ...distributionPayload,
          // charingCode: charging?.code,
          // chargingName: charging?.name

        }).unwrap();

        snackbar({
          message: "User Account added successfully",
          variant: "success",
        });
      } else if (editMode) {
        await putUser({
          ...restData,
          userRoleId: id,
          territoryId: territoryId?.id,
          chargingId: charging?.id,
          ...distributionPayload,

        }).unwrap();
        snackbar({
          message: "User Account updated successfully",
          variant: "success",
        });
      }

      onClose();
      reset();
    } catch (error) {
      snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
    }
  };
  useEffect(() => {
    if (!open) {
      reset();
      setSelectedEmployee(null);
    }
    if (
      editMode &&
      selectedRowData &&
      clusterData?.territories &&
      userRoleData?.userRoles &&
      open
    ) {
      setValue("id", selectedRowData.id);
      setValue("fullIdNo", selectedRowData.fullIdNo);
      setValue("fullname", selectedRowData.fullname);
      setValue("username", selectedRowData.username);

      setValue(
        "userRoleId",
        userRoleData.userRoles.find(
          (item) => item.roleName === selectedRowData.roleName,
        ),
      );

      console.log(selectedRowData.roleName)
      const territoryId = selectedRowData.roleName === "TDO" || selectedRowData.roleName === "Head" ? selectedRowData.territoryId : selectedRowData.territoryIdX

      const selectedCluster = clusterData.territories.find(
        (item) => item.id === territoryId,
      );
      setValue("territoryId", selectedCluster);

      const distributionId = selectedRowData.distributionTypeId
      const selectedDistribution = distributionType.distributionTypes.find(
        (item) => item.id === distributionId,
      );
      setValue("distributionTypeId", selectedDistribution);

      setValue("mobileNumber", selectedRowData.mobileNumber);
      const selectedCharging = chargingData.find((item) => item.code === selectedRowData.chargingCode);
      setValue("charging", selectedCharging)
    } else if (
      approveMode &&
      selectedRowData &&
      sedarData?.length &&
      clusterData?.territories &&
      userRoleData?.userRoles &&
      open
    ) {
      console.log("test");
      const generateUsername = (firstName, lastName) => {
        var part1 = firstName
          .split(" ")
          .map((i) => i.charAt(0))
          .join("")
          .toLowerCase();
        var part2 = lastName.replace(/\s/g, "").toLowerCase();
        return part1 + part2;
      };
      const user = sedarData?.find(
        (item) =>
          item.general_info.full_id_number === selectedRowData?.fullIdNo,
      );
      console.log(user, "user!");

      setSelectedEmployee(user);

      setValue("fullIdNo", user?.general_info?.full_id_number);
      setValue("fullname", user?.general_info?.full_name);
      setValue("location", user?.unit_info?.location_name);
      setValue("department", user?.unit_info?.department_name);
      setValue("company", user?.unit_info?.company_name);
      setValue(
        "username",
        generateUsername(
          user?.general_info?.first_name,
          user?.general_info?.last_name,
        ),
      );

      //Initial password is same as the username
      setValue(
        "password",
        generateUsername(
          user?.general_info?.first_name,
          user?.general_info?.last_name,
        ),
      );
    }
  }, [
    editMode,
    selectedRowData,
    userRoleData,
    clusterData,
    JSON.stringify(sedarData),
    open,
  ]);
  useEffect(() => {
    if (
      watchUserRole?.roleName !== "TDO" &&
      watchUserRole?.roleName !== "Head"
    ) {
      setValue("territoryId", null);
      setValue("charging", null);
    }
  }, [watchUserRole, setValue]);

  // useEffect(() => {
  //   if (!open) {
  //     reset();
  //   }
  // }, [open, reset]);

  return {
    handleSubmit,
    control,
    errors,
    isValid,
    watchUserRole,
    onSubmit,
    setValue,
    watch,
    isAddUserLoading,
    isEditUserLoading,
  };
};

export default useUserForm;
