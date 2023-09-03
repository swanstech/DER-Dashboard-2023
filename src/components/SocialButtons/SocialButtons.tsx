import { Button, ButtonProps, Group } from '@mantine/core';
import { 
    BrandGoogle,
    BrandFacebook,
    BrandGithub,
    BrandDiscord
} from 'tabler-icons-react';
import { signIn } from 'next-auth/react';


export function GoogleButton(props: ButtonProps) {
  return <Button leftIcon={<BrandGoogle />} variant="default" color="gray" {...props} />;
}

export function FacebookButton(props: ButtonProps) {
  return (
    <Button
      leftIcon={<BrandFacebook />}
      sx={(theme) => ({
        backgroundColor: '#4267B2',
        color: '#fff',
        '&:not([data-disabled]):hover': {
          backgroundColor: theme.fn.darken('#4267B2', 0.1),
        },
      })}
      {...props}
    />
  );
}

export function DiscordButton(props: ButtonProps) {
  return (
    <Button
      leftIcon={<BrandDiscord size="1rem" />}
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === 'dark' ? '#5865F2' : '#5865F2',
        '&:not([data-disabled]):hover': {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.fn.lighten('#5865F2', 0.05)
              : theme.fn.darken('#5865F2', 0.05),
        },
      })}
      {...props}
    />
  );
}

export function GithubButton(props: ButtonProps) {
  return (
    <Button
      onClick={()=>signIn('github')}
      {...props}
      leftIcon={<BrandGithub size="1rem" />}
      sx={(theme) => ({
        backgroundColor: theme.colors.dark[theme.colorScheme === 'dark' ? 9 : 6],
        color: '#fff',
        '&:hover': {
          backgroundColor: theme.colors.dark[theme.colorScheme === 'dark' ? 9 : 6],
        },
      })}
    />
  );
}

export function SocialButtons() {
  return (
    <Group position="center" grow sx={{ marginTop: 20 }}>
      <GithubButton>Login with GitHub</GithubButton>
    </Group>
  );
}