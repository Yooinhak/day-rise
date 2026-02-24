import { useAppTheme } from "@/components/theme/AppThemeProvider";
import { Feather } from "@expo/vector-icons";
import {
  addMonths,
  format,
  getDaysInMonth,
  getDay,
  isAfter,
  isSameDay,
  startOfMonth,
  subMonths,
} from "date-fns";
import { ko } from "date-fns/locale";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type RoutineDetailCalendarProps = {
  logs: { completed_at: string }[];
};

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export function RoutineDetailCalendar({ logs }: RoutineDetailCalendarProps) {
  const { theme } = useAppTheme();
  const c = theme.classes;
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();

  const completedDates = new Set(
    logs.map((log) => format(new Date(log.completed_at), "yyyy-MM-dd")),
  );

  const monthStart = startOfMonth(currentMonth);
  const daysInMonth = getDaysInMonth(currentMonth);
  const startDayOfWeek = getDay(monthStart);

  const canGoForward = !isAfter(
    startOfMonth(addMonths(currentMonth, 1)),
    startOfMonth(today),
  );

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }

  return (
    <View className={`${c.card} rounded-2xl border ${c.borderSoft} p-4`}>
      {/* Month Navigation */}
      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity
          onPress={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2"
        >
          <Feather
            name="chevron-left"
            size={20}
            color={theme.colors.textMain}
          />
        </TouchableOpacity>
        <Text className={`${c.textMain} text-base font-bold`}>
          {format(currentMonth, "yyyy년 M월", { locale: ko })}
        </Text>
        <TouchableOpacity
          onPress={() =>
            canGoForward && setCurrentMonth(addMonths(currentMonth, 1))
          }
          className="p-2"
          disabled={!canGoForward}
          style={{ opacity: canGoForward ? 1 : 0.3 }}
        >
          <Feather
            name="chevron-right"
            size={20}
            color={theme.colors.textMain}
          />
        </TouchableOpacity>
      </View>

      {/* Day of Week Headers */}
      <View className="flex-row mb-2">
        {DAY_LABELS.map((label) => (
          <View key={label} className="flex-1 items-center">
            <Text className={`${c.textSub} text-xs font-medium`}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Calendar Grid */}
      <View className="flex-row flex-wrap">
        {cells.map((day, idx) => {
          if (day === null) {
            return <View key={`empty-${idx}`} className="w-[14.28%] h-10" />;
          }

          const date = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            day,
          );
          const dateStr = format(date, "yyyy-MM-dd");
          const isCompleted = completedDates.has(dateStr);
          const isToday = isSameDay(date, today);

          return (
            <View
              key={dateStr}
              className="w-[14.28%] h-10 items-center justify-center"
            >
              <View
                className="w-8 h-8 rounded-full items-center justify-center"
                style={[
                  isCompleted && {
                    backgroundColor: theme.colors.primary,
                  },
                  !isCompleted &&
                    isToday && {
                      borderWidth: 2,
                      borderColor: theme.colors.primary,
                    },
                ]}
              >
                <Text
                  className={`text-sm ${
                    isCompleted
                      ? "text-white font-bold"
                      : isToday
                        ? `${c.primaryText} font-bold`
                        : c.textMain
                  }`}
                >
                  {day}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
