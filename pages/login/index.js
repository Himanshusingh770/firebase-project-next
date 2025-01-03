'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { signInWithPopup } from 'firebase/auth';
import {
  auth,
  fbProvider,
  googleProvider,
  twiiterProvider
} from '../../firebase/firebaseConfig';
import { useSelector, useDispatch } from 'react-redux';
import {
  saveSocialAuthData,
  userLogin
} from '../../redux/reducers/authReducer';
// import { validateForm } from '../../utils/validationCheck';
import ErrorComponent from '../../components/ErrorComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebook,
  faGoogle,
  faTwitter
} from '@fortawesome/free-brands-svg-icons';
import { loginValidationSchema } from '@/validation/auth';
import ProtectedRoute from '../protectedRoute';

const LoginPage = () => {
  const [userData, setUserData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { loading, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleInputChange = (name, value) => {
    setUserData({ ...userData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  // const onLoginSubmit = async () => {
  //   const { isValid, errors } = validateForm(userData, true);
  //   if (isValid) {
  //     const result = await dispatch(userLogin(userData));
  //     if (
  //       result.payload?.code === "auth/invalid-credential" ||
  //       result.payload?.code === "auth/invalid-email"
  //     ) {
  //       setErrors({ ...errors, authError: "Email or Password is incorrect" });
  //     } else {
  //       router.replace("/homepage");
  //     }
  //   } else {
  //     setErrors(errors);
  //   }
  // };

  const onLoginSubmit = async () => {
    try {
      await loginValidationSchema.validate(userData, { abortEarly: false });
      const result = await dispatch(userLogin(userData));
      if (
        result.payload?.code === 'auth/invalid-credential' ||
        result.payload?.code === 'auth/invalid-email'
      ) {
        setErrors({ ...errors, authError: 'Email or Password is incorrect' });
      } else {
        router.replace('/');
      }
    } catch (err) {
      const validationErrors = {};
      if (err.name === 'ValidationError') {
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
      }
      setErrors(validationErrors);
    }
  };

  const onSocialClick = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userSocialData = {
        uid: user?.uid,
        firstName: user?.displayName?.split(' ')[0],
        lastName: user?.displayName?.split(' ')[1],
        email: user?.email,
        phoneNumber: user?.phoneNumber,
        picture: user?.photoURL
      };

      await dispatch(saveSocialAuthData(userSocialData));
      router.push('/homepage');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <ProtectedRoute path={'/'} isAuthenticated={isAuthenticated}>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white w-full sm:w-2/3 md:w-1/2 lg:w-1/3 p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
          <div className="mb-4">
            <input
              className={`w-full p-3 border-2 rounded-md ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              type="email"
              placeholder="Email ID"
              value={userData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
            <ErrorComponent errorMessage={errors.email} />
          </div>
          <div className="mb-4">
            <input
              className={`w-full p-3 border-2 rounded-md ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              type="password"
              placeholder="Password"
              value={userData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
            />
            <ErrorComponent errorMessage={errors.password} />
            <ErrorComponent errorMessage={errors.authError} />
          </div>
          <button
            className={`w-full p-3 text-white rounded-md mb-4 ${
              loading ? 'bg-gray-400' : 'bg-blue-500'
            }`}
            onClick={onLoginSubmit}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
          <p className="text-center mb-4">
            Don't have an account?{' '}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => router.push('/userRegister')}
            >
              Register
            </span>
          </p>
          <div className="text-center mb-4">---------- Or ----------</div>
          <div className="flex justify-center space-x-4">
            <button onClick={() => onSocialClick(fbProvider)}>
              <FontAwesomeIcon
                icon={faFacebook}
                className="text-3xl text-black"
              />
            </button>
            <button onClick={() => onSocialClick(googleProvider)}>
              <FontAwesomeIcon
                icon={faGoogle}
                className="text-3xl text-red-600"
              />
            </button>
            <button onClick={() => onSocialClick(twiiterProvider)}>
              <FontAwesomeIcon
                icon={faTwitter}
                className="text-3xl text-blue-500"
              />
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default LoginPage;
