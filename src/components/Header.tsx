import React, { useMemo, useState } from "react";
import { IconSun, IconMoonStars } from "@tabler/icons-react";
import {
  Header,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  useMantineColorScheme,
  ActionIcon,
  Box,
  Flex,
} from "@mantine/core";
import UserMenu from "./UserMenu";

function HeaderComponent() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const color = useMantineColorScheme();
  const { colorScheme } = color;
  const dark = useMemo(() => colorScheme === "dark", [colorScheme]);

  return (
    <Header height={{ base: 50, md: 70 }} p="md">
      <Flex justify="space-between" align="center">
        <Flex align="center">
          <MediaQuery largerThan="lg" styles={{ display: "none" }}>
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              size="sm"
              color={theme.colors.gray[6]}
              mr="xl"
            />
          </MediaQuery>
          {/* Logo Image */}
          <img src="/swanlogo.png" alt="Logo" style={{ marginRight: '10px', height: '40px' }} />
          <Text fz="xl" fw={700}>
            DER Dashboard
          </Text>
        </Flex>
        <Flex gap={"sm"} align="center">
          <ActionIcon
            variant="outline"
            color={dark ? "yellow" : "blue"}
            onClick={() => color.toggleColorScheme()}
            title="Toggle color scheme"
          >
            {dark ? <IconSun size="1.1rem" /> : <IconMoonStars size="1.1rem" />}
          </ActionIcon>
          <UserMenu />
        </Flex>
      </Flex>
    </Header>
  );
}

export default HeaderComponent;
