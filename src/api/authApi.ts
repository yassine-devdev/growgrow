import { Role, User } from '@/types/index.ts';
import { apiClient } from './apiClient';
import { SignUpFormData } from './schemas/authSchemas';
import type {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from '@simplewebauthn/typescript-types';

/**
 * Kicks off the user sign-up process.
 * In a real backend, this would create a user record with a pending status.
 * @param data The user's registration details.
 * @returns A promise that resolves with a success message and a mock user ID.
 */
export const signUpUser = async (data: SignUpFormData): Promise<{ user: User }> => {
    return apiClient<{ user: User }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data)
    });
};

/**
 * Begins the WebAuthn registration process.
 * The backend generates challenge options for the browser.
 * @returns A promise that resolves to PublicKeyCredentialCreationOptionsJSON.
 */
export const getRegistrationOptions = async (): Promise<PublicKeyCredentialCreationOptionsJSON> => {
    // Simulate API call to POST /api/auth/register-biometric-options
    await new Promise(res => setTimeout(res, 500));
    // This is a simplified, mock response. A real backend would generate a secure, unique challenge.
    return {
        challenge: 'a8a05c6d-be5a-4286-81a1-2d061175c88d', // A secure random challenge
        rp: { name: 'GROW YouR NEED', id: window.location.hostname },
        user: { id: 'temp-user-id-from-backend', name: 'user@example.com', displayName: 'User' },
        pubKeyCredParams: [{ alg: -7, type: 'public-key' }, { alg: -257, type: 'public-key' }],
        timeout: 60000,
        attestation: 'direct',
    };
};

/**
 * Sends the browser's WebAuthn registration response to the backend for verification.
 * @param data The registration response from the authenticator.
 * @returns A promise that resolves on success.
 */
export const verifyRegistration = async (data: RegistrationResponseJSON): Promise<{ verified: boolean }> => {
    console.log("Verifying biometric registration:", data);
    // Simulate API call to POST /api/auth/verify-biometric-registration
    await new Promise(res => setTimeout(res, 1000));
    // The backend would verify the attestation and save the credential.
    return { verified: true };
};

/**
 * Begins the WebAuthn authentication (login) process.
 * @returns A promise that resolves to PublicKeyCredentialRequestOptionsJSON.
 */
export const getAuthenticationOptions = async (): Promise<PublicKeyCredentialRequestOptionsJSON> => {
    await new Promise(res => setTimeout(res, 500));
    // This is a simplified, mock response.
    return {
        challenge: 'e10b21a8-8f6b-4f1e-a5e2-7d8859b39a3b',
        allowCredentials: [], // In a real app, this would be populated with user's credential IDs
        timeout: 60000,
        rpId: window.location.hostname,
    };
};

/**
 * Sends the browser's WebAuthn authentication response to the backend for verification.
 * @param data The authentication response from the authenticator.
 * @returns A promise that resolves with the authenticated user object.
 */
export const verifyAuthentication = async (data: AuthenticationResponseJSON): Promise<{ user: User }> => {
    console.log("Verifying biometric authentication:", data);
    // Simulate API call to POST /api/auth/verify-biometric-authentication
    await new Promise(res => setTimeout(res, 1000));
    // The backend verifies the signature and logs the user in.
    return loginUser('Individual'); // Log in as a default user for the demo
};


/**
 * Logs in a user by their role by calling the backend.
 * This is now used as a fallback or for role simulation.
 * @param role The role to log in as.
 * @returns A promise that resolves to an object containing the user.
 */
export const loginUser = async (data: SignInFormData): Promise<{ user: User }> => {
    return apiClient<{ user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: data.identifier, password: data.password })
    });
};

/**
 * Simulates requesting a phone OTP from the backend.
 * @param phone The phone number to send the OTP to.
 */
export const requestPhoneOtp = async (phone: string): Promise<{ success: boolean }> => {
    console.log(`Requesting OTP for phone number: ${phone}`);
    await new Promise(res => setTimeout(res, 1000)); // Simulate network delay
    return { success: true };
};

/**
 * Simulates verifying a phone OTP and logging the user in.
 * @param phone The user's phone number.
 * @param otp The 6-digit OTP code.
 * @returns A promise that resolves with the user object on successful verification.
 */
export const verifyPhoneOtp = async (phone: string, otp: string): Promise<{ user: User }> => {
    console.log(`Verifying OTP "${otp}" for phone number: ${phone}`);
    await new Promise(res => setTimeout(res, 1000));
    if (otp === '123456') { // Mock success OTP
        return loginUser({ identifier: 'provider@growyourneed.com', password: '123' }); // Log in as a default user for demo
    }
    throw new Error('Invalid OTP code.');
};