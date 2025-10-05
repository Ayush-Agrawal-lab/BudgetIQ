import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../services/api';
import { useToast } from '../hooks/use-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userData = await auth.getProfile();
        setUser(userData);
      }
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { access_token, user: userData } = await auth.login(email, password);
      localStorage.setItem('token', access_token);
      setUser(userData);
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      return true;
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.response?.data?.message || "Please check your credentials",
        variant: "destructive",
      });
      return false;
    }
  };

  const signup = async (email, password) => {
    try {
      const { access_token, user: userData } = await auth.signup(email, password);
      localStorage.setItem('token', access_token);
      setUser(userData);
      toast({
        title: "Account Created",
        description: "Welcome to BudgetIQ!",
      });
      return true;
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: error.response?.data?.message || "Please try again",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast({
      title: "Logged Out",
      description: "See you soon!",
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};