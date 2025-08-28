import { api } from "../../api";
import {
  dummyGetAllFreebiesRequests,
  dummyGetFreebieRequestById,
  dummyRequestFreebies,
} from "../../../utils/DummyQueryFn";

export const freebiesApi = api
  .enhanceEndpoints({ addTagTypes: ["Freebie", "Freebies", "Items With BBD"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      requestFreebies: builder.mutation({
        query: (body) => ({
          url: `/add-freebie-order`,
          method: "POST",
          body,
        }),
        invalidatesTags: ["Freebie", "Freebies", "Items With BBD"],

        // This is a dummy implementation of the request
        // Remove this when the backend is ready
        // queryFn: dummyRequestFreebies,
      }),

      getAllFreebieRequests: builder.query({
        // Uncomment this when the backend is ready
        query: (params) => ({
          params,
          url: "/get-freebie-order",
          method: "GET",
        }),
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
        providesTags: ["Freebies"],

        // This is a dummy implementation of the response
        // Remove this when the backend is ready
        // queryFn: dummyGetAllFreebiesRequests,
      }),

      putReleaseFreebieRequest: builder.mutation({
        query: ({ id, body }) => ({
          url: `/ReleaseFreebieOrders/${id}`,
          method: "PUT",
          body: body,
        }),
        invalidatesTags: ["Freebies"],
      }),

      getFreebieRequestById: builder.query({
        // Uncomment this when the backend is ready
        // query: (id) => ({
        //   url: `/freebies-inventory/${id}`,
        //   method: "GET",
        // }),
        // transformResponse: (response) => response.value,
        // transformErrorResponse: (response) => response.value,\
        providesTags: ["Freebie"],

        // This is a dummy implementation of the response
        // Remove this when the backend is ready
        queryFn: dummyGetFreebieRequestById,
      }),
      patchApproveById: builder.mutation({
        query: ({moduleName, id}) => ({
          url: `/ApproveFreebieOrders/${id}`,
          method: "PATCH",
          params: moduleName
        }),
        invalidatesTags: ["Freebies"],
      }),
      getApprovalFreebieHistory: builder.query({
        query: ({moduleName, id}) => ({
          url: `/ApprovalFreebieHistory/${id}`,
          method: "GET",
          params: moduleName
        }),
        transformResponse: (response) => response.value
      })
    }),
  });

export const {
  useRequestFreebiesMutation,
  useGetAllFreebieRequestsQuery,
  useGetFreebieRequestByIdQuery,
  usePutReleaseFreebieRequestMutation,
  usePatchApproveByIdMutation,
  useLazyGetApprovalFreebieHistoryQuery
} = freebiesApi;
