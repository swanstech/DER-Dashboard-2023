// src/contexts/AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userRoles, setUserRoles] = useState([]);

  const setRoles = (roles) => {
    setUserRoles(roles);
  };

  return (
    <AuthContext.Provider value={{ userRoles, setRoles}}>
      {children}
    </AuthContext.Provider>
  );
};