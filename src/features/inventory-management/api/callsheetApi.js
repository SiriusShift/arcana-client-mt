import { dummyCallsheetData } from "../../../utils/DummyInventoryData";
import { dummyGetAllCallsheet } from "../../../utils/DummyQueryFn";
import { api } from "../../api";

const callsheetApi = api
  .enhanceEndpoints({ addTagTypes: ["Callsheet"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAllCallsheets: builder.query({
        // Uncomment this when the backend is ready
        query: (params) => ({
          params,
          url: "/get-callsheet",
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
        query: ({id, body}) => ({
          url: `/update-bbd/${id}`,
          method: "PUT",
          body: body,
        }),
        invalidatesTags: ["Callsheet"],
      }),
    }),
  });

export const {
  useGetAllCallsheetsQuery,
  useUpdateRemainingInventoryMutation,
  useUpdateItemsWithBBDMutation,
  // useGetCallSheetByIdQuery,
} = callsheetApi;
