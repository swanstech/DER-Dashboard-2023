// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { initKeycloak } from '../../keycloak-config'; // Adjust the path as necessary

export const AuthContext = createContext({
  keycloak: null,
  userRoles: [],
  userProfile: null,
  setRoles: (roles) => {},
  setUserProfile: (profile) => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [keycloak, setKeycloak] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const keycloakInstance = initKeycloak();
      setKeycloak(keycloakInstance);
    }
  }, []);

  const setRoles = (roles) => {
    setUserRoles(roles);
  };

  const updateUserProfile = (profile) => {
    setUserProfile(profile);
  };

  const logout = () => {
    if (keycloak) {
      keycloak.logout();
    }
  };

  return (
    <AuthContext.Provider value={{ keycloak, userRoles, userProfile, setRoles, setUserProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
