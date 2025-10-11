import { API_CONFIG } from "../../services/constants";
import { commonFactoryApi } from "./commonApiSlice";

const apiWithTag = commonFactoryApi.enhanceEndpoints({
  addTagTypes: ["factories"],
});

export const factoryApi = apiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    // Get all factories
    getAllFactories: builder.query({
      query: () => ({
        url: `${API_CONFIG.FACTORY}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
      providesTags: ["factories"],
    }),

    // Get factory by ID
    getFactoryById: builder.mutation({
      query: (body) => ({
        url: `${API_CONFIG.FACTORY}/${body.id}`,
        method: "GET",
      }),
      providesTags: ["factories"],
    }),
  getFactoryProductsById: builder.mutation({
      query: (body) => ({
        url: `${API_CONFIG.FACTORY}/products/${body.id}`,
        method: "GET",
        params: {
            page: body.page,
            limit: body.limit,
          },
      }),
      providesTags: ["factories"],
    }),
    // Create factory
    createFactory: builder.mutation({
      query: (data) => ({
        url: `${API_CONFIG.FACTORY}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["factories"],
    }),

    // Update factory
    updateFactory: builder.mutation({
      query: ({ id, body }) => ({
        url: `${API_CONFIG.FACTORY}/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["factories"],
    }),

    // Delete factory
    deleteFactory: builder.mutation({
      query: (id) => ({
        url: `${API_CONFIG.FACTORY}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["factories"],
    }),
  }),
});

export const {
  useGetAllFactoriesQuery,
  useGetFactoryByIdMutation,
  useCreateFactoryMutation,
  useUpdateFactoryMutation,
  useDeleteFactoryMutation,
  useGetFactoryProductsByIdMutation
} = factoryApi;