import { dummyGetInventoryMrp } from "../../../utils/DummyQueryFn";
import { api } from "../../api";

const inventoryMrpApi = api
  .enhanceEndpoints({ addTagTypes: ["Inventory MRP"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getInventoryMrp: builder.query({
        // Uncomment this when the backend is ready
        // query: (params) => ({
        //   params: params,
        //   url: "/inventory-mrp",
        //   method: "GET",
        // }),
        // transformResponse: (response) => response.value,
        // transformErrorResponse: (response) => response.value,
        providesTags: ["Inventory MRP"],

        // This is a dummy implementation of the response
        // Remove this queryFn when the backend is ready
        queryFn: dummyGetInventoryMrp,
      }),
    }),
  });

export const { useGetInventoryMrpQuery } = inventoryMrpApi;
