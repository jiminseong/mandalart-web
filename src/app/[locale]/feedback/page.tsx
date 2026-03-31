"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft, Check, Send } from "lucide-react";
import { Link } from "@/i18n/routing";
import { cn } from "@/utils/cn";
import { analytics } from "@/utils/gtm";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { SiteFooter } from "@/components/SiteFooter";

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
      <div className="min-h-screen bg-base font-sans text-text-primary flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8">
          <div className="w-20 h-20 bg-growth/10 text-growth rounded-full flex items-center justify-center mx-auto ring-1 ring-growth/20">
            <Check size={40} strokeWidth={1.5} />
          </div>
          <div className="space-y-4 max-w-sm">
            <h2 className="text-3xl font-bold text-text-primary">{t("thankYou")}</h2>
            <p className="text-text-secondary leading-relaxed">{t("thankYouDesc")}</p>
          </div>

          <Link
            href="/editor"
            className="inline-flex items-center gap-2 rounded-full bg-text-primary px-8 py-3 text-base font-semibold text-accent-contrast transition-colors hover:bg-text-secondary"
          >
            <span>{t("backToEditor")}</span>
          </Link>
        </div>

        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base text-text-primary font-sans selection:bg-growth/20 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-base/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-screen-md mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft
              size={20}
              strokeWidth={1.5}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-medium tracking-wide uppercase text-sm">Home</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="max-w-screen-md mx-auto w-full flex-1 px-6 py-12 space-y-16">
        {/* Intro */}
        <section className="space-y-4 text-center max-w-lg mx-auto">
          <h1 className="text-3xl font-bold text-text-primary">{t("pageTitle")}</h1>
          <p className="text-text-secondary leading-relaxed">{t("pageDesc")}</p>
        </section>

        {/* Rating */}
        <section className="space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <label className="text-sm font-medium uppercase tracking-widest text-text-tertiary">
              {t("interestQuestion")}
            </label>
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  onClick={() => setRating(score)}
                  className={cn(
                    "w-12 h-12 rounded-full font-bold text-lg transition-all border",
                    rating === score
                      ? "bg-growth text-accent-contrast border-growth"
                      : "bg-surface text-text-secondary border-border hover:border-growth/50 hover:bg-base",
                  )}
                >
                  {score}
                </button>
              ))}
            </div>
            {rating === 5 && (
              <span className="text-xs text-growth font-medium">{t("veryHigh")}</span>
            )}
          </div>
        </section>

        {/* Questions form */}
        <section className="space-y-12">
          {[
            {
              label: t("q1Label"),
              placeholder: t("q1Placeholder"),
              value: removalFeature,
              setter: setRemovalFeature,
            },
            {
              label: t("q2Label"),
              placeholder: t("q2Placeholder"),
              value: wantedFeature,
              setter: setWantedFeature,
            },
            {
              label: t("q3Label"),
              placeholder: t("q3Placeholder"),
              value: bestFeature,
              setter: setBestFeature,
            },
            {
              label: t("q4Label"),
              placeholder: t("q4Placeholder"),
              value: reasonNotUsing,
              setter: setReasonNotUsing,
            },
            {
              label: t("q5Label"),
              placeholder: t("q5Placeholder"),
              value: reasonUsing,
              setter: setReasonUsing,
            },
          ].map((item, idx) => (
            <div key={idx} className="space-y-3 group">
              <label className="block font-medium text-text-primary text-lg">{item.label}</label>
              <textarea
                value={item.value}
                onChange={(e) => item.setter(e.target.value)}
                placeholder={item.placeholder}
                className="w-full bg-transparent border-b border-border py-2 focus:border-growth focus:outline-none transition-colors min-h-[4rem] resize-none placeholder:text-text-tertiary/50 text-text-secondary"
              />
            </div>
          ))}
        </section>

        {/* Contact / Waitlist */}
        <section className="space-y-6 pt-8 border-t border-border">
          <div className="space-y-2">
            <label className="block text-xl font-bold text-text-primary">
              {t("waitlistTitle")}
            </label>
            <p className="text-sm text-text-secondary">{t("waitlistDesc")}</p>
          </div>
          <textarea
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder={t("todoAppIdeaPlaceholder")}
            className="w-full bg-surface border border-border rounded-xl p-4 focus:border-growth focus:outline-none transition-colors min-h-[6rem] resize-none placeholder:text-text-tertiary/50 text-text-secondary"
          />
        </section>

        {/* Submit Action */}
        <div className="pt-8 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-3 rounded-full bg-text-primary px-12 py-4 text-base font-bold text-accent-contrast transition-all hover:scale-105 hover:bg-text-secondary active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span>{loading ? t("submitting") : t("submit")}</span>
            {!loading && <Send size={18} strokeWidth={2} />}
          </button>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
