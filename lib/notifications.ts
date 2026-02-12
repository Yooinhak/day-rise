import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// ─── Constants ───────────────────────────────────────────────────
const NOTIFICATIONS_ENABLED_KEY = "dayrise.notifications.enabled";

// ─── Types ───────────────────────────────────────────────────────
export type SchedulableRoutine = {
  id: string;
  title: string;
  reminder_time: string | null;
  is_active: boolean | null;
};

// ─── Notification Handler (call once at app startup) ─────────────
export function configureNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

// ─── Android Channel Setup ───────────────────────────────────────
export async function setupAndroidChannel() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("routine-reminders", {
      name: "루틴 알림",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "default",
      vibrationPattern: [0, 250, 250, 250],
    });
  }
}

// ─── Permission Handling ─────────────────────────────────────────
export async function getNotificationPermissionStatus(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  return status === "granted";
}

export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus === "granted") return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

// ─── Settings Toggle Persistence ─────────────────────────────────
export async function getNotificationsEnabled(): Promise<boolean> {
  const stored = await AsyncStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
  return stored !== "false";
}

export async function setNotificationsEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(
    NOTIFICATIONS_ENABLED_KEY,
    enabled ? "true" : "false",
  );
}

// ─── Core Scheduling Logic ───────────────────────────────────────

function parseReminderTime(
  timeStr: string | null,
): { hour: number; minute: number } | null {
  if (!timeStr) return null;
  const parts = timeStr.split(":");
  if (parts.length < 2) return null;
  const hour = parseInt(parts[0], 10);
  const minute = parseInt(parts[1], 10);
  if (isNaN(hour) || isNaN(minute)) return null;
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return { hour, minute };
}

export async function scheduleRoutineNotification(
  routine: SchedulableRoutine,
): Promise<void> {
  const enabled = await getNotificationsEnabled();
  if (!enabled) return;

  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return;

  const time = parseReminderTime(routine.reminder_time);
  if (!time) return;
  if (!routine.is_active) return;

  await cancelRoutineNotification(routine.id);

  await Notifications.scheduleNotificationAsync({
    identifier: routine.id,
    content: {
      title: "오늘의 루틴 알림",
      body: `${routine.title} 할 시간이에요!`,
      sound: "default",
      ...(Platform.OS === "android" && {
        channelId: "routine-reminders",
      }),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: time.hour,
      minute: time.minute,
    },
  });
}

export async function cancelRoutineNotification(
  routineId: string,
): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(routineId);
}

export async function cancelAllRoutineNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function syncAllNotifications(
  routines: SchedulableRoutine[],
): Promise<void> {
  const enabled = await getNotificationsEnabled();
  if (!enabled) {
    await cancelAllRoutineNotifications();
    return;
  }

  const hasPermission = await getNotificationPermissionStatus();
  if (!hasPermission) return;

  await cancelAllRoutineNotifications();

  const schedulable = routines.filter((r) => r.is_active && r.reminder_time);

  await Promise.all(
    schedulable.map((routine) => scheduleRoutineNotification(routine)),
  );
}
