import { api } from "../../api";

const listingFeeApi = api
  .enhanceEndpoints({
    addTagTypes: [
      "Listing Fee",
      "Listing Fee Balances",
      "Listing Fee Balance By ID",
      "Clients For Listing",
      "Notification",
      "ListingFeeById",
      "Cheque",
    ],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      postListingFee: builder.mutation({
        query: (body) => ({
          body: body,
          url: "/ListingFee/AddNewListingFee",
          method: "POST",
        }),
        invalidatesTags: [
          "Listing Fee",
          "ListingFeeById",
          "Notification",
          "Listing Fee Balances",
          "Clients For Listing",
        ],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => ({
          function: "postListingFee",
          ...response.value,
        }),
      }),

      getAllListingFee: builder.query({
        query: (params) => ({
          params: params,
          url: "/ListingFee/GetAllListingFee",
          method: "GET",
        }),
        providesTags: ["Listing Fee"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),

      getAllListingFeeBalances: builder.query({
        query: (params) => ({
          params,
          url: "/ListingFee/GetAllListingFeeBalance",
          method: "GET",
        }),
        providesTags: ["Listing Fee Balances"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),

      getListingFeeBalanceById: builder.query({
        query: ({ id }) => ({
          url: `/listing-fee/${id}`,
          method: "GET",
        }),
        providesTags: ["Listing Fee Balance By ID"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),

      putApproveListingFee: builder.mutation({
        query: ({ id }) => ({
          url: `/ListingFee/ApproveListingFee/${id}`,
          method: "PUT",
        }),
        invalidatesTags: [
          "Listing Fee",
          "Notification",
          "Listing Fee Balances",
        ],
      }),

      putRejectListingFee: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/ListingFee/RejectListingFee/${id}`,
          method: "PUT",
          body: body,
        }),
        invalidatesTags: ["Listing Fee", "Notification"],
      }),

      putUpdateListingFee: builder.mutation({
        query: ({ id, params, ...body }) => ({
          url: `/ListingFee/UpdateListingFeeItems/${id}`,
          method: "PUT",
          body: body,
          params: params,
        }),
        invalidatesTags: [
          "Listing Fee",
          "ListingFeeById",
          "Clients For Listing",
          "Notification",
        ],
      }),

      deleteCancelListingFee: builder.mutation({
        query: (id) => ({
          url: `/ListingFee/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Listing Fee", "Clients For Listing", "Notification"],
      }),

      getListingFeeApprovalHistoriesById: builder.query({
        query: ({ id }) => ({
          url: `/listing-fee/${id}/approval-history`,
          method: "GET",
        }),
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),

      getCheque: builder.query({
        query: (params) => ({
          url: `/listing-to-check`,
          method: "GET",
          params
        }),
        providesTags: ["Cheque"],
        transformResponse: (response) => response.value
      }),

      postCheque: builder.mutation({
        query: (body) => ({
          url: '/listing-to-check',
          method: 'POST',
          body: body, // Pass the body object here
        }),
        invalidatesTags: ['Listing Fee', 'Cheque'], // Optional for cache invalidation
        transformResponse: (response) => response.value
      }),

      getListingFeeHistoryByClientId: builder.query({
        query: (params) => ({
          url: `/get-lf-history-per-client`,
          method: "GET",
          params
        }),
        providesTags: ["Clients For Listing"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),
    }),
  });

export const {
  usePostListingFeeMutation,
  useGetAllListingFeeQuery,
  useLazyGetListingFeeBalanceByIdQuery,
  useLazyGetAllListingFeeBalancesQuery,
  usePutApproveListingFeeMutation,
  usePutRejectListingFeeMutation,
  usePutUpdateListingFeeMutation,
  useDeleteCancelListingFeeMutation,
  useLazyGetListingFeeHistoryByClientIdQuery,

  //Listing Fee to Cheque
  useGetChequeQuery, 
  usePostChequeMutation,

  //Approval History
  useLazyGetListingFeeApprovalHistoriesByIdQuery,
} = listingFeeApi;

export default listingFeeApi;
