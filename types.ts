
import { LucideIcon } from 'lucide-react';

/**
 * Defines the possible user roles within the application.
 */
export type Role = 'Provider' | 'Admin' | 'Teacher' | 'Student' | 'Parent' | 'Admissions' | 'Individual';

/**
 * Represents the authenticated user object.
 */
export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatarUrl?: string;
}


/**
 * Represents a single navigation item, which can have children for nested menus.
 */
export interface NavItem {
    /** A unique identifier for the navigation item. */
    id: string;
    /** The translation key for the item's label. */
    label: string;
    /** The icon component to display. */
    icon: LucideIcon;
    /** An optional array of child navigation items. */
    children?: NavItem[];
}

/**
 * Represents the configuration for a top-level module in the application.
 */
export interface ModuleConfig {
    /** A unique identifier for the module. */
    id: string;
    /** The translation key for the module's label. */
    label: string;
    /** The icon component for the module. */
    icon: LucideIcon;
    /** The header navigation items associated with this module. */
    headerNav: NavItem[];
}

/**
 * A mapped type that defines the navigation structure for each user role.
 */
export type RoleConfig = {
    [key in Role]: ModuleConfig[];
};

/**
 * Represents a single application that can be opened in an overlay window.
 */
export interface OverlayApp {
    /** A unique identifier for the overlay app. */
    id: string;
    /** The translation key for the app's label. */
    label: string;
    /** The icon component for the app. */
    icon: LucideIcon;
}

/**
 * Represents the state of an overlay window that is currently open.
 */
export interface OpenOverlay {
    /** The unique ID of the overlay app. */
    id: string;
    /** Whether the overlay is currently minimized. */
    isMinimized: boolean;
    /** The z-index used for stacking windows. */
    zIndex: number;
}

// Feature Flag Types
/**
 * Defines the possible value types for a feature flag.
 */
export type FeatureFlagValue = boolean | string | number;

/**
 * Represents a single feature flag's configuration.
 */
export interface FeatureFlag {
    /** The unique key for the feature flag. */
    key: string;
    /** The current value of the flag (can be a boolean, string, or number). */
    value: FeatureFlagValue;
    /** A description of what the feature flag controls. */
    description: string;
}

/**
 * A record mapping feature flag keys to their respective flag objects.
 */
export type FeatureFlags = Record<string, FeatureFlag>;

/**
 * Represents a single toast notification.
 */
export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

/**
 * Represents a paginated API response for data tables.
 */
export interface PaginatedResponse<T> {
    rows: T[];
    pageCount: number;
    rowCount: number;
}


// Marketplace Types
/**
 * Represents a single product in the marketplace.
 */
export interface Product {
    id: number;
    name: string;
    price: number;
    rating: number;
    category: 'supplies' | 'electronics' | 'apparel';
    image: string;
}

/**
 * Represents an item within the shopping cart.
 */
export interface CartItem {
    product: Product;
    quantity: number;
}

/**
 * Represents a notification in the notification center.
 */
export interface Notification {
    id: string;
    title: string;
    description: string;
    timestamp: string;
    read: boolean;
    type: 'grade' | 'announcement' | 'billing' | 'system';
}
