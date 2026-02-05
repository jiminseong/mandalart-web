"use client";

import { useRouter } from "next/navigation";

interface WorkoutCardProps {
  workout: any;
  locale: string;
}

export function WorkoutCard({ workout, locale }: WorkoutCardProps) {
  const router = useRouter();

  const handleClick = () => {
    // Navigate to workout detail/edit page
    router.push(`/${locale}/health/workout/detail/${workout.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors active:scale-[0.98]"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[17px] font-bold text-black dark:text-white">
          {new Date(workout.date).toLocaleDateString(locale, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </h3>
        <span className="text-[13px] text-gray-500">
          {workout.exercises?.length || 0} exercises
        </span>
      </div>
      <div className="space-y-2">
        {workout.exercises?.map((exercise: any, idx: number) => (
          <div key={idx} className="text-[15px] text-gray-600 dark:text-gray-400">
            <span className="font-medium text-black dark:text-white">{exercise.name}</span>
            <span className="ml-2">{exercise.sets?.length || 0} sets</span>
          </div>
        ))}
      </div>
    </div>
  );
}
