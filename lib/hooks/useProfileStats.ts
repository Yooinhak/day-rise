import { supabase } from "@/lib/supabase";
import {
  calculateGlobalStreak,
  StreakLogEntry,
} from "@/lib/utils/streakCalculator";
import { useQuery } from "@tanstack/react-query";
import {
  endOfMonth,
  format,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths,
} from "date-fns";

export type DailyCompletion = {
  date: string; // YYYY-MM-DD
  completionRate: number; // 0-100
};

export type ProfileStats = {
  thisMonthRate: number;
  lastMonthRate: number;
  monthDiff: number;
  last28Days: DailyCompletion[];
  globalStreak: number;
  longestStreak: number;
  totalCompletions: number;
};

const fetchProfileStats = async (): Promise<ProfileStats | null> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));
  const thirtyDaysAgo = subDays(now, 30);
  const sixtyDaysAgo = subDays(now, 60);

  // 활성 일일 루틴 조회
  const { data: routines } = await supabase
    .from("routines")
    .select("id, created_at, frequency")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .eq("frequency", "daily");

  if (!routines || routines.length === 0) {
    return {
      thisMonthRate: 0,
      lastMonthRate: 0,
      monthDiff: 0,
      last28Days: generateEmptyDays(),
      globalStreak: 0,
      longestStreak: 0,
      totalCompletions: 0,
    };
  }

  // 최근 60일간 로그 조회
  const { data: logs } = await supabase
    .from("routine_logs")
    .select("routine_id, completed_at")
    .eq("user_id", user.id)
    .gte("completed_at", sixtyDaysAgo.toISOString());

  const allLogs: StreakLogEntry[] = logs || [];

  // 이번 달 달성률 계산
  const thisMonthRate = calculateMonthlyRate(
    routines,
    allLogs,
    thisMonthStart,
    now
  );

  // 지난 달 달성률 계산
  const lastMonthRate = calculateMonthlyRate(
    routines,
    allLogs,
    lastMonthStart,
    lastMonthEnd
  );

  // 차이 계산
  const monthDiff = thisMonthRate - lastMonthRate;

  // 최근 28일 일별 달성률
  const last28Days = calculateLast28Days(routines, allLogs);

  // 전체 스트릭
  const globalStreak = calculateGlobalStreak(
    allLogs,
    routines.map((r) => ({ id: r.id, created_at: r.created_at }))
  );

  // 가장 긴 스트릭 계산
  const longestStreak = calculateLongestStreak(routines, allLogs);

  // 전체 완료 횟수
  const totalCompletions = allLogs.length;

  return {
    thisMonthRate,
    lastMonthRate,
    monthDiff,
    last28Days,
    globalStreak,
    longestStreak,
    totalCompletions,
  };
};

function calculateMonthlyRate(
  routines: { id: string; created_at: string | null }[],
  logs: StreakLogEntry[],
  monthStart: Date,
  monthEnd: Date
): number {
  let totalExpected = 0;
  let totalCompleted = 0;

  const today = startOfDay(new Date());

  // 해당 월의 각 날짜를 순회
  let currentDate = startOfDay(monthStart);
  const endDate = startOfDay(monthEnd) > today ? today : startOfDay(monthEnd);

  while (currentDate <= endDate) {
    const dateStr = format(currentDate, "yyyy-MM-dd");

    // 해당 날짜에 활성화된 루틴 수
    const activeRoutines = routines.filter((r) => {
      if (!r.created_at) return true;
      return startOfDay(new Date(r.created_at)) <= currentDate;
    });

    totalExpected += activeRoutines.length;

    // 해당 날짜에 완료된 루틴 수
    const completedOnDate = logs.filter((log) => {
      const logDate = format(new Date(log.completed_at), "yyyy-MM-dd");
      return (
        logDate === dateStr && activeRoutines.some((r) => r.id === log.routine_id)
      );
    });

    totalCompleted += completedOnDate.length;

    currentDate = subDays(currentDate, -1); // 다음 날
  }

  return totalExpected > 0 ? Math.round((totalCompleted / totalExpected) * 100) : 0;
}

function calculateLast28Days(
  routines: { id: string; created_at: string | null }[],
  logs: StreakLogEntry[]
): DailyCompletion[] {
  const result: DailyCompletion[] = [];
  const today = startOfDay(new Date());

  for (let i = 27; i >= 0; i--) {
    const date = subDays(today, i);
    const dateStr = format(date, "yyyy-MM-dd");

    // 해당 날짜에 활성화된 루틴 수
    const activeRoutines = routines.filter((r) => {
      if (!r.created_at) return true;
      return startOfDay(new Date(r.created_at)) <= date;
    });

    if (activeRoutines.length === 0) {
      result.push({ date: dateStr, completionRate: 0 });
      continue;
    }

    // 해당 날짜에 완료된 루틴 수
    const completedOnDate = logs.filter((log) => {
      const logDate = format(new Date(log.completed_at), "yyyy-MM-dd");
      return (
        logDate === dateStr && activeRoutines.some((r) => r.id === log.routine_id)
      );
    }).length;

    const rate = Math.round((completedOnDate / activeRoutines.length) * 100);
    result.push({ date: dateStr, completionRate: rate });
  }

  return result;
}

function calculateLongestStreak(
  routines: { id: string; created_at: string | null }[],
  logs: StreakLogEntry[]
): number {
  if (routines.length === 0) return 0;

  // 날짜별로 완료된 루틴 그룹화
  const logsByDate = new Map<string, Set<string>>();
  logs.forEach((log) => {
    const dateStr = format(new Date(log.completed_at), "yyyy-MM-dd");
    if (!logsByDate.has(dateStr)) {
      logsByDate.set(dateStr, new Set());
    }
    logsByDate.get(dateStr)!.add(log.routine_id);
  });

  // 날짜 정렬
  const sortedDates = Array.from(logsByDate.keys()).sort();
  if (sortedDates.length === 0) return 0;

  let maxStreak = 0;
  let currentStreak = 0;
  let prevDate: Date | null = null;

  for (const dateStr of sortedDates) {
    const date = new Date(dateStr);

    // 해당 날짜에 활성화된 루틴
    const activeRoutines = routines.filter((r) => {
      if (!r.created_at) return true;
      return startOfDay(new Date(r.created_at)) <= date;
    });

    // 모든 루틴 완료했는지 확인
    const completedRoutines = logsByDate.get(dateStr)!;
    const allCompleted = activeRoutines.every((r) => completedRoutines.has(r.id));

    if (allCompleted) {
      if (prevDate) {
        const daysDiff = Math.round(
          (date.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysDiff === 1) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }
      maxStreak = Math.max(maxStreak, currentStreak);
      prevDate = date;
    } else {
      currentStreak = 0;
      prevDate = null;
    }
  }

  return maxStreak;
}

function generateEmptyDays(): DailyCompletion[] {
  const result: DailyCompletion[] = [];
  const today = startOfDay(new Date());
  for (let i = 27; i >= 0; i--) {
    result.push({
      date: format(subDays(today, i), "yyyy-MM-dd"),
      completionRate: 0,
    });
  }
  return result;
}

export const useProfileStats = () => {
  return useQuery({
    queryKey: ["profile-stats"],
    queryFn: fetchProfileStats,
    staleTime: 5 * 60 * 1000, // 5분간 캐시
  });
};
