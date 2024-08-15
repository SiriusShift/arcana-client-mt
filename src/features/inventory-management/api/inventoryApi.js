import { dummyGetAllItemsWithBbd } from "../../../utils/DummyQueryFn";
import { api } from "../../api";

const inventoryApi = api
  .enhanceEndpoints({ addTagTypes: ["Items With BBD"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAllItemsWithBbd: builder.query({
        // Uncomment this when the backend is ready
        // query: (params) => ({
        //   params,
        //   url: "/items/bbd",
        //   method: "GET",
        // }),
        // transformResponse: (response) => response.value,
        // transformErrorResponse: (response) => response.value,
        providesTags: ["Items with BBD"],

        // This is a dummy implementation of the response
        // Remove this queryFn when the backend is ready
        queryFn: dummyGetAllItemsWithBbd,
      }),
    }),
  });

export const { useGetAllItemsWithBbdQuery } = inventoryApi;
