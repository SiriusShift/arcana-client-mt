import { api } from "../../api";

const territoryApi = api
  .enhanceEndpoints({ addTagTypes: ["Territory"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      postTerritory: builder.mutation({
        query: (body) => ({
          url: "/Territory",
          method: "POST",
          body: body,
        }),
        invalidatesTags: ["Territory"],
      }),

      getTerritory: builder.query({
        query: (params) => ({
          params: params,
          url: "/Territory",
          method: "GET",
        }),
        providesTags: ["Territory"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),

      getTerritoryId: builder.query({
        query: ({params, id}) => ({
          params: params,
          url: `/Territory/${id}`,
          method: "GET",
        }),
        providesTags: ["Territory"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),

      patchTerritory: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/Territory/${id}`,
          method: "PATCH",
          body: body,
        }),
        invalidatesTags: ["Territory"],
      }),

      patchTerritoryStatus: builder.mutation({
        query: (id) => ({
          url: `/Territory/toggle-archive/${id}`,
          method: "PATCH",
        }),
        invalidatesTags: ["Territory"],
      }),
      
    }),
  });

export const {
    useGetTerritoryIdQuery,
    useGetTerritoryQuery,
    useLazyGetTerritoryIdQuery,
    useLazyGetTerritoryQuery,
    usePatchTerritoryStatusMutation,
    usePatchTerritoryMutation,
    usePostTerritoryMutation,
} = territoryApi;
