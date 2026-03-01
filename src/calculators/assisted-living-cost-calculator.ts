import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const assistedLivingCostCalculator: CalculatorDefinition = {
  slug: "assisted-living-cost-calculator",
  title: "Assisted Living Cost Calculator",
  description: "Estimate the monthly and annual costs of assisted living based on location, care needs, and amenities.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["assisted living cost", "assisted living calculator", "senior living cost"],
  variants: [{
    id: "standard",
    name: "Assisted Living Cost",
    description: "Estimate the monthly and annual costs of assisted living based on location, care needs, and amenities",
    fields: [
      { name: "region", label: "Geographic Region", type: "select", options: [{value:"low",label:"Low Cost Region"},{value:"medium",label:"Medium Cost Region"},{value:"high",label:"High Cost Region"},{value:"vhigh",label:"Very High Cost Metro"}], defaultValue: "medium" },
      { name: "careLevel", label: "Level of Assistance", type: "select", options: [{value:"minimal",label:"Minimal (independent)"},{value:"moderate",label:"Moderate (daily help)"},{value:"extensive",label:"Extensive (significant help)"}], defaultValue: "moderate" },
      { name: "apartmentSize", label: "Apartment Size", type: "select", options: [{value:"studio",label:"Studio"},{value:"oneBed",label:"One Bedroom"},{value:"twoBed",label:"Two Bedroom"}], defaultValue: "oneBed" },
      { name: "years", label: "Expected Duration of Stay", type: "number", suffix: "years", min: 1, max: 20, defaultValue: 3 },
    ],
    calculate: (inputs) => {
      const region = inputs.region as string;
      const care = inputs.careLevel as string;
      const size = inputs.apartmentSize as string;
      const years = inputs.years as number;
      if (!years || years <= 0) return null;
      const baseCosts: Record<string, number> = { studio: 3800, oneBed: 4500, twoBed: 5500 };
      const regionMod: Record<string, number> = { low: 0.7, medium: 1.0, high: 1.4, vhigh: 1.8 };
      const careMod: Record<string, number> = { minimal: 1.0, moderate: 1.3, extensive: 1.7 };
      const monthlyCost = (baseCosts[size] || 4500) * (regionMod[region] || 1.0) * (careMod[care] || 1.3);
      const annualCost = monthlyCost * 12;
      const totalCost = annualCost * years;
      const annualIncrease = 0.04;
      let inflationAdjusted = 0;
      for (let i = 0; i < years; i++) {
        inflationAdjusted += annualCost * Math.pow(1 + annualIncrease, i);
      }
      return {
        primary: { label: "Estimated Monthly Cost", value: "$" + formatNumber(Math.round(monthlyCost)) },
        details: [
          { label: "Annual Cost", value: "$" + formatNumber(Math.round(annualCost)) },
          { label: "Total Cost (" + years + " years)", value: "$" + formatNumber(Math.round(totalCost)) },
          { label: "Inflation-Adjusted Total", value: "$" + formatNumber(Math.round(inflationAdjusted)) },
        ],
      };
    },
  }],
  relatedSlugs: ["nursing-home-cost-calculator", "memory-care-cost-calculator"],
  faq: [
    { question: "What is the average cost of assisted living?", answer: "The national median cost of assisted living is approximately $4,500 per month, though costs range from $2,500 in lower-cost areas to over $8,000 in major metropolitan areas." },
    { question: "What is the difference between assisted living and a nursing home?", answer: "Assisted living provides help with daily activities like bathing, dressing, and medication management in a residential setting. Nursing homes provide 24-hour skilled medical care for those with more serious health needs." },
  ],
  formula: "Monthly Cost = Base Rate x Region Modifier x Care Level Modifier",
};
