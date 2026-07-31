import { api } from "../../api";

const subTerritoryApi = api
  .enhanceEndpoints({ addTagTypes: ["Sub"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      postSubTeritory: builder.mutation({
        query: (body) => ({
          url: "/SubTerritory",
          method: "POST",
          body: body,
        }),
        invalidatesTags: ["Sub"],
      }),

      getSubTerritory: builder.query({
        query: (params) => ({
          params: params,
          url: "/SubTerritory",
          method: "GET",
        }),
        providesTags: ["Sub"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),

      getSubTerritoryId: builder.query({
        query: ({ params, id }) => ({
          params: params,
          url: `/SubTerritory/${id}`,
          method: "GET",
        }),
        providesTags: ["Sub"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),

      patchSubTerritory: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/SubTerritory/${id}`,
          method: "PATCH",
          body: body,
        }),
        invalidatesTags: ["Sub"], // ✅ match providesTags
      }),

      patchSubTerritoryStatus: builder.mutation({
        query: (id) => ({
          url: `/SubTerritory/toggle-archive/${id}`,
          method: "PATCH",
        }),
        invalidatesTags: ["Sub"], // ✅
      }),
    }),
  });

export const {
  useGetSubTerritoryIdQuery,
  useGetSubTerritoryQuery,
  useLazyGetSubTerritoryIdQuery,
  useLazyGetSubTerritoryQuery,
  usePatchSubTerritoryMutation,
  usePatchSubTerritoryStatusMutation,
  usePostSubTeritoryMutation,
} = subTerritoryApi;
