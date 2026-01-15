import { PeriodicGoalCard } from "@/components/home/PeriodicGoalCard";
import { HomeRoutine } from "@/lib/hooks/useHomeRoutines";
import { isAfter } from "date-fns";
import DraggableFlatList from "react-native-draggable-flatlist";

type PeriodicGoalListProps = {
  routines: HomeRoutine[];
  isEditing: boolean;
  weekStart: Date;
  monthStart: Date;
  onReorder: (routines: HomeRoutine[]) => void;
  isDoneToday: (routine: HomeRoutine) => boolean;
  getTodayLogId: (routine: HomeRoutine) => string | undefined;
  onToggle: (routineId: string) => void;
  onCancel: (logId: string, title: string) => void;
  onDelete: (routineId: string, title: string) => void;
};

export const PeriodicGoalList = ({
  routines,
  isEditing,
  weekStart,
  monthStart,
  onReorder,
  isDoneToday,
  getTodayLogId,
  onToggle,
  onCancel,
  onDelete,
}: PeriodicGoalListProps) => {
  if (isEditing) {
    return (
      <DraggableFlatList<HomeRoutine>
        data={routines}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        activationDistance={12}
        onDragEnd={({ data }) => {
          onReorder(data);
        }}
        renderItem={({ item, drag, isActive }) => {
          const start = item.frequency === "weekly" ? weekStart : monthStart;
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
                item.frequency === "weekly" ? "이번 주 목표" : "이번 달 목표"
              }
              doneToday={doneToday}
              isEditing={isEditing}
              isDragging={isActive}
              onDrag={drag}
              onPress={() => {
                if (isEditing) return;
                if (!doneToday) {
                  onToggle(item.id);
                  return;
                }
                if (todayLogId) {
                  onCancel(todayLogId, item.title);
                }
              }}
              onDelete={() => {
                if (!isEditing) return;
                onDelete(item.id, item.title);
              }}
            />
          );
        }}
      />
    );
  }

  return routines.map((goal) => {
    const start = goal.frequency === "weekly" ? weekStart : monthStart;
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
        caption={goal.frequency === "weekly" ? "이번 주 목표" : "이번 달 목표"}
        doneToday={doneToday}
        isEditing={isEditing}
        onPress={() => {
          if (!doneToday) {
            onToggle(goal.id);
            return;
          }
          if (todayLogId) {
            onCancel(todayLogId, goal.title);
          }
        }}
        onDelete={() => {
          if (!isEditing) return;
          onDelete(goal.id, goal.title);
        }}
      />
    );
  });
};
