import React, { useState, useEffect, useRef } from 'react';
import { LucideIcon, X, Minus, Maximize, Minimize2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from 'react-i18next';

/**
 * @typedef {object} OverlayWindowProps
 * @property {string} appId - The unique identifier for the application within the window.
 * @property {string} title - The translation key for the window's title.
 * @property {LucideIcon} icon - The icon component to display in the header.
 * @property {number} zIndex - The CSS z-index for stacking the window.
 * @property {React.ReactNode} children - The content of the application to be rendered inside the window.
 */
interface OverlayWindowProps {
    appId: string;
    title: string;
    icon: LucideIcon;
    zIndex: number;
    children: React.ReactNode;
}

const MIN_WIDTH = 400;
const MIN_HEIGHT = 300;

/**
 * Renders a draggable, resizable, and interactive window for an overlay application.
 * It handles its own position, dragging logic, and window controls (minimize, maximize, close).
 * It also includes accessibility features like a focus trap.
 *
 * @param {OverlayWindowProps} props - The component props.
 * @returns {JSX.Element} The rendered overlay window.
 */
const OverlayWindow: React.FC<OverlayWindowProps> = ({ appId, title, icon: Icon, zIndex, children }) => {
    const closeOverlay = useAppStore((state) => state.closeOverlay);
    const minimizeOverlay = useAppStore((state) => state.minimizeOverlay);
    const focusOverlay = useAppStore((state) => state.focusOverlay);
    const { t } = useTranslation();
    
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [size, setSize] = useState({ width: 800, height: 600 });
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [prevPosition, setPrevPosition] = useState({ x: 0, y: 0 });
    const [prevSize, setPrevSize] = useState({ width: 800, height: 600 });


    const windowRef = useRef<HTMLDivElement>(null);
    const dragRef = useRef({ startX: 0, startY: 0 });
    const resizeRef = useRef({ startX: 0, startY: 0, startWidth: 0, startHeight: 0, direction: '' });

    // Center window on initial mount
    useEffect(() => {
        setPosition({
            x: window.innerWidth / 2 - size.width / 2,
            y: window.innerHeight / 2 - size.height / 2,
        });
    }, []); // Empty dependency array ensures this runs only once on mount

    // Accessibility: Focus trap and initial focus
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Tab') {
                const focusableElements = windowRef.current?.querySelectorAll<HTMLElement>(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (!focusableElements || focusableElements.length === 0) return;

                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (event.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        event.preventDefault();
                    }
                } else { // Tab
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        event.preventDefault();
                    }
                }
            }
        };

        const currentWindow = windowRef.current;
        if (currentWindow) {
            const firstFocusable = currentWindow.querySelector<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            firstFocusable?.focus();
            currentWindow.addEventListener('keydown', handleKeyDown);
            return () => {
                currentWindow.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [appId]);

    const handleDragMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isMaximized) return;
        focusOverlay(appId);
        setIsDragging(true);
        dragRef.current = {
            startX: e.clientX - position.x,
            startY: e.clientY - position.y,
        };
    };

    const handleResizeMouseDown = (e: React.MouseEvent<HTMLButtonElement>, direction: string) => {
        if (isMaximized) return;
        e.stopPropagation();
        focusOverlay(appId);
        setIsResizing(true);
        resizeRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            startWidth: size.width,
            startHeight: size.height,
            direction,
        };
    };
    
    const handleMaximizeToggle = () => {
        focusOverlay(appId);
        if (isMaximized) {
            // Restore
            setSize(prevSize);
            setPosition(prevPosition);
            setIsMaximized(false);
        } else {
            // Maximize
            setPrevSize(size);
            setPrevPosition(position);
            
            const topPadding = 24;
            const rightGutter = 80 + 24 + 24; // Right sidebar + gap + right padding
            const bottomGutter = 68 + 24 + 24; // Footer + gap + bottom padding
            const leftPadding = 24;

            setPosition({ x: leftPadding, y: topPadding });
            setSize({
                width: window.innerWidth - leftPadding - rightGutter,
                height: window.innerHeight - topPadding - bottomGutter
            });
            setIsMaximized(true);
        }
    };
    
    const handleKeyboardResize = (e: React.KeyboardEvent<HTMLButtonElement>, direction: string) => {
        const step = 10; // Resize by 10px per key press
        let newWidth = size.width;
        let newHeight = size.height;

        const resizeHorizontally = (amount: number) => {
            if (direction.includes('r')) newWidth = Math.max(MIN_WIDTH, size.width + amount);
        };
        const resizeVertically = (amount: number) => {
            if (direction.includes('b')) newHeight = Math.max(MIN_HEIGHT, size.height + amount);
        };

        const actions: { [key: string]: () => void } = {
            ArrowLeft: () => resizeHorizontally(-step),
            ArrowRight: () => resizeHorizontally(step),
            ArrowUp: () => resizeVertically(-step),
            ArrowDown: () => resizeVertically(step),
        };
        
        if (actions[e.key]) {
            e.preventDefault();
            actions[e.key]();
            setSize({ width: newWidth, height: newHeight });
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                setPosition({
                    x: e.clientX - dragRef.current.startX,
                    y: e.clientY - dragRef.current.startY,
                });
            } else if (isResizing) {
                const { startX, startY, startWidth, startHeight, direction } = resizeRef.current;
                let newWidth = startWidth;
                let newHeight = startHeight;

                if (direction.includes('r')) {
                    newWidth = Math.max(MIN_WIDTH, startWidth + e.clientX - startX);
                }
                if (direction.includes('b')) {
                    newHeight = Math.max(MIN_HEIGHT, startHeight + e.clientY - startY);
                }
                setSize({ width: newWidth, height: newHeight });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setIsResizing(false);
        };
        
        if (isDragging || isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing]);
    
    const titleId = `overlay-title-${appId}`;

    return (
        <div
            ref={windowRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="fixed bg-brand-surface dark:bg-dark-surface border border-brand-border dark:border-dark-border rounded-lg shadow-2xl flex flex-col focus:outline-none"
            style={{
                top: position.y,
                left: position.x,
                width: size.width,
                height: size.height,
                zIndex,
                transition: isResizing ? 'none' : 'all 0.2s ease-in-out',
            }}
            onClick={() => focusOverlay(appId)}
        >
            {/* Header */}
            <div
                className={`h-10 bg-brand-surface-alt dark:bg-dark-surface-alt flex items-center justify-between px-3 rounded-t-lg ${!isMaximized ? 'cursor-move' : ''}`}
                onMouseDown={handleDragMouseDown}
                onDoubleClick={handleMaximizeToggle}
                title={isMaximized ? "Double-click to restore" : "Double-click to maximize"}
            >
                <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-brand-primary" />
                    <span id={titleId} className="font-semibold text-brand-text dark:text-dark-text select-none">{t(title)}</span>
                </div>
                <div className="flex items-center gap-2 text-brand-text-alt dark:text-dark-text-alt">
                    <button aria-label={t('overlayWindow.minimize', { title: t(title) })} onClick={() => minimizeOverlay(appId)} className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded"><Minus className="w-4 h-4" /></button>
                    <button aria-label={t(isMaximized ? 'overlayWindow.restore' : 'overlayWindow.maximize', { title: t(title) })} onClick={handleMaximizeToggle} className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded">
                        {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    </button>
                    <button aria-label={t('overlayWindow.close', { title: t(title) })} onClick={() => closeOverlay(appId)} className="p-1 hover:bg-red-500/20 dark:hover:bg-red-500/50 rounded"><X className="w-4 h-4" /></button>
                </div>
            </div>
            {/* Content */}
            <div className="flex-1 bg-brand-bg dark:bg-dark-bg p-4 overflow-auto">
                {children}
            </div>

            {/* Resize Handles */}
            {!isMaximized && (
                <>
                    <button
                        aria-label="Resize window diagonally"
                        onMouseDown={(e) => handleResizeMouseDown(e, 'br')}
                        onKeyDown={(e) => handleKeyboardResize(e, 'br')}
                        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-10"
                    />
                    <button
                        aria-label="Resize window vertically"
                        onMouseDown={(e) => handleResizeMouseDown(e, 'b')}
                        onKeyDown={(e) => handleKeyboardResize(e, 'b')}
                        className="absolute -bottom-1 left-0 right-0 h-2 cursor-s-resize"
                     />
                    <button
                        aria-label="Resize window horizontally"
                        onMouseDown={(e) => handleResizeMouseDown(e, 'r')}
                        onKeyDown={(e) => handleKeyboardResize(e, 'r')}
                        className="absolute -right-1 top-0 bottom-0 w-2 cursor-e-resize"
                    />
                </>
            )}
        </div>
    );
};

export default OverlayWindow;