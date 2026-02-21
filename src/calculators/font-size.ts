import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const BASE_PX = 16; // default browser font size

// Conversion factors to px
const toPx: Record<string, number> = {
  "px": 1,
  "pt": 4 / 3,         // 1 pt = 1.333... px
  "em": BASE_PX,       // 1 em = 16 px (default)
  "rem": BASE_PX,      // 1 rem = 16 px (default)
};

const unitLabels: Record<string, string> = {
  "px": "Pixels (px)",
  "pt": "Points (pt)",
  "em": "Em (em)",
  "rem": "Root Em (rem)",
};

const unitOptions = Object.keys(toPx).map((u) => ({ label: unitLabels[u], value: u }));

export const fontSizeConverter: CalculatorDefinition = {
  slug: "font-size-converter",
  title: "Font Size Converter",
  description: "Free font size converter. Convert between px, pt, em, and rem with a base size of 16px. See all unit equivalents at once.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["font size", "px", "pt", "em", "rem", "typography", "CSS", "converter"],
  variants: [
    {
      id: "convert",
      name: "Convert",
      fields: [
        { name: "value", label: "Value", type: "number", placeholder: "e.g. 16" },
        { name: "from", label: "From Unit", type: "select", options: unitOptions },
      ],
      calculate: (inputs) => {
        const val = inputs.value as number;
        const from = (inputs.from as string) || "px";
        if (!val) return null;
        const valuePx = val * toPx[from];
        const valuePt = valuePx / toPx["pt"];
        const valueEm = valuePx / toPx["em"];
        const valueRem = valuePx / toPx["rem"];
        const valuePercent = (valuePx / BASE_PX) * 100;
        return {
          primary: { label: `${formatNumber(val, 4)} ${from}`, value: `${formatNumber(valuePx, 4)} px` },
          details: [
            { label: "Pixels (px)", value: formatNumber(valuePx, 4) },
            { label: "Points (pt)", value: formatNumber(valuePt, 4) },
            { label: "Em", value: formatNumber(valueEm, 4) },
            { label: "Rem", value: formatNumber(valueRem, 4) },
            { label: "Percentage", value: `${formatNumber(valuePercent, 2)}%` },
            { label: "Base size", value: `${BASE_PX}px` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["dpi-calculator", "print-size-calculator"],
  faq: [
    { question: "What is the difference between em and rem?", answer: "Em is relative to the parent element's font size, while rem is always relative to the root (html) element's font size. Both default to 16px in most browsers." },
    { question: "How many pixels is 1 point?", answer: "1 point (pt) equals approximately 1.333 pixels (px) on screen at standard resolution." },
  ],
  formula: "1 pt = 4/3 px. 1 em = 1 rem = 16px (default). Percentage = (px / base) × 100.",
};
