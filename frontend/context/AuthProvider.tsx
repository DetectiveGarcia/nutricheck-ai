import { isTokenValid } from "@/utils/helpers/jwt";
import * as SecureStore from "expo-secure-store"; //npm i expo-secure-store
import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

type AuthContextType = {
  accessToken: string | null;
  refreshToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;
  fetchWithAuth: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
  refresh: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  register: async () => {},
  login: async () => {},
  logout: () => {},
  loading: false,
  fetchWithAuth: async (input, init) => new Response(),
  refresh: async () => null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  console.log(API_BASE_URL);

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      console.log("Response status:", res.status);
      console.log("Response headers:", res.headers);

      const data = await res.json(); // Try parsing this
      console.log("Parsed response JSON:", data);

      if (!res.ok) throw new Error(data.message || "Login failed");

      const token = data.accessToken;

      await SecureStore.setItemAsync("accessToken", token);
      setAccessToken(token);
    } catch (err: any) {
      console.error("Login error:", err);
      Alert.alert("Login failed", err?.message || "Unknown error");
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Response status:", res.status);
      console.log("Response headers:", res.headers);

      const data = await res.json(); // Try parsing this
      console.log("Parsed response JSON:", data);

      if (!res.ok) throw new Error(data.message || "Login failed");

      const accessToken = data.accessToken;
      const refreshToken = data.refreshToken;

      console.log("AuthProvider.tsx, login, token: ", accessToken);

      await SecureStore.setItemAsync("accessToken", accessToken);
      await SecureStore.setItemAsync("refreshToken", refreshToken);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
    } catch (err: any) {
      console.error("Login error:", err);
      Alert.alert("Login failed", err?.message || "Unknown error");
      throw err;
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    setAccessToken(null);
    setRefreshToken(null);
    try {
      await fetch(`${API_BASE_URL}/api/users/logout`, {
        method: "POST",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const refresh = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/refreshToken`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      if (!res.ok) throw new Error("Failed to refresh");

      const data = await res.json();
      const newAccessToken: string = data.accessToken;
      const newRefreshToken: string = data.refreshToken;

      await SecureStore.setItemAsync("accessToken", newAccessToken);
      await SecureStore.setItemAsync("refreshToken", newRefreshToken);
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      return newAccessToken;
    } catch (err) {
      await logout();
      return null;
    }
  };

  // Custom fetch that auto-refreshes tokens
  const fetchWithAuth = async (input: RequestInfo, init: RequestInit = {}) => {
    const token =
      accessToken || (await SecureStore.getItemAsync("accessToken"));

    const res = await fetch(input, {
      ...init,
      headers: {
        ...(init.headers || {}),
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 403) {
      const newToken = await refresh();

      if (newToken) {
        const retryRes = await fetch(input, {
          ...init,
          headers: {
            ...(init.headers || {}),
            Authorization: `Bearer ${newToken}`,
            "Content-Type": "application/json",
          },
        });

        return retryRes;
      }
    }

    return res;
  };

  useEffect(() => {
    const loadToken = async () => {
      const accessToken = await SecureStore.getItemAsync("accessToken");
      if (accessToken && isTokenValid(accessToken)) {
        setAccessToken(accessToken);
      }
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      if (refreshToken && isTokenValid(refreshToken)) {
        setRefreshToken(refreshToken);
      }

      setLoading(false);
    };
    loadToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        login,
        logout,
        loading,
        register,
        fetchWithAuth,
        refresh,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
