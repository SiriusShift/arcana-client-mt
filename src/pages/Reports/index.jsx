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
import {
  useCDOReportsQuery,
  useSJReportsQuery,
  useASReportsQuery,
  usePriceModeReportQuery,
} from "../../features/reports/api/reportsApi";

function Reports() {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [activeReport, setActiveReport] = useState();
  const [activeArray, setActiveArray]  = useState();
  const [isActive, setIsActive] = useState({
    cdo: true,
    sj: true,
    as: true,
    pm: true
})
  const [dateFrom, setDateFrom] = useState(moment());
  const [dateTo, setDateTo] = useState(moment());
  const [dateFromTemp, setDateFromTemp] = useState(moment());
  const [dateToTemp, setDateToTemp] = useState(moment());
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

  console.log("date from : ", dateFromTemp, dateToTemp)
  
  // RTK Query
  const { data: cdoReportData, isFetching: cdoFetching } =
    useCDOReportsQuery({
      Page: page + 1,
      PageSize: rowsPerPage,
      DateFrom: moment(dateFromTemp).format("MM-DD-YYYY") ||  "",
      DateTo: moment(dateToTemp).format("MM-DD-YYYY") || "",
    }, {skip: isActive.cdo});

  const { data: sjReportData, isFetching: sjFetching } = useSJReportsQuery({
    Page: page + 1,
    PageSize: rowsPerPage,
    DateFrom: moment(dateFromTemp).format("MM-DD-YYYY") ||  "",
    DateTo: moment(dateToTemp).format("MM-DD-YYYY") || "",
  }, {skip: isActive.sj});

  const { data: asReportData, isFetching: asFetching } = useASReportsQuery({
    Page: page + 1,
    PageSize: rowsPerPage,
    DateFrom: moment(dateFromTemp).format("MM-DD-YYYY") ||  "",
    DateTo: moment(dateToTemp).format("MM-DD-YYYY") || "",
  }, {skip: isActive.as});

  const { data: priceModeReportData, isFetching: priceModeFetching } =
    usePriceModeReportQuery({
      Page: page + 1,
      PageSize: rowsPerPage,
    }, {skip: isActive.pm});

  //functions
  const handleSubmitDate = () => {
    setDateFrom(dateFromTemp);
    setDateTo(dateToTemp);
    useDownloadExcel();
  };

  console.log(rowsPerPage);

  const useDownloadExcel = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASEURL}${
          activeReport.value
        }-reports?DateFrom=${moment(dateFromTemp).format(
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

  //useEffect()
  useEffect(() => {
    const reports = [cdoReportData, sjReportData, asReportData, priceModeReportData];
    const keys = ['cdo', 'sj', 'as', 'pm'];
  
    if (activeReport?.index !== undefined) {
      setActiveArray(reports[activeReport.index]?.value);
      
      const newIsActive = keys.reduce((acc, key, idx) => {
        acc[key] = idx !== activeReport.index;
        return acc;
      }, {});
      
      setIsActive(newIsActive);
    }
  }, [
    activeReport,
    cdoReportData,
    sjReportData,
    asReportData,
    priceModeReportData,
    dateFromTemp,
    dateToTemp,
  ]);

  useEffect(() => {
    if (activeArray) {
      setCount(setCount(activeArray?.totalCount));
    }
  }, [activeArray]);

  useEffect(() => {
    if (activeArray) {
      setCount(activeArray?.totalCount);
    }
  }, [activeArray]);

  useEffect(() => {
    setPage(0);
  }, [rowsPerPage, activeReport]);

  // CommonTable Props
  //Constants
  const customOrderKeys = [
    [
      "date",
      "invoiceNo",
      "itemDescription",
      "qty",
      "unitPrice",
      "amount",
      "outlet",
    ],
    
  ];

  const tableHeads = [
    [
      "Date",
      "Invoice Number",
      "Item Description",
      "Quantity",
      "Unit Price",
      "Amount",
      "Outlet",
    ],
  ];

  console.log("heads", customOrderKeys[activeReport?.index]);

  return (
    <Box className="commonPageLayout" sx={{ gap: "0px" }}>
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
              sx={{ width: "250px" }}
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
      {cdoFetching || sjFetching || asFetching || priceModeFetching ? (
        <CommonTableSkeleton evenLesserCompact />
      ) : (
        <CommonTable
          lowerCompact
          moveNoDataUp
          mapData={activeArray?.transactions}
          // tableHeads={tableHeads[activeReport?.index]}
          // customOrderKeys={customOrderKeys[activeReport?.index]}
          includeActions={false}
          count={count}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          page={page}
          setPage={setPage}
        />
      )}
    </Box>
  );
}

export default Reports;
