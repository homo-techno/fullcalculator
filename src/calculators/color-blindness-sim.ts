import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const colorBlindnessSimCalculator: CalculatorDefinition = {
  slug: "color-blindness-sim",
  title: "Color Blindness Checker Calculator",
  description:
    "Free color blindness simulation calculator. Check color contrast ratios for accessibility and simulate how colors appear with different types of color vision deficiency.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "color blindness simulator",
    "color contrast checker",
    "accessibility color",
    "WCAG contrast",
    "color vision deficiency",
    "protanopia",
    "deuteranopia",
    "color accessibility",
  ],
  variants: [
    {
      id: "contrast-check",
      name: "Color Contrast Checker",
      description: "Check WCAG contrast ratio between foreground and background colors",
      fields: [
        {
          name: "fgRed",
          label: "Foreground Red (0-255)",
          type: "number",
          placeholder: "e.g. 0",
          min: 0,
          max: 255,
          defaultValue: 0,
        },
        {
          name: "fgGreen",
          label: "Foreground Green (0-255)",
          type: "number",
          placeholder: "e.g. 0",
          min: 0,
          max: 255,
          defaultValue: 0,
        },
        {
          name: "fgBlue",
          label: "Foreground Blue (0-255)",
          type: "number",
          placeholder: "e.g. 0",
          min: 0,
          max: 255,
          defaultValue: 0,
        },
        {
          name: "bgRed",
          label: "Background Red (0-255)",
          type: "number",
          placeholder: "e.g. 255",
          min: 0,
          max: 255,
          defaultValue: 255,
        },
        {
          name: "bgGreen",
          label: "Background Green (0-255)",
          type: "number",
          placeholder: "e.g. 255",
          min: 0,
          max: 255,
          defaultValue: 255,
        },
        {
          name: "bgBlue",
          label: "Background Blue (0-255)",
          type: "number",
          placeholder: "e.g. 255",
          min: 0,
          max: 255,
          defaultValue: 255,
        },
      ],
      calculate: (inputs) => {
        const fgR = parseFloat(inputs.fgRed as string);
        const fgG = parseFloat(inputs.fgGreen as string);
        const fgB = parseFloat(inputs.fgBlue as string);
        const bgR = parseFloat(inputs.bgRed as string);
        const bgG = parseFloat(inputs.bgGreen as string);
        const bgB = parseFloat(inputs.bgBlue as string);

        if ([fgR, fgG, fgB, bgR, bgG, bgB].some((v) => isNaN(v) || v < 0 || v > 255)) return null;

        const srgb = (c: number) => {
          const s = c / 255;
          return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
        };

        const luminance = (r: number, g: number, b: number) =>
          0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);

        const fgLum = luminance(fgR, fgG, fgB);
        const bgLum = luminance(bgR, bgG, bgB);
        const lighter = Math.max(fgLum, bgLum);
        const darker = Math.min(fgLum, bgLum);
        const ratio = (lighter + 0.05) / (darker + 0.05);

        const aaLarge = ratio >= 3 ? "Pass" : "Fail";
        const aaNormal = ratio >= 4.5 ? "Pass" : "Fail";
        const aaaLarge = ratio >= 4.5 ? "Pass" : "Fail";
        const aaaNormal = ratio >= 7 ? "Pass" : "Fail";

        const toHex = (r: number, g: number, b: number) =>
          "#" + [r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("");

        return {
          primary: {
            label: "Contrast Ratio",
            value: formatNumber(ratio, 2),
            suffix: ": 1",
          },
          details: [
            { label: "Foreground", value: toHex(fgR, fgG, fgB) + ` (rgb ${formatNumber(fgR, 0)}, ${formatNumber(fgG, 0)}, ${formatNumber(fgB, 0)})` },
            { label: "Background", value: toHex(bgR, bgG, bgB) + ` (rgb ${formatNumber(bgR, 0)}, ${formatNumber(bgG, 0)}, ${formatNumber(bgB, 0)})` },
            { label: "WCAG AA Normal Text", value: aaNormal + " (need 4.5:1)" },
            { label: "WCAG AA Large Text", value: aaLarge + " (need 3:1)" },
            { label: "WCAG AAA Normal Text", value: aaaNormal + " (need 7:1)" },
            { label: "WCAG AAA Large Text", value: aaaLarge + " (need 4.5:1)" },
          ],
        };
      },
    },
    {
      id: "cvd-sim",
      name: "Color Vision Simulation",
      description: "See how a color appears to people with color vision deficiency",
      fields: [
        {
          name: "red",
          label: "Red (0-255)",
          type: "number",
          placeholder: "e.g. 255",
          min: 0,
          max: 255,
          defaultValue: 255,
        },
        {
          name: "green",
          label: "Green (0-255)",
          type: "number",
          placeholder: "e.g. 0",
          min: 0,
          max: 255,
          defaultValue: 0,
        },
        {
          name: "blue",
          label: "Blue (0-255)",
          type: "number",
          placeholder: "e.g. 0",
          min: 0,
          max: 255,
          defaultValue: 0,
        },
        {
          name: "deficiency",
          label: "Color Vision Deficiency Type",
          type: "select",
          options: [
            { label: "Protanopia (no red cones)", value: "protanopia" },
            { label: "Deuteranopia (no green cones)", value: "deuteranopia" },
            { label: "Tritanopia (no blue cones)", value: "tritanopia" },
            { label: "Achromatopsia (total color blind)", value: "achromatopsia" },
          ],
          defaultValue: "deuteranopia",
        },
      ],
      calculate: (inputs) => {
        const r = parseFloat(inputs.red as string);
        const g = parseFloat(inputs.green as string);
        const b = parseFloat(inputs.blue as string);
        const deficiency = inputs.deficiency as string;

        if ([r, g, b].some((v) => isNaN(v) || v < 0 || v > 255)) return null;

        // Simplified color blindness simulation matrices
        let simR: number, simG: number, simB: number;

        switch (deficiency) {
          case "protanopia":
            simR = 0.567 * r + 0.433 * g + 0.0 * b;
            simG = 0.558 * r + 0.442 * g + 0.0 * b;
            simB = 0.0 * r + 0.242 * g + 0.758 * b;
            break;
          case "deuteranopia":
            simR = 0.625 * r + 0.375 * g + 0.0 * b;
            simG = 0.7 * r + 0.3 * g + 0.0 * b;
            simB = 0.0 * r + 0.3 * g + 0.7 * b;
            break;
          case "tritanopia":
            simR = 0.95 * r + 0.05 * g + 0.0 * b;
            simG = 0.0 * r + 0.433 * g + 0.567 * b;
            simB = 0.0 * r + 0.475 * g + 0.525 * b;
            break;
          case "achromatopsia":
            const gray = 0.299 * r + 0.587 * g + 0.114 * b;
            simR = gray;
            simG = gray;
            simB = gray;
            break;
          default:
            return null;
        }

        simR = Math.min(255, Math.max(0, Math.round(simR)));
        simG = Math.min(255, Math.max(0, Math.round(simG)));
        simB = Math.min(255, Math.max(0, Math.round(simB)));

        const toHex = (rv: number, gv: number, bv: number) =>
          "#" + [rv, gv, bv].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("");

        const deficiencyNames: Record<string, string> = {
          "protanopia": "Protanopia (red-blind, ~1% of males)",
          "deuteranopia": "Deuteranopia (green-blind, ~5% of males)",
          "tritanopia": "Tritanopia (blue-blind, ~0.01%)",
          "achromatopsia": "Achromatopsia (total, ~0.003%)",
        };

        return {
          primary: {
            label: "Simulated Color",
            value: toHex(simR, simG, simB),
          },
          details: [
            { label: "Original Color", value: toHex(r, g, b) + ` (R:${formatNumber(r, 0)} G:${formatNumber(g, 0)} B:${formatNumber(b, 0)})` },
            { label: "Simulated RGB", value: `R:${formatNumber(simR, 0)} G:${formatNumber(simG, 0)} B:${formatNumber(simB, 0)}` },
            { label: "Deficiency Type", value: deficiencyNames[deficiency] || deficiency },
          ],
          note: "This is an approximate simulation. Actual perception varies between individuals.",
        };
      },
    },
  ],
  relatedSlugs: ["color-converter-calculator", "screen-resolution-calc", "aspect-ratio-calc"],
  faq: [
    {
      question: "What is WCAG contrast ratio and why does it matter?",
      answer:
        "WCAG (Web Content Accessibility Guidelines) defines minimum contrast ratios for text readability. Level AA requires 4.5:1 for normal text and 3:1 for large text. Level AAA requires 7:1 and 4.5:1 respectively. Meeting these standards ensures your content is readable for users with low vision.",
    },
    {
      question: "How common is color blindness?",
      answer:
        "About 8% of males and 0.5% of females have some form of color vision deficiency. Deuteranopia (green-blind) is most common at about 5% of males. This means roughly 1 in 12 men cannot distinguish certain colors, making accessible design important.",
    },
    {
      question: "How can I make my designs color-blind friendly?",
      answer:
        "Use high contrast ratios, do not rely on color alone to convey information, add patterns/textures/labels alongside color, test with simulation tools, and use color palettes designed for accessibility (like ColorBrewer).",
    },
  ],
  formula:
    "Contrast Ratio = (L1 + 0.05) / (L2 + 0.05) where L = relative luminance | L = 0.2126R + 0.7152G + 0.0722B",
};
