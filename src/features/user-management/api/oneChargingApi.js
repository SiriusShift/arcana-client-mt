import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_ONE_CHARGING_BASE_URL;

export const oneChargingApi = createApi({
  reducerPath: "oneChargingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      headers.set(
        "api_key",
        `${import.meta.env.VITE_ONE_CHARGING_TOKEN}`
      );
      return headers;
    },
  }),
  endpoints: (builder) => ({
      getCharging: builder.query({
      query: (params) => ({
        url: "/api/charging_api?status=active&pagination=none",
        method: "GET",
        params
      }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetChargingQuery } = oneChargingApi;
