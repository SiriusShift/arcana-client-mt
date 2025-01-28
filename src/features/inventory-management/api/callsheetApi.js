import { dummyCallsheetData } from "../../../utils/DummyInventoryData";
import { dummyGetAllCallsheet } from "../../../utils/DummyQueryFn";
import { api } from "../../api";

const callsheetApi = api
  .enhanceEndpoints({ addTagTypes: ["Callsheet"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAllCallsheets: builder.query({
        queryFn: dummyGetAllCallsheet,
        providesTags: ["Callsheet"],
      }),
    }),
  });


export const {
    useGetAllCallsheetsQuery,
    // useGetCallSheetByIdQuery,
} = callsheetApi;