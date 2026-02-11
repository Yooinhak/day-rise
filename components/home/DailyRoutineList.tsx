import { RoutineItem } from "@/components/home/RoutineItem";
import { HomeRoutine } from "@/lib/hooks/useHomeRoutines";
import DraggableFlatList from "react-native-draggable-flatlist";

type DailyRoutineListProps = {
  routines: HomeRoutine[];
  isEditing: boolean;
  onReorder: (routines: HomeRoutine[]) => void;
  isDoneToday: (routine: HomeRoutine) => boolean;
  getTodayLogId: (routine: HomeRoutine) => string | undefined;
  getTimeLabel: (routine: HomeRoutine) => string;
  onToggle: (routineId: string) => void;
  onCancel: (logId: string, title: string) => void;
  onDelete: (routineId: string, title: string) => void;
  onEdit: (routineId: string) => void;
};

export const DailyRoutineList = ({
  routines,
  isEditing,
  onReorder,
  isDoneToday,
  getTodayLogId,
  getTimeLabel,
  onToggle,
  onCancel,
  onDelete,
  onEdit,
}: DailyRoutineListProps) => {
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
          const done = isDoneToday(item);
          const todayLogId = getTodayLogId(item);
          return (
            <RoutineItem
              key={item.id}
              title={item.title}
              time={getTimeLabel(item)}
              done={done}
              streak={item.streak}
              isEditing={isEditing}
              isDragging={isActive}
              onDrag={drag}
              onPress={() => {
                if (isEditing) return;
                if (!done) {
                  onToggle(item.id);
                  return;
                }
                if (todayLogId) {
                  onCancel(todayLogId, item.title);
                }
              }}
              onEdit={() => onEdit(item.id)}
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

  return routines.map((routine) => {
    const done = isDoneToday(routine);
    const todayLogId = getTodayLogId(routine);
    return (
      <RoutineItem
        key={routine.id}
        title={routine.title}
        time={getTimeLabel(routine)}
        done={done}
        streak={routine.streak}
        isEditing={isEditing}
        onPress={() => {
          if (!done) {
            onToggle(routine.id);
            return;
          }
          if (todayLogId) {
            onCancel(todayLogId, routine.title);
          }
        }}
        onEdit={() => onEdit(routine.id)}
        onDelete={() => {
          if (!isEditing) return;
          onDelete(routine.id, routine.title);
        }}
      />
    );
  });
};
