import { api } from "../../api";

const filterApi = api.enhanceEndpoints({
  addTagTypes: [
    "clusterFilter",
    "paymentMethodFilter",
    "expenseTypeFilter",
    "businessType",
    "invoiceTypeFilter",
    "validityFilter",
    "uploadStatusFilter",
    "frequenceFilter",
    "paymentTypeFilter",
    "statusFilter",
  ],
}).injectEndpoints({
  endpoints: (builder) => ({
    // Payment Transaction Filter
    getAllTransactions: builder.query({
        query: (params) => ({
          url: "/sales-transaction/page",
          method: "GET",
          params
        }),
        providesTags: ["clusterFilter"],
    })
  }),
});

export const { useGetAllTransactionsQuery } = filterApi;