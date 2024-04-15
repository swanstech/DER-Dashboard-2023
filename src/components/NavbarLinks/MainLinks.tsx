import React, { useContext } from 'react';
import {
  HomeBolt,
  BoxSeam,
  Terminal2,
  Bolt,
  Network,
  BellRinging,
  ReportAnalytics,
  Settings,
} from "tabler-icons-react";
import { ThemeIcon, UnstyledButton, Group, Text } from "@mantine/core";
import Link from "next/link";
import { AuthContext } from '../../contexts/AuthContext'; // Adjust the path as necessary

const data = [
  { icon: <HomeBolt size="1rem" />, color: "blue", label: "Home", to: "/home" },
  {
    icon: <BoxSeam size="1rem" />,
    color: "red",
    label: "Asset Manager",
    to: "/asset-security",
  },
  {
    icon: <Terminal2 size="1rem" />,
    color: "violet",
    label: "Security Ops Monitoring",
    to: "/security-ops-monitoring",
  },
  {
    icon: <Bolt size="1rem" />,
    color: "grape",
    label: "Energy Monitoring",
    to: "/energy-monitoring",
  },
  {
    icon: <Bolt size="1rem" />,
    color: "orange",
    label: "Demo Encryption",
    to: "/demo-encryption",
  },
  // {
  //   icon: <Network size="1rem" />,
  //   color: "orange",
  //   label: "Network Security",
  //   to: "/network-security",
  // },
  // {
  //   icon: <BellRinging size="1rem" />,
  //   color: "teal",
  //   label: "Alarms",
  //   to: "/notifications",
  // },
  {
    icon: <Bolt size="1rem" />,
    color: "grape",
    label: "Vulnerability Scan",
    to: "/penetration-testing"
  },
  { 
    icon: <Settings size="1rem" />, 
    color: 'lime', 
    label: 'Settings', 
    to: "/settings" 
  },
];

interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  to: string;
  roles?: string[];
}

function RenderMainLink({ icon, color, label, to }: MainLinkProps) {
  return (
    <Link href={to}>
      <UnstyledButton
        sx={(theme) => ({
          display: "block",
          width: "100%",
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color:
            theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
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

export function MainLinks() {
  const { userRoles } = useContext(AuthContext);
  //console.log("user roles",userRoles);

  const links = data.filter(link => {
    // If 'roles' is not defined, show the link to everyone
    if (!link["roles"]) return true;
    // Otherwise, show the link only if the user has one of the required roles
    return link["roles"].some(role => userRoles.includes(role));
  }).map((link) => (
    <RenderMainLink {...link} key={link.label} />
  ));

  return <div>{links}</div>;
}




