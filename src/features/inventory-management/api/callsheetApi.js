import { dummyCallsheetData } from "../../../utils/DummyInventoryData";
import { dummyGetAllCallsheet } from "../../../utils/DummyQueryFn";
import { api } from "../../api";

const callsheetApi = api
  .enhanceEndpoints({ addTagTypes: ["Callsheet"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAllCallsheets: builder.query({
        // Uncomment this when the backend is ready
        query: (params) => ({
          params,
          url: "/get-callsheet",
          method: "GET",
        }),
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
        // queryFn: dummyGetAllCallsheet,
        providesTags: ["Callsheet"],
      }),
    }),
  });


export const {
    useGetAllCallsheetsQuery,
    // useGetCallSheetByIdQuery,
} = callsheetApi;