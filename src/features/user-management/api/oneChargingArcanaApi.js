import { api } from "../../api";

const oneChargingApi = api
    .enhanceEndpoints({ addTagTypes: ["Charging"] })
    .injectEndpoints({
        endpoints: (builder) => ({

            getCharging: builder.query({
                query: (params) => ({
                    params: params,
                    url: "/charging",
                    method: "GET",
                }),
                providesTags: ["Charging"],
                transformResponse: (response) => response.value,
                transformErrorResponse: (response) => response.value,
            }),

            syncCharging: builder.mutation({
                query: () => ({
                    url: "/charging/sync",
                    method: "POST",
                }),
                invalidatesTags: ["Charging"],
            }),

        }),
    });

export const {
    useGetChargingQuery,
    useSyncChargingMutation
} = oneChargingApi;
