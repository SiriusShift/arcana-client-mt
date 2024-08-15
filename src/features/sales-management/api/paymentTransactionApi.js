import { api } from "../../api";

const paymentTransactionApi = api
  .enhanceEndpoints({
    addTagTypes: [
      "Payment Transaction Histories",
      "Sales Transaction",
      "Sales Transaction For Payments",
      "Advance Payment",
      "Advance Payment Balance",
      "Advance Payment Balances",
    ],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAllSalesTransactionForPayments: builder.query({
        query: (params) => ({
          url: "/sales-transaction/payment",
          method: "GET",
          params,
        }),
        providesTags: ["Sales Transaction", "Sales Transaction For Payments"],
        transformResponse: (response) => response.value,
      }),

      getAllPaymentHistories: builder.query({
        query: (params) => ({
          url: "/payment-transaction/page",
          method: "GET",
          params,
        }),
        providesTags: ["Payment Transaction Histories"],
        transformResponse: (response) => response.value,
      }),

      createPaymentTransaction: builder.mutation({
        query: (body) => ({
          url: `/payment`,
          method: "POST",
          body,
        }),
        invalidatesTags: [
          "Sales Transaction",
          "Sales Transaction For Payments",
          "Advance Payment",
          "Advance Payment Balance",
          "Advance Payment Balances",
        ],
      }),

      voidPaymentTransaction: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/payment-transaction/${id}/voidV2`,
          method: "PUT",
          body,
        }),
        invalidatesTags: [
          "Sales Transaction",
          "Sales Transaction For Payments",
          "Advance Payment",
          "Advance Payment Balance",
          "Advance Payment Balances",
        ],
      }),

      // voidPaymentTransaction: builder.mutation({
      //   query: ({ id, ...body }) => ({
      //     url: `/payment-transaction/${id}/void`,
      //     method: "PUT",
      //     body,
      //   }),
      //   invalidatesTags: [
      //     "Sales Transaction",
      //     "Sales Transaction For Payments",
      //     "",
      //   ],
      // }),
    }),
  });

export const {
  useGetAllSalesTransactionForPaymentsQuery,
  useLazyGetAllSalesTransactionForPaymentsQuery,
  useLazyGetAllPaymentHistoriesQuery,
  useGetAllPaymentHistoriesQuery,
  useCreatePaymentTransactionMutation,
  useVoidPaymentTransactionMutation,
} = paymentTransactionApi;
