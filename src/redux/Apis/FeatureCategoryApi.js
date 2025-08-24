// import { API_CONFIG } from "src/services/constants";
import { API_CONFIG } from "../../services/constants";
import { commonFactoryApi } from "./commonApiSlice";

// import { apiSlice } from "./apiSlice";
const apiWithTag = commonFactoryApi.enhanceEndpoints({
  addTagTypes: ["featureCategorys", "stickers"],
});
export const featureCartegory = apiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    /*************# GET API PRODUCTS  #*************/
    getFeatureCategories: builder.mutation({
      query: (data) => {
        // Log data here
        // console.log("Data for paginated featureCategorys:", API_CONFIG.GET_ALL_PRODUCTS); // Log data here
        return {
          url: `${API_CONFIG.GET_FEATURE_CATEGORIES}`,
          method: "GET",
        //   params: {
        //     page: data.page,
        //     limit: data.limit,
        //   },
        };
        
      },
      keepUnusedDataFor: 0, // Keep data for 5 minutes
      providesTags: ["featureCategorys"],
    }),

    // downloadProductJsonApi: builder.mutation({
    //   query: (id) => {
    //     // Log data here
    //     return {
    //       url: `${API_CONFIG.DOWNLOAD_JSON}/${id}/download-json`,
    //       method: "GET",

    //       headers: {
    //         //   "Content-type": "application/json",
    //         //   'Content-Type':
    //         // 'multipart/form-data; boundary="yet another boundary"',
    //       },
    //     };
    //   },
    //   // providesTags: ["Products"],
    // }),

    // downloadProductImageZip: builder.mutation({
    //   query: (id) => {
    //     // Log data here
    //     return {
    //       url: `${API_CONFIG.DOWNLOAD_IMAGE_ZIP}/${id}/download-Images`,
    //       method: "GET",

    //       headers: {
    //         //   "Content-type": "application/json",
    //         //   'Content-Type':
    //         // 'multipart/form-data; boundary="yet another boundary"',
    //       },
    //     };
    //   },
    //   // providesTags: ["Products"],
    // }),

    // searchFeatureCategory: builder.mutation({
    //   query: (data) => {
    //     // Log data here
    //     return {
    //       url: `${API_CONFIG.SEARCH_PACKAGE}`,
    //       method: "GET",
    //       params: data,
    //       headers: {
    //         //   "Content-type": "application/json",
    //         //   'Content-Type':
    //         // 'multipart/form-data; boundary="yet another boundary"',
    //       },
    //     };
    //   },
    //   // providesTags: ["Products"],
    // }),

    // typesOfProductsApi: builder.query({
    //   query: (id) => {
    //     // Log data here
    //     return {
    //       url: `${API_CONFIG.TYPES_OF_PRODUCTS}`,
    //       method: "GET",
    //       headers: {
    //         //   "Content-type": "application/json",
    //         //   'Content-Type':
    //         // 'multipart/form-data; boundary="yet another boundary"',
    //       },
    //     };
    //   },
    //   // providesTags: ["Products"],
    // }),

    // /*************# POST API GET  #*************/
    createFeatureCategory: builder.mutation({
      query: (data) => {
        console.log("D1", data); // Log data here

        return {
          url: `${API_CONFIG.GET_FEATURE_CATEGORIES}`,
          method: "POST",
          body: data,
          headers: {
            // "Content-type": "application/json",
              // 'Content-Type':'multipart/form-data'
            // boundary="yet another boundary"',
          },
        };
      },
      // providesTags: ["Stickers"],
    }),

    // createProductVersionApi: builder.mutation({
    //   query: (data) => {
    //     // console.log(data); // Log data here
    //     return {
    //       url: `${API_CONFIG.CREATE_PACKAGE_VERSION}/${data.id}/versions`,
    //       method: "POST",
    //       body: data.body,
    //       headers: {
    //         //   "Content-type": "application/json",
    //         //   'Content-Type':
    //         // 'multipart/form-data; boundary="yet another boundary"',
    //       },
    //     };
    //   },
    //   // providesTags: ["Stickers"],
    // }),

    // //  ****************PACKAGE  API PUT **************
    // updateFeatureCategory: builder.mutation({
    //   query: (data) => {
    //     console.log(data); // Log data here

    //     return {
    //       url: `${API_CONFIG.EDIT_PRODUCT}${data.id}`,
    //       method: "PUT",
    //       body: data.body,
    //       headers: {
    //         // "Content-type": "application/json",
    //         //   'Content-Type':
    //         // 'multipart/form-data; boundary="yet another boundary"',
    //       },
    //     };
    //   },
    //   // providesTags: ["Stickers"],
    // }),

    // // //************PACKAGE DELETE API *********************8/
    // deleteFeatureCategory: builder.mutation({
    //   query: (id) => {
    //     return {
    //       url: `${API_CONFIG.DELETE_PRODUCT}${id}`,
    //       method: "DELETE",
    //       headers: {
    //         // "Content-type": "application/json",
    //         //   'Content-Type':
    //         // 'multipart/form-data; boundary="yet another boundary"',
    //       },
    //     };
    //   },
    //   invalidatesTags: ["Products"],
    // }),

    // getProductByID: builder.mutation({
    //   query: (id) => {
    //     // Log data here
    //     return {
    //       url: `${API_CONFIG.GET_PRODUCT_BY_ID}${id}`,
    //       method: "GET",
    //       headers: {
    //         //   "Content-type": "application/json",
    //         //   'Content-Type':
    //         // 'multipart/form-data; boundary="yet another boundary"',
    //       },
    //     };
    //   },
    //   // providesTags: ["Products"],
    // }),
  }),
});

export const {  
    useGetFeatureCategoriesMutation // <-- add this export
//   useGetProductByIDMutation,
//   useListProductsApiMutation,
//   useCreateFeatureCategoryMutation,
//   useCreateProductVersionApiMutation,
//   useDownloadProductJsonApiMutation,
//   useTypesOfProductsApiQuery,
//   useUpdateFeatureCategoryMutation,
//   useSearchFeatureCategoryMutation,
//   useDownloadProductImageZipMutation,
//   useDeleteFeatureCategoryMutation,
} = featureCartegory;

/*
 *   Copyright (c) 2023 Jio Platforms Ltd
 *   All rights reserved.
 *   /************************************************************* * * Jio Platforms Ltd. * CONFIDENTIAL * __________________ * *  Copyright (C) 2020 Jio \n Platforms Ltd.– * *  ALL RIGHTS RESERVED. * * NOTICE:  All information \n including computer software along with source code and associated * documentation contained herein is, and remains the property of Jio Platforms Ltd..  * The intellectual and technical concepts contained herein are  proprietary to Jio Platforms Ltd. * and are protected by copyright law or as trade secret under confidentiality obligations.   * Dissemination, storage, transmission or reproduction of this information * in any part or full is strictly forbidden unless prior written  * permission along with agreement for any usage right is obtained from Jio Platforms Ltd **************************************************************
 */
