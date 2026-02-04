"use client";

import { useState } from "react";
import { ArrowLeft, Plus, X, ChevronDown, CheckCircle2, Trash2 } from "lucide-react";
import Link from "next/link";
import { saveWorkout } from "../actions";
import { useRouter } from "next/navigation";

type Exercise = {
  id: string;
  name: string;
  target_part: string;
  category: string;
};

type WorkoutSet = {
  weight: string;
  reps: string;
  completed: boolean;
};

type WorkoutExercise = Exercise & {
  sets: WorkoutSet[];
};

export default function WorkoutSession({
  exercisesList,
  locale,
}: {
  exercisesList: Exercise[];
  locale: string;
}) {
  const router = useRouter();
  const [activeExercises, setActiveExercises] = useState<WorkoutExercise[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Group exercises by part for the filter
  const categories = ["All", ...Array.from(new Set(exercisesList.map((e) => e.target_part)))];

  const handleAddExercise = (exercise: Exercise) => {
    setActiveExercises((prev) => [
      ...prev,
      { ...exercise, sets: [{ weight: "", reps: "", completed: false }] },
    ]);
    setIsModalOpen(false);
  };

  const updateSet = (
    exerciseIndex: number,
    setIndex: number,
    field: keyof WorkoutSet,
    value: string,
  ) => {
    const newExercises = [...activeExercises];
    const set = newExercises[exerciseIndex].sets[setIndex];
    // @ts-ignore
    set[field] = value;
    setActiveExercises(newExercises);
  };

  const addSet = (exerciseIndex: number) => {
    const newExercises = [...activeExercises];
    const previousSet =
      newExercises[exerciseIndex].sets[newExercises[exerciseIndex].sets.length - 1];

    newExercises[exerciseIndex].sets.push({
      weight: previousSet ? previousSet.weight : "",
      reps: previousSet ? previousSet.reps : "",
      completed: false,
    });
    setActiveExercises(newExercises);
  };

  const removeExercise = (index: number) => {
    const newExercises = [...activeExercises];
    newExercises.splice(index, 1);
    setActiveExercises(newExercises);
  };

  const handleFinish = async () => {
    if (activeExercises.length === 0) return;
    setIsSaving(true);

    // Format data for simpler JSON
    const payload = {
      exercises: activeExercises.map((e) => ({
        id: e.id,
        name: e.name,
        sets: e.sets.map((s) => ({
          weight: Number(s.weight) || 0,
          reps: Number(s.reps) || 0,
        })),
      })),
    };

    const result = await saveWorkout(payload);
    if (result.success) {
      router.push(`/${locale}/health/workout/history`);
    } else {
      alert("저장 실패");
      setIsSaving(false);
    }
  };

  const filteredExercises =
    selectedCategory === "All"
      ? exercisesList
      : exercisesList.filter((e) => e.target_part === selectedCategory);

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 safe-top bg-black z-10">
        <Link
          href={`/${locale}/health/dashboard/today`}
          className="p-2 text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <span className="font-semibold text-[17px]">오늘의 운동</span>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-40 space-y-6">
        {activeExercises.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-3xl">
              💪
            </div>
            <p className="text-[17px]">운동을 추가해주세요</p>
          </div>
        ) : (
          activeExercises.map((exercise, exIndex) => (
            <div
              key={`${exercise.id}-${exIndex}`}
              className="bg-[#1C1C1E] rounded-[22px] overflow-hidden"
            >
              <div className="px-5 py-4 flex items-center justify-between border-b border-white/5 bg-[#2C2C2E]">
                <h3 className="text-[17px] font-bold text-white">{exercise.name}</h3>
                <button
                  onClick={() => removeExercise(exIndex)}
                  className="text-gray-500 hover:text-red-500 p-1"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-10 gap-2 text-xs text-gray-500 font-medium text-center mb-1">
                  <div className="col-span-2">SET</div>
                  <div className="col-span-3">KG</div>
                  <div className="col-span-3">REPS</div>
                  <div className="col-span-2">DONE</div>
                </div>
                {exercise.sets.map((set, setIndex) => (
                  <div key={setIndex} className="grid grid-cols-10 gap-2 items-center">
                    <div className="col-span-2 flex justify-center">
                      <div className="w-6 h-6 rounded-full bg-white/10 text-[13px] flex items-center justify-center text-gray-400">
                        {setIndex + 1}
                      </div>
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
                          updateSet(exIndex, setIndex, "completed", (!set.completed).toString())
                        }
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${set.completed ? "bg-green-500 text-black" : "bg-white/10 text-gray-500"}`}
                      >
                        <CheckCircle2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => addSet(exIndex)}
                  className="w-full py-3 mt-2 text-[15px] font-medium text-[#007AFF] bg-blue-500/10 hover:bg-blue-500/20 rounded-[12px] transition-colors"
                >
                  + 세트 추가
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
          운동 추가하기
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-black/90 backdrop-blur-xl border-t border-white/10 safe-bottom">
        <button
          onClick={handleFinish}
          disabled={isSaving || activeExercises.length === 0}
          className="w-full h-[56px] bg-[#007AFF] rounded-[28px] font-bold text-[20px] text-white flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "저장 중..." : "운동 완료"}
        </button>
      </div>

      {/* Exercise Selection Modal (Full Screen Sheet style) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#1C1C1E] animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
            <span className="font-bold text-[17px]">운동 선택</span>
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
                  selectedCategory === cat ? "bg-white text-black" : "bg-[#2C2C2E] text-gray-400"
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
                  onClick={() => handleAddExercise(exercise)}
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
        </div>
      )}
    </div>
  );
}
