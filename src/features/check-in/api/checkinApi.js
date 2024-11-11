import {api} from "../../api";

const checkinApi = api.enhanceEndpoints({addTagTypes: ["Checkin"]}).injectEndpoints({
    endpoints: (builder) => ({
        getCheckin: builder.query({
            query: (params) => ({
                url: `/get-check-in`,
                method: "GET",
                params,
            }),
            providesTags: ["Checkin"],
            transformResponse: (response) => response.value,
        }),
        postCheckin: builder.mutation({
            query: (body) => ({
                url: `/add-check-in`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Checkin"],
            transformResponse: (response) => response.value,
        }),
    }),
})
export const {useGetCheckinQuery, usePostCheckinMutation} = checkinApi