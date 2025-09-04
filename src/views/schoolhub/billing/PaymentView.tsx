import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getFeeDetails, processPayment } from '../../../api/parentApi';
import { QUERY_KEYS } from '../../../constants/queries';
import { useForm } from '../../../hooks/useForm';
import { paymentFormSchema, type PaymentFormData } from '../../../api/schemas/parentSchemas';
import { Loader2, CreditCard, Lock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../../store/useAppStore';
import InputField from '@/components/ui/InputField';

const PaymentView: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const addToast = useAppStore(s => s.addToast);
    const [isPaid, setIsPaid] = useState(false);

    const childId = 'alex-doe'; // In a real app, this would come from the user state or URL
    const { data: feeDetails, isLoading } = useQuery({
        queryKey: QUERY_KEYS.feeDetails(childId),
        queryFn: () => getFeeDetails(childId),
    });

    const mutation = useMutation({
        mutationFn: (paymentData: PaymentFormData) => processPayment({ paymentDetails: paymentData, amount: feeDetails!.amountDue }),
        onSuccess: () => {
            addToast({ message: 'Payment successful!', type: 'success' });
            setIsPaid(true);
            setTimeout(() => navigate('/dashboard'), 3000);
        },
        onError: (error: Error) => {
            addToast({ message: error.message || t('views.paymentView.paymentError'), type: 'error' });
        }
    });
    
    const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm(
        { nameOnCard: '', cardNumber: '', expiryDate: '', cvc: '' },
        paymentFormSchema,
        async (vals) => {
            await mutation.mutateAsync(vals);
        }
    );

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;
    }

    if (!feeDetails) return <div>Could not load fee details.</div>;
    
    if (isPaid) {
        return (
            <div className="max-w-md mx-auto text-center flex flex-col items-center justify-center h-full">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4"/>
                <h1 className="text-2xl font-bold text-brand-text mb-2">{t('views.paymentView.paymentSuccessTitle')}</h1>
                <p className="text-brand-text-alt">{t('views.paymentView.paymentSuccessMessage')}</p>
            </div>
        );
    }
    
    return (
        <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-8">
            {/* Order Summary */}
            <div className="w-full lg:w-1/3 order-last lg:order-first">
                 <h2 className="text-xl font-bold text-brand-text mb-4">{t('views.paymentView.paymentFor', { childName: feeDetails.childName })}</h2>
                 <div className="p-4 bg-brand-surface-alt/50 border border-brand-border rounded-lg space-y-3">
                    {feeDetails.lineItems.map(item => (
                        <div key={item.description} className="flex justify-between text-sm">
                            <span className="text-brand-text-alt">{item.description}</span>
                            <span className="font-medium text-brand-text">${item.amount.toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="pt-3 border-t border-brand-border flex justify-between font-bold text-lg">
                         <span>{t('views.paymentView.amountDue')}</span>
                         <span>${feeDetails.amountDue.toFixed(2)}</span>
                    </div>
                 </div>
            </div>
            {/* Payment Form */}
            <div className="w-full lg:w-2/3">
                 <h1 className="text-2xl font-bold text-brand-text mb-6">{t('views.paymentView.title')}</h1>
                 <form onSubmit={handleSubmit} noValidate>
                    <div className="p-6 bg-brand-surface-alt/50 border border-brand-border rounded-lg space-y-4">
                        <h2 className="text-lg font-semibold text-brand-text">{t('views.paymentView.paymentDetails')}</h2>
                        <InputField name="nameOnCard" label={t('views.paymentView.nameOnCard')} value={values.nameOnCard} onChange={handleChange} error={errors.nameOnCard} />
                        <InputField name="cardNumber" label={t('views.paymentView.cardNumber')} value={values.cardNumber} onChange={handleChange} error={errors.cardNumber} icon={CreditCard} placeholder="0000 0000 0000 0000" />
                        <div className="grid grid-cols-2 gap-4">
                             <InputField name="expiryDate" label={t('views.paymentView.expiryDate')} value={values.expiryDate} onChange={handleChange} error={errors.expiryDate} placeholder="MM/YY" />
                             <InputField name="cvc" label={t('views.paymentView.cvc')} value={values.cvc} onChange={handleChange} error={errors.cvc} icon={Lock} placeholder="123"/>
                        </div>
                    </div>
                     <div className="mt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-primary-hover disabled:bg-brand-text-alt"
                        >
                            {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                            {isSubmitting ? t('views.paymentView.payingButton') : t('views.paymentView.payButton', { amount: feeDetails.amountDue.toFixed(2) })}
                        </button>
                    </div>
                 </form>
            </div>
        </div>
    );
};

export default PaymentView;