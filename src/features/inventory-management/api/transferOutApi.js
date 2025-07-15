import { api } from "../../api";
import {
  dummyGetAllTransferOuts,
  dummyGetTransferOutById,
  dummyTransferOut,
} from "../../../utils/DummyQueryFn";

const transferOutApi = api
  .enhanceEndpoints({
    addTagTypes: ["Transfer Out", "Transfer Outs", "Items With BBD", "Return To Depot"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      transferOut: builder.mutation({
        query: (body) => ({
          url: `/add-transfer-out`,
          method: "POST",
          body,
        }),
        invalidatesTags: ["Transfer Out", "Transfer Outs", "Items With BBD", "Return To Depot"],

        // This is a dummy implementation of the request
        // Remove this when the backend is ready
        // queryFn: dummyTransferOut,
      }),

      getAllTransferOuts: builder.query({
        // Uncomment this when the backend is ready
        query: (params) => ({
          params,
          url: "/get-transfer",
          method: "GET",
        }),
        // transformErrorResponse: (response) => response.value,
        providesTags: ["Transfer Outs"],

        // This is a dummy implementation of the response
        // Remove this when the backend is ready
        // queryFn: dummyGetAllTransferOuts,
      }),

      getReturnToDepot: builder.query({
        query: (params) => ({
          url: "/GetTransferToDepot",
          method: "GET",
          params,
        }),
        providesTags: ["Return To Depot"],
        // transformResponse: (response) => response.value
      }),

      // getTransferOutById: builder.query({
      //   // Uncomment this when the backend is ready
      //   // query: (id) => ({
      //   //   url: `/transfer-out/${id}`,
      //   //   method: "GET",
      //   // }),
      //   // transformResponse: (response) => response.value,
      //   // transformErrorResponse: (response) => response.value,\
      //   providesTags: ["Transfer Out"],

      //   // This is a dummy implementation of the response
      //   // Remove this when the backend is ready
      //   queryFn: dummyGetTransferOutById,
      // }),
    }),
  });

export const {
  useTransferOutMutation,
  useGetAllTransferOutsQuery,
  useLazyGetTransferOutByIdQuery,
  useGetTransferOutByIdQuery,
  useGetReturnToDepotQuery
} = transferOutApi;
