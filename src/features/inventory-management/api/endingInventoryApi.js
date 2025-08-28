import { api } from "../../api";

const endingInventoryApi = api
  .enhanceEndpoints({ addTagTypes: ["endingInventory", "Schedule"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getEndingInventory: builder.query({
        query: (params) => ({
          url: "/GetInventoryForAdjustments",
          method: "GET",
          params,
        }),
      }),
      getEndingInventoryHistory: builder.query({
        query: (params) => ({
          url: "/GetAdjustmentHistory",
          method: "GET",
          params,
        }),
        providesTags: ["endingInventory"],
        transformResponse: (response) => response.value,
      }),
      getInventoryForAdjustments: builder.query({
        query: (params) => ({
          url: "/GetInventoryForAdjustments",
          method: "GET",
          params,
        }),
        transformResponse: (response) => response.value,
        providesTags: ["endingInventory"],
      }),
      patchEndingInventory: builder.mutation({
        query: ({ body, id }) => {
          return {
            url: `/AdjustInventories/${id}/add-items`,
            method: "PATCH",
            body,
          };
        },
        invalidatesTags: ["endingInventory"],
      }),
      getAdjustmentSchedules: builder.query({
        query: (params) => ({
          url: "/GetAdjustmentSchedules",
          method: "GET",
          params,
        }),
        transformResponse: (response) => response.value,
        providesTags: ["Schedule"],
      }),
      postSetupAdjustmentSchedule: builder.mutation({
        query: (body) => ({
          url: "/SetupAdjustmentSchedule",
          method: "PUT",
          body,
        }),
        invalidatesTags: ["Schedule"],
      }),
      getUsersWithAdjustments: builder.query({
        query: () => ({
          url: "/GetUsersWithAdjustments",
          method: "GET",
        }),
        transformResponse: (response) => response.value,
      }),
    }),
  });

export const {
  useGetEndingInventoryQuery,
  useGetEndingInventoryHistoryQuery,
  useGetInventoryForAdjustmentsQuery,
  usePatchEndingInventoryMutation,
  useGetAdjustmentSchedulesQuery,
  usePostSetupAdjustmentScheduleMutation,
  useGetUsersWithAdjustmentsQuery,
} = endingInventoryApi;
