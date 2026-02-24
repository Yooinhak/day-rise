import { supabase } from "@/lib/supabase";
import { calculateRoutineStreak } from "@/lib/utils/streakCalculator";
import { Tables } from "@/types/database.types";
import { useQuery } from "@tanstack/react-query";

export type RoutineDetailLog = Pick<
  Tables<"routine_logs">,
  "id" | "completed_at"
>;

export type RoutineDetailData = {
  routine: Tables<"routines">;
  logs: RoutineDetailLog[];
  totalCompletions: number;
  streak: number;
};

async function fetchRoutineDetail(
  routineId: string,
): Promise<RoutineDetailData | null> {
  const { data: routine, error: rErr } = await supabase
    .from("routines")
    .select("*")
    .eq("id", routineId)
    .single();

  if (rErr || !routine) return null;

  const { data: logs, error: lErr } = await supabase
    .from("routine_logs")
    .select("id, completed_at")
    .eq("routine_id", routineId)
    .order("completed_at", { ascending: true });

  if (lErr) return null;

  const allLogs: RoutineDetailLog[] = logs ?? [];

  const streakLogs = allLogs.map((l) => ({
    routine_id: routineId,
    completed_at: l.completed_at,
  }));

  const streak = calculateRoutineStreak(
    streakLogs,
    routineId,
    routine.created_at,
  );

  return {
    routine,
    logs: allLogs,
    totalCompletions: allLogs.length,
    streak,
  };
}

export function useRoutineDetail(routineId: string | null) {
  return useQuery({
    queryKey: ["routine-detail", routineId],
    queryFn: () => fetchRoutineDetail(routineId!),
    enabled: !!routineId,
    staleTime: 2 * 60 * 1000,
  });
}
