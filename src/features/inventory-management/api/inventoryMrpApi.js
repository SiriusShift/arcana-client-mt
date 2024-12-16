import { dummyGetInventoryMrp } from "../../../utils/DummyQueryFn";
import { api } from "../../api";

const inventoryMrpApi = api
  .enhanceEndpoints({ addTagTypes: ["Inventory MRP"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getInventoryMrp: builder.query({
        // Uncomment this when the backend is ready
        query: (params) => ({
          params: params,
          url: "/get-inventory-mrp",
          method: "GET",
        }),
        invalidatesTags: ["Inventory MRP"],
        transformResponse : (response) => response.value
      }),
    }),
  });

export const { useGetInventoryMrpQuery } = inventoryMrpApi;
