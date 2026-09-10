import { Box, TextField, debounce } from "@mui/material";

function SearchFilterMixin({ setSearch, selectOptions, setSelectValue, removeOrigin }) {
  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  return (
    // <Paper elevation={1}>
    <Box className="mixin" sx={{ my: "-20px" }}>
      <Box className="mixin__left">
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
    // </Paper>
  );
}

export default SearchFilterMixin;
