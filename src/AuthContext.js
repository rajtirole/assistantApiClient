// src/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const savedToken = localStorage.getItem('authToken');
    return savedToken ? { token: savedToken } : null;
  });

  const login = (token) => {
    setAuth({ token });
    localStorage.setItem('authToken', token);
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
