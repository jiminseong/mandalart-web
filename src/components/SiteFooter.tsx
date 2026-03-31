"use client";

import { useTranslations } from "next-intl";

export function SiteFooter() {
  const t = useTranslations("footer");

  return (
    <footer className="w-full border-t border-border/40">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-5 px-6 py-8 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-1 text-[10px] font-medium uppercase tracking-widest text-text-secondary md:text-xs">
          <span>© 2026 Mandalart Project</span>
          <span className="text-text-secondary/50">{t("rights")}</span>
        </div>

        <div className="flex flex-col gap-2 text-[11px] text-text-secondary md:items-end md:text-xs">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{t("createdBy")}</span>
            <a
              href="https://mildolab.com"
              target="_blank"
              rel="noreferrer"
              className="border-b border-border/60 text-text-primary transition-colors hover:border-text-primary hover:text-text-primary"
            >
              mildo
            </a>
          </p>

          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{t("feedbackRequest")}</span>
            <a
              href="mailto:contact@mildolab.com"
              className="border-b border-border/60 text-text-primary transition-colors hover:border-text-primary hover:text-text-primary"
            >
              contact@mildolab.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
