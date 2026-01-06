// app/(tabs)/index.tsx
import { Feather } from "@expo/vector-icons";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import "../../global.css";

export default function HomeScreen() {
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
        <TouchableOpacity className="bg-card p-3 rounded-full shadow-sm">
          <Feather name="bell" size={20} color="#4A3F35" />
        </TouchableOpacity>
      </View>

      {/* 주간 달성도 (Progress) */}
      <View className="bg-primary/10 p-5 rounded-2xl mb-8 flex-row items-center justify-between">
        <View>
          <Text className="text-primary font-bold text-lg">
            오늘의 달성률 65%
          </Text>
          <Text className="text-text-main/70 text-sm mt-1">
            조금만 더 힘내면 완벽해요!
          </Text>
        </View>
        <View className="w-12 h-12 rounded-full border-4 border-primary items-center justify-center">
          <Text className="text-primary font-bold text-xs">5/8</Text>
        </View>
      </View>

      {/* 루틴 리스트 */}
      <View className="flex-1">
        <View className="flex-row justify-between items-end mb-4">
          <Text className="text-text-main text-xl font-bold">나의 루틴</Text>
          <TouchableOpacity>
            <Text className="text-text-sub text-sm underline">편집하기</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="space-y-4">
          <RoutineItem
            title="아침 물 한잔"
            time="오전 7:00"
            icon="droplet"
            done={true}
          />
          <RoutineItem
            title="명상 10분"
            time="오전 7:30"
            icon="wind"
            done={true}
          />
          <RoutineItem
            title="비타민 먹기"
            time="오전 8:30"
            icon="sun"
            done={false}
          />
          <RoutineItem
            title="독서 30분"
            time="오후 10:00"
            icon="book-open"
            done={false}
          />
        </ScrollView>
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity className="absolute bottom-6 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg shadow-primary/40">
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
      className={`flex-row items-center p-5 rounded-2xl bg-card mb-3 border border-stone-50 ${done ? "opacity-50" : ""}`}
      style={{ elevation: 2 }}
    >
      <View
        className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${done ? "bg-secondary" : "bg-stone-100"}`}
      >
        <Feather name={icon} size={20} color={done ? "white" : "#948B83"} />
      </View>
      <View className="flex-1">
        <Text
          className={`text-lg font-semibold ${done ? "line-through text-text-sub" : "text-text-main"}`}
        >
          {title}
        </Text>
        <Text className="text-text-sub text-xs">{time}</Text>
      </View>
      <View
        className={`w-6 h-6 rounded-full border-2 items-center justify-center ${done ? "bg-primary border-primary" : "border-stone-200"}`}
      >
        {done && <Feather name="check" size={14} color="white" />}
      </View>
    </TouchableOpacity>
  );
}
