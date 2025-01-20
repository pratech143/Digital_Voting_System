// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import loadingReducer from './loadingSlice';

const store = configureStore({
  reducer: {
    loading: loadingReducer, // Adding the loading reducer to the store
  },
});

export default store;
