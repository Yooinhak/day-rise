import { ConfirmActionModal } from "@/components/home/ConfirmActionModal";
import { HomeSummaryCard } from "@/components/home/HomeSummaryCard";
import { PeriodicGoalCard } from "@/components/home/PeriodicGoalCard";
import { RoutineItem } from "@/components/home/RoutineItem";
import { useAppTheme } from "@/components/theme/AppThemeProvider";
import { supabase } from "@/lib/supabase";
import { Tables } from "@/types/database.types";
import { Feather } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  format,
  isAfter,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ko } from "date-fns/locale";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import "../../global.css";

type RoutineRow = Tables<"routines">;
type RoutineLogRow = Tables<"routine_logs">;
type HomeRoutine = RoutineRow & {
  routine_logs: Pick<RoutineLogRow, "id" | "completed_at">[] | null;
};

// 1. 데이터 페칭 (오늘/이번 주/이번 달 로그만 효율적으로 가져오기)
const fetchHomeData = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const userName =
    user.user_metadata?.name || user.email?.split("@")[0] || "친구";
  const monthStart = startOfMonth(new Date()).toISOString();

  const { data: routines, error } = await supabase
    .from("routines")
    .select(
      `
      *,
      routine_logs (
        id,
        completed_at
      )
    `
    )
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    // 성능을 위해 이번 달의 로그만 가져옵니다.
    .gte("routine_logs.completed_at", monthStart)
    .returns<HomeRoutine[]>();

  if (error) throw error;
  return { routines, userName };
};

export default function HomeScreen() {
  const { theme } = useAppTheme();
  const c = theme.classes;
  const queryClient = useQueryClient();
  const [cancelTarget, setCancelTarget] = useState<{
    logId: string;
    title: string;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    routineId: string;
    title: string;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["home-routines"],
    queryFn: fetchHomeData,
  });
  const [orderedRoutines, setOrderedRoutines] = useState<HomeRoutine[]>([]);

  // 2. 루틴 완료(Log 추가) Mutation
  const { mutate: toggleRoutine } = useMutation({
    mutationFn: async (routineId: string) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("로그인이 필요합니다.");

      const { error } = await supabase.from("routine_logs").insert({
        routine_id: routineId,
        user_id: user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      // 성공 시 데이터를 다시 불러와 화면 갱신
      queryClient.invalidateQueries({ queryKey: ["home-routines"] });
    },
    onError: (error: any) => {
      // DB 유니크 제약 조건에 걸릴 경우 (이미 오늘 완료한 경우)
      if (error.code === "23505") {
        Alert.alert("알림", "이미 오늘 루틴을 완료하셨어요! ✨");
      } else {
        Alert.alert("오류", "기록하는 중 문제가 발생했습니다.");
      }
    },
  });

  const { mutate: cancelRoutine } = useMutation({
    mutationFn: async (logId: string) => {
      const { error } = await supabase
        .from("routine_logs")
        .delete()
        .eq("id", logId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home-routines"] });
    },
    onError: () => {
      Alert.alert("오류", "취소하는 중 문제가 발생했습니다.");
    },
  });

  const { mutate: deleteRoutine } = useMutation({
    mutationFn: async (routineId: string) => {
      const { error } = await supabase
        .from("routines")
        .update({ is_active: false })
        .eq("id", routineId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home-routines"] });
    },
    onError: () => {
      Alert.alert("오류", "삭제하는 중 문제가 발생했습니다.");
    },
  });

  const updateOrder = async (newOrderedRoutines: HomeRoutine[]) => {
    const payload = newOrderedRoutines.map((routine, index) => ({
      id: routine.id,
      sort_order: index,
    }));

    const { error } = await supabase.rpc("update_routine_order", { payload });

    if (!error) {
      queryClient.invalidateQueries({ queryKey: ["home-routines"] });
    } else {
      Alert.alert("오류", "순서를 저장하는 중 문제가 발생했습니다.");
    }
  };

  const routines = data?.routines;
  const userName = data?.userName ?? "친구";
  const now = new Date();
  const todayStart = startOfDay(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);
  const todayLabel = format(now, "M월 d일 EEEE", { locale: ko });

  useEffect(() => {
    if (routines) {
      setOrderedRoutines(routines);
    }
  }, [routines]);

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
              refreshing={isFetching}
              onRefresh={refetch}
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

          {isEditing ? (
            <DraggableFlatList<HomeRoutine>
              data={dailyRoutines}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              activationDistance={12}
              onDragEnd={({ data }) => {
                setOrderedRoutines((prev) => {
                  const periodic = prev.filter((r) => r.frequency !== "daily");
                  const newOrdered = [...data, ...periodic];
                  updateOrder(newOrdered);
                  return newOrdered;
                });
              }}
              renderItem={({ item, drag, isActive }) => {
                const done = isDoneToday(item);
                const todayLogId = getTodayLogId(item);
                return (
                  <RoutineItem
                    key={item.id}
                    title={item.title}
                    time={getTimeLabel(item)}
                    done={done}
                    isEditing={isEditing}
                    isDragging={isActive}
                    onDrag={drag}
                    onPress={() => {
                      if (isEditing) return;
                      if (!done) {
                        toggleRoutine(item.id);
                        return;
                      }
                      if (todayLogId) {
                        setCancelTarget({
                          logId: todayLogId,
                          title: item.title,
                        });
                      }
                    }}
                    onDelete={() => {
                      if (!isEditing) return;
                      setDeleteTarget({
                        routineId: item.id,
                        title: item.title,
                      });
                    }}
                  />
                );
              }}
            />
          ) : (
            dailyRoutines.map((routine) => {
              const done = isDoneToday(routine);
              const todayLogId = getTodayLogId(routine);
              return (
                <RoutineItem
                  key={routine.id}
                  title={routine.title}
                  time={getTimeLabel(routine)}
                  done={done}
                  isEditing={isEditing}
                  onPress={() => {
                    if (!done) {
                      toggleRoutine(routine.id);
                      return;
                    }
                    if (todayLogId) {
                      setCancelTarget({
                        logId: todayLogId,
                        title: routine.title,
                      });
                    }
                  }}
                  onDelete={() => {
                    if (!isEditing) return;
                    setDeleteTarget({
                      routineId: routine.id,
                      title: routine.title,
                    });
                  }}
                />
              );
            })
          )}
        </View>

        <View className="mb-24">
          <View className="mb-4">
            <Text className={`${c.textMain} text-xl font-bold`}>
              이번 주/달에 채워야 할 목표
            </Text>
          </View>
          {isEditing ? (
            <DraggableFlatList<HomeRoutine>
              data={periodicGoals}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              activationDistance={12}
              onDragEnd={({ data }) => {
                setOrderedRoutines((prev) => {
                  const daily = prev.filter((r) => r.frequency === "daily");
                  const newOrdered = [...daily, ...data];
                  updateOrder(newOrdered);
                  return newOrdered;
                });
              }}
              renderItem={({ item, drag, isActive }) => {
                const start =
                  item.frequency === "weekly" ? weekStart : monthStart;
                const progress = (item.routine_logs ?? []).filter((log) =>
                  isAfter(new Date(log.completed_at), start)
                ).length;
                const doneToday = isDoneToday(item);
                const todayLogId = getTodayLogId(item);
                return (
                  <PeriodicGoalCard
                    key={item.id}
                    title={item.title}
                    period={item.frequency}
                    progress={progress}
                    goal={item.target_count}
                    caption={
                      item.frequency === "weekly"
                        ? "이번 주 목표"
                        : "이번 달 목표"
                    }
                    doneToday={doneToday}
                    isEditing={isEditing}
                    isDragging={isActive}
                    onDrag={drag}
                    onPress={() => {
                      if (isEditing) return;
                      if (!doneToday) {
                        toggleRoutine(item.id);
                        return;
                      }
                      if (todayLogId) {
                        setCancelTarget({
                          logId: todayLogId,
                          title: item.title,
                        });
                      }
                    }}
                    onDelete={() => {
                      if (!isEditing) return;
                      setDeleteTarget({
                        routineId: item.id,
                        title: item.title,
                      });
                    }}
                  />
                );
              }}
            />
          ) : (
            periodicGoals.map((goal) => {
              const start =
                goal.frequency === "weekly" ? weekStart : monthStart;
              const progress = (goal.routine_logs ?? []).filter((log) =>
                isAfter(new Date(log.completed_at), start)
              ).length;
              const doneToday = isDoneToday(goal);
              const todayLogId = getTodayLogId(goal);
              return (
                <PeriodicGoalCard
                  key={goal.id}
                  title={goal.title}
                  period={goal.frequency}
                  progress={progress}
                  goal={goal.target_count}
                  caption={
                    goal.frequency === "weekly"
                      ? "이번 주 목표"
                      : "이번 달 목표"
                  }
                  doneToday={doneToday}
                  isEditing={isEditing}
                  onPress={() => {
                    if (!doneToday) {
                      toggleRoutine(goal.id);
                      return;
                    }
                    if (todayLogId) {
                      setCancelTarget({
                        logId: todayLogId,
                        title: goal.title,
                      });
                    }
                  }}
                  onDelete={() => {
                    if (!isEditing) return;
                    setDeleteTarget({
                      routineId: goal.id,
                      title: goal.title,
                    });
                  }}
                />
              );
            })
          )}
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
