import { dummyCallsheetData } from "../../../utils/DummyInventoryData";
import { dummyGetAllCallsheet } from "../../../utils/DummyQueryFn";
import { api } from "../../api";

const callsheetApi = api
  .enhanceEndpoints({ addTagTypes: ["Callsheet"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      // getAllCallsheets: builder.query({
      //   // Uncomment this when the backend is ready
      //   query: (params) => ({
      //     params,
      //     url: "/get-callsheet",
      //     method: "GET",
      //   }),
      //   transformResponse: (response) => response.value,
      //   transformErrorResponse: (response) => response.value,
      //   // queryFn: dummyGetAllCallsheet,
      //   providesTags: ["Callsheet"],
      // }),
      getAllCallsheets: builder.query({
        // Uncomment this when the backend is ready
        query: (params) => ({
          params,
          url: "/get-callsheet-v2",
          method: "GET",
        }),
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
        // queryFn: dummyGetAllCallsheet,
        providesTags: ["Callsheet"],
      }),
      updateRemainingInventory: builder.mutation({
        query: ({body, id}) => ({
          url: `/update-callsheet-items/${id}`,
          method: "PUT",
          body: body,
        }),
        invalidatesTags: ["Callsheet"],
      }),
      updateItemsWithBBD: builder.mutation({
        query: (body) => ({
          url: `/update-bbd`,
          method: "PUT",
          body: body,
        }),
        invalidatesTags: ["Callsheet"],
      }),
      getTransactionItemCallsheet: builder.query({
        query: () => ({
          url: "/get-transaction-item-callsheet",
          method: "GET"
        })
      })
    }),
  });

export const {
  useGetAllCallsheetsQuery,
  useUpdateRemainingInventoryMutation,
  useUpdateItemsWithBBDMutation,
  useGetTransactionItemCallsheetQuery
  // useGetCallSheetByIdQuery,
} = callsheetApi;
