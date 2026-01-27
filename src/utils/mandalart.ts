import { Database } from "@/types/supabase";

type Node = Database["public"]["Tables"]["nodes"]["Row"];

export function createDefaultNodes(projectId: string): Node[] {
  const nodes: Node[] = [];
  const now = new Date().toISOString();

  // 1. Core Node (Level 0)
  const coreId = crypto.randomUUID();
  nodes.push({
    id: coreId,
    project_id: projectId,
    parent_id: null,
    position: 4,
    level: 0,
    content: "Mandalart",
    note: null,
    status: "todo",
    created_at: now,
    updated_at: now,
    completed_at: null,
  });

  // 2. Sub Goals (Level 1)
  const subGoalIds: string[] = [];
  for (let i = 0; i < 9; i++) {
    if (i === 4) {
      subGoalIds.push(coreId); // Placeholder for center
      continue;
    }
    const id = crypto.randomUUID();
    subGoalIds.push(id);
    nodes.push({
      id,
      project_id: projectId,
      parent_id: coreId,
      position: i,
      level: 1,
      content: `Sub Goal ${i + 1}`,
      note: null,
      status: "todo",
      created_at: now,
      updated_at: now,
      completed_at: null,
    });
  }

  // 3. Action Plans (Level 2)
  for (let i = 0; i < 9; i++) {
    if (i === 4) continue; // Core has no actions directly
    const subId = subGoalIds[i];

    for (let j = 0; j < 9; j++) {
      if (j === 4) continue; // Center of sub-block is the sub-goal itself

      nodes.push({
        id: crypto.randomUUID(),
        project_id: projectId,
        parent_id: subId,
        position: j,
        level: 2,
        content: `Action ${j + 1}`,
        note: null,
        status: "todo",
        created_at: now,
        updated_at: now,
        completed_at: null,
      });
    }
  }

  return nodes;
}
