import {
  dummyGenerateMoveOrder,
  dummyGetAllReceivedOrders,
  dummyGetReceivedOrderById,
  dummyReceiveMoveOrder,
} from "../../../utils/DummyQueryFn";
import { api } from "../../api";

export const receivingApi = api
  .enhanceEndpoints({ addTagTypes: ["Orders", "Order", "Generate"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      receiveMoveOrder: builder.mutation({
        // Uncomment this when the backend is ready
        query: (body) => ({
          url: `/add-move-order-receivings`,
          method: "POST",
          body
        }),
        invalidatesTags: ["Orders", "Order", "Generate"],

        // This is a dummy implementation of the request
        // Remove this when the backend is ready
        // queryFn: dummyReceiveMoveOrder,
      }),

      getWrongItems: builder.query({
        query : (params) => ({
          params,
          url: "/get-wrong-orders",
          method: "GET",
        })
      }),

      getAllReceivedOrders: builder.query({
        // Uncomment this when the backend is ready
        query: (params) => ({
          params: params,
          url: "/get-move-order-arcana",
          method: "GET",
        }),
        // transformErrorResponse: (response) => response.value,
        providesTags: ["Orders"],

        // This is a dummy implementation of the response
        // Remove this when the backend is ready
        // queryFn: dummyGetAllReceivedOrders,
      }),

      getReceivedOrderById: builder.query({
        // Uncomment this when the backend is ready
        query: (params) => ({
          url: `/get-move-order-arcana`,
          method: "GET",
          params,
        }),
        transformResponse: (response) => response.value,
        // transformErrorResponse: (response) => response.value,
        providesTags: ["Order"],

        // This is a dummy implementation of the response
        // Remove this when the backend is ready
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
  useLazyGetWrongItemsQuery
} = receivingApi;
