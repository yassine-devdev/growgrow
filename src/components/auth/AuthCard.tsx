import React from 'react';
import { motion } from 'framer-motion';

const AuthCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl"
        >
            {children}
        </motion.div>
    );
};

export default AuthCard;