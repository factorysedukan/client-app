import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

//import { setCredentials, logOut } from '../../features/auth/authSlice'

const handleLogout=()=>{
    localStorage.clear();
    window.location.reload()
  }
const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_APP_JIO_FACTORY_ADMIN_URL,
    // credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      console.log('getState',getState())
        const token = getState().login?.loginState?.token || false;
        if (token ) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    } 
})


const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)
  // console.log('api11',result)
    //  if(result?.error?.status === 401) {
    //    // send refresh token to get new access token 
    //   //  console.log('api11',api.endpoint)
    //    handleLogout()
    //     // if(api.endpoint !== "getLoginApi")
    //     // {
    //     //     const refreshResult = await baseQuery(API_CONFIG.LOGOUT, api, extraOptions)
    //     //     //console.log(refreshResult);
    //     //     api.dispatch(resetLoginData())
    //     // }
    // } 
  
    return result
  }

export const commonFactoryApi = createApi({
    reducerPath:'commonAcsApi',
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({})
})