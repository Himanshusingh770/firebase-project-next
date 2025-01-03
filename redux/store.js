import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/reducers/authReducer';
import userDetailsReducer from "../redux/reducers/userDetailsReducer";

const store = configureStore({
  reducer: {
    auth: authReducer, 
    userDetails: userDetailsReducer
  },
});

export default store;
