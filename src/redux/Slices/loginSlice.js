import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customer: {
    name: null,
    phone: null,
    address: null,
    state: null,
    city: null,
    pincode: null,
  },
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setUserData: (state, { payload }) => {
      // Only store customer data
      state.customer = { ...state.customer, ...payload };
    },
    clearUserData: (state) => {
      state.customer = {
        name: null,
        phone: null,
        address: null,
        state: null,
        city: null,
        pincode: null,
      };
    },
  },
});

export const { setUserData, clearUserData } = loginSlice.actions;
export const getUserData = (state) => state?.login?.customer;
export default loginSlice.reducer;
