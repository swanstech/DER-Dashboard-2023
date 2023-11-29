// src/config/keycloak-config.ts
import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: 'http://localhost:8080', // Keycloak server URL
  realm: 'swanstech', // Replace with your realm
  clientId: 'der-dashboard', // Replace with your client ID
};

let keycloak;

export const initKeycloak = () => {
  if (!keycloak) {
    keycloak = new Keycloak(keycloakConfig);
  }
  return keycloak;
};

