import { api } from "../../api";

export const reasonApi = api
  .enhanceEndpoints({ addTagTypes: ["Reasons"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getReasons: builder.query({
        query: (params) => ({
          url: "/GetAllReasons/Status",
          method: "GET",
          params,
        }),
        providesTags: ["Reasons"],
      }),
      postReasons: builder.mutation({
        query: (body) => ({
          url: "/AddReasonsOnly/AddReason/AddReason",
          method: "POST",
          body,
        }),
        invalidatesTags: ["Reasons"],
      }),
      deleteReasons: builder.mutation({
        query: (id) => ({
          url: `/Archive/Reason/${id}`,
          method: "PUT",
        }),
        invalidatesTags: ["Reasons"],
      }),
      putReason: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/UpdateReason`,
          method: "PUT",
          body,
        }),
        invalidatesTags: ["Reasons"],
      })
    }),
  });

export const { useGetReasonsQuery, usePostReasonsMutation, useDeleteReasonsMutation, usePutReasonMutation } = reasonApi;
