export const tokenManager = {
  setAccessToken: (token: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('accessToken', token);
    }
  },

  getAccessToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('accessToken');
    }
    return null;
  },

  removeAccessToken: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('accessToken');
    }
  },

  hasAccessToken: (): boolean => {
    return !!tokenManager.getAccessToken();
  },
};
