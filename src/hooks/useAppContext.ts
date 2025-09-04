import { useContext } from 'react';
import { OnlineStatusContext } from '@/context/AppContext';

/**
 * A custom hook to consume the OnlineStatusContext.
 * @returns {boolean} `true` if the browser is online, otherwise `false`.
 */
export const useOnlineStatus = () => {
    return useContext(OnlineStatusContext);
};