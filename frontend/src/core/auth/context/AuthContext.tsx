"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "customer" | "rider" | "agency";

interface RegistrationData {
  fullName: string;
  contact: string; // Email or Phone
  password: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: {
    name: string;
    email: string;
    roles: UserRole[];
  } | null;
  login: (userData: any, token: string) => Promise<void>;
  logout: () => void;
  register: (data: RegistrationData) => Promise<void>;
  verifyOTP: (code: string) => Promise<boolean>;
  verifyContact: (contact: string, role: string) => Promise<boolean>;
  verifyRecoveryKey: (key: string, role: string) => Promise<{ fullName: string, email: string }>;
  forgotPasswordReset: (data: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; roles: UserRole[] } | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("mock_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const _performLogin = (email: string, name: string = "User") => {
    const newRoles: UserRole[] = ["customer"];
    if (email.toLowerCase().includes("rider")) newRoles.push("rider");
    if (email.toLowerCase().includes("agency")) newRoles.push("agency");

    const userData = { name, email, roles: newRoles };
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("mock_user", JSON.stringify(userData));
  };

  const login = async (userData: any, token: string) => {
    setUser({ name: userData.fullName || "User", email: userData.email || userData.phone, roles: [userData.role as UserRole] });
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  const register = async (data: RegistrationData) => {
    await delay(100);
    // In a real app, this sends an OTP. Here we just pretend it succeeded.
    localStorage.setItem("pending_registration", JSON.stringify(data));
  };

  const verifyOTP = async (code: string) => {
    await delay(600);
    if (code === "123456") {
      const pendingData = localStorage.getItem("pending_registration");
      if (pendingData) {
        const { fullName, contact } = JSON.parse(pendingData);
        _performLogin(contact, fullName);
        localStorage.removeItem("pending_registration");
      } else {
        // Fallback login
        _performLogin("verified@user.com", "Verified User");
      }
      return true;
    }
    return false;
  };

  const verifyContact = async (contact: string, role: string) => {
    const response = await fetch('/api/auth/verify-contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact, role })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Verification failed');
    return true;
  };

  const verifyRecoveryKey = async (recoveryKey: string, role: string) => {
    const response = await fetch('/api/auth/verify-recovery-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recoveryKey, role })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Invalid recovery key');
    return data.data; // { fullName, email }
  };

  const forgotPasswordReset = async (data: any) => {
    const response = await fetch('/api/auth/forgot-password-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const resData = await response.json();
    if (!response.ok) throw new Error(resData.message || 'Failed to reset password');
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("mock_user");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, register, verifyOTP, verifyContact, verifyRecoveryKey, forgotPasswordReset }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
