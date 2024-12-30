import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db, imageStorage } from '../../firebase/firebaseConfig';

export const signupUser = createAsyncThunk('auth/signupUser', async (data) => {
  try {
    // const response = await createUserWithEmailAndPassword(
    //   auth,
    //   data.email,
    //   data.password
    // );
    // if (response) {
      const userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        // picture: imageURL,
        email: data.email
        // uid: data.userUID,
      };
      const docRef = await addDoc(collection(db, 'users'), userData);
      console.log(docRef, '111111111111111111111')
    // }
    return false;
  } catch (error) {
    return error;
  }
});

export const saveUserData = createAsyncThunk(
  'auth/saveUserData',
  async (data, { rejectWithValue }) => {
    try {
      // Fetch image and convert to blob
      const response = await fetch(data.formData.picture);
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      // const blob = await response.blob();

      // const imageRef = ref(imageStorage, "images/" + Date.now());
      // await uploadBytes(imageRef, blob);

      // const imageURL = await getDownloadURL(imageRef);
      const userData = {
        firstName: data.formData.firstName,
        lastName: data.formData.lastName,
        phoneNumber: data.formData.phoneNumber,
        // picture: imageURL,
        email: data.formData.email
        // uid: data.userUID,
      };
      // Add a new document with a generated id.
      const docRef = await addDoc(collection(db, 'users'), userData);
      // await addDoc(collection(db, "users"), userData);

      return userData;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

export const saveSocialAuthData = createAsyncThunk(
  'auth/socialAuthData',
  async (data) => {
    try {
      await addDoc(collection(db, 'users'), data);
    } catch (error) {
      return error;
    }
  }
);

export const userLogin = createAsyncThunk('auth/userLogin', async (data) => {
  try {
    const response = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    return response.user;
  } catch (error) {
    return error;
  }
});

export const getUserData = createAsyncThunk('auth/getData', async (data) => {
  return data;
});

export const getLoggedInUser = createAsyncThunk(
  'auth/getUser',
  async (_, { dispatch }) => {
    try {
      auth.onAuthStateChanged((user) => {
        dispatch(getUserData(user));
      });
    } catch (error) {
      return error;
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: {},
    loading: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signupUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(saveUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveUserData.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(saveUserData.rejected, (state) => {
        state.loading = false;
      })
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(userLogin.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  }
});

export default authSlice.reducer;
