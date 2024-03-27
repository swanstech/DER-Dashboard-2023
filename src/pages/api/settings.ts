// pages/api/settings.js
import axios from 'axios';
import fs from 'fs';
const keycloakConfig = JSON.parse(fs.readFileSync('keycloak-config.json', 'utf8'));

// Function to introspect the token using Keycloak Introspection endpoint
async function getResourceSet(accessToken) {
    try {
      const response = await axios.get(
        `${keycloakConfig['auth-server-url']}/realms/${keycloakConfig.realm}/authz/protection/resource_set?uri=/settings`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      return response.data;
    } catch (error) {
      console.error('Error during resource set request:', error.message);
      throw error;
    }
  }

export default async function handler(req, res) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const accessToken = authorizationHeader.split(' ')[1];
    const keycloakConfig = JSON.parse(fs.readFileSync('keycloak-config.json', 'utf8'));

    // const response = await axios.post(
    //   `${keycloakConfig['auth-server-url']}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`,
    //   `grant_type=password&client_id=${keycloakConfig.resource}&client_secret=${keycloakConfig.credentials.secret}&username=${username}&password=${password}`,
    //   {
    //     headers: {
    //       'Content-Type': 'application/x-www-form-urlencoded',
    //     },
    //   }
    // );

    //ßconst accessToken = response.data.access_token;
    // Make a GET request to the resource_set endpoint
    //const resourceSet = await getResourceSet(accessToken);

    // Log resource set for debugging
    //console.log('Resource Set:', resourceSet);

    // Check if the resourceSet is not null and has at least one element
    // if (Array.isArray(resourceSet) && resourceSet.length > 0) {
    //   // Extract the first value from the resourceSet as the id
    //   const id = resourceSet[0];
     
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




