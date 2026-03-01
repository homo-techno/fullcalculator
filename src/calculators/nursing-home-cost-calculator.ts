import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const nursingHomeCostCalculator: CalculatorDefinition = {
  slug: "nursing-home-cost-calculator",
  title: "Nursing Home Cost Calculator",
  description: "Estimate the cost of nursing home care based on room type, location, and length of stay.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["nursing home cost", "long-term care cost", "skilled nursing facility cost"],
  variants: [{
    id: "standard",
    name: "Nursing Home Cost",
    description: "Estimate the cost of nursing home care based on room type, location, and length of stay",
    fields: [
      { name: "roomType", label: "Room Type", type: "select", options: [{value:"shared",label:"Shared Room"},{value:"private",label:"Private Room"}], defaultValue: "shared" },
      { name: "region", label: "Geographic Region", type: "select", options: [{value:"low",label:"Low Cost Region"},{value:"medium",label:"Medium Cost Region"},{value:"high",label:"High Cost Region"},{value:"vhigh",label:"Very High Cost Region"}], defaultValue: "medium" },
      { name: "months", label: "Expected Length of Stay", type: "number", suffix: "months", min: 1, max: 120, defaultValue: 24 },
      { name: "careLevel", label: "Level of Care", type: "select", options: [{value:"basic",label:"Basic Skilled Nursing"},{value:"enhanced",label:"Enhanced Care"},{value:"memory",label:"Memory Care Unit"}], defaultValue: "basic" },
    ],
    calculate: (inputs) => {
      const room = inputs.roomType as string;
      const region = inputs.region as string;
      const months = inputs.months as number;
      const care = inputs.careLevel as string;
      if (!months || months <= 0) return null;
      const roomCosts: Record<string, number> = { shared: 7500, private: 9000 };
      const regionMod: Record<string, number> = { low: 0.75, medium: 1.0, high: 1.35, vhigh: 1.7 };
      const careMod: Record<string, number> = { basic: 1.0, enhanced: 1.2, memory: 1.5 };
      const monthlyBase = roomCosts[room] || 7500;
      const monthlyCost = monthlyBase * (regionMod[region] || 1.0) * (careMod[care] || 1.0);
      const totalCost = monthlyCost * months;
      const dailyCost = monthlyCost / 30;
      const annualCost = monthlyCost * 12;
      return {
        primary: { label: "Total Estimated Cost", value: "$" + formatNumber(Math.round(totalCost)) },
        details: [
          { label: "Monthly Cost", value: "$" + formatNumber(Math.round(monthlyCost)) },
          { label: "Daily Cost", value: "$" + formatNumber(Math.round(dailyCost)) },
          { label: "Annual Cost", value: "$" + formatNumber(Math.round(annualCost)) },
        ],
      };
    },
  }],
  relatedSlugs: ["assisted-living-cost-calculator", "memory-care-cost-calculator"],
  faq: [
    { question: "How much does a nursing home cost per month?", answer: "The national median cost is approximately $7,500 per month for a shared room and $9,000 for a private room, though costs vary significantly by region and level of care required." },
    { question: "Does Medicare cover nursing home costs?", answer: "Medicare covers up to 100 days of skilled nursing care after a qualifying hospital stay, with full coverage for the first 20 days and a daily copay for days 21 through 100. It does not cover long-term custodial care." },
  ],
  formula: "Total Cost = Monthly Base Rate x Region Modifier x Care Level Modifier x Months",
};
