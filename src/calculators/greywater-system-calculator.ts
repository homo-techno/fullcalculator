import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const greywaterSystemCalculator: CalculatorDefinition = {
  slug: "greywater-system-calculator",
  title: "Greywater System Calculator",
  description: "Calculate potential water reuse savings from a greywater recycling system for your home.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["greywater system", "greywater reuse", "water recycling calculator"],
  variants: [{
    id: "standard",
    name: "Greywater System",
    description: "Calculate potential water reuse savings from a greywater recycling system for your home",
    fields: [
      { name: "people", label: "Household Members", type: "number", suffix: "people", min: 1, max: 15, defaultValue: 4 },
      { name: "waterRate", label: "Water Rate per Gallon", type: "number", prefix: "$", min: 0, max: 0.1, step: 0.001, defaultValue: 0.005 },
      { name: "systemType", label: "System Type", type: "select", options: [{value:"laundry",label:"Laundry Only"},{value:"bath",label:"Bath and Shower"},{value:"full",label:"Full Greywater System"}], defaultValue: "full" },
    ],
    calculate: (inputs) => {
      const people = inputs.people as number;
      const rate = inputs.waterRate as number;
      const sType = inputs.systemType as string;
      if (!people || people <= 0) return null;
      const dailyUse: Record<string, number> = { laundry: 15, bath: 25, full: 40 };
      const greywaterPerDay = (dailyUse[sType] || 40) * people;
      const yearlyGallons = greywaterPerDay * 365;
      const annualSavings = yearlyGallons * rate;
      const irrigationArea = greywaterPerDay * 0.5;
      return {
        primary: { label: "Greywater Reused per Year", value: formatNumber(Math.round(yearlyGallons)) + " gallons" },
        details: [
          { label: "Daily Greywater Output", value: formatNumber(greywaterPerDay) + " gallons" },
          { label: "Annual Savings", value: "$" + formatNumber(Math.round(annualSavings * 100) / 100) },
          { label: "Irrigation Area Supported", value: formatNumber(Math.round(irrigationArea)) + " sq ft" },
        ],
      };
    },
  }],
  relatedSlugs: ["water-conservation-calculator", "composting-toilet-calculator"],
  faq: [
    { question: "What is greywater?", answer: "Greywater is gently used water from sinks, showers, bathtubs, and washing machines. It does not include water from toilets or kitchen sinks with food waste." },
    { question: "Is greywater safe for garden use?", answer: "Greywater is generally safe for irrigating non-edible plants and trees when used with biodegradable soaps and applied below the surface." },
  ],
  formula: "Greywater Reused = People x Daily Greywater per Person x 365",
};
