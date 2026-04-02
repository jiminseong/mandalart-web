"use client";

import React, { useMemo } from "react";
import { useMandalartStore } from "@/store/mandalartStore";
import { Cell } from "./Cell";
import { cn } from "@/utils/cn";
import { Database } from "@/types/supabase";
import { GRID_SIZE_PRESETS } from "@/utils/gridSize";

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
  const initializeEmptyProject = useMandalartStore((state) => state.initializeEmptyProject);
  const gridSizeIndex = useMandalartStore((state) => state.gridSizeIndex);

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

  const currentGridSize = GRID_SIZE_PRESETS[gridSizeIndex];

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
          isCenterBlock
            ? "relative z-10 scale-[1.02] bg-surface-strong shadow-sm ring-1 ring-border"
            : "bg-surface hover:bg-surface-strong",
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

          return (
            <Cell
              key={`${blockIndex}-${cellPos}`}
              node={node}
              isCenter={isCellCenter}
              isActive={!!isSelected}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                if (node) setSelectedNodeId(node.id);
              }}
              // Pass contextual styling
              className={cn(
                // All center cells share the same visual weight across themes.
                isCellCenter && "bg-surface font-semibold",
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
      <div className="w-full h-full overflow-auto px-6 pb-40 pt-6 md:px-8 md:pb-44 md:pt-8 custom-scrollbar">
        <div className="flex min-h-full min-w-fit items-center justify-center">
          <div
            className="aspect-square"
            data-mandalart-export-target="true"
            style={{ width: `${currentGridSize.overview}px` }}
          >
            <div className="grid grid-cols-3 gap-3 w-full h-full">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => renderBlock(i))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
