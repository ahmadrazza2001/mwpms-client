import { AuthUser } from "../types";

const TOKEN_KEY = "mwpms_token";
const USER_KEY = "mwpms_user";

export const authStore = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  },
  getUser(): AuthUser | null {
    const value = localStorage.getItem(USER_KEY);
    return value ? (JSON.parse(value) as AuthUser) : null;
  },
  setUser(user: AuthUser) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clearUser() {
    localStorage.removeItem(USER_KEY);
  },
  clearAll() {
    this.clearToken();
    this.clearUser();
  },
};
