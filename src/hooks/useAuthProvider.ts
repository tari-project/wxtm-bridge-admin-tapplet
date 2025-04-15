import { useAuth0 } from '@auth0/auth0-react';
import { AuthProvider } from '@refinedev/core';
import { OpenAPI, UserService } from '@tari-project/wxtm-bridge-backend-api';
import { AxiosStatic } from 'axios';
import { API_URL } from '../config';

export const useAuthProvider = ({ axios }: { axios: AxiosStatic }) => {
  const { isLoading, user, logout, getAccessTokenSilently } = useAuth0();

  const authProvider: AuthProvider = {
    login: async () => {
      return {
        success: true,
      };
    },
    logout: async () => {
      logout({ returnTo: window.location.origin });
      return {
        success: true,
      };
    },
    onError: async (error) => {
      return { error };
    },
    check: async () => {
      try {
        const token = await getAccessTokenSilently();

        if (token) {
          axios.defaults.headers.common = {
            Authorization: `Bearer ${token}`,
          };
          OpenAPI.BASE = API_URL;
          OpenAPI.TOKEN = token;
        }

        const { isAdmin } = await UserService.getMe();

        if (isAdmin) {
          return {
            authenticated: true,
          };
        }

        logout();
        return {
          authenticated: false,
        };
      } catch (error) {
        return {
          authenticated: false,
          error: new Error(error as string),
          redirectTo: '/login',
          logout: true,
        };
      }
    },
    getPermissions: async () => null,
    getIdentity: async () => {
      if (user) {
        return {
          ...user,
          avatar: user.picture,
        };
      }
      return null;
    },
  };

  return {
    authProvider,
    isLoading,
  };
};
