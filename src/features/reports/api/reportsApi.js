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
  useGetVoidTransactionsReportsQuery
} = reportsApi;