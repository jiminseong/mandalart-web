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

export const AuthSyncManager = () => {
  const supabase = createClient();
  const setProject = useMandalartStore((state) => state.setProject);
  const setNodes = useMandalartStore((state) => state.setNodes);
  const nodes = useMandalartStore((state) => state.nodes);
  const project = useMandalartStore((state) => state.project); // Might be null

  // Using refs to access latest state inside effects/timeouts without triggering re-runs
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
      if (!user) return;

      console.log("AuthSync: User found", user.id);

      // 1. Check if user has a project in DB
      const { data: existingProjects } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1);

      const remoteProject = existingProjects?.[0];

      if (remoteProject) {
        // Case A: Remote Data Exists -> Pull Logic
        console.log("AuthSync: Found remote project, syncing down...", remoteProject.id);

        // Fetch Nodes
        const { data: remoteNodes } = await supabase
          .from("nodes")
          .select("*")
          .eq("project_id", remoteProject.id);

        if (remoteNodes) {
          setProject(remoteProject);
          setNodes(remoteNodes);
          console.log("AuthSync: Download complete.");
        }
      } else {
        // Case B: No Remote Data -> Push Logic (If local data exists)
        const localNodes = nodesRef.current;

        if (localNodes.length > 0) {
          console.log("AuthSync: No remote project, pushing local data...");

          // We need a proper project ID.
          // If local nodes have a project_id, we try to use it, or generate new if conflict/invalid.
          // Ideally we create a new Project record first.

          const projectId = localNodes[0].project_id; // Assume all share same project_id

          const newProject = {
            id: projectId,
            user_id: user.id,
            title: "나의 만다라트", // Default title, maybe extract from core node
            is_public: false,
            progress: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          // Insert Project
          const { error: projError } = await supabase.from("projects").insert(newProject);

          if (!projError) {
            setProject(newProject as any);

            // Insert Nodes
            // Clean nodes for insertion (remove extra props if any, though Type should match)
            const { error: nodeError } = await supabase.from("nodes").upsert(localNodes);

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
  }, []); // Run once on mount

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
