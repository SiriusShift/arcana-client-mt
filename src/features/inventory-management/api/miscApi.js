import { api } from "../../api";

export const miscApi = api.enhanceEndpoints({ addTagTypes: ["Misc In", "Misc Out"] }).injectEndpoints({
    endpoints: (builder) => ({
        postMiscReceipt: builder.mutation({
            query: (body) => ({
                url: "/add-misc-in",
                method: "POST",
                body
            }),
            invalidatesTags: ["Misc In", "Orders"]
        }),

        getMiscIssue: builder.query({
            query: (params) => ({
                params: params,
                url: "/get-misc-out",
                method: "GET"
            }),
            providesTags: ["Misc Out"]
        }),

        postMiscIssue: builder.mutation({
            query: (body) => ({
                url: "/add-misc-out",
                method: "POST",
                body
            }),
            invalidatesTags: ["Misc Out"]
        })
    }),
})

export const { usePostMiscReceiptMutation, useGetMiscIssueQuery, usePostMiscIssueMutation } = miscApi