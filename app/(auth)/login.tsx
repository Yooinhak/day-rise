import { supabase } from "@/lib/supabase";
import { useAppTheme } from "@/components/theme/AppThemeProvider";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import {
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { theme } = useAppTheme();
  const c = theme.classes;
  const [isLoading, setIsLoading] = useState(false);

  async function signInWithGoogle() {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const redirectUrl = Linking.createURL("google-auth");

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        Alert.alert("로그인 실패", "구글 로그인 중 문제가 발생했어요.");
        return;
      }

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUrl,
        );

        if (result.type === "success" && result.url) {
          const { queryParams } = Linking.parse(result.url);
          const code = queryParams?.code;

          if (code) {
            const { error: exchangeError } =
              await supabase.auth.exchangeCodeForSession(code as string);
            if (exchangeError) {
              Alert.alert("로그인 실패", "세션 생성 중 문제가 발생했어요.");
            }
          }
        }
      }
    } catch {
      Alert.alert("로그인 실패", "네트워크 연결을 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  }

  // TODO: Apple 로그인은 Apple Developer 멤버십 가입 후 복원
  // npm install expo-apple-authentication 후 signInWithApple 함수 복원

  return (
    <View className={`flex-1 ${c.bg} justify-center px-8`}>
      <View className="items-center mb-12">
        <Text className="text-4xl mb-4">🌿</Text>
        <Text className={`${c.textMain} text-2xl font-bold text-center`}>
          나를 보듬는 시간,{"\n"}Day Rise에 오신 걸 환영해요
        </Text>
        <Text className={`${c.textSub} text-sm mt-3 text-center`}>
          작은 루틴이 큰 변화를 만들어요
        </Text>
      </View>

      <View className="gap-3">
        <TouchableOpacity
          onPress={signInWithGoogle}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityLabel="구글 계정으로 로그인"
          className={`${c.card} p-5 rounded-2xl flex-row items-center justify-center shadow-sm border ${c.borderSoft} ${isLoading ? "opacity-50" : ""}`}
        >
          <Text className={`${c.textMain} font-bold text-lg`}>
            구글로 시작하기
          </Text>
        </TouchableOpacity>
      </View>

      <Text className={`${c.textSub} text-xs text-center mt-8`}>
        로그인 시 서비스 이용약관 및{"\n"}개인정보 처리방침에 동의하게 됩니다.
      </Text>
    </View>
  );
}
