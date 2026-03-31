import type { CSSProperties } from "react";

interface CellTypographyOptions {
  content?: string | null;
  isCenter?: boolean;
  compact?: boolean;
  placeholder?: boolean;
}

interface CellTypographyPreset {
  minFontSize: number;
  maxFontSize: number;
  fontWeight: number;
  fitWidthRatio: number;
  fitHeightRatio: number;
  emergencyMinFontSize: number;
}

const getContentLength = (content?: string | null) => Array.from(content?.trim() || "").length;

export const getCellTypographyBaseStyle = (): CSSProperties => ({
  display: "block",
  width: "100%",
  maxWidth: "100%",
  maxHeight: "100%",
  minWidth: 0,
  overflow: "hidden",
  textAlign: "center",
  whiteSpace: "pre-wrap",
  wordBreak: "break-all",
  overflowWrap: "anywhere",
});

export const getCellTypographyPreset = ({
  content,
  isCenter = false,
  compact = false,
  placeholder = false,
}: CellTypographyOptions): CellTypographyPreset => {
  const length = getContentLength(content);

  if (compact) {
    if (isCenter) {
      const minFontSize = placeholder ? 8.4 : 14.4;
      const maxFontSize = placeholder
        ? length > 12
          ? 9.8
          : 10.8
        : length > 24
          ? 18.5
          : length > 14
            ? 21.5
            : 24.5;
      return {
        minFontSize,
        maxFontSize,
        fontWeight: placeholder ? 600 : 700,
        fitWidthRatio: 0.985,
        fitHeightRatio: 0.96,
        emergencyMinFontSize: 4.2,
      };
    }

    const minFontSize = placeholder ? 7.6 : 13.2;
    const maxFontSize = placeholder
      ? length > 12
        ? 8.8
        : 9.8
      : length > 28
        ? 16.4
        : length > 18
          ? 18.6
          : 21.2;
    return {
      minFontSize,
      maxFontSize,
      fontWeight: placeholder ? 500 : 600,
      fitWidthRatio: 0.985,
      fitHeightRatio: 0.95,
      emergencyMinFontSize: 3.8,
    };
  }

  if (isCenter) {
    const maxFontSize = length > 24 ? 10.8 : length > 14 ? 13.4 : 16;
    return {
      minFontSize: 3.2,
      maxFontSize,
      fontWeight: placeholder ? 600 : 700,
      fitWidthRatio: 0.92,
      fitHeightRatio: 0.86,
      emergencyMinFontSize: 3.2,
    };
  }

  const maxFontSize = length > 28 ? 7.8 : length > 18 ? 9.8 : 14;
  return {
    minFontSize: 2.8,
    maxFontSize,
    fontWeight: placeholder ? 500 : 600,
    fitWidthRatio: 0.9,
    fitHeightRatio: 0.84,
    emergencyMinFontSize: 2.8,
  };
};
