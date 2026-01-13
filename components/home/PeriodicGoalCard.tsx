import { Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "@/components/theme/AppThemeProvider";

type PeriodicGoalCardProps = {
  title: string;
  period: "weekly" | "monthly" | "yearly" | "daily";
  progress: number;
  goal: number;
  caption: string;
  doneToday: boolean;
  isEditing: boolean;
  isDragging?: boolean;
  onDrag?: () => void;
  onPress?: () => void;
  onDelete: () => void;
};

export function PeriodicGoalCard({
  title,
  period,
  progress,
  goal,
  caption,
  doneToday,
  onPress,
  isEditing,
  isDragging,
  onDrag,
  onDelete,
}: PeriodicGoalCardProps) {
  const { theme } = useAppTheme();
  const c = theme.classes;
  const percent = Math.min(100, Math.round((progress / goal) * 100));
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={isEditing ? 1 : 0.7}
      className={`${c.card} p-5 rounded-2xl border ${c.borderSoft} mb-3 ${
        doneToday ? c.primaryBg5 : ""
      } ${isDragging ? `${c.primaryBorder60} ${c.primaryBg10}` : ""}`}
    >
      <View className="flex-row items-start justify-between mb-3">
        <View>
          <Text className={`${c.textMain} font-bold text-lg`}>{title}</Text>
          <Text className={`${c.textSub} text-xs mt-1`}>{caption}</Text>
        </View>
        <View
          className={`px-3 py-1 rounded-full border ${c.borderSoft} ${
            doneToday ? c.primaryBg : c.mutedBg
          }`}
        >
          <Text
            className={`text-xs font-medium ${
              doneToday ? "text-white" : c.textSub
            }`}
          >
            {doneToday ? "오늘 완료!" : period === "weekly" ? "주간" : "월간"}
          </Text>
        </View>
      </View>
      {isEditing && (
        <View className="flex-row items-center justify-end mb-3">
          <TouchableOpacity
            onPressIn={onDrag}
            className={`px-3 py-1 rounded-full ${c.mutedBg} border ${c.borderSoft} mr-2`}
          >
            <Text className={`${c.textSub} text-xs font-medium`}>이동</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onDelete}
            className={`px-3 py-1 rounded-full ${c.mutedBg} border ${c.borderSoft}`}
          >
            <Text className={`${c.textSub} text-xs font-medium`}>삭제</Text>
          </TouchableOpacity>
        </View>
      )}
      <View className={`h-2 ${c.mutedBg} rounded-full overflow-hidden`}>
        <View
          className={`h-full ${c.primaryBg} rounded-full`}
          style={{ width: `${percent}%` }}
        />
      </View>
      <View className="flex-row justify-between mt-2">
        <Text className={`${c.textSub} text-xs`}>
          {progress}/{goal}회 달성
        </Text>
        <Text className={`${c.primaryText} text-xs font-bold`}>
          {percent}%
        </Text>
      </View>
    </TouchableOpacity>
  );
}
