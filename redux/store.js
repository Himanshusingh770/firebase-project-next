import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/reducers/authReducer';
import userDetails from "../redux/reducers/authReducer";

const store = configureStore({
  reducer: {
    auth: authReducer, 
    userDetails: userDetails
  },
});

export default store;
