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
        patchTimeOut: builder.mutation({
            query: (id) => ({
                url: `/add-time-out/${id}`,
                method: "PATCH",
            }),
            invalidatesTags: ["Checkin"],
            transformResponse: (response) => response.value,
        }),
    }),
})
export const {useGetCheckinQuery, usePostCheckinMutation, usePatchTimeOutMutation} = checkinApi