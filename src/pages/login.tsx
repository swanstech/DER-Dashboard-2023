import React, { useEffect } from 'react';
import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Text,
  Container,
  Button,
} from '@mantine/core';
import { useRouter } from 'next/router';
import { initKeycloak } from '../../keycloak-config';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const keycloak = initKeycloak();
    console.log('Initializing Keycloak...', keycloak);
  
    keycloak.init({ onLoad: 'check-sso', checkLoginIframe: false }).then((authenticated) => {
      console.log('Authenticated:', authenticated);
      if (authenticated) {
        console.log('Redirecting to settings...');
        router.push('/settings');
      } else {
        console.log('Redirecting to Keycloak login...');
        keycloak.login();
      }
    }).catch(error => {
      console.error('Keycloak init error:', error);
    });
  }, [router]);
  

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
