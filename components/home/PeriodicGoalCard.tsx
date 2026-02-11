import { useAppTheme } from "@/components/theme/AppThemeProvider";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

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
  onEdit?: () => void;
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
  onEdit,
}: PeriodicGoalCardProps) {
  const { theme } = useAppTheme();
  const c = theme.classes;
  const percent = Math.min(100, Math.round((progress / goal) * 100));

  // Animated progress bar
  const progressWidth = useSharedValue(percent);

  useEffect(() => {
    progressWidth.value = withSpring(percent, {
      damping: 20,
      stiffness: 200,
    });
  }, [percent]);

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  // Badge bounce when doneToday changes
  const badgeScale = useSharedValue(1);

  useEffect(() => {
    if (doneToday) {
      badgeScale.value = withSpring(1.15, { damping: 8, stiffness: 500 });
      setTimeout(() => {
        badgeScale.value = withSpring(1, { damping: 12, stiffness: 300 });
      }, 150);
    }
  }, [doneToday]);

  const badgeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      haptic={isEditing ? "none" : "light"}
      disabled={isEditing}
      className={`${c.card} p-5 rounded-2xl border ${c.borderSoft} mb-3 ${
        doneToday ? c.primaryBg5 : ""
      } ${isDragging ? `${c.primaryBorder60} ${c.primaryBg10}` : ""}`}
    >
      <View className="flex-row items-start justify-between mb-3">
        <View>
          <Text className={`${c.textMain} font-bold text-lg`}>{title}</Text>
          <Text className={`${c.textSub} text-xs mt-1`}>{caption}</Text>
        </View>
        <Animated.View style={badgeAnimatedStyle}>
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
        </Animated.View>
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
            onPress={onEdit}
            className={`px-3 py-1 rounded-full ${c.mutedBg} border ${c.borderSoft} mr-2`}
          >
            <Text className={`${c.textSub} text-xs font-medium`}>수정</Text>
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
        <Animated.View
          className={`h-full ${c.primaryBg} rounded-full`}
          style={progressBarStyle}
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
    </AnimatedPressable>
  );
}
