import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api/apiService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

const SESSION_DURATION = 60 * 60 * 1000; // 1 hour in ms

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionExpiry, setSessionExpiry] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  // Auto-logout when session expires
  useEffect(() => {
    if (!sessionExpiry) return;

    const remaining = sessionExpiry - Date.now();
    if (remaining <= 0) {
      logout();
      return;
    }

    const timer = setTimeout(() => {
      logout();
      window.location.href = '/admin';
      alert('Sesi Anda telah berakhir. Silakan login kembali.');
    }, remaining);

    return () => clearTimeout(timer);
  }, [sessionExpiry]);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedExpiry = localStorage.getItem('sessionExpiry');

    // Check session expiry first
    if (storedExpiry && Date.now() > parseInt(storedExpiry, 10)) {
      logout();
      setLoading(false);
      return;
    }

    if (token && storedUser) {
      try {
        const response = await authAPI.getMe();
        setUser(response.data.data);
        setIsAuthenticated(true);
        if (storedExpiry) {
          setSessionExpiry(parseInt(storedExpiry, 10));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        logout();
      }
    }
    setLoading(false);
  };

  // Step 1: Request OTP (email only, no password)
  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);

      if (response.data?.requireOTP) {
        return {
          success: true,
          requireOTP: true,
          tempToken: response.data.tempToken,
        };
      }

      // Shouldn't happen in OTP-only flow, but handle gracefully
      return { success: false, message: 'Unexpected response from server.' };
    } catch (error) {
      console.error('Login request failed:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send OTP.',
      };
    }
  };

  // Step 2: Verify OTP → get JWT (1 hour session)
  const verifyOTP = async (otpData) => {
    try {
      const response = await authAPI.verifyOTP(otpData);
      const { token, data } = response.data;

      const expiry = Date.now() + SESSION_DURATION;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('sessionExpiry', String(expiry));

      setUser(data);
      setIsAuthenticated(true);
      setSessionExpiry(expiry);

      return { success: true, data };
    } catch (error) {
      console.error('OTP verification failed:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'OTP verification failed.',
      };
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('sessionExpiry');
    setUser(null);
    setIsAuthenticated(false);
    setSessionExpiry(null);
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Compute remaining session time
  const getSessionRemaining = () => {
    if (!sessionExpiry) return 0;
    return Math.max(0, sessionExpiry - Date.now());
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    verifyOTP,
    logout,
    updateUser,
    getSessionRemaining,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;