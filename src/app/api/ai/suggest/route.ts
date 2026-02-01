import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

// Simple in-memory rate limiter for demo purposes
const ipRateLimit = new Map<string, { count: number; lastTime: number }>();
const FREE_LIMIT = 5; // Allow 5 requests per hour for guests
const WINDOW_MS = 60 * 60 * 1000;

// Initialize Gemini (Ensure API Key is present in .env.local)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    // 0. Auth & Rate Limit Check
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // If NOT logged in, perform stricter checks
    // if (!user) {
    //   const headersList = await headers();
    //   const ip = headersList.get("x-forwarded-for") || "unknown-ip";
    //   const userAgent = headersList.get("user-agent") || "unknown-ua";
    //   const fingerPrint = `${ip}-${userAgent}`;

    //   const now = Date.now();
    //   const record = ipRateLimit.get(fingerPrint) || { count: 0, lastTime: now };

    //   if (now - record.lastTime > WINDOW_MS) {
    //     record.count = 0;
    //     record.lastTime = now;
    //   }

    //   /*
    //   if (record.count >= FREE_LIMIT) {
    //     return NextResponse.json(
    //       { error: "Free trial limit exceeded. Please login." },
    //       { status: 429 },
    //     );
    //   }
    //   */

    //   record.count++;
    //   ipRateLimit.set(fingerPrint, record);
    // }

    const { context, goalLevel, currentContent } = await req.json();

    // 1. Validation (Key Check)
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        suggestions: [
          "API 키가 설정되지 않았습니다.",
          "더 구체적으로 작성해보세요.",
          "숫자를 포함하면 좋습니다.",
        ],
      }); // Mock fallback for dev without key
    }

    // 2. Prompt Engineering
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    let prompt = "";
    if (goalLevel === 0) {
      // Core Goal Suggestion
      prompt = `
            사용자가 '만다라트 계획표'의 [핵심 목표]를 작성하려고 합니다.
            현재 입력: "${currentContent}"
            
            이 목표를 달성하기 위한 구체적이고 영감을 주는 핵심 목표 3가지를 추천해주세요.
            단답형으로 짧게 작성해주세요. (20자 이내)
            형식: JSON Array (예: ["목표 1", "목표 2", "목표 3"])
        `;
    } else if (goalLevel === 1) {
      // Sub Goal Suggestion
      prompt = `
            사용자가 [핵심 목표: ${context.coreGoal}]를 달성하기 위한 [세부 목표]를 작성 중입니다.
            현재 입력: "${currentContent}"
            
            이 세부 목표를 더 구체화하거나, 관련된 좋은 세부 목표 3가지를 추천해주세요.
            핵심 목표와 논리적으로 연결되어야 합니다.
            단답형으로 짧게 작성해주세요. (15자 이내)
            형식: JSON Array
        `;
    } else {
      // Action Plan Suggestion
      prompt = `
            사용자가 [세부 목표: ${context.subGoal}] (핵심: ${context.coreGoal})를 위한 [실천 행동]을 작성 중입니다.
            현재 입력: "${currentContent}"
            
            당장 실천 가능한 구체적인 행동 3가지를 추천해주세요.
            측정 가능하거나 행동 중심적이어야 합니다.
            단답형으로 짧게 작성해주세요. (15자 이내)
            형식: JSON Array
        `;
    }

    // 3. Generate
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 4. Parse JSON (Simple clean-up)
    const cleanedText = text.replace(/```json|```/g, "").trim();
    let suggestions = [];
    try {
      suggestions = JSON.parse(cleanedText);
    } catch (e) {
      suggestions = [text]; // Fallback if parsing fails
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json(
      {
        error: "AI Service Unavailable",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
