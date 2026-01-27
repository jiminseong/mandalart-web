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

  // Render a single 3x3 block
  const renderBlock = (blockIndex: number) => {
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
          isCenterBlock
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
            // If it's the center block, surrounding cells are SUB nodes at `cellPos`
            // If it's an outer block, surrounding cells are ACTION nodes at `cellPos`
            node = surroundingNodes[cellPos];
          }

          const isSelected = node && node.id === selectedNodeId;

          return (
            <Cell
              key={`${blockIndex}-${cellPos}`}
              position={cellPos}
              node={node}
              isCenter={isCellCenter}
              isActive={!!isSelected}
              onClick={() => {
                // TODO: Handle cell click (open editor, zoom, etc.)
                if (node) setSelectedNodeId(node.id);
                console.log(`Clicked Block ${blockIndex} Cell ${cellPos}`, node);
              }}
              className={cn(
                // Style adjustments for nested grids
                isCenterBlock && isCellCenter && "bg-primary text-black font-black text-sm", // Core Goal
                isCenterBlock && !isCellCenter && "font-bold", // Sub Goals in Center
                !isCenterBlock && isCellCenter && "font-bold bg-slate-100 dark:bg-slate-800", // Sub Goals in Outer
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
      <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full h-full">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => renderBlock(i))}
      </div>
    </div>
  );
};
