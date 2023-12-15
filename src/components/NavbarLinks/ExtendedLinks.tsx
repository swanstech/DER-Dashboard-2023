import { Settings, Mailbox } from 'tabler-icons-react';
import { ThemeIcon, UnstyledButton, Group, Text } from '@mantine/core';
import Link from "next/link";

const data = [
  { icon: <Mailbox size="1rem" />, color: 'grape', label: 'Support', to: "/contact" },
];

interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  to: string;
}

function RenderExtendedLink({ icon, color, label, to }: MainLinkProps) {
  return (
    <Link href={to}>
      <UnstyledButton
        sx={(theme) => ({
          display: 'block',
          width: '100%',
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

          '&:hover': {
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
          },
        })}
      >
        <Group>
          <ThemeIcon color={color} variant="light">
            {icon}
          </ThemeIcon>

          <Text size="sm">{label}</Text>
        </Group>
      </UnstyledButton>
    </Link>
  );
}

export function ExtendedLinks() {
  const links = data.map((link) => <RenderExtendedLink {...link} key={link.label} />);
  return <div>{links}</div>;
}
