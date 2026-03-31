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
  const [note, setNote] = useState(() => node.note || "");

  const handleSave = () => {
    const isNewContent = node.content !== content;
    const filledCountTotal = nodes.filter((n) => n.content && n.content.trim().length > 0).length;

    updateNodeContent(node.id, content, note);

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

  const isCore = node.level === 0;
  const isSub = node.level === 1;

  // Editorial Style Mapping
  const levelStyle = isCore
    ? "text-growth border-growth"
    : isSub
      ? "text-focus border-focus"
      : "text-text-primary border-border";

  const tagLabel = isCore ? t("coreGoal") : isSub ? t("subGoal") : t("actionPlan");

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
          // Mobile: Bottom Sheet
          "bottom-0 left-0 right-0 rounded-t-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] border-t border-border max-h-[85vh]",
          // Desktop: Right Side Panel
          "lg:top-4 lg:bottom-4 lg:right-4 lg:left-auto lg:w-[420px] lg:h-auto lg:max-h-[calc(100vh-2rem)] lg:rounded-3xl lg:border lg:border-border lg:shadow-xl",
        )}
      >
        {/* Header */}
        <div className="flex-none flex items-center justify-between px-8 py-6 border-b border-border/40">
          <div className="flex flex-col">
            <span
              className={cn(
                "text-[10px] font-bold uppercase tracking-widest mb-1",
                isCore ? "text-growth" : isSub ? "text-focus" : "text-text-secondary",
              )}
            >
              {tagLabel}
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-text-primary font-sans">
              {t("defineGoal")}
            </h2>
          </div>
          <button
            onClick={() => setSelectedNodeId(null)}
            className="p-2 hover:bg-border/20 rounded-full transition-colors text-text-secondary"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
          {/* Main Content Input */}
          <div className="space-y-4">
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest">
              {t("goalTitleLabel")}
            </label>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("goalTitlePlaceholder")}
              className={cn(
                "w-full text-2xl md:text-3xl font-bold bg-transparent border-b-2 outline-none py-2 placeholder:text-text-secondary/45 transition-colors font-sans",
                levelStyle,
                "focus:border-text-primary",
              )}
              autoFocus
            />
          </div>

          {/* Note Input */}
          <div className="space-y-4">
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest">
              {t("detailsLabel")}
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t("detailsPlaceholder")}
              rows={8}
              className="w-full text-base leading-relaxed bg-surface/50 p-4 rounded-xl border border-border/50 focus:border-text-primary outline-none transition-all resize-none placeholder:text-text-secondary/60 text-text-primary font-sans"
            />
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
