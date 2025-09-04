import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signUpSchema, otpVerifySchema, SignUpFormData, OtpVerifyFormData } from '@/api/schemas/authSchemas';
import { useMutation } from '@tanstack/react-query';
import { signUpUser, getRegistrationOptions, verifyRegistration } from '@/api/authApi';
import { startRegistration } from '@simplewebauthn/browser';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Fingerprint, CheckCircle } from 'lucide-react';
import AuthCard from '@/components/auth/AuthCard';
import ControlledInput from '@/components/auth/ControlledInput';
import PhoneInput from '@/components/auth/PhoneInput';
import { useAppStore } from '@/store/useAppStore';

type SignUpStep = 'details' | 'otp' | 'biometric' | 'complete';

interface SignUpViewProps {
    onSwitchToSignIn: () => void;
}

const SignUpView: React.FC<SignUpViewProps> = ({ onSwitchToSignIn }) => {
    const [step, setStep] = useState<SignUpStep>('details');
    const addToast = useAppStore(s => s.addToast);

    // Details Form
    const { control: detailsControl, handleSubmit: handleDetailsSubmit, formState: { errors: detailsErrors } } = useForm<SignUpFormData>({
        resolver: yupResolver(signUpSchema),
    });

    // OTP Form
     const { control: otpControl, handleSubmit: handleOtpSubmit, formState: { errors: otpErrors } } = useForm<OtpVerifyFormData>({
        resolver: yupResolver(otpVerifySchema),
    });

    const signUpMutation = useMutation({
        mutationFn: signUpUser,
        onSuccess: () => setStep('otp'),
        onError: (error: any) => addToast({ message: error.message || "Sign up failed", type: 'error' }),
    });

    const onDetailsSubmit = (data: SignUpFormData) => {
        console.log("Sign up details:", data);
        signUpMutation.mutate(data);
    };

    const onOtpSubmit = (data: OtpVerifyFormData) => {
        console.log("OTP submitted:", data.otp);
        setStep('biometric');
    };

    const handleBiometricRegistration = async () => {
        try {
            const options = await getRegistrationOptions();
            const attestation = await startRegistration(options);
            const { verified } = await verifyRegistration(attestation);
            if (verified) {
                addToast({ message: "Biometric registered successfully!", type: 'success' });
                setStep('complete');
            }
        } catch (error: any) {
            console.error(error);
            addToast({ message: error.message || 'Biometric registration failed.', type: 'error' });
            // Allow user to skip if biometrics fail
            setStep('complete');
        }
    };
    
    const renderStep = () => {
        switch (step) {
            case 'details':
                return (
                     <form onSubmit={handleDetailsSubmit(onDetailsSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                             <ControlledInput control={detailsControl} name="name" label="First Name" error={detailsErrors.name} />
                             <ControlledInput control={detailsControl} name="lastName" label="Last Name" error={detailsErrors.lastName} />
                        </div>
                        <ControlledInput control={detailsControl} name="username" label="Username" error={detailsErrors.username} />
                        <ControlledInput control={detailsControl} name="address" label="Address" error={detailsErrors.address} />
                        <ControlledInput control={detailsControl} name="email" label="Email" type="email" error={detailsErrors.email} />
                        <PhoneInput control={detailsControl} name="phone" error={detailsErrors.phone} />
                        <ControlledInput control={detailsControl} name="password" label="Password" type="password" error={detailsErrors.password} />
                        <ControlledInput control={detailsControl} name="confirmPassword" label="Confirm Password" type="password" error={detailsErrors.confirmPassword} />
                        <button type="submit" disabled={signUpMutation.isPending} className="w-full btn-primary mt-2">
                            {signUpMutation.isPending ? <Loader2 className="animate-spin" /> : 'Create Account'}
                        </button>
                    </form>
                );
            case 'otp':
                return (
                     <form onSubmit={handleOtpSubmit(onOtpSubmit)} className="space-y-6 text-center">
                        <h3 className="text-xl font-semibold">Verify Your Phone</h3>
                        <p className="text-sm text-brand-text-alt">Enter the 6-digit code we sent to your phone number to complete verification.</p>
                        <ControlledInput control={otpControl} name="otp" label="Verification Code" error={otpErrors.otp} />
                        <button type="submit" className="w-full btn-primary">Verify</button>
                    </form>
                )
            case 'biometric':
                 return (
                    <div className="text-center space-y-6">
                        <Fingerprint className="mx-auto text-brand-primary" size={48} />
                        <h3 className="text-xl font-semibold">Enable Biometric Sign-In</h3>
                        <p className="text-sm text-brand-text-alt">For faster, more secure access, you can set up Face or Fingerprint ID.</p>
                        <button onClick={handleBiometricRegistration} className="w-full btn-primary">Enable Biometric</button>
                        <button onClick={() => setStep('complete')} className="w-full text-sm font-semibold text-brand-text-alt hover:underline">Skip for now</button>
                    </div>
                )
            case 'complete':
                 return (
                    <div className="text-center space-y-6">
                        <CheckCircle className="mx-auto text-green-500" size={48} />
                        <h3 className="text-xl font-semibold">Registration Complete!</h3>
                        <p className="text-sm text-brand-text-alt">Your account has been created. You can now sign in.</p>
                        <button onClick={onSwitchToSignIn} className="w-full btn-primary">Go to Sign In</button>
                    </div>
                )
        }
    }

    return (
        <AuthCard>
             <h2 className="text-3xl font-bold text-center mb-2">Create Your Account</h2>
             <p className="text-center text-brand-text-alt mb-6">Join the GROW YouR NEED universe.</p>
             <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                >
                    {renderStep()}
                </motion.div>
            </AnimatePresence>

            <p className="text-center text-sm mt-6">
                Already have an account?{' '}
                <button onClick={onSwitchToSignIn} className="font-semibold text-brand-primary hover:underline">
                    Sign In
                </button>
            </p>
        </AuthCard>
    );
};

export default SignUpView;