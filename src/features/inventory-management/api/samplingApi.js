import { api } from "../../api";
import {
  dummyGetAllSamplings,
  dummyAddSampling,
  dummyGetSamplingById,
} from "../../../utils/DummyQueryFn";

const samplingsApi = api
  .enhanceEndpoints({
    addTagTypes: ["Sampling", "Samplings", "Items With BBD", "SamplingReturn"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      addSampling: builder.mutation({
        query: (body) => ({
          url: `/add-freebie-order`,
          method: "POST",
          body,
        }),
        invalidatesTags: ["Sampling", "Samplings", "Items With BBD"],

        // This is a dummy implementation of the request
        // Remove this when the backend is ready
        // queryFn: dummyAddSampling,
      }),

      getAllSamplings: builder.query({
        // Uncomment this when the backend is ready
        query: (params) => ({
          params,
          url: "/get-freebie-order",
          method: "GET",
        }),
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
        providesTags: ["Samplings"],

        // This is a dummy implementation of the response
        // Remove this when the backend is ready
        // queryFn: dummyGetAllSamplings,
      }),

      getSamplingById: builder.query({
        // Uncomment this when the backend is ready
        // query: (id) => ({
        //   url: `/sampling",/${id}`,
        //   method: "GET",
        // }),
        // transformResponse: (response) => response.value,
        // transformErrorResponse: (response) => response.value,\
        providesTags: ["Sampling"],

        // This is a dummy implementation of the response
        // Remove this when the backend is ready
        queryFn: dummyGetSamplingById,
      }),
      patchApproveFreebiesById: builder.mutation({
        query: ({ moduleName, id }) => ({
          url: `/ApproveFreebieOrders/${id}`,
          method: "PATCH",
          params: moduleName,
        }),
        invalidatesTags: ["Samplings"],
      }),
      getSamplingReturns: builder.query({
        query: (params) => ({
          url: "/GetSamplingReturns",
          method: "GET",
          params: params,
        }),
        transformResponse: (response) => response.value,
        providesTags: ["SamplingReturn"],
      }),
      postAddReturnFromSampling: builder.mutation({
        query: (body) => ({
          url: "/AddReturnFromSampling",
          method: "POST",
          body,
        }),
        invalidatesTags: ["SamplingReturn"],
      }),
      patchApproveSamplingById: builder.mutation({
        query: ({ moduleName, id }) => ({
          url: `/ApproveFreebieOrders/${id}`,
          method: "PATCH",
          params: moduleName,
        }),
        invalidatesTags: ["Samplings"],
      }),
    }),
  });

export const {
  useAddSamplingMutation,
  useGetAllSamplingsQuery,
  useGetSamplingByIdQuery,
  usePatchApproveSamplingByIdMutation,
  useGetSamplingReturnsQuery,
  usePostAddReturnFromSamplingMutation,
} = samplingsApi;
