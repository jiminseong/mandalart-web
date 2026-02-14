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
  const initializeEmptyProject = useMandalartStore((state) => state.initializeEmptyProject);

  // Initialize empty project if no nodes exist
  React.useEffect(() => {
    if (nodes.length === 0) {
      initializeEmptyProject();
    }
  }, [nodes.length, initializeEmptyProject]);

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
      centerNode = subNodesMap[blockIndex];
      if (centerNode) {
        surroundingNodes = actionNodesMap[centerNode.id] || {};
      }
    }

    return (
      <div
        key={blockIndex}
        className={cn(
          "grid grid-cols-3 bg-border gap-px border border-border transition-all duration-300 relative",
          isZoomedView
            ? "w-full h-full p-0 shadow-none"
            : isCenterBlock
              ? "relative z-10 scale-[1.02] shadow-sm ring-1 ring-border bg-white"
              : "bg-surface hover:bg-white cursor-pointer group/block",
        )}
        onClick={() => {
          if (!isZoomedView && !isCenterBlock && centerNode) {
            setZoomedNodeId(centerNode.id);
          }
        }}
      >
        {/* Helper Badge on Hover (only for outer blocks) */}
        {!isZoomedView && !isCenterBlock && centerNode && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/block:opacity-100 transition-opacity z-20 pointer-events-none">
            <span className="bg-text-primary text-white text-[10px] uppercase font-bold px-2 py-1 rounded-full tracking-widest shadow-lg backdrop-blur-sm flex items-center gap-1">
              <ZoomOut size={10} className="stroke-[2.5]" /> Zoom In
            </span>
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
              node={node}
              isCenter={isCellCenter}
              isActive={!!isSelected}
              onZoom={
                (!isZoomedView &&
                  ((isCenterBlock && !isCellCenter) || (!isCenterBlock && isCellCenter))) ||
                (isZoomedView && isCellCenter)
                  ? handleZoom
                  : undefined
              }
              isZoomed={isZoomedView}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
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
                    if (centerNode) setZoomedNodeId(centerNode.id);
                  }
                }
              }}
              // Pass contextual styling
              className={cn(
                // Core Center Cell (The absolute center of Mandalart)
                isCenterBlock &&
                  isCellCenter &&
                  "bg-growth text-white font-bold text-sm tracking-wide",
                // Sub Center Cells (The centers of outer blocks)
                !isCenterBlock && isCellCenter && "bg-focus/10 text-focus font-semibold",
                // Grid Lines handled by parent gap-px
                "w-full h-full aspect-square",
              )}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative bg-base overscroll-none">
      {/* Zoom Back Button */}
      {zoomedBlockIndex !== null && (
        <div className="absolute top-6 left-6 z-30">
          <button
            onClick={() => setZoomedNodeId(null)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-text-primary rounded-full text-xs font-bold border border-border shadow-sm hover:border-text-primary transition-all active:scale-95 uppercase tracking-widest"
          >
            <ArrowLeft size={14} />
            Back to Overview
          </button>
        </div>
      )}

      {/* Main Grid Container */}
      {zoomedBlockIndex !== null ? (
        // Zoomed View
        <div className="w-full h-full flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300 p-8">
          <div className="w-full max-w-[600px] aspect-square shadow-2xl shadow-black/5">
            {renderBlock(zoomedBlockIndex, true)}
          </div>
        </div>
      ) : (
        // Overview (Full 9x9 Grid)
        <div className="w-full h-full overflow-auto flex items-center lg:justify-center p-8 custom-scrollbar">
          <div className="min-w-[600px] w-full max-w-[900px] aspect-square mx-auto">
            <div className="grid grid-cols-3 gap-3 w-full h-full">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => renderBlock(i))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
