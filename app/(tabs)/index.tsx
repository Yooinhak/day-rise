// app/(tabs)/index.tsx
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import "../../global.css";

export default function HomeScreen() {
  const dailyRoutines = [
    { title: "아침 물 한잔", time: "오전 7:00", icon: "droplet", done: true },
    { title: "명상 10분", time: "오전 7:30", icon: "wind", done: true },
    { title: "비타민 먹기", time: "오전 8:30", icon: "sun", done: false },
    { title: "독서 30분", time: "오후 10:00", icon: "book-open", done: false },
  ];
  const periodicGoals = [
    {
      title: "이번 주 독서",
      period: "weekly",
      progress: 1,
      goal: 3,
      caption: "여유 있을 때 한 번씩",
    },
    {
      title: "이번 달 등산",
      period: "monthly",
      progress: 0,
      goal: 1,
      caption: "긴 호흡의 목표",
    },
  ];

  return (
    <View className="flex-1 bg-bg-warm px-6 pt-16">
      {/* 헤더 섹션 */}
      <View className="flex-row justify-between items-start mb-6">
        <View>
          <Text className="text-text-sub text-sm font-medium">
            1월 6일 월요일
          </Text>
          <Text className="text-text-main text-2xl font-bold mt-1">
            오늘도 멋진 하루를{"\n"}만들어봐요, 지민님! 🌿
          </Text>
        </View>
        <TouchableOpacity className="bg-card p-3 rounded-full border border-border-soft shadow-sm">
          <Feather name="bell" size={20} color="#3C322B" />
        </TouchableOpacity>
      </View>

      {/* 오늘의 요약 */}
      <View className="bg-primary/10 p-5 rounded-2xl mb-6 border border-primary/20">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-4">
            <Text className="text-text-sub text-xs font-medium mb-1">
              오늘의 정원
            </Text>
            <Text className="text-text-main text-xl font-bold">
              지민님의 정원이 80%{"\n"}따뜻해졌어요
            </Text>
            <Text className="text-text-main/70 text-sm mt-2">
              보너스 루틴은 100%를 넘겨도 기록돼요
            </Text>
          </View>
          <View className="w-14 h-14 rounded-full border-4 border-primary items-center justify-center bg-card">
            <Text className="text-primary font-bold text-xs">6/7</Text>
          </View>
        </View>
        <View className="mt-4">
          <View className="h-2 bg-card rounded-full overflow-hidden border border-border-soft">
            <View className="h-full w-[80%] bg-primary rounded-full" />
          </View>
          <View className="flex-row justify-between mt-2">
            <Text className="text-text-sub text-xs">오늘의 달성률</Text>
            <Text className="text-primary text-xs font-bold">80%</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Daily Routines */}
        <View className="mb-6">
          <View className="flex-row justify-between items-end mb-4">
            <View>
              <Text className="text-text-main text-xl font-bold">
                오늘 꼭 해야 할 루틴
              </Text>
              <Text className="text-text-sub text-xs mt-1">
                매일 루틴은 자정에 리셋돼요
              </Text>
            </View>
            <TouchableOpacity>
              <Text className="text-text-sub text-sm underline">편집하기</Text>
            </TouchableOpacity>
          </View>

          {dailyRoutines.map((routine) => (
            <RoutineItem key={routine.title} {...routine} />
          ))}
        </View>

        {/* Periodic Goals */}
        <View className="mb-24">
          <View className="mb-4">
            <Text className="text-text-main text-xl font-bold">
              이번 주/달에 채워야 할 목표
            </Text>
            <Text className="text-text-sub text-xs mt-1">
              오늘 했으면 보너스처럼 올라가요
            </Text>
          </View>
          {periodicGoals.map((goal) => (
            <PeriodicGoalCard key={goal.title} {...goal} />
          ))}
        </View>
      </ScrollView>

      {/* 3. Floating Action Button 수정 */}
      <TouchableOpacity
        onPress={() => router.push("/create")} // 4. 클릭 시 create 페이지로 이동
        className="absolute bottom-6 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg shadow-primary/40"
      >
        <Feather name="plus" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

// 개별 루틴 아이템 컴포넌트 (파일 분리 권장)
function RoutineItem({
  title,
  time,
  icon,
  done,
}: {
  title: string;
  time: string;
  icon: any;
  done: boolean;
}) {
  return (
    <TouchableOpacity
      className={`flex-row items-center p-5 rounded-2xl bg-card mb-3 border border-border-soft ${done ? "opacity-50" : ""}`}
      style={{ elevation: 2 }}
    >
      {/* <View
        className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${done ? "bg-secondary" : "bg-muted"}`}
      >
        <Feather name={icon} size={20} color={done ? "white" : "#7C736C"} />
      </View> */}
      <View className="flex-1">
        <Text
          className={`text-lg font-semibold ${done ? "line-through text-text-sub" : "text-text-main"}`}
        >
          {title}
        </Text>
        <Text className="text-text-sub text-xs">{time}</Text>
      </View>
      <View
        className={`w-6 h-6 rounded-full border-2 items-center justify-center ${done ? "bg-primary border-primary" : "border-border-soft"}`}
      >
        {done && <Feather name="check" size={14} color="white" />}
      </View>
    </TouchableOpacity>
  );
}

function PeriodicGoalCard({
  title,
  period,
  progress,
  goal,
  caption,
}: {
  title: string;
  period: string;
  progress: number;
  goal: number;
  caption: string;
}) {
  const percent = Math.min(100, Math.round((progress / goal) * 100));
  const badge = period === "weekly" ? "이번 주 목표" : "이번 달 목표";

  return (
    <TouchableOpacity className="bg-card p-5 rounded-2xl border border-border-soft mb-3">
      <View className="flex-row items-start justify-between mb-3">
        <View>
          <Text className="text-text-main font-bold text-lg">{title}</Text>
          <Text className="text-text-sub text-xs mt-1">{caption}</Text>
        </View>
        <View className="px-3 py-1 rounded-full bg-muted border border-border-soft">
          <Text className="text-text-sub text-xs font-medium">{badge}</Text>
        </View>
      </View>
      <View className="h-2 bg-muted rounded-full overflow-hidden">
        <View
          className="h-full bg-primary rounded-full"
          style={{ width: `${percent}%` }}
        />
      </View>
      <View className="flex-row justify-between mt-2">
        <Text className="text-text-sub text-xs">
          {progress}/{goal}회 달성
        </Text>
        <Text className="text-primary text-xs font-bold">{percent}%</Text>
      </View>
    </TouchableOpacity>
  );
}
