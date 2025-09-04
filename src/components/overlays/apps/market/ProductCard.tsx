import React from 'react';
import { Star, Check } from 'lucide-react';
import Image from '@/components/ui/Image';
import { Product } from '@/types/index.ts';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from 'react-i18next';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { cart, addToCart, addToast } = useAppStore();
    const { t } = useTranslation();

    const isInCart = cart.some(item => item.product.id === product.id);

    const handleAddToCart = () => {
        addToCart(product);
        addToast({ message: t('views.marketplace.itemAddedToCart', { name: product.name }), type: 'success' });
    };
    
    return (
        <div className="bg-brand-surface border border-brand-border rounded-lg overflow-hidden group">
            <Image src={product.image} alt={product.name} className="w-full h-40" />
            <div className="p-4">
                <h4 className="font-bold text-brand-text truncate">{product.name}</h4>
                <div className="flex justify-between items-center mt-2">
                    <p className="text-lg font-semibold text-brand-primary">${product.price.toFixed(2)}</p>
                    <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm text-brand-text-alt">{product.rating}</span>
                    </div>
                </div>
                 <button 
                    onClick={handleAddToCart}
                    disabled={isInCart}
                    className="w-full mt-4 py-2 text-sm font-semibold text-white rounded-lg flex items-center justify-center gap-2 transition-colors disabled:bg-green-500 disabled:cursor-not-allowed bg-brand-primary hover:bg-brand-primary-hover"
                 >
                    {isInCart ? <><Check className="w-4 h-4" /> {t('views.marketplace.inCart')}</> : t('views.marketplace.addToCart')}
                </button>
            </div>
        </div>
    );
}

export default ProductCard;