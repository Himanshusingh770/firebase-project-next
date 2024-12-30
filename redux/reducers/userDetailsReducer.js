import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

export const getUserDetails = createAsyncThunk(
  "userDetails/getUserDetails",
  async (uid, { rejectWithValue }) => {
    try {
      const usersCollectionRef = collection(db, "users");
      const q = query(usersCollectionRef, where("uid", "==", `${uid}`));
      const data = await getDocs(q);
      if (!data.empty) {
        return { ...data.docs[0].data(), id: data.docs[0].id };
      }
      return rejectWithValue("User not found");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserDetails = createAsyncThunk(
  "userDetails/updateUserDetails",
  async (userData, { rejectWithValue }) => {
    try {
      const userDoc = doc(db, "users", userData.id);
      await updateDoc(userDoc, userData.data);
      return userData.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState: {
    userDetails: {},
    isLoading: false,
    isSuccess: false,
    error: null,
  },
  reducers: {
    resetUserDetails: (state) => {
      state.userDetails = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userDetails = action.payload;
        state.isSuccess = true;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateUserDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userDetails = { ...state.userDetails, ...action.payload };
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUserDetails } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;
