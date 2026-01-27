"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useMandalartStore } from "@/store/mandalartStore";
// import { toast } from "sonner"; // Assuming we might want toasts later, but for now console

// Debounce helper
function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: NodeJS.Timeout;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

import { createDefaultNodes } from "@/utils/mandalart";

export const AuthSyncManager = () => {
  const supabase = createClient();
  const setProject = useMandalartStore((state) => state.setProject);
  const setNodes = useMandalartStore((state) => state.setNodes);
  const nodes = useMandalartStore((state) => state.nodes);
  const project = useMandalartStore((state) => state.project);

  const nodesRef = useRef(nodes);
  const projectRef = useRef(project);

  useEffect(() => {
    nodesRef.current = nodes;
    projectRef.current = project;
  }, [nodes, project]);

  useEffect(() => {
    const initSync = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const currentNodes = nodesRef.current;

      // Case 0: No User and No Nodes -> Create defaults locally
      if (!user && currentNodes.length === 0) {
        console.log("AuthSync: New anonymous user, initializing default grid...");
        const newProjectId = crypto.randomUUID();
        const defaultNodes = createDefaultNodes(newProjectId);

        // Create a dummy project for state
        setProject({
          id: newProjectId,
          user_id: "", // None
          title: "나의 만다라트",
          is_public: false,
          progress: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          theme: null,
        } as any);

        setNodes(defaultNodes);
        return;
      }

      if (!user) return;

      console.log("AuthSync: User found", user.id);

      const { data: existingProjects } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1);

      const remoteProject = existingProjects?.[0];

      if (remoteProject) {
        console.log("AuthSync: Found remote project, syncing down...", remoteProject.id);
        const { data: remoteNodes } = await supabase
          .from("nodes")
          .select("*")
          .eq("project_id", remoteProject.id);

        if (remoteNodes && remoteNodes.length > 0) {
          setProject(remoteProject);
          setNodes(remoteNodes);
          console.log("AuthSync: Download complete.");
        }
      } else {
        // Case B: No Remote Data -> Push Logic (If local data exists)
        const localNodes = nodesRef.current;

        if (localNodes.length > 0) {
          console.log("AuthSync: No remote project, pushing local data...");

          const projectId = projectRef.current?.id || crypto.randomUUID();

          const newProject = {
            id: projectId,
            user_id: user.id,
            title: "나의 만다라트",
            is_public: false,
            progress: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          const { error: projError } = await supabase.from("projects").insert(newProject);

          if (!projError) {
            setProject(newProject as any);
            const { error: nodeError } = await supabase
              .from("nodes")
              .upsert(localNodes.map((n) => ({ ...n, project_id: projectId })));

            if (!nodeError) {
              console.log("AuthSync: Upload initialization complete.");
            } else {
              console.error("AuthSync: Failed to upload nodes", nodeError);
            }
          } else {
            console.error("AuthSync: Failed to create project", projError);
          }
        }
      }
    };

    initSync();
  }, [supabase, setNodes, setProject]);

  // 2. Auto-Save Logic (Subscribe to changes)
  useEffect(() => {
    const saveToDB = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const currentProject = projectRef.current;
      const currentNodes = nodesRef.current;

      if (!currentProject || currentNodes.length === 0) return;

      // Simple strategy: Upsert all current nodes.
      // Optimizations can include "dirty" tracking, but for 81 nodes, bulk upsert is cheap enough.
      console.log("AuthSync: Auto-saving...");

      const { error } = await supabase.from("nodes").upsert(
        currentNodes.map((n) => ({
          ...n,
          updated_at: new Date().toISOString(),
        })),
      );

      if (error) console.error("AuthSync: Auto-save failed", error);
      else console.log("AuthSync: Auto-save success");

      // Update project timestamp too
      await supabase
        .from("projects")
        .update({
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentProject.id);
    };

    const debouncedSave = debounce(saveToDB, 2000); // 2 seconds debounce

    // Subscribe strictly to node content changes?
    // Currently 'nodes' changes on every edit.
    if (nodes.length > 0) {
      debouncedSave();
    }

    return () => {
      // Cleanup logic?
    };
  }, [nodes]); // Trigger whenever nodes change

  return null; // This component renders nothing
};
