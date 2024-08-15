import { api } from "../../api";
import {
  dummyGetAllFreebiesRequests,
  dummyGetFreebieRequestById,
  dummyRequestFreebies,
} from "../../../utils/DummyQueryFn";

const freebiesApi = api
  .enhanceEndpoints({ addTagTypes: ["Freebie", "Freebies", "Items With BBD"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      requestFreebies: builder.mutation({
        // query: (body) => ({
        //   url: `/freebies-inventory`,
        //   method: "POST",
        //   body,
        // }),
        invalidatesTags: ["Freebie", "Freebies", "Items With BBD"],

        // This is a dummy implementation of the request
        // Remove this when the backend is ready
        queryFn: dummyRequestFreebies,
      }),

      getAllFreebieRequests: builder.query({
        // Uncomment this when the backend is ready
        // query: (params) => ({
        //   params,
        //   url: "/freebies-inventory",
        //   method: "GET",
        // }),
        // transformResponse: (response) => response.value,
        // transformErrorResponse: (response) => response.value,
        providesTags: ["Freebies"],

        // This is a dummy implementation of the response
        // Remove this when the backend is ready
        queryFn: dummyGetAllFreebiesRequests,
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
    }),
  });

export const {
  useRequestFreebiesMutation,
  useGetAllFreebieRequestsQuery,
  useGetFreebieRequestByIdQuery,
} = freebiesApi;
