import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const uvExposureCalculator: CalculatorDefinition = {
  slug: "uv-exposure-calculator",
  title: "UV Exposure Calculator",
  description: "Estimate safe sun exposure time based on UV index and skin type.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["UV","exposure","sunburn","skin"],
  variants: [{
    id: "standard",
    name: "UV Exposure",
    description: "Estimate safe sun exposure time based on UV index and skin type.",
    fields: [
      { name: "uvIndex", label: "UV Index", type: "number", min: 1, max: 15, defaultValue: 7 },
      { name: "skinType", label: "Skin Type", type: "select", options: [{ value: "1", label: "Very Fair" }, { value: "2", label: "Fair" }, { value: "3", label: "Medium" }, { value: "4", label: "Olive" }, { value: "5", label: "Brown" }, { value: "6", label: "Dark" }], defaultValue: "2" },
      { name: "spf", label: "Sunscreen SPF", type: "number", min: 0, max: 100, defaultValue: 30 },
    ],
    calculate: (inputs) => {
    const uvIndex = inputs.uvIndex as number;
    const skinType = inputs.skinType as number;
    const spf = inputs.spf as number;
    const baseMED: Record<number, number> = { 1: 15, 2: 25, 3: 35, 4: 45, 5: 60, 6: 90 };
    const baseMinutes = (baseMED[skinType] || 25) * 10 / uvIndex;
    const protectedMinutes = spf > 0 ? baseMinutes * spf : baseMinutes;
    const cappedProtected = Math.min(protectedMinutes, 480);
    return {
      primary: { label: "Safe Exposure (No SPF)", value: formatNumber(baseMinutes) + " min" },
      details: [
        { label: "With SPF " + spf, value: formatNumber(cappedProtected) + " min" },
        { label: "UV Index", value: formatNumber(uvIndex) },
        { label: "Skin Type", value: formatNumber(skinType) }
      ]
    };
  },
  }],
  relatedSlugs: ["heat-index-calculator","wind-chill-calculator"],
  faq: [
    { question: "What UV index requires sunscreen?", answer: "Apply sunscreen when the UV index is 3 or higher." },
    { question: "How does SPF extend safe exposure?", answer: "SPF 30 means you can stay 30 times longer than without it." },
  ],
  formula: "Base Minutes = Skin MED x 10 / UV Index; Protected = Base x SPF",
};
