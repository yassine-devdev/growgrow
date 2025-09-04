import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GlobeIllustration: React.FC = () => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-full h-full flex items-center justify-center"
    >
        <div className="relative w-80 h-80">
            {/* Globe Sphere */}
            <motion.div
                className="absolute inset-0 rounded-full border-2 border-cyan-300/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute inset-2 rounded-full border-2 border-cyan-300/30"
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-4 rounded-full bg-cyan-400/10 shadow-inner shadow-cyan-300/50" />

            {/* Particle Trails */}
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full"
                    style={{ top: '50%', left: '50%' }}
                    animate={{
                        x: [0, 100 * Math.cos(i * 2 * Math.PI / 5), 0],
                        y: [0, 100 * Math.sin(i * 2 * Math.PI / 5), 0],
                        scale: [1, 0.5, 1],
                        opacity: [0, 1, 0]
                    }}
                    transition={{
                        duration: 3 + i * 0.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.2
                    }}
                />
            ))}
        </div>
    </motion.div>
);

const MultiverseIllustration: React.FC = () => (
     <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-full h-full flex items-center justify-center"
    >
        <div className="relative w-80 h-80">
            {/* Central Core */}
            <motion.div
                className="absolute top-1/2 left-1/2 w-16 h-16 rounded-full bg-indigo-500/50 -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-indigo-400/50"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Orbiting Books/Data Streams */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-8 h-10 bg-white/10 border border-white/20 rounded-md -translate-x-1/2 -translate-y-1/2"
                    style={{ originX: '50%', originY: `${-100 - i * 15}px` }}
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 10 + i * 2,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            ))}
        </div>
    </motion.div>
);

interface AuthIllustrationProps {
    mode: 'signIn' | 'signUp';
}

const AuthIllustration: React.FC<AuthIllustrationProps> = ({ mode }) => {
    return (
        <div className="w-full h-full">
            <AnimatePresence mode="wait">
                {mode === 'signIn' ? (
                    <GlobeIllustration key="signIn" />
                ) : (
                    <MultiverseIllustration key="signUp" />
                )}
            </AnimatePresence>
        </div>
    );
};

export default AuthIllustration;