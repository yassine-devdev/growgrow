import React from 'react';
import AuthIllustration from './AuthIllustration';

interface AuthLayoutProps {
    children: React.ReactNode;
    mode: 'signIn' | 'signUp';
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, mode }) => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 lg:p-0">
            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[90vh] lg:min-h-0 lg:h-[80vh] max-h-[700px]">
                {/* Left Panel: Form */}
                <div className="relative flex items-center justify-center">
                    {children}
                </div>

                {/* Right Panel: Illustration */}
                <div className="hidden lg:flex items-center justify-center p-8 relative overflow-hidden">
                    <AuthIllustration mode={mode} />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;