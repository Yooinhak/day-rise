import { ConfirmActionModal } from "@/components/home/ConfirmActionModal";
import { DailyRoutineList } from "@/components/home/DailyRoutineList";
import { HomeSummaryCard } from "@/components/home/HomeSummaryCard";
import { PeriodicGoalList } from "@/components/home/PeriodicGoalList";
import { useAppTheme } from "@/components/theme/AppThemeProvider";
import { Feather } from "@expo/vector-icons";
import { HomeRoutine, useHomeRoutines } from "@/lib/hooks/useHomeRoutines";
import {
  format,
  isAfter,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ko } from "date-fns/locale";
import { router } from "expo-router";
import { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import "../../global.css";

export default function HomeScreen() {
  const { theme } = useAppTheme();
  const c = theme.classes;
  const [cancelTarget, setCancelTarget] = useState<{
    logId: string;
    title: string;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    routineId: string;
    title: string;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const {
    data,
    isLoading,
    refetch,
    orderedRoutines,
    setOrderedRoutines,
    toggleRoutine,
    cancelRoutine,
    deleteRoutine,
    updateOrder,
  } = useHomeRoutines();

  const userName =
    data?.user.user_metadata?.name || data?.user.email?.split("@")[0] || "친구";
  const now = new Date();
  const todayStart = startOfDay(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);
  const todayLabel = format(now, "M월 d일 EEEE", { locale: ko });

  if (isLoading) return <View className={`flex-1 ${c.bg}`} />;

  const getTodayLogId = (routine: HomeRoutine) =>
    (routine.routine_logs ?? []).find((log) =>
      isAfter(new Date(log.completed_at), todayStart)
    )?.id;

  const isDoneToday = (routine: HomeRoutine) =>
    (routine.routine_logs ?? []).some((log) =>
      isAfter(new Date(log.completed_at), todayStart)
    );

  const getTimeLabel = (routine: HomeRoutine) =>
    routine.reminder_time?.substring(0, 5) || "시간 미설정";

  // --- 달성률 계산 로직 ---

  // 1. 매일 루틴 가공
  const dailyRoutines = orderedRoutines.filter((r) => r.frequency === "daily");

  // 2. 주기별 목표 가공 (주간/월간)
  const periodicGoals = orderedRoutines.filter((r) => r.frequency !== "daily");

  // 3. 오늘의 목표 달성률 계산 (LaTeX 수식 참고)
  // $$\text{gardenProgress} = \frac{\text{completedDaily} + \text{bonusCount}}{\text{totalDaily}} \times 100$$
  const totalDaily = dailyRoutines.length;
  const completedDaily = dailyRoutines.filter((r) => isDoneToday(r)).length;
  const gardenProgress =
    totalDaily > 0 ? Math.round((completedDaily / totalDaily) * 100) : 0;

  const handleManualRefresh = async () => {
    setIsManualRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsManualRefreshing(false);
    }
  };

  const handleDailyReorder = (newDailyOrder: HomeRoutine[]) => {
    setOrderedRoutines((prev) => {
      const periodic = prev.filter((r) => r.frequency !== "daily");
      const newOrdered = [...newDailyOrder, ...periodic];
      updateOrder(newOrdered);
      return newOrdered;
    });
  };

  const handlePeriodicReorder = (newPeriodicOrder: HomeRoutine[]) => {
    setOrderedRoutines((prev) => {
      const daily = prev.filter((r) => r.frequency === "daily");
      const newOrdered = [...daily, ...newPeriodicOrder];
      updateOrder(newOrdered);
      return newOrdered;
    });
  };

  return (
    <View className={`flex-1 ${c.bg} px-6 pt-16`}>
      <View className="flex-row justify-between items-start mb-6">
        <View>
          <Text className={`${c.textSub} text-sm font-medium`}>
            {todayLabel}
          </Text>
          <Text className={`${c.textMain} text-2xl font-bold mt-1`}>
            오늘도 멋진 하루를{"\n"}만들어봐요, {userName}님! 🌿
          </Text>
        </View>
        {/* <TouchableOpacity className="bg-card p-3 rounded-full border border-border-soft shadow-sm">
          <Feather name="bell" size={20} color={theme.colors.textMain} />
        </TouchableOpacity> */}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          isEditing ? undefined : (
            <RefreshControl
              tintColor={theme.colors.primary}
              refreshing={isManualRefreshing}
              onRefresh={handleManualRefresh}
            />
          )
        }
        className="flex-1"
      >
        <HomeSummaryCard
          gardenProgress={gardenProgress}
          completedDaily={completedDaily}
          totalDaily={totalDaily}
          userName={userName}
        />

        <View className="mb-6">
          <View className="flex-row justify-between items-end mb-4">
            <View>
              <Text className={`${c.textMain} text-xl font-bold`}>
                오늘 꼭 해야 할 루틴
              </Text>
              <Text className={`${c.textSub} text-xs mt-1`}>
                매일 루틴은 자정에 리셋돼요
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setIsEditing((prev) => !prev)}
              className={`px-3 py-1 rounded-full ${c.card} border ${c.borderSoft}`}
            >
              <Text className={`${c.textSub} text-xs font-medium`}>
                {isEditing ? "완료" : "편집"}
              </Text>
            </TouchableOpacity>
          </View>

          <DailyRoutineList
            routines={dailyRoutines}
            isEditing={isEditing}
            onReorder={handleDailyReorder}
            isDoneToday={isDoneToday}
            getTodayLogId={getTodayLogId}
            getTimeLabel={getTimeLabel}
            onToggle={toggleRoutine}
            onCancel={(logId, title) => setCancelTarget({ logId, title })}
            onDelete={(routineId, title) =>
              setDeleteTarget({ routineId, title })
            }
          />
        </View>

        <View className="mb-24">
          <View className="mb-4">
            <Text className={`${c.textMain} text-xl font-bold`}>
              이번 주/달에 채워야 할 목표
            </Text>
          </View>
          <PeriodicGoalList
            routines={periodicGoals}
            isEditing={isEditing}
            weekStart={weekStart}
            monthStart={monthStart}
            onReorder={handlePeriodicReorder}
            isDoneToday={isDoneToday}
            getTodayLogId={getTodayLogId}
            onToggle={toggleRoutine}
            onCancel={(logId, title) => setCancelTarget({ logId, title })}
            onDelete={(routineId, title) =>
              setDeleteTarget({ routineId, title })
            }
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={() => router.push("/create")}
        className={`absolute bottom-6 right-6 w-14 h-14 ${c.primaryBg} rounded-full items-center justify-center shadow-lg ${c.shadowPrimary40}`}
      >
        <Feather name="plus" size={30} color="white" />
      </TouchableOpacity>

      <ConfirmActionModal
        visible={!!cancelTarget}
        headline="해당 목표를 취소하시겠습니까?"
        title={cancelTarget?.title ?? ""}
        detail="오늘 완료 기록이 취소돼요."
        confirmLabel="확인"
        onClose={() => setCancelTarget(null)}
        onConfirm={() => {
          if (!cancelTarget) return;
          cancelRoutine(cancelTarget.logId);
          setCancelTarget(null);
        }}
      />

      <ConfirmActionModal
        visible={!!deleteTarget}
        headline="해당 목표를 삭제하시겠습니까?"
        title={deleteTarget?.title ?? ""}
        detail="삭제하면 홈에서 더 이상 보이지 않아요."
        confirmLabel="삭제"
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteRoutine(deleteTarget.routineId);
          setDeleteTarget(null);
        }}
      />
    </View>
  );
}
