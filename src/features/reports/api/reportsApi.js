import { api } from "../../api";

const reportsApi = api.enhanceEndpoints({ addTagTypes: ["CDO Report"] }).injectEndpoints(
    {
        endpoints: (builder) => ({
            CDOReports: builder.query({
                query: (params) => ({
                    url: "/CDO-reports",
                    method: "GET",
                    params,
                    responseHandler: (response) => response.blob(),
                }),
                providesTags: ["CDO Report"],
            }),
            ConsolidateApprovedClientsExport: builder.query({
                query: (params) => ({
                    url: "/approved-clients-export",
                    method: "GET",
                    params,
                    responseHandler: (response) => response.blob(),
                })
            })

        })
    }
)

export const { useLazyCDOReportsQuery, useLazyConsolidateApprovedClientsExportQuery } = reportsApi