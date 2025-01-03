'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faEyeSlash,
  faImage
  // faCamera
} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { handleImagePicker } from '../../utils/handleImagePicker';
import { saveUserData, signupUser } from '../../redux/reducers/authReducer';
// import { validateForm } from '../../utils/validationCheck';
import ConfirmationModal from '../../components/ConfirmModal';
import ErrorComponent from '../../components/ErrorComponent';
// import CameraModal from '../../components/CameraModal';
import {
  getUserDetails,
  updateUserDetails
} from '../../redux/reducers/userDetailsReducer';
import { registerValidationSchema } from '@/validation/auth';
import { useRouter } from 'next/router';

const UserRegisterAndUpdate = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    previewPicture: '',
    uploadPicture: ''
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    previewPicture: null,
    uploadPicture: null
  });

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const [showCamera, setShowCamera] = useState(false);
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const { userDetails, isLoading } = useSelector((state) => state.userDetails);
  const router = useRouter();
  // dispatch(getUserDetails("ArJDK7IcEAY3kwiiQqghQMhwYmp2"));

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleImageSelect = async () => {
    const { imageUrl, file } = (await handleImagePicker()) || null;
    console.log(imageUrl, file);

    setFormData({ ...formData, previewPicture: imageUrl, uploadPicture: file });
  };

  // const onSubmit = async () => {

  //   // const { isValid, errors } = validateForm(
  //   //   formData,
  //   //   false,
  //   //   user ? true : false
  //   // );
  //   // console.log(isValid);

  //   await authValidationSchema.validate(formData, { abortEarly: false });

  //   if (isValid) {

  //     console.log(formData);

  //     const userCredential = await dispatch(signupUser(formData));
  //     console.log(userCredential);

  //     if (userCredential?.payload?.code) {
  //       setErrors({ ...errors, email: 'Email already registered' });
  //       return;
  //     }

  //     const userUID = userCredential?.payload?.uid;
  //     if (userUID) {
  //       // await dispatch(saveUserData({ userUID, formData }));
  //       await dispatch(getUserDetails(userUID))
  //       setShowConfirmationModal(true);
  //     }
  //   } else {
  //     setErrors(errors);
  //   }
  // };

  const onSubmit = async () => {
    try {
      await registerValidationSchema.validate(formData, { abortEarly: false });

      const userCredential = await dispatch(signupUser(formData));

      if (userCredential?.payload?.code) {
        setErrors({ ...errors, email: 'Email already registered' });
        return;
      }

      const userUID = userCredential?.payload?.uid;
      if (userUID) {
        // await dispatch(saveUserData({ userUID, formData }));
        await dispatch(getUserDetails(userUID));
        setShowConfirmationModal(true);
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

  const handleNavigate = () => {
    router.replace('/');
    setShowConfirmationModal(false);
  };

  useEffect(() => {
    if (userDetails?.id) {
      setFormData({
        lastName: userDetails.lastName || '',
        firstName: userDetails.firstName || '',
        email: userDetails.email || '',
        phoneNumber: userDetails.phoneNumber || '',
        picture: userDetails.picture || ''
      });
    }
  }, [userDetails]);

  // useEffect(() => {
  //   if (image) {
  //     setFormData({ ...formData, picture: image });
  //   }
  // }, [image]);

  return (
    <div className="container mx-auto mt-20">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-center mb-5">
          {userDetails?.id ? 'User Details' : 'Signup'}
        </h1>

        <div className="mb-4">
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-4 py-2"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
          />
          <ErrorComponent errorMessage={errors.firstName} />
        </div>
        <div className="mb-4">
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-4 py-2"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
          />
          <ErrorComponent errorMessage={errors.lastName} />
        </div>
        <div className="mb-4">
          <input
            type="email"
            className="w-full border border-gray-300 rounded-md px-4 py-2"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          <ErrorComponent errorMessage={errors.email} />
        </div>
        <div className="mb-4">
          <input
            type="tel"
            className="w-full border border-gray-300 rounded-md px-4 py-2"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
          />
          <ErrorComponent errorMessage={errors.phoneNumber} />
        </div>
        {!userDetails?.id && (
          <>
            <div className="mb-4 relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="absolute top-3 right-4 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
              <ErrorComponent errorMessage={errors.password} />
            </div>
            <div className="mb-4 relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleChange('confirmPassword', e.target.value)
                }
              />
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEyeSlash : faEye}
                className="absolute top-3 right-4 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
              <ErrorComponent errorMessage={errors.confirmPassword} />
            </div>
          </>
        )}
        <div className="mb-4 flex items-center justify-between">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={handleImageSelect}
          >
            <FontAwesomeIcon icon={faImage} />
          </button>
          {/* <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={() => setShowCamera(true)}
          >
            <FontAwesomeIcon icon={faCamera} />
          </button> */}
        </div>
        {formData.previewPicture && (
          <Image
            src={formData.previewPicture}
            alt="User Profile"
            width={96}
            height={96}
            className="rounded-md mb-4"
          />
        )}
        <ErrorComponent errorMessage={errors.previewPicture} />

        <button
          className={`w-full py-2 rounded-md text-white text-center ${
            loading || isLoading ? 'bg-gray-300' : 'bg-green-500'
          }`}
          onClick={onSubmit}
          disabled={loading || isLoading}
        >
          {loading || isLoading
            ? 'Loading...'
            : userDetails?.id
            ? 'Update'
            : 'Signup'}
        </button>
        {/* {showConfirmationModal && (
          <ConfirmationModal
            modalTitle="Success"
            modalSubTitle={
              userDetails?.id
                ? 'User updated successfully'
                : 'User registered successfully. Click OK to proceed.'
            }
            visible={showConfirmationModal}
            onClose={() => setShowConfirmationModal(false)}
            onConfirm={handleNavigate}
            btnOkText="OK"
          />
        )} */}
        {showConfirmationModal && (
          <ConfirmationModal
            modalTitle="Success"
            modalSubTitle={'User registered successfully. Click OK to proceed'}
            visible={showConfirmationModal}
            onClose={() => setShowConfirmationModal(false)}
            onConfirm={handleNavigate}
            btnOkText="OK"
          />
        )}
        {/* {showCamera && (
          <CameraModal setShowCamera={setShowCamera} setImage={setImage} />
        )} */}
      </div>
    </div>
  );
};

export default UserRegisterAndUpdate;
