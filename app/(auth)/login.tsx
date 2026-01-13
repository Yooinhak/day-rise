import { supabase } from "@/lib/supabase";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "@/components/theme/AppThemeProvider";

WebBrowser.maybeCompleteAuthSession(); // 웹 브라우저 인증 후 복귀를 위함

export default function LoginScreen() {
  const { theme } = useAppTheme();
  const c = theme.classes;
  async function signInWithGoogle() {
    const redirectUrl = Linking.createURL("google-auth");

    // 1. Supabase를 통해 구글 로그인 URL 가져오기
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: true,
      },
    });

    if (error) console.log("Error:", error.message);

    // 2. 외부 브라우저로 로그인 페이지 열기
    if (data?.url) {
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUrl
      );

      if (result.type === "success" && result.url) {
        // PKCE flow: URL에서 code를 추출하여 세션으로 교환
        const { queryParams } = Linking.parse(result.url);
        const code = queryParams?.code;

        if (code) {
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code as string);
          if (exchangeError)
            console.log("Session Error:", exchangeError.message);
        }
      }
    }
  }

  return (
    <View className={`flex-1 ${c.bg} justify-center px-8`}>
      <View className="items-center mb-12">
        <Text className="text-4xl mb-4">🌿</Text>
        <Text className={`${c.textMain} text-2xl font-bold text-center`}>
          나를 보듬는 시간,{"\n"}Day Rise에 오신 걸 환영해요
        </Text>
      </View>

      <TouchableOpacity
        onPress={signInWithGoogle}
        className={`${c.card} p-5 rounded-2xl flex-row items-center justify-center shadow-sm border ${c.borderSoft}`}
      >
        <Text className={`${c.textMain} font-bold text-lg`}>
          구글로 시작하기
        </Text>
      </TouchableOpacity>
    </View>
  );
}
