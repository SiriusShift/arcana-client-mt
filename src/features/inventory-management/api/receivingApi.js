import {
  dummyGenerateMoveOrder,
  dummyGetAllReceivedOrders,
  dummyGetReceivedOrderById,
  dummyReceiveMoveOrder,
} from "../../../utils/DummyQueryFn";
import { api } from "../../api";

const receivingApi = api
  .enhanceEndpoints({ addTagTypes: ["Orders", "Order", "Generate"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      receiveMoveOrder: builder.mutation({
        // Uncomment this when the backend is ready
        // query: (id) => ({
        //   url: `/receiving`,
        //   method: "POST",
        // }),
        invalidatesTags: ["Orders", "Order", "Generate"],

        // This is a dummy implementation of the request
        // Remove this when the backend is ready
        queryFn: dummyReceiveMoveOrder,
      }),

      getAllReceivedOrders: builder.query({
        // Uncomment this when the backend is ready
        // query: (params) => ({
        //   params: params,
        //   url: "/receiving",
        //   method: "GET",
        // }),
        // transformResponse: (response) => response.value,
        // transformErrorResponse: (response) => response.value,
        providesTags: ["Orders"],

        // This is a dummy implementation of the response
        // Remove this when the backend is ready
        queryFn: dummyGetAllReceivedOrders,
      }),

      getReceivedOrderById: builder.query({
        // Uncomment this when the backend is ready
        // query: (id) => ({
        //   url: `/receiving/${id}`,
        //   method: "GET",
        // }),
        // transformResponse: (response) => response.value,
        // transformErrorResponse: (response) => response.value,
        providesTags: ["Order"],

        // This is a dummy implementation of the response
        // Remove this when the backend is ready
        queryFn: dummyGetReceivedOrderById,
      }),

      generateMoveOrder: builder.query({
        // Uncomment this when the backend is ready
        // query: (id) => ({
        //   url: `/receiving/generate/${id}`,
        //   method: "GET",
        // }),
        // transformResponse: (response) => response.value,
        // transformErrorResponse: (response) => response.value,
        providesTags: ["Generate"],

        // This is a dummy implementation of the response
        // Remove this when the backend is ready
        queryFn: dummyGenerateMoveOrder,
      }),
    }),
  });

export const {
  useReceiveMoveOrderMutation,
  useGetAllReceivedOrdersQuery,
  useLazyGetReceivedOrderByIdQuery,
  useGenerateMoveOrderQuery,
  useLazyGenerateMoveOrderQuery,
} = receivingApi;
