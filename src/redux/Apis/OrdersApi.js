// import { API_CONFIG } from "src/services/constants";
import { API_CONFIG } from "../../services/constants";
import { commonFactoryApi } from "./commonApiSlice";

const apiWithTag = commonFactoryApi.enhanceEndpoints({
  addTagTypes: ["orders"],
});
export const orderApi = apiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    /*************# GET API PRODUCTS  #*************/
    getOrderApi: builder.query({
      query: () => ({
        url: `${API_CONFIG.SHOW_ALL_ORDERS}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0, // Keep data for 5 minutes
      providesTags: ["orders"],
    }),

    // Get order by ID
    getOrderByID: builder.mutation({
      query: (id) => ({
        url: `${API_CONFIG.GET_ORDERS_BY_ID}${id}`,
        method: "GET",
      }),
      providesTags: ["orders"],
    }),

    // Create order
    createOrderApi: builder.mutation({
      query: (data) => ({
        url: `${API_CONFIG.CREATE_ORDERS}`,
        method: "POST",
        body: data,
        headers: {
          // "Content-type": "application/json",
        },
      }),
      invalidatesTags: ["orders"],
    }),

    // Update order
    updateOrderApi: builder.mutation({
      query: ({ id, body }) => ({
        url: `${API_CONFIG.EDIT_ORDERS}${id}`,
        method: "PUT",
        body,
        headers: {
          // "Content-type": "application/json",
        },
      }),
      invalidatesTags: ["orders"],
    }),

    // Delete order
    deleteOrderApi: builder.mutation({
      query: (id) => ({
        url: `${API_CONFIG.DELETE_ORDERS}${id}`,
        method: "DELETE",
        headers: {
          // "Content-type": "application/json",
        },
      }),
      invalidatesTags: ["orders"],
    }),
  }),
});

export const {
  useGetOrderApiQuery,
  useGetOrderByIDMutation,
  useCreateOrderApiMutation,
  useUpdateOrderApiMutation,
  useDeleteOrderApiMutation, // <-- add this export
} = orderApi;

/*
 *   Copyright (c) 2023 Jio Platforms Ltd
 *   All rights reserved.
 *   /************************************************************* * * Jio Platforms Ltd. * CONFIDENTIAL * __________________ * *  Copyright (C) 2020 Jio \n Platforms Ltd.– * *  ALL RIGHTS RESERVED. * * NOTICE:  All information \n including computer software along with source code and associated * documentation contained herein is, and remains the property of Jio Platforms Ltd..  * The intellectual and technical concepts contained herein are  proprietary to Jio Platforms Ltd. * and are protected by copyright law or as trade secret under confidentiality obligations.   * Dissemination, storage, transmission or reorderion of this information * in any part or full is strictly forbidden unless prior written  * permission along with agreement for any usage right is obtained from Jio Platforms Ltd **************************************************************
 */
