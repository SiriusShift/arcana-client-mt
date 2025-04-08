import { api } from "../../api";

const reportsApi = api
  .enhanceEndpoints({
    addTagTypes: [
      "CDO Report",
      "Sales Journal Report",
      "AS Report",
      "CheckIn Report",
      "SOA Report",
    ],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      CDOReports: builder.query({
        query: (params) => ({
          url: "/get-cdo-reports",
          method: "GET",
          params,
        }),
        providesTags: ["CDO Report"],
      }),
      SJReports: builder.query({
        query: (params) => ({
          url: "/get-sales-joural-reports",
          method: "GET",
          params,
        }),
        providesTags: ["Sales Journal Report"],
      }),
      ASReports: builder.query({
        query: (params) => ({
          url: "/get-as-reports",
          method: "GET",
          params,
        }),
        providesTags: ["AS Report"],
      }),
      // PriceModeReport: builder.query({
      //   query: (params) => ({
      //     url: "/get-price-mode-reports",
      //     method: "GET",
      //     params,
      //   }),
      //   providesTags: ["Price Mode Report"],
      // }),
      getCheckInReports: builder.query({
        query: (params) => ({
          url: "/get-check-in-reports",
          method: "GET",
          params,
        }),
        providesTags: ["CheckIn Report"],
      }),
      getSOAReports: builder.query({
        query: (params) => ({
          url: "/get-soa-reports",
          method: "GET",
          params,
        }),
        providesTags: ["SOA Report"],
      }),
      getCheckInFiloReports: builder.query({
        query: (params) => ({
          url: "/get-check-in-reports-filo",
          method: "GET",
          params,
        }),
        providesTags: ["CheckIn Report"],
      }),
      getReturnByCDOReports: builder.query({
        query: (params) => ({
          url: "/arcana-return-by-cdo-reports",
          method: "GET",
          params,
        }),
        providesTags: ["Return By CDO Report"],
      }),
      getTransferOutReports: builder.query({
        query: (params) => ({
          url: "/arcana-transfer-out-reports",
          method: "GET",
          params,
        }),
        providesTags: ["Transfer Out Report"],
      }),
      getTransferInReports: builder.query({
        query: (params) => ({
          url: "/arcana-transfer-in-reports",
          method: "GET",
          params,
        }),
        providesTags: ["Transfer In Report"],
      }),
      getFreebieReports: builder.query({
        query: (params) => ({
          url: "/arcana-freebie-report",
          method: "GET",
          params,
        }),
        providesTags: ["Freebie Report"],
      }),
      getSamplingReports: builder.query({
        query: (params) => ({
          url: "/arcana-sampling-report",
          method: "GET",
          params,
        }),
        providesTags: ["Sampling Report"],
      }),
      getReturnReports: builder.query({
        query: (params) => ({
          url: "/arcana-return-report",
          method: "GET",
          params,
        }),
        providesTags: ["Return Report"],
      }),
      getReplaceReports: builder.query({
        query: (params) => ({
          url: "/arcana-replace-report",
          method: "GET",
          params,
        }),
        providesTags: ["Replace Report"],
      }),
      getVoidTransactionsReports: builder.query({
        query: (params) => ({
          url: "/get-void-transaction-reports",
          method: "GET",
          params,
        }),
        providesTags: ["CheckIn Report"],
      })
    }),
  });

export const {
  useCDOReportsQuery,
  useSJReportsQuery,
  useASReportsQuery,
  usePriceModeReportQuery,
  useGetCheckInReportsQuery,
  useCheckInReportQuery,
  useGetSOAReportsQuery,
  useGetCheckInFiloReportsQuery,
  useGetReturnByCDOReportsQuery,
  useGetTransferOutReportsQuery,
  useGetTransferInReportsQuery,
  useGetFreebieReportsQuery,
  useGetSamplingReportsQuery,
  useGetReturnReportsQuery,
  useGetReplaceReportsQuery,  
  useGetVoidTransactionsReportsQuery
} = reportsApi;
