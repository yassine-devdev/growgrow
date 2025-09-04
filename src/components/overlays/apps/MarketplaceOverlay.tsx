import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/api/marketApi';
import { QUERY_KEYS } from '@/constants/queries';
import CartSidebar from '@/components/overlays/apps/market/CartSidebar';
import ProductCard from '@/components/overlays/apps/market/ProductCard';

/**
 * Renders the Marketplace overlay application.
 * It features a sidebar for category filtering and a main content area
 * displaying a grid of products.
 *
 * @returns {JSX.Element} The rendered Marketplace overlay.
 */
const MarketplaceOverlay: React.FC = () => {
    const [category, setCategory] = useState('all');
    
    const { data: products, isLoading } = useQuery({
        queryKey: QUERY_KEYS.products,
        queryFn: getProducts,
    });
    
    const filteredProducts = products?.filter(p => category === 'all' || p.category === category);

    return (
        <div className="w-full h-full flex gap-4">
            {/* Main Content */}
            <main className="w-2/3 flex flex-col gap-4">
                 <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold">Products</h3>
                    <div className="relative w-1/2">
                        <input type="text" placeholder="Search products..." className="w-full bg-brand-surface border border-brand-border rounded-lg p-2 pl-10"/>
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-alt"/>
                    </div>
                </div>
                <nav className="flex gap-1 p-1 bg-brand-surface-alt rounded-lg">
                    {['all', 'supplies', 'electronics', 'apparel'].map(cat => (
                         <button key={cat} onClick={() => setCategory(cat)} className={`flex-1 text-center px-3 py-2 rounded-md text-sm capitalize transition-colors ${category === cat ? 'bg-brand-primary text-white shadow-sm' : 'hover:bg-brand-surface'}`}>
                            {cat}
                         </button>
                    ))}
                </nav>
                {isLoading ? (
                     <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-brand-primary" /></div>
                ) : (
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-2">
                        {filteredProducts?.map(product => <ProductCard key={product.id} product={product} />)}
                    </div>
                )}
            </main>

            {/* Cart Sidebar */}
            <aside className="w-1/3 bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col">
                <CartSidebar />
            </aside>
        </div>
    );
};

export default MarketplaceOverlay;