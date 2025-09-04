import { OverlayApp } from '@/types/index.ts';
import {
    Mic2, Tv, Drama, Star, ShoppingCart, Plane, Heart, BookOpen, Dumbbell, Landmark, Wrench, HelpCircle, Briefcase, Puzzle
} from 'lucide-react';

/**
 * An array defining all available overlay applications.
 * Each object contains the app's unique ID, a translation key for its label,
 * and the icon component to be displayed in the launcher.
 * @type {OverlayApp[]}
 */
export const OVERLAY_APPS: OverlayApp[] = [
    { id: 'studio', label: 'apps.studio', icon: Mic2 },
    { id: 'media', label: 'apps.media', icon: Tv },
    { id: 'gamification', label: 'apps.gamification', icon: Drama },
    { id: 'leisure', label: 'apps.leisure', icon: Star },
    { id: 'market', label: 'apps.market', icon: ShoppingCart },
    { id: 'lifestyle', label: 'apps.lifestyle', icon: Plane },
    { id: 'hobbies', label: 'apps.hobbies', icon: Heart },
    { id: 'knowledge', label: 'apps.knowledge', icon: BookOpen },
    { id: 'sports', label: 'apps.sports', icon: Dumbbell },
    { id: 'religion', label: 'apps.religion', icon: Landmark },
    { id: 'sudoku', label: 'apps.sudoku', icon: Puzzle },
    { id: 'services', label: 'apps.services', icon: Wrench },
    { id: 'finance', label: 'apps.finance', icon: Briefcase },
    { id: 'help', label: 'apps.help', icon: HelpCircle },
];
