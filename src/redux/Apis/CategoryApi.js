// import { API_CONFIG } from "src/services/constants";
import { API_CONFIG } from "../../services/constants";
import { commonFactoryApi } from "./commonApiSlice";

const apiWithTag = commonFactoryApi.enhanceEndpoints({
  addTagTypes: ["categories"],
});
export const categoryApi = apiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    /*************# GET API PRODUCTS  #*************/
    getCategoryApi: builder.query({
      query: () => ({
        url: `${API_CONFIG.SHOW_ALL_CATEGORIES}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0, // Keep data for 5 minutes
      providesTags: ["categories"],
    }),

    // Get category by ID
    getCategoryByID: builder.mutation({
      query: (id) => ({
        url: `${API_CONFIG.GET_CATEGORY_BY_ID}${id}`,
        method: "GET",
      }),
      providesTags: ["categories"],
    }),

    // Create category
    createCategoryApi: builder.mutation({
      query: (data) => ({
        url: `${API_CONFIG.CREATE_CATEGORY}`,
        method: "POST",
        body: data,
        headers: {
          // "Content-type": "application/json",
        },
      }),
      invalidatesTags: ["categories"],
    }),

    // Update category
    updateCategoryApi: builder.mutation({
      query: ({ id, body }) => ({
        url: `${API_CONFIG.EDIT_CATEGORY}${id}`,
        method: "PUT",
        body,
        headers: {
          // "Content-type": "application/json",
        },
      }),
      invalidatesTags: ["categories"],
    }),

    // Delete category
    deleteCategoryApi: builder.mutation({
      query: (id) => ({
        url: `${API_CONFIG.DELETE_CATEGORY}${id}`,
        method: "DELETE",
        headers: {
          // "Content-type": "application/json",
        },
      }),
      invalidatesTags: ["categories"],
    }),
  }),
});

export const {
  useGetCategoryApiQuery,
  useGetCategoryByIDMutation,
  useCreateCategoryApiMutation,
  useUpdateCategoryApiMutation,
  useDeleteCategoryApiMutation, // <-- add this export
} = categoryApi;

/*
 *   Copyright (c) 2023 Jio Platforms Ltd
 *   All rights reserved.
 *   /************************************************************* * * Jio Platforms Ltd. * CONFIDENTIAL * __________________ * *  Copyright (C) 2020 Jio \n Platforms Ltd.– * *  ALL RIGHTS RESERVED. * * NOTICE:  All information \n including computer software along with source code and associated * documentation contained herein is, and remains the property of Jio Platforms Ltd..  * The intellectual and technical concepts contained herein are  proprietary to Jio Platforms Ltd. * and are protected by copyright law or as trade secret under confidentiality obligations.   * Dissemination, storage, transmission or recategoryion of this information * in any part or full is strictly forbidden unless prior written  * permission along with agreement for any usage right is obtained from Jio Platforms Ltd **************************************************************
 */
