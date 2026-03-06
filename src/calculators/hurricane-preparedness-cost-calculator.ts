import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hurricanePreparednessCostCalculator: CalculatorDefinition = {
  slug: "hurricane-preparedness-cost-calculator",
  title: "Hurricane Preparedness Cost Calculator",
  description: "Estimate the cost of hurricane preparation including shutters, supplies, generator, and evacuation expenses by storm category.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["hurricane cost","hurricane preparedness","storm preparation","hurricane supplies","evacuation cost"],
  variants: [{
    id: "standard",
    name: "Hurricane Preparedness Cost",
    description: "Estimate the cost of hurricane preparation including shutters, supplies, generator, and evacuation expenses by storm category.",
    fields: [
      { name: "category", label: "Hurricane Category", type: "select", options: [{ value: "1", label: "Category 1 (74-95 mph)" }, { value: "2", label: "Category 2 (96-110 mph)" }, { value: "3", label: "Category 3 (111-129 mph)" }, { value: "4", label: "Category 4 (130-156 mph)" }, { value: "5", label: "Category 5 (157+ mph)" }], defaultValue: "2" },
      { name: "homeSize", label: "Home Size (sq ft)", type: "number", min: 500, max: 10000, defaultValue: 1800 },
      { name: "householdSize", label: "Household Members", type: "number", min: 1, max: 10, defaultValue: 4 },
      { name: "hasGenerator", label: "Own a Generator", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "0" },
    ],
    calculate: (inputs) => {
    const category = inputs.category as number;
    const homeSize = inputs.homeSize as number;
    const householdSize = inputs.householdSize as number;
    const hasGenerator = inputs.hasGenerator as number;
    const shutterCost = homeSize * [0.5, 1.0, 2.0, 3.5, 5.0][category - 1];
    const suppliesCost = householdSize * [75, 120, 200, 300, 400][category - 1];
    const generatorCost = hasGenerator === 1 ? 0 : (category >= 3 ? 2500 : category >= 2 ? 1500 : 0);
    const fuelCost = category * 75;
    const evacuationCost = category >= 3 ? householdSize * 250 : 0;
    const totalCost = shutterCost + suppliesCost + generatorCost + fuelCost + evacuationCost;
    const daysPrep = [1, 2, 3, 5, 7][category - 1];
    return {
      primary: { label: "Total Preparation Cost", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Storm Shutters/Protection", value: "$" + formatNumber(Math.round(shutterCost)) },
        { label: "Emergency Supplies", value: "$" + formatNumber(Math.round(suppliesCost)) },
        { label: "Generator", value: hasGenerator === 1 ? "Already owned" : "$" + formatNumber(generatorCost) },
        { label: "Fuel Costs", value: "$" + formatNumber(fuelCost) },
        { label: "Evacuation Costs", value: evacuationCost > 0 ? "$" + formatNumber(evacuationCost) : "Not needed" },
        { label: "Recommended Prep Days", value: formatNumber(daysPrep) + " days" }
      ]
    };
  },
  }],
  relatedSlugs: ["hurricane-prep-cost-calculator","flood-risk-assessment-calculator","tornado-safety-distance-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Total = Shutters + Supplies + Generator + Fuel + Evacuation; Shutters = Home Size x Category Multiplier; Supplies = Household Size x Category Rate",
};
