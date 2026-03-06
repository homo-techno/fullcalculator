import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pastureCarryingCapacityCalculator: CalculatorDefinition = {
  slug: "pasture-carrying-capacity-calculator",
  title: "Pasture Carrying Capacity Calculator",
  description: "Determine how many animal units a pasture can support based on forage growth, rest period, and seasonal production patterns.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["carrying capacity","pasture capacity calculator","grazing capacity estimator"],
  variants: [{
    id: "standard",
    name: "Pasture Carrying Capacity",
    description: "Determine how many animal units a pasture can support based on forage growth, rest period, and seasonal production patterns.",
    fields: [
      { name: "pastureAcres", label: "Pasture Size (acres)", type: "number", min: 1, max: 100000, defaultValue: 200 },
      { name: "forageGrowth", label: "Forage Growth (lb DM/acre/month)", type: "number", min: 100, max: 2000, defaultValue: 500 },
      { name: "utilizationPct", label: "Utilization Rate (%)", type: "number", min: 20, max: 80, defaultValue: 50 },
      { name: "grazingMonths", label: "Grazing Season (months)", type: "number", min: 1, max: 12, defaultValue: 6 },
      { name: "animalUnitDemand", label: "AU Demand (lb DM/month)", type: "number", min: 400, max: 1200, defaultValue: 780 },
    ],
    calculate: (inputs) => {
      const ac = inputs.pastureAcres as number;
      const fg = inputs.forageGrowth as number;
      const ut = inputs.utilizationPct as number;
      const gm = inputs.grazingMonths as number;
      const aud = inputs.animalUnitDemand as number;
      if (!ac || !fg || !ut || !gm || !aud) return null;
      const availableForage = ac * fg * gm * (ut / 100);
      const totalDemand = aud * gm;
      const animalUnits = Math.floor(availableForage / totalDemand);
      const acresPerAU = Math.round(ac / Math.max(1, animalUnits) * 10) / 10;
      const totalForageTons = Math.round(availableForage / 2000 * 10) / 10;
      return {
        primary: { label: "Animal Units Supported", value: formatNumber(animalUnits) },
        details: [
          { label: "Acres Per Animal Unit", value: formatNumber(acresPerAU) },
          { label: "Available Forage", value: formatNumber(totalForageTons) + " tons DM" },
          { label: "Utilization Rate", value: ut + "%" },
          { label: "Grazing Season", value: gm + " months" },
        ],
      };
  },
  }],
  relatedSlugs: ["pasture-stocking-rate-calculator","livestock-feed-calculator"],
  faq: [
    { question: "What is an animal unit?", answer: "An animal unit (AU) is defined as one 1,000-pound cow with a calf, consuming approximately 780 pounds of dry matter per month or 26 pounds per day." },
    { question: "Why not graze all the forage?", answer: "Leaving 40 to 60 percent of forage ungrazed maintains plant root reserves, prevents soil compaction, reduces erosion, and ensures pasture regrowth for sustainable long-term production." },
  ],
  formula: "Available Forage = Acres x Growth Rate x Months x Utilization%; Animal Units = Available Forage / (AU Demand x Months); Acres Per AU = Total Acres / Animal Units",
};
