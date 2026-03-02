import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const laundryLoadCalculator: CalculatorDefinition = {
  slug: "laundry-load-calculator",
  title: "Laundry Load Calculator",
  description: "Estimate weekly laundry loads from household size.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["laundry","loads","household","weekly"],
  variants: [{
    id: "standard",
    name: "Laundry Load",
    description: "Estimate weekly laundry loads from household size.",
    fields: [
      { name: "adults", label: "Number of Adults", type: "number", min: 1, max: 10, defaultValue: 2 },
      { name: "children", label: "Number of Children", type: "number", min: 0, max: 10, defaultValue: 2 },
      { name: "activity", label: "Activity Level", type: "select", options: [{ value: "0.8", label: "Low" }, { value: "1", label: "Average" }, { value: "1.4", label: "Active/Sports" }] },
    ],
    calculate: (inputs) => {
    const adults = inputs.adults as number;
    const children = inputs.children as number;
    const activity = inputs.activity as number;
    const adultLoads = adults * 2.5 * activity;
    const childLoads = children * 2 * activity;
    const weeklyLoads = Math.ceil(adultLoads + childLoads);
    const monthlyLoads = Math.ceil(weeklyLoads * 4.33);
    const yearlyLoads = weeklyLoads * 52;
    return { primary: { label: "Loads Per Week", value: formatNumber(weeklyLoads) }, details: [{ label: "Adult Loads", value: adultLoads.toFixed(1) + " per week" }, { label: "Child Loads", value: childLoads.toFixed(1) + " per week" }, { label: "Monthly Loads", value: formatNumber(monthlyLoads) }, { label: "Yearly Loads", value: formatNumber(yearlyLoads) }] };
  },
  }],
  relatedSlugs: ["laundry-cost-calculator","dryer-energy-cost-calculator","clothesline-savings-calculator"],
  faq: [
    { question: "How many loads of laundry per week is normal?", answer: "About 5 to 8 loads per week for a family of four." },
    { question: "Do children create more laundry?", answer: "Children generate about 2 loads per week each." },
    { question: "How can I reduce laundry loads?", answer: "Wear items more than once when appropriate." },
  ],
  formula: "WeeklyLoads = Adults * 2.5 * Activity + Children * 2 * Activity",
};
