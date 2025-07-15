import { api } from "../../api";

const reportsApi = api
  .enhanceEndpoints({
    addTagTypes: [
      "CDO Report",
      "Sales Journal Report",
      "AS Report",
      "CheckIn Report",
      "SOA Report",
      "Return to Depot Report",
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
      getPaymentReports: builder.query({
        query: (params) => ({
          url: "/get-payment-reports",
          method: "GET",
          params,
        }),
        providesTags: ["Payment Report"],
      }),
      getReturnToDepotReports: builder.query({
        query: (params) => ({
          url: "/GetTransferReport",
          method: "GET",
          params,
        }),
        providesTags: ["Return to Depot Report"],
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
          url: "/get-freebie-order",
          method: "GET",
          params,
        }),
        providesTags: ["Freebie Report"],
      }),
      getSamplingReports: builder.query({
        query: (params) => ({
          url: "/get-freebie-order",
          method: "GET",
          params,
        }),
        providesTags: ["Sampling Report"],
      }),
      getReturnReports: builder.query({
        query: (params) => ({
          url: "/GetReturnedOrders",
          method: "GET",
          params,
        }),
        providesTags: ["Return Report"],
      }),
      getReplaceReports: builder.query({
        query: (params) => ({
          url: "/GetReplacedOrders",
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
        providesTags: ["Void Report"],
      }),
      getMrpRollbackReports: builder.query({
        query: (params) => ({
          url: "/mrp-rollback",
          method: "GET",
          params,
        }),
        providesTags: ["Rollback Report"],
      }),
      getCashReceiptReports: builder.query({
        query: (params) => ({
          url: "/arcana-gl-cash-receipt",
          method: "GET",
          params,
          headers: {
            "x-api-key": import.meta.env.VITE_GL_KEY,
          }
        }),
      }),
      getInventoriablesReports: builder.query({
        query: (params) => ({
          url: "/arcana-gl",
          method: "GET",
          params,
          headers: {
            "x-api-key": import.meta.env.VITE_GL_KEY,
          }
        }),
      }),
      getSalesGTReports: builder.query({
        query: (params) => ({
          url: "/arcana-gt-sales",
          method: "GET",
          params,
          headers: {
            "x-api-key": import.meta.env.VITE_GL_KEY,
          }
        }),
      }),
      getInventoryMovementReports: builder.query({
        query: (params) => ({
          url: "/InventoryMovement",
          method: "GET",
          params
        })
      }),
      getInventoryTransactionsHistoryReports: builder.query({
        query: (params) => ({
          url: "/TransactionHistoricalReport",
          method: "GET",
          params
        })
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
  useGetReturnToDepotReportsQuery,
  useGetTransferOutReportsQuery,
  useGetTransferInReportsQuery,
  useGetFreebieReportsQuery,
  useGetSamplingReportsQuery,
  useGetReturnReportsQuery,
  useGetReplaceReportsQuery,  
  useGetVoidTransactionsReportsQuery,
  useGetPaymentReportsQuery,
  useGetMrpRollbackReportsQuery,
  useGetCashReceiptReportsQuery,
  useGetInventoriablesReportsQuery,
  useGetSalesGTReportsQuery,
  useGetInventoryMovementReportsQuery,
  useGetInventoryTransactionsHistoryReportsQuery
} = reportsApi
