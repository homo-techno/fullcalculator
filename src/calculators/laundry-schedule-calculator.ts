import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const laundryScheduleCalculator: CalculatorDefinition = {
  slug: "laundry-schedule-calculator",
  title: "Laundry Schedule Calculator",
  description: "Determine your optimal laundry frequency and estimate costs based on household size and habits.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["laundry schedule", "laundry frequency", "laundry cost"],
  variants: [{
    id: "standard",
    name: "Laundry Schedule",
    description: "Determine your optimal laundry frequency and estimate costs based on household size and habits",
    fields: [
      { name: "people", label: "Household Members", type: "number", min: 1, max: 12, defaultValue: 4 },
      { name: "machineType", label: "Washer Type", type: "select", options: [{value:"he-front",label:"HE Front Load"},{value:"he-top",label:"HE Top Load"},{value:"standard",label:"Standard Top Load"},{value:"laundromat",label:"Laundromat"}], defaultValue: "he-front" },
      { name: "electricRate", label: "Electric Rate", type: "number", suffix: "cents/kWh", min: 5, max: 50, defaultValue: 13 },
      { name: "waterRate", label: "Water Rate", type: "number", suffix: "per 1000 gal", min: 1, max: 30, defaultValue: 5 },
    ],
    calculate: (inputs) => {
      const people = inputs.people as number;
      const machine = inputs.machineType as string;
      const elecRate = inputs.electricRate as number;
      const waterRate = inputs.waterRate as number;
      if (!people || !elecRate || !waterRate) return null;
      const loadsPerWeek = Math.ceil(people * 1.5);
      const waterPerLoad: Record<string, number> = { "he-front": 13, "he-top": 19, standard: 40, laundromat: 25 };
      const kwhPerLoad: Record<string, number> = { "he-front": 0.5, "he-top": 0.6, standard: 1.2, laundromat: 0 };
      const laundroPerLoad = machine === "laundromat" ? 4.5 : 0;
      const waterCost = (waterPerLoad[machine] || 20) * loadsPerWeek * 4.33 / 1000 * waterRate;
      const elecCost = (kwhPerLoad[machine] || 0.5) * loadsPerWeek * 4.33 * (elecRate / 100);
      const detergentCost = loadsPerWeek * 4.33 * 0.25;
      const laundromatCost = laundroPerLoad * loadsPerWeek * 4.33;
      const monthlyCost = Math.round(waterCost + elecCost + detergentCost + laundromatCost);
      return {
        primary: { label: "Loads per Week", value: String(loadsPerWeek) },
        details: [
          { label: "Monthly Cost", value: "$" + formatNumber(monthlyCost) },
          { label: "Water per Load", value: (waterPerLoad[machine] || 20) + " gallons" },
          { label: "Annual Cost", value: "$" + formatNumber(monthlyCost * 12) },
        ],
      };
    },
  }],
  relatedSlugs: ["shower-water-usage-calculator", "dishwasher-vs-hand-wash-calculator"],
  faq: [
    { question: "How often should you do laundry?", answer: "Most households need about 1.5 loads per person per week. A family of four typically does 6-8 loads weekly." },
    { question: "Are HE washers cheaper to operate?", answer: "Yes, HE front-load washers use 40-60% less water and 20-50% less energy than standard top-load machines, saving $50-$100 per year." },
  ],
  formula: "Loads per Week = Household Members x 1.5",
};
