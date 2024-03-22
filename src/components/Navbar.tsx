import { Navbar } from "@mantine/core";

import { MainLinks } from "../components/NavbarLinks/MainLinks";
import { ExtendedLinks } from "../components/NavbarLinks/ExtendedLinks";

function NavbarComponent() {
  return (
    <Navbar p="md" hiddenBreakpoint="lg" width={{ sm: 200, lg: 300 }}>
      <Navbar.Section grow mt="xs">
        <MainLinks  />
      </Navbar.Section>
      <Navbar.Section mt="sm">
        <ExtendedLinks />
      </Navbar.Section>
    </Navbar>
  );
}

export default NavbarComponent;
