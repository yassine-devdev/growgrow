import React from 'react';
import EmptyState from '@/views/EmptyState';
import { useTranslation } from 'react-i18next';

const CustomerSuccessView: React.FC = () => {
    const { t } = useTranslation();
    return (
        <EmptyState message={t('emptyState.implementationNeeded', { module: t('nav.header.customer-success') })} />
    );
};

export default CustomerSuccessView;
