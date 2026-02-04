"use client";

import { useState, useEffect } from "react";
import { Timer, X } from "lucide-react";

type TimerState = {
  duration: number; // total seconds
  remaining: number;
  endTime: Date;
  isPaused: boolean;
};

export default function WorkoutTimer() {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [timerState, setTimerState] = useState<TimerState | null>(null);
  const [customMinutes, setCustomMinutes] = useState("");
  const [customSeconds, setCustomSeconds] = useState("");

  // Preset options in seconds
  const presets = [
    { label: "1분", seconds: 60 },
    { label: "1분 15초", seconds: 75 },
    { label: "1분 30초", seconds: 90 },
    { label: "1분 45초", seconds: 105 },
    { label: "2분", seconds: 120 },
    { label: "2분 15초", seconds: 135 },
    { label: "2분 30초", seconds: 150 },
    { label: "2분 45초", seconds: 165 },
    { label: "3분", seconds: 180 },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerState && !timerState.isPaused && timerState.remaining > 0) {
      interval = setInterval(() => {
        setTimerState((prev) => {
          if (!prev) return null;
          if (prev.remaining <= 1) {
            // Timer Finished
            return null; // Or show finished state
          }
          return { ...prev, remaining: prev.remaining - 1 };
        });
      }, 1000);
    } else if (timerState && timerState.remaining <= 0) {
      setTimerState(null);
    }

    return () => clearInterval(interval);
  }, [timerState?.isPaused, timerState?.remaining]);

  const startTimer = (seconds: number) => {
    const now = new Date();
    const end = new Date(now.getTime() + seconds * 1000);
    setTimerState({
      duration: seconds,
      remaining: seconds,
      endTime: end,
      isPaused: false,
    });
    setIsSelectorOpen(false);
  };

  const cancelTimer = () => setTimerState(null);
  const togglePause = () =>
    setTimerState((prev) =>
      prev
        ? {
            ...prev,
            isPaused: !prev.isPaused,
            endTime: new Date(new Date().getTime() + prev.remaining * 1000), // Update end time on resume
          }
        : null,
    );

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const formatEndTime = (date: Date) => {
    return date.toLocaleTimeString("ko-KR", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // SVG Circle Progress Logic
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const progress = timerState ? timerState.remaining / timerState.duration : 0;
  const dashoffset = circumference - progress * circumference;

  return (
    <>
      <button
        onClick={() => setIsSelectorOpen(true)}
        className="p-2 text-white/50 hover:text-blue-500 transition-colors"
      >
        <Timer size={24} />
      </button>

      {/* Selector Modal */}
      {isSelectorOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsSelectorOpen(false)}
          />
          <div className="relative w-full max-w-sm bg-[#1C1C1E] rounded-2xl overflow-hidden border border-white/10 shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-200">
            <div className="p-4 bg-[#2C2C2E] flex justify-between items-center border-b border-white/5">
              <span className="text-white font-semibold">휴식 타이머 설정</span>
              <button onClick={() => setIsSelectorOpen(false)}>
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="p-4 grid grid-cols-3 gap-3">
              {presets.map((preset) => (
                <button
                  key={preset.seconds}
                  onClick={() => startTimer(preset.seconds)}
                  className="py-3 bg-[#2C2C2E] hover:bg-[#3A3A3C] rounded-xl text-[13px] font-medium text-white transition-colors border border-white/5"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="px-4 pb-6">
              <div className="text-xs text-gray-500 mb-2 font-medium">사용자 설정</div>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="분"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  className="w-full bg-[#2C2C2E] rounded-xl h-10 px-1 text-white text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="초"
                  value={customSeconds}
                  onChange={(e) => setCustomSeconds(e.target.value)}
                  className="w-full bg-[#2C2C2E] rounded-xl h-10 px-1 text-white text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={() => {
                    const m = parseInt(customMinutes) || 0;
                    const s = parseInt(customSeconds) || 0;
                    if (m > 0 || s > 0) startTimer(m * 60 + s);
                  }}
                  className="px-1 bg-blue-500 w-full rounded-xl text-white font-bold text-sm"
                >
                  시작
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Running Timer Overlay */}
      {timerState && (
        <div className="fixed inset-0 z-[300] bg-black flex flex-col items-center justify-center">
          {/* Progress Circle & Time */}
          <div className="relative mb-20">
            {/* Background Circle */}
            <svg width="300" height="300" className="transform -rotate-90">
              <circle cx="150" cy="150" r={radius} stroke="#333" strokeWidth="12" fill="none" />
              <circle
                cx="150"
                cy="150"
                r={radius}
                stroke="#3B82F6"
                strokeWidth="12"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={dashoffset}
                strokeLinecap="round"
                className="transition-[stroke-dashoffset] duration-1000 linear"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-7xl font-extralight text-white tabular-nums tracking-tight">
                {formatTime(timerState.remaining)}
              </span>
              <div className="flex items-center gap-1.5 mt-2 text-gray-400">
                <span className="text-base font-medium">
                  {timerState && !timerState.isPaused
                    ? formatEndTime(new Date(Date.now() + timerState.remaining * 1000))
                    : "일시 정지됨"}
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="w-full max-w-xs flex justify-between px-8">
            <button
              onClick={cancelTimer}
              className="w-20 h-20 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center justify-center group active:scale-95 transition-transform"
            >
              <div className="w-[74px] h-[74px] rounded-full border-2 border-gray-600 flex items-center justify-center">
                <span className="text-gray-400 font-medium group-hover:text-white">취소</span>
              </div>
            </button>
            <button
              onClick={togglePause}
              className={`w-20 h-20 rounded-full flex items-center justify-center group active:scale-95 transition-transform ${timerState.isPaused ? "bg-blue-600" : "bg-blue-900/20 border border-blue-500/30"}`}
            >
              <div className={`w-[74px] h-[74px] rounded-full flex items-center justify-center`}>
                <span
                  className={`${timerState.isPaused ? "text-white" : "text-blue-500"} font-medium`}
                >
                  {timerState.isPaused ? "재개" : "일시 정지"}
                </span>
              </div>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
