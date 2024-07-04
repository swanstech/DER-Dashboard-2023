// pages/api/settings.js

// This page is responsible for bringing scopes and permissions for the settings page for the user role
// This is written by Sakshi 
import axios from 'axios';
import fs from 'fs';
const keycloakConfig = JSON.parse(fs.readFileSync('keycloak-config.json', 'utf8'));


export default async function handler(req, res) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const accessToken = authorizationHeader.split(' ')[1];
    console.log(accessToken);
    const keycloakConfig = JSON.parse(fs.readFileSync('keycloak-config.json', 'utf8'));
     
      const id = "res:settings";
      const umaTicketResponse = await axios.post(
        `${keycloakConfig['auth-server-url']}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`,
        `grant_type=urn:ietf:params:oauth:grant-type:uma-ticket&client_id=${keycloakConfig.resource}&client_secret=${keycloakConfig.credentials.secret}&audience=${keycloakConfig.resource}&permission=${id}&response_mode=permissions`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Log umaTicketResponse for debugging
      console.log('UMA Ticket Response:', umaTicketResponse.data);

      // Return umaTicketResponse as a JSON response
      res.json(umaTicketResponse.data);
  } catch (error) {
    console.error('Error:', error.message);

    // Check for a 403 status in the error response
    if (error.response && error.response.status === 403) {
      // Send the entire error.response.data as the response
      res.status(403).json(error.response.data);
    } 
    else if (error.response && error.response.status === 401)
    {
      res.status(401).json(error.response.data);
    }else {
      // Handle other errors with a generic 500 status and message
      res.status(500).json({ error: error.message });
    }
  }
}




