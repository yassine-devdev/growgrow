import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Trash2, Plus, Minus, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { checkout } from '@/api/marketApi';
import { QUERY_KEYS } from '@/constants/queries';

const CartSidebar: React.FC = () => {
    const { cart, updateCartQuantity, removeFromCart, clearCart, addToast } = useAppStore();
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const tax = subtotal * 0.08; // Mock 8% tax
    const total = subtotal + tax;

    const checkoutMutation = useMutation({
        mutationFn: checkout,
        onSuccess: () => {
            addToast({ message: t('views.marketplace.checkoutSuccess'), type: 'success' });
            clearCart();
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders }); // Invalidate orders to update "My Orders" view
        },
        onError: (error: Error) => {
            addToast({ message: error.message || 'Checkout failed.', type: 'error' });
        }
    });

    return (
        <>
            <h3 className="text-lg font-bold mb-4">{t('views.marketplace.shoppingCart')}</h3>
            {cart.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center text-brand-text-alt">
                    <p>{t('views.marketplace.emptyCart')}</p>
                </div>
            ) : (
                <>
                    <div className="flex-1 space-y-3 overflow-y-auto -mr-2 pr-2">
                        {cart.map(item => (
                            <div key={item.product.id} className="flex items-center gap-3">
                                <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-md" />
                                <div className="flex-1">
                                    <p className="text-sm font-semibold truncate">{item.product.name}</p>
                                    <p className="text-xs text-brand-text-alt">${item.product.price.toFixed(2)}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <button onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)} className="p-1 rounded-full bg-brand-surface-alt"><Minus className="w-3 h-3" /></button>
                                        <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                        <button onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)} className="p-1 rounded-full bg-brand-surface-alt"><Plus className="w-3 h-3" /></button>
                                    </div>
                                </div>
                                <button onClick={() => removeFromCart(item.product.id)} className="text-brand-text-alt hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-brand-border text-sm space-y-2">
                        <div className="flex justify-between">
                            <span>{t('views.marketplace.subtotal')}</span>
                            <span className="font-semibold">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>{t('views.marketplace.tax')}</span>
                            <span className="font-semibold">${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-base font-bold">
                            <span>{t('views.marketplace.total')}</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                     <button
                        onClick={() => checkoutMutation.mutate(cart)}
                        disabled={checkoutMutation.isPending}
                        className="w-full mt-4 py-2 bg-brand-primary text-white rounded-lg font-semibold flex items-center justify-center gap-2 disabled:bg-brand-text-alt"
                    >
                        {checkoutMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                        {checkoutMutation.isPending ? t('views.marketplace.checkingOut') : t('views.marketplace.checkout')}
                    </button>
                </>
            )}
        </>
    );
};

export default CartSidebar;