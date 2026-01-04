// import { API_CONFIG } from "src/services/constants";
import { API_CONFIG } from "../../services/constants";
import { commonFactoryApi } from "./commonApiSlice";

// import { apiSlice } from "./apiSlice";
const apiWithTag = commonFactoryApi.enhanceEndpoints({
  addTagTypes: ["products", "stickers"],
});
export const productApi = apiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    /*************# GET API PRODUCTS  #*************/
    listProductsApiPaginated: builder.mutation({
      query: (data) => {
        // Log data here
        console.log("Data for paginated products:", API_CONFIG.GET_ALL_PRODUCTS); // Log data here
        return {
          url: `${API_CONFIG.GET_ALL_PRODUCTS}`,
          method: "GET",
          params: {
            page: data.page,
            limit: data.limit,
          },
        };
      },
      keepUnusedDataFor: 0, // Keep data for 0 minutes (mutation, not cached)
      providesTags: ["Products"],
    }),

    // Query version, cached for 10 minutes (600 seconds)
    listProductsApiPaginatedQ: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `${API_CONFIG.GET_ALL_PRODUCTS}`,
        method: "GET",
        params: { page, limit },
      }),
      keepUnusedDataFor: 600, // 10 minutes in seconds
      providesTags: ["Products"],
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

    // searchProductApi: builder.mutation({
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
    createProductApi: builder.mutation({
      query: (data) => {
        console.log("D1", data); // Log data here

        return {
          url: `${API_CONFIG.CREATE_PRODUCT}`,
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
    updateProductApi: builder.mutation({
      query: (data) => {
        console.log(data); // Log data here

        return {
          url: `${API_CONFIG.EDIT_PRODUCT}${data.id}`,
          method: "PUT",
          body: data.body,
          headers: {
            // "Content-type": "application/json",
            //   'Content-Type':
            // 'multipart/form-data; boundary="yet another boundary"',
          },
        };
      },
      // providesTags: ["Stickers"],
    }),

    // //************PACKAGE DELETE API *********************8/
    deleteProductApi: builder.mutation({
      query: (id) => {
        return {
          url: `${API_CONFIG.DELETE_PRODUCT}${id}`,
          method: "DELETE",
          headers: {
            // "Content-type": "application/json",
            //   'Content-Type':
            // 'multipart/form-data; boundary="yet another boundary"',
          },
        };
      },
      invalidatesTags: ["Products"],
    }),

    getProductByID: builder.mutation({
      query: (id) => {
        // Log data here
        return {
          url: `${API_CONFIG.GET_PRODUCT_BY_ID}${id}`,
          method: "GET",
          headers: {
            //   "Content-type": "application/json",
            //   'Content-Type':
            // 'multipart/form-data; boundary="yet another boundary"',
          },
        };
      },
      // providesTags: ["Products"],
    }),

    // Query version, cached for 10 minutes (600 seconds)
    getProductByIDQ: builder.query({
      query: (id) => ({
        url: `${API_CONFIG.GET_PRODUCT_BY_ID}${id}`,
        method: "GET",
        headers: {
          //   "Content-type": "application/json",
          //   'Content-Type':
          // 'multipart/form-data; boundary="yet another boundary"',
        },
      }),
      keepUnusedDataFor: 600, // 10 minutes in seconds
      providesTags: ["Products"],
    }),

    getProductsByFilterCategoryValue: builder.mutation({
      query: ({ filterCategoryId, value,strict, page = 1, limit = 10 }) => {
        // value can be a string or array, handle accordingly
        let valueParam = Array.isArray(value) ? value.join(',') : value;
        return {
          url: `${API_CONFIG.GET_PRODUCTS_BY_FILTER_CATEGORY_VALUE}${filterCategoryId}/value/${valueParam}/strict/${strict}`,
          method: "GET",
          params: { page, limit },
        };
      },
      providesTags: ["categoryProducts"],
    }),

    // --- SEARCH PRODUCT V2 ---
    searchProductV2: builder.mutation({
      query: ({ q = '', page = 1, limit = 10 }) => ({
        url: `${API_CONFIG.SEARCH_PRODUCTS}`,
        method: "GET",
        params: { q, page, limit },
      }),
      providesTags: ["Products"],
    }),
  }),
});

export const {  
    useListProductsApiPaginatedMutation,
    useListProductsApiPaginatedQQuery,
    useCreateProductApiMutation,
    useGetProductByIDMutation,
    useGetProductByIDQQuery,
    useUpdateProductApiMutation,
    useDeleteProductApiMutation,
    useGetProductsByFilterCategoryValueMutation,
    useSearchProductV2Mutation,
} = productApi;

