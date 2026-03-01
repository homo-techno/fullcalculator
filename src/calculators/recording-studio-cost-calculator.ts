import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const recordingStudioCostCalculator: CalculatorDefinition = {
  slug: "recording-studio-cost-calculator",
  title: "Recording Studio Cost Calculator",
  description: "Estimate the cost of recording studio time based on studio tier, session length, and services needed.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["recording studio cost", "studio time price", "music recording cost"],
  variants: [{
    id: "standard",
    name: "Recording Studio Cost",
    description: "Estimate the cost of recording studio time based on studio tier, session length, and services needed",
    fields: [
      { name: "studioTier", label: "Studio Tier", type: "select", options: [{value:"home",label:"Home Studio"},{value:"project",label:"Project Studio"},{value:"professional",label:"Professional Studio"},{value:"premium",label:"Premium/Major Studio"}], defaultValue: "professional" },
      { name: "hours", label: "Session Hours", type: "number", min: 1, max: 100, defaultValue: 8 },
      { name: "engineer", label: "Engineer Included", type: "select", options: [{value:"yes",label:"Yes"},{value:"no",label:"No (Self-Operated)"}], defaultValue: "yes" },
      { name: "mixing", label: "Mixing/Mastering", type: "select", options: [{value:"none",label:"None"},{value:"mixing",label:"Mixing Only"},{value:"both",label:"Mixing and Mastering"}], defaultValue: "both" },
    ],
    calculate: (inputs) => {
      const tier = inputs.studioTier as string;
      const hours = inputs.hours as number;
      const engineer = inputs.engineer as string;
      const mixing = inputs.mixing as string;
      if (!hours || hours <= 0) return null;
      const hourlyRate: Record<string, number> = { home: 25, project: 50, professional: 100, premium: 250 };
      const rate = hourlyRate[tier] || 100;
      let studioCost = rate * hours;
      if (engineer === "yes") studioCost += hours * 40;
      let mixMasterCost = 0;
      if (mixing === "mixing") mixMasterCost = 500;
      if (mixing === "both") mixMasterCost = 1000;
      const total = studioCost + mixMasterCost;
      return {
        primary: { label: "Total Studio Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Studio Time", value: "$" + formatNumber(studioCost) },
          { label: "Mixing/Mastering", value: mixMasterCost > 0 ? "$" + formatNumber(mixMasterCost) : "Not included" },
          { label: "Hourly Rate", value: "$" + formatNumber(rate) + "/hr" },
        ],
      };
    },
  }],
  relatedSlugs: ["band-booking-calculator", "piano-tuning-cost-calculator"],
  faq: [
    { question: "How much does studio time cost?", answer: "Studio rates range from $25/hour for home studios to $250+ per hour for premium facilities. Most professional studios charge $75-$150 per hour." },
    { question: "Is mixing and mastering included in studio time?", answer: "Most studios charge separately for mixing and mastering. Mixing typically costs $300-$800 per song and mastering $50-$200 per song." },
  ],
  formula: "Total = (Hourly Rate x Hours) + Engineer Fee + Mixing/Mastering Cost",
};
