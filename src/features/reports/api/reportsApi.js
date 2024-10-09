import { api } from "../../api";

const reportsApi = api
  .enhanceEndpoints({
    addTagTypes: ["CDO Report", "Sales Journal Report", "AS Report"],
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
      PriceModeReport: builder.query({
        query: (params) => ({
          url: "/get-price-mode-reports",
          method: "GET",
          params,
        }),
        providesTags: ["Price Mode Report"],
      }),
    }),
  });

export const { useCDOReportsQuery, useSJReportsQuery, useASReportsQuery, usePriceModeReportQuery } = reportsApi;
