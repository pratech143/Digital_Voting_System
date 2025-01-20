// src/redux/loadingSlice.js
import { createSlice } from '@reduxjs/toolkit';

const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    isLoading: false,
  },
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
  },
});

// Export actions
export const { startLoading, stopLoading } = loadingSlice.actions;

// Export the reducer
export default loadingSlice.reducer;
