import * as Haptics from "expo-haptics";
import { PropsWithChildren } from "react";
import { Pressable, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedPress = Animated.createAnimatedComponent(Pressable);

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 400,
  mass: 0.4,
};

type AnimatedPressableProps = PropsWithChildren<{
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
  style?: ViewStyle;
  haptic?: "light" | "medium" | "none";
  scaleValue?: number;
}>;

export function AnimatedPressable({
  onPress,
  disabled,
  className,
  style,
  haptic = "light",
  scaleValue = 0.97,
  children,
}: AnimatedPressableProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(scaleValue, SPRING_CONFIG);
    if (haptic !== "none") {
      Haptics.impactAsync(
        haptic === "medium"
          ? Haptics.ImpactFeedbackStyle.Medium
          : Haptics.ImpactFeedbackStyle.Light,
      );
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, SPRING_CONFIG);
  };

  return (
    <AnimatedPress
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      className={className}
      style={[animatedStyle, style]}
    >
      {children}
    </AnimatedPress>
  );
}
