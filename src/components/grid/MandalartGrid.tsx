"use client";

import React, { useMemo } from "react";
import { useMandalartStore } from "@/store/mandalartStore";
import { Cell } from "./Cell";
import { cn } from "@/utils/cn";
import { Database } from "@/types/supabase";

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
          "grid grid-cols-3 gap-1 p-1 rounded-xl transition-all duration-300",
          isZoomedView
            ? "w-full h-full gap-2 p-4 bg-white dark:bg-slate-900 shadow-none border-0"
            : isCenterBlock
              ? "bg-white dark:bg-slate-900 shadow-xl z-10 scale-[1.02] ring-1 ring-slate-200 dark:ring-slate-700"
              : "bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800/50",
        )}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((cellPos) => {
          const isCellCenter = cellPos === 4;
          let node: Node | undefined;

          if (isCellCenter) {
            node = centerNode;
          } else {
            node = surroundingNodes[cellPos];
          }

          const isSelected = node && node.id === selectedNodeId;

          // Handle Zoom Logic
          const canZoom =
            !isZoomedView &&
            ((isCenterBlock && !isCellCenter && node) || // Sub Goal in Center Block
              (!isCenterBlock && isCellCenter && node)); // Sub Goal in Outer Block

          const handleZoom = () => {
            if (isZoomedView) {
              setZoomedNodeId(null);
            } else {
              if (node) setZoomedNodeId(node.id);
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
                (!isZoomedView && canZoom) || (isZoomedView && isCellCenter)
                  ? handleZoom
                  : undefined
              }
              isZoomed={isZoomedView}
              onClick={() => {
                if (node) setSelectedNodeId(node.id);
              }}
              className={cn(
                // Style adjustments for nested grids
                isCenterBlock && isCellCenter && "bg-primary text-black font-black text-sm", // Core Goal
                isCenterBlock && !isCellCenter && "font-bold", // Sub Goals in Center
                !isCenterBlock && isCellCenter && "font-bold bg-slate-100 dark:bg-slate-800", // Sub Goals in Outer
                isZoomedView && "text-sm sm:text-base", // Larger text in zoomed view
                isZoomedView && isCellCenter && "text-lg sm:text-xl", // Much larger center text
              )}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full max-w-[800px] aspect-square mx-auto p-2 sm:p-4">
      {/* Main 3x3 Grid of Blocks */}
      {zoomedBlockIndex !== null ? (
        <div className="w-full h-full flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
          <div className="w-full aspect-square max-w-[500px]">
            {renderBlock(zoomedBlockIndex, true)}
          </div>
          <div className="text-center mt-6 text-sm text-slate-400">
            <button
              onClick={() => setZoomedNodeId(null)}
              className="underline hover:text-primary transition-colors"
            >
              전체 보기로 돌아가기
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full h-full">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => renderBlock(i))}
        </div>
      )}
    </div>
  );
};
