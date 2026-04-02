"use client";

import React, { useState } from "react";
import { useMandalartStore } from "@/store/mandalartStore";
import { X, ArrowRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { analytics } from "@/utils/gtm";
import { useTranslations } from "next-intl";
import { Database } from "@/types/supabase";

type Node = Database["public"]["Tables"]["nodes"]["Row"];

const getNodeSection = (level: number) => {
  if (level === 0) return "center";
  if (level === 1) return "core8";
  return "actions64";
};

export const NodeEditor = () => {
  const selectedNodeId = useMandalartStore((state) => state.selectedNodeId);
  const getNode = useMandalartStore((state) => state.getNode);

  const node = selectedNodeId ? getNode(selectedNodeId) : null;

  if (!selectedNodeId || !node) return null;

  return <NodeEditorPanel key={node.id} node={node} />;
};

function NodeEditorPanel({ node }: { node: Node }) {
  const t = useTranslations("editor");
  const setSelectedNodeId = useMandalartStore((state) => state.setSelectedNodeId);
  const updateNodeContent = useMandalartStore((state) => state.updateNodeContent);
  const nodes = useMandalartStore((state) => state.nodes);

  const [content, setContent] = useState(() => node.content || "");

  const handleSave = () => {
    const isNewContent = node.content !== content;
    const filledCountTotal = nodes.filter((n) => n.content && n.content.trim().length > 0).length;

    updateNodeContent(node.id, content);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSave();
    }
  };

  const isCore = node.level === 0;
  const isSub = node.level === 1;
  const sectionLabel = isCore ? t("coreGoal") : isSub ? t("subGoal") : t("actionPlan");

  // Editorial Style Mapping
  const levelStyle = isCore
    ? "text-growth border-growth"
    : isSub
      ? "text-focus border-focus"
      : "text-text-primary border-border";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-text-primary/10 backdrop-blur-[2px] z-40 transition-opacity"
        onClick={() => setSelectedNodeId(null)}
      />

      {/* Editor Panel (Editorial Card Style) */}
      <div
        className={cn(
          "fixed z-50 bg-base transition-transform duration-300 ease-out flex flex-col",
          "bottom-0 left-0 right-0 rounded-t-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] border-t border-border max-h-[88vh]",
          // Keep the same bottom-sheet interaction on larger screens.
          "sm:left-1/2 sm:right-auto sm:w-full sm:max-w-[460px] sm:-translate-x-1/2",
        )}
      >
        {/* Header */}
        <div className="flex-none flex items-center justify-between px-5 py-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
              {sectionLabel}
            </p>
          </div>
          <button
            onClick={() => setSelectedNodeId(null)}
            className="p-2 hover:bg-border/20 rounded-full transition-colors text-text-secondary"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6 sm:px-7">
          {/* Main Content Input */}
          <div className="space-y-3">
            <div
              className={cn(
                "overflow-hidden rounded-[24px] border bg-surface/70 shadow-[0_20px_60px_-48px_rgba(0,0,0,0.25)] backdrop-blur-sm transition-colors",
                levelStyle,
                "focus-within:border-text-primary",
              )}
            >
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("goalTitlePlaceholder")}
                rows={6}
                className={cn(
                  "min-h-[176px] w-full resize-none bg-transparent px-5 py-4 font-sans text-[17px] font-medium leading-7 outline-none transition-colors md:text-[19px]",
                  "placeholder:text-text-secondary/45",
                  isCore ? "text-growth" : isSub ? "text-focus" : "text-text-primary",
                )}
                autoFocus
              />
            </div>
          </div>

          {/* Mobile Safe Area */}
          <div className="h-12 lg:hidden" />
        </div>

        {/* Footer */}
        <div className="flex-none p-6 border-t border-border/40 bg-base/50 backdrop-blur-sm rounded-b-3xl">
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedNodeId(null)}
              className="flex-1 py-4 text-sm font-bold text-text-secondary hover:text-text-primary transition-colors uppercase tracking-widest"
            >
              {t("cancel")}
            </button>
            <button
              onClick={handleSave}
              className="flex flex-[2] items-center justify-center gap-2 rounded-full bg-text-primary py-4 text-sm font-bold text-accent-contrast shadow-lg shadow-black/5 transition-all hover:-translate-y-0.5 hover:bg-text-secondary"
            >
              <span>{t("saveGoal")}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
