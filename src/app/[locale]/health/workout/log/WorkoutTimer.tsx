"use client";

import { useState, useEffect } from "react";
import { Timer, X, Play, Pause, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

type TimerState = {
  duration: number; // total seconds (initial set time)
  remaining: number; // current seconds left
  endTime: Date;
  isPaused: boolean;
  isFinished?: boolean;
};

// Presets in seconds
const PRESETS = [60, 75, 90, 105, 120, 150, 180];

export default function WorkoutTimer() {
  const t = useTranslations("health.timer");
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [timerState, setTimerState] = useState<TimerState | null>(null);

  // Custom Input State
  const [customMin, setCustomMin] = useState<string>("");
  const [customSec, setCustomSec] = useState<string>("");

  // Timer Tick Effect
  useEffect(() => {
    if (!timerState || timerState.isPaused || timerState.isFinished) return;

    const interval = setInterval(() => {
      setTimerState((prev) => {
        if (!prev) return null;
        if (prev.isPaused || prev.isFinished) return prev;

        const now = new Date();
        const left = Math.ceil((prev.endTime.getTime() - now.getTime()) / 1000);

        if (left <= 0) {
          // Timer Finished
          return { ...prev, remaining: 0, isFinished: true };
        }

        return { ...prev, remaining: left };
      });
    }, 200);

    return () => clearInterval(interval);
  }, [timerState?.isPaused, timerState?.isFinished]);

  const startTimer = (seconds: number) => {
    const now = new Date();
    const end = new Date(now.getTime() + seconds * 1000);
    setTimerState({
      duration: seconds,
      remaining: seconds,
      endTime: end,
      isPaused: false,
      isFinished: false,
    });
    setIsSelectorOpen(false); // Close selector
  };

  const togglePause = () => {
    setTimerState((prev) => {
      if (!prev) return null;
      if (prev.isPaused) {
        // Resume: Recalculate endTime based on remaining
        const now = new Date();
        const end = new Date(now.getTime() + prev.remaining * 1000);
        return { ...prev, isPaused: false, endTime: end };
      } else {
        // Pause
        return { ...prev, isPaused: true };
      }
    });
  };

  const cancelTimer = () => {
    setTimerState(null);
  };

  const handleCustomStart = () => {
    const m = parseInt(customMin || "0", 10);
    const s = parseInt(customSec || "0", 10);
    const total = m * 60 + s;
    if (total > 0) {
      startTimer(total);
      setCustomMin("");
      setCustomSec("");
    }
  };

  // Helper to format remaining time MM:SS
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Helper for End Time display
  const formatEndTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Progress percentage for Circle
  const progress = timerState
    ? ((timerState.duration - timerState.remaining) / timerState.duration) * 100
    : 0;

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (progress / 100) * circumference;

  // Render Preset Label (e.g., 1분 15초 / 1m 15s)
  const renderPresetLabel = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    const parts = [];
    if (m > 0) parts.push(`${m}${t("unitMin")}`);
    if (s > 0) parts.push(`${s}${t("unitSec")}`);
    return parts.join(" ");
  };

  return (
    <>
      <button
        onClick={() => setIsSelectorOpen(true)}
        className="p-2 -mr-2 text-gray-500 hover:text-white transition-colors"
      >
        <Timer className="w-6 h-6" />
      </button>

      {/* Selector Modal */}
      {isSelectorOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsSelectorOpen(false)}
          />
          <div className="relative bg-[#1C1C1E] w-full max-w-sm rounded-[24px] shadow-2xl border border-white/10 overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <h3 className="font-bold text-lg text-white">{t("title")}</h3>
              <button
                onClick={() => setIsSelectorOpen(false)}
                className="p-1 -mr-1 text-gray-400 hover:text-white rounded-full hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              {/* Presets Grid */}
              <div className="grid grid-cols-3 gap-3">
                {PRESETS.map((seconds) => (
                  <button
                    key={seconds}
                    onClick={() => startTimer(seconds)}
                    className="flex flex-col items-center justify-center py-3 px-2 rounded-xl bg-[#2C2C2E] hover:bg-[#3A3A3C] text-gray-300 hover:text-white border border-white/5 hover:border-white/10 transition-all active:scale-95"
                  >
                    <span className="font-semibold text-sm">{renderPresetLabel(seconds)}</span>
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <div className="pt-2 pb-6">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {t("customSetup")}
                </label>
                <div className="flex items-end gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={customMin}
                      onChange={(e) => setCustomMin(e.target.value)}
                      placeholder="0"
                      className="w-full px-1 py-3 text-center text-2xl font-bold text-white bg-[#2C2C2E] border border-white/10 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-gray-600"
                    />
                    <span className="absolute right-3 bottom-3.5 text-xs text-gray-500 font-medium pointer-events-none">
                      {t("placeholderMin")}
                    </span>
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={customSec}
                      onChange={(e) => setCustomSec(e.target.value)}
                      placeholder="0"
                      className="w-full px-1 py-3 text-center text-2xl font-bold text-white bg-[#2C2C2E] border border-white/10 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-gray-600"
                    />
                    <span className="absolute right-3 bottom-3.5 text-xs text-gray-500 font-medium pointer-events-none">
                      {t("placeholderSec")}
                    </span>
                  </div>
                  <button
                    onClick={handleCustomStart}
                    disabled={!customMin && !customSec}
                    className="w-full flex-1 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-[#2C2C2E] disabled:text-gray-600 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
                  >
                    {t("start")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Running Timer Overlay */}
      {timerState && (
        <>
          {timerState.isFinished ? (
            <div
              className="fixed inset-0 z-[9999] bg-blue-600 flex flex-col items-center justify-center animate-pulse cursor-pointer"
              onClick={() => setTimerState(null)}
            >
              <div className="text-white text-6xl font-black tracking-tighter">
                {t("finishedTitle")}
              </div>
              <div className="text-white/80 mt-4 text-xl font-medium mb-10">
                {t("finishedDesc")}
              </div>
            </div>
          ) : (
            <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center">
              {/* Progress Circle & Time */}
              <div className="relative mb-20">
                {/* Background Circle */}
                <svg className="transform -rotate-90 w-80 h-80">
                  <circle
                    stroke="currentColor"
                    fill="transparent"
                    strokeWidth="8"
                    r={radius}
                    cx="160"
                    cy="160"
                    className="text-gray-800"
                  />
                  <circle
                    stroke="currentColor"
                    fill="transparent"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    r={radius}
                    cx="160"
                    cy="160"
                    className="text-blue-500 transition-all duration-200 ease-linear"
                  />
                </svg>

                {/* Time Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-7xl font-mono font-bold text-white tracking-tighter tabular-nums">
                    {formatTime(timerState.remaining)}
                  </div>
                  <div className="text-gray-400 mt-2 font-medium">
                    {formatEndTime(timerState.endTime)}
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              {timerState.isPaused && (
                <div className="absolute top-1/4 px-4 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-full">
                  <span className="text-yellow-500 font-bold text-sm tracking-wide uppercase">
                    {t("paused")}
                  </span>
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center gap-12">
                <button
                  onClick={cancelTimer}
                  className="w-20 h-20 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-300 hover:text-white transition-all ring-2 ring-transparent hover:ring-gray-600"
                >
                  <div className="flex flex-col items-center gap-1">
                    <X className="w-8 h-8" />
                    <span className="text-xs font-medium">{t("cancel")}</span>
                  </div>
                </button>

                <button
                  onClick={togglePause}
                  className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                    timerState.isPaused
                      ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/50 scale-110"
                      : "bg-yellow-500 hover:bg-yellow-400 text-black shadow-lg shadow-yellow-900/20"
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    {timerState.isPaused ? (
                      <Play className="w-10 h-10 ml-1" fill="currentColor" />
                    ) : (
                      <Pause className="w-10 h-10" fill="currentColor" />
                    )}
                    <span className="text-xs font-bold uppercase mt-1">
                      {timerState.isPaused ? t("resume") : t("pause")}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
