// app/(tabs)/feed.tsx
import { Feather } from "@expo/vector-icons";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "@/components/theme/AppThemeProvider";

export default function FeedScreen() {
  const { theme } = useAppTheme();
  const c = theme.classes;
  return (
    <View className={`flex-1 ${c.bg} px-6 pt-16`}>
      <Text className={`${c.textMain} text-2xl font-bold mb-6`}>
        함께하는 갓생 🤝
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            className={`${c.card} p-5 rounded-2xl mb-4 border ${c.borderSoft} shadow-sm`}
          >
            <View className="flex-row items-center mb-3">
              <View className={`w-10 h-10 rounded-full ${c.mutedBg} mr-3`} />
              <View>
                <Text className={`${c.textMain} font-bold`}>
                  갓생러 {i}호
                </Text>
                <Text className={`${c.textSub} text-xs`}>30분 전</Text>
              </View>
            </View>
            <Text className={`${c.textMain} mb-4`}>
              오늘 '아침 독서' 루틴을 10일째 달성했어요! 📖{"\n"}함께
              응원해주세요.
            </Text>
            <View className={`flex-row border-t ${c.borderSoft} pt-3`}>
              <TouchableOpacity className="flex-row items-center mr-4">
                <Feather name="heart" size={18} color={theme.colors.primary} />
                <Text className={`${c.textSub} text-xs ml-1`}>
                  응원하기 12
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
