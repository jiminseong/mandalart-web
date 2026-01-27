"use client";

import React, { useMemo } from "react";
import { useMandalartStore } from "@/store/mandalartStore";
import { Cell } from "./Cell";
import { cn } from "@/utils/cn";
import { Database } from "@/types/supabase";
import { ArrowLeft, ZoomOut } from "lucide-react";
import { useTranslations } from "next-intl";

type Node = Database["public"]["Tables"]["nodes"]["Row"];

// Helper to get nodes mapped by position 0-8
const getNodesByPosition = (nodes: Node[]) => {
  const map: Record<number, Node> = {};
  nodes.forEach((node) => {
    map[node.position] = node;
  });
  return map;
};

export const MandalartGrid = () => {
  const t = useTranslations("editor");
  const nodes = useMandalartStore((state) => state.nodes);
  const selectedNodeId = useMandalartStore((state) => state.selectedNodeId);
  const setSelectedNodeId = useMandalartStore((state) => state.setSelectedNodeId);
  const zoomedNodeId = useMandalartStore((state) => state.zoomedNodeId);
  const setZoomedNodeId = useMandalartStore((state) => state.setZoomedNodeId);

  // Parse Data Structure
  const { coreNode, subNodesMap, actionNodesMap } = useMemo(() => {
    const core = nodes.find((n) => n.level === 0);
    const subs = nodes.filter((n) => n.level === 1);
    const actions = nodes.filter((n) => n.level === 2);

    const subNodesMap = getNodesByPosition(subs);
    const actionNodesMap: Record<string, Record<number, Node>> = {};

    subs.forEach((sub) => {
      const subActions = actions.filter((a) => a.parent_id === sub.id);
      actionNodesMap[sub.id] = getNodesByPosition(subActions);
    });

    return { coreNode: core, subNodesMap, actionNodesMap };
  }, [nodes]);

  // Determine which block to show in Zoomed Mode
  const zoomedBlockIndex = useMemo(() => {
    if (!zoomedNodeId) return null;
    const subNode = Object.values(subNodesMap).find((n) => n.id === zoomedNodeId);
    if (subNode) return subNode.position;

    if (coreNode && coreNode.id === zoomedNodeId) return 4;

    return null;
  }, [zoomedNodeId, subNodesMap, coreNode]);

  // Render a single 3x3 block
  const renderBlock = (blockIndex: number, isZoomedView = false) => {
    const isCenterBlock = blockIndex === 4;

    // Determine the "Center Identity" of this block
    let centerNode: Node | undefined;
    let surroundingNodes: Record<number, Node> = {};

    if (isCenterBlock) {
      centerNode = coreNode;
      surroundingNodes = subNodesMap;
    } else {
      // For outer blocks, the center is the Sub Node at this position in the Core Grid
      centerNode = subNodesMap[blockIndex];
      // Surrounding are its children
      if (centerNode) {
        surroundingNodes = actionNodesMap[centerNode.id] || {};
      }
    }

    return (
      <div
        key={blockIndex}
        className={cn(
          "grid grid-cols-3 gap-1 p-1 rounded-xl transition-all duration-300 relative",
          isZoomedView
            ? "w-full h-full gap-2 p-4 bg-white dark:bg-slate-900 shadow-none border-0"
            : isCenterBlock
              ? "bg-white dark:bg-slate-900 shadow-xl z-10 scale-[1.02] ring-1 ring-slate-200 dark:ring-slate-700"
              : "bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer group/block",
        )}
        onClick={() => {
          // New Interaction 1: Click Outer Block to Zoom In
          if (!isZoomedView && !isCenterBlock && centerNode) {
            setZoomedNodeId(centerNode.id);
          }
        }}
      >
        {/* Hover Hint for Outer Blocks */}
        {!isZoomedView && !isCenterBlock && centerNode && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/block:opacity-100 transition-opacity pointer-events-none z-20">
            <div className="bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
              <ZoomOut size={12} className="rotate-180" />
              {t("zoomIn")}
            </div>
          </div>
        )}

        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((cellPos) => {
          const isCellCenter = cellPos === 4;
          let node: Node | undefined;

          if (isCellCenter) {
            node = centerNode;
          } else {
            node = surroundingNodes[cellPos];
          }

          const isSelected = node && node.id === selectedNodeId;

          const handleZoom = () => {
            if (isZoomedView) {
              setZoomedNodeId(null);
            } else if (node) {
              setZoomedNodeId(node.id);
            }
          };

          return (
            <Cell
              key={`${blockIndex}-${cellPos}`}
              position={cellPos}
              node={node}
              isCenter={isCellCenter}
              isActive={!!isSelected}
              onZoom={
                // Show Zoom Icon logic...
                (!isZoomedView &&
                  ((isCenterBlock && !isCellCenter) || (!isCenterBlock && isCellCenter))) ||
                (isZoomedView && isCellCenter)
                  ? handleZoom
                  : undefined
              }
              isZoomed={isZoomedView}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation(); // Essential!

                if (isZoomedView) {
                  if (node) setSelectedNodeId(node.id);
                } else {
                  if (isCenterBlock) {
                    if (isCellCenter) {
                      if (node) setSelectedNodeId(node.id);
                    } else {
                      if (node) setZoomedNodeId(node.id);
                    }
                  } else {
                    // For outer blocks, we generally want to Zoom In on click anywhere,
                    // but if they clicked a specific cell that has content, wait..
                    // Actually, UX-wise, clicking ANYWHERE in an Outer Block (Overview) should Zoom In first.
                    // Editing directly from Overview is too small.
                    if (centerNode) setZoomedNodeId(centerNode.id);
                  }
                }
              }}
              className={cn(
                // Style adjustments
                isCenterBlock && isCellCenter && "bg-primary text-black font-black text-sm",
                isCenterBlock && !isCellCenter && "font-bold",
                !isCenterBlock && isCellCenter && "font-bold bg-slate-100 dark:bg-slate-800",
                isZoomedView && "text-sm sm:text-base",
                isZoomedView && isCellCenter && "text-lg sm:text-xl",
              )}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overscroll-none">
      {/* Zoom Mode Header (Floating) */}
      {zoomedBlockIndex !== null && (
        <div className="absolute top-4 z-20 flex justify-center w-full pointer-events-none">
          <button
            onClick={() => setZoomedNodeId(null)}
            className="pointer-events-auto flex items-center gap-2 px-6 py-3 bg-white/95 dark:bg-slate-800 text-slate-900 dark:text-white shadow-xl rounded-full text-sm font-bold border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all animate-in slide-in-from-top-4 fade-in z-50 hover:scale-105 active:scale-95"
          >
            <ArrowLeft size={16} />
            전체 보기
          </button>
        </div>
      )}

      {/* Main Container */}
      {zoomedBlockIndex !== null ? (
        // Zoomed View: Fit to screen, no scroll needed usually
        <div className="w-full h-full flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300 p-4">
          <div className="w-full aspect-square max-w-[500px]">
            {renderBlock(zoomedBlockIndex, true)}
          </div>
        </div>
      ) : (
        // Overview: Scrollable on mobile
        <div className="w-full h-full overflow-auto flex items-center lg:justify-center p-4 custom-scrollbar">
          <div className="min-w-[600px] min-h-[600px] w-full max-w-[800px] aspect-square mx-auto relative">
            <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full h-full">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => renderBlock(i))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
