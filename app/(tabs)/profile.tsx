// app/(tabs)/stats.tsx
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { useAppTheme } from "@/components/theme/AppThemeProvider";
import { supabase } from "@/lib/supabase";

export default function StatsScreen() {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { theme } = useAppTheme();
  const c = theme.classes;
  const router = useRouter();

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
    <ScrollView className={`flex-1 ${c.bg} px-6 pt-16`}>
      <Text className={`${c.textMain} text-2xl font-bold mb-6`}>
        성장의 기록 📈
      </Text>

      {/* 이번 달 달성률 요약 카드 */}
      <View
        className={`${c.secondaryBg} p-6 rounded-3xl mb-8 flex-row items-center shadow-lg ${c.shadowSecondary30}`}
      >
        <View className="flex-1">
          <Text className="text-white/80 text-sm font-medium">
            이번 달은 벌써
          </Text>
          <Text className="text-white text-3xl font-bold mt-1">82% 달성!</Text>
          <Text className="text-white/80 text-xs mt-2">
            지난달보다 12%나 더 해냈어요.
          </Text>
        </View>
        <Feather name="award" size={50} color="white" />
      </View>

      {/* 실천 기록 (Heatmap 느낌의 그리드) */}
      <View className="mb-8">
        <Text className={`${c.textMain} text-lg font-bold mb-4`}>
          성취 기록
        </Text>
        <View
          className={`${c.card} p-5 rounded-2xl flex-row flex-wrap justify-between border ${c.borderSoft}`}
        >
          {Array.from({ length: 28 }).map((_, i) => (
            <View
              key={i}
              className={`w-6 h-6 rounded-md mb-2 ${
                i % 7 === 0
                  ? c.primaryBg
                  : i % 3 === 0
                    ? c.primaryBg60
                    : i % 5 === 0
                      ? c.secondaryBg40
                      : c.mutedBg
              }`}
            />
          ))}
        </View>
        <Text className={`${c.textSub} text-xs mt-2 text-right`}>
          최근 4주간의 기록입니다
        </Text>
      </View>

      {/* 획득한 배지 섹션 */}
      <View className="mb-10">
        <Text className={`${c.textMain} text-lg font-bold mb-4`}>
          수집한 배지
        </Text>
        <View className="flex-row space-x-4">
          <BadgeItem icon="zap" label="3일 연속" color={c.accentBg} />
          <BadgeItem icon="moon" label="밤의 요정" color={c.primaryBg15} />
          <BadgeItem icon="heart" label="자기관리" color={c.secondaryBg15} />
        </View>
      </View>

      <View className="mb-10">
        <Text className={`${c.textMain} text-lg font-bold mb-4`}>설정</Text>
        <View
          className={`${c.card} border ${c.borderSoft} rounded-2xl p-4 shadow-sm`}
        >
          <TouchableOpacity
            onPress={() => router.push("/settings")}
            className="flex-row items-center justify-between py-3"
          >
            <View>
              <Text className={`${c.textMain} font-semibold`}>
                테마 설정
              </Text>
              <Text className={`${c.textSub} text-xs mt-1`}>
                현재: {theme.label}
              </Text>
            </View>
            <Feather
              name="chevron-right"
              size={18}
              color={theme.colors.textSub}
            />
          </TouchableOpacity>
          <View className={`h-[1px] ${c.borderSoftBg} my-3`} />
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

function BadgeItem({
  icon,
  label,
  color,
}: {
  icon: any;
  label: string;
  color: string;
}) {
  const { theme } = useAppTheme();
  const c = theme.classes;
  return (
    <View className="items-center mr-6">
      <View
        className={`w-16 h-16 rounded-full items-center justify-center mb-2 ${color}`}
      >
        <Feather name={icon} size={28} color={theme.colors.textMain} />
      </View>
      <Text className={`${c.textMain} text-xs font-medium`}>{label}</Text>
    </View>
  );
}
