const validateEmail = (email) => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      return "Email is invalid";
    }
  };
  const validateField = (field, data = null) => {
    if (!data || typeof data !== 'string' || !data.trim()) {
      return `${field} is required`;
    }
  }; 
  const validatePassword = (password) => {
    let passwordError = validateField("Password", password);
    if (!passwordError) {
      if (password.length < 8) {
        passwordError = "Password length should be 8";
      }
      if (
        !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}/.test(password)
      ) {
        passwordError =
          "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special symbol";
      }
    }
    return passwordError;
  };
  
  const validateConfirmPassword = (password, confirmPassword) => {
    return password !== confirmPassword ? "Passwords do not match" : null;
  };
  
  const validatePhoneNumber = (phoneNumber, length = 10) => {
    return phoneNumber.trim().length !== length
      ? `Phone number must be ${length} characters long`
      : null;
  };
  
  export const validateForm = (userData, isLogin = false, isUpdate = false) => {
    const errors = {};
    let isValid = true;
  
    // Email validation
    errors.email = validateField("Email", userData?.email);
    if (!errors.email) {
      errors.email = validateEmail(userData?.email);
    }
  
    // Password validation
    if (!isUpdate) {
      if (isLogin) {
        errors.password = validateField("Password", userData?.password);
      } else {
        errors.password = validatePassword(userData?.password);
      }
    }
  
    if (!isLogin) {
      // Other fields validation
      errors.firstName = validateField("First name", userData?.firstName);
      errors.lastName = validateField("Last Name", userData?.lastName);
      errors.picture = validateField("Picture", userData?.picture);
  
      if (!isUpdate) {
        errors.confirmPassword = validateField(
          "Confirm Password",
          userData?.confirmPassword
        );
        if (!errors.confirmPassword) {
          errors.confirmPassword = validateConfirmPassword(
            userData?.password,
            userData?.confirmPassword
          );
        }
      }
  
      errors.phoneNumber = validateField("Phone Number", userData?.phoneNumber);
      if (!errors.phoneNumber) {
        errors.phoneNumber = validatePhoneNumber(userData?.phoneNumber);
      }
    }
  
    // Check if form is valid
    for (const key in errors) {
      if (errors[key]) {
        isValid = false;
        break;
      }
    }
  
    return { isValid, errors };
  };
  
  export const validatePostField = (postData) => {
    const errors = {};
    let isValid = true;
  
    // Post field validations
    errors.title = validateField("Title", postData?.title);
    errors.description = validateField("Description", postData?.description);
    errors.picture = validateField("Picture", postData?.picture);
  
    // Check if post fields are valid
    for (const key in errors) {
      if (errors[key]) {
        isValid = false;
        break;
      }
    }
  
    return { isValid, errors };
  };
  