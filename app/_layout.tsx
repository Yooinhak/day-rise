import "../global.css";
import "react-native-gesture-handler";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
// import 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useColorScheme } from "@/components/useColorScheme";
import { AppThemeProvider, useAppTheme } from "@/components/theme/AppThemeProvider";
import { supabase } from "@/lib/supabase";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AppThemeProvider>
      <RootLayoutNav />
    </AppThemeProvider>
  );
}

const queryClient = new QueryClient();

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { theme } = useAppTheme();
  const router = useRouter();
  const segments = useSegments();
  const [session, setSession] = useState<Awaited<
    ReturnType<typeof supabase.auth.getSession>
  >["data"]["session"]>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!isMounted) return;
        if (error) {
          console.warn("Failed to load session:", error.message);
        }
        setSession(data.session ?? null);
        setAuthReady(true);
      })
      .catch((error: unknown) => {
        if (!isMounted) return;
        console.warn("Failed to load session:", error);
        setSession(null);
        setAuthReady(true);
      });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        if (!isMounted) return;
        setSession(nextSession);
        setAuthReady(true);
      }
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authReady) return;
    const inAuthGroup = segments[0] === "(auth)";
    if (!session && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (session && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [authReady, router, segments, session]);

  if (!authReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack>
            {/* 인증 플로우 */}
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />

            {/* 메인 탭 화면 */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

            {/* 추가하기 화면을 모달로 설정 */}
            <Stack.Screen
              name="create"
              options={{
                presentation: "modal",
                headerShown: false,
                contentStyle: { backgroundColor: theme.colors.bg },
              }}
            />

            {/* 수정 화면 */}
            <Stack.Screen
              name="edit"
              options={{
                presentation: "modal",
                headerShown: false,
                contentStyle: { backgroundColor: theme.colors.bg },
              }}
            />

            {/* 설정 화면 */}
            <Stack.Screen
              name="settings"
              options={{
                headerShown: false,
                contentStyle: { backgroundColor: theme.colors.bg },
              }}
            />
          </Stack>
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
