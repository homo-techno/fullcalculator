import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const freeSpacePathLossCalculator: CalculatorDefinition = {
  slug: "free-space-path-loss-calculator",
  title: "Free Space Path Loss Calculator",
  description: "Calculate free space path loss in dB for a given distance.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["FSPL","free space path loss"],
  variants: [{
    id: "standard",
    name: "Free Space Path Loss",
    description: "Calculate free space path loss in dB for a given distance.",
    fields: [
      { name: "frequency", label: "Frequency (MHz)", type: "number", min: 1, max: 300000, defaultValue: 2400 },
      { name: "distance", label: "Distance (km)", type: "number", min: 0.001, max: 100000, defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const freq = inputs.frequency as number;
      const dist = inputs.distance as number;
      if (!freq || !dist) return null;
      const fspl = Math.round((20 * Math.log10(dist) + 20 * Math.log10(freq) + 32.44) * 100) / 100;
      const wavelength = Math.round(300 / freq * 10000) / 10000;
      return {
        primary: { label: "Free Space Path Loss", value: formatNumber(fspl) + " dB" },
        details: [
          { label: "Frequency", value: formatNumber(freq) + " MHz" },
          { label: "Distance", value: formatNumber(dist) + " km" },
          { label: "Wavelength", value: formatNumber(wavelength) + " m" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is free space path loss?", answer: "It is the signal attenuation over distance in open air with no obstacles." },
    { question: "Does FSPL depend on frequency?", answer: "Yes. Higher frequencies have greater free space path loss." },
  ],
  formula: "FSPL (dB) = 20 log10(d) + 20 log10(f) + 32.44",
};
