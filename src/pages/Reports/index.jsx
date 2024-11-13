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
  useGetCheckInReportsQuery,
  useGetSOAReportsQuery,
} from "../../features/reports/api/reportsApi";
import { useGetAllClientsQuery } from "../../features/registration/api/registrationApi";
import { useSelector } from "react-redux";
import CommonFilter from "../../components/CommonFilter";
import ControlledAutocomplete from "../../components/ControlledAutocomplete";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { reportsSchema } from "../../schema/schema";

function Reports() {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [activeReport, setActiveReport] = useState();
  const [activeArray, setActiveArray] = useState();
  const [clusterId, setClusterId] = useState();
  const [isActive, setIsActive] = useState({
    cdo: true,
    sj: true,
    as: true,
    // pm: true,
    ci: true,
  });
  const [dateFromTemp, setDateFromTemp] = useState(moment());
  const [dateToTemp, setDateToTemp] = useState(moment());
  const [page, setPage] = useState(0);
  const [client, setClient] = useState();
  const [search, setSearch] = useState("");
  const userDetails = useSelector((state) => state.login.userDetails);
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const {
    handleSubmit,
    formState: { isValid, isDirty, errors },
    setValue,
    reset,
    control,
    watch,
  } = useForm({
    resolver: yupResolver(reportsSchema.schema),
    mode: "onChange",
    defaultValues: reportsSchema.defaultValues,
  });

  console.log(watch());

  console.log("date from : ", dateFromTemp, dateToTemp);
  console.log(activeArray);

  // RTK Query

  const { data: RegisteredClients } = useGetAllClientsQuery({
    RegistrationStatus: "Approved",
  });
  const { data: cdoReportData, isFetching: cdoFetching } = useCDOReportsQuery(
    {
      Page: page + 1,
      PageSize: rowsPerPage,
      DateFrom: moment(dateFromTemp).format("MM-DD-YYYY") || "",
      DateTo: moment(dateToTemp).format("MM-DD-YYYY") || "",
      clusterId: clusterId?.value || "",
    },
    { skip: isActive.cdo }
  );

  const { data: sjReportData, isFetching: sjFetching } = useSJReportsQuery(
    {
      Page: page + 1,
      PageSize: rowsPerPage,
      DateFrom: moment(dateFromTemp).format("MM-DD-YYYY") || "",
      DateTo: moment(dateToTemp).format("MM-DD-YYYY") || "",
      clusterId: clusterId?.value || "",
    },
    { skip: isActive.sj }
  );

  const { data: asReportData, isFetching: asFetching } = useASReportsQuery(
    {
      Page: page + 1,
      PageSize: rowsPerPage,
      DateFrom: moment(dateFromTemp).format("MM-DD-YYYY") || "",
      DateTo: moment(dateToTemp).format("MM-DD-YYYY") || "",
      clusterId: clusterId?.value || "",
    },
    { skip: isActive.as }
  );

  // const { data: priceModeReportData, isFetching: priceModeFetching } =
  //   usePriceModeReportQuery({
  //     Page: page + 1,
  //     PageSize: rowsPerPage,
  //   }, {skip: isActive.pm});

  const { data: checkInReportData, isFetching: checkInFetching } =
    useGetCheckInReportsQuery(
      {
        Page: page + 1,
        PageSize: rowsPerPage,
        DateFrom: moment(dateFromTemp).format("MM-DD-YYYY") || "",
        DateTo: moment(dateToTemp).format("MM-DD-YYYY") || "",
        clusterId: clusterId?.value || "",
      },
      { skip: isActive.ci }
    );

  const { data: soaReportData, isFetching: soaFetching } =
    useGetSOAReportsQuery({
      ClientId: client?.id,
    });
  //functions
  const handleSubmitDate = () => {
    setDateFrom(dateFromTemp);
    setDateTo(dateToTemp);
    useDownloadExcel();
  };

  const onFilter = async ({ clusterId }) => {
    try {
      setClusterId(clusterId);
    } catch (error) {
      console.log(error);
    }
  };

  const useDownloadExcel = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASEURL}${
          activeReport.value
        }-reports?DateFrom=${moment(dateFromTemp).format(
          "MM-DD-YYYY"
        )}&DateTo=${moment(dateToTemp).format("MM-DD-YYYY")}&ClusterId=${
          clusterId?.value
        }`,
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
    const reports = [
      cdoReportData,
      sjReportData,
      asReportData,
      // priceModeReportData,
      checkInReportData,
    ];
    const keys = [
      "cdo",
      "sj",
      "as",
      "ci",
      // 'pm',
    ];

    if (activeReport?.index !== undefined) {
      console.log(reports[activeReport.index]?.value);
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
    checkInReportData,
    // priceModeReportData,
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
    [
      "date",
      "businessName",
      "businessAddress",
      "invoiceNo",
      "amount",
      "debit",
      "credit",
      "cluster",
    ],
    [
      "date",
      "businessName",
      "customerName",
      "invoiceNo",
      "grossSales",
      "netSales",
      "cluster",
    ],
    [
      "createdBy",
      "createdDate",
      "businessName",
      "fullName",
      "barangay",
      "city",
      "province",
      "latitude",
      "longitude",
      "image",
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
    [
      "Date",
      "Business Name",
      "Business Address",
      "Invoice Number",
      "Amount",
      "Debit",
      "Credit",
      "Cluster",
    ],
    [
      "Date",
      "Business Name",
      "Business Owner",
      "Invoice Number",
      "Gross Sales",
      "Net Sales",
      "Cluster",
    ],
    [
      "CDO",
      "Date",
      "Business Name",
      "Full Name",
      "Barangay",
      "City",
      "Province",
      "Latitude",
      "Longitude",
      "Image",
    ],
  ];

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
          {(userDetails?.roleName === "Admin" ||
            userDetails?.roleName === "Treasury" ||
            userDetails?.roleName === "GAS" ||
            userDetails?.roleName === "Finance") &&
          activeReport?.value !== "SOA" ? (
            <CommonFilter filter={onFilter} clusterFilter />
          ) : (
            <ControlledAutocomplete
              name="clientId"
              control={control}
              options={RegisteredClients?.regularClient}
              getOptionLabel={(option) =>
                option?.businessName?.toUpperCase() +
                " - " +
                option?.ownersName +
                " - " +
                String(option?.id)
              }
              disableClearable
              isOptionEqualToValue={() => true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="Business Name"
                  sx={{ width: "250px" }}
                  helperText={errors?.clientId?.message}
                  error={errors?.clientId}
                />
              )}
            />
          )}
          {activeReport?.value != "SOA" && (
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                label="Date From"
                value={dateFromTemp}
                onChange={() => {
                  setValue("dateFrom", dateFromTemp);
                }}
                slotProps={{
                  textField: {
                    size: "small",
                  },
                }}
                sx={{ width: "200px" }}
                maxDate={dateToTemp}
              />
            </LocalizationProvider>
          )}

          <Controller
            name="dateTo"
            control={control}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  {...field}
                  label="Date To"
                  slotProps={{
                    textField: {
                      size: "small",
                    },
                  }}
                  sx={{ width: "200px" }}
                  minDate={dateFromTemp} // Make sure dateFromTemp is in the correct format
                />
              </LocalizationProvider>
            )}
          />

          <SecondaryButton
            size="medium"
            onClick={handleSubmitDate}
            sx={{ mr: "10px", height: "100%" }}
            // disabled={
            //   // isExportLoading ||
            //   _.isEqual(dateFrom, dateFromTemp) && _.isEqual(dateTo, dateToTemp)
            // }
          >
            <GetApp />
          </SecondaryButton>
        </Box>
      </Box>
      {cdoFetching ||
      sjFetching ||
      asFetching ||
      // priceModeFetching ||
      checkInFetching ? (
        <CommonTableSkeleton evenLesserCompact />
      ) : (
        <CommonTable
          lowerCompact
          moveNoDataUp
          mapData={activeArray?.transactions || activeArray?.checkIn}
          tableHeads={tableHeads[activeReport?.index]}
          customOrderKeys={customOrderKeys[activeReport?.index]}
          includeActions={false}
          count={count}
          attachKey={"image"}
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
