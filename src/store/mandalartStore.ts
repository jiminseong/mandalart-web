import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { MandalartNode, MandalartProject } from "@/types/mandalart";
import { DEFAULT_GRID_SIZE_INDEX, GRID_SIZE_PRESETS } from "@/utils/gridSize";
import { CELL_TEXT_SIZE_PRESETS, DEFAULT_CELL_TEXT_SIZE_INDEX } from "@/utils/textSize";
import { createEmptyMandalartNodes } from "@/utils/mandalartLink";

// Define shorter types for convenience
type Node = MandalartNode;
type Project = MandalartProject;

interface MandalartState {
  // Data
  project: Project | null;
  nodes: Node[];

  // UI State
  isLoading: boolean;
  selectedNodeId: string | null; // For the side panel / bottom sheet
  zoomedNodeId: string | null; // For mobile zoom-in view or focus mode
  gridSizeIndex: number;
  cellTextSizeIndex: number;

  // Actions
  setProject: (project: Project) => void;
  setNodes: (nodes: Node[]) => void;
  updateNodeContent: (nodeId: string, content: string, note?: string) => void;
  updateNodeStatus: (nodeId: string, status: Node["status"]) => void;
  initializeEmptyProject: () => void;
  setSelectedNodeId: (id: string | null) => void;
  setZoomedNodeId: (id: string | null) => void;
  setGridSizeIndex: (index: number) => void;
  setCellTextSizeIndex: (index: number) => void;

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
        gridSizeIndex: DEFAULT_GRID_SIZE_INDEX,
        cellTextSizeIndex: DEFAULT_CELL_TEXT_SIZE_INDEX,

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

            return { nodes: createEmptyMandalartNodes() };
          }),

        setSelectedNodeId: (id) => set({ selectedNodeId: id }),

        setZoomedNodeId: (id) => set({ zoomedNodeId: id }),

        setGridSizeIndex: (index) =>
          set({
            gridSizeIndex: Math.max(0, Math.min(GRID_SIZE_PRESETS.length - 1, index)),
          }),

        setCellTextSizeIndex: (index) =>
          set({
            cellTextSizeIndex: Math.max(0, Math.min(CELL_TEXT_SIZE_PRESETS.length - 1, index)),
          }),

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
