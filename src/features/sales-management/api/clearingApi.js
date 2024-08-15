import { api } from "../../api";

const clearingApi = api
  .enhanceEndpoints({
    addTagTypes: [
      "Clearing",
      "Overview",
      "Payment Transaction Histories",
      "Sales Transaction For Payments",
    ],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      clearPaymentTransaction: builder.mutation({
        query: (body) => ({
          url: "/clearing-transaction/cleared",
          method: "POST",
          body,
        }),
        invalidatesTags: [
          "Clearing",
          "Overview",
          "Payment Transaction Histories",
          "Sales Transaction For Payments",
        ],
      }),

      voidClearingTransaction: builder.mutation({
        query: (body) => ({
          url: "/clearing-transaction/void",
          method: "PUT",
          body,
        }),
        invalidatesTags: [
          "Clearing",
          "Overview",
          "Payment Transaction Histories",
          "Sales Transaction For Payments",
        ],
      }),

      fileClearingTransaction: builder.mutation({
        query: (body) => ({
          url: "/clearing-transaction/filing",
          method: "PATCH",
          body,
        }),
        invalidatesTags: [
          "Clearing",
          "Overview",
          "Payment Transaction Histories",
          "Sales Transaction For Payments",
        ],
      }),

      returnClearingTransaction: builder.mutation({
        query: (body) => ({
          url: "/clearing-transaction/filing/return",
          method: "PATCH",
          body,
        }),
        invalidatesTags: [
          "Clearing",
          "Overview",
          "Payment Transaction Histories",
          "Sales Transaction For Payments",
        ],
      }),

      getAllClearingTransaction: builder.query({
        query: (params) => ({
          url: "/clearing-transaction/pages",
          method: "GET",
          params,
        }),
        providesTags: ["Clearing"],
        transformResponse: (response) => response.value,
      }),

      getPaymentOverview: builder.query({
        query: (params) => ({
          url: "/payment/overview",
          method: "GET",
          params,
        }),
        providesTags: ["Overview"],
        transformResponse: (response) => response.value,
      }),
    }),
  });

export const {
  useClearPaymentTransactionMutation,
  useVoidClearingTransactionMutation,
  useFileClearingTransactionMutation,
  useReturnClearingTransactionMutation,
  useGetAllClearingTransactionQuery,
  useLazyGetPaymentOverviewQuery,
} = clearingApi;
