// app/(tabs)/feed.tsx
import { Feather } from "@expo/vector-icons";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function FeedScreen() {
  return (
    <View className="flex-1 bg-bg-warm px-6 pt-16">
      <Text className="text-text-main text-2xl font-bold mb-6">
        함께하는 갓생 🤝
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            className="bg-card p-5 rounded-2xl mb-4 border border-border-soft shadow-sm"
          >
            <View className="flex-row items-center mb-3">
              <View className="w-10 h-10 rounded-full bg-muted mr-3" />
              <View>
                <Text className="text-text-main font-bold">갓생러 {i}호</Text>
                <Text className="text-text-sub text-xs">30분 전</Text>
              </View>
            </View>
            <Text className="text-text-main mb-4">
              오늘 '아침 독서' 루틴을 10일째 달성했어요! 📖{"\n"}함께
              응원해주세요.
            </Text>
            <View className="flex-row border-t border-border-soft pt-3">
              <TouchableOpacity className="flex-row items-center mr-4">
                <Feather name="heart" size={18} color="#E08162" />
                <Text className="text-text-sub text-xs ml-1">응원하기 12</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
