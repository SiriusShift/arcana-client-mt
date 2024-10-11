import { api } from "../../api";

const chequeApi = api
    .enhanceEndpoints({ addTagTypes: ["Cheque"] })
    .injectEndpoints({
      endpoints: (build) => ({
        getCheque: build.query({
          query: (params) => ({
            url: `/listing-to-check`,
            method: "GET",
            params
          }),
          providesTags: ["Cheque"],
          transformResponse: (response) => response.value
        }),
        postCheque: build.mutation({
          query: (body) => ({
            url: '/listing-to-check',
            method: 'POST',
            body: body, // Pass the body object here
          }),
          invalidatesTags: ['Cheque'], // Optional for cache invalidation
          transformResponse: (response) => response.value
        })
    })
});

export const { useGetChequeQuery, usePostChequeMutation } = chequeApi