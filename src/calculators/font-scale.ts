import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fontScaleCalculator: CalculatorDefinition = {
  slug: "font-scale-calculator",
  title: "Typography Scale Calculator",
  description: "Free typography scale calculator. Generate harmonious font size scales using musical ratios, golden ratio, and custom ratios for web and print design.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["typography scale calculator", "font scale calculator", "type scale", "modular scale", "font size ratio"],
  variants: [
    {
      id: "modular",
      name: "Modular Scale",
      description: "Generate a type scale from a base size and ratio",
      fields: [
        { name: "baseSize", label: "Base Font Size (px)", type: "number", placeholder: "e.g. 16", defaultValue: 16 },
        { name: "ratio", label: "Scale Ratio", type: "select", options: [
          { label: "1.067 - Minor Second", value: "1.067" },
          { label: "1.125 - Major Second", value: "1.125" },
          { label: "1.200 - Minor Third", value: "1.200" },
          { label: "1.250 - Major Third", value: "1.250" },
          { label: "1.333 - Perfect Fourth", value: "1.333" },
          { label: "1.414 - Augmented Fourth", value: "1.414" },
          { label: "1.500 - Perfect Fifth", value: "1.500" },
          { label: "1.618 - Golden Ratio", value: "1.618" },
          { label: "1.667 - Major Sixth", value: "1.667" },
          { label: "2.000 - Octave", value: "2.000" },
        ], defaultValue: "1.250" },
        { name: "steps", label: "Steps Above Base", type: "select", options: [
          { label: "4 steps", value: "4" },
          { label: "5 steps", value: "5" },
          { label: "6 steps", value: "6" },
          { label: "8 steps", value: "8" },
        ], defaultValue: "6" },
      ],
      calculate: (inputs) => {
        const base = (inputs.baseSize as number) || 16;
        const ratio = parseFloat(inputs.ratio as string) || 1.25;
        const steps = parseInt(inputs.steps as string) || 6;

        const sizes: { step: number; px: number; rem: number; label: string }[] = [];
        const labels = ["Small", "Base", "h6", "h5", "h4", "h3", "h2", "h1", "Display 1", "Display 2"];

        for (let i = -1; i <= steps; i++) {
          const px = base * Math.pow(ratio, i);
          sizes.push({ step: i, px, rem: px / 16, label: labels[i + 1] || `Step ${i}` });
        }

        const details = sizes.map(s => ({
          label: s.label,
          value: `${formatNumber(s.px, 1)}px / ${formatNumber(s.rem, 3)}rem`,
        }));

        return {
          primary: { label: "Base Size", value: `${base}px with ${ratio} ratio` },
          details,
          note: `Scale: ${formatNumber(ratio, 3)} ratio. Each step multiplies the previous by ${ratio}. Common for web typography.`,
        };
      },
    },
    {
      id: "convert",
      name: "Font Size Converter",
      description: "Convert between px, rem, em, and pt",
      fields: [
        { name: "value", label: "Font Size Value", type: "number", placeholder: "e.g. 16", step: 0.1 },
        { name: "fromUnit", label: "From Unit", type: "select", options: [
          { label: "Pixels (px)", value: "px" },
          { label: "REM", value: "rem" },
          { label: "EM", value: "em" },
          { label: "Points (pt)", value: "pt" },
        ], defaultValue: "px" },
        { name: "rootSize", label: "Root Font Size (px)", type: "number", placeholder: "e.g. 16", defaultValue: 16 },
      ],
      calculate: (inputs) => {
        const val = inputs.value as number;
        const unit = inputs.fromUnit as string;
        const root = (inputs.rootSize as number) || 16;
        if (!val) return null;

        let px: number;
        if (unit === "px") px = val;
        else if (unit === "rem" || unit === "em") px = val * root;
        else px = val * 1.333;

        const rem = px / root;
        const pt = px * 0.75;
        const em = px / root;

        return {
          primary: { label: "Font Size", value: `${formatNumber(px, 1)}px` },
          details: [
            { label: "Pixels (px)", value: formatNumber(px, 2) },
            { label: "REM", value: formatNumber(rem, 4) },
            { label: "EM (at root)", value: formatNumber(em, 4) },
            { label: "Points (pt)", value: formatNumber(pt, 1) },
            { label: "Root font size", value: `${root}px` },
            { label: "Percentage of root", value: `${formatNumber(rem * 100, 1)}%` },
          ],
        };
      },
    },
    {
      id: "lineheight",
      name: "Line Height Calculator",
      description: "Calculate optimal line height for readability",
      fields: [
        { name: "fontSize", label: "Font Size (px)", type: "number", placeholder: "e.g. 16" },
        { name: "lineLength", label: "Line Length (characters)", type: "select", options: [
          { label: "Short (~40 chars)", value: "40" },
          { label: "Optimal (~60 chars)", value: "60" },
          { label: "Wide (~80 chars)", value: "80" },
          { label: "Very wide (~100 chars)", value: "100" },
        ], defaultValue: "60" },
        { name: "textType", label: "Text Type", type: "select", options: [
          { label: "Body text", value: "body" },
          { label: "Heading", value: "heading" },
          { label: "Caption/small text", value: "caption" },
        ], defaultValue: "body" },
      ],
      calculate: (inputs) => {
        const fontSize = inputs.fontSize as number;
        const lineLength = parseInt(inputs.lineLength as string) || 60;
        const textType = inputs.textType as string;
        if (!fontSize) return null;

        let baseRatio: number;
        if (textType === "heading") baseRatio = 1.15;
        else if (textType === "caption") baseRatio = 1.6;
        else baseRatio = 1.5;

        const lengthAdjust = (lineLength - 60) * 0.002;
        const sizeAdjust = fontSize > 24 ? -0.1 : fontSize < 14 ? 0.1 : 0;
        const lineHeight = baseRatio + lengthAdjust + sizeAdjust;
        const lineHeightPx = fontSize * lineHeight;
        const paragraphSpacing = lineHeightPx * 0.75;

        return {
          primary: { label: "Line Height", value: formatNumber(lineHeight, 2) },
          details: [
            { label: "Line height (unitless)", value: formatNumber(lineHeight, 3) },
            { label: "Line height (px)", value: `${formatNumber(lineHeightPx, 1)}px` },
            { label: "Font size", value: `${fontSize}px` },
            { label: "Leading (extra space)", value: `${formatNumber(lineHeightPx - fontSize, 1)}px` },
            { label: "Suggested paragraph spacing", value: `${formatNumber(paragraphSpacing, 1)}px` },
            { label: "CSS", value: `font-size: ${fontSize}px; line-height: ${formatNumber(lineHeight, 2)};` },
          ],
          note: "Wider line lengths need more line height. Smaller text needs more relative spacing. Headings use tighter line height.",
        };
      },
    },
  ],
  relatedSlugs: ["golden-ratio-calculator", "color-contrast-calculator", "grid-calculator"],
  faq: [
    { question: "What is a typographic scale?", answer: "A typographic scale is a set of harmonious font sizes generated by multiplying a base size by a consistent ratio. Common ratios include 1.250 (Major Third), 1.333 (Perfect Fourth), and 1.618 (Golden Ratio)." },
    { question: "What is the best base font size for web?", answer: "16px is the default browser font size and works well as a base. For content-heavy sites, 18-20px improves readability. Mobile devices may benefit from slightly larger text." },
    { question: "What line height should I use?", answer: "For body text, use 1.4-1.6. For headings, use 1.1-1.3. Wider columns need more line height. Smaller text needs relatively more spacing. Always test with your actual typeface." },
  ],
  formula: "Scale Size = Base × Ratio^step | REM = px / root size | Line Height = base ratio + length adjustment + size adjustment",
};
