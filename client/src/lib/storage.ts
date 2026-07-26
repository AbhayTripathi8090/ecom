const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "auth_user";

export const storage = {
  getToken: (): string | null => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  setToken: (token: string): void => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
      console.error("Failed to save token to localStorage", e);
    }
  },
  removeToken: (): void => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      console.error("Failed to remove token from localStorage", e);
    }
  },
  getRefreshToken: (): string | null => {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  },
  setRefreshToken: (token: string): void => {
    try {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } catch (e) {
      console.error("Failed to save refresh token", e);
    }
  },
  removeRefreshToken: (): void => {
    try {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (e) {
      console.error("Failed to remove refresh token", e);
    }
  },
  getUser: (): any | null => {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setUser: (user: any): void => {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.error("Failed to save user info", e);
    }
  },
  removeUser: (): void => {
    try {
      localStorage.removeItem(USER_KEY);
    } catch (e) {
      console.error("Failed to remove user info", e);
    }
  },
  clearAuth: (): void => {
    storage.removeToken();
    storage.removeRefreshToken();
    storage.removeUser();
  },
};
