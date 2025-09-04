import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signInSchema, phoneOtpSchema, otpVerifySchema, SignInFormData, PhoneOtpFormData, OtpVerifyFormData } from '@/api/schemas/authSchemas';
import { useAppStore } from '@/store/useAppStore';
import { useMutation } from '@tanstack/react-query';
import { loginUser, requestPhoneOtp, verifyPhoneOtp, getAuthenticationOptions, verifyAuthentication } from '@/api/authApi';
import { startAuthentication } from '@simplewebauthn/browser';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Smartphone, Fingerprint, Loader2, ArrowLeft } from 'lucide-react';
import AuthCard from '@/components/auth/AuthCard';
import ControlledInput from '@/components/auth/ControlledInput';
import PhoneInput from '@/components/auth/PhoneInput';

type SignInMode = 'password' | 'otp' | 'biometric';
type OtpStep = 'phone' | 'verify';

interface SignInViewProps {
    onSwitchToSignUp: () => void;
}

const SignInView: React.FC<SignInViewProps> = ({ onSwitchToSignUp }) => {
    const [mode, setMode] = useState<SignInMode>('password');
    const [otpStep, setOtpStep] = useState<OtpStep>('phone');
    const [phoneForOtp, setPhoneForOtp] = useState('');
    const { login, addToast } = useAppStore();

    // Password Login Form
    const { control: passwordControl, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors } } = useForm<SignInFormData>({
        resolver: yupResolver(signInSchema),
        defaultValues: { identifier: '', password: '' }
    });

    // Phone OTP Form
    const { control: phoneControl, handleSubmit: handlePhoneSubmit, formState: { errors: phoneErrors } } = useForm<PhoneOtpFormData>({
        resolver: yupResolver(phoneOtpSchema),
        defaultValues: { phone: '' }
    });
    
    // OTP Verify Form
    const { control: otpControl, handleSubmit: handleOtpVerifySubmit, formState: { errors: otpErrors } } = useForm<OtpVerifyFormData>({
        resolver: yupResolver(otpVerifySchema),
        defaultValues: { otp: '' }
    });

    const loginMutation = useMutation({
        mutationFn: (role: any) => loginUser('Individual'), // Simulating login
        onSuccess: (data) => login(data.user),
        onError: (error: any) => addToast({ message: error.message || "Login failed", type: 'error' }),
    });

    const otpRequestMutation = useMutation({
        mutationFn: requestPhoneOtp,
        onSuccess: (data, phone) => {
            setPhoneForOtp(phone);
            setOtpStep('verify');
        },
        onError: (error: any) => addToast({ message: error.message || "Failed to send OTP", type: 'error' }),
    });

    const otpVerifyMutation = useMutation({
        mutationFn: (data: { phone: string; otp: string }) => verifyPhoneOtp(data.phone, data.otp),
        onSuccess: (data) => login(data.user),
        onError: (error: any) => addToast({ message: error.message || "OTP verification failed", type: 'error' }),
    });


    const onPasswordLogin = (data: SignInFormData) => {
        console.log('Password login attempt:', data);
        loginMutation.mutate({});
    };

    const onRequestOtp = (data: PhoneOtpFormData) => {
        otpRequestMutation.mutate(data.phone);
    };

    const onVerifyOtp = (data: OtpVerifyFormData) => {
        otpVerifyMutation.mutate({ phone: phoneForOtp, otp: data.otp });
    };

    const handleBiometricLogin = async () => {
        try {
            const options = await getAuthenticationOptions();
            const assertion = await startAuthentication(options);
            const { user } = await verifyAuthentication(assertion);
            login(user);
        } catch (error: any) {
            console.error(error);
            addToast({ message: error.message || 'Biometric login failed.', type: 'error' });
        }
    };
    
    const renderContent = () => {
        if (mode === 'otp') {
            return (
                <AnimatePresence mode="wait">
                    {otpStep === 'phone' ? (
                        <motion.div key="phone" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}>
                            <form onSubmit={handlePhoneSubmit(onRequestOtp)} className="space-y-6">
                                <h3 className="text-xl font-semibold text-center">Sign In with Phone</h3>
                                <PhoneInput control={phoneControl} name="phone" error={phoneErrors.phone} />
                                <button type="submit" disabled={otpRequestMutation.isPending} className="w-full btn-primary">
                                    {otpRequestMutation.isPending ? <Loader2 className="animate-spin" /> : 'Send OTP'}
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                         <motion.div key="verify" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                            <button onClick={() => setOtpStep('phone')} className="flex items-center gap-2 text-sm text-brand-text-alt mb-4"><ArrowLeft size={16}/> Back</button>
                            <form onSubmit={handleOtpVerifySubmit(onVerifyOtp)} className="space-y-6">
                                 <p className="text-sm text-center">Enter the 6-digit code sent to +{phoneForOtp}</p>
                                <ControlledInput control={otpControl} name="otp" label="OTP Code" error={otpErrors.otp} />
                                <button type="submit" disabled={otpVerifyMutation.isPending} className="w-full btn-primary">
                                    {otpVerifyMutation.isPending ? <Loader2 className="animate-spin" /> : 'Verify & Sign In'}
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            );
        }
        
        if(mode === 'biometric') {
             return (
                <div className="text-center space-y-6">
                    <h3 className="text-xl font-semibold">Sign In with Biometrics</h3>
                    <p className="text-sm text-brand-text-alt">Use your registered fingerprint or face to sign in instantly.</p>
                    <button onClick={handleBiometricLogin} className="w-full btn-primary flex items-center justify-center gap-2">
                        <Fingerprint /> Activate Scanner
                    </button>
                </div>
            )
        }

        // Default: Password mode
        return (
             <form onSubmit={handlePasswordSubmit(onPasswordLogin)} className="space-y-4">
                 <ControlledInput control={passwordControl} name="identifier" label="Email or Username" error={passwordErrors.identifier} />
                 <ControlledInput control={passwordControl} name="password" label="Password" type="password" error={passwordErrors.password} />
                 <button type="submit" disabled={loginMutation.isPending} className="w-full btn-primary mt-2">
                    {loginMutation.isPending ? <Loader2 className="animate-spin" /> : 'Sign In'}
                </button>
             </form>
        );
    }

    return (
        <AuthCard>
            <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
            <p className="text-center text-brand-text-alt mb-6">Sign in to continue to your universe.</p>
            
            <div className="flex items-center justify-center gap-2 mb-6">
                 <button onClick={() => setMode('password')} className={`auth-tab ${mode === 'password' ? 'active' : ''}`}><Mail size={16}/> Password</button>
                 <button onClick={() => setMode('otp')} className={`auth-tab ${mode === 'otp' ? 'active' : ''}`}><Smartphone size={16}/> OTP</button>
                 <button onClick={() => setMode('biometric')} className={`auth-tab ${mode === 'biometric' ? 'active' : ''}`}><Fingerprint size={16}/> Biometric</button>
            </div>
            
            {renderContent()}

            <p className="text-center text-sm mt-6">
                Don't have an account?{' '}
                <button onClick={onSwitchToSignUp} className="font-semibold text-brand-primary hover:underline">
                    Sign Up
                </button>
            </p>
        </AuthCard>
    );
};

export default SignInView;