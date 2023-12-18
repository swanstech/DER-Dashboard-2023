import React, { useContext, useEffect } from 'react';
import { Container, Title, Text, Paper } from '@mantine/core';
import { useRouter } from 'next/router';
import { AuthContext } from 'n/contexts/AuthContext'; // Adjust the path as necessary
import { User } from 'tabler-icons-react';

export default function LoginPage() {
  const router = useRouter();
  const { keycloak, setRoles, setUserProfile } = useContext(AuthContext);

  useEffect(() => {
    if (keycloak && !keycloak.authenticated) {
      keycloak.init({ onLoad: 'check-sso', checkLoginIframe: false }).then((authenticated) => {
        console.log('Authenticated:', authenticated);

        if (authenticated) {
          // Fetch user profile
          keycloak.loadUserProfile().then(profile => {
            const userProfile = ({
              username: profile.username,
              firstName: profile.firstName,
              lastName: profile.lastName,
              // ... other profile fields
            });
            setUserProfile(userProfile);
            console.log('User profile:', userProfile);
          });

          // Get the user's roles
          const roles = keycloak.realmAccess?.roles;
          setRoles(roles);
          console.log('User roles:', roles);

          console.log('Redirecting to DER Dashboard...');
          router.push('/home');
        } else {
          console.log('Redirecting to Keycloak login...');
          keycloak.login();
        }
      }).catch(error => {
        console.error('Keycloak init error:', error);
      });
    }
  }, [keycloak, router, setRoles, setUserProfile]); 
  
  // The form elements are no longer needed since Keycloak handles the login
  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
      >
        DER Dashboard
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        One place to manage all your inverters
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Text align="center" mt="md">
          Redirecting to login...
        </Text>
      </Paper>
    </Container>
  );
}
