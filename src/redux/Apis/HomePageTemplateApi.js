import { API_CONFIG } from "../../services/constants";
import { commonFactoryApi } from "./commonApiSlice";

const apiWithTag = commonFactoryApi.enhanceEndpoints({
  addTagTypes: ["homePageTemplate"],
});

export const homePageTemplateApi = apiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    // GET all homepage templates
    getHomePageTemplateApi: builder.query({
      query: () => ({
        url: `${API_CONFIG.HOMEPAGE_TEMPLATE}`,
        method: "GET",
      }),
      keepUnusedDataFor: 1000, // Keep data for 5 minutes
      providesTags: ["homePageTemplate"],
    }),

    // GET homepage template by ID
    getHomePageTemplateByID: builder.mutation({
      query: (id) => ({
        url: `${API_CONFIG.HOMEPAGE_TEMPLATE}/${id}`,
        method: "GET",
      }),
      providesTags: ["homePageTemplate"],
    }),

    // CREATE homepage template
    createHomePageTemplateApi: builder.mutation({
      query: (data) => ({
        url: `${API_CONFIG.HOMEPAGE_TEMPLATE}`,
        method: "POST",
        body: data,
        headers: {
          // "Content-type": "application/json",
        },
      }),
      invalidatesTags: ["homePageTemplate"],
    }),

    // UPDATE homepage template
    updateHomePageTemplateApi: builder.mutation({
      query: ({ id, body }) => ({
        url: `${API_CONFIG.HOMEPAGE_TEMPLATE}/${id}`,
        method: "PUT",
        body,
        headers: {
          // "Content-type": "application/json",
        },
      }),
      invalidatesTags: ["homePageTemplate"],
    }),

    // DELETE homepage template
    deleteHomePageTemplateApi: builder.mutation({
      query: (id) => ({
        url: `${API_CONFIG.HOMEPAGE_TEMPLATE}/${id}`,
        method: "DELETE",
        headers: {
          // "Content-type": "application/json",
        },
      }),
      invalidatesTags: ["homePageTemplate"],
    }),
  }),
});

export const {
  useGetHomePageTemplateApiQuery,
  useGetHomePageTemplateByIDMutation,
  useCreateHomePageTemplateApiMutation,
  useUpdateHomePageTemplateApiMutation,
  useDeleteHomePageTemplateApiMutation,
} = homePageTemplateApi;

/*
 *   Copyright (c) 2023 Jio Platforms Ltd
 *   All rights reserved.
 *   /************************************************************* * * Jio Platforms Ltd. * CONFIDENTIAL * __________________ * *  Copyright (C) 2020 Jio \n Platforms Ltd.– * *  ALL RIGHTS RESERVED. * * NOTICE:  All information \n including computer software along with source code and associated * documentation contained herein is, and remains the property of Jio Platforms Ltd..  * The intellectual and technical concepts contained herein are  proprietary to Jio Platforms Ltd. * and are protected by copyright law or as trade secret under confidentiality obligations.   * Dissemination, storage, transmission or recategoryion of this information * in any part or full is strictly forbidden unless prior written  * permission along with agreement for any usage right is obtained from Jio Platforms Ltd **************************************************************
 */
