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
    console.log('signup dispatched');

    const response = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    // console.log(response);

    if (response) {
      const user = response.user;

      //  // Step 3: Upload image to Firebase Storage
      // const storageRef = ref(imageStorage, `profileImages/${data.uploadPicture.name}`);
      // const uploadSnapshot = await uploadBytes(storageRef, data.uploadPicture);
      // const imageUrl = await getDownloadURL(uploadSnapshot.ref); // Get the uploaded image URL

      const userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber || '', // Optional field
        picture: 'imageUrl' || '', // Optional field
        email: user.email,
        uid: user.uid // Extracted from Firebase Auth
      };

      // Save user data to Firestore
      const savedUserData = await addDoc(collection(db, 'users'), userData);

      console.log('Saved Firestore User Data:', savedUserData);

      // Return the user data
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || `${data.firstName} ${data.lastName}`,
        photoURL: 'imageUrl' || null
      };
    }

    throw new Error('Failed to create user');

    // return false;
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
      const blob = await response.blob();

      const imageRef = ref(imageStorage, 'images/' + Date.now());
      await uploadBytes(imageRef, blob);

      const imageURL = await getDownloadURL(imageRef);
      const userData = {
        firstName: data.formData.firstName,
        lastName: data.formData.lastName,
        phoneNumber: data.formData.phoneNumber,
        picture: imageURL,
        email: data.formData.email,
        uid: data.userUID
      };
      // Add a new document with a generated id.
      const docRef = await addDoc(collection(db, 'users'), userData);
      await addDoc(collection(db, 'users'), userData);

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

    if (response.user) {
      const { accessToken } = response.user;
      localStorage.setItem('accessToken', accessToken);
      return {
        accessToken
      };
    }
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
    loading: false,
    isAuthenticated: false,
    accessToken: null
  },
  reducers: {
    setAuth: (state, payload) => {
      state.accessToken = payload.accessToken;
      state.isAuthenticated = true;
    },
    resetAuth: (state, payload) => {
      state.accessToken = null;
      state.isAuthenticated = false;
    }
  },
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
        state.isAuthenticated = true;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(userLogin.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.accessToken = null;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  }
});

export const { setAuth, resetAuth } = authSlice.actions;
export default authSlice.reducer;
