import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weldFillerMetalCalculator: CalculatorDefinition = {
  slug: "weld-filler-metal-calculator",
  title: "Weld Filler Metal Calculator",
  description: "Estimate filler metal weight for a welding joint.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["weld filler metal","welding rod calculator"],
  variants: [{
    id: "standard",
    name: "Weld Filler Metal",
    description: "Estimate filler metal weight for a welding joint.",
    fields: [
      { name: "jointLength", label: "Joint Length (inches)", type: "number", min: 1, max: 1000, defaultValue: 24 },
      { name: "crossSection", label: "Weld Cross Section (sq in)", type: "number", min: 0.001, max: 5, defaultValue: 0.1 },
      { name: "density", label: "Metal Density (lb/cu in)", type: "number", min: 0.05, max: 0.5, defaultValue: 0.283 },
      { name: "waste", label: "Waste Factor (%)", type: "number", min: 0, max: 50, defaultValue: 15 },
    ],
    calculate: (inputs) => {
      const jl = inputs.jointLength as number;
      const cs = inputs.crossSection as number;
      const den = inputs.density as number;
      const wf = inputs.waste as number;
      if (!jl || !cs || !den) return null;
      const volume = jl * cs;
      const weightNet = volume * den;
      const weightTotal = Math.round(weightNet * (1 + wf / 100) * 1000) / 1000;
      return {
        primary: { label: "Filler Metal Needed", value: formatNumber(weightTotal) + " lb" },
        details: [
          { label: "Net Weight", value: formatNumber(Math.round(weightNet * 1000) / 1000) + " lb" },
          { label: "Weld Volume", value: formatNumber(Math.round(volume * 1000) / 1000) + " cu in" },
          { label: "Waste Factor", value: wf + "%" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What density should I use for steel?", answer: "Mild steel has a density of about 0.283 pounds per cubic inch." },
    { question: "Why add a waste factor?", answer: "Waste accounts for spatter, stub ends, and grinding losses during welding." },
  ],
  formula: "Weight = Joint Length x Cross Section x Density x (1 + Waste%)",
};
