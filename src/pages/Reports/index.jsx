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
import { decryptString } from "../../utils/CustomFunctions";

function InventoryMRP() {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [activeReport, setActiveReport] = useState();
  const [dateFrom, setDateFrom] = useState(moment());
  const [dateTo, setDateTo] = useState(moment());
  const [dateFromTemp, setDateFromTemp] = useState(moment());
  const [dateToTemp, setDateToTemp] = useState(moment());
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

  // RTK Query

  //functions
  const handleSubmitDate = () => {
    setDateFrom(dateFromTemp);
    setDateTo(dateToTemp);
    useDownloadExcel();
  };

  const useDownloadExcel = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BASEURL
        }CDO-reports?DateFrom=${moment(dateFromTemp).format(
          "MM-DD-YYYY"
        )}&DateTo=${moment(dateToTemp).format("MM-DD-YYYY")}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Accept: " application/json",
            Authorization: `Bearer ${decryptString(
              sessionStorage.getItem("token")
            )}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to download Excel file.");
      }
      console.log(response);
      const blob = await response.blob();
      const link = document.createElement("a");
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.setAttribute(
        "download",
        `${activeReport.value}_Reports_${moment(dateFromTemp).format(
          "YYYYMMDD"
        )}_${moment(dateToTemp).format("YYYYMMDD")}.xlsx`
      );
      document.body.appendChild(link);
      link.click();

      // Clean up and revoke the object URL
      link.parentNode.removeChild(link);
      // const link = document.createElement("a");
      // link.href = response.url;
      // link.click();
      // link.remove();
    } catch (error) {
      console.error("Error while downloading Excel file:", error);
    }
  };

  // CommonTable Props
  //Constants
  const customOrderKeys = [
    [
      "dateOrig",
      "siNo",
      "itemCode",
      "newItemCode",
      "qty",
      "percentDiscount",
      "unitPrice",
      "amount"
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
      "Date Orig",
      "SI No",
      "Item Code",
      "New Item Code",
      "Qty",
      "% Discount",
      "Unit Price",
      "Amount"
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
            setActiveReport(value);
          }}
          value={activeReport}
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
      {/* {activeReport ? (
        <CommonTableSkeleton evenLesserCompact />
      ) : (
        <CommonTable
        lowerCompact
          moveNoDataUp
          mapData={data?.inventoryMrp}
          tableHeads={tableHeads[activeReport?.index]}
          customOrderKeys={customOrderKeys[activeReport?.index]}
          includeActions={false}
          count={data?.totalCount || 0}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          page={page}
          setPage={setPage}
        />
      )} */}
    </Box>
  );
}

export default InventoryMRP;
