import React from 'react';

/**
 * A wrapper component for custom SVG icons to provide a consistent `viewBox`.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The SVG path elements for the icon.
 * @param {string} [props.className] - Optional CSS classes.
 * @returns {JSX.Element} The rendered SVG wrapper.
 */
const IconWrapper: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <svg 
        viewBox="0 0 64 64" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className={className}
    >
        {children}
    </svg>
);

/**
 * Custom SVG icon for 'Dashboard'.
 * @param {{className?: string}} props - Component props.
 * @returns {JSX.Element}
 */
const DashboardIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <title>Dashboard</title>
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: '#818cf8', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#4f46e5', stopOpacity: 1}} />
            </linearGradient>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: '#6ee7b7', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#10b981', stopOpacity: 1}} />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.3"/>
            </filter>
        </defs>
        <g filter="url(#shadow)">
            <path d="M8,56 L56,56 L56,8 L8,8 Z" fill="#2c2c44" opacity="0.8" rx="4"/>
            <rect x="14" y="36" width="10" height="12" rx="2" fill="url(#grad1)" />
            <rect x="27" y="28" width="10" height="20" rx="2" fill="url(#grad1)" />
            <rect x="40" y="20" width="10" height="28" rx="2" fill="url(#grad1)" />
            <path d="M14 24 C 20 16, 28 18, 34 22 S 46 24, 50 18" stroke="url(#grad2)" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
    </IconWrapper>
);

/**
 * Custom SVG icon for 'Schools'.
 * @param {{className?: string}} props - Component props.
 * @returns {JSX.Element}
 */
const SchoolsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <title>Schools</title>
        <defs>
            <linearGradient id="schoolWall" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fde68a"/>
                <stop offset="100%" stopColor="#f59e0b"/>
            </linearGradient>
            <linearGradient id="schoolRoof" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444"/>
                <stop offset="100%" stopColor="#b91c1c"/>
            </linearGradient>
            <filter id="shadowSchool" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.4"/>
            </filter>
        </defs>
        <g filter="url(#shadowSchool)">
            <path d="M32 6 L60 24 L52 24 L52 58 L12 58 L12 24 L4 24 Z" fill="url(#schoolWall)"/>
            <path d="M32 6 L60 24 L4 24 Z" fill="url(#schoolRoof)"/>
            <rect x="20" y="38" width="10" height="20" fill="#60a5fa"/>
            <rect x="34" y="38" width="10" height="10" fill="#60a5fa"/>
            <rect x="22" y="26" width="20" height="8" fill="#1e293b" />
        </g>
    </IconWrapper>
);

/**
 * Custom SVG icon for 'Tools'.
 * @param {{className?: string}} props - Component props.
 * @returns {JSX.Element}
 */
const ToolsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <title>Tools</title>
        <defs>
            <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#e5e7eb" />
                <stop offset="50%" stopColor="#9ca3af" />
                <stop offset="100%" stopColor="#d1d5db" />
            </linearGradient>
            <filter id="shadowTool" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="3" dy="3" stdDeviation="2" floodColor="#000" floodOpacity="0.5"/>
            </filter>
        </defs>
        <g transform="rotate(45 32 32)" filter="url(#shadowTool)">
            <path d="M20,8 C11,8 8,11 8,20 C8,29 11,32 20,32 L26,32 L26,38 C26,44 29,48 36,48 C43,48 46,44 46,38 L46,26 L52,26 C58,26 62,23 62,17 C62,11 58,8 52,8 Z" fill="url(#metal)" />
            <path d="M36 34 a 6 6 0 0 1 0 8 Z" fill="#4b5563" />
        </g>
    </IconWrapper>
);

/**
 * Custom SVG icon for 'Communication'.
 * @param {{className?: string}} props - Component props.
 * @returns {JSX.Element}
 */
const CommunicationIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <title>Communication</title>
         <defs>
            <filter id="shadowComm" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.3"/>
            </filter>
             <linearGradient id="envFront" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#e5e7eb" />
            </linearGradient>
             <linearGradient id="envBack" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor="#d1d5db" />
                <stop offset="100%" stopColor="#9ca3af" />
            </linearGradient>
        </defs>
        <g filter="url(#shadowComm)">
            <path d="M6 18 L58 18 L58 50 L6 50 Z" fill="url(#envBack)" />
            <path d="M6 18 L32 36 L58 18 L58 16 L6 16 Z" fill="url(#envFront)" />
            <path d="M8 48 L32 30 L56 48" fill="none" stroke="#9ca3af" strokeWidth="2" />
        </g>
    </IconWrapper>
);

/**
 * Custom SVG icon for 'Concierge'.
 * @param {{className?: string}} props - Component props.
 * @returns {JSX.Element}
 */
const ConciergeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <title>Concierge</title>
        <defs>
            <radialGradient id="botHead" cx="0.4" cy="0.4" r="0.6">
                <stop offset="0%" stopColor="#f3f4f6" />
                <stop offset="100%" stopColor="#9ca3af" />
            </radialGradient>
            <radialGradient id="botEye" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#67e8f9" />
                <stop offset="100%" stopColor="#0891b2" />
            </radialGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
             <filter id="shadowBot" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.4"/>
            </filter>
        </defs>
        <g filter="url(#shadowBot)">
            <circle cx="32" cy="32" r="24" fill="url(#botHead)" />
            <rect x="12" y="36" width="40" height="4" rx="2" fill="#4b5563" />
            <circle cx="24" cy="28" r="5" fill="url(#botEye)" filter="url(#glow)" />
            <circle cx="40" cy="28" r="5" fill="url(#botEye)" filter="url(#glow)" />
            <path d="M22 56 A 10 10 0 0 0 42 56" stroke="#4b5563" strokeWidth="3" fill="none" />
        </g>
    </IconWrapper>
);

/**
 * Custom SVG icon for 'Directories'.
 * @param {{className?: string}} props - Component props.
 * @returns {JSX.Element}
 */
const DirectoriesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <title>Directories</title>
        <defs>
            <linearGradient id="folderBack" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fcd34d" />
                <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
            <linearGradient id="folderFront" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fdba74" />
                <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
            <filter id="shadowFolder" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.2"/>
            </filter>
        </defs>
        <g filter="url(#shadowFolder)">
            <path d="M4 12 H 24 L 28 16 H 60 V 52 H 4 V 12 Z" fill="url(#folderBack)" />
            <path d="M6 20 H 58 V 50 H 6 V 20 Z" fill="url(#folderFront)" />
        </g>
    </IconWrapper>
);

/**
 * Custom SVG icon for 'System'.
 * @param {{className?: string}} props - Component props.
 * @returns {JSX.Element}
 */
const SystemIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <title>System</title>
         <defs>
            <linearGradient id="gear" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#9ca3af" />
                <stop offset="100%" stopColor="#4b5563" />
            </linearGradient>
             <filter id="shadowGear" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.5"/>
            </filter>
        </defs>
        <g filter="url(#shadowGear)">
            <path fill="url(#gear)" d="M41.3,14.6 L41.2,14.7 L43.9,20 L48.8,19.3 L49.5,24.2 L44.3,27.1 L44.3,27.1 L44.6,30.3 L49.9,33.1 L49.2,38 L44.2,37.3 L41.6,42.5 L41.6,42.5 L41.4,42.7 L38,40.1 L37.9,40 L34.8,44.5 L29.9,43.9 L27,48.9 L22.1,48.2 L19.3,43.2 L14.4,43.9 L13.8,39 L18.9,36.4 L18.9,36.3 L18.6,33 L13.4,30.2 L14.1,25.3 L19.1,26 L21.7,20.8 L21.7,20.8 L21.9,20.6 L25.3,23.2 L25.4,23.3 L28.5,18.8 L33.4,19.4 L36.2,14.4 L41.1,15.1 Z M32,26.4 C28.4,26.4 25.5,29.3 25.5,32.8 C25.5,36.4 28.4,39.2 32,39.2 C35.6,39.2 38.5,36.4 38.5,32.8 C38.5,29.3 35.6,26.4 32,26.4 Z" />
        </g>
    </IconWrapper>
);

/**
 * Custom SVG icon for 'Knowledge'.
 * @param {{className?: string}} props - Component props.
 * @returns {JSX.Element}
 */
const KnowledgeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <title>Knowledge</title>
        <defs>
             <linearGradient id="openBookCover" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#22c55e"/>
                <stop offset="100%" stopColor="#15803d"/>
            </linearGradient>
            <filter id="shadowOpenBook" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="3" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.3"/>
            </filter>
        </defs>
        <g filter="url(#shadowOpenBook)">
            <path d="M32 12 L 8 20 V 52 C 8 54 10 56 12 56 H 32 V 12 Z" fill="url(#openBookCover)"/>
            <path d="M32 12 L 56 20 V 52 C 56 54 54 56 52 56 H 32 V 12 Z" fill="url(#openBookCover)"/>
            <path d="M32 16 L 12 24 V 52 H 32 V 16 Z" fill="#fff"/>
            <path d="M32 16 L 52 24 V 52 H 32 V 16 Z" fill="#f3f4f6"/>
             <path d="M16 30 H 28 M 16 36 H 28 M 16 42 H 24" stroke="#9ca3af" strokeWidth="1.5"/>
             <path d="M36 30 H 48 M 36 36 H 48 M 36 42 H 44" stroke="#9ca3af" strokeWidth="1.5"/>
        </g>
    </IconWrapper>
);

/**
 * Custom SVG icon for 'Personal Hub'.
 * @param {{className?: string}} props - Component props.
 * @returns {JSX.Element}
 */
const PersonalHubIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <title>Personal Hub</title>
        <defs>
            <linearGradient id="hubWall" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa"/>
                <stop offset="100%" stopColor="#8b5cf6"/>
            </linearGradient>
            <linearGradient id="hubRoof" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f472b6"/>
                <stop offset="100%" stopColor="#db2777"/>
            </linearGradient>
             <filter id="shadowHub" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.3"/>
            </filter>
        </defs>
        <g filter="url(#shadowHub)">
            <path d="M10 30 H 54 V 58 H 10 Z" fill="url(#hubWall)"/>
            <path d="M6 32 L 32 8 L 58 32 Z" fill="url(#hubRoof)"/>
            <rect x="26" y="42" width="12" height="16" fill="#f0abfc"/>
        </g>
    </IconWrapper>
);

/**
 * Custom SVG icon for 'Studio'.
 * @param {{className?: string}} props - Component props.
 * @returns {JSX.Element}
 */
const StudioIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <title>Studio</title>
        <defs>
            <linearGradient id="micBody" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#d1d5db"/>
                <stop offset="100%" stopColor="#4b5563"/>
            </linearGradient>
            <linearGradient id="micGrill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f3f4f6"/>
                <stop offset="100%" stopColor="#9ca3af"/>
            </linearGradient>
            <filter id="shadowMic" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.4"/>
            </filter>
        </defs>
        <g filter="url(#shadowMic)">
            <rect x="24" y="8" width="16" height="28" rx="8" fill="url(#micGrill)" />
            <path d="M20 36 H 44 V 44 A 12 12 0 0 1 32 56 A 12 12 0 0 1 20 44 Z" fill="url(#micBody)" />
            <rect x="28" y="54" width="8" height="6" fill="#374151" />
        </g>
    </IconWrapper>
);

/**
 * Custom SVG icon for 'Media'.
 * @param {{className?: string}} props - Component props.
 * @returns {JSX.Element}
 */
const MediaIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <title>Media</title>
        <defs>
            <linearGradient id="tvCase" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4b5563"/>
                <stop offset="100%" stopColor="#1f2937"/>
            </linearGradient>
            <radialGradient id="tvScreenGlow" cx="0.5" cy="0.5" r="0.7">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.7"/>
                <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.9"/>
            </radialGradient>
            <filter id="shadowTV" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="3" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.5"/>
            </filter>
        </defs>
        <g filter="url(#shadowTV)">
            <rect x="6" y="12" width="52" height="40" rx="6" fill="url(#tvCase)" />
            <rect x="12" y="18" width="32" height="28" rx="2" fill="url(#tvScreenGlow)" />
            <rect x="48" y="24" width="4" height="4" rx="1" fill="#9ca3af" />
            <rect x="48" y="32" width="4" height="4" rx="1" fill="#9ca3af" />
            <path d="M24 52 L 20 58 H 44 L 40 52 Z" fill="#374151" />
        </g>
    </IconWrapper>
);

/**
 * Custom SVG icon for 'Gamification'.
 * @param {{className?: string}} props - Component props.
 * @returns {JSX.Element}
 */
const GamificationIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <title>Gamification</title>
        <defs>
            <linearGradient id="maskHappy" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fde68a"/>
                <stop offset="100%" stopColor="#f59e0b"/>
            </linearGradient>
            <linearGradient id="maskSad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#a78bfa"/>
                <stop offset="100%" stopColor="#6d28d9"/>
            </linearGradient>
             <filter id="shadowMask" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.3"/>
            </filter>
        </defs>
        <g filter="url(#shadowMask)" transform="rotate(-15 32 32)">
            <path d="M16 20 C 16 12 24 8 32 12 C 40 8 48 12 48 20 V 40 C 48 48 40 52 32 48 C 24 52 16 48 16 40 Z" fill="url(#maskSad)" />
            <path d="M24 40 Q 32 32 40 40" stroke="#1e293b" strokeWidth="2" fill="none" />
            <circle cx="26" cy="28" r="3" fill="#1e293b" />
            <circle cx="38" cy="28" r="3" fill="#1e293b" />
        </g>
         <g filter="url(#shadowMask)" transform="rotate(15 32 32) translate(10, -10)">
            <path d="M16 20 C 16 12 24 8 32 12 C 40 8 48 12 48 20 V 40 C 48 48 40 52 32 48 C 24 52 16 48 16 40 Z" fill="url(#maskHappy)" />
            <path d="M24 36 Q 32 44 40 36" stroke="#1e293b" strokeWidth="2" fill="none" />
            <circle cx="26" cy="28" r="3" fill="#1e293b" />
            <circle cx="38" cy="28" r="3" fill="#1e293b" />
        </g>
    </IconWrapper>
);

/**
 * Custom SVG icon for 'Leisure'.
 * @param {{className?: string}} props - Component props.
 * @returns {JSX.Element}
 */
const LeisureIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <title>Leisure</title>
        <defs>
            <linearGradient id="starGrad" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor="#fcd34d"/>
                <stop offset="100%" stopColor="#f97316"/>
            </linearGradient>
            <filter id="shadowStar" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.4"/>
            </filter>
        </defs>
        <g filter="url(#shadowStar)">
            <path d="M32 4 L40 20 L58 22 L44 36 L48 54 L32 44 L16 54 L20 36 L6 22 L24 20 Z" fill="url(#starGrad)" />
        </g>
    </IconWrapper>
);

/**
 * Custom SVG icon for 'Marketplace'.
 * @param {{className?: string}} props - Component props.
 * @returns {JSX.Element}
 */
const MarketIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <title>Marketplace</title>
        <defs>
            <linearGradient id="cartGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#e5e7eb" />
                <stop offset="100%" stopColor="#9ca3af" />
            </linearGradient>
            <filter id="shadowCart" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.3"/>
            </filter>
        </defs>
        <g filter="url(#shadowCart)">
            <path d="M10 12 L18 12 L22 40 H 50 L 54 20 H 24" fill="none" stroke="url(#cartGrad)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
            <circle cx="26" cy="50" r="4" fill="#4f46e5" />
            <circle cx="46" cy="50" r="4" fill="#4f46e5" />
        </g>
    </IconWrapper>
);

/**
 * Custom SVG icon for 'Lifestyle'.
 * @param {{className?: string}} props - Component props.
 * @returns {JSX.Element}
 */
const LifestyleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <title>Lifestyle</title>
        <defs>
             <linearGradient id="planeBody" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor="#f9fafb"/>
                <stop offset="100%" stopColor="#d1d5db"/>
            </linearGradient>
            <linearGradient id="planeWing" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor="#60a5fa"/>
                <stop offset="100%" stopColor="#2563eb"/>
            </linearGradient>
            <filter id="shadowPlane" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="4" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.3"/>
            </filter>
        </defs>
        <g filter="url(#shadowPlane)" transform="rotate(-45 32 32)">
            <path d="M32 12 C 40 12, 44 20, 44 28 L 56 32 L 44 36 C 44 44, 40 52, 32 52 C 24 52, 20 44, 20 36 L 8 32 L 20 28 C 20 20, 24 12, 32 12 Z" fill="url(#planeBody)" />
            <path d="M32 20 L 48 8 L 40 20 Z" fill="url(#planeWing)" />
            <path d="M32 44 L 48 56 L 40 44 Z" fill="url(#planeWing)" />
             <path d="M24 20 L 8 8 L 16 20 Z" fill="url(#planeWing)" />
        </g>
    </IconWrapper>
);

/**
 * Custom SVG icon for 'Hobbies'.
 * @param {{className?: string}} props - Component props.
 * @returns {JSX.Element}
 */
const HobbiesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <title>Hobbies</title>
        <defs>
            <linearGradient id="heartGrad" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor="#fb7185"/>
                <stop offset="100%" stopColor="#e11d48"/>
            </linearGradient>
            <filter id="shadowHeart" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.4"/>
            </filter>
        </defs>
        <g filter="url(#shadowHeart)">
             <path d="M32 12 C 20 12 12 20 12 28 C 12 44 32 56 32 56 C 32 56 52 44 52 28 C 52 20 44 12 32 12 Z" fill="url(#heartGrad)" />
        </g>
    </IconWrapper>
);

/**
 * Custom SVG icon for 'Sports'.
 * @param {{className?: string}} props - Component props.
 * @returns {JSX.Element}
 */
const SportsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <title>Sports</title>
        <defs>
             <linearGradient id="dumbbellGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#374151"/>
                <stop offset="50%" stopColor="#9ca3af"/>
                <stop offset="100%" stopColor="#374151"/>
            </linearGradient>
            <filter id="shadowDumbbell" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#000" floodOpacity="0.4"/>
            </filter>
        </defs>
        <g filter="url(#shadowDumbbell)">
            <rect x="8" y="24" width="10" height="16" rx="2" fill="url(#dumbbellGrad)"/>
            <rect x="46" y="24" width="10" height="16" rx="2" fill="url(#dumbbellGrad)"/>
            <rect x="18" y="28" width="28" height="8" rx="2" fill="#9ca3af"/>
        </g>
    </IconWrapper>
);

/**
 * Custom SVG icon for 'Religion'.
 * @param {{className?: string}} props - Component props.
 * @returns {JSX.Element}
 */
const ReligionIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <title>Religion</title>
        <defs>
             <linearGradient id="landmarkGrad" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor="#f3f4f6"/>
                <stop offset="100%" stopColor="#d1d5db"/>
            </linearGradient>
            <linearGradient id="landmarkRoof" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor="#fbbf24"/>
                <stop offset="100%" stopColor="#d97706"/>
            </linearGradient>
             <filter id="shadowLandmark" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.3"/>
            </filter>
        </defs>
        <g filter="url(#shadowLandmark)">
            <path d="M10 56 H 54 V 52 L 50 28 H 14 L 10 52 Z" fill="url(#landmarkGrad)"/>
            <rect x="16" y="28" width="4" height="24" fill="#9ca3af"/>
            <rect x="26" y="28" width="4" height="24" fill="#9ca3af"/>
            <rect x="36" y="28" width="4" height="24" fill="#9ca3af"/>
            <rect x="44" y="28" width="4" height="24" fill="#9ca3af"/>
            <path d="M32 8 L 58 28 H 6 Z" fill="url(#landmarkRoof)"/>
        </g>
    </IconWrapper>
);

/**
 * Custom SVG icon for 'Sudoku'.
 * @param {{className?: string}} props - Component props.
 * @returns {JSX.Element}
 */
const SudokuIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <title>Sudoku</title>
        <defs>
            <linearGradient id="sudokuGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#818cf8"/>
                <stop offset="100%" stopColor="#4f46e5"/>
            </linearGradient>
            <filter id="shadowSudoku" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.3"/>
            </filter>
        </defs>
        <g filter="url(#shadowSudoku)">
            <rect x="8" y="8" width="48" height="48" rx="4" fill="url(#sudokuGrad)" />
            <path d="M25.33 8 V 56 M 38.66 8 V 56 M 8 25.33 H 56 M 8 38.66 H 56" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" />
            <rect x="9" y="9" width="16" height="16" fill="white" fillOpacity="0.2" rx="2" />
            <rect x="39" y="9" width="16" height="16" fill="white" fillOpacity="0.2" rx="2" />
            <rect x="26" y="26" width="12" height="12" fill="white" fillOpacity="0.2" rx="2" />
            <rect x="9" y="39" width="16" height="16" fill="white" fillOpacity="0.2" rx="2" />
            <rect x="39" y="39" width="16" height="16" fill="white" fillOpacity="0.2" rx="2" />
        </g>
    </IconWrapper>
);

/**
 * Custom SVG icon for 'CRM'.
 * @param {{className?: string}} props - Component props.
 * @returns {JSX.Element}
 */
const CrmIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <title>CRM</title>
         <defs>
            <linearGradient id="crmGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#38bdf8"/>
                <stop offset="100%" stopColor="#0ea5e9"/>
            </linearGradient>
             <filter id="shadowCrm" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.3"/>
            </filter>
        </defs>
        <g filter="url(#shadowCrm)">
            <path d="M8 12 H 56 V 52 H 8 V 12 Z" fill="url(#crmGrad)" rx="4"/>
            <path d="M8 12 H 56 V 20 H 8 V 12 Z" fill="#0284c7"/>
            <circle cx="16" cy="16" r="2" fill="white"/>
            <circle cx="24" cy="16" r="2" fill="white"/>
        </g>
    </IconWrapper>
);

/**
 * Custom SVG icon for 'HRM'.
 * @param {{className?: string}} props - Component props.
 * @returns {JSX.Element}
 */
const HrmIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <title>HRM</title>
        <defs>
            <linearGradient id="hrmGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#a78bfa"/>
                <stop offset="100%" stopColor="#7c3aed"/>
            </linearGradient>
            <filter id="shadowHrm" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.3"/>
            </filter>
        </defs>
        <g filter="url(#shadowHrm)">
            <circle cx="32" cy="24" r="8" fill="url(#hrmGrad)"/>
            <path d="M16 56 V 48 C 16 40 24 40 32 40 C 40 40 48 40 48 48 V 56 Z" fill="url(#hrmGrad)"/>
        </g>
    </IconWrapper>
);


/**
 * A map of string keys to their corresponding custom icon components.
 * This allows for dynamic rendering of these custom icons based on an ID.
 * @type {Record<string, React.FC<{ className?: string }>>}
 */
export const customIcons: { [key: string]: React.FC<{ className?: string }> } = {
  // Main Navigation Icons
  dashboard: DashboardIcon,
  schools: SchoolsIcon,
  tools: ToolsIcon,
  communication: CommunicationIcon,
  concierge: ConciergeIcon,
  directories: DirectoriesIcon,
  system: SystemIcon,
  'school-hub': SchoolsIcon,
  comms: CommunicationIcon,
  knowledge: KnowledgeIcon,
  'personal-hub': PersonalHubIcon,
  crm: CrmIcon,
  hrm: HrmIcon,
  
  // Footer App Icons
  studio: StudioIcon,
  media: MediaIcon,
  gamification: GamificationIcon,
  leisure: LeisureIcon,
  market: MarketIcon,
  lifestyle: LifestyleIcon,
  hobbies: HobbiesIcon,
  sports: SportsIcon,
  religion: ReligionIcon,
  sudoku: SudokuIcon,
  services: ToolsIcon,
};

/**
 * @typedef {object} CustomIconProps
 * @property {string} name - The key of the icon to render from the `customIcons` map.
 * @property {string} [className] - Optional CSS classes to apply to the SVG.
 */
interface CustomIconProps {
  name: string;
  className?: string;
}

/**
 * A component to dynamically render a custom SVG icon from a predefined map.
 * @param {CustomIconProps} props - The component props.
 * @returns {JSX.Element | null} The rendered SVG icon component, or null if the name is not found.
 */
const CustomIcon: React.FC<CustomIconProps> = ({ name, className }) => {
  const IconComponent = customIcons[name];
  return IconComponent ? <IconComponent className={className} /> : null;
};

export default CustomIcon;
