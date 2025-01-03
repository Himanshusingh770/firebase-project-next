import * as Yup from 'yup';

export const registerValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  phoneNumber: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one letter and one number'
    ),
  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  previewPicture: Yup.string().required('Please upload a picture'),
  uploadPicture: Yup.mixed()
    .required('Please upload a picture')
    .test(
      'fileType',
      'Unsupported file format. Only images are allowed',
      (value) =>
        !value ||
        (value && ['image/jpeg', 'image/png', 'image/gif'].includes(value.type))
    )
});

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one letter and one number'
    )
});

export const updateValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  phoneNumber: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),
  previewPicture: Yup.string().required('Please upload a picture'),
  uploadPicture: Yup.mixed()
    .required('Please upload a picture')
    .test(
      'fileType',
      'Unsupported file format. Only images are allowed',
      (value) =>
        !value ||
        (value && ['image/jpeg', 'image/png', 'image/gif'].includes(value.type))
    )
});
