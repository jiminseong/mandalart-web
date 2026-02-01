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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center space-y-6 shadow-xl animate-in fade-in slide-in-from-bottom-8">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={40} strokeWidth={4} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t("thankYou")}</h2>
          <p className="text-slate-500 dark:text-slate-400">{t("thankYouDesc")}</p>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <Link
              href="/editor"
              className="py-4 rounded-xl border border-slate-200 font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} /> {t("backToEditor")}
            </Link>
            {/* Copy Link button simulation */}
            <button className="py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
              <LinkIcon size={18} /> {t("copyLink")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-100 dark:border-slate-800 p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="group text-sm font-bold text-slate-600 bg-white px-4 py-2 rounded-full border border-slate-200 hover:border-primary/50 hover:text-primary shadow-sm hover:shadow-md transition-all flex items-center gap-2"
          >
            <span className="bg-slate-100 p-1 rounded-full group-hover:bg-primary/10 transition-colors">
              <ArrowLeft size={16} />
            </span>
            {t("title")}
          </Link>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 py-8 space-y-8">
        <section className="space-y-4">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">{t("pageTitle")}</h1>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{t("pageDesc")}</p>
        </section>

        {/* Interest Rating */}
        <section className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
          <div className="flex items-center gap-2 text-green-500 font-bold">
            <Star size={20} fill="currentColor" />
            {t("interestScore")}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t("interestQuestion")}</p>
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
                  <span className="ml-1 text-[10px] hidden sm:inline">{t("veryHigh")}</span>
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
            {t("detailedOpinion")}
          </div>

          {/* Question 1 */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 dark:text-white">
              {t("q1Label")}
            </label>
            <textarea
              value={removalFeature}
              onChange={(e) => setRemovalFeature(e.target.value)}
              className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none resize-none h-24 text-sm text-slate-900 dark:text-white"
              placeholder={t("q1Placeholder")}
            />
          </div>

          {/* Question 2 */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 dark:text-white">
              {t("q2Label")}
            </label>
            <textarea
              value={wantedFeature}
              onChange={(e) => setWantedFeature(e.target.value)}
              className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none resize-none h-24 text-sm text-slate-900 dark:text-white"
              placeholder={t("q2Placeholder")}
            />
          </div>

          {/* Question 3 */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 dark:text-white">
              {t("q3Label")}
            </label>
            <textarea
              value={bestFeature}
              onChange={(e) => setBestFeature(e.target.value)}
              className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none resize-none h-24 text-sm text-slate-900 dark:text-white"
              placeholder={t("q3Placeholder")}
            />
          </div>

          {/* Question 4 */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 dark:text-white">
              {t("q4Label")}
            </label>
            <textarea
              value={reasonNotUsing}
              onChange={(e) => setReasonNotUsing(e.target.value)}
              className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none resize-none h-24 text-sm text-slate-900 dark:text-white"
              placeholder={t("q4Placeholder")}
            />
          </div>

          {/* Question 5 */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 dark:text-white">
              {t("q5Label")}
            </label>
            <textarea
              value={reasonUsing}
              onChange={(e) => setReasonUsing(e.target.value)}
              className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none resize-none h-24 text-sm text-slate-900 dark:text-white"
              placeholder={t("q5Placeholder")}
            />
          </div>
        </section>

        {/* Waitlist */}
        <section className="bg-green-50 dark:bg-green-900/20 p-6 rounded-3xl border border-green-100 dark:border-green-900/30 space-y-4">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold">
            <Star size={20} fill="currentColor" />
            {t("waitlistTitle")}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">{t("waitlistDesc")}</p>

          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder={t("contactPlaceholder")}
            className="w-full p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none text-slate-900 dark:text-white"
          />
          <p className="text-[10px] text-green-600 dark:text-green-500 flex items-center gap-1">
            <Check size={10} /> {t("privacyNote")}
          </p>
        </section>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-5 bg-green-500 hover:bg-green-600 text-white text-lg font-black rounded-2xl shadow-xl shadow-green-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? t("submitting") : t("submit")}
        </button>
      </main>

      <footer className="py-8 text-center text-xs text-slate-400 dark:text-slate-600">
        © 2026 Mandalart Plan. 목표 달성을 응원합니다.
      </footer>
    </div>
  );
}
