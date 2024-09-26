import { Autocomplete, Box, TextField } from "@mui/material";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import { reportNames } from "../../utils/constants";
import { useEffect, useState } from "react";
import { useGetInventoryMrpQuery } from "../../features/inventory-management/api/inventoryMrpApi";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import SecondaryButton from "../../components/SecondaryButton";
import _ from "lodash";
import { GetApp } from "@mui/icons-material";

function InventoryMRP() {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [activeReport, setActiveReport] = useState(0);
  const [dateFrom, setDateFrom] = useState(moment());
  const [dateTo, setDateTo] = useState(moment());
  const [dateFromTemp, setDateFromTemp] = useState(moment());
  const [dateToTemp, setDateToTemp] = useState(moment());
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

  console.log(activeReport);

  // RTK Query
  const { data, isFetching } = useGetInventoryMrpQuery({
    Page: page + 1,
    PageSize: rowsPerPage,
    Search: search,
  });

  //functions
  const handleSubmitDate = () => {
    setDateFrom(dateFromTemp);
    setDateTo(dateToTemp);
    useDownloadExcel();
  };

  // CommonTable Props
  //Constants
  const customOrderKeys = [
    [
      "comment",
      "year",
      "yearOld",
      "remarks",
      "monthOrig",
      "dateOrig",
      "outletCode",
      // "SI No",
      // "Item Code",
      // "New Item Code",
      // "Qty",
      // "% Discount",
      // "Unit Price",
      // "Amount",
      // "Discounted Price",
      // "Discounted Amount",
      // "Discount",
      // "Item Description Orig",
      // "Item Description New",
      // "Outlet",
      // "Province",
      // "Area",
      // "Customer Type",
      // "Channel",
      // "Status",
      // "Region",
      // "Region Old",
      // "Weekly",
      // "Month",
      // "Date",
      // "Conversion Orig",
      // "Conversion New",
      // "Volume",
      // "Revenue",
      // "Qty Orig",
      // "Qty New",
      // "Remarks",
      // "Yhiel Remarks",
      // "Nhel Remarks Discount",
      // "Yhiel Remarks New",
      // "Store Remarks",
      // "Store from MT",
      // "SI",
      // "Checking Vol",
      // "Vol Check"
    ],
    [
      "siNo",
      "itemCode",
      "newItemCode",
      "qty",
      "percentDiscount",
      "unitPrice",
      "amount",
    ],
  ];

  const tableHeads = [
    [
      "Comment",
      "Year",
      "Year Old",
      "Remarks",
      "Month Orig",
      "Date Orig",
      "Outlet Code",
    ],
    [
      "SI No",
      "Item Code",
      "New Item Code",
      "Qty",
      "% Discount",
      "Unit Price",
      "Amount",
    ],
  ];

  // UseEffect
  useEffect(() => {
    setPage(0);
  }, [search, rowsPerPage]);

  return (
    <Box className="commonPageLayout" sx={{gap: "0px"}}>
      <PageHeaderAdd pageTitle="Reports" removeArchive removeAdd removeSearch />
      <Box className="mixin">
        <Autocomplete
          options={reportNames}
          getOptionLabel={(option) => option?.label}
          onChange={(_, value) => {
            setActiveReport(value.value);
          }}
          value={activeReport.value}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              sx={{ width: "250px"}}
              label="Report Name"
            />
          )}
        />
        <Box className="mixin__right">
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              label="Date From"
              value={dateFromTemp}
              onChange={setDateFromTemp}
              slotProps={{
                textField: {
                  size: "small",
                },
              }}
              sx={{ width: "200px" }}
              maxDate={dateToTemp}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              label="Date To"
              value={dateToTemp}
              onChange={setDateToTemp}
              slotProps={{
                textField: {
                  size: "small",
                },
              }}
              sx={{ width: "200px" }}
              minDate={dateFromTemp}
            />
          </LocalizationProvider>

          <SecondaryButton
            size="medium"
            onClick={handleSubmitDate}
            sx={{ mr: "10px", height: "100%" }}
            disabled={
              // isExportLoading ||
              _.isEqual(dateFrom, dateFromTemp) && _.isEqual(dateTo, dateToTemp)
            }
          >
            <GetApp />
          </SecondaryButton>
        </Box>
      </Box>
      {isFetching ? (
        <CommonTableSkeleton evenLesserCompact />
      ) : (
        <CommonTable
        lowerCompact
          moveNoDataUp
          mapData={data?.inventoryMrp}
          tableHeads={tableHeads[activeReport]}
          customOrderKeys={customOrderKeys[activeReport]}
          includeActions={false}
          count={data?.totalCount || 0}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          page={page}
          setPage={setPage}
        />
      )}
    </Box>
  );
}

export default InventoryMRP;
