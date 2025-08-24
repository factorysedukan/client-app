// import { API_CONFIG } from "src/services/constants";
import { API_CONFIG } from "../../services/constants";
import { commonFactoryApi } from "./commonApiSlice";

const apiWithTag = commonFactoryApi.enhanceEndpoints({
  addTagTypes: ["categories"],
});
export const colorsApi = apiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    /*************# GET API PRODUCTS  #*************/
    getColorsApi: builder.query({
      query: () => ({
        url: `${API_CONFIG.SHOW_ALL_COLORS}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0, // Keep data for 5 minutes
      providesTags: ["categories"],
    }),

    // Get colors by ID
    getColorsByID: builder.mutation({
      query: (id) => ({
        url: `${API_CONFIG.GET_COLORS_BY_ID}/${id}`,
        method: "GET",
      }),
      providesTags: ["categories"],
    }),

    // Create colors
    createColorsApi: builder.mutation({
      query: (data) => ({
        url: `${API_CONFIG.CREATE_COLORS}`,
        method: "POST",
        body: data,
        headers: {
          // "Content-type": "application/json",
        },
      }),
      invalidatesTags: ["categories"],
    }),

    // Update colors
    updateColorsApi: builder.mutation({
      query: ({ id, body }) => ({
        url: `${API_CONFIG.EDIT_COLORS}/${id}`,
        method: "PUT",
        body,
        headers: {
          // "Content-type": "application/json",
        },
      }),
      invalidatesTags: ["categories"],
    }),

    // Delete colors
    deleteColorsApi: builder.mutation({
      query: (id) => ({
        url: `${API_CONFIG.DELETE_COLORS}/${id}`,
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
  useGetColorsApiQuery,
  useGetColorsByIDMutation,
  useCreateColorsApiMutation,
  useUpdateColorsApiMutation,
  useDeleteColorsApiMutation, // <-- add this export
} = colorsApi;

/*
 *   Copyright (c) 2023 Jio Platforms Ltd
 *   All rights reserved.
 *   /************************************************************* * * Jio Platforms Ltd. * CONFIDENTIAL * __________________ * *  Copyright (C) 2020 Jio \n Platforms Ltd.– * *  ALL RIGHTS RESERVED. * * NOTICE:  All information \n including computer software along with source code and associated * documentation contained herein is, and remains the property of Jio Platforms Ltd..  * The intellectual and technical concepts contained herein are  proprietary to Jio Platforms Ltd. * and are protected by copyright law or as trade secret under confidentiality obligations.   * Dissemination, storage, transmission or recolorsion of this information * in any part or full is strictly forbidden unless prior written  * permission along with agreement for any usage right is obtained from Jio Platforms Ltd **************************************************************
 */
