import React, { useContext, useState } from 'react';
import Link from "next/link";
import { HomeBolt, Bolt } from "tabler-icons-react";
import { ThemeIcon, UnstyledButton, Group, Text } from "@mantine/core";
import { AuthContext } from '../../contexts/AuthContext'; // Adjust the path as necessary

const data = [
 // { icon: <HomeBolt size="1rem" />, color: "blue", label: "Home", to: "/home" },
  { icon: <Bolt size="1rem" />, color: "green", label: "Microgrid", to: "/microgrid", parent: "" },
  { icon: <Bolt size="1rem" />, color: "cyan", label: "DER", parent: "" },
  { icon: <Bolt size="1rem" />, color: "cyan", label: "Batteries", to: "/batteries", parent: "DER" },
  { icon: <Bolt size="1rem" />, color: "cyan", label: "Inverters", to: "/inverters", parent: "DER" },
  { icon: <Bolt size="1rem" />, color: "cyan", label: "EV Chargers", to: "/ev", parent: "DER" },
  { icon: <Bolt size="1rem" />, color: "cyan", label: "DER Settings", to: "/settings", parent: "DER" },
  { icon: <Bolt size="1rem" />, color: "pink", label: "Security", parent: "" },
  { icon: <Bolt size="1rem" />, color: "pink", label: "Security Ops Monitoring", to: "/security-ops-monitoring", parent: "Security" },
];

interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  to?: string;
  onClick?: () => void;
}

function RenderMainLink({ icon, color, label, to, onClick }: MainLinkProps) {
  return to ? (
    <Link href={to}>
      <div
        style={{
          cursor: "pointer",
          padding: "6px 12px",
        }}
      >
        <Group>
          <ThemeIcon color={color} variant="light">
            {icon}
          </ThemeIcon>
          <Text size="sm">{label}</Text>
        </Group>
      </div>
    </Link>
  ) : (
    <div
      onClick={onClick}
      style={{
        cursor: "pointer",
        padding: "6px 12px",
      }}
    >
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>
        <Text size="sm">{label}</Text>
      </Group>
    </div>
  );
}

export function MainLinks() {
  const { userRoles } = useContext(AuthContext);
  const [expandedParents, setExpandedParents] = useState<string[]>([]);

  const toggleSublinks = (parent: string) => {
    if (expandedParents.includes(parent)) {
      setExpandedParents(expandedParents.filter(item => item !== parent));
    } else {
      setExpandedParents([...expandedParents, parent]);
    }
  };

  return (
    <div>
      {data.map((link) => (
        <div key={link.label} style={{ marginLeft: link.parent ? "20px" : "0" }}>
          <RenderMainLink
            icon={link.icon}
            color={link.color}
            label={link.label}
            to={link.to}
            onClick={() => toggleSublinks(link.label)}
          />
        </div>
      ))}
    </div>
  );
}
