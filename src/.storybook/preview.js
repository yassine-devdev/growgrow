import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FeatureFlagProvider } from '../context/FeatureFlagContext';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

const queryClient = new QueryClient();

export const decorators = [
  (Story) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <FeatureFlagProvider>
          <I18nextProvider i18n={i18n}>
            <Story />
          </I18nextProvider>
        </FeatureFlagProvider>
      </BrowserRouter>
    </QueryClientProvider>
  ),
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
