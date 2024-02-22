import { type AppType } from "next/app";
import {
  MantineProvider,
  ColorSchemeProvider,
  type ColorScheme,
} from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import BaseAppShell from "../components/BaseAppShell";
import { AuthProvider } from '../contexts/AuthContext'; // Import AuthProvider

const MyApp: AppType = ({ Component, pageProps }) => {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useHotkeys([["mod+J", () => toggleColorScheme()]]);
  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{ colorScheme }}
      >
          <AuthProvider>   
          <BaseAppShell>
            <Component {...pageProps} />
          </BaseAppShell>
         </AuthProvider> 
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default MyApp;
