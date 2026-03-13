import { useAppTheme } from "@/components/theme/AppThemeProvider";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export function HomeEmptyState() {
  const { theme } = useAppTheme();
  const c = theme.classes;

  return (
    <View
      className={`${c.card} border ${c.borderSoft} rounded-2xl p-8 items-center`}
    >
      <Text className="text-4xl mb-4">🌱</Text>
      <Text className={`${c.textMain} text-lg font-bold text-center mb-2`}>
        첫 루틴을 만들어볼까요?
      </Text>
      <Text className={`${c.textSub} text-sm text-center mb-6`}>
        매일 작은 습관부터 시작해봐요.{"\n"}
        꾸준히 하면 큰 변화가 찾아올 거예요!
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/create")}
        accessibilityRole="button"
        accessibilityLabel="첫 루틴 만들기"
        className={`${c.primaryBg} px-6 py-3 rounded-2xl flex-row items-center shadow-lg ${c.shadowPrimary40}`}
      >
        <Feather name="plus" size={18} color="white" />
        <Text className="text-white font-bold text-base ml-2">
          첫 루틴 만들기
        </Text>
      </TouchableOpacity>
    </View>
  );
}
