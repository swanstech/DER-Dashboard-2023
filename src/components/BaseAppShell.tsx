import { AppShell, useMantineTheme } from "@mantine/core";
import HeaderComponent from "../components/Header";
import NavbarComponent from "../components/Navbar";
import Keycloak from "keycloak-js";
import { initKeycloak } from "keycloak-config";

function BaseAppShell({ children }: any) {
  const theme = useMantineTheme();

  interface BaseAppProps {
    userRoles: string[];
    userProfile: { fullName: string; email: string } | null;
    keycloakInstance: Keycloak.KeycloakInstance | null;
  }

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={<NavbarComponent />}
      header={<HeaderComponent userRoles={[]} userProfile={{
        fullName: "",
        email: ""
      }} keycloakInstance={initKeycloak()} />}
    >
      {children}
    </AppShell>
  );
}

export default BaseAppShell;
