import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Database } from "@/types/supabase";

// Define shorter types for convenience
type Node = Database["public"]["Tables"]["nodes"]["Row"];
type Project = Database["public"]["Tables"]["projects"]["Row"];

interface MandalartState {
  // Data
  project: Project | null;
  nodes: Node[];

  // UI State
  isLoading: boolean;
  selectedNodeId: string | null; // For the side panel / bottom sheet
  zoomedNodeId: string | null; // For mobile zoom-in view or focus mode

  // Actions
  setProject: (project: Project) => void;
  setNodes: (nodes: Node[]) => void;
  updateNodeContent: (nodeId: string, content: string, note?: string) => void;
  updateNodeStatus: (nodeId: string, status: Node["status"]) => void;
  initializeEmptyProject: () => void;
  setSelectedNodeId: (id: string | null) => void;
  setZoomedNodeId: (id: string | null) => void;

  // Computed / Selectors
  getNode: (id: string) => Node | undefined;
}

export const useMandalartStore = create<MandalartState>()(
  devtools(
    persist(
      (set, get) => ({
        project: null,
        nodes: [],
        isLoading: false,
        selectedNodeId: null,
        zoomedNodeId: null,

        setProject: (project) => set({ project }),

        setNodes: (nodes) => set({ nodes }),

        updateNodeContent: (nodeId, content, note) =>
          set((state) => ({
            nodes: state.nodes.map((node) =>
              node.id === nodeId
                ? {
                    ...node,
                    content,
                    note: note ?? node.note,
                    updated_at: new Date().toISOString(),
                  }
                : node,
            ),
          })),

        updateNodeStatus: (nodeId: string, status) =>
          set((state) => ({
            nodes: state.nodes.map((node) =>
              node.id === nodeId ? { ...node, status, updated_at: new Date().toISOString() } : node,
            ),
          })),

        initializeEmptyProject: () =>
          set((state) => {
            if (state.nodes.length > 0) return state;

            const newNodes: Node[] = [];
            const now = new Date().toISOString();

            // Helper to generate ID
            const generateId = () =>
              typeof crypto !== "undefined" && crypto.randomUUID
                ? crypto.randomUUID()
                : Math.random().toString(36).substring(2, 15);

            // 1. Create Core Node (Level 0)
            const coreId = generateId();
            newNodes.push({
              id: coreId,
              project_id: "local",
              level: 0,
              position: 4,
              parent_id: null,
              content: "",
              created_at: now,
              updated_at: now,
              completed_at: null,
              status: "todo",
              note: null,
            });

            // 2. Create Sub Nodes (Level 1)
            const subNodeIds: Record<number, string> = {};
            [0, 1, 2, 3, 5, 6, 7, 8].forEach((pos) => {
              const id = generateId();
              subNodeIds[pos] = id;
              newNodes.push({
                id,
                project_id: "local",
                level: 1,
                position: pos,
                parent_id: coreId,
                content: "",
                created_at: now,
                updated_at: now,
                completed_at: null,
                status: "todo",
                note: null,
              });
            });

            // 3. Create Action Nodes (Level 2)
            Object.entries(subNodeIds).forEach(([_, subId]) => {
              [0, 1, 2, 3, 5, 6, 7, 8].forEach((childPos) => {
                newNodes.push({
                  id: generateId(),
                  project_id: "local",
                  level: 2,
                  position: childPos,
                  parent_id: subId,
                  content: "",
                  created_at: now,
                  updated_at: now,
                  completed_at: null,
                  status: "todo",
                  note: null,
                });
              });
            });

            return { nodes: newNodes };
          }),

        setSelectedNodeId: (id) => set({ selectedNodeId: id }),

        setZoomedNodeId: (id) => set({ zoomedNodeId: id }),

        getNode: (id) => get().nodes.find((n) => n.id === id),
      }),
      {
        name: "mandalart-storage",
        partialize: (state) => ({
          project: state.project,
          nodes: state.nodes,
        }),
      },
    ),
  ),
);

// Selectors for Hierarchy
export const selectCoreNode = (state: MandalartState) => state.nodes.find((n) => n.level === 0);

export const selectSubNodes = (state: MandalartState) =>
  state.nodes.filter((n) => n.level === 1).sort((a, b) => a.position - b.position);

export const selectChildNodes = (parentId: string) => (state: MandalartState) =>
  state.nodes.filter((n) => n.parent_id === parentId).sort((a, b) => a.position - b.position);
