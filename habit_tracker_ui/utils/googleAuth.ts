import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useState } from 'react';
import CONFIG from './config';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [request, _, promptAsync] = Google.useAuthRequest({
    androidClientId: CONFIG.androidClientId,
    iosClientId: CONFIG.iosClientId,
    clientId: CONFIG.expoClientId,
  });

  const signInWithGoogle = async () => {
    if (!request) {
      return {
        success: false,
        error: 'Google auth request not ready'
      };
    }

    try {
      setIsLoading(true);
      const result = await promptAsync();
      
      if (result?.type === 'success') {
        const { authentication } = result;
        return {
          success: true,
          token: authentication?.accessToken
        };
      }
      
      return {
        success: false,
        error: 'Google sign in was cancelled or failed'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred during Google sign in'
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signInWithGoogle,
    isLoading
  };
};
