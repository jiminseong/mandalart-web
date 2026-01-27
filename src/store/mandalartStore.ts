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
  setSelectedNodeId: (id: string | null) => void;
  setZoomedNodeId: (id: string | null) => void;

  // Computed / Selectors (implemented as helper functions in components usually,
  // but we can put basic finders here if needed, or keeping state minimal is better)
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

        updateNodeStatus: (nodeId, status) =>
          set((state) => ({
            nodes: state.nodes.map((node) =>
              node.id === nodeId ? { ...node, status, updated_at: new Date().toISOString() } : node,
            ),
          })),

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
