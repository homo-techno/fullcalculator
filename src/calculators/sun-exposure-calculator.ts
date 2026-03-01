import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sunExposureCalculator: CalculatorDefinition = {
  slug: "sun-exposure-calculator",
  title: "Sun Exposure Calculator",
  description: "Calculate safe sun exposure time based on your skin type, UV index, and sunscreen usage.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["sun exposure time", "safe sun calculator", "UV exposure calculator"],
  variants: [{
    id: "standard",
    name: "Sun Exposure",
    description: "Calculate safe sun exposure time based on your skin type, UV index, and sunscreen usage",
    fields: [
      { name: "skinType", label: "Skin Type (Fitzpatrick)", type: "select", options: [{value:"1",label:"Type I - Very Fair"},{value:"2",label:"Type II - Fair"},{value:"3",label:"Type III - Medium"},{value:"4",label:"Type IV - Olive"},{value:"5",label:"Type V - Brown"},{value:"6",label:"Type VI - Dark"}], defaultValue: "2" },
      { name: "uvIndex", label: "UV Index", type: "number", suffix: "", min: 1, max: 15, defaultValue: 6 },
      { name: "spf", label: "Sunscreen SPF", type: "number", suffix: "", min: 0, max: 100, defaultValue: 30 },
    ],
    calculate: (inputs) => {
      const skinType = parseInt(inputs.skinType as string) || 2;
      const uvIndex = inputs.uvIndex as number;
      const spf = inputs.spf as number;
      if (!uvIndex || uvIndex <= 0) return null;
      const baseMins: Record<number, number> = { 1: 67, 2: 100, 3: 200, 4: 300, 5: 400, 6: 500 };
      const baseTime = (baseMins[skinType] || 100) / uvIndex;
      const protectedTime = spf > 0 ? baseTime * spf * 0.6 : baseTime;
      const vitDMins = Math.min(baseTime * 0.5, 30);
      return {
        primary: { label: "Safe Unprotected Time", value: formatNumber(Math.round(baseTime)) + " minutes" },
        details: [
          { label: "With SPF " + spf, value: formatNumber(Math.round(protectedTime)) + " minutes" },
          { label: "Vitamin D Exposure", value: formatNumber(Math.round(vitDMins)) + " minutes recommended" },
          { label: "UV Risk Level", value: uvIndex <= 2 ? "Low" : uvIndex <= 5 ? "Moderate" : uvIndex <= 7 ? "High" : "Very High" },
        ],
      };
    },
  }],
  relatedSlugs: ["biological-age-calculator", "hydration-calculator"],
  faq: [
    { question: "How long can I stay in the sun without burning?", answer: "It depends on your skin type and UV index. Fair skin (Type I) may burn in as little as 5 to 10 minutes at high UV, while darker skin types can tolerate much longer." },
    { question: "Does sunscreen fully protect from UV?", answer: "Sunscreen extends your safe exposure time but does not block 100 percent of UV rays. SPF 30 blocks about 97 percent of UVB rays when applied correctly." },
  ],
  formula: "Safe Time = Base Minutes for Skin Type / UV Index; Protected Time = Safe Time x SPF x 0.6",
};
