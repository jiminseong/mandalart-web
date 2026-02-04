export default function WorkoutHistoryPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 px-5 pt-2">
      <div className="space-y-1 pt-2">
        <h1 className="text-[34px] leading-tight font-bold tracking-tight text-black dark:text-white">
          운동 기록
        </h1>
        <p className="text-[17px] text-gray-500 dark:text-gray-400">최근 수행한 운동 로그입니다.</p>
      </div>

      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-3xl">
          📝
        </div>
        <div className="space-y-1">
          <h3 className="text-[20px] font-semibold text-black dark:text-white">기록이 없습니다</h3>
          <p className="text-[15px] text-gray-500 max-w-[200px]">
            홈 화면에서 '오늘의 운동'을 시작하여 기록을 남겨보세요.
          </p>
        </div>
      </div>
    </div>
  );
}
