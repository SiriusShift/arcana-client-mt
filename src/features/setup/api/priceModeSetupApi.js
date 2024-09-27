import { api } from "../../api";

const priceModeSetupApi = api
  .enhanceEndpoints({ addTagTypes: ["Price Mode Setup", "Price Mode Items"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      postPriceMode: builder.mutation({
        query: (body) => ({
          url: "/price-mode-with-items",
          method: "POST",
          body: body,
        }),
        invalidatesTags: ["Price Mode Setup"],
      }),

      getAllItemsForPriceModeManagement: builder.query({
        query: (params) => ({
          params: params,
          url: "/price-mode-management-items",
          method: "GET",
        }),
        providesTags: ["Price Mode Items"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),

      getAllPriceMode: builder.query({
        query: (params) => ({
          params: params,
          url: "/price-mode/page",
          method: "GET",
        }),
        providesTags: ["Price Mode Setup"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),

      getAllPriceModeForClients: builder.query({
        query: () => ({
          url: "/price-mode",
          method: "GET",
        }),
        providesTags: ["Price Mode Setup"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),

      putPriceMode: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/price-mode/${id}/information`,
          method: "PUT",
          body: body,
        }),
        invalidatesTags: ["Price Mode Setup"],
      }),

      patchPriceModeStatus: builder.mutation({
        query: (id) => ({
          url: `/price-mode/${id}`,
          method: "PATCH",
        }),
        invalidatesTags: ["Price Mode Setup", "Price Mode Items"],
      }),
    }),
  });

export const {
  usePostPriceModeMutation,
  useGetAllPriceModeQuery,
  useGetAllItemsForPriceModeManagementQuery,
  useGetAllPriceModeForClientsQuery,
  usePutPriceModeMutation,
  usePatchPriceModeStatusMutation,
} = priceModeSetupApi;
