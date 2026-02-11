import { useAppTheme } from "@/components/theme/AppThemeProvider";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";
import { Feather } from "@expo/vector-icons";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type RoutineItemProps = {
  title: string;
  time: string;
  done: boolean;
  streak?: number;
  isEditing: boolean;
  onPress?: () => void;
  isDragging?: boolean;
  onDrag?: () => void;
  onDelete: () => void;
  onEdit?: () => void;
};

export function RoutineItem({
  title,
  time,
  done,
  streak,
  onPress,
  isEditing,
  isDragging,
  onDrag,
  onDelete,
  onEdit,
}: RoutineItemProps) {
  const { theme } = useAppTheme();
  const c = theme.classes;

  const rowOpacity = useSharedValue(done ? 0.5 : 1);

  useEffect(() => {
    rowOpacity.value = withTiming(done ? 0.5 : 1, { duration: 250 });
  }, [done]);

  const rowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: rowOpacity.value,
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      haptic={isEditing ? "none" : "light"}
      disabled={isEditing}
      className={`flex-row items-center p-5 rounded-2xl ${c.card} mb-3 border ${c.borderSoft} ${
        isDragging ? `${c.primaryBorder60} ${c.primaryBg5}` : ""
      }`}
      style={{ elevation: 2 }}
    >
      <Animated.View className="flex-1 flex-row items-center" style={rowAnimatedStyle}>
        <View className="flex-1">
          <View className="flex-row items-center">
            <Text
              className={`text-lg font-semibold ${done ? `line-through ${c.textSub}` : c.textMain}`}
            >
              {title}
            </Text>
            {streak !== undefined && streak > 0 && (
              <View className="flex-row items-center ml-2 bg-orange-100 px-2 py-0.5 rounded-full">
                <Text className="text-orange-500 text-xs font-medium">
                  {streak}
                </Text>
              </View>
            )}
          </View>
          <Text className={`${c.textSub} text-xs`}>{time}</Text>
        </View>
      </Animated.View>
      {isEditing && (
        <TouchableOpacity
          onPressIn={onDrag}
          className={`w-8 h-8 rounded-full ${c.mutedBg} items-center justify-center border ${c.borderSoft} mr-2`}
        >
          <Feather name="menu" size={14} color={theme.colors.textSub} />
        </TouchableOpacity>
      )}
      {isEditing && (
        <TouchableOpacity
          onPress={onEdit}
          className={`w-8 h-8 rounded-full ${c.mutedBg} items-center justify-center border ${c.borderSoft} mr-2`}
        >
          <Feather name="edit-2" size={14} color={theme.colors.textSub} />
        </TouchableOpacity>
      )}
      {isEditing && (
        <TouchableOpacity
          onPress={onDelete}
          className={`w-8 h-8 rounded-full ${c.mutedBg} items-center justify-center border ${c.borderSoft} mr-2`}
        >
          <Feather name="trash-2" size={14} color={theme.colors.textSub} />
        </TouchableOpacity>
      )}
      <View
        className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
          done ? `${c.primaryBg} ${c.primaryBorder}` : c.borderSoft
        }`}
      >
        {done && <Feather name="check" size={14} color="white" />}
      </View>
    </AnimatedPressable>
  );
}
