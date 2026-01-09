import { Feather } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

type RoutineItemProps = {
  title: string;
  time: string;
  done: boolean;
  isEditing: boolean;
  onPress?: () => void;
  isDragging?: boolean;
  onDrag?: () => void;
  onDelete: () => void;
};

export function RoutineItem({
  title,
  time,
  done,
  onPress,
  isEditing,
  isDragging,
  onDrag,
  onDelete,
}: RoutineItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={isEditing ? 1 : 0.7}
      className={`flex-row items-center p-5 rounded-2xl bg-card mb-3 border border-border-soft ${done ? "opacity-50" : ""} ${
        isDragging ? "border-primary/60 bg-primary/5" : ""
      }`}
      style={{ elevation: 2 }}
    >
      <View className="flex-1">
        <Text
          className={`text-lg font-semibold ${done ? "line-through text-text-sub" : "text-text-main"}`}
        >
          {title}
        </Text>
        <Text className="text-text-sub text-xs">{time}</Text>
      </View>
      {isEditing && (
        <TouchableOpacity
          onPressIn={onDrag}
          className="w-8 h-8 rounded-full bg-muted items-center justify-center border border-border-soft mr-2"
        >
          <Feather name="menu" size={14} color="#7C736C" />
        </TouchableOpacity>
      )}
      {isEditing && (
        <TouchableOpacity
          onPress={onDelete}
          className="w-8 h-8 rounded-full bg-muted items-center justify-center border border-border-soft mr-2"
        >
          <Feather name="trash-2" size={14} color="#7C736C" />
        </TouchableOpacity>
      )}
      <View
        className={`w-6 h-6 rounded-full border-2 items-center justify-center ${done ? "bg-primary border-primary" : "border-border-soft"}`}
      >
        {done && <Feather name="check" size={14} color="white" />}
      </View>
    </TouchableOpacity>
  );
}
