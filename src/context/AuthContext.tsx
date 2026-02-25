import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { AuthUser } from "../types";
import { authStore } from "../lib/auth";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(authStore.getToken());
  const [user, setUser] = useState<AuthUser | null>(authStore.getUser());

  const login = (nextToken: string, nextUser: AuthUser) => {
    authStore.setToken(nextToken);
    authStore.setUser(nextUser);
    setToken(nextToken);
    setUser(nextUser);
  };

  const logout = () => {
    authStore.clearAll();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, token, isAuthenticated: Boolean(token && user), login, logout }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
