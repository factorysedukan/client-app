import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import TokenHandler from "src/Utils/TokenHandler";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_APP_JIO_FACTORY_ADMIN_URL,
});

export const loginApi = createApi({
  reducerPath: "loginApi",
  baseQuery: baseQuery,
  tagTypes: ["Login"],
  endpoints: (builder) => ({
    loginApi: builder.mutation({
      query: (data) => ({
        url: `api/v1/auth/login`,
        method: "POST",
        body: data,
        
      }),
    //   providesTags: ["otp/mobileNumber"],
    }),
    loginWithPwdApi: builder.mutation({
      query: (data) => ({
        url: `/api/v1/accounts/sso/login/`,
        method: "POST",
        body: data,
        headers: {
          "use-method": "web_pass",
          sf: 8,
        },
      }),
      providesTags: ["login/password/verify"],
    }),
    verifyLoginOtpApi: builder.mutation({
      query: (data) => ({
        url: `/api/v1/accounts/sso/login/`,
        method: "POST",
        body: data,
        headers: {
          "use-method": "web",
          sf: 8,
          token: TokenHandler?.getLoginAccessToken(),
          // token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX3Nlc3Npb24iOiJta2ZseXQ1eDNyNDM1ZWRla2k4bGc2ZmduMmZmMmZ0dSIsInNmIjoiOCJ9.jnIYd6JZYc-kmtYoNnMB6dsSVrgBIDmP0HMSwxwuPo8',
        },
      }),
      providesTags: ["login/otp/verify"],
    }),
    logoutApi: builder.mutation({
      query: (data) => ({
        url: `/account/sso_logout/`,
        method: "POST",
        body: data,
        headers: {
          "access-token": TokenHandler?.getLogoutToken(),
        },
      }),
      providesTags: ["logout"],
    }),
  }),
});

export const {
  useLoginApiMutation,
  useLoginWithPwdApiMutation,
  useVerifyLoginOtpApiMutation,
  useLogoutApiMutation,
} = loginApi;
