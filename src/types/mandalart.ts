// Local Mandalart domain types.
// Previously these were derived from the generated Supabase schema
// (Database["public"]["Tables"]["nodes"]["Row"], etc.). The editor is fully
// client-side, so the shapes are kept here without any backend coupling.

export type NodeStatus = "todo" | "in_progress" | "done";

export interface MandalartNode {
  completed_at: string | null;
  content: string | null;
  created_at: string;
  id: string;
  level: number;
  note: string | null;
  parent_id: string | null;
  position: number;
  project_id: string;
  status: NodeStatus | null;
  updated_at: string;
}

export interface MandalartProject {
  created_at: string;
  id: string;
  is_public: boolean | null;
  progress: number | null;
  theme: string | null;
  title: string;
  updated_at: string;
  user_id: string;
}
