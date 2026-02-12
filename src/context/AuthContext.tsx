import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthContextType, User } from '../models/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock User for local development
const MOCK_USER: User = {
  id: 'local-user',
  name: 'Local Developer',
  email: 'dev@local',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // In a real app, we would check for OIDC session here.
  // For now, we simulate a check and auto-login if in "local" mode.
  useEffect(() => {
    const initAuth = async () => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Auto-login for local dev
      setUser(MOCK_USER);
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = () => {
    setUser(MOCK_USER);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
