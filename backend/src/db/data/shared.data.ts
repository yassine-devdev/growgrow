
import { v4 as uuidv4 } from 'uuid';

export const getNotifications = async () => ([
    { id: '1', title: 'New Grade Posted', description: 'You received an A- in Algebra II.', timestamp: new Date().toISOString(), read: false, type: 'grade' }
]);

export const getProducts = async () => ([
    { id: 1, name: 'Advanced Calculator', price: 75.99, rating: 4.8, category: 'electronics', image: 'https://picsum.photos/seed/calc/300' },
    { id: 2, name: 'Lab Notebook', price: 12.50, rating: 4.5, category: 'supplies', image: 'https://picsum.photos/seed/notebook/300' },
]);

// --- New Studio Mock Data ---

// Designer Data
const mockDesignTemplates = [
    { id: 'template-1', name: 'Modern Presentation', category: 'Presentations', thumbnailUrl: `https://picsum.photos/seed/${uuidv4()}/300/200` },
    { id: 'template-2', name: 'Social Media Post', category: 'Marketing', thumbnailUrl: `https://picsum.photos/seed/${uuidv4()}/300/200` },
    { id: 'template-3', name: 'School Newsletter', category: 'Documents', thumbnailUrl: `https://picsum.photos/seed/${uuidv4()}/300/200` },
    { id: 'template-4', name: 'Infographic', category: 'Data Viz', thumbnailUrl: `https://picsum.photos/seed/${uuidv4()}/300/200` },
];
export const getStudioDesignTemplates = async () => Promise.resolve(mockDesignTemplates);

const mockBrandKits = [
    { id: 'kit-1', name: 'School Official Brand', colors: ['#4f46e5', '#34d399', '#f59e0b'] },
    { id: 'kit-2', name: 'Athletics Department', colors: ['#b91c1c', '#facc15', '#ffffff'] },
];
export const getStudioBrandKits = async () => Promise.resolve(mockBrandKits);

// Video Editor Data
const mockVideoProjects = [
    { id: 'vid-1', name: 'Welcome Assembly 2024', duration: '15:32', status: 'Rendered', thumbnailUrl: `https://picsum.photos/seed/${uuidv4()}/300/200` },
    { id: 'vid-2', name: 'Science Fair Highlights', duration: '08:15', status: 'Editing', thumbnailUrl: `https://picsum.photos/seed/${uuidv4()}/300/200` },
];
export const getStudioVideoProjects = async () => Promise.resolve(mockVideoProjects);

// Coder Data
const mockCodeProjects = {
    '/': {
        'school-website/': {
            'index.html': { content: '<h1>Welcome!</h1>' },
            'style.css': { content: 'body { color: blue; }' },
        },
        'data-script.py': { content: 'import pandas as pd' },
    }
};
export const getStudioCodeProjects = async () => Promise.resolve(mockCodeProjects);

// Office Data
const mockOfficeDocs = [
    { id: 'doc-1', name: '2024-2025 Curriculum Plan', type: 'document', lastModified: '2 days ago' },
    { id: 'doc-2', name: 'Q3 Budget Proposal', type: 'spreadsheet', lastModified: '1 week ago' },
    { id: 'doc-3', name: 'School Board Presentation', type: 'presentation', lastModified: '3 hours ago' },
];
export const getStudioOfficeDocs = async () => Promise.resolve(mockOfficeDocs);

// Marketplace Data
const mockStudioAssets = [
    { id: 'asset-1', name: 'Students Collaborating', type: 'photo', price: 5.00, thumbnailUrl: `https://picsum.photos/seed/${uuidv4()}/300/200` },
    { id: 'asset-2', name: 'Upbeat Corporate Track', type: 'audio', price: 15.00, thumbnailUrl: `https://picsum.photos/seed/${uuidv4()}/300/200` },
    { id: 'asset-3', name: 'Low-poly School Bus', type: '3d-model', price: 25.00, thumbnailUrl: `https://picsum.photos/seed/${uuidv4()}/300/200` },
    { id: 'asset-4', name: 'Elegant Serif Font', type: 'font', price: 10.00, thumbnailUrl: `https://picsum.photos/seed/${uuidv4()}/300/200` },
    { id: 'asset-5', name: 'Teacher at Blackboard', type: 'photo', price: 5.00, thumbnailUrl: `https://picsum.photos/seed/${uuidv4()}/300/200` },
];
export const getStudioMarketplaceAssets = async () => Promise.resolve(mockStudioAssets);
