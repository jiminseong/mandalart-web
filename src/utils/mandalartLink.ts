import { Database } from "@/types/supabase";

type Node = Database["public"]["Tables"]["nodes"]["Row"];

const OUTER_POSITIONS = [0, 1, 2, 3, 5, 6, 7, 8] as const;
const LINK_VERSION = 1;

interface MandalartLinkPayload {
  v: number;
  c: string[];
}

const createNodeId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const toBase64Url = (value: string) => {
  const bytes = new TextEncoder().encode(value);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

const fromBase64Url = (value: string) => {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return new TextDecoder().decode(bytes);
};

export function createEmptyMandalartNodes(projectId = "local"): Node[] {
  const nodes: Node[] = [];
  const now = new Date().toISOString();

  const coreId = createNodeId();
  nodes.push({
    id: coreId,
    project_id: projectId,
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

  const subNodeIds: Record<number, string> = {};

  OUTER_POSITIONS.forEach((position) => {
    const id = createNodeId();
    subNodeIds[position] = id;
    nodes.push({
      id,
      project_id: projectId,
      level: 1,
      position,
      parent_id: coreId,
      content: "",
      created_at: now,
      updated_at: now,
      completed_at: null,
      status: "todo",
      note: null,
    });
  });

  OUTER_POSITIONS.forEach((position) => {
    const parentId = subNodeIds[position];

    OUTER_POSITIONS.forEach((childPosition) => {
      nodes.push({
        id: createNodeId(),
        project_id: projectId,
        level: 2,
        position: childPosition,
        parent_id: parentId,
        content: "",
        created_at: now,
        updated_at: now,
        completed_at: null,
        status: "todo",
        note: null,
      });
    });
  });

  return nodes;
}

const getOrderedContents = (nodes: Node[]) => {
  const contents: string[] = [];
  const coreNode = nodes.find((node) => node.level === 0);
  const subNodes = nodes.filter((node) => node.level === 1);
  const actionNodes = nodes.filter((node) => node.level === 2);

  contents.push(coreNode?.content ?? "");

  OUTER_POSITIONS.forEach((position) => {
    const subNode = subNodes.find((node) => node.position === position);
    contents.push(subNode?.content ?? "");

    const childNodes = subNode
      ? actionNodes.filter((node) => node.parent_id === subNode.id)
      : [];

    OUTER_POSITIONS.forEach((childPosition) => {
      const childNode = childNodes.find((node) => node.position === childPosition);
      contents.push(childNode?.content ?? "");
    });
  });

  return contents;
};

export function serializeMandalartNodes(nodes: Node[]) {
  const payload: MandalartLinkPayload = {
    v: LINK_VERSION,
    c: getOrderedContents(nodes),
  };

  return toBase64Url(JSON.stringify(payload));
}

export function deserializeMandalartNodes(encoded: string) {
  try {
    const payload = JSON.parse(fromBase64Url(encoded)) as MandalartLinkPayload;

    if (payload.v !== LINK_VERSION || !Array.isArray(payload.c)) {
      return null;
    }

    const nodes = createEmptyMandalartNodes();
    const coreNode = nodes.find((node) => node.level === 0);
    const subNodes = nodes.filter((node) => node.level === 1);
    const actionNodes = nodes.filter((node) => node.level === 2);

    let index = 0;

    if (coreNode) {
      coreNode.content = typeof payload.c[index] === "string" ? payload.c[index] : "";
    }
    index += 1;

    OUTER_POSITIONS.forEach((position) => {
      const subNode = subNodes.find((node) => node.position === position);

      if (subNode) {
        subNode.content = typeof payload.c[index] === "string" ? payload.c[index] : "";
      }
      index += 1;

      const childNodes = subNode
        ? actionNodes.filter((node) => node.parent_id === subNode.id)
        : [];

      OUTER_POSITIONS.forEach((childPosition) => {
        const childNode = childNodes.find((node) => node.position === childPosition);

        if (childNode) {
          childNode.content = typeof payload.c[index] === "string" ? payload.c[index] : "";
        }
        index += 1;
      });
    });

    return nodes;
  } catch {
    return null;
  }
}
