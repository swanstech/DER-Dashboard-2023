// pages/api/authenticate.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { username, password } = req.body;

  try {
    // Replace 'your-keycloak-url' with your Keycloak server URL
    const keycloakUrl = 'http://localhost:8080';
    
    // Set up the Keycloak authentication endpoint
    const authEndpoint = `${keycloakUrl}/realms/swanstech/protocol/openid-connect/token`;

    // Make a request to Keycloak to obtain an access token using ROPC grant type
    const response = await axios.post(authEndpoint, {
      grant_type: 'password',
      //client_id: 'frontend-client',
      username,
      password,
    });

    const accessToken = response.data.access_token;

    // Return the access token to the client
    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error('Authentication error:', error.response ? error.response.data : error.message);
    return res.status(401).json({ error: 'Authentication failed' });
  }
}
