"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft, Star, Link as LinkIcon, Check } from "lucide-react";
import { Link } from "@/i18n/routing";
import { cn } from "@/utils/cn";
import { analytics } from "@/utils/gtm";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function FeedbackPage() {
  const t = useTranslations("feedback");
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
      alert(t("alertScore"));
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
      alert(t("alertError"));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-6">
        <div className="max-w-sm w-full text-center space-y-6">
          <div className="w-16 h-16 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto">
            <Check size={32} strokeWidth={3} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t("thankYou")}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">{t("thankYouDesc")}</p>

          <div className="space-y-3 pt-4">
            <Link
              href="/editor"
              className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-2xl transition-colors"
            >
              <span>{t("backToEditor")}</span>
            </Link>
            <button className="flex items-center justify-center gap-2 w-full py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 active:bg-slate-300 dark:hover:bg-slate-700 dark:active:bg-slate-600 text-slate-900 dark:text-white font-semibold rounded-2xl transition-colors">
              <LinkIcon size={18} strokeWidth={2.5} />
              <span>{t("copyLink")}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* iOS-style Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-black/5 dark:border-white/5">
        <div className="max-w-screen-sm mx-auto px-4 h-11 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 active:opacity-50 transition-opacity"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
            <span className="font-semibold">{t("title")}</span>
          </Link>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="max-w-screen-sm mx-auto px-6 py-8 pb-20 space-y-6">
        <section className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t("pageTitle")}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {t("pageDesc")}
          </p>
        </section>

        {/* Interest Rating */}
        <section className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-black/5 dark:border-white/5 space-y-4">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold">
            <Star size={18} fill="currentColor" strokeWidth={0} />
            {t("interestScore")}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">{t("interestQuestion")}</p>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                onClick={() => setRating(score)}
                className={cn(
                  "py-3 rounded-xl font-semibold transition-colors",
                  rating === score
                    ? "bg-green-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 active:opacity-70",
                )}
              >
                {score}
                {score === 5 && (
                  <span className="ml-1 text-[10px] hidden sm:inline">{t("veryHigh")}</span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Detailed Questions */}
        <section className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-black/5 dark:border-white/5 space-y-5">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="21" y1="10" x2="3" y2="10"></line>
              <line x1="21" y1="6" x2="3" y2="6"></line>
              <line x1="21" y1="14" x2="3" y2="14"></line>
              <line x1="21" y1="18" x2="3" y2="18"></line>
            </svg>
            {t("detailedOpinion")}
          </div>

          {/* Question 1 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">
              {t("q1Label")}
            </label>
            <textarea
              value={removalFeature}
              onChange={(e) => setRemovalFeature(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-black/5 dark:border-white/5 focus:ring-2 focus:ring-blue-600 outline-none resize-none h-24 text-sm text-slate-900 dark:text-white"
              placeholder={t("q1Placeholder")}
            />
          </div>

          {/* Question 2 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">
              {t("q2Label")}
            </label>
            <textarea
              value={wantedFeature}
              onChange={(e) => setWantedFeature(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-black/5 dark:border-white/5 focus:ring-2 focus:ring-blue-600 outline-none resize-none h-24 text-sm text-slate-900 dark:text-white"
              placeholder={t("q2Placeholder")}
            />
          </div>

          {/* Question 3 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">
              {t("q3Label")}
            </label>
            <textarea
              value={bestFeature}
              onChange={(e) => setBestFeature(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-black/5 dark:border-white/5 focus:ring-2 focus:ring-blue-600 outline-none resize-none h-24 text-sm text-slate-900 dark:text-white"
              placeholder={t("q3Placeholder")}
            />
          </div>

          {/* Question 4 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">
              {t("q4Label")}
            </label>
            <textarea
              value={reasonNotUsing}
              onChange={(e) => setReasonNotUsing(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-black/5 dark:border-white/5 focus:ring-2 focus:ring-blue-600 outline-none resize-none h-24 text-sm text-slate-900 dark:text-white"
              placeholder={t("q4Placeholder")}
            />
          </div>

          {/* Question 5 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">
              {t("q5Label")}
            </label>
            <textarea
              value={reasonUsing}
              onChange={(e) => setReasonUsing(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-black/5 dark:border-white/5 focus:ring-2 focus:ring-blue-600 outline-none resize-none h-24 text-sm text-slate-900 dark:text-white"
              placeholder={t("q5Placeholder")}
            />
          </div>
        </section>

        <section className="bg-indigo-50 dark:bg-indigo-900/10 p-5 rounded-2xl border border-indigo-200/50 dark:border-indigo-800/30 space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold">
            <Star size={18} fill="currentColor" strokeWidth={0} />
            {t("waitlistTitle")}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">{t("waitlistDesc")}</p>

          <textarea
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder={t("todoAppIdeaPlaceholder")}
            className="w-full p-3 bg-white dark:bg-slate-900 rounded-xl border border-black/5 dark:border-white/5 focus:ring-2 focus:ring-indigo-600 outline-none resize-none h-24 text-sm text-slate-900 dark:text-white"
          />
          {/* <p className="text-xs text-green-600 dark:text-green-500 flex items-center gap-1">
            <Check size={12} strokeWidth={3} /> {t("privacyNote")}
          </p> */}
        </section>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? t("submitting") : t("submit")}
        </button>
      </main>

      <footer className="py-6 text-center text-xs text-slate-400 dark:text-slate-600">
        © 2026 Mandalart Plan. 목표 달성을 응원합니다.
      </footer>
    </div>
  );
}
