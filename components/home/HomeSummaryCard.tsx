import { useAppTheme } from "@/components/theme/AppThemeProvider";
import { Text, View } from "react-native";

type HomeSummaryCardProps = {
  todayProgress: number;
  completedDaily: number;
  totalDaily: number;
  weeklyProgress: number;
  userName: string;
  globalStreak: number;
};

export function HomeSummaryCard({
  todayProgress,
  completedDaily,
  totalDaily,
  weeklyProgress,
  userName,
  globalStreak,
}: HomeSummaryCardProps) {
  const { theme } = useAppTheme();
  const c = theme.classes;
  return (
    <View
      className={`${c.primaryBg10} p-5 rounded-2xl mb-6 border ${c.primaryBorder20} relative`}
    >
      {globalStreak > 0 && (
        <View className="absolute -top-2 -right-2 flex-row items-center bg-orange-500 px-3 py-1 rounded-full shadow-sm z-10">
          <Text className="text-white text-sm font-bold">{globalStreak}</Text>
        </View>
      )}
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-4">
          <Text className={`${c.textSub} text-xs font-medium mb-1`}>
            오늘의 성취
          </Text>
          <Text className={`${c.textMain} text-xl font-bold`}>
            {todayProgress >= 100
              ? `${userName}님, 오늘 목표를\n완벽하게 달성했어요! 🌟`
              : `${userName}님, 오늘 목표의 ${todayProgress}%를\n해냈어요`}
          </Text>
          <Text className={`${c.textMain} text-sm mt-2 opacity-70`}>
            오늘 목표 기준으로 달성률이 계산돼요
          </Text>
        </View>
        <View
          className={`w-14 h-14 rounded-full border-4 ${c.primaryBorder} items-center justify-center ${c.card}`}
        >
          <Text className={`${c.primaryText} font-bold text-xs`}>
            {completedDaily}/{totalDaily}
          </Text>
        </View>
      </View>
      <View className="mt-4">
        <View
          className={`h-2 ${c.card} rounded-full overflow-hidden border ${c.borderSoft}`}
        >
          <View
            className={`h-full ${c.primaryBg} rounded-full`}
            style={{ width: `${Math.min(100, weeklyProgress)}%` }}
          />
        </View>
        <View className="flex-row justify-between mt-2">
          <Text className={`${c.textSub} text-xs`}>이번 주 달성률</Text>
          <Text className={`${c.primaryText} text-xs font-bold`}>
            {weeklyProgress}%
          </Text>
        </View>
      </View>
      <View className="mt-3">
        <View
          className={`h-2 ${c.card} rounded-full overflow-hidden border ${c.borderSoft}`}
        >
          <View
            className={`h-full ${c.primaryBg} rounded-full`}
            style={{ width: `${Math.min(100, todayProgress)}%` }}
          />
        </View>
        <View className="flex-row justify-between mt-2">
          <Text className={`${c.textSub} text-xs`}>오늘의 달성률</Text>
          <Text className={`${c.primaryText} text-xs font-bold`}>
            {todayProgress}%
          </Text>
        </View>
      </View>
    </View>
  );
}
