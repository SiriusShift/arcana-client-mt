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
        query: (params) => ({
          url: `/add-move-order-receivings`,
          method: "POST",
          params
        }),
        invalidatesTags: ["Orders", "Order", "Generate"],

        // This is a dummy implementation of the request
        // Remove this when the backend is ready
        queryFn: dummyReceiveMoveOrder,
      }),

      getAllReceivedOrders: builder.query({
        // Uncomment this when the backend is ready
        query: (params) => ({
          params: params,
          url: "/get-move-order-arcana",
          method: "GET",
        }),
        transformResponse: (response) => response.value,
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
        query: (params) => ({
          url: `/get-mo-from-external/${params}`,
          method: "GET",
        }),
        transformResponse: (response) => response.value,
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
