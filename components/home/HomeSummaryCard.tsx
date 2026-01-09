import { Text, View } from "react-native";

type HomeSummaryCardProps = {
  gardenProgress: number;
  completedDaily: number;
  totalDaily: number;
  userName: string;
};

export function HomeSummaryCard({
  gardenProgress,
  completedDaily,
  totalDaily,
  userName,
}: HomeSummaryCardProps) {
  return (
    <View className="bg-primary/10 p-5 rounded-2xl mb-6 border border-primary/20">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-4">
          <Text className="text-text-sub text-xs font-medium mb-1">
            오늘의 정원
          </Text>
          <Text className="text-text-main text-xl font-bold">
            {gardenProgress >= 100
              ? `${userName}님의 정원이\n완전 따뜻해졌어요! 🌸`
              : `${userName}님의 정원이 ${gardenProgress}%\n따뜻해졌어요`}
          </Text>
          <Text className="text-text-main/70 text-sm mt-2">
            오늘 목표 기준으로 달성률이 계산돼요
          </Text>
        </View>
        <View className="w-14 h-14 rounded-full border-4 border-primary items-center justify-center bg-card">
          <Text className="text-primary font-bold text-xs">
            {completedDaily}/{totalDaily}
          </Text>
        </View>
      </View>
      <View className="mt-4">
        <View className="h-2 bg-card rounded-full overflow-hidden border border-border-soft">
          <View
            className="h-full bg-primary rounded-full"
            style={{ width: `${Math.min(100, gardenProgress)}%` }}
          />
        </View>
        <View className="flex-row justify-between mt-2">
          <Text className="text-text-sub text-xs">오늘의 달성률</Text>
          <Text className="text-primary text-xs font-bold">
            {gardenProgress}%
          </Text>
        </View>
      </View>
    </View>
  );
}
