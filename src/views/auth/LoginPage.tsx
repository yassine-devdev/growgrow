import React, { useState, useEffect } from 'react';
import AuthLayout from './AuthLayout';
import SignInView from './SignInView';
import SignUpView from './SignUpView';

const LoginPage: React.FC = () => {
    const [isSignIn, setIsSignIn] = useState(true);

    useEffect(() => {
        document.body.style.background = 'linear-gradient(135deg, #00CFFF, #3F51B5)';
        return () => {
            document.body.style.background = ''; // Revert to default on unmount
        };
    }, []);

    const toggleView = () => setIsSignIn(prev => !prev);

    return (
        <AuthLayout mode={isSignIn ? 'signIn' : 'signUp'}>
            {isSignIn ? (
                <SignInView onSwitchToSignUp={toggleView} />
            ) : (
                <SignUpView onSwitchToSignIn={toggleView} />
            )}
        </AuthLayout>
    );
};

export default LoginPage;