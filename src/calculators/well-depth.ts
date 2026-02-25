import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wellDepthCalculator: CalculatorDefinition = {
  slug: "well-depth-cost-calculator",
  title: "Well Depth Cost Calculator",
  description: "Free well depth cost calculator. Estimate the cost of drilling a residential water well based on depth, casing, pump, and local conditions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["well drilling cost", "well depth calculator", "water well cost", "how much to drill a well", "well installation cost"],
  variants: [
    {
      id: "drilling",
      name: "Well Drilling Cost",
      fields: [
        { name: "depth", label: "Estimated Well Depth (feet)", type: "number", placeholder: "e.g. 200" },
        { name: "casingType", label: "Casing Material", type: "select", options: [
          { label: "PVC ($6-10/ft)", value: "8" },
          { label: "Steel ($10-20/ft)", value: "15" },
          { label: "Stainless steel ($20-35/ft)", value: "27" },
        ], defaultValue: "15" },
        { name: "terrain", label: "Terrain / Rock Type", type: "select", options: [
          { label: "Soft soil/sand ($15-25/ft)", value: "20" },
          { label: "Clay/sediment ($20-35/ft)", value: "28" },
          { label: "Soft rock/limestone ($25-45/ft)", value: "35" },
          { label: "Hard rock/granite ($35-65/ft)", value: "50" },
        ], defaultValue: "28" },
        { name: "pumpType", label: "Pump Type", type: "select", options: [
          { label: "Submersible (standard) - $800-2,000", value: "1400" },
          { label: "Jet pump (shallow) - $400-800", value: "600" },
          { label: "High-capacity submersible - $2,000-4,000", value: "3000" },
        ], defaultValue: "1400" },
      ],
      calculate: (inputs) => {
        const depth = inputs.depth as number;
        const casingCost = parseFloat(inputs.casingType as string) || 15;
        const drillingCost = parseFloat(inputs.terrain as string) || 28;
        const pumpCost = parseInt(inputs.pumpType as string) || 1400;
        if (!depth) return null;
        const drilling = depth * drillingCost;
        const casing = depth * casingCost;
        const permits = 350;
        const pressureTank = 500;
        const wellCap = 200;
        const waterTesting = 250;
        const totalCost = drilling + casing + pumpCost + permits + pressureTank + wellCap + waterTesting;
        const gallonsPerMinute = depth < 100 ? "3-8" : depth < 300 ? "5-15" : "8-25";
        return {
          primary: { label: "Estimated Well Cost", value: `$${formatNumber(totalCost)}` },
          details: [
            { label: "Drilling cost", value: `$${formatNumber(drilling)}` },
            { label: "Casing", value: `$${formatNumber(casing)}` },
            { label: "Pump", value: `$${formatNumber(pumpCost)}` },
            { label: "Pressure tank", value: `$${formatNumber(pressureTank)}` },
            { label: "Permits & testing", value: `$${formatNumber(permits + waterTesting)}` },
            { label: "Well cap & seal", value: `$${formatNumber(wellCap)}` },
            { label: "Well depth", value: `${depth} feet` },
            { label: "Expected flow rate", value: `${gallonsPerMinute} GPM` },
          ],
          note: "Actual depth may vary. Many drillers charge a minimum fee regardless of depth. Get multiple quotes.",
        };
      },
    },
  ],
  relatedSlugs: ["septic-tank-size-calculator", "water-softener-size-calculator", "water-intake-calculator"],
  faq: [
    { question: "How much does it cost to drill a well?", answer: "Average residential well costs $3,000-$15,000. Shallow wells (25-50 ft): $1,500-$5,000. Average depth (100-300 ft): $5,000-$12,000. Deep wells (300+ ft): $10,000-$30,000+. Drilling through hard rock and adding a pump, pressure tank, and permits adds significantly to the base drilling cost." },
  ],
  formula: "Total = (Depth × Drilling/ft) + (Depth × Casing/ft) + Pump + Pressure Tank + Permits + Testing",
};
