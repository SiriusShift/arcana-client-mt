import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_SEDAR_BASE_URL;

export const sedarApi = createApi({
  reducerPath: "sedarApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      headers.set(
        "Authorization",
        `Bearer ${import.meta.env.VITE_SEDAR_TOKEN}`
      );
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAllEmployees: builder.query({
      query: (params) => ({
        url: "/api/data/employee/filter/active",
        method: "GET",
        params
      }),
      transformResponse: (response) => response.data,
    }),
    getEmployeeById: builder.query({
      query: (params) => ({
        url: "/api/data/employee/filter/idnumber",
        method: "GET",
        params: params,
      }),
    }),
  }),
});

export const { useGetEmployeeByIdQuery, useLazyGetAllEmployeesQuery, useGetAllEmployeesQuery } = sedarApi;
