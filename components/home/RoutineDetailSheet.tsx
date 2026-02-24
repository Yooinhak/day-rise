import { useAppTheme } from "@/components/theme/AppThemeProvider";
import { RoutineDetailCalendar } from "@/components/home/RoutineDetailCalendar";
import { useRoutineDetail } from "@/lib/hooks/useRoutineDetail";
import { format, isSameMonth } from "date-fns";
import { useEffect } from "react";
import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type RoutineDetailSheetProps = {
  routineId: string | null;
  onClose: () => void;
};

function StatItem({ label, value }: { label: string; value: string }) {
  const { theme } = useAppTheme();
  const c = theme.classes;
  return (
    <View className="w-1/2 mb-3">
      <Text className={`${c.textSub} text-xs mb-1`}>{label}</Text>
      <Text className={`${c.textMain} text-lg font-bold`}>{value}</Text>
    </View>
  );
}

export function RoutineDetailSheet({
  routineId,
  onClose,
}: RoutineDetailSheetProps) {
  const { theme } = useAppTheme();
  const c = theme.classes;
  const { data, isLoading } = useRoutineDetail(routineId);

  const backdropOpacity = useSharedValue(0);
  const sheetTranslateY = useSharedValue(600);

  useEffect(() => {
    if (routineId) {
      backdropOpacity.value = withTiming(1, { duration: 250 });
      sheetTranslateY.value = withTiming(0, { duration: 300 });
    } else {
      backdropOpacity.value = withTiming(0, { duration: 200 });
      sheetTranslateY.value = withTiming(600, { duration: 250 });
    }
  }, [routineId]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetTranslateY.value }],
  }));

  const thisMonthRate = (() => {
    if (!data) return 0;
    const now = new Date();
    const thisMonthLogs = data.logs.filter((log) =>
      isSameMonth(new Date(log.completed_at), now),
    );
    const dayOfMonth = now.getDate();
    if (dayOfMonth === 0) return 0;
    return Math.round((thisMonthLogs.length / dayOfMonth) * 100);
  })();

  return (
    <Modal
      transparent
      animationType="none"
      visible={!!routineId}
      onRequestClose={onClose}
    >
      {/* Backdrop - fades in */}
      <Animated.View className="absolute inset-0" style={backdropStyle}>
        <Pressable onPress={onClose} className="flex-1 bg-black/40" />
      </Animated.View>

      {/* Sheet Content - slides up */}
      <View className="flex-1 justify-end" pointerEvents="box-none">
        <Animated.View
          className={`${c.card} rounded-t-3xl border-t ${c.borderSoft} px-6 pt-4 pb-10`}
          style={sheetStyle}
        >
          {/* Drag Handle */}
          <View className="w-10 h-1 rounded-full bg-gray-300 self-center mb-5" />

          {isLoading || !data ? (
            <View className="items-center py-12">
              <ActivityIndicator size="small" color={theme.colors.primary} />
            </View>
          ) : (
            <>
              {/* Title */}
              <Text className={`${c.textMain} text-xl font-bold mb-5`}>
                {data.routine.title}
              </Text>

              {/* Stats Grid */}
              <View className="flex-row flex-wrap mb-5">
                <StatItem
                  label="생성일"
                  value={
                    data.routine.created_at
                      ? format(new Date(data.routine.created_at), "yyyy.MM.dd")
                      : "-"
                  }
                />
                <StatItem label="연속 달성" value={`${data.streak}일`} />
                <StatItem
                  label="총 완료 횟수"
                  value={`${data.totalCompletions}회`}
                />
                <StatItem label="이번 달 완료율" value={`${thisMonthRate}%`} />
              </View>

              {/* Calendar */}
              <RoutineDetailCalendar logs={data.logs} />
            </>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}
