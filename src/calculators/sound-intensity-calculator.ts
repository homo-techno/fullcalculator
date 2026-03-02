import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const soundIntensityCalculator: CalculatorDefinition = {
  slug: "sound-intensity-calculator",
  title: "Sound Intensity Calculator",
  description: "Calculate sound intensity in watts per square meter from dB.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["sound intensity","dB to intensity"],
  variants: [{
    id: "standard",
    name: "Sound Intensity",
    description: "Calculate sound intensity in watts per square meter from dB.",
    fields: [
      { name: "spl", label: "Sound Pressure Level (dB)", type: "number", min: 0, max: 194, defaultValue: 85 },
    ],
    calculate: (inputs) => {
      const spl = inputs.spl as number;
      if (spl === undefined) return null;
      const refIntensity = 1e-12;
      const intensity = refIntensity * Math.pow(10, spl / 10);
      const pressure = 0.00002 * Math.pow(10, spl / 20);
      const desc = spl < 60 ? "Quiet" : spl < 85 ? "Moderate" : spl < 120 ? "Loud" : "Dangerous";
      return {
        primary: { label: "Sound Intensity", value: intensity.toExponential(3) + " W/sq m" },
        details: [
          { label: "Sound Pressure", value: (Math.round(pressure * 10000) / 10000) + " Pa" },
          { label: "SPL", value: formatNumber(spl) + " dB" },
          { label: "Loudness Category", value: desc },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is the reference intensity for dB?", answer: "The reference is 10^-12 W/sq m, the threshold of human hearing." },
    { question: "At what dB level is sound dangerous?", answer: "Prolonged exposure above 85 dB can cause hearing damage." },
  ],
  formula: "Intensity = 10^-12 x 10^(SPL/10) W/sq m",
};
