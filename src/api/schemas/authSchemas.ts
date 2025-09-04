import * as yup from 'yup';

// Schema for the main Sign Up form
export const signUpSchema = yup.object().shape({
    name: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    username: yup.string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters')
        .matches(/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers, and underscores'),
    address: yup.string().required('Address is required'),
    email: yup.string().email('Invalid email address').required('Email is required'),
    phone: yup.string().required('Phone number is required').min(10, 'Please enter a valid phone number'),
    password: yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password'),
});

export type SignUpFormData = yup.InferType<typeof signUpSchema>;

// Schema for the Sign In form (Email/Username + Password)
export const signInSchema = yup.object().shape({
    identifier: yup.string().required('Email or Username is required'),
    password: yup.string().required('Password is required'),
});

export type SignInFormData = yup.InferType<typeof signInSchema>;

// Schema for the Phone OTP login form
export const phoneOtpSchema = yup.object().shape({
    phone: yup.string().required('Phone number is required').min(10, 'Please enter a valid phone number'),
});

export type PhoneOtpFormData = yup.InferType<typeof phoneOtpSchema>;

// Schema for the OTP verification step
export const otpVerifySchema = yup.object().shape({
    otp: yup.string().required('OTP is required').length(6, 'OTP must be 6 digits'),
});

export type OtpVerifyFormData = yup.InferType<typeof otpVerifySchema>;