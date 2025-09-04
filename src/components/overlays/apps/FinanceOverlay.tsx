import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFinanceData } from '@/api/appModulesApi';
import { QUERY_KEYS } from '@/constants/queries';
import { Loader2, TrendingUp, TrendingDown, PlusCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import TransactionFormModal from './finance/TransactionFormModal';

const FinanceOverlay: React.FC = () => {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, isLoading } = useQuery({
        queryKey: QUERY_KEYS.financeData,
        queryFn: getFinanceData,
    });

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-brand-primary" /></div>;
    }
    
    if (!data) return null;
    
    const netBalance = data.totalIncome - data.totalExpenses;

    return (
        <>
            <div className="w-full h-full flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-brand-text">{t('views.financeOverlay.title')}</h2>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-brand-primary rounded-lg hover:bg-brand-primary-hover"
                    >
                        <PlusCircle className="w-4 h-4" />
                        {t('views.financeOverlay.addTransaction')}
                    </button>
                </div>
            
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-500/10 rounded-lg">
                        <p className="text-sm text-green-700">{t('views.financeOverlay.totalIncome')}</p>
                        <p className="text-2xl font-bold text-green-800">${data.totalIncome.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-red-500/10 rounded-lg">
                        <p className="text-sm text-red-700">{t('views.financeOverlay.totalExpenses')}</p>
                        <p className="text-2xl font-bold text-red-800">${data.totalExpenses.toLocaleString()}</p>
                    </div>
                    <div className={`p-4 rounded-lg ${netBalance >= 0 ? 'bg-blue-500/10' : 'bg-yellow-500/10'}`}>
                        <p className={`text-sm ${netBalance >= 0 ? 'text-blue-700' : 'text-yellow-700'}`}>{t('views.financeOverlay.netBalance')}</p>
                        <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-blue-800' : 'text-yellow-800'}`}>${netBalance.toLocaleString()}</p>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col">
                        <h3 className="text-lg font-bold mb-4 text-brand-text">Income vs Expenses</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.monthlyBreakdown}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="income" fill="#22c55e" name="Income" />
                                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col">
                        <h3 className="text-lg font-bold mb-4 text-brand-text">{t('views.financeOverlay.recentTransactions')}</h3>
                        <div className="space-y-3 overflow-y-auto pr-2">
                            {data.transactions.map(tx => (
                                <div key={tx.id} className="flex justify-between items-center p-2 bg-brand-surface-alt rounded-md">
                                    <div className="flex items-center gap-3">
                                        {tx.type === 'income' ? <TrendingUp className="w-5 h-5 text-green-500"/> : <TrendingDown className="w-5 h-5 text-red-500"/>}
                                        <div>
                                            <p className="font-semibold text-sm">{tx.description}</p>
                                            <p className="text-xs text-brand-text-alt">{new Date(tx.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <p className={`font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                        {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <TransactionFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};

export default FinanceOverlay;