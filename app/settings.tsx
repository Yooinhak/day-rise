import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { useAppTheme } from "@/components/theme/AppThemeProvider";
import { supabase } from "@/lib/supabase";

export default function SettingsScreen() {
  const { theme, themeId, setThemeId, availableThemes } = useAppTheme();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const c = theme.classes;

  async function handleSignOut() {
    if (isSigningOut) return;
    setIsSigningOut(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("로그아웃 실패", error.message);
    }
    setIsSigningOut(false);
  }

  return (
    <ScrollView className={`flex-1 ${c.bg} px-6 pt-12`}>
      <TouchableOpacity onPress={() => router.back()} className="mb-4">
        <Feather name="x" size={24} color={theme.colors.textMain} />
      </TouchableOpacity>
      <Text className={`${c.textMain} text-2xl font-bold mb-6`}>설정</Text>

      <View className="mb-10">
        <Text className={`${c.textMain} text-lg font-bold mb-4`}>
          테마 선택
        </Text>
        {availableThemes.map((option) => {
          const isActive = option.id === themeId;
          return (
            <TouchableOpacity
              key={option.id}
              onPress={() => setThemeId(option.id)}
              className={`${c.card} border ${isActive ? c.primaryBorder : c.borderSoft} rounded-2xl p-4 mb-4`}
            >
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className={`${c.textMain} text-base font-semibold`}>
                    {option.label}
                  </Text>
                  <Text className={`${c.textSub} text-xs mt-1`}>
                    {option.description}
                  </Text>
                </View>
                <View
                  className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                    isActive ? c.primaryBorder : c.borderSoft
                  }`}
                >
                  {isActive && (
                    <View className={`w-3 h-3 rounded-full ${c.primaryBg}`} />
                  )}
                </View>
              </View>
              <View className="flex-row mt-4">
                <View
                  className="w-8 h-8 rounded-full mr-2"
                  style={{ backgroundColor: option.colors.primary }}
                />
                <View
                  className="w-8 h-8 rounded-full mr-2"
                  style={{ backgroundColor: option.colors.secondary }}
                />
                <View
                  className="w-8 h-8 rounded-full mr-2"
                  style={{ backgroundColor: option.colors.accent }}
                />
                <View
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: option.colors.muted }}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View className="mb-12">
        <Text className={`${c.textMain} text-lg font-bold mb-4`}>계정</Text>
        <View
          className={`${c.card} border ${c.borderSoft} rounded-2xl p-5 shadow-sm`}
        >
          <Text className={`${c.textSub} text-sm mb-4`}>
            안전하게 로그아웃하고 휴식 시간을 가져요.
          </Text>
          <TouchableOpacity
            onPress={handleSignOut}
            disabled={isSigningOut}
            className={`flex-row items-center justify-center rounded-2xl px-4 py-4 ${
              isSigningOut ? c.primaryBg50 : c.primaryBg
            } shadow-lg ${c.shadowPrimary30}`}
          >
            <Feather name="log-out" size={18} color="white" />
            <Text className="text-white font-bold text-base ml-2">
              {isSigningOut ? "로그아웃 중..." : "로그아웃"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
