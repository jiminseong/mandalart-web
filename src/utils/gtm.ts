import { sendGTMEvent, sendGAEvent } from "@next/third-parties/google";

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function track(event: string, params: Record<string, any> = {}) {
  // Send to GTM
  if (GTM_ID) {
    sendGTMEvent({
      event,
      ...params,
    });
  }

  // Send to GA4
  if (GA_ID) {
    sendGAEvent("event", event, params);
  }

  // Log in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] Track: ${event}`, params);
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

// Specific Event Trackers
export type StartClickParams = {
  entry: "hero" | "onboarding_end" | "example_use" | "hero_about" | "header_health"; // Added hero_about for tracking about page entry
};

export const analytics = {
  // 1. Export Image Event
  exportImage: (params: {
    theme: "light" | "dark";
    show_title_date: boolean;
    show_watermark: boolean;
    filled_count_total: number;
  }) => {
    track("export_image", params);
  },

  // 2. Cell Edit Event
  cellEdit: (params: CellEditParams) => {
    track("cell_edit", params);
  },

  // 3. AI Apply Event
  aiApply: (params: AiParams) => {
    track("ai_apply", params);
  },

  // 4. Waitlist Submit Event
  waitlistSubmit: (params: { channel: "email" | "kakao"; placement: string }) => {
    track("waitlist_submit", params);
  },

  // 5. Survey Submit Event
  surveySubmit: (params: { q_interest_score: number; has_waitlist_optin: boolean }) => {
    track("survey_submit", params);
  },

  // 6. Page View (manual if needed)
  pageView: (params: { page_path: string; page_title: string }) => {
    track("page_view", params);
  },

  // 7. Start Click
  startClick: (params: StartClickParams) => {
    track("start_click", params);
  },
};
