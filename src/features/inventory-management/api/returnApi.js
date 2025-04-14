import { api } from "../../api";
import {
  dummyGetAllReturns,
  dummyGetReturnById,
  dummyReturn,
} from "../../../utils/DummyQueryFn";
import { update } from "lodash";

const returnApi = api
  .enhanceEndpoints({ addTagTypes: ["Return", "Returns", "Items With BBD"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      returnItems: builder.mutation({
        query: (body) => ({
          url: `/add-return-order`,
          method: "POST",
          body,
        }),
        invalidatesTags: ["Return", "Returns", "Items With BBD"],

        // This is a dummy implementation of the request
        // Remove this when the backend is ready
        // queryFn: dummyReturn,
      }),
      replaceItems: builder.mutation({
        query: (body) => ({
          url: `/add-replace-order`,
          method: "POST",
          body,
        }),
        invalidatesTags: ["Return", "Returns", "Items With BBD"],
      }),

      noReplaceItems: builder.mutation({
        query: (body) => ({
          url: `/add-no-replace`,
          method: "POST",
          body,
        }),
        invalidatesTags: ["Return", "Returns", "Items With BBD"],
      }),

      getAllReturns: builder.query({
        // Uncomment this when the backend is ready
        query: (params) => ({
          params,
          url: "/get-return-order",
          method: "GET",
        }),
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
        providesTags: ["Returns"],

        // This is a dummy implementation of the response
        // Remove this when the backend is ready
        // queryFn: dummyGetAllReturns,
      }),

      updateReturn: builder.mutation({
        query: ({ id, returnItems }) => ({
          url: `/update-return-order/${id}`, // Use the `id` for the endpoint
          method: "PUT",
          body: returnItems, // Pass only `returnItems` as the request body
        }),
        invalidatesTags: ["Return", "Returns", "Items With BBD"],
      }),

      getReturnById: builder.query({
        // Uncomment this when the backend is ready
        query: (id) => ({
          url: `/get-no-replace/${id}`,
          method: "GET",
        }),

        // This is a dummy implementation of the response
        // Remove this when the backend is ready
        // queryFn: dummyGetReturnById,
      }),
    }),
  });

export const {
  useReturnItemsMutation,
  useGetAllReturnsQuery,
  useLazyGetAllReturnsQuery,
  useLazyGetReturnByIdQuery,
  useReplaceItemsMutation,
  useNoReplaceItemsMutation,
  useUpdateReturnMutation,
} = returnApi;
