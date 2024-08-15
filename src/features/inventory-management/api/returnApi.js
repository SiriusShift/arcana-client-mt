import { api } from "../../api";
import {
  dummyGetAllReturns,
  dummyGetReturnById,
  dummyReturn,
} from "../../../utils/DummyQueryFn";

const returnApi = api
  .enhanceEndpoints({ addTagTypes: ["Return", "Returns", "Items With BBD"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      returnItems: builder.mutation({
        // query: (body) => ({
        //   url: `/return`,
        //   method: "POST",
        //   body,
        // }),
        invalidatesTags: ["Return", "Returns", "Items With BBD"],

        // This is a dummy implementation of the request
        // Remove this when the backend is ready
        queryFn: dummyReturn,
      }),

      getAllReturns: builder.query({
        // Uncomment this when the backend is ready
        // query: (params) => ({
        //   params,
        //   url: "/return",
        //   method: "GET",
        // }),
        // transformResponse: (response) => response.value,
        // transformErrorResponse: (response) => response.value,
        providesTags: ["Returns"],

        // This is a dummy implementation of the response
        // Remove this when the backend is ready
        queryFn: dummyGetAllReturns,
      }),

      getReturnById: builder.query({
        // Uncomment this when the backend is ready
        // query: (id) => ({
        //   url: `/return",/${id}`,
        //   method: "GET",
        // }),
        // transformResponse: (response) => response.value,
        // transformErrorResponse: (response) => response.value,\
        providesTags: ["Return"],

        // This is a dummy implementation of the response
        // Remove this when the backend is ready
        queryFn: dummyGetReturnById,
      }),
    }),
  });

export const {
  useReturnItemsMutation,
  useGetAllReturnsQuery,
  useGetReturnByIdQuery,
} = returnApi;
