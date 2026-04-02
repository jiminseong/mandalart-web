"use client";

import { useEffect, useRef } from "react";
import { useMandalartStore } from "@/store/mandalartStore";
import { deserializeMandalartNodes } from "@/utils/mandalartLink";

export function EditorStateHydrator({ encoded }: { encoded?: string }) {
  const setNodes = useMandalartStore((state) => state.setNodes);
  const setSelectedNodeId = useMandalartStore((state) => state.setSelectedNodeId);
  const setZoomedNodeId = useMandalartStore((state) => state.setZoomedNodeId);
  const appliedEncodedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!encoded || appliedEncodedRef.current === encoded) return;

    const decodedNodes = deserializeMandalartNodes(encoded);
    if (!decodedNodes) return;

    setNodes(decodedNodes);
    setSelectedNodeId(null);
    setZoomedNodeId(null);
    appliedEncodedRef.current = encoded;
  }, [encoded, setNodes, setSelectedNodeId, setZoomedNodeId]);

  return null;
}
