// import React, { useMemo, useState } from "react";
// import { IconSun, IconMoonStars, IconChevronLeft } from "@tabler/icons-react";
// import Link from 'next/link';
// import {
//   Header,
//   Text,
//   MediaQuery,
//   Burger,
//   useMantineTheme,
//   useMantineColorScheme,
//   ActionIcon,
//   Box,
//   Flex, Image
// } from "@mantine/core";
// import UserMenu from "./UserMenu";
// import { useRouter } from "next/router";

// function HeaderComponent() {
//   const router = useRouter();

//   const handleGoBack = () => {
//     router.push('/home'); // Replace '/' with the actual path of your home page
//   };
//   const theme = useMantineTheme();
//   const [opened, setOpened] = useState(false);
//   const color = useMantineColorScheme();
//   const { colorScheme } = color;
//   const dark = useMemo(() => colorScheme === "dark", [colorScheme]);

//   return (
//     <Header height={{ base: 50, md: 70 }} p="md">
//       <Flex justify="space-between" align="center" >
//         <Box>
//           <MediaQuery largerThan="lg" styles={{ display: "none" }}>
//             <Burger
//               opened={opened}
//               onClick={() => setOpened((o) => !o)}
//               size="sm"
//               color={theme.colors.gray[6]}
//               mr="xl"
//             />
//           </MediaQuery>
//           <Text fz="xl" fw={700}>
//             DER Dashboard
//           </Text>

//         </Box>

//         <ActionIcon
//           variant="outline"
//           color={dark ? "yellow" : "blue"}
//           onClick={handleGoBack}
//           title="Go back to home"
//           style={{marginLeft:"1000px", marginBottom:'35px'}}
//         >
//           <IconChevronLeft size="3.5rem"  />
//         </ActionIcon>

//         <Box className="logo-container" ml="auto"> {/* ml="auto" to push the logo to the right */}
//           <Image
//             src="/images/SmartEnergyLabNew.png" // Adjust the path based on your actual file structure
//             alt="Smart Energy Lab Logo"
//             width={50} // Set your desired width
//             height={50}
//             style={{ marginRight: '18px', marginBottom: '35px' }}
//           // Set your desired height
//           />
//         </Box>
//         <Flex gap={"sm"} align="center" style={{ marginRight: '18px', marginBottom: '35px' }}>
//           <ActionIcon
//             variant="outline"
//             color={dark ? "yellow" : "blue"}
//             onClick={() => color.toggleColorScheme()}
//             title="Toggle color scheme"
//           >
//             {dark ? <IconSun size="1.1rem" /> : <IconMoonStars size="1.1rem" />}
//           </ActionIcon>
//           <UserMenu />
//         </Flex>
//       </Flex>


//       <style jsx>{`
//         /* ... existing styles ... */
//         .logo-container {
//           margin-right:50px;
          
         
//         }
//         .footer {
//           text-align: center;
//           padding: 8px;
//           background-color: #f5f5f5; /* Add a background color to the footer */
//         }
//       `}</style>
//     </Header>
//   );
// }

// export default HeaderComponent;

import React, { useMemo, useState } from "react";
import { IconSun, IconMoonStars, IconChevronLeft } from "@tabler/icons-react";
import {
  Header,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  useMantineColorScheme,
  ActionIcon,
  Box,
  Flex, Image
} from "@mantine/core";
import UserMenu from "./UserMenu";
import { useRouter } from "next/router";

interface HeaderComponentProps {
  userRoles: string[];
  userProfile: { fullName: string; email: string } | null;
  keycloakInstance: Keycloak.KeycloakInstance | null;
}

function HeaderComponent({ userRoles, userProfile , keycloakInstance}: HeaderComponentProps) {
  const router = useRouter();
  const [opened, setOpened] = useState(false);

  const handleGoBack = () => {
    router.push('/home'); // Replace '/' with the actual path of your home page
  };

  const theme = useMantineTheme();
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
              onClick={() => setOpened((o) => !o)}
              size="sm"
              color={theme.colors.gray[6]}
              mr="xl"
            />
          </MediaQuery>
          <Text fz="xl" fw={700}>
            DER Dashboard
          </Text>
        </Box>

        <ActionIcon
          variant="outline"
          color={dark ? "yellow" : "blue"}
          onClick={handleGoBack}
          title="Go back to home"
          style={{ marginLeft: "1000px", marginBottom: '35px' }}
        >
          <IconChevronLeft size="3.5rem" />
        </ActionIcon>

        <Box className="logo-container" ml="auto"> {/* ml="auto" to push the logo to the right */}
          <Image
            src="/images/SmartEnergyLabNew.png" // Adjust the path based on your actual file structure
            alt="Smart Energy Lab Logo"
            width={50} // Set your desired width
            height={50}
            style={{ marginRight: '18px', marginBottom: '35px' }}
          // Set your desired height
          />
        </Box>
        <Flex gap={"sm"} align="center" style={{ marginRight: '18px', marginBottom: '35px' }}>
          <ActionIcon
            variant="outline"
            color={dark ? "yellow" : "blue"}
            title="Toggle color scheme"
          >
            {dark ? <IconSun size="1.1rem" /> : <IconMoonStars size="1.1rem" />}
          </ActionIcon>
          
          {/* Pass userRoles and userProfile to UserMenu */}
          <UserMenu userRoles={userRoles} userProfile={userProfile} keycloakInstance={keycloakInstance} />
        </Flex>
      </Flex>

      <style jsx>{`
        /* ... existing styles ... */
        .logo-container {
          margin-right: 50px;
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

