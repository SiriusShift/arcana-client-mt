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
      getAllClientsForPOS: builder.query({
        query: (params) => ({
          url: "/clients/pos",
          method: "GET",
          params,
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

      getAllSalesTransaction: builder.query({
        query: (params) => ({
          url: "/sales-transaction/page",
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
          url: `/sales-transaction/voidV2`,
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
  useGetAllSalesTransactionQuery,
  useLazyGetAllSalesTransactionQuery,
  useCancelSalesTransactionMutation,
  useVoidSalesTransactionMutation,
  useUploadCiAttachmentMutation,
  useCreateSalesTransactionMutation,
  useLazyGetSalesTransactionByIdQuery,
} = salesTransactionApi;
