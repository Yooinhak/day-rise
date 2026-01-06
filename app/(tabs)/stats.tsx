// app/(tabs)/stats.tsx
import { Feather } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";

export default function StatsScreen() {
  return (
    <ScrollView className="flex-1 bg-bg-warm px-6 pt-16">
      <Text className="text-text-main text-2xl font-bold mb-6">
        성장의 기록 📈
      </Text>

      {/* 이번 달 달성률 요약 카드 */}
      <View className="bg-secondary p-6 rounded-3xl mb-8 flex-row items-center shadow-lg shadow-secondary/30">
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

      {/* 갓생 잔디 (Heatmap 느낌의 그리드) */}
      <View className="mb-8">
        <Text className="text-text-main text-lg font-bold mb-4">
          기록의 정원
        </Text>
        <View className="bg-card p-5 rounded-2xl flex-row flex-wrap justify-between border border-border-soft">
          {Array.from({ length: 28 }).map((_, i) => (
            <View
              key={i}
              className={`w-6 h-6 rounded-md mb-2 ${
                i % 7 === 0
                  ? "bg-primary"
                  : i % 3 === 0
                    ? "bg-primary/60"
                    : i % 5 === 0
                      ? "bg-secondary/40"
                      : "bg-muted"
              }`}
            />
          ))}
        </View>
        <Text className="text-text-sub text-xs mt-2 text-right">
          최근 4주간의 기록입니다
        </Text>
      </View>

      {/* 획득한 배지 섹션 */}
      <View className="mb-10">
        <Text className="text-text-main text-lg font-bold mb-4">
          수집한 배지
        </Text>
        <View className="flex-row space-x-4">
          <BadgeItem icon="zap" label="3일 연속" color="bg-accent" />
          <BadgeItem icon="moon" label="밤의 요정" color="bg-primary/15" />
          <BadgeItem icon="heart" label="자기관리" color="bg-secondary/15" />
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
  return (
    <View className="items-center mr-6">
      <View
        className={`w-16 h-16 rounded-full items-center justify-center mb-2 ${color}`}
      >
        <Feather name={icon} size={28} color="#3C322B" />
      </View>
      <Text className="text-text-main text-xs font-medium">{label}</Text>
    </View>
  );
}
