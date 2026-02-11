import { useAppTheme } from "@/components/theme/AppThemeProvider";
import { supabase } from "@/lib/supabase";
import { Enums, TablesInsert } from "@/types/database.types";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useQueryClient } from "@tanstack/react-query";
import { format, isValid, parse, set } from "date-fns";
import { ko } from "date-fns/locale";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type RoutineFrequency = Enums<"frequency_type">;

interface RoutineFormValues {
  title: string;
  frequency: RoutineFrequency;
  target_count: number;
  reminder_time: TablesInsert<"routines">["reminder_time"];
}

export default function EditRoutineScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isLoadingRoutine, setIsLoadingRoutine] = useState(true);
  const queryClient = useQueryClient();
  const { theme } = useAppTheme();
  const c = theme.classes;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<RoutineFormValues>({
    defaultValues: {
      title: "",
      frequency: "daily",
      target_count: 1,
      reminder_time: "09:00:00",
    },
  });

  // 기존 루틴 데이터 불러오기
  useEffect(() => {
    if (!id) return;

    const fetchRoutine = async () => {
      const { data, error } = await supabase
        .from("routines")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        Alert.alert("오류", "루틴 정보를 불러올 수 없습니다.");
        router.back();
        return;
      }

      reset({
        title: data.title,
        frequency: data.frequency,
        target_count: data.target_count,
        reminder_time: data.reminder_time,
      });
      setIsLoadingRoutine(false);
    };

    fetchRoutine();
  }, [id, reset]);

  const onSubmit = async (formData: RoutineFormValues) => {
    if (!id) return;

    try {
      const { error } = await supabase
        .from("routines")
        .update({
          title: formData.title,
          frequency: formData.frequency,
          target_count: formData.target_count,
          reminder_time: formData.reminder_time,
        })
        .eq("id", id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["home-routines"] });
      queryClient.invalidateQueries({ queryKey: ["profile-stats"] });
      router.back();
    } catch (error: any) {
      Alert.alert("오류", error.message);
    }
  };

  const frequencies: { id: RoutineFrequency; label: string }[] = [
    { id: "daily", label: "매일" },
    { id: "weekly", label: "매주" },
    { id: "monthly", label: "매달" },
  ];

  const frequency = watch("frequency");
  const targetCount = watch("target_count");

  const maxTargetCount = (() => {
    if (frequency === "weekly") return 7;
    if (frequency === "monthly") return 28;
    return 1;
  })();

  useEffect(() => {
    if (frequency === "daily") {
      setValue("target_count", 1);
    } else {
      if (targetCount > maxTargetCount) {
        setValue("target_count", maxTargetCount);
      }
    }
  }, [frequency, maxTargetCount, setValue, targetCount]);

  const parseTimeToDate = (value: string | null | undefined) => {
    const fallback = set(new Date(), { hours: 9, minutes: 0, seconds: 0 });
    if (!value) return fallback;
    const parsed = parse(value, "HH:mm:ss", new Date());
    return isValid(parsed) ? parsed : fallback;
  };

  const timeToString = (date: Date) => {
    return format(date, "HH:mm':00'");
  };

  const formatTimeLabel = (value: string | null | undefined) => {
    if (!value) return "시간 선택";
    const parsed = parse(value, "HH:mm:ss", new Date());
    if (!isValid(parsed)) return "시간 선택";
    return format(parsed, "a hh:mm", { locale: ko });
  };

  if (isLoadingRoutine) {
    return (
      <View className={`flex-1 ${c.bg} items-center justify-center`}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View className={`flex-1 ${c.bg} px-6 pt-12`}>
      <TouchableOpacity onPress={() => router.back()} className="mb-4">
        <Feather name="x" size={24} color={theme.colors.textMain} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className={`${c.textMain} text-2xl font-bold mb-8`}>
          목표를 수정해볼까요?
        </Text>

        {/* 1. 목표 이름 입력 */}
        <View className="mb-8">
          <Text className={`${c.textSub} mb-3 font-medium`}>목표 이름</Text>
          <Controller
            control={control}
            name="title"
            rules={{ required: "이름을 입력해주세요" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="예: 미지근한 물 마시기"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                className={`${c.card} p-5 rounded-2xl ${c.textMain} text-lg border ${
                  errors.title ? "border-red-400" : c.borderSoft
                } shadow-sm`}
                placeholderTextColor={theme.colors.textSub}
              />
            )}
          />
          {errors.title && (
            <Text className="text-red-400 text-xs mt-2 ml-2">
              {errors.title.message}
            </Text>
          )}
        </View>

        {/* 2. 주기 선택 */}
        <View className="mb-8">
          <Text className={`${c.textSub} mb-3 font-medium`}>
            얼마나 자주 할까요?
          </Text>
          <Controller
            control={control}
            name="frequency"
            render={({ field: { onChange, value } }) => (
              <View
                className={`flex-row justify-between ${c.mutedBg} p-1.5 rounded-2xl border ${c.borderSoft}`}
              >
                {frequencies.map((f) => (
                  <TouchableOpacity
                    key={f.id}
                    onPress={() => onChange(f.id)}
                    className={`flex-1 py-3 rounded-xl items-center ${
                      value === f.id ? `${c.card} border ${c.borderSoft}` : ""
                    }`}
                  >
                    <Text
                      className={`font-bold ${value === f.id ? c.primaryText : c.textSub}`}
                    >
                      {f.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
        </View>

        {/* 3. 상세 설정 */}
        <View className="mb-10">
          <Text className={`${c.textSub} mb-3 font-medium`}>세부 설정</Text>
          <View className={`${c.card} p-5 rounded-2xl border ${c.borderSoft}`}>
            {frequency !== "daily" && (
              <>
                <View className="flex-row justify-between items-center mb-4">
                  <Text className={c.textMain}>목표 횟수</Text>
                  <Controller
                    control={control}
                    name="target_count"
                    render={({ field: { onChange, value } }) => (
                      <View className="flex-row items-center">
                        <TouchableOpacity
                          onPress={() => onChange(Math.max(1, value - 1))}
                          className={`w-8 h-8 ${c.mutedBg} rounded-full items-center justify-center border ${c.borderSoft}`}
                        >
                          <Feather
                            name="minus"
                            size={16}
                            color={theme.colors.textMain}
                          />
                        </TouchableOpacity>
                        <Text
                          className={`${c.textMain} mx-4 font-bold text-lg`}
                        >
                          {value}회
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            onChange(Math.min(maxTargetCount, value + 1))
                          }
                          className={`w-8 h-8 ${c.mutedBg} rounded-full items-center justify-center border ${c.borderSoft}`}
                        >
                          <Feather
                            name="plus"
                            size={16}
                            color={theme.colors.textMain}
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                </View>
                <View className={`h-[1px] ${c.borderSoftBg} my-2`} />
              </>
            )}
            <Controller
              control={control}
              name="reminder_time"
              render={({ field: { onChange, value } }) => (
                <View className="w-full">
                  <View className="flex-row justify-between items-center">
                    <Text className={c.textMain}>알림 시간</Text>
                    <TouchableOpacity
                      onPress={() => setShowTimePicker((prev) => !prev)}
                      className={`px-3 py-2 rounded-full ${c.mutedBg} border ${c.borderSoft}`}
                    >
                      <Text className={`${c.primaryText} font-bold`}>
                        {formatTimeLabel(value)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {showTimePicker && (
                    <View className="mt-3 w-full">
                      <DateTimePicker
                        mode="time"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        value={parseTimeToDate(value)}
                        onChange={(_event, selectedDate) => {
                          if (Platform.OS !== "ios") {
                            setShowTimePicker(false);
                          }
                          if (selectedDate) {
                            onChange(timeToString(selectedDate));
                          }
                        }}
                        accentColor={theme.colors.primary}
                        textColor={theme.colors.textMain}
                        style={{ width: "100%" }}
                      />
                      {Platform.OS === "ios" && (
                        <TouchableOpacity
                          onPress={() => setShowTimePicker(false)}
                          className={`mt-2 self-end px-3 py-1.5 rounded-full ${c.card} border ${c.borderSoft}`}
                        >
                          <Text className={`${c.textSub} text-xs font-medium`}>
                            완료
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              )}
            />
          </View>
        </View>

        {/* 수정 버튼 */}
        <TouchableOpacity
          className={`${c.primaryBg} p-5 rounded-2xl items-center shadow-lg ${c.shadowPrimary30} mb-10 ${
            isSubmitting ? "opacity-50" : ""
          }`}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          <Text className="text-white font-bold text-lg">
            {isSubmitting ? "수정 중..." : "수정 완료"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
