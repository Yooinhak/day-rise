import { startOfDay, subDays, isSameDay, isAfter, isBefore } from "date-fns";

export type StreakLogEntry = {
  routine_id: string;
  completed_at: string;
};

export type RoutineInfo = {
  id: string;
  created_at: string | null;
};

/**
 * 개별 루틴의 연속 달성 일수를 계산합니다.
 *
 * 로직:
 * - 오늘 완료했으면: 오늘부터 역순으로 연속일 계산
 * - 오늘 미완료면: 어제부터 역순으로 연속일 계산 (오늘 할 기회가 남아있으므로)
 */
export function calculateRoutineStreak(
  logs: StreakLogEntry[],
  routineId: string,
  routineCreatedAt: string | null
): number {
  const now = new Date();
  const today = startOfDay(now);
  const createdDay = routineCreatedAt
    ? startOfDay(new Date(routineCreatedAt))
    : subDays(today, 365);

  // 해당 루틴의 로그만 필터링하고 날짜 Set 생성
  const routineLogs = logs.filter((log) => log.routine_id === routineId);
  const logDates = new Set(
    routineLogs.map((log) => startOfDay(new Date(log.completed_at)).getTime())
  );

  if (logDates.size === 0) return 0;

  // 오늘 완료했는지 확인
  const completedToday = logDates.has(today.getTime());

  // 스트릭 계산 시작점
  let checkDate = completedToday ? today : subDays(today, 1);
  let streak = 0;

  if (completedToday) {
    streak = 1;
    checkDate = subDays(today, 1);
  } else {
    // 오늘 안 했으면 어제부터 확인
    if (logDates.has(checkDate.getTime())) {
      streak = 1;
      checkDate = subDays(checkDate, 1);
    } else {
      return 0;
    }
  }

  // 연속 일수 역순 계산
  while (
    logDates.has(checkDate.getTime()) &&
    !isBefore(checkDate, createdDay)
  ) {
    streak++;
    checkDate = subDays(checkDate, 1);
    if (streak >= 60) break; // 안전장치
  }

  return streak;
}

/**
 * 전체 스트릭을 계산합니다. (모든 일일 루틴을 완료한 연속 일수)
 *
 * 로직:
 * - 각 날짜에 그 날짜 기준 활성 루틴들이 모두 완료되었는지 확인
 * - 루틴 생성일 이전은 해당 루틴 체크에서 제외
 */
export function calculateGlobalStreak(
  logs: StreakLogEntry[],
  dailyRoutines: RoutineInfo[]
): number {
  if (dailyRoutines.length === 0) return 0;

  const now = new Date();
  const today = startOfDay(now);

  // 날짜별로 완료된 루틴 ID를 그룹화
  const logsByDate = new Map<number, Set<string>>();
  logs.forEach((log) => {
    const dateKey = startOfDay(new Date(log.completed_at)).getTime();
    if (!logsByDate.has(dateKey)) {
      logsByDate.set(dateKey, new Set());
    }
    logsByDate.get(dateKey)!.add(log.routine_id);
  });

  // 특정 날짜에 해당 날짜 기준 활성 루틴이 모두 완료되었는지 확인
  const isAllCompleted = (date: Date): boolean => {
    const dateKey = date.getTime();
    const completedRoutines = logsByDate.get(dateKey) || new Set();

    // 해당 날짜에 이미 생성된 루틴만 체크
    const activeRoutines = dailyRoutines.filter((r) => {
      if (!r.created_at) return true;
      const createdDay = startOfDay(new Date(r.created_at));
      return isSameDay(date, createdDay) || isAfter(date, createdDay);
    });

    if (activeRoutines.length === 0) return false;

    return activeRoutines.every((r) => completedRoutines.has(r.id));
  };

  // 오늘 전체 완료 여부
  const completedToday = isAllCompleted(today);

  let checkDate = completedToday ? today : subDays(today, 1);
  let streak = 0;

  if (completedToday) {
    streak = 1;
    checkDate = subDays(today, 1);
  } else {
    if (isAllCompleted(checkDate)) {
      streak = 1;
      checkDate = subDays(checkDate, 1);
    } else {
      return 0;
    }
  }

  // 연속 일수 계산
  while (isAllCompleted(checkDate)) {
    streak++;
    checkDate = subDays(checkDate, 1);
    if (streak >= 60) break; // 안전장치
  }

  return streak;
}
