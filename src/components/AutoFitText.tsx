"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { getCellTypographyBaseStyle } from "@/utils/cellTypography";

interface AutoFitTextProps {
  text: string;
  color: string;
  minFontSize: number;
  maxFontSize: number;
  fontWeight: number;
  fitWidthRatio?: number;
  fitHeightRatio?: number;
  emergencyMinFontSize?: number;
  className?: string;
  fixedFontSize?: number;
  preserveWordBreaks?: boolean;
  clampToContainer?: boolean;
}

const getLineHeight = (fontSize: number) => {
  if (fontSize <= 4) return 1.02;
  if (fontSize <= 6) return 1.05;
  if (fontSize <= 8) return 1.08;
  if (fontSize <= 10) return 1.1;
  if (fontSize <= 13) return 1.14;
  return 1.18;
};

export function AutoFitText({
  text,
  color,
  minFontSize,
  maxFontSize,
  fontWeight,
  fitWidthRatio = 1,
  fitHeightRatio = 1,
  emergencyMinFontSize,
  className,
  fixedFontSize,
  preserveWordBreaks = false,
  clampToContainer = false,
}: AutoFitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<number | null>(null);
  const [fontSize, setFontSize] = useState(maxFontSize);
  const [maxTextHeight, setMaxTextHeight] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const textNode = textRef.current;

    if (!container || !textNode) return;

    const applySize = (size: number) => {
      textNode.style.fontSize = `${size}px`;
      textNode.style.lineHeight = String(getLineHeight(size));
      textNode.style.fontWeight = String(fontWeight);
    };

    const fitText = () => {
      const nextContainer = containerRef.current;
      const nextTextNode = textRef.current;

      if (!nextContainer || !nextTextNode) return;

      const availableWidth = nextContainer.clientWidth * fitWidthRatio;
      const availableHeight = nextContainer.clientHeight * fitHeightRatio;

      if (!availableHeight) return;

      if (fixedFontSize !== undefined) {
        const resolvedSize = Number(fixedFontSize.toFixed(2));
        const resolvedLineHeight = resolvedSize * getLineHeight(resolvedSize);
        const maxVisibleLines = Math.max(1, Math.floor((availableHeight + 0.5) / resolvedLineHeight));

        applySize(resolvedSize);
        setFontSize(resolvedSize);
        setMaxTextHeight(
          clampToContainer ? Number((maxVisibleLines * resolvedLineHeight).toFixed(2)) : null,
        );
        setReady(true);
        return;
      }

      if (!availableWidth) return;

      if (!text.trim()) {
        applySize(maxFontSize);
        setFontSize(maxFontSize);
        setMaxTextHeight(null);
        setReady(true);
        return;
      }

      const fallbackMinFontSize = emergencyMinFontSize ?? Math.max(1.6, minFontSize / 3);
      let low = fallbackMinFontSize;
      let high = maxFontSize;
      let best = fallbackMinFontSize;

      while (high - low > 0.2) {
        const mid = (low + high) / 2;
        applySize(mid);

        const fits =
          nextTextNode.scrollWidth <= availableWidth + 1 &&
          nextTextNode.scrollHeight <= availableHeight + 1;

        if (fits) {
          best = mid;
          low = mid;
        } else {
          high = mid;
        }
      }

      const resolvedSize = Number(best.toFixed(2));
      applySize(resolvedSize);
      setFontSize(resolvedSize);
      setMaxTextHeight(null);
      setReady(true);
    };

    const scheduleFit = () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(fitText);
    };

    scheduleFit();

    const resizeObserver = new ResizeObserver(scheduleFit);
    resizeObserver.observe(container);

    document.fonts?.ready.then(scheduleFit).catch(() => {});

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      resizeObserver.disconnect();
    };
  }, [
    text,
    minFontSize,
    maxFontSize,
    fontWeight,
    fitWidthRatio,
    fitHeightRatio,
    emergencyMinFontSize,
    fixedFontSize,
    clampToContainer,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn("flex h-full w-full min-w-0 items-center justify-center overflow-hidden", className)}
    >
      <span
        ref={textRef}
        style={{
          ...getCellTypographyBaseStyle({ preserveWordBreaks }),
          color,
          fontSize,
          lineHeight: getLineHeight(fontSize),
          fontWeight,
          maxHeight: maxTextHeight ? `${maxTextHeight}px` : undefined,
          opacity: ready ? 1 : 0,
        }}
      >
        {text}
      </span>
    </div>
  );
}
