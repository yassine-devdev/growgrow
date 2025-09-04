import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, OpenOverlay, Toast, CartItem, Product, Notification } from '@/types/index.ts';

type Theme = 'light' | 'dark' | 'system';

interface AppState {
    user: User | null;
    openOverlays: OpenOverlay[];
    toasts: Toast[];
    cart: CartItem[];
    notifications: Notification[];
    isMobileNavOpen: boolean;
    theme: Theme;
    isCommandPaletteOpen: boolean;
}

interface AppActions {
    login: (user: User) => void;
    logout: () => void;
    openOverlay: (id: string) => void;
    closeOverlay: (id: string) => void;
    minimizeOverlay: (id: string) => void;
    focusOverlay: (id: string) => void;
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    updateCartQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    setNotifications: (notifications: Notification[]) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    toggleMobileNav: () => void;
    setTheme: (theme: Theme) => void;
    toggleCommandPalette: () => void;
}

type AppStore = AppState & AppActions;

const initialState: AppState = {
    user: null,
    openOverlays: [],
    toasts: [],
    cart: [],
    notifications: [],
    isMobileNavOpen: false,
    theme: 'system',
    isCommandPaletteOpen: false,
};

export const useAppStore = create<AppStore>()(
    persist(
        (set, get) => ({
            ...initialState,
            login: (user) => {
                // With HttpOnly cookies, the token is no longer managed in the client state.
                set({ user, cart: [], notifications: [], isMobileNavOpen: false });
            },
            logout: () => {
                // A real logout should also call an API endpoint to invalidate the cookie on the server.
                set({ user: null });
            },
            openOverlay: (id) => {
                set(state => {
                    const topZ = (state.openOverlays.length > 0 ? Math.max(...state.openOverlays.map(o => o.zIndex)) : 9) + 1;
                    const existing = state.openOverlays.find(o => o.id === id);
                    if (existing) {
                        return { 
                            openOverlays: state.openOverlays.map(o => o.id === id 
                                ? { ...o, isMinimized: false, zIndex: topZ } 
                                : o
                            )
                        };
                    }
                    return { openOverlays: [...state.openOverlays, { id, isMinimized: false, zIndex: topZ }] };
                });
            },
            closeOverlay: (id) => set(state => ({ openOverlays: state.openOverlays.filter(o => o.id !== id) })),
            minimizeOverlay: (id) => set(state => ({ openOverlays: state.openOverlays.map(o => o.id === id ? { ...o, isMinimized: true } : o) })),
            focusOverlay: (id) => {
                set(state => {
                    const topZ = (state.openOverlays.length > 0 ? Math.max(...state.openOverlays.map(o => o.zIndex)) : 9) + 1;
                    return { openOverlays: state.openOverlays.map(o => o.id === id ? { ...o, zIndex: topZ } : o) };
                });
            },
            addToast: (toast) => {
                const id = new Date().toISOString() + Math.random();
                set(state => ({ toasts: [...state.toasts, { ...toast, id }] }));
                setTimeout(() => get().removeToast(id), 5000); // Auto-remove after 5s
            },
            removeToast: (id) => {
                set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }));
            },
            // Cart Actions
            addToCart: (product) => {
                set(state => {
                    const existingItem = state.cart.find(item => item.product.id === product.id);
                    if (existingItem) {
                        // Increase quantity if item already exists
                        return {
                            cart: state.cart.map(item =>
                                item.product.id === product.id
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item
                            )
                        };
                    }
                    // Add new item
                    return { cart: [...state.cart, { product, quantity: 1 }] };
                });
            },
            removeFromCart: (productId) => {
                set(state => ({ cart: state.cart.filter(item => item.product.id !== productId) }));
            },
            updateCartQuantity: (productId, quantity) => {
                set(state => ({
                    cart: state.cart
                        .map(item =>
                            item.product.id === productId
                                ? { ...item, quantity }
                                : item
                        )
                        .filter(item => item.quantity > 0) // Remove if quantity is 0 or less
                }));
            },
            clearCart: () => set({ cart: [] }),
            // Notification Actions
            setNotifications: (notifications) => set({ notifications }),
            markAsRead: (id) => set(state => ({
                notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
            })),
            markAllAsRead: () => set(state => ({
                notifications: state.notifications.map(n => ({ ...n, read: true }))
            })),
            // Mobile Nav Actions
            toggleMobileNav: () => set(state => ({ isMobileNavOpen: !state.isMobileNavOpen })),
            // Theme Actions
            setTheme: (theme) => set({ theme }),
            // Command Palette Actions
            toggleCommandPalette: () => set(state => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
        }),
        {
            name: 'super-app-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                theme: state.theme,
                // Do not persist transactional state like overlays, cart, or notifications
            }),
        }
    )
);