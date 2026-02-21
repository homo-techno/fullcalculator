import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const colorContrastCalculator: CalculatorDefinition = {
  slug: "color-contrast-calculator",
  title: "Color Contrast Ratio Calculator",
  description: "Free WCAG color contrast ratio calculator. Check text and background color combinations for accessibility compliance with AA and AAA standards.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["color contrast calculator", "WCAG contrast checker", "accessibility contrast", "color contrast ratio", "AA AAA contrast"],
  variants: [
    {
      id: "rgb",
      name: "RGB Contrast Check",
      description: "Check contrast ratio between two RGB colors",
      fields: [
        { name: "fgR", label: "Text Color - Red (0-255)", type: "number", placeholder: "e.g. 0", min: 0, max: 255, defaultValue: 0 },
        { name: "fgG", label: "Text Color - Green (0-255)", type: "number", placeholder: "e.g. 0", min: 0, max: 255, defaultValue: 0 },
        { name: "fgB", label: "Text Color - Blue (0-255)", type: "number", placeholder: "e.g. 0", min: 0, max: 255, defaultValue: 0 },
        { name: "bgR", label: "Background - Red (0-255)", type: "number", placeholder: "e.g. 255", min: 0, max: 255, defaultValue: 255 },
        { name: "bgG", label: "Background - Green (0-255)", type: "number", placeholder: "e.g. 255", min: 0, max: 255, defaultValue: 255 },
        { name: "bgB", label: "Background - Blue (0-255)", type: "number", placeholder: "e.g. 255", min: 0, max: 255, defaultValue: 255 },
      ],
      calculate: (inputs) => {
        const fgR = inputs.fgR as number;
        const fgG = inputs.fgG as number;
        const fgB = inputs.fgB as number;
        const bgR = inputs.bgR as number;
        const bgG = inputs.bgG as number;
        const bgB = inputs.bgB as number;

        if (fgR === undefined || fgG === undefined || fgB === undefined ||
            bgR === undefined || bgG === undefined || bgB === undefined) return null;

        const srgbToLinear = (c: number) => {
          const s = c / 255;
          return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
        };

        const luminance = (r: number, g: number, b: number) =>
          0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);

        const fgL = luminance(fgR, fgG, fgB);
        const bgL = luminance(bgR, bgG, bgB);
        const lighter = Math.max(fgL, bgL);
        const darker = Math.min(fgL, bgL);
        const ratio = (lighter + 0.05) / (darker + 0.05);

        const aaLargePass = ratio >= 3;
        const aaPass = ratio >= 4.5;
        const aaaLargePass = ratio >= 4.5;
        const aaaPass = ratio >= 7;

        return {
          primary: { label: "Contrast Ratio", value: `${formatNumber(ratio, 2)}:1` },
          details: [
            { label: "WCAG AA Normal Text (4.5:1)", value: aaPass ? "PASS" : "FAIL" },
            { label: "WCAG AA Large Text (3:1)", value: aaLargePass ? "PASS" : "FAIL" },
            { label: "WCAG AAA Normal Text (7:1)", value: aaaPass ? "PASS" : "FAIL" },
            { label: "WCAG AAA Large Text (4.5:1)", value: aaaLargePass ? "PASS" : "FAIL" },
            { label: "Text color", value: `RGB(${fgR}, ${fgG}, ${fgB})` },
            { label: "Background color", value: `RGB(${bgR}, ${bgG}, ${bgB})` },
            { label: "Text luminance", value: formatNumber(fgL, 4) },
            { label: "Background luminance", value: formatNumber(bgL, 4) },
          ],
          note: ratio >= 7 ? "Excellent contrast! Passes all WCAG levels." : ratio >= 4.5 ? "Good contrast. Passes WCAG AA for all text sizes." : ratio >= 3 ? "Passes WCAG AA for large text only. Consider increasing contrast." : "Poor contrast. Does not meet WCAG AA minimum requirements.",
        };
      },
    },
    {
      id: "presets",
      name: "Common Color Combinations",
      description: "Check contrast for common color pairs",
      fields: [
        { name: "combo", label: "Color Combination", type: "select", options: [
          { label: "Black on White", value: "0,0,0|255,255,255" },
          { label: "White on Black", value: "255,255,255|0,0,0" },
          { label: "Dark Gray on White", value: "51,51,51|255,255,255" },
          { label: "Navy on White", value: "0,0,128|255,255,255" },
          { label: "Red on White", value: "255,0,0|255,255,255" },
          { label: "Green on White", value: "0,128,0|255,255,255" },
          { label: "Blue on White", value: "0,0,255|255,255,255" },
          { label: "Gray on White", value: "128,128,128|255,255,255" },
          { label: "Light Gray on White", value: "192,192,192|255,255,255" },
          { label: "White on Blue", value: "255,255,255|0,102,204" },
        ], defaultValue: "51,51,51|255,255,255" },
      ],
      calculate: (inputs) => {
        const combo = inputs.combo as string;
        if (!combo) return null;

        const [fg, bg] = combo.split("|");
        const [fR, fG, fB] = fg.split(",").map(Number);
        const [bR, bG, bB] = bg.split(",").map(Number);

        const srgbToLinear = (c: number) => {
          const s = c / 255;
          return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
        };

        const luminance = (r: number, g: number, b: number) =>
          0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);

        const fgL = luminance(fR, fG, fB);
        const bgL = luminance(bR, bG, bB);
        const ratio = (Math.max(fgL, bgL) + 0.05) / (Math.min(fgL, bgL) + 0.05);

        return {
          primary: { label: "Contrast Ratio", value: `${formatNumber(ratio, 2)}:1` },
          details: [
            { label: "WCAG AA Normal (4.5:1)", value: ratio >= 4.5 ? "PASS" : "FAIL" },
            { label: "WCAG AA Large (3:1)", value: ratio >= 3 ? "PASS" : "FAIL" },
            { label: "WCAG AAA Normal (7:1)", value: ratio >= 7 ? "PASS" : "FAIL" },
            { label: "WCAG AAA Large (4.5:1)", value: ratio >= 4.5 ? "PASS" : "FAIL" },
            { label: "Text color RGB", value: `(${fR}, ${fG}, ${fB})` },
            { label: "Background RGB", value: `(${bR}, ${bG}, ${bB})` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["color-converter", "font-scale-calculator", "grid-calculator"],
  faq: [
    { question: "What is WCAG contrast ratio?", answer: "WCAG (Web Content Accessibility Guidelines) defines minimum contrast ratios between text and background colors. Level AA requires 4.5:1 for normal text and 3:1 for large text. Level AAA requires 7:1 and 4.5:1 respectively." },
    { question: "What counts as large text in WCAG?", answer: "Large text is defined as 18pt (24px) regular weight or 14pt (18.66px) bold weight and above. Large text has a lower contrast requirement (3:1 for AA) because it is easier to read." },
    { question: "How is contrast ratio calculated?", answer: "Contrast ratio = (L1 + 0.05) / (L2 + 0.05) where L1 is the lighter luminance and L2 is the darker. Luminance is calculated from sRGB values using the formula: L = 0.2126R + 0.7152G + 0.0722B (after gamma correction)." },
  ],
  formula: "Contrast Ratio = (L1 + 0.05) / (L2 + 0.05) | Relative Luminance L = 0.2126×R + 0.7152×G + 0.0722×B (linearized sRGB)",
};
