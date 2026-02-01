"use client";

import React, { useEffect, useState } from "react";
import { useMandalartStore } from "@/store/mandalartStore";
import { X, Save, Sparkles } from "lucide-react";
import { cn } from "@/utils/cn";

import { useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { createClient } from "@/utils/supabase/client";
import { analytics } from "@/utils/gtm";

const getNodeSection = (level: number) => {
  if (level === 0) return "center";
  if (level === 1) return "core8";
  return "actions64";
};

export const NodeEditor = () => {
  const router = useRouter();
  const locale = useLocale();
  const supabase = createClient();
  const selectedNodeId = useMandalartStore((state) => state.selectedNodeId);
  const setSelectedNodeId = useMandalartStore((state) => state.setSelectedNodeId);
  const getNode = useMandalartStore((state) => state.getNode);
  const updateNodeContent = useMandalartStore((state) => state.updateNodeContent);
  const nodes = useMandalartStore((state) => state.nodes);

  // Local state for smooth typing
  const [content, setContent] = useState("");
  const [note, setNote] = useState("");

  // AI State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const node = selectedNodeId ? getNode(selectedNodeId) : null;

  useEffect(() => {
    if (node) {
      setContent(node.content || "");
      setNote(node.note || "");
      setSuggestions([]); // Reset suggestions on node change
    }
  }, [node?.id]); // Only reset when selected node changes

  if (!selectedNodeId || !node) return null;

  const handleSave = () => {
    const isNewContent = node.content !== content;
    const filledCountTotal = nodes.filter((n) => n.content && n.content.trim().length > 0).length;

    updateNodeContent(selectedNodeId, content, note);

    if (isNewContent) {
      analytics.cellEdit({
        section: getNodeSection(node.level),
        cell_index: node.position,
        filled: content.trim().length > 0,
        filled_count_total: filledCountTotal,
        input_len: content.length,
      });
    }

    setSelectedNodeId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  const handleAiSuggest = async () => {
    // 1. Auth Check & Free Trial
    // const {
    //   data: { user },
    // } = await supabase.auth.getUser();

    // if (!user) {
    //   // Free Trial Logic
    //   const usedCount = Number.parseInt(localStorage.getItem("ai_free_usage_count") || "0", 10);
    //   const MAX_FREE_COUNT = 3;

    //   if (usedCount >= MAX_FREE_COUNT) {
    //     if (
    //       confirm(
    //         `무료 체험 횟수(${MAX_FREE_COUNT}회)를 모두 사용하셨습니다.\n계속하려면 로그인이 필요합니다.\n로그인 페이지로 이동하시겠습니까?`,
    //       )
    //     ) {
    //       router.push("/login", { locale });
    //     }
    //     return;
    //   }

    //   // Increment usage count for non-logged-in users
    //   localStorage.setItem("ai_free_usage_count", (usedCount + 1).toString());
    //   // Notify other components (like ProgressBar)
    //   globalThis.window.dispatchEvent(new Event("ai-usage-updated"));
    // }

    setIsAiLoading(true);
    const ai_mode = content.trim().length > 0 ? "polish" : "fill_blanks";
    analytics.aiApply({
      cell_index: node.position,
      section: getNodeSection(node.level),
      ai_mode,
    });
    try {
      // Prepare Context
      const core = nodes.find((n) => n.level === 0);
      const parent = node.parent_id ? nodes.find((n) => n.id === node.parent_id) : null;

      const context = {
        coreGoal: core?.content || "미정",
        subGoal: parent?.content || "미정",
      };

      const response = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context,
          goalLevel: node.level,
          currentContent: content,
        }),
      });

      const data = await response.json();
      if (data.suggestions) {
        setSuggestions(data.suggestions);
      }
    } catch (e) {
      console.error(e);
      setSuggestions(["AI 연결에 실패했습니다."]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const isCore = node.level === 0;
  const isSub = node.level === 1;

  const tagColorClass = isCore
    ? "bg-primary/20 text-primary-700 dark:text-primary-300"
    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400";

  const tagLabel = isCore ? "핵심 목표" : isSub ? "세부 목표" : "실행 계획";

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
          "fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-2xl rounded-t-2xl transition-transform duration-300 ease-out transform translate-y-0 flex flex-col max-h-[90vh]",
          "lg:w-[400px] lg:right-0 lg:left-auto lg:top-0 lg:bottom-0 lg:border-l lg:border-t-0 lg:rounded-none lg:h-full lg:max-h-none",
        )}
      >
        {/* Header */}
        <div className="flex-none flex items-center justify-between p-6 pb-2">
          <div>
            <span
              className={cn("text-xs font-bold px-2 py-1 rounded mb-2 inline-block", tagColorClass)}
            >
              {tagLabel}
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

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Content Input */}
          <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
              목표 내용
            </label>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="목표를 입력하세요"
              className="w-full text-lg p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400 text-slate-900 dark:text-white"
              autoFocus
            />
          </div>

          {/* Note Textarea */}
          <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
              상세 메모 (선택)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="구체적인 실천 방법이나 메모를 남기세요."
              rows={4}
              className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none placeholder:text-slate-400 text-slate-900 dark:text-white"
            />
          </div>

          {/* AI Coach Teaser */}
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex gap-3 items-start">
            <div className="bg-primary/20 p-2 rounded-lg text-primary-700 dark:text-primary">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">AI 코칭</h4>
              {!isAiLoading && suggestions.length === 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    목표 설정이 막막하신가요? AI가 적절한 목표를 추천해드립니다.
                  </p>
                  <button
                    onClick={handleAiSuggest}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    추천 받기
                  </button>
                </div>
              )}

              {isAiLoading && (
                <div className="text-xs text-slate-500 dark:text-slate-400 animate-pulse">
                  열심히 고민 중입니다...
                </div>
              )}

              {suggestions.length > 0 && (
                <div className="space-y-2 mt-2 w-full">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    마음에 드는 목표를 클릭하세요:
                  </p>
                  <div className="flex flex-col gap-2">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setContent(s);
                          analytics.aiApply({
                            cell_index: node.position,
                            section: getNodeSection(node.level),
                            suggestion_rank: i + 1,
                          });
                        }}
                        className="text-left text-xs p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-primary dark:hover:border-primary transition-colors text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Add extra padding at bottom for safe area scrolling */}
          <div className="h-24 lg:hidden"></div>
        </div>

        {/* Footer (Fixed at bottom within the sheet) */}
        <div className="flex-none p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-3 pb-8 lg:pb-6">
          <button
            onClick={() => setSelectedNodeId(null)}
            className="flex-1 py-4 rounded-xl font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className={cn(
              "flex-2 py-4 rounded-xl bg-primary text-slate-900 font-bold shadow-lg shadow-primary/20",
              "hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2",
            )}
          >
            <Save size={20} />
            저장하기
          </button>
        </div>
      </div>
    </>
  );
};
