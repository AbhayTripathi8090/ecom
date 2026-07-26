import type { AuthState } from "./auth.types";

export const INITIAL_AUTH_STATE: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};
