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
  Flex,Image
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
      <Flex justify="space-between" align="center" >
        <Box>
          <MediaQuery largerThan="lg" styles={{ display: "none" }}>
            <Burger
              opened={opened}
              onClick={() => setOpened((opened) => !opened)}
              size="sm"
              color={theme.colors.gray[6]}
              mr="xl"
            />
          </MediaQuery>
          <Text fz="xl" fw={700} style={{ marginRight: '18px', marginBottom:'35px' }}>
            DER Dashboard
          </Text>
         
        </Box>
        <Box className="logo-container" ml="auto"> {/* ml="auto" to push the logo to the right */}
        <Image
            src="/images/SmartEnergyLabNew.png" // Adjust the path based on your actual file structure
            alt="Smart Energy Lab Logo"
            width={50} // Set your desired width
            height={50}
            style={{ marginRight: '18px', marginBottom:'35px' }}
             // Set your desired height
          />
        </Box>
        <Flex gap={"sm"} align="center" style={{ marginRight: '18px', marginBottom:'35px' }}>
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
      

        <style jsx>{`
        /* ... existing styles ... */
        .logo-container {
          margin-right:50px;
          
         
        }
        .footer {
          text-align: center;
          padding: 8px;
          background-color: #f5f5f5; /* Add a background color to the footer */
        }
      `}</style>
    </Header>
  );
}

export default HeaderComponent;
