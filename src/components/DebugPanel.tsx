"use client";

import { useMandalartStore } from "@/store/mandalartStore";
import { Database } from "@/types/supabase";
import { v4 as uuidv4 } from "uuid";

type Node = Database["public"]["Tables"]["nodes"]["Row"];

export const DebugPanel = () => {
  const setNodes = useMandalartStore((state) => state.setNodes); // Use selector for specific action
  const nodes = useMandalartStore((state) => state.nodes);

  const initMockData = () => {
    const newNodes: Node[] = [];
    const projectId = uuidv4();

    // 1. Core Node
    const coreId = uuidv4();
    newNodes.push({
      id: coreId,
      project_id: projectId,
      parent_id: null,
      position: 4,
      level: 0,
      content: "2026 성공",
      note: null,
      status: "todo",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      completed_at: null,
    });

    // 2. Sub Nodes (8)
    const subIds: string[] = [];
    for (let i = 0; i < 9; i++) {
      if (i === 4) continue;
      const subId = uuidv4();
      subIds.push(subId);
      newNodes.push({
        id: subId,
        project_id: projectId,
        parent_id: coreId,
        position: i,
        level: 1,
        content: `Sub Goal ${i}`,
        note: null,
        status: "todo",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        completed_at: null,
      });

      // 3. Action Nodes (8 per Sub)
      for (let j = 0; j < 9; j++) {
        if (j === 4) continue;
        newNodes.push({
          id: uuidv4(),
          project_id: projectId,
          parent_id: subId,
          position: j,
          level: 2,
          content: `Action ${i}-${j}`,
          note: null,
          status: "todo",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          completed_at: null,
        });
      }
    }

    setNodes(newNodes);
  };

  return (
    <div className="fixed top-20 left-4 z-50 bg-black/80 text-white p-4 rounded-lg text-xs">
      <h3 className="font-bold mb-2">Debug Panel</h3>
      <p className="mb-2">Total Nodes: {nodes.length}</p>
      <button
        onClick={initMockData}
        className="bg-primary text-black px-3 py-1 rounded hover:bg-primary/80"
      >
        Initialize Mock Data
      </button>
    </div>
  );
};
