import { api } from "../../api";

const approverSettingsApi = api
  .enhanceEndpoints({ addTagTypes: ["Approver Settings"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getApproversByRange: builder.query({
        query: (params) => ({
          url: "/Approver/GetApproverByRange",
          method: "GET",
          params,
        }),
        providesTags: ["Approver Settings"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),

      updateApproversByRange: builder.mutation({
        query: ({ params, body }) => ({
          url: `/UpdateApproverByRange/UpdateApproversPerModuleByRange`,
          method: "PUT",
          params,
          body,
        }),
        invalidatesTags: ["Approver Settings"],
      }),
    }),
  });

export const {
  useGetApproversByRangeQuery,
  useLazyGetApproversByRangeQuery,
  useUpdateApproversByRangeMutation,
} = approverSettingsApi;
