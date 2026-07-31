import { api } from "../../api";

const approverApi = api
  .enhanceEndpoints({ addTagTypes: ["Approver", "Modules"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAllApprovers: builder.query({
        query: () => ({
          url: "/Approvers/GetAllApprovers",
          method: "GET",
        }),
        providesTags: ["Approver"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),

      addApproversPerModule: builder.mutation({
        query: (body) => ({
          url: "/Approvers/AssignApprover",
          method: "POST",
          body,
        }),
        invalidatesTags: ["Approver"],
      }),

      getApproversPerModule: builder.query({
        query: () => ({
          url: "/Approver/GetApproversPerModules",
          method: "GET",
        }),
        providesTags: ["Approver"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),

      getApproversByModule: builder.query({
        query: (params) => ({
          url: "/Approver/GetApproverByModule",
          method: "GET",
          params,
        }),
        providesTags: ["Approver"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),

      putUpdateApproversPerModule: builder.mutation({
        query: ({ moduleName, ...body }) => ({
          url: `/Approver/UpdateApproversPerModule`,
          method: "PUT",
          params: { moduleName },
          body,
        }),
        invalidatesTags: ["Approver"],
      }),


      getUsersForAddItemsApprovers: builder.query({
        query: () => ({
          url: `/EditClientRequest/users-for-add-item-approvers`,
          method: "GET",
        }),
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
        providesTags: ["Approver"]
      }),
      getUsersForEditClientsApprovers: builder.query({
        query: () => ({
          url: `/EditClientRequest/users-for-edit-client-approvers`,
          method: "GET",
        }),
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
        providesTags: ["Approver"]

      }),
      getAddItemsApprovers: builder.query({
        query: () => ({
          url: `/EditClientRequest/add-item-approvers`,
          method: "GET",
        }),
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
        providesTags: ["Approver"]

      }),
      getEditClientsApprovers: builder.query({
        query: () => ({
          url: `/EditClientRequest/edit-client-approvers`,
          method: "GET",
        }),
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
        providesTags: ["Approver"]

      }),

      updateAddItemsApprovers: builder.mutation({
        query: (body) => ({
          url: `/EditClientRequest/update-add-item-approvers`,
          method: "PATCH",
          body
        }),
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
        invalidatesTags: ["Approver"],

      }),

      updateEditClientApprovers: builder.mutation({
        query: (body) => ({
          url: `/EditClientRequest/update-edit-client-approvers`,
          method: "PATCH",
          body
        }),
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
        invalidatesTags: ["Approver"],
      }),

      getApproverModules: builder.query({
        query: () => ({
          url: `/approvals/settings/modules`,
          method: "GET",
        }),
        // transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
        invalidatesTags: ["Modules"],
      }),

      getApproverModuleCandidates: builder.query({
        query: ({ moduleName }) => ({
          url: `/approvals/settings/candidates/${moduleName}`,
          method: "GET",
        }),
        // transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
        invalidatesTags: ["Approver"],
      }),

      getApproversOfModule: builder.query({
        query: ({ moduleName }) => ({
          url: `/approvals/settings/${moduleName}`,
          method: "GET",
        }),
        // transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
        invalidatesTags: ["Approver"],
      }),

      updateApproversOfModule: builder.mutation({
        query: ({ moduleName, body }) => ({
          url: `/approvals/settings/${moduleName}`,
          method: "PUT",
          body,
        }),
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
        invalidatesTags: ["Approver"],
      }),

      updateApproversOfExpenses: builder.mutation({
        query: ({ moduleName, body }) => ({
          url: `/approvals/settings/expenses`,
          method: "PUT",
          body
        }),
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
        invalidatesTags: ["Approver"],
      })
    }),
  });

export const {
  useGetAllApproversQuery,
  useAddApproversPerModuleMutation,
  useGetApproversPerModuleQuery,
  usePutUpdateApproversPerModuleMutation,
  useGetApproversByModuleQuery,
  useGetUsersForAddItemsApproversQuery,
  useGetUsersForEditClientsApproversQuery,
  useGetAddItemsApproversQuery,
  useGetEditClientsApproversQuery,
  useUpdateAddItemsApproversMutation,
  useUpdateEditClientApproversMutation,
  useGetApproverModulesQuery,
  useLazyGetApproverModulesQuery,
  useGetApproverModuleCandidatesQuery,
  useLazyGetApproverModuleCandidatesQuery,
  useGetApproversOfModuleQuery,
  useLazyGetApproversOfModuleQuery,
  useUpdateApproversOfExpensesMutation,
  useUpdateApproversOfModuleMutation
} = approverApi;
