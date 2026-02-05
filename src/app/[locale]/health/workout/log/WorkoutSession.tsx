"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Plus,
  X,
  ChevronDown,
  CheckCircle2,
  Trash2,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
} from "lucide-react";
import WorkoutTimer from "./WorkoutTimer";
import Link from "next/link";
import { saveWorkout, updateWorkout, deleteWorkout } from "../actions";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type Exercise = {
  id: string;
  name: string;
  target_part: string;
  category: string;
};

type SetType = "warmup" | "top_set" | "back_off" | "working";

type WorkoutSet = {
  id: string;
  type: SetType;
  weight: string;
  reps: string;
  completed: boolean;
  // Cardio fields
  duration_min?: string;
  distance_km?: string;
  calories?: string;
  heart_rate?: string;
};

type WorkoutExercise = Exercise & {
  unit: "kg" | "lb";
  sets: WorkoutSet[];
};

export default function WorkoutSession({
  exercisesList,
  initialRoutine,
  locale,
  existingWorkout,
  workoutId,
}: {
  exercisesList: Exercise[];
  initialRoutine?: any;
  locale: string;
  existingWorkout?: any;
  workoutId?: string;
}) {
  const t = useTranslations("health.session");
  const router = useRouter();

  // Initialize exercises with grouping logic
  const [activeExercises, setActiveExercises] = useState<WorkoutExercise[]>([]);
  const [activeTypeSelector, setActiveTypeSelector] = useState<{
    exIndex: number;
    setIndex: number;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Exercise Selection & Scheme State
  const [selectedExerciseForAdd, setSelectedExerciseForAdd] = useState<Exercise | null>(null);

  useEffect(() => {
    // Load existing workout data if provided
    if (existingWorkout && existingWorkout.exercises) {
      const loadedExercises: WorkoutExercise[] = existingWorkout.exercises.map((ex: any) => ({
        id: ex.id || crypto.randomUUID(),
        name: ex.name,
        target_part: ex.target_part || "",
        category: ex.category || "strength",
        unit: "kg",
        sets:
          ex.sets?.map((set: any) => ({
            id: set.id || crypto.randomUUID(),
            type: set.type || "working",
            weight: set.weight?.toString() || "",
            reps: set.reps?.toString() || "",
            completed: set.completed || false,
            duration_min: set.duration_min?.toString() || "",
            distance_km: set.distance_km?.toString() || "",
            calories: set.calories?.toString() || "",
            heart_rate: set.heart_rate?.toString() || "",
          })) || [],
      }));
      setActiveExercises(loadedExercises);
      return;
    }

    if (initialRoutine && initialRoutine.exercises) {
      // Group by exercise ID
      const groupedMap = new Map<string, WorkoutExercise>();

      const sortedRoutineExercises = initialRoutine.exercises.sort(
        (a: any, b: any) => a.order_index - b.order_index,
      );

      sortedRoutineExercises.forEach((pe: any) => {
        const exId = pe.exercise_details.id;
        const targetSetCount = pe.target_sets || 3;

        // Generate new sets based on target
        const newSets: WorkoutSet[] = Array.from({ length: targetSetCount }).map((_, i) => ({
          id: crypto.randomUUID(),
          type: (pe.set_type as SetType) || "working",
          weight: "",
          reps: "",
          completed: false,
        }));

        if (groupedMap.has(exId)) {
          // Append sets to existing exercise
          const existing = groupedMap.get(exId)!;
          existing.sets.push(...newSets);
        } else {
          // Create new exercise entry
          groupedMap.set(exId, {
            id: pe.exercise_details.id,
            name: pe.exercise_details.name,
            target_part: pe.exercise_details.target_part,
            category: pe.exercise_details.category,
            unit: "kg",
            sets: newSets,
          });
        }
      });

      setActiveExercises(Array.from(groupedMap.values()));
    }
  }, [initialRoutine, existingWorkout]);

  const categories = ["All", ...Array.from(new Set(exercisesList.map((e) => e.target_part)))];

  const handleAddExercise = (scheme: "straight" | "top_backoff") => {
    if (!selectedExerciseForAdd) return;

    let initialSets: WorkoutSet[] = [];

    if (scheme === "top_backoff") {
      initialSets = [
        { id: crypto.randomUUID(), type: "warmup", weight: "", reps: "", completed: false },
        { id: crypto.randomUUID(), type: "top_set", weight: "", reps: "", completed: false },
        { id: crypto.randomUUID(), type: "back_off", weight: "", reps: "", completed: false },
        { id: crypto.randomUUID(), type: "back_off", weight: "", reps: "", completed: false },
      ];
    } else {
      // Straight sets (Working)
      initialSets = Array.from({ length: 3 }).map(() => ({
        id: crypto.randomUUID(),
        type: "working",
        weight: "",
        reps: "",
        completed: false,
      }));
    }

    setActiveExercises((prev) => [
      ...prev,
      {
        ...selectedExerciseForAdd,
        unit: "kg",
        sets: initialSets,
      },
    ]);

    setSelectedExerciseForAdd(null);
    setIsModalOpen(false);
  };

  const updateSet = (
    exerciseIndex: number,
    setIndex: number,
    field: keyof WorkoutSet,
    value: string | boolean | SetType,
  ) => {
    const newExercises = [...activeExercises];
    // @ts-ignore
    newExercises[exerciseIndex].sets[setIndex][field] = value;
    setActiveExercises(newExercises);
  };

  const addSet = (exerciseIndex: number) => {
    const newExercises = [...activeExercises];
    const previousSet =
      newExercises[exerciseIndex].sets[newExercises[exerciseIndex].sets.length - 1];

    // Inherit type and weight/reps from previous set for convenience
    newExercises[exerciseIndex].sets.push({
      id: crypto.randomUUID(),
      type: previousSet ? previousSet.type : "working",
      weight: previousSet ? previousSet.weight : "",
      reps: previousSet ? previousSet.reps : "",
      completed: false,
    });
    setActiveExercises(newExercises);
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const newExercises = [...activeExercises];
    newExercises[exerciseIndex].sets.splice(setIndex, 1);
    setActiveExercises(newExercises);
  };

  const removeExercise = (index: number) => {
    const newExercises = [...activeExercises];
    newExercises.splice(index, 1);
    setActiveExercises(newExercises);
  };

  const moveExercise = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === activeExercises.length - 1) return;

    const newExercises = [...activeExercises];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    [newExercises[index], newExercises[targetIndex]] = [
      newExercises[targetIndex],
      newExercises[index],
    ];
    setActiveExercises(newExercises);
  };

  const toggleUnit = (index: number) => {
    const newExercises = [...activeExercises];
    newExercises[index].unit = newExercises[index].unit === "kg" ? "lb" : "kg";
    setActiveExercises(newExercises);
  };

  const handleFinish = async () => {
    if (activeExercises.length === 0) return;
    setIsSaving(true);

    const payload = {
      exercises: activeExercises.map((e) => ({
        id: e.id,
        name: e.name,
        target_part: e.target_part,
        category: e.category,
        sets: e.sets.map((s) => ({
          weight: Number(s.weight) || 0,
          reps: Number(s.reps) || 0,
          type: s.type,
          unit: e.unit,
          completed: s.completed,
          duration_min: Number(s.duration_min) || undefined,
          distance_km: Number(s.distance_km) || undefined,
          calories: Number(s.calories) || undefined,
          heart_rate: Number(s.heart_rate) || undefined,
        })),
      })),
    };

    try {
      let result;
      if (workoutId) {
        // Update existing workout
        result = await updateWorkout(workoutId, payload);
      } else {
        // Create new workout
        result = await saveWorkout(payload);
      }

      if (result.success) {
        router.push(`/${locale}/health/workout/history`);
      } else {
        alert(t("saveError"));
        setIsSaving(false);
      }
    } catch (e) {
      console.error(e);
      alert(t("genericError"));
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!workoutId) return;

    if (!confirm("이 운동 기록을 삭제하시겠습니까?")) return;

    setIsSaving(true);
    try {
      const result = await deleteWorkout(workoutId, locale);

      if (result.success) {
        router.push(`/${locale}/health/workout/history`);
      } else {
        alert(result.error || "삭제에 실패했습니다.");
        setIsSaving(false);
      }
    } catch (e) {
      console.error(e);
      alert("삭제에 실패했습니다.");
      setIsSaving(false);
    }
  };

  const filteredExercises =
    selectedCategory === "All"
      ? exercisesList
      : exercisesList.filter((e) => e.target_part === selectedCategory);

  const isCardio = (exercise: WorkoutExercise) => {
    return exercise.category?.toLowerCase() === "cardio";
  };

  const getSetTypeLabel = (type: SetType) => {
    switch (type) {
      case "top_set":
        return t("typeTop");
      case "back_off":
        return t("typeBack");
      case "warmup":
        return t("typeWarm");
      case "working":
        return t("typeWork");
      default:
        return t("typeWork");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 safe-top bg-black z-10 border-b border-white/5">
        <Link
          href={`/${locale}/health/dashboard/today`}
          className="p-2 text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <span className="font-semibold text-[17px]">{workoutId ? "운동 수정" : t("title")}</span>
        <div className="flex items-center gap-2">
          {workoutId && (
            <button
              onClick={handleDelete}
              disabled={isSaving}
              className="p-2 text-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
            >
              <Trash2 size={20} />
            </button>
          )}
          <WorkoutTimer />
        </div>
      </div>

      {/* Backdrop for closing picker */}
      {activeTypeSelector && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => setActiveTypeSelector(null)}
        />
      )}

      <div className="flex-1 overflow-y-auto px-4 pb-40 space-y-6 pt-4">
        {activeExercises.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-3xl">
              💪
            </div>
            <p className="text-[17px]">{t("emptyTitle")}</p>
          </div>
        ) : (
          activeExercises.map((exercise, exIndex) => (
            <div
              key={exercise.id + exIndex}
              className="bg-[#1C1C1E] rounded-[22px] border border-white/5"
            >
              <div className="px-4 py-3 bg-[#2C2C2E] rounded-t-[22px] flex items-center justify-between">
                <div>
                  <h3 className="text-[17px] font-bold text-white">{exercise.name}</h3>
                  <p className="text-[13px] text-gray-400">{exercise.target_part}</p>
                </div>
                <div className="flex items-center gap-1">
                  {/* Unit Toggle */}
                  <button
                    onClick={() => toggleUnit(exIndex)}
                    className="px-2 py-1 bg-black/40 rounded text-[11px] font-bold mr-2 flex items-baseline"
                  >
                    {exercise.unit === "kg" ? (
                      <>
                        <span className="text-[#007AFF]">KG</span>
                        <span className="text-gray-500 text-[9px] ml-0.5">/lb</span>
                      </>
                    ) : (
                      <>
                        <span className="text-[#007AFF]">LB</span>
                        <span className="text-gray-500 text-[9px] ml-0.5">/kg</span>
                      </>
                    )}
                  </button>

                  {/* Reorder Buttons */}
                  <button
                    onClick={() => moveExercise(exIndex, "up")}
                    className="p-1.5 text-gray-500 hover:text-white disabled:opacity-30"
                    disabled={exIndex === 0}
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    onClick={() => moveExercise(exIndex, "down")}
                    className="p-1.5 text-gray-500 hover:text-white disabled:opacity-30"
                    disabled={exIndex === activeExercises.length - 1}
                  >
                    <ArrowDown size={16} />
                  </button>

                  {/* Delete Exercise */}
                  <button
                    onClick={() => removeExercise(exIndex)}
                    className="p-1.5 text-gray-500 hover:text-red-500 ml-1"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {isCardio(exercise) ? (
                  // Cardio Header
                  <div className="grid grid-cols-12 gap-2 text-[11px] text-gray-500 font-medium text-center mb-1 uppercase tracking-wider">
                    <div className="col-span-2">시간(분)</div>
                    <div className="col-span-2">거리(km)</div>
                    <div className="col-span-2">칼로리</div>
                    <div className="col-span-3">심박수</div>
                    <div className="col-span-2">{t("tableDone")}</div>
                    <div className="col-span-1"></div>
                  </div>
                ) : (
                  // Strength Header
                  <div className="grid grid-cols-12 gap-2 text-[11px] text-gray-500 font-medium text-center mb-1 uppercase tracking-wider">
                    <div className="col-span-2">{t("tableType")}</div>
                    <div className="col-span-3">
                      {t("tableWeight")} ({exercise.unit})
                    </div>
                    <div className="col-span-3">{t("tableReps")}</div>
                    <div className="col-span-2">{t("tableDone")}</div>
                    <div className="col-span-2"></div>
                  </div>
                )}

                {exercise.sets.map((set, setIndex) => (
                  <div key={set.id} className="grid grid-cols-12 gap-2 items-center">
                    {isCardio(exercise) ? (
                      // Cardio Input Row
                      <>
                        <div className="col-span-2">
                          <input
                            type="number"
                            value={set.duration_min || ""}
                            onChange={(e) =>
                              updateSet(exIndex, setIndex, "duration_min", e.target.value)
                            }
                            placeholder="0"
                            className="w-full h-9 bg-[#2C2C2E] rounded-lg text-center text-white font-semibold focus:bg-[#3A3A3C] focus:outline-none transition-colors"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            step="0.1"
                            value={set.distance_km || ""}
                            onChange={(e) =>
                              updateSet(exIndex, setIndex, "distance_km", e.target.value)
                            }
                            placeholder="0"
                            className="w-full h-9 bg-[#2C2C2E] rounded-lg text-center text-white font-semibold focus:bg-[#3A3A3C] focus:outline-none transition-colors"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            value={set.calories || ""}
                            onChange={(e) =>
                              updateSet(exIndex, setIndex, "calories", e.target.value)
                            }
                            placeholder="0"
                            className="w-full h-9 bg-[#2C2C2E] rounded-lg text-center text-white font-semibold focus:bg-[#3A3A3C] focus:outline-none transition-colors"
                          />
                        </div>
                        <div className="col-span-3">
                          <input
                            type="number"
                            value={set.heart_rate || ""}
                            onChange={(e) =>
                              updateSet(exIndex, setIndex, "heart_rate", e.target.value)
                            }
                            placeholder="0"
                            className="w-full h-9 bg-[#2C2C2E] rounded-lg text-center text-white font-semibold focus:bg-[#3A3A3C] focus:outline-none transition-colors"
                          />
                        </div>
                        <div className="col-span-2 flex justify-center">
                          <button
                            onClick={() =>
                              updateSet(exIndex, setIndex, "completed", !set.completed)
                            }
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${set.completed ? "bg-green-500 text-black shadow-[0_0_10px_rgba(34,197,94,0.3)]" : "bg-white/10 text-gray-500"}`}
                          >
                            <CheckCircle2 size={18} />
                          </button>
                        </div>
                        <div className="col-span-1 flex justify-center">
                          <button
                            onClick={() => removeSet(exIndex, setIndex)}
                            className="p-2 text-gray-600 hover:text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </>
                    ) : (
                      // Strength Input Row
                      <>
                        <div className="col-span-2 flex justify-center relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTypeSelector(
                                activeTypeSelector?.exIndex === exIndex &&
                                  activeTypeSelector?.setIndex === setIndex
                                  ? null
                                  : { exIndex, setIndex },
                              );
                            }}
                            className={`text-[10px] w-full h-[26px] flex items-center justify-center rounded font-bold uppercase transition-colors
                          ${
                            set.type === "top_set"
                              ? "bg-red-500/20 text-red-500"
                              : set.type === "back_off"
                                ? "bg-orange-500/20 text-orange-400"
                                : set.type === "warmup"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-blue-500/20 text-blue-400"
                          }`}
                          >
                            {getSetTypeLabel(set.type)}
                          </button>

                          {/* Custom Picker Dropdown */}
                          {activeTypeSelector?.exIndex === exIndex &&
                            activeTypeSelector?.setIndex === setIndex && (
                              <div className="absolute top-full left-0 mt-1 w-full min-w-full bg-[#2C2C2E] border border-white/10 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.5)] z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100">
                                <button
                                  onClick={() => {
                                    updateSet(exIndex, setIndex, "type", "warmup");
                                    setActiveTypeSelector(null);
                                  }}
                                  className="w-full flex items-center justify-center gap-2 py-2.5 border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors"
                                >
                                  <span className="text-[10px] text-yellow-500 font-bold">
                                    {t("typeWarm")}
                                  </span>
                                </button>
                                <button
                                  onClick={() => {
                                    updateSet(exIndex, setIndex, "type", "top_set");
                                    setActiveTypeSelector(null);
                                  }}
                                  className="w-full flex items-center justify-center gap-2 py-2.5 border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors"
                                >
                                  <span className="text-[10px] text-red-500 font-bold">
                                    {t("typeTop")}
                                  </span>
                                </button>
                                <button
                                  onClick={() => {
                                    updateSet(exIndex, setIndex, "type", "back_off");
                                    setActiveTypeSelector(null);
                                  }}
                                  className="w-full flex items-center justify-center gap-2 py-2.5 border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors"
                                >
                                  <span className="text-[10px] text-orange-500 font-bold">
                                    {t("typeBack")}
                                  </span>
                                </button>
                                <button
                                  onClick={() => {
                                    updateSet(exIndex, setIndex, "type", "working");
                                    setActiveTypeSelector(null);
                                  }}
                                  className="w-full flex items-center justify-center gap-2 py-2.5 border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors"
                                >
                                  <span className="text-[10px] text-blue-500 font-bold">
                                    {t("typeWork")}
                                  </span>
                                </button>
                              </div>
                            )}
                        </div>
                        <div className="col-span-3">
                          <input
                            type="number"
                            value={set.weight}
                            onChange={(e) => updateSet(exIndex, setIndex, "weight", e.target.value)}
                            placeholder="0"
                            className="w-full h-9 bg-[#2C2C2E] rounded-lg text-center text-white font-semibold focus:bg-[#3A3A3C] focus:outline-none transition-colors"
                          />
                        </div>
                        <div className="col-span-3">
                          <input
                            type="number"
                            value={set.reps}
                            onChange={(e) => updateSet(exIndex, setIndex, "reps", e.target.value)}
                            placeholder="0"
                            className="w-full h-9 bg-[#2C2C2E] rounded-lg text-center text-white font-semibold focus:bg-[#3A3A3C] focus:outline-none transition-colors"
                          />
                        </div>
                        <div className="col-span-2 flex justify-center">
                          <button
                            onClick={() =>
                              updateSet(exIndex, setIndex, "completed", !set.completed)
                            }
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${set.completed ? "bg-green-500 text-black shadow-[0_0_10px_rgba(34,197,94,0.3)]" : "bg-white/10 text-gray-500"}`}
                          >
                            <CheckCircle2 size={18} />
                          </button>
                        </div>
                        <div className="col-span-2 flex justify-center">
                          <button
                            onClick={() => removeSet(exIndex, setIndex)}
                            className="p-2 text-gray-600 hover:text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}

                <button
                  onClick={() => addSet(exIndex)}
                  className="w-full py-3 mt-2 text-[14px] font-medium text-[#007AFF] bg-blue-500/10 hover:bg-blue-500/20 rounded-[12px] transition-colors flex items-center justify-center gap-1"
                >
                  <Plus size={16} /> {t("addSet")}
                </button>
              </div>
            </div>
          ))
        )}

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full py-4 rounded-[20px] border-2 border-dashed border-[#2C2C2E] text-gray-500 font-medium hover:border-gray-600 hover:text-gray-300 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          {t("addExercise")}
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-black/90 backdrop-blur-xl border-t border-white/10 safe-bottom">
        <button
          onClick={handleFinish}
          disabled={isSaving || activeExercises.length === 0}
          className="w-full h-[56px] bg-[#007AFF] rounded-[28px] font-bold text-[20px] text-white flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? t("saving") : workoutId ? "수정 완료" : t("finish")}
        </button>
      </div>

      {/* Exercise Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#1C1C1E] animate-in slide-in-from-bottom duration-300">
          {selectedExerciseForAdd ? (
            // Scheme Selection Step
            <div className="flex-1 flex flex-col p-6">
              <div className="flex items-center gap-4 mb-8">
                <button
                  onClick={() => setSelectedExerciseForAdd(null)}
                  className="p-2 -ml-2 text-gray-400"
                >
                  <ArrowLeft size={24} />
                </button>
                <div>
                  <div className="text-xl font-bold text-white max-w-[250px] truncate">
                    {selectedExerciseForAdd.name}
                  </div>
                  <div className="text-sm text-gray-500">{t("schemeTitle")}</div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => handleAddExercise("straight")}
                  className="w-full p-5 bg-[#2C2C2E] hover:bg-[#3A3A3C] rounded-2xl flex items-center justify-between group transition-colors"
                >
                  <div className="text-left">
                    <div className="text-lg font-bold text-white mb-1">{t("schemeStraight")}</div>
                    <div className="text-sm text-gray-400">{t("schemeStraightDesc")}</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#007AFF]">
                    <Plus size={20} className="text-white" />
                  </div>
                </button>

                <button
                  onClick={() => handleAddExercise("top_backoff")}
                  className="w-full p-5 bg-[#2C2C2E] hover:bg-[#3A3A3C] rounded-2xl flex items-center justify-between group transition-colors"
                >
                  <div className="text-left">
                    <div className="text-lg font-bold text-[#FFD60A] mb-1">
                      {t("schemeTopBack")}
                    </div>
                    <div className="text-sm text-gray-400">{t("schemeTopBackDesc")}</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#FFD60A]">
                    <Plus size={20} className="text-white group-hover:text-black" />
                  </div>
                </button>
              </div>
            </div>
          ) : (
            // List Step
            <>
              <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
                <span className="font-bold text-[17px]">{t("selectExercise")}</span>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 bg-[#2C2C2E] rounded-full text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              {/* Categories */}
              <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-[15px] font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? "bg-white text-black"
                        : "bg-[#2C2C2E] text-gray-400"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="flex-1 overflow-y-auto px-4 pb-10">
                <div className="space-y-1">
                  {filteredExercises.map((exercise) => (
                    <button
                      key={exercise.id}
                      onClick={() => setSelectedExerciseForAdd(exercise)}
                      className="w-full py-4 flex items-center justify-between border-b border-white/5 text-left group"
                    >
                      <div>
                        <div className="text-[17px] font-medium text-white group-hover:text-[#007AFF] transition-colors">
                          {exercise.name}
                        </div>
                        <div className="text-[13px] text-gray-500">
                          {exercise.target_part} · {exercise.category}
                        </div>
                      </div>
                      <Plus size={20} className="text-gray-600 group-hover:text-[#007AFF]" />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
