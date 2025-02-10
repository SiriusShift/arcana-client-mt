import { Autocomplete, Box, Button, TextField } from "@mui/material";
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
  useGetCheckInFiloReportsQuery
} from "../../features/reports/api/reportsApi";
import { useGetAllClientsQuery } from "../../features/registration/api/registrationApi";
import { useSelector } from "react-redux";
import CommonFilter from "../../components/CommonFilter";
import ControlledAutocomplete from "../../components/ControlledAutocomplete";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { reportsSchema, transferOutSchema } from "../../schema/schema";
import Report from "../../components/page-components/reports/SOAreport";
import { PDFDownloadLink } from "@react-pdf/renderer";
// import { setSelectedRow } from "../../features/misc/reducers/selectedRowSlice";
import { useDispatch } from "react-redux";
import { useGetAllListingFeeQuery, useGetListingFeeHistoryByClientIdQuery } from "../../features/listing-fee/api/listingFeeApi";
import { useGetAllReceivedOrdersQuery } from "../../features/inventory-management/api/receivingApi";
// import SOAReport from "../../utils/Excel"

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
    //Check in 
    ci: true,
    soa: true,
    //Listing Fee
    lf: true,
    //Checkin First in, Last out
    cf: true,
    rr: true,
  });
  const [page, setPage] = useState(0);
  const [client, setClient] = useState();
  const [search, setSearch] = useState("");
  const userDetails = useSelector((state) => state.login.userDetails);
  const presentDay = moment();
  // const selectedRowData = useSelector((state) => state.selectedRow.value);
  // const dispatch = useDispatch();

  const pesoArray = ["charges", "payment", "remainingBalance"];
  const dateTimeArray = ["timeIn", "timeOut", "transactionDate", "dateReceived"]; 

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

  // RTK Query

  const {
    data: listingFeeClients,
    error,
  } = useGetAllListingFeeQuery(
    {
      Search: search,
      Status: true,
      ListingFeeStatus: "Approved",
      PageSize: 10000,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: RegisteredClients } = useGetAllClientsQuery({
    RegistrationStatus: "Approved",
    PageSize: 10000,
  });
  const { data: cdoReportData, isFetching: cdoFetching } = useCDOReportsQuery(
    {
      PageNumber: page + 1,
      PageSize: rowsPerPage,
      DateFrom: moment(watch("dateFrom")).format("MM-DD-YYYY") || "",
      DateTo: moment(watch("dateTo")).format("MM-DD-YYYY") || "",
      clusterId: clusterId?.value || "",
    },
    { skip: isActive.cdo }
  );

  const { data: sjReportData, isFetching: sjFetching } = useSJReportsQuery(
    {
      PageNumber: page + 1,
      PageSize: rowsPerPage,
      DateFrom: moment(watch("dateFrom")).format("MM-DD-YYYY") || "",
      DateTo: moment(watch("dateTo")).format("MM-DD-YYYY") || "",
      clusterId: clusterId?.value || "",
    },
    { skip: isActive.sj }
  );

  const { data: asReportData, isFetching: asFetching } = useASReportsQuery(
    {
      PageNumber: page + 1,
      PageSize: rowsPerPage,
      DateFrom: moment(watch("dateFrom")).format("MM-DD-YYYY") || "",
      DateTo: moment(watch("dateTo")).format("MM-DD-YYYY") || "",
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
        PageNumber: page + 1,
        PageSize: rowsPerPage,
        DateFrom: moment(watch("dateFrom")).format("MM-DD-YYYY") || "",
        DateTo: moment(watch("dateTo")).format("MM-DD-YYYY") || "",
        clusterId: clusterId?.value || "",
      },
      { skip: isActive.ci }
    );

  const { data: soaReportData, isFetching: soaFetching } =
    useGetSOAReportsQuery(
      {
        ClientId: watch("clientId")?.id,
        DateTo: moment(watch("dateTo")).format("YYYY-MM-DD") || "",
      },
      {
        skip: isActive.soa,
      }
    );
  
    const { data: listingFeeReportData, isFetching: listingFeeFetching } =
    useGetListingFeeHistoryByClientIdQuery({
      ClientId: watch("clientId")?.id || watch("clientId")?.clientId,
    }, {
      skip: isActive.lf,
    });

    const { data: checkInFiloReportData, isFetching: checkInFiloFetching } =
    useGetCheckInFiloReportsQuery({
      PageNumber: page + 1,
      PageSize: rowsPerPage,
      ClusterId: clusterId?.value || "",
      DateFrom: moment(watch("dateFrom")).format("YYYY-MM-DD") || "",
      DateTo: moment(watch("dateTo")).format("YYYY-MM-DD") || "",
    }, {
      skip: isActive.cf
    })

    let { data: receivingReportData, isFetching: receivingFetching } = useGetAllReceivedOrdersQuery({
      Search: search,
      PageNumber: page + 1,
      DateFrom: moment(watch("dateFrom")).format("YYYY-MM-DD") || "",
      DateTo: moment(watch("dateTo")).format("YYYY-MM-DD") || "",
      PageSize: rowsPerPage,
      clusterId: clusterId?.value || "",
    }, {
      skip: isActive.rr
    });

  //functions
  const handleSubmitDate = () => {
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
          activeReport?.value
        }-reports?DateFrom=${moment(watch("dateFrom")).format(
          "MM-DD-YYYY"
        )}&DateTo=${moment(watch("dateTo")).format("MM-DD-YYYY")}${
          clusterId ? `&clusterId=${clusterId?.value}` : ""
        }${watch("clientId")?.id || watch("clientId")?.clientId ? `&clientId=${watch("clientId")?.id || watch("clientId")?.clientId}` : ""}`,
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
        `${activeReport.value}_Reports_${moment(watch("dateFrom")).format(
          "YYYYMMDD"
        )}_${moment(watch("dateTo")).format("YYYYMMDD")}.xlsx`
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
    receivingReportData = {
      ...receivingReportData,
      value: {
        ...receivingReportData?.value,
        mo: receivingReportData?.value?.mo?.map(({ moveItems, ...rest }) => rest) || []
      }
    }
  }, [receivingReportData])
  useEffect(() => {
    const reports = [
      cdoReportData,
      sjReportData,
      asReportData,
      // priceModeReportData,
      checkInReportData,
      soaReportData,
      listingFeeReportData,
      checkInFiloReportData,
      receivingReportData
    ];
    const keys = [
      "cdo",
      "sj",
      "as",
      "ci",
      "soa",
      "lf",
      "cf",
      "rr"
      // 'pm',/
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
    soaReportData,
    listingFeeReportData,
    checkInFiloReportData,
    receivingReportData,
    // priceModeReportData,
    watch("dateFrom"),
    watch("dateTo"),
  ]);

  // useEffect(() => {
  //   if(soaReportData?.value?.pendingSoa.length > 0){
  //     dispatch(setSelectedRow(soaReportData?.value));
  //   }
  // }, [soaReportData]);

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
    [
      "deliveryDate",
      "invoiceNo",
      "aging",
      "charges",
      "taxWithheld",
      "payment",
      "remainingBalance",
      "remarks",
    ],
    [
      "paymentType",
      "amount",
      "createdDate",
      "transactedBy",
    ],
    [
      "user",
      "timeIn",
      "timeOut",
      "duration",
    ]
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
    [
      "Delivery Date",
      "Invoice Number",
      "Aging",
      "Charges",
      "Tax Withheld",
      "Payment",
      "Remaining Balance",
      "Remarks",
    ],
    [
      "Payment Type",
      "Amount",
      "Created Date",
      "Transacted By",
    ],
    [
      "User",
      "Time In",
      "Time Out",
      "Duration",
    ],
    // [
    //   "Move Order ID",
    //   "Date Received",
    //   "Details",
    //   "Route",
    // ]
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
            setActiveArray([]);
            setValue("clientId", null);
            if (value?.value === "SOA") {
              setValue("dateFrom", null);
            } else {
              setValue("dateFrom", moment());
            }
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
            (activeReport?.value !== "SOA" && activeReport?.value !== "listing-fee")&& (
              <CommonFilter filter={onFilter} clusterFilter />
            )}
          {activeReport?.value === "SOA" ||
            activeReport?.value === "listing-fee" ? (
              <ControlledAutocomplete
                name="clientId"
                control={control}
                options={activeReport?.value === "listing-fee" ? listingFeeClients?.listingFees : RegisteredClients?.regularClient || []}
                getOptionLabel={(option) =>
                  option?.businessName?.toUpperCase() +
                  " - " +
                  (option?.ownersName || option?.clientName) +
                  " - " +
                  String(option?.id || option?.clientId)
                }
                disableClearable
                isOptionEqualToValue={() => true}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    label="Business Name"
                    sx={{ width: "200px" }}
                    helperText={errors?.clientId?.message}
                    error={errors?.clientId}
                  />
                )}
              />
            ) : ""}
          {activeReport?.value != "SOA" && (
            <>
              <Controller
                name="dateFrom"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      {...field}
                      maxDate={moment()}
                      label="Date From"
                      slotProps={{
                        textField: {
                          size: "small",
                        },
                      }}
                      sx={{ width: "150px" }}
                    />
                  </LocalizationProvider>
                )}
              />
            </>
          )}
          <Controller
            name="dateTo"
            control={control}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  minDate={watch("dateFrom")}
                  maxDate={moment()}
                  {...field}
                  label="Date To"
                  slotProps={{
                    textField: {
                      size: "small",
                    },
                  }}
                  sx={{ width: "150px" }}
                />
              </LocalizationProvider>
            )}
          />
          {activeReport?.value === "SOA" && !soaFetching ? (
            <PDFDownloadLink
              document={
                <Report
                  client={soaReportData?.value}
                  dateTo={watch("dateTo")}
                />
              }
              fileName="SOA.pdf"
            >
              <SecondaryButton
                disabled={
                  ((!watch("clientId") && !soaFetching) || (!watch("clientId") && !listingFeeFetching)) ||
                  activeArray?.pendingSoa || activeArray?.transactions < 1
                }
                size="medium"
                variant="contained"
              >
                <GetApp />
              </SecondaryButton>
            </PDFDownloadLink>
          ) : (
            <SecondaryButton
              size="medium"
              onClick={handleSubmitDate}
              sx={{ mr: "10px", height: "100%" }}
              disabled={
                !watch("dateFrom") ||
                !watch("dateTo") ||
                activeArray?.transactions < 1 ||
                activeArray?.checkIn < 1
              }
              // disabled={
              //   // isExportLoading ||
              //   _.isEqual(dateFrom, dateFromTemp) && _.isEqual(dateTo, dateToTemp)
              // }
            >
              <GetApp />
            </SecondaryButton>
          )}
        </Box>
      </Box>
      {cdoFetching ||
      sjFetching ||
      asFetching ||
      soaFetching ||
      // priceModeFetching ||
      checkInFetching || 
      listingFeeFetching || 
      checkInFiloFetching || 
      receivingFetching ? (
        <CommonTableSkeleton evenLesserCompact />
      ) : (
        <CommonTable
          lowerCompact
          moveNoDataUp
          pesoArray={pesoArray}
          mapData={
            activeArray?.transactions ||
            activeArray?.checkIn ||
            activeArray?.pendingSoa || 
            activeArray?.listingHistory || 
            activeArray?.result || 
            activeArray?.mo
          }
          tableHeads={tableHeads[activeReport?.index]}
          customOrderKeys={customOrderKeys[activeReport?.index]}
          includeActions={false}
          count={count}
          attachKey={"image"}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          dateTimeArray={dateTimeArray}
          page={page}
          setPage={setPage}
        />
      )}
    </Box>
  );
}

export default Reports;
