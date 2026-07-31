import { api } from "../../api";

const distributionApi = api
  .enhanceEndpoints({ addTagTypes: ["Distribution"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      postDistribution: builder.mutation({
        query: (body) => ({
          url: "/DistributionType",
          method: "POST",
          body: body,
        }),
        invalidatesTags: ["Distribution"],
      }),

      getAllDistribution: builder.query({
        query: (params) => ({
          params: params,
          url: "/DistributionType",
          method: "GET",
        }),
        providesTags: ["Distribution"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),

      patchDistribution: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/DistributionType/${id}`,
          method: "PATCH",
          body: body,
        }),
        invalidatesTags: ["Distribution"],
      }),

      patchDistributionStatus: builder.mutation({
        query: (id) => ({
          url: `/DistributionType/toggle-archive/${id}`,
          method: "PATCH",
        }),
        invalidatesTags: ["Distribution"],
      }),
    }),
  });

export const {
    usePostDistributionMutation,
    useGetAllDistributionQuery,
    usePatchDistributionMutation,
    usePatchDistributionStatusMutation
} = distributionApi;
