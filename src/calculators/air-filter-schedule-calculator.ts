import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const airFilterScheduleCalculator: CalculatorDefinition = {
  slug: "air-filter-schedule-calculator",
  title: "Air Filter Schedule Calculator",
  description: "Calculate your HVAC air filter replacement schedule and annual cost based on home conditions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["air filter schedule", "HVAC filter replacement", "furnace filter change"],
  variants: [{
    id: "standard",
    name: "Air Filter Schedule",
    description: "Calculate your HVAC air filter replacement schedule and annual cost based on home conditions",
    fields: [
      { name: "filterSize", label: "Filter Type", type: "select", options: [{value:"1inch",label:"1 inch Standard"},{value:"2inch",label:"2 inch Pleated"},{value:"4inch",label:"4 inch Deep Pleated"},{value:"5inch",label:"5 inch Media Filter"}], defaultValue: "1inch" },
      { name: "pets", label: "Number of Pets", type: "number", min: 0, max: 10, defaultValue: 1 },
      { name: "allergies", label: "Allergy Concerns", type: "select", options: [{value:"none",label:"None"},{value:"mild",label:"Mild"},{value:"severe",label:"Severe"}], defaultValue: "mild" },
      { name: "filterCost", label: "Filter Cost Each", type: "number", prefix: "$", min: 1, max: 100, defaultValue: 15 },
    ],
    calculate: (inputs) => {
      const filterType = inputs.filterSize as string;
      const pets = inputs.pets as number;
      const allergies = inputs.allergies as string;
      const cost = inputs.filterCost as number;
      if (!cost) return null;
      const baseDays: Record<string, number> = { "1inch": 30, "2inch": 90, "4inch": 180, "5inch": 365 };
      let days = baseDays[filterType] || 30;
      if (pets > 0) days = Math.round(days * (1 - pets * 0.1));
      if (allergies === "mild") days = Math.round(days * 0.85);
      if (allergies === "severe") days = Math.round(days * 0.7);
      days = Math.max(14, days);
      const changesPerYear = Math.ceil(365 / days);
      const annualCost = changesPerYear * cost;
      return {
        primary: { label: "Replace Every", value: days + " days" },
        details: [
          { label: "Changes per Year", value: String(changesPerYear) },
          { label: "Annual Filter Cost", value: "$" + formatNumber(annualCost) },
          { label: "Filter Type", value: filterType.replace("inch", " inch") },
        ],
      };
    },
  }],
  relatedSlugs: ["mattress-replacement-calculator", "lightbulb-comparison-calculator"],
  faq: [
    { question: "How often should I change my air filter?", answer: "Standard 1-inch filters should be changed every 30-60 days. Homes with pets or allergies should change filters more frequently." },
    { question: "Do thicker air filters last longer?", answer: "Yes, 4-inch and 5-inch media filters can last 6-12 months because they have more surface area to capture particles before becoming clogged." },
  ],
  formula: "Replacement Days = Base Days x Pet Factor x Allergy Factor",
};
