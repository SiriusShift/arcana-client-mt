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
  useGetCheckInFiloReportsQuery,
  useGetVoidTransactionsReportsQuery,
  useGetFreebieReportsQuery,
  useGetSamplingReportsQuery,
  useGetReturnReportsQuery,
  useGetReplaceReportsQuery,
  useGetPaymentReportsQuery,
  useGetMrpRollbackReportsQuery,
  useGetCashReceiptReportsQuery,
  useGetInventoriablesReportsQuery,
  useGetSalesGTReportsQuery,
  useGetReturnToDepotReportsQuery,
  useGetInventoryMovementReportsQuery,
  useGetInventoryTransactionsHistoryReportsQuery,
  useGetReturnSamplingReportsQuery,
  useGetInventoryAdjustmentReportsQuery,
  useGetMiscReceiptReportsQuery,
  useGetMiscIssueReportsQuery,
  useGetConsolidatedReportsQuery,
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
import {
  useGetAllListingFeeQuery,
  useGetListingFeeHistoryByClientIdQuery,
} from "../../features/listing-fee/api/listingFeeApi";
import { useGetAllReceivedOrdersQuery } from "../../features/inventory-management/api/receivingApi";
import { useGetAllTransferOutsQuery } from "../../features/inventory-management/api/transferOutApi";
import SOAPDFDownload from "./PDFDownload";
import useSnackbar from "../../hooks/useSnackbar";
import ExportExcel from "../../utils/Excel";
// import SOAReport from "../../utils/Excel"

function Reports() {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [activeReport, setActiveReport] = useState();
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeArray, setActiveArray] = useState();
  const [clusterId, setClusterId] = useState();
  const [userId, setUserId] = useState();
  const [userType, setUserType] = useState();
  console.log("Test", clusterId);
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
    //Receiving Reports
    rr: true,
    //Return By Cdo
    rtd: true,
    //transfer out
    tor: true,
    //transfer in
    tir: true,
    //freebie
    freebie: true,
    //sampling
    sampling: true,
    //return
    return: true,
    //replace
    replace: true,
    //Void Transactions Report
    vtr: true,
    //Payment Reports
    pr: true,
    //Rollback Reports
    mrr: true,
    //GL Cash Receipt
    glcr: true,
    //GL Inventoriables
    gli: true,
    //GL Sales GT
    glgt: true,
    //Inventory Movement
    im: true,
    // Inventory Transaction History
    ith: true,
    //RETURN SAMPLING
    rs: true,
    //INVENTORY ADJUSTMENT
    ia: true,
    //Misc Receipt
    mr: true,
    //Misc Issue
    mi: true,
    //Consolidated Report
    cr: true
  });
  const [page, setPage] = useState(0);
  const [client, setClient] = useState();
  const [search, setSearch] = useState("");
  const [type, setType] = useState(null);
  const userDetails = useSelector((state) => state.login.userDetails);
  const presentDay = moment();
  const snackbar = useSnackbar();

  console.log(type, "active array");
  const isGlReport =
    activeReport?.name === "GL Cash Receipt" ||
    activeReport?.name === "GL Inventoriables" ||
    activeReport?.name === "GL Sales GT";
  // const selectedRowData = useSelector((state) => state.selectedRow.value);
  // const dispatch = useDispatch();

  const pesoArray = ["charges", "payment", "netSales", "remainingBalance"];
  const dateTimeArray = [
    "timeIn",
    "timeOut",
    "transactionDate",
    "dateReceived",
    "receivedDate",
    "transactDate"
  ];

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

  const { data: listingFeeClients, error } = useGetAllListingFeeQuery(
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
      clusterId: clusterId?.id || "",
    },
    { refetchOnMountOrArgChange: true, skip: isActive.cdo }
  );

  const { data: sjReportData, isFetching: sjFetching } = useSJReportsQuery(
    {
      PageNumber: page + 1,
      PageSize: rowsPerPage,
      DateFrom: moment(watch("dateFrom")).format("MM-DD-YYYY") || "",
      DateTo: moment(watch("dateTo")).format("MM-DD-YYYY") || "",
      clusterId: clusterId?.id || "",
    },
    { refetchOnMountOrArgChange: true, skip: isActive.sj }
  );

  const { data: asReportData, isFetching: asFetching } = useASReportsQuery(
    {
      PageNumber: page + 1,
      PageSize: rowsPerPage,
      DateFrom: moment(watch("dateFrom")).format("MM-DD-YYYY") || "",
      DateTo: moment(watch("dateTo")).format("MM-DD-YYYY") || "",
      clusterId: clusterId?.id || "",
    },
    { refetchOnMountOrArgChange: true, skip: isActive.as }
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
        clusterId: clusterId?.id || "",
      },
      { refetchOnMountOrArgChange: true, skip: isActive.ci }
    );

  const { data: soaReportData, isFetching: soaFetching } =
    useGetSOAReportsQuery(
      {
        ClientId: watch("clientId")?.id,
        DateTo: moment(watch("dateTo")).format("YYYY-MM-DD") || "",
      },
      {
        refetchOnMountOrArgChange: true,
        skip: isActive.soa,
      }
    );

  const { data: listingFeeReportData, isFetching: listingFeeFetching } =
    useGetListingFeeHistoryByClientIdQuery(
      {
        ClientId: watch("clientId")?.id || watch("clientId")?.clientId,
      },
      {
        refetchOnMountOrArgChange: true,
        skip: isActive.lf,
      }
    );

  const { data: checkInFiloReportData, isFetching: checkInFiloFetching } =
    useGetCheckInFiloReportsQuery(
      {
        PageNumber: page + 1,
        PageSize: rowsPerPage,
        ClusterId: clusterId?.id || "",
        DateFrom: moment(watch("dateFrom")).format("YYYY-MM-DD") || "",
        DateTo: moment(watch("dateTo")).format("YYYY-MM-DD") || "",
      },
      {
        refetchOnMountOrArgChange: true,
        skip: isActive.cf,
      }
    );

  const {
    data: voidTransactionsReportData,
    isFetching: voidTransactionsFetching,
  } = useGetVoidTransactionsReportsQuery(
    {
      PageNumber: page + 1,
      PageSize: rowsPerPage,
      ClusterId: clusterId?.id || "",
      DateFrom: moment(watch("dateFrom")).format("YYYY-MM-DD") || "",
      DateTo: moment(watch("dateTo")).format("YYYY-MM-DD") || "",
    },
    {
      skip: isActive.vtr,
    }
  );

  let { data: receivingReportData, isFetching: receivingFetching } =
    useGetAllReceivedOrdersQuery(
      {
        Search: search,
        PageNumber: page + 1,
        DateFrom: moment(watch("dateFrom")).format("YYYY-MM-DD") || "",
        DateTo: moment(watch("dateTo")).format("YYYY-MM-DD") || "",
        PageSize: rowsPerPage,
        clusterId: clusterId?.id || "",
        ...(userType && { Role: userType }),
      },
      {
        refetchOnMountOrArgChange: true,
        skip: isActive.rr,
      }
    );

  const { data: returnToDepotReportData, isFetching: returnToDepotFetching } =
    useGetReturnToDepotReportsQuery(
      {
        ClusterId: clusterId?.id || "",
        DateFrom: moment(watch("dateFrom")).format("YYYY-MM-DD") || "",
        DateTo: moment(watch("dateTo")).format("YYYY-MM-DD") || "",
        TransferType: type?.value,
        PageNumber: page + 1,
        PageSize: rowsPerPage,
        ...(userType && { Role: userType }),
      },
      {
        refetchOnMountOrArgChange: true,
        skip: isActive.rtd,
      }
    );

  const { data: paymentReportData, isFetching: paymentFetching } =
    useGetPaymentReportsQuery(
      {
        PageNumber: page + 1,
        PageSize: rowsPerPage,
        DateFrom: moment(watch("dateFrom")).format("MM-DD-YYYY") || "",
        DateTo: moment(watch("dateTo")).format("MM-DD-YYYY") || "",
        clusterId: clusterId?.id || "",
      },
      {
        refetchOnMountOrArgChange: true,
        skip: isActive.pr,
      }
    );

  const { data: rollbackReportData, isFetching: rollbackFetching } =
    useGetMrpRollbackReportsQuery(
      {
        PageNumber: page + 1,
        PageSize: rowsPerPage,
        DateFrom: moment(watch("dateFrom")).format("MM-DD-YYYY") || "",
        DateTo: moment(watch("dateTo")).format("MM-DD-YYYY") || "",
        clusterId: clusterId?.id || "",
        ...(userType && { Role: userType }),
        ...(userId && { UserId: userId }),
      },
      {
        refetchOnMountOrArgChange: true,
        skip: isActive.mrr,
      }
    );
  const { data: glCashReceiptReportData, isFetching: glCashReceiptFetching } =
    useGetCashReceiptReportsQuery(
      {
        adjustment_month: moment(watch("dateTo")).format("YYYY-MM"),
      },
      {
        refetchOnMountOrArgChange: true,
        skip: isActive.glcr,
      }
    );

  const {
    data: glInventoriableReportData,
    isFetching: glInventoriableFetching,
  } = useGetInventoriablesReportsQuery(
    {
      adjustment_month: moment(watch("dateTo")).format("YYYY-MM"),
    },
    {
      refetchOnMountOrArgChange: true,
      skip: isActive.gli,
    }
  );

  const { data: glSalesGTReportData, isFetching: glSalesGTFetching } =
    useGetSalesGTReportsQuery(
      {
        adjustment_month: moment(watch("dateTo")).format("YYYY-MM"),
      },
      {
        refetchOnMountOrArgChange: true,
        skip: isActive.glgt,
      }
    );

  const {
    data: inventoryMovementReportData,
    isFetching: inventoryMovementFetching,
  } = useGetInventoryMovementReportsQuery(
    {
      PageNumber: page + 1,
      PageSize: rowsPerPage,
      DateFrom: moment(watch("dateFrom")).format("MM-DD-YYYY") || "",
      DateTo: moment(watch("dateTo")).format("MM-DD-YYYY") || "",
      clusterId: clusterId?.id || "",
      ...(userType && { Role: userType }),
      ...(userId && { UserId: userId }),
    },
    {
      refetchOnMountOrArgChange: true,
      skip: isActive.im,
    }
  );

  const {
    data: inventoryTransactionHistoryReportData,
    isFetching: inventoryTransactionHistoryFetching,
  } = useGetInventoryTransactionsHistoryReportsQuery(
    {
      PageNumber: page + 1,
      PageSize: rowsPerPage,
      DateFrom: moment(watch("dateFrom")).format("MM-DD-YYYY") || "",
      DateTo: moment(watch("dateTo")).format("MM-DD-YYYY") || "",
      clusterId: clusterId?.id || "",
      ...(userType && { Role: userType }),
    },
    { refetchOnMountOrArgChange: true, skip: isActive.ith }
  );

  const {
    data: inventoryFreebiesReportData,
    isFetching: inventoryFreebiesFetching,
  } = useGetFreebieReportsQuery(
    {
      PageNumber: page + 1,
      PageSize: rowsPerPage,
      DateFrom: moment(watch("dateFrom")).format("MM-DD-YYYY") || "",
      DateTo: moment(watch("dateTo")).format("MM-DD-YYYY") || "",
      clusterId: clusterId?.id || "",
      TransactionType: "Freebie",
    },
    { refetchOnMountOrArgChange: true, skip: isActive.freebie }
  );

  const {
    data: inventorySamplingReportData,
    isFetching: inventorySamplingFetching,
  } = useGetSamplingReportsQuery(
    {
      PageNumber: page + 1,
      PageSize: rowsPerPage,
      DateFrom: moment(watch("dateFrom")).format("MM-DD-YYYY") || "",
      DateTo: moment(watch("dateTo")).format("MM-DD-YYYY") || "",
      clusterId: clusterId?.id || "",
      TransactionType: "Sampling",
    },
    {
      refetchOnMountOrArgChange: true,

      skip: isActive.sampling,
    }
  );

  const {
    data: inventoryReturnReportData,
    isFetching: inventoryReturnFetching,
  } = useGetReturnReportsQuery(
    {
      PageNumber: page + 1,
      PageSize: rowsPerPage,
      DateFrom: moment(watch("dateFrom")).format("MM-DD-YYYY") || "",
      DateTo: moment(watch("dateTo")).format("MM-DD-YYYY") || "",
      clusterId: clusterId?.id || "",
      // TransactionType: "Return",
    },
    {
      refetchOnMountOrArgChange: true,
      skip: isActive.return,
    }
  );

  const {
    data: inventoryReplaceReportData,
    isFetching: inventoryReplaceFetching,
  } = useGetReplaceReportsQuery(
    {
      PageNumber: page + 1,
      PageSize: rowsPerPage,
      DateFrom: moment(watch("dateFrom")).format("MM-DD-YYYY") || "",
      DateTo: moment(watch("dateTo")).format("MM-DD-YYYY") || "",
      clusterId: clusterId?.id || "",
      // TransactionType: "Return",
    },
    {
      refetchOnMountOrArgChange: true,
      skip: isActive.replace,
    }
  );

  const { data: returnSamplingReportData, isFetching: returnSamplingFetching } =
    useGetReturnSamplingReportsQuery(
      {
        PageNumber: page + 1,
        PageSize: rowsPerPage,
        DateFrom: moment(watch("dateFrom")).format("MM-DD-YYYY") || "",
        DateTo: moment(watch("dateTo")).format("MM-DD-YYYY") || "",
        clusterId: clusterId?.id || "",
        // TransactionType: "Return",
      },
      {
        refetchOnMountOrArgChange: true,
        skip: isActive.rs,
      }
    );

  const {
    data: inventoryAdjustmentReportData,
    isFetching: inventoryAdjustmentFetching,
  } = useGetInventoryAdjustmentReportsQuery(
    {
      PageNumber: page + 1,
      PageSize: rowsPerPage,
      DateFrom: moment(watch("dateFrom")).format("MM-DD-YYYY") || "",
      DateTo: moment(watch("dateTo")).format("MM-DD-YYYY") || "",
      clusterId: clusterId?.id || "",
      // TransactionType: "Return",
    },
    {
      refetchOnMountOrArgChange: true,
      skip: isActive.ia,
    }
  );

  const { data: miscReceiptReportData, isFetching: miscReceiptFetching } =
    useGetMiscReceiptReportsQuery(
      {
        PageNumber: page + 1,
        PageSize: rowsPerPage,
        DateFrom: moment(watch("dateFrom")).format("MM-DD-YYYY") || "",
        DateTo: moment(watch("dateTo")).format("MM-DD-YYYY") || "",
        clusterId: clusterId?.id || "",
        // TransactionType: "Return",
      },
      {
        refetchOnMountOrArgChange: true,
        skip: isActive.mr,
      }
    );

  const { data: miscIssueReportData, isFetching: miscIssueFetching } =
    useGetMiscIssueReportsQuery(
      {
        PageNumber: page + 1,
        PageSize: rowsPerPage,
        DateFrom: moment(watch("dateFrom")).format("MM-DD-YYYY") || "",
        DateTo: moment(watch("dateTo")).format("MM-DD-YYYY") || "",
        clusterId: clusterId?.id || "",
        // TransactionType: "Return",
      },
      {
        refetchOnMountOrArgChange: true,
        skip: isActive.mi,
      }
    );

  const { data: consolidatedReportData, isFetching: consolidatedFetching } = useGetConsolidatedReportsQuery({
    PageNumber: page + 1,
    PageSize: rowsPerPage,
    DateFrom: moment(watch("dateFrom")).format("MM-DD-YYYY") || "",
    DateTo: moment(watch("dateTo")).format("MM-DD-YYYY") || "",
    clusterId: clusterId?.id || "",
    // TransactionType: "Return",
  },
    {
      refetchOnMountOrArgChange: true,
      skip: isActive.cr,
    })


  const parentIsFetching =
    cdoFetching ||
    sjFetching ||
    asFetching ||
    soaFetching ||
    // priceModeFetching ||
    checkInFetching ||
    listingFeeFetching ||
    checkInFiloFetching ||
    voidTransactionsFetching ||
    rollbackFetching ||
    paymentFetching ||
    glCashReceiptFetching ||
    glInventoriableFetching ||
    inventoryMovementFetching ||
    inventoryTransactionHistoryFetching ||
    returnToDepotFetching ||
    inventoryReturnFetching ||
    glSalesGTFetching ||
    receivingFetching ||
    inventoryReplaceFetching ||
    inventorySamplingFetching ||
    miscIssueFetching ||
    returnSamplingFetching ||
    inventoryAdjustmentFetching ||
    inventoryFreebiesFetching ||
    miscReceiptFetching || 
    consolidatedFetching;

  //functions
  const handleSubmitDate = () => {
    useDownloadExcel();
  };

  const onFilter = async ({ clusterId, type, userType, userId }) => {
    console.log("Test", clusterId);
    try {
      setClusterId(clusterId);
      setUserType(userType);
      setUserId(userId?.id);
      setType(type);
    } catch (error) {
      console.log(error);
    }
  };

  const useDownloadExcel = async () => {
    setIsDownloading(true); // Start loading

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASEURL}${activeReport?.value
        }?DateFrom=${moment(watch("dateFrom")).format(
          "MM-DD-YYYY"
        )}&DateTo=${moment(watch("dateTo")).format("MM-DD-YYYY")}${clusterId ? `&clusterId=${clusterId?.id}` : ""
        }${watch("clientId")?.id || watch("clientId")?.clientId
          ? `&clientId=${watch("clientId")?.id || watch("clientId")?.clientId
          }`
          : ""
        }${activeReport?.value === "GetTransferReportExport" && type
          ? `&TransferType=${type?.value || ""}`
          : ""
        }${(activeReport?.value === "arcana-mo-reports" ||
          activeReport?.value === "GetTransferReportExport" ||
          activeReport?.value === "MRPRollbackExport" ||
          activeReport?.value === "InventoryMovementExport" ||
          activeReport?.value === "TransactionHistoricalExport") &&
          userType
          ? `&Role=${userType}`
          : ""
        }`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${decryptString(
              sessionStorage.getItem("token")
            )}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download Excel file.");
      }

      console.log(response.headers.get("content-disposition").split('filename=')[1].split(';')[0].split('"')[1])

      const filename = response.headers.get("content-disposition").split('filename=')[1].split(';')[0].split('"')[1]

      const blob = await response.blob();
      const link = document.createElement("a");
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.setAttribute(
        "download",
        `${filename}`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      snackbar({
        message: "Excel file downloaded successfully",
        variant: "success",
      });
    } catch (error) {
      console.error("Error while downloading Excel file:", error);
      snackbar({ message: "Error while downloading file", variant: "error" });
    } finally {
      setIsDownloading(false); // Stop loading
    }
  };

  const handleGlReport = async (data) => {
    ExportExcel(data, activeReport.name);
  };

  //useEffect()

  useEffect(() => {
    receivingReportData = {
      ...receivingReportData,
      value: {
        ...receivingReportData?.value,
        mo:
          receivingReportData?.value?.mo?.map(
            ({ moveItems, ...rest }) => rest
          ) || [],
      },
    };
  }, [receivingReportData]);
  useEffect(() => {
    console.log("active Report");
    const reports = [
      cdoReportData,
      sjReportData,
      asReportData,
      // priceModeReportData,
      checkInReportData,
      soaReportData,
      listingFeeReportData,
      checkInFiloReportData,
      voidTransactionsReportData,
      paymentReportData,
      rollbackReportData,
      inventoryMovementReportData,
      inventoryTransactionHistoryReportData,

      receivingReportData,
      returnToDepotReportData,

      inventoryFreebiesReportData,
      inventorySamplingReportData,
      inventoryReturnReportData,
      inventoryReplaceReportData,
      returnSamplingReportData,
      inventoryAdjustmentReportData,
      miscReceiptReportData,
      miscIssueReportData,
      consolidatedReportData,

      glCashReceiptReportData,
      glInventoriableReportData,
      glSalesGTReportData,
    ];
    const keys = [
      "cdo",
      "sj",
      "as",
      "ci",
      "soa",
      "lf",
      "cf",
      "vtr",
      "pr",
      "mrr",
      "im",
      "ith",

      "rr",
      "rtd",

      "freebie",
      "sampling",
      "return",
      "replace",
      "rs",
      "ia",
      "mr",
      "mi",
      "cr",

      "glcr",
      "gli",
      "glgt",
      // "tor",
      // 'pm',/
    ];

    if (activeReport?.index !== undefined && !parentIsFetching) {
      console.log("active report", reports[activeReport.index]?.value);
      if (isGlReport) {
        console.log("active report");
        setActiveArray(reports[activeReport.index]);
      } else {
        setActiveArray(reports[activeReport.index]?.value);
      }

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
    parentIsFetching,
    listingFeeReportData,
    checkInFiloReportData,
    receivingReportData,
    returnToDepotReportData,
    voidTransactionsReportData,
    paymentReportData,
    inventoryMovementReportData,
    rollbackReportData,
    glCashReceiptReportData,
    receivingReportData,
    returnToDepotReportData,

    inventoryFreebiesReportData,
    inventorySamplingReportData,
    inventoryReturnReportData,
    inventoryReplaceReportData,
    inventoryAdjustmentReportData,
    miscReceiptReportData,
    miscIssueReportData,
    consolidatedReportData,

    glInventoriableReportData,
    glSalesGTReportData,
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
      "quantity",
      "unitPrice",
      "amount",
      "outlet",
      "status",
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
      "status",
    ],
    [
      "date",
      "businessName",
      "customerName",
      "invoiceNo",
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
    ["paymentType", "amount", "createdDate", "transactedBy"],
    ["user", "timeIn", "timeOut", "duration"],
    [
      "date",
      "invoiceNo",
      "itemDescription",
      "quantity",
      "unitPrice",
      "amount",
      "outlet",
      "status",
    ],
    [
      "transactionId",
      "payee",
      "referenceNo",
      "date",
      "paymentMethod",
      "paymentAmount",
      "addedBy",
      "status",
      "status",
    ],
    [
      "itemId",
      "itemCode",
      "itemDescription",
      "fromDepot",
      "receiving",
      "transferIn",
      "transferOut",
      "returnToDepot",
      "freebie",
      "sampling",
      "replace",
      "returnByClient",
      "sales",
      "temporaryReturn",
      "miscReceipt",
      "miscIssue",
      "reserve",
      "forReleasing",
      "soh",
    ],
    [
      "itemId",
      "itemCode",
      "itemDescription",
      "totalIn",
      "totalOut",
      "stockOnHand",
    ],
    [
      "id",
      "module",
      "type",
      "totalQuantity",
      "receivedDate",
      "status",
      "createdByName",
      "cluster",
      "recipient",
    ],
    ["misInId", "moveOrderId", "customerName", "dateReceived", "route"],
    ["id", "transactionDate", "transactionType", "totalQuantity", "status"],
    [
      "id",
      "clientName",
      "businessName",
      "transactionType",
      "totalQuantity",
      "createdDate",
    ],
    ["id", "description", "transactionType", "totalQuantity", "createdDate"],
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
      "Status",
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
      "Status",
    ],
    [
      "Date",
      "Business Name",
      "Business Owner",
      "Invoice Number",
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
    ["Payment Type", "Amount", "Created Date", "Transacted By"],
    ["User", "Time In", "Time Out", "Duration"],
    [
      "Date",
      "Invoice Number",
      "Item Description",
      "Quantity",
      "Unit Price",
      "Amount",
      "Outlet",
      "Status",
    ],
    [
      "Transaction ID",
      "Payee",
      "Reference No",
      "Date",
      "Payment Method",
      "Payment Amount",
      "Added By",
      "Status",
      "Status",
    ],
    [
      "Item ID",
      "Item Code",
      "Item Description",
      "Expected Delivery",
      "Receiving",
      "Transfer In",
      "Transfer Out",
      "Return To Depot",
      "Freebie",
      "Sampling",
      "Replace",
      "Return By Client",
      "Sales",
      "Temporary Return",
      "Misc Receipt",
      "Misc Issue",
      "Reserve",
      "For Releasing",
      "SOH",
    ],
    [
      "Item ID",
      "Item Code",
      "Item Description",
      "Total In",
      "Total Out",
      "Stock On Hand",
    ],
    [
      "ID",
      "Module",
      "Type",
      "Total Quantity",
      "Received Date",
      "Status",
      "Created By",
      "Cluster",
      "Recipient",
    ],
    ["ID", "Move Order ID", "Customer Name", "Date Received", "Route"],
    ["ID", "Transaction Date", "Transaction Type", "Total Quantity", "Status"],
    [
      "ID",
      "Client Name",
      "Business Name",
      "Transaction Type",
      "Total Quantity",
      "Created Date",
    ],
    ["ID", "Description", "Transaction Type", "Total Quantity", "Created Date"],
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
          options={reportNames.filter((item) => userDetails?.permission?.some((reports) => reports === item.name))}
          getOptionLabel={(option) => option?.name}
          onChange={(_, value) => {
            console.log(value)
            setActiveReport(value);
            setActiveArray([]);
            setValue("clientId", null);
            if (value?.value === "SOA-reports") {
              setValue("dateFrom", null);
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
            userDetails?.roleName === "Finance" ||
            (userDetails?.roleName === "CDO" &&
              activeReport?.value === "GetTransferReportExport")) &&
            activeReport?.value !== "SOA-reports" &&
            activeReport?.value !== "listing-fee-reports" && (
              <CommonFilter
                filter={onFilter}
                userTypeFilter={
                  activeReport?.value === "arcana-mo-reports" ||
                  (userDetails?.roleName !== "CDO" &&
                    activeReport?.value === "GetTransferReportExport") ||
                  activeReport?.value === "MRPRollbackExport" ||
                  activeReport?.value === "InventoryMovementExport" ||
                  activeReport?.value === "TransactionHistoricalExport"
                }
                typeFilter={activeReport?.value === "GetTransferReportExport"}
                clusterFilter={userDetails?.roleName !== "CDO" ? true : null}
                userFilter={
                  activeReport?.value === "InventoryMovementExport" ||
                  activeReport?.value === "MRPRollbackExport"
                }
              />
            )}
          {activeReport?.value === "SOA-reports" ||
            activeReport?.value === "listing-fee-reports" ? (
            <ControlledAutocomplete
              name="clientId"
              control={control}
              options={
                activeReport?.value === "listing-fee-reports"
                  ? listingFeeClients?.listingFees
                  : RegisteredClients?.regularClient || []
              }
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
          ) : (
            ""
          )}
          {activeReport?.value != "SOA-reports" &&
            activeReport?.value !== "listing-fee-reports" &&
            !isGlReport && (
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
          {activeReport?.value !== "listing-fee-reports" && !isGlReport && (
            <Controller
              name="dateTo"
              control={control}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    minDate={
                      activeReport?.value != "SOA-reports" && watch("dateFrom")
                    }
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
          )}
          {isGlReport && (
            <Controller
              name="dateTo"
              control={control}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    {...field}
                    label="Month"
                    views={["year", "month"]} // 👈 Makes it a Month Picker
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
          )}

          {activeReport?.value === "SOA-reports" && !soaFetching ? (
            <SOAPDFDownload
              soaReportData={soaReportData}
              watch={watch}
              soaFetching={soaFetching}
              listingFeeFetching={listingFeeFetching}
              dateTo={watch("dateTo")}
            />
          ) : isGlReport ? (
            <SecondaryButton
              size="medium"
              sx={{ mr: "10px", height: "100%" }}
              onClick={() => handleGlReport(activeArray)}
              disabled={
                !activeReport ||
                isDownloading ||
                !watch("dateFrom") ||
                !watch("dateTo") ||
                activeArray?.transactions?.length < 1 ||
                activeArray?.checkIn?.length < 1 ||
                activeArray?.to?.length < 1 ||
                activeArray?.length < 1
              }
            >
              <GetApp />
            </SecondaryButton>
          ) : (
            <SecondaryButton
              size="medium"
              onClick={handleSubmitDate}
              sx={{ mr: "10px", height: "100%" }}
              disabled={
                !activeReport ||
                isDownloading ||
                !watch("dateFrom") ||
                !watch("dateTo") ||
                activeArray?.transactions?.length < 1 ||
                activeArray?.checkIn?.length < 1 ||
                activeArray?.to?.length < 1 ||
                activeArray?.data?.length < 1 ||
                parentIsFetching
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
      {parentIsFetching ? (
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
            activeArray?.mo ||
            activeArray?.to ||
            activeArray?.data ||
            activeArray
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
