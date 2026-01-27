"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft, Star, Link as LinkIcon, Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { analytics } from "@/utils/gtm";

export default function FeedbackPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [rating, setRating] = useState<number | null>(null);

  // New 5 Questions
  const [removalFeature, setRemovalFeature] = useState("");
  const [wantedFeature, setWantedFeature] = useState("");
  const [bestFeature, setBestFeature] = useState("");
  const [reasonNotUsing, setReasonNotUsing] = useState("");
  const [reasonUsing, setReasonUsing] = useState("");

  const [contact, setContact] = useState("");

  const handleSubmit = async () => {
    if (!rating) {
      alert("서비스 관심도 점수를 선택해주세요.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("feedbacks").insert({
        rating,
        feature_removals: removalFeature,
        feature_additions: wantedFeature,
        feature_best: bestFeature,
        reason_not_using: reasonNotUsing,
        reason_using: reasonUsing,
        contact_info: contact,
      });

      if (error) throw error;

      // Track survey_submit event
      analytics.surveySubmit({
        q_interest_score: rating,
        has_waitlist_optin: contact.trim().length > 0,
      });

      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("피드백 전송에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center space-y-6 shadow-xl animate-in fade-in slide-in-from-bottom-8">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={40} strokeWidth={4} />
          </div>
          <h2 className="text-2xl font-black text-slate-900">참여해 주셔서 감사합니다</h2>
          <p className="text-slate-500">작성해주신 소중한 의견은 서비스 개선에 큰 힘이 됩니다.</p>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <Link
              href="/editor"
              className="py-4 rounded-xl border border-slate-200 font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} /> 에디터로 돌아가기
            </Link>
            {/* Copy Link button simulation */}
            <button className="py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
              <LinkIcon size={18} /> 링크 복사
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
      <header className="bg-white dark:bg-slate-900 p-4 sticky top-0 z-10 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-black text-slate-900 dark:text-white">만다라트 2026</h1>
          {/* Optional User Avatar placeholder */}
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 py-8 space-y-8">
        <section className="space-y-4">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            소중한 의견을 들려주세요
          </h1>
          <p className="text-slate-500 leading-relaxed">
            만다라트 기법과 AI 코칭을 결합한 완벽한 목표 달성 앱을 만들기 위해 여러분의 소중한
            의견을 기다리고 있습니다.
          </p>
        </section>

        {/* Interest Rating */}
        <section className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
          <div className="flex items-center gap-2 text-green-500 font-bold">
            <Star size={20} fill="currentColor" />
            서비스 관심도
          </div>
          <p className="text-sm text-slate-500">
            만다라트와 연동된 할 일 앱이 있다면 사용하실 의향이 있나요?
          </p>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                onClick={() => setRating(score)}
                className={cn(
                  "py-3 rounded-xl font-bold transition-all",
                  rating === score
                    ? "bg-green-500 text-white shadow-lg shadow-green-500/30 scale-105"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600",
                )}
              >
                {score}
                {score === 5 && (
                  <span className="ml-1 text-[10px] hidden sm:inline">(매우 높음)</span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Detailed Questions */}
        <section className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-6">
          <div className="flex items-center gap-2 text-green-500 font-bold">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="21" y1="10" x2="3" y2="10"></line>
              <line x1="21" y1="6" x2="3" y2="6"></line>
              <line x1="21" y1="14" x2="3" y2="14"></line>
              <line x1="21" y1="18" x2="3" y2="18"></line>
            </svg>
            상세 의견
          </div>

          {/* Question 1 */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 dark:text-white">
              1. 가장 사라졌으면 하는 투두앱들의 기능
            </label>
            <textarea
              value={removalFeature}
              onChange={(e) => setRemovalFeature(e.target.value)}
              className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none resize-none h-24 text-sm text-slate-900 dark:text-white"
              placeholder="예: 과도한 알림, 복잡한 설정 등"
            />
          </div>

          {/* Question 2 */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 dark:text-white">
              2. 가장 있었으면 하는 투두앱의 기능
            </label>
            <textarea
              value={wantedFeature}
              onChange={(e) => setWantedFeature(e.target.value)}
              className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none resize-none h-24 text-sm text-slate-900 dark:text-white"
              placeholder="예: AI 자동 분류, 캘린더 연동 등"
            />
          </div>

          {/* Question 3 */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 dark:text-white">
              3. 가장 잘쓰고 있는 투두앱의 기능
            </label>
            <textarea
              value={bestFeature}
              onChange={(e) => setBestFeature(e.target.value)}
              className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none resize-none h-24 text-sm text-slate-900 dark:text-white"
              placeholder="어떤 기능을 가장 유용하게 쓰고 계신가요?"
            />
          </div>

          {/* Question 4 */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 dark:text-white">
              4. 투두앱을 사용하지 않는 이유
            </label>
            <textarea
              value={reasonNotUsing}
              onChange={(e) => setReasonNotUsing(e.target.value)}
              className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none resize-none h-24 text-sm text-slate-900 dark:text-white"
              placeholder="작성이 귀찮아서, 효과가 없어서 등"
            />
          </div>

          {/* Question 5 */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 dark:text-white">
              5. 투두앱을 사용하는 이유
            </label>
            <textarea
              value={reasonUsing}
              onChange={(e) => setReasonUsing(e.target.value)}
              className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none resize-none h-24 text-sm text-slate-900 dark:text-white"
              placeholder="체계적인 관리, 잊지 않기 위해 등"
            />
          </div>
        </section>

        {/* Waitlist */}
        <section className="bg-green-50 dark:bg-green-900/20 p-6 rounded-3xl border border-green-100 dark:border-green-900/30 space-y-4">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold">
            <Star size={20} fill="currentColor" />
            얼리 액세스 및 대기자 등록
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            정식 출시 시 가장 먼저 소식을 받아보세요.
          </p>

          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="이메일 또는 카카오 ID"
            className="w-full p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none text-slate-900 dark:text-white"
          />
          <p className="text-[10px] text-green-600 dark:text-green-500 flex items-center gap-1">
            <Check size={10} /> 입력하신 정보는 오직 출시 알림용으로만 사용됩니다.
          </p>
        </section>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-5 bg-green-500 hover:bg-green-600 text-white text-lg font-black rounded-2xl shadow-xl shadow-green-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "제출 중..." : "제출하기 ➤"}
        </button>
      </main>

      <footer className="py-8 text-center text-xs text-slate-300">
        © 2026 Mandalart Plan. 목표 달성을 응원합니다.
      </footer>
    </div>
  );
}
