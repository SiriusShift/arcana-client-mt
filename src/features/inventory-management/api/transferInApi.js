import { api } from "../../api";
import {
  dummyGetAllTransferIns,
  dummyGetTransferInById,
  dummyReceiveTransferIn,
  dummyRejectTransferIn,
} from "../../../utils/DummyQueryFn";

const transferInApi = api
  .enhanceEndpoints({ addTagTypes: ["Transfer In", "Transfer Ins"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      receiveTransferIn: builder.mutation({
        query: (id) => ({
          url: `/accept-transfer/${id}`,
          method: "PATCH",
          body: {},
        }),
        invalidatesTags: ["Transfer In", "Transfer Ins"],

        // This is a dummy implementation of the request
        // Remove this when the backend is ready
        // queryFn: dummyReceiveTransferIn,
      }),

      rejectTransferIn: builder.mutation({
        // Uncomment this when the backend is ready
        query: (id) => ({
          url: `/reject-transfer/${id}`,
          method: "PATCH",
          body: {},
        }),
        invalidatesTags: ["Transfer In", "Transfer Ins"],

        // This is a dummy implementation of the request
        // Remove this when the backend is ready
        // queryFn: dummyRejectTransferIn,
      }),

      getAllTransferIns: builder.query({
        // Uncomment this when the backend is ready
        query: (params) => ({
          params,
          url: "/get-transfer",
          method: "GET",
        }),
        transformResponse: (response) => response.value,
        // transformResponse: (response) => response.value,
        // transformErrorResponse: (response) => response.value,
        providesTags: ["Transfer Ins"],

        // This is a dummy implementation of the response
        // Remove this when the backend is ready
        // queryFn: dummyGetAllTransferIns,
      }),

      getTransferInById: builder.query({
        // Uncomment this when the backend is ready
        query: (params) => ({
          url: `/get-transfer`,
          method: "GET",
          params
        }),
        transformResponse: (response) => response.value,
        // transformErrorResponse: (response) => response.value,\
        providesTags: ["Transfer In"],

        // This is a dummy implementation of the response
        // Remove this when the backend is ready
        // queryFn: dummyGetTransferInById,
      }),
    }),
  });

export const {
  useReceiveTransferInMutation,
  useRejectTransferInMutation,
  useGetAllTransferInsQuery,
  useGetTransferInByIdQuery,
} = transferInApi;
