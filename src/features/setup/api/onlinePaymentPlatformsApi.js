import { api } from "../../api";

const onlinePaymentPlatformsApi = api
  .enhanceEndpoints({ addTagTypes: ["Online Payment"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      createOnlinePlatofrm: builder.mutation({
        query: (body) => ({
          url: "/OnlinePayment/AddNewOnlinePayment",
          method: "POST",
          body: body,
        }),
        invalidatesTags: ["Online Payment"],
      }),
      getAllOnlinePlatforms: builder.query({
        query: (params) => ({
          params: params,
          url: "/OnlinePayments",
          method: "GET",
        }),
        providesTags: ["Online Payment"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),
      updateOnlinePlatform: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/UpdateOnlinePayment/${id}`,
          method: "PUT",
          body,
        }),
        invalidatesTags: ["Online Payment"],
      }),
      updateOnlinePlatformStatus: builder.mutation({
        query: (id) => ({
          url: `/OnlinePayment/UpdateOnlinePaymentStatus/${id}`,
          method: "PATCH",
        }),
        invalidatesTags: ["Online Payment"],
      }),
    }),
  });

export const {
  useGetAllOnlinePlatformsQuery,
  useCreateOnlinePlatofrmMutation,
  useUpdateOnlinePlatformMutation,
  useUpdateOnlinePlatformStatusMutation,
} = onlinePaymentPlatformsApi;
