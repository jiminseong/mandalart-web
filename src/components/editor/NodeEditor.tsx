"use client";

import React, { useEffect, useState } from "react";
import { useMandalartStore } from "@/store/mandalartStore";
import { X, Save, Sparkles, Trash2, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/utils/cn";

export const NodeEditor = () => {
  const selectedNodeId = useMandalartStore((state) => state.selectedNodeId);
  const setSelectedNodeId = useMandalartStore((state) => state.setSelectedNodeId);
  const getNode = useMandalartStore((state) => state.getNode);
  const updateNodeContent = useMandalartStore((state) => state.updateNodeContent);
  const updateNodeStatus = useMandalartStore((state) => state.updateNodeStatus);

  // Local state for smooth typing
  const [content, setContent] = useState("");
  const [note, setNote] = useState("");

  const node = selectedNodeId ? getNode(selectedNodeId) : null;

  useEffect(() => {
    if (node) {
      setContent(node.content || "");
      setNote(node.note || "");
    }
  }, [node?.id]); // Only reset when selected node changes

  if (!selectedNodeId || !node) return null;

  const handleSave = () => {
    updateNodeContent(selectedNodeId, content, note);
    setSelectedNodeId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  const isCore = node.level === 0;
  const isSub = node.level === 1;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
        onClick={() => setSelectedNodeId(null)}
      />

      {/* Sheet */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-2xl rounded-t-2xl p-6 transition-transform duration-300 ease-out transform translate-y-0",
          "lg:w-[400px] lg:right-0 lg:left-auto lg:top-0 lg:bottom-0 lg:border-l lg:border-t-0 lg:rounded-none lg:h-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span
              className={cn(
                "text-xs font-bold px-2 py-1 rounded mb-2 inline-block",
                isCore
                  ? "bg-primary/20 text-primary-700 dark:text-primary"
                  : isSub
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500",
              )}
            >
              {isCore ? "핵심 목표" : isSub ? "세부 목표" : "실행 계획"}
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">목표 설정</h2>
          </div>
          <button
            onClick={() => setSelectedNodeId(null)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6">
          {/* Content Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              목표 내용
            </label>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="목표를 입력하세요"
              className="w-full text-lg p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-300"
              autoFocus
            />
          </div>

          {/* Note Textarea */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              상세 메모 (선택)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="구체적인 실천 방법이나 메모를 남기세요."
              rows={4}
              className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none placeholder:text-slate-300"
            />
          </div>

          {/* Status Selection (Only for Action Nodes usually, but fine for all for now) */}
          <div className="flex gap-2">
            {(["todo", "in_progress", "done"] as const).map((s) => (
              <button
                key={s}
                onClick={() => {
                  updateNodeStatus(node.id, s);
                  // Update local state is not needed as it's just a trigger, but button style update relies on store subscription which is fine
                }}
                className={cn(
                  "flex-1 py-3 rounded-xl border font-bold text-sm flex items-center justify-center gap-2 transition-all",
                  node.status === s
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-lg"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800",
                )}
              >
                {s === "todo" && <Circle size={16} />}
                {s === "in_progress" && <Sparkles size={16} />}
                {s === "done" && <CheckCircle2 size={16} />}
                {s === "todo" ? "할 일" : s === "in_progress" ? "진행 중" : "완료"}
              </button>
            ))}
          </div>

          {/* AI Coach Teaser */}
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex gap-3 items-start">
            <div className="bg-primary/20 p-2 rounded-lg text-primary-700 dark:text-primary">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">AI 코칭</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                목표 설정이 막 막하신가요? AI가 적절한 목표를 추천해드립니다.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-3">
          <button
            onClick={() => setSelectedNodeId(null)}
            className="flex-1 py-4 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="flex-[2] py-4 rounded-xl bg-primary text-slate-900 font-bold shadow-lg shadow-primary/20 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Save size={20} />
            저장하기
          </button>
        </div>
      </div>
    </>
  );
};
