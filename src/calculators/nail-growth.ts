import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const nailGrowthCalculator: CalculatorDefinition = {
  slug: "nail-growth-calculator",
  title: "Nail Growth Calculator",
  description: "Free nail growth calculator. Estimate how long it takes to grow your fingernails or toenails to a desired length.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["nail growth calculator", "how fast do nails grow", "nail growth rate", "fingernail growth", "toenail growth calculator"],
  variants: [
    {
      id: "fingernail",
      name: "Fingernail Growth",
      description: "Calculate time for fingernails to grow to desired length",
      fields: [
        { name: "currentLength", label: "Current Nail Length (past fingertip)", type: "number", placeholder: "e.g. 2", suffix: "mm", step: 0.5, min: 0 },
        { name: "desiredLength", label: "Desired Nail Length (past fingertip)", type: "number", placeholder: "e.g. 8", suffix: "mm", step: 0.5 },
        { name: "hand", label: "Dominant Hand?", type: "select", options: [
          { label: "Non-dominant hand", value: "non-dominant" },
          { label: "Dominant hand", value: "dominant" },
        ], defaultValue: "dominant" },
        { name: "age", label: "Age Group", type: "select", options: [
          { label: "Under 20", value: "young" },
          { label: "20-40", value: "adult" },
          { label: "40-60", value: "middle" },
          { label: "Over 60", value: "senior" },
        ], defaultValue: "adult" },
      ],
      calculate: (inputs) => {
        const currentLength = inputs.currentLength as number;
        const desiredLength = inputs.desiredLength as number;
        const hand = inputs.hand as string;
        const age = inputs.age as string;
        if (currentLength === undefined || currentLength === null) return null;
        if (!desiredLength || desiredLength <= currentLength) return null;

        // Average fingernail growth: ~3.47 mm/month (0.12 mm/day)
        let ratePerMonth = 3.47;
        if (age === "young") ratePerMonth = 3.8;
        else if (age === "adult") ratePerMonth = 3.47;
        else if (age === "middle") ratePerMonth = 3.0;
        else ratePerMonth = 2.5;

        // Dominant hand grows ~0.1mm faster per month
        if (hand === "dominant") ratePerMonth += 0.1;

        const diff = desiredLength - currentLength;
        const days = diff / (ratePerMonth / 30);
        const weeks = days / 7;
        const months = days / 30;

        // Full nail replacement time
        const fullReplacementMonths = 15 / ratePerMonth; // average nail plate ~15mm

        return {
          primary: { label: "Estimated Time", value: weeks < 4 ? `${formatNumber(weeks, 1)} weeks` : `${formatNumber(months, 1)} months` },
          details: [
            { label: "Growth Needed", value: `${formatNumber(diff, 1)} mm` },
            { label: "Growth Rate", value: `${formatNumber(ratePerMonth, 2)} mm/month` },
            { label: "Days to Grow", value: formatNumber(days, 0) },
            { label: "Full Nail Replacement", value: `~${formatNumber(fullReplacementMonths, 1)} months` },
          ],
          note: "Fingernails grow faster than toenails. Growth is faster in summer, on the dominant hand, and in younger people.",
        };
      },
    },
    {
      id: "toenail",
      name: "Toenail Growth",
      description: "Calculate time for toenails to grow or replace fully",
      fields: [
        { name: "scenario", label: "What are you tracking?", type: "select", options: [
          { label: "Full toenail replacement (lost/damaged)", value: "full" },
          { label: "Growing out a mark/bruise", value: "mark" },
          { label: "Custom length growth", value: "custom" },
        ], defaultValue: "full" },
        { name: "growthMm", label: "Growth Needed (if custom)", type: "number", placeholder: "e.g. 5", suffix: "mm", step: 0.5, min: 0 },
      ],
      calculate: (inputs) => {
        const scenario = inputs.scenario as string;
        const customGrowth = inputs.growthMm as number;

        // Toenail growth: ~1.62 mm/month (about half of fingernails)
        const ratePerMonth = 1.62;

        let growthNeeded: number;
        let description: string;

        if (scenario === "full") {
          growthNeeded = 20; // big toenail ~20mm
          description = "Full toenail replacement";
        } else if (scenario === "mark") {
          growthNeeded = 10; // mid-nail mark
          description = "Growing out a mark from mid-nail";
        } else {
          if (!customGrowth) return null;
          growthNeeded = customGrowth;
          description = `Growing ${customGrowth} mm`;
        }

        const months = growthNeeded / ratePerMonth;
        const days = months * 30;

        return {
          primary: { label: "Estimated Time", value: `${formatNumber(months, 1)} months` },
          details: [
            { label: "Scenario", value: description },
            { label: "Growth Needed", value: `${formatNumber(growthNeeded, 1)} mm` },
            { label: "Growth Rate", value: `${formatNumber(ratePerMonth, 2)} mm/month` },
            { label: "Days", value: formatNumber(days, 0) },
          ],
          note: "Big toenails take 12-18 months for full replacement. Toenails grow about half as fast as fingernails.",
        };
      },
    },
  ],
  relatedSlugs: ["hair-growth-calculator", "skin-type-calculator"],
  faq: [
    { question: "How fast do fingernails grow?", answer: "Fingernails grow about 3.47 mm per month (0.12 mm/day) on average. The middle finger grows fastest, and nails on the dominant hand grow slightly faster. Growth rate decreases with age." },
    { question: "How fast do toenails grow?", answer: "Toenails grow about 1.62 mm per month, roughly half the rate of fingernails. A lost toenail takes 12-18 months to fully regrow, compared to 4-6 months for a fingernail." },
    { question: "What affects nail growth speed?", answer: "Factors include age (slows with age), nutrition (biotin, protein), season (faster in summer), hand dominance (dominant hand is faster), health conditions, and hormones (pregnancy increases growth)." },
  ],
  formula: "Time (days) = Growth Needed (mm) / Daily Rate | Fingernails ≈ 3.47 mm/month | Toenails ≈ 1.62 mm/month",
};
