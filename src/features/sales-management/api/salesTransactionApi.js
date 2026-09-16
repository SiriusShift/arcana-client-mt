import { api } from "../../api";

const salesTransactionApi = api
  .enhanceEndpoints({
    addTagTypes: [
      "Clients POS",
      "Sales Transaction",
      "Sales Transaction By Id",
    ],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      receiveMoveOrder: builder.mutation({
        // Uncomment this when the backend is ready
        query: (body) => ({
          url: `/add-move-order-receivings`,
          method: "POST",
          body,
        }),
        invalidatesTags: ["Sales Transaction"],
      }),

      getAllClientsForPOS: builder.query({
        query: (params) => ({
          url: "/clients/pos",
          method: "GET",
          params,
          headers: {
            "x-api-key": import.meta.env.VITE_ARCANA_API_KEY,
          },
        }),
        providesTags: ["Clients POS"],
        transformResponse: (response) => response.value,
      }),

      createSalesTransaction: builder.mutation({
        query: (body) => ({
          url: "/sales-transaction",
          method: "POST",
          body,
        }),
        invalidatesTags: ["Sales Transaction", "Clients POS"],
      }),

      getSalesTransactionRequest: builder.query({
        query: (params) => ({
          url: "/sales-transaction/requests",
          method: "GET",
          params
        }),
        provideTags: ["Sales Transaction"],
        transformResponse: (response) => response.value,
      }),

      approveSalesTransactionRequest: builder.mutation({
        query: (id) => ({
          url: `/sales-transaction/requests/${id}/approve`,
          method: "PUT",
        }),
        invalidatesTags: ["Sales Transaction"]
      }),

      rejectSalesTransactionRequest: builder.mutation({
        query: ({ body, id }) => ({
          url: `/sales-transaction/requests/${id}/reject`,
          method: "PUT",
          body
        }),
        invalidatesTags: ["Sales Transaction"]
      }),

      // getAllSalesTransaction: builder.query({
      //   query: (params) => ({
      //     url: "/sales-transaction/page",
      //     method: "GET",
      //     params,
      //   }),
      //   providesTags: ["Sales Transaction"],
      //   transformResponse: (response) => response.value,
      // }),

      getAllSalesTransaction: builder.query({
        query: (params) => ({
          url: "/sales-transaction/page",
          method: "GET",
          params,
        }),
        providesTags: ["Sales Transaction"],
        transformResponse: (response) => response.value,
      }),

      getAllMoveOrderTransaction: builder.query({
        query: (params) => ({
          url: "/get-move-order-arcana",
          method: "GET",
          params,
        }),
        providesTags: ["Sales Transaction"],
        transformResponse: (response) => response.value,
      }),

      getSalesTransactionById: builder.query({
        query: ({ id }) => ({
          url: `/sales-transaction/${id}`,
          method: "GET",
        }),
        providesTags: ["Sales Transaction By Id"],
        transformResponse: (response) => response.value,
      }),

      voidSalesTransaction: builder.mutation({
        query: (body) => ({
          // url: `/sales-transaction/${id}/void`,
          url: `/void-transaction`,
          method: "PUT",
          body,
        }),
        invalidatesTags: ["Sales Transaction"],
      }),

      cancelSalesTransaction: builder.mutation({
        query: (body) => ({
          // url: `/sales-transaction/${id}/cancel`,
          url: `/cancel-transaction`,
          method: "PUT",
          body,
        }),
        invalidatesTags: ["Sales Transaction"],
      }),

      uploadCiAttachment: builder.mutation({
        query: ({ id, formData }) => ({
          url: `/transactions-invoice/${id}`,
          method: "PATCH",
          body: formData,
        }),
        invalidatesTags: ["Sales Transaction"],
      }),
    }),
  });

export const {
  useGetAllClientsForPOSQuery,
  useLazyGetAllClientsForPOSQuery,
  useGetAllSalesTransactionQuery,
  useLazyGetAllSalesTransactionQuery,
  useCancelSalesTransactionMutation,
  useVoidSalesTransactionMutation,
  useUploadCiAttachmentMutation,
  useCreateSalesTransactionMutation,
  useLazyGetSalesTransactionByIdQuery,
  useGetAllMoveOrderTransactionQuery,
  useGetSalesTransactionRequestQuery,
  useRejectSalesTransactionRequestMutation,
  useApproveSalesTransactionRequestMutation
} = salesTransactionApi;
