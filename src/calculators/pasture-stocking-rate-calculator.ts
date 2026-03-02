import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pastureStockingRateCalculator: CalculatorDefinition = {
  slug: "pasture-stocking-rate-calculator",
  title: "Pasture Stocking Rate Calculator",
  description: "Calculate how many animals a pasture can support.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["stocking rate","pasture capacity calculator"],
  variants: [{
    id: "standard",
    name: "Pasture Stocking Rate",
    description: "Calculate how many animals a pasture can support.",
    fields: [
      { name: "pastureAcres", label: "Pasture Size (acres)", type: "number", min: 1, max: 50000, defaultValue: 100 },
      { name: "forageProd", label: "Forage Production (lb DM/acre/year)", type: "number", min: 500, max: 15000, defaultValue: 4000 },
      { name: "utilization", label: "Utilization Rate (%)", type: "number", min: 20, max: 80, defaultValue: 50 },
      { name: "auDemand", label: "Animal Unit Demand (lb DM/month)", type: "number", min: 400, max: 1200, defaultValue: 780 },
      { name: "grazingMonths", label: "Grazing Months", type: "number", min: 1, max: 12, defaultValue: 7 },
    ],
    calculate: (inputs) => {
      const ac = inputs.pastureAcres as number;
      const fp = inputs.forageProd as number;
      const ut = inputs.utilization as number;
      const aud = inputs.auDemand as number;
      const gm = inputs.grazingMonths as number;
      if (!ac || !fp || !ut || !aud || !gm) return null;
      var availForage = ac * fp * (ut / 100);
      var demandPerAU = aud * gm;
      var animalUnits = Math.floor(availForage / demandPerAU);
      var acresPerAU = Math.round((ac / animalUnits) * 10) / 10;
      return {
        primary: { label: "Animal Units Supported", value: formatNumber(animalUnits) },
        details: [
          { label: "Acres Per Animal Unit", value: formatNumber(acresPerAU) },
          { label: "Available Forage", value: formatNumber(Math.round(availForage)) + " lb DM" },
          { label: "Demand Per Animal Unit", value: formatNumber(demandPerAU) + " lb DM" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is an animal unit?", answer: "An animal unit is one 1000 lb cow with a calf, consuming about 780 lb DM per month." },
    { question: "What utilization rate should I use?", answer: "Use 50% for sustainable grazing to maintain pasture health." },
  ],
  formula: "Animal Units = (Acres x Forage x Utilization%) / (Monthly Demand x Months)",
};
