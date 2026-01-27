type WindowWithDataLayer = Window & {
  dataLayer: any[];
};

declare const window: WindowWithDataLayer;

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export function track(event: string, params: Record<string, any> = {}) {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event,
      ...params,
    });
  } else {
    console.log(`[GTM] Track: ${event}`, params);
  }
}

// Common Event Types
export type CellEditParams = {
  section: "center" | "core8" | "actions64";
  cell_index: number;
  filled: boolean;
  filled_count_total: number;
  input_len: number;
  mandalart_id?: string;
  lang?: string;
  device?: string;
};

export type AiParams = {
  ai_mode?: "fill_blanks" | "make_concrete" | "polish";
  cell_index: number;
  section: "center" | "core8" | "actions64";
  from?: "fab" | "cell_icon";
  suggestion_count?: number;
  suggestion_rank?: number;
  latency_ms?: number;
};
