import {
  Box,
  Checkbox,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import "../assets/styles/common.styles.scss";
import SecondaryButton from "./SecondaryButton";
import { debounce } from "../utils/CustomFunctions";
import { Add } from "@mui/icons-material";
import { useGetAllUsersQuery } from "../features/user-management/api/userAccountApi";
import { useGetAllUserRolesQuery } from "../features/user-management/api/userRoleApi";

function PageHeaderFilterAdd({
  onOpen,
  pageTitle,
  setStatus,
  setSearch,
  removeAllItem,
  removeAdd,
  removeArchive,
  removeFilter,
  filterChoices,
  choiceLabel,
  choiceValue,
  setFilter,
  setUser,
}) {
  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

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

  const { data: userData, isFetching: userDataFetching } = useGetAllUsersQuery({
    UserRoleId: cdoRoleId,
    Page: 1,
    PageSize: 1000,
    Status: true,
    isMarketing: true,
  });

  console.log(userData);

  return (
    <Box sx={{ padding: "1px" }}>
      <Box component={Paper} className="pageHeader">
        <Box className="pageHeader__left">
          <Typography className="pageHeader__title">{pageTitle}</Typography>
          {!removeAdd && (
            <SecondaryButton
              className="addRowButtons"
              onClick={onOpen}
              endIcon={<Add />}
            >
              Add
            </SecondaryButton>
          )}
        </Box>
        <Box className="pageHeader__right">
          {!removeFilter && (
            <Select
              size="small"
              // select
              // label="Role"
              onChange={(e) =>
                setFilter && e.target.value === " "
                  ? setFilter("")
                  : setFilter(e.target.value)
              }
              defaultValue={removeAllItem ? 1 : " "}
            >
              {!removeAllItem && <MenuItem value=" ">All</MenuItem>}
              {filterChoices?.map((choice) => (
                <MenuItem key={choice.id} value={choice[choiceValue]}>
                  {choice[choiceLabel]}
                </MenuItem>
              ))}
            </Select>
          )}
          
          {!removeArchive && (
            <>
              <Checkbox
                onChange={() => {
                  setStatus((prev) => !prev);
                }}
              />
              <Typography variant="subtitle2">Archived</Typography>{" "}
            </>
          )}
          <TextField
            type="search"
            size="small"
            label="Search"
            onChange={(e) => {
              debouncedSetSearch(e.target.value);
            }}
            autoComplete="off"
          />
        </Box>
      </Box>
    </Box>
  );
}

export default PageHeaderFilterAdd;
