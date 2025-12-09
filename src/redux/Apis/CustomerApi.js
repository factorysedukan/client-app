import { API_CONFIG } from "../../services/constants";
import { commonFactoryApi } from "./commonApiSlice";

const apiWithTag = commonFactoryApi.enhanceEndpoints({
  addTagTypes: ["customer"],
});

export const customerApi = apiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    // Get all customers
    getCustomers: builder.query({
      query: () => ({
        url: `${API_CONFIG.CUSTOMERS}`,
        method: "GET",
      }),
      providesTags: ["customer"],
    }),
    // Get customer by ID
    getCustomerById: builder.query({
      query: (id) => ({
        url: `${API_CONFIG.CUSTOMERS}/${id}`,
        method: "GET",
      }),
      providesTags: ["customer"],
    }),
    // Get customer by mobile
    getCustomerByMobile: builder.mutation({
      query: (mobile) => (
        {
        url: `${API_CONFIG.CUSTOMERS}/mobile/${mobile}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0, // Keep data for 5 minutes
      providesTags: ["customer"],
    }),
    // Create customer
    createCustomer: builder.mutation({
      query: (data) => ({
        url: `${API_CONFIG.CUSTOMERS}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["customer"],
    }),
    // Update customer
    updateCustomer: builder.mutation({
      query: ({ id, body }) => ({
        url: `${API_CONFIG.CUSTOMERS}/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["customer"],
    }),
    // Delete customer
    deleteCustomer: builder.mutation({
      query: (id) => ({
        url: `${API_CONFIG.CUSTOMERS}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["customer"],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useGetCustomerByMobileMutation,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customerApi;