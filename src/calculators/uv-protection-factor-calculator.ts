import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const uvProtectionFactorCalculator: CalculatorDefinition = {
  slug: "uv-protection-factor-calculator",
  title: "UV Protection Factor Calculator",
  description: "Calculate how long sunscreen protects you from UV radiation based on SPF, skin type, and UV index for safe sun exposure.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["uv protection","spf calculator","sunscreen","uv index","sun exposure time"],
  variants: [{
    id: "standard",
    name: "UV Protection Factor",
    description: "Calculate how long sunscreen protects you from UV radiation based on SPF, skin type, and UV index for safe sun exposure.",
    fields: [
      { name: "spf", label: "Sunscreen SPF", type: "select", options: [{ value: "15", label: "SPF 15" }, { value: "30", label: "SPF 30" }, { value: "50", label: "SPF 50" }, { value: "70", label: "SPF 70" }, { value: "100", label: "SPF 100" }], defaultValue: "30" },
      { name: "skinType", label: "Skin Type (Fitzpatrick)", type: "select", options: [{ value: "1", label: "Type I - Very Fair" }, { value: "2", label: "Type II - Fair" }, { value: "3", label: "Type III - Medium" }, { value: "4", label: "Type IV - Olive" }, { value: "5", label: "Type V - Brown" }, { value: "6", label: "Type VI - Dark" }], defaultValue: "2" },
      { name: "uvIndex", label: "UV Index", type: "number", min: 1, max: 15, defaultValue: 7 },
    ],
    calculate: (inputs) => {
    const spf = inputs.spf as number;
    const skinType = inputs.skinType as number;
    const uvIndex = inputs.uvIndex as number;
    const baseTimes = [5, 10, 15, 25, 35, 45];
    const baseMinutes = baseTimes[skinType - 1] || 10;
    const uvAdjust = 10 / uvIndex;
    const protectedMinutes = baseMinutes * spf * uvAdjust;
    const hours = Math.floor(protectedMinutes / 60);
    const mins = Math.round(protectedMinutes % 60);
    const reapplyMinutes = Math.min(protectedMinutes * 0.8, 120);
    const uvBlocked = ((spf - 1) / spf) * 100;
    return {
      primary: { label: "Protected Time", value: formatNumber(hours) + "h " + formatNumber(mins) + "m" },
      details: [
        { label: "Total Protected Minutes", value: formatNumber(Math.round(protectedMinutes)) + " min" },
        { label: "UV Radiation Blocked", value: formatNumber(Math.round(uvBlocked * 10) / 10) + "%" },
        { label: "Recommended Reapply After", value: formatNumber(Math.round(reapplyMinutes)) + " min" },
        { label: "Base Burn Time (No SPF)", value: formatNumber(Math.round(baseMinutes * uvAdjust)) + " min" }
      ]
    };
  },
  }],
  relatedSlugs: ["wind-chill-calculator","heat-index-calculator","solar-panel-savings-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Protected Time = Base Burn Time x SPF x (10 / UV Index); UV Blocked % = ((SPF - 1) / SPF) x 100",
};
