export default function GoalsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 px-5 pt-2">
      <div className="space-y-1 pt-2">
        <span className="text-[13px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Target
        </span>
        <h1 className="text-[34px] leading-tight font-bold tracking-tight text-black dark:text-white">
          목표 달성
        </h1>
      </div>

      <div className="bg-[#F2F2F7] dark:bg-[#1C1C1E] rounded-[22px] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[17px] font-semibold text-black dark:text-white">
            진행 중인 목표
          </span>
          <span className="text-[15px] text-[#007AFF] font-medium">수정</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-2xl">
            💪
          </div>
          <div>
            <div className="text-[20px] font-bold text-black dark:text-white">근력 증가</div>
            <div className="text-[15px] text-gray-500">3대 운동 증량</div>
          </div>
        </div>

        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-[#007AFF] w-[10%]" />
        </div>
        <div className="flex justify-between text-[13px] font-medium text-gray-400">
          <span>시작 0kg</span>
          <span>목표 500kg</span>
        </div>
      </div>
    </div>
  );
}
