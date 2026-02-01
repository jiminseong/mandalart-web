"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { analytics, StartClickParams } from "@/utils/gtm";

interface TrackedLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  eventParams: StartClickParams;
}

export const TrackedLink = ({ href, className, children, eventParams }: TrackedLinkProps) => {
  return (
    <Link
      href={href as any}
      className={className}
      onClick={() => {
        analytics.startClick(eventParams);
      }}
    >
      {children}
    </Link>
  );
};
