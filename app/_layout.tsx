import "../global.css";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
// import 'react-native-reanimated';

import { useColorScheme } from "@/components/useColorScheme";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

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
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const [session, setSession] = useState<Session | null>(null);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // 1. 현재 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 2. 로그인 상태 변화 감지
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    const inAppRoutes = segments[0] === "(tabs)" || segments[0] === "create";
    const inLoginRoute = segments[0] === "login";

    if (!session && !inLoginRoute) {
      // 세션이 없으면 로그인 페이지로 이동
      router.replace("/login");
    } else if (session && inLoginRoute) {
      // 세션이 있는데 로그인 페이지에 있다면 메인 화면으로 이동
      router.replace("/(tabs)");
    } else if (session && !inAppRoutes && !inLoginRoute) {
      // 알 수 없는 비앱 경로는 메인 화면으로 정리
      router.replace("/(tabs)");
    }
  }, [session, segments, router]);

  return (
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
            presentation: "modal", // 아래에서 위로 올라오는 애니메이션
            headerShown: false, // 커스텀 헤더를 쓸 것이므로 기본 헤더 숨김
            contentStyle: { backgroundColor: "#FBF6F0" }, // 배경색 유지
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
