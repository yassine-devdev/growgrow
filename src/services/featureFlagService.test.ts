import { getFeatureFlags } from './featureFlagService';
import { describe, it, expect } from '@jest/globals';
import type { User } from '../types';

describe('featureFlagService', () => {

    it('should return correct flags for a Provider user', async () => {
        const providerUser: User = { id: '1', name: 'Provider', email: 'p@p.com', role: 'Provider' };
        const flags = await getFeatureFlags(providerUser);
        
        expect(flags['conciergeAiAssistant'].value).toBe(true);
        expect(flags['newSchoolButtonTest'].value).toBe('treatment');
    });

    it('should return correct flags for an Admin user', async () => {
        const adminUser: User = { id: '2', name: 'Admin', email: 'a@a.com', role: 'Admin' };
        const flags = await getFeatureFlags(adminUser);

        expect(flags['conciergeAiAssistant'].value).toBe(true);
        expect(flags['newSchoolButtonTest'].value).toBe('control');
    });
    
    it('should return correct flags for a Student user', async () => {
        const studentUser: User = { id: '3', name: 'Student', email: 's@s.com', role: 'Student' };
        const flags = await getFeatureFlags(studentUser);

        expect(flags['conciergeAiAssistant'].value).toBe(false);
        expect(flags['newSchoolButtonTest'].value).toBe('control');
    });
    
    it('should return an empty object for a null user', async () => {
        const flags = await getFeatureFlags(null);
        expect(flags).toEqual({});
    });
});
