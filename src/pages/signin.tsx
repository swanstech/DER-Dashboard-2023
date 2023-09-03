import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
  } from '@mantine/core';
import { SocialButtons } from 'n/components/SocialButtons/SocialButtons';
  
  export default function AuthenticationTitle() {
    return (
      <Container size={420} my={40}>
        <Title
          align="center"
          sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
        >
          DER Dashboard
        </Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
            One place to manage all your inverters{' '}
        </Text>
  
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <TextInput label="Email" placeholder="you@swanstech.com" required />
            <PasswordInput label="Password" placeholder="Your password" required mt="md" />
            <SocialButtons/>
            <Button fullWidth mt="xl">
                Sign in
            </Button>
        </Paper>
      </Container>
    );
  }