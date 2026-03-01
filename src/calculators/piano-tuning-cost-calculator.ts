import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pianoTuningCostCalculator: CalculatorDefinition = {
  slug: "piano-tuning-cost-calculator",
  title: "Piano Tuning Cost Calculator",
  description: "Estimate the cost of piano tuning and maintenance based on piano type, condition, and location.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["piano tuning cost", "piano maintenance", "piano tuning price"],
  variants: [{
    id: "standard",
    name: "Piano Tuning Cost",
    description: "Estimate the cost of piano tuning and maintenance based on piano type, condition, and location",
    fields: [
      { name: "pianoType", label: "Piano Type", type: "select", options: [{value:"upright",label:"Upright"},{value:"baby-grand",label:"Baby Grand"},{value:"grand",label:"Grand"},{value:"concert",label:"Concert Grand"}], defaultValue: "upright" },
      { name: "lastTuned", label: "Months Since Last Tuning", type: "number", min: 0, max: 120, defaultValue: 12 },
      { name: "tuningsPerYear", label: "Tunings per Year", type: "number", min: 1, max: 6, defaultValue: 2 },
      { name: "region", label: "Region", type: "select", options: [{value:"urban",label:"Urban/City"},{value:"suburban",label:"Suburban"},{value:"rural",label:"Rural"}], defaultValue: "suburban" },
    ],
    calculate: (inputs) => {
      const pianoType = inputs.pianoType as string;
      const monthsSince = inputs.lastTuned as number;
      const tuningsPerYear = inputs.tuningsPerYear as number;
      const region = inputs.region as string;
      if (!tuningsPerYear) return null;
      const baseRate: Record<string, number> = { upright: 120, "baby-grand": 150, grand: 180, concert: 250 };
      const regionMult: Record<string, number> = { urban: 1.3, suburban: 1.0, rural: 0.85 };
      const base = (baseRate[pianoType] || 120) * (regionMult[region] || 1.0);
      const pitchRaise = monthsSince > 24 ? 75 : monthsSince > 12 ? 40 : 0;
      const perTuning = Math.round(base + pitchRaise);
      const annualCost = perTuning * tuningsPerYear;
      return {
        primary: { label: "Cost per Tuning", value: "$" + formatNumber(perTuning) },
        details: [
          { label: "Annual Cost", value: "$" + formatNumber(annualCost) },
          { label: "Pitch Raise Fee", value: pitchRaise > 0 ? "$" + pitchRaise : "None needed" },
          { label: "Tunings per Year", value: String(tuningsPerYear) },
        ],
      };
    },
  }],
  relatedSlugs: ["music-lesson-cost-calculator", "recording-studio-cost-calculator"],
  faq: [
    { question: "How much does piano tuning cost?", answer: "A standard piano tuning costs $100-$200 for an upright and $150-$300 for a grand piano. Neglected pianos may need a pitch raise at additional cost." },
    { question: "How often should a piano be tuned?", answer: "Most manufacturers recommend tuning a piano at least twice per year. New pianos may need tuning 3-4 times in the first year." },
  ],
  formula: "Tuning Cost = Base Rate x Region Multiplier + Pitch Raise Fee",
};
