import {
  HomeBolt,
  BoxSeam,
  Terminal2,
  Bolt,
  Network,
  BellRinging,
  ReportAnalytics,
} from "tabler-icons-react";
import { ThemeIcon, UnstyledButton, Group, Text } from "@mantine/core";
import { useRouter } from "next/router";
import Link from "next/link";

const data = [
  { icon: <HomeBolt size="1rem" />, color: "blue", label: "Home", to: "/home" },
  {
    icon: <BoxSeam size="1rem" />,
    color: "red",
    label: "Asset Security Status",
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
    icon: <Network size="1rem" />,
    color: "orange",
    label: "Network Security",
    to: "/network-security",
  },
  {
    icon: <BellRinging size="1rem" />,
    color: "teal",
    label: "Notifications",
    to: "/notifications",
  },
  {
    icon: <ReportAnalytics size="1rem" />,
    color: "violet",
    label: "Report",
    to: "/report",
  },
];

interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  to: string;
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
  const links = data.map((link) => (
    <RenderMainLink {...link} key={link.label} />
  ));
  return <div>{links}</div>;
}
