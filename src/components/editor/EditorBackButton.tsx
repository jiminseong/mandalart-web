"use client";

import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";
import { cn } from "@/utils/cn";

interface EditorBackButtonProps {
  backLabel: string;
  className?: string;
}

export function EditorBackButton({ backLabel, className }: EditorBackButtonProps) {
  const sharedClassName = cn(
    "group inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors",
    className,
  );

  const icon = (
    <ArrowLeft
      size={20}
      strokeWidth={1.5}
      className="group-hover:-translate-x-1 transition-transform"
    />
  );

  return (
    <Link href="/" className={sharedClassName} aria-label={backLabel} title={backLabel}>
      {icon}
      <span className="hidden md:inline text-sm font-medium tracking-wide">{backLabel}</span>
    </Link>
  );
}
