import { supabase } from "@/lib/supabase";
import { Tables } from "@/types/database.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { startOfMonth } from "date-fns";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export type RoutineRow = Tables<"routines">;
export type RoutineLogRow = Tables<"routine_logs">;
export type HomeRoutine = RoutineRow & {
  routine_logs: Pick<RoutineLogRow, "id" | "completed_at">[] | null;
};

const fetchHomeData = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

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
    .gte("routine_logs.completed_at", monthStart)
    .returns<HomeRoutine[]>();

  if (error) throw error;
  return { routines, user };
};

export const useHomeRoutines = () => {
  const queryClient = useQueryClient();
  const [orderedRoutines, setOrderedRoutines] = useState<HomeRoutine[]>([]);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["home-routines"],
    queryFn: fetchHomeData,
  });

  useEffect(() => {
    if (data?.routines) {
      setOrderedRoutines(data.routines);
    }
  }, [data?.routines]);

  const toggleRoutine = useMutation({
    mutationFn: async (routineId: string) => {
      if (!data?.user) throw new Error("로그인이 필요합니다.");

      const { error } = await supabase.from("routine_logs").insert({
        routine_id: routineId,
        user_id: data.user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home-routines"] });
    },
    onError: (error: any) => {
      if (error.code === "23505") {
        Alert.alert("알림", "이미 오늘 루틴을 완료하셨어요! ✨");
      } else {
        Alert.alert("오류", "기록하는 중 문제가 발생했습니다.");
      }
    },
  });

  const cancelRoutine = useMutation({
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

  const deleteRoutine = useMutation({
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

  return {
    data,
    isLoading,
    refetch,
    orderedRoutines,
    setOrderedRoutines,
    toggleRoutine: toggleRoutine.mutate,
    cancelRoutine: cancelRoutine.mutate,
    deleteRoutine: deleteRoutine.mutate,
    updateOrder,
  };
};
