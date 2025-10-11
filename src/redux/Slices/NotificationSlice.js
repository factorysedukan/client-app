import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  previousNotificationTime: null, // Store last notification time (ISO string or timestamp)
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setPreviousNotificationTime: (state, action) => {
      state.previousNotificationTime = action.payload;
    },
    clearPreviousNotificationTime: (state) => {
      state.previousNotificationTime = null;
    },
  },
});

export const { setPreviousNotificationTime, clearPreviousNotificationTime } = notificationSlice.actions;
export default notificationSlice.reducer;