import "react-native-gesture-handler";
import "../global.css";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import {
  AppThemeProvider,
  useAppTheme,
} from "@/components/theme/AppThemeProvider";
import { useColorScheme } from "@/components/useColorScheme";
import { useNotificationSync } from "@/lib/hooks/useNotificationSync";
import { useProfileSync } from "@/lib/hooks/useProfileSync";
import { supabase } from "@/lib/supabase";
import { hasCompletedOnboarding } from "./(auth)/onboarding";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

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

function NotificationSync() {
  useNotificationSync();
  return null;
}

function ProfileSync() {
  useProfileSync();
  return null;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { theme } = useAppTheme();
  const router = useRouter();
  const segments = useSegments();
  const [session, setSession] =
    useState<
      Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"]
    >(null);
  const [authReady, setAuthReady] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);

  // 온보딩 완료 여부 확인
  useEffect(() => {
    hasCompletedOnboarding().then(setOnboardingDone);
  }, []);

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
      },
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authReady || onboardingDone === null) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!onboardingDone && segments[1] !== "onboarding") {
      // 첫 실행: 온보딩으로
      router.replace("/(auth)/onboarding");
    } else if (!session && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (session && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [authReady, onboardingDone, router, segments, session]);

  if (!authReady || onboardingDone === null) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <NotificationSync />
        <ProfileSync />
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
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

            {/* 친구 관리 화면 */}
            <Stack.Screen
              name="friends"
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
