import { api } from "../../api";
import {
  dummyGetAllTransferOuts,
  dummyGetTransferOutById,
  dummyTransferOut,
} from "../../../utils/DummyQueryFn";

const transferOutApi = api
  .enhanceEndpoints({
    addTagTypes: ["Transfer Out", "Transfer Outs", "Items With BBD"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      transferOut: builder.mutation({
        // query: (body) => ({
        //   url: `/transfer-out`,
        //   method: "POST",
        //   body,
        // }),
        invalidatesTags: ["Transfer Out", "Transfer Outs", "Items With BBD"],

        // This is a dummy implementation of the request
        // Remove this when the backend is ready
        queryFn: dummyTransferOut,
      }),

      getAllTransferOuts: builder.query({
        // Uncomment this when the backend is ready
        // query: (params) => ({
        //   params,
        //   url: "/transfer-out",
        //   method: "GET",
        // }),
        // transformResponse: (response) => response.value,
        // transformErrorResponse: (response) => response.value,
        providesTags: ["Transfer Outs"],

        // This is a dummy implementation of the response
        // Remove this when the backend is ready
        queryFn: dummyGetAllTransferOuts,
      }),

      getTransferOutById: builder.query({
        // Uncomment this when the backend is ready
        // query: (id) => ({
        //   url: `/transfer-out/${id}`,
        //   method: "GET",
        // }),
        // transformResponse: (response) => response.value,
        // transformErrorResponse: (response) => response.value,\
        providesTags: ["Transfer Out"],

        // This is a dummy implementation of the response
        // Remove this when the backend is ready
        queryFn: dummyGetTransferOutById,
      }),
    }),
  });

export const {
  useTransferOutMutation,
  useGetAllTransferOutsQuery,
  useLazyGetTransferOutByIdQuery,
  useGetTransferOutByIdQuery,
} = transferOutApi;
