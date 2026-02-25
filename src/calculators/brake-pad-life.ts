import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const brakePadLifeCalculator: CalculatorDefinition = {
  slug: "brake-pad-life-calculator",
  title: "Brake Pad Life Calculator",
  description: "Free brake pad life calculator. Estimate when your brake pads need replacement based on thickness, driving style, and mileage.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["brake pad life", "brake pad calculator", "brake pad replacement", "brake wear calculator", "brake pad mileage"],
  variants: [
    {
      id: "remaining",
      name: "Brake Pad Life Remaining",
      description: "Estimate remaining brake pad life",
      fields: [
        { name: "currentThickness", label: "Current Pad Thickness", type: "number", placeholder: "e.g. 6", suffix: "mm" },
        { name: "newThickness", label: "New Pad Thickness", type: "number", placeholder: "e.g. 12", suffix: "mm" },
        { name: "minThickness", label: "Minimum Safe Thickness", type: "number", placeholder: "e.g. 3", suffix: "mm" },
        { name: "milesSinceNew", label: "Miles Since New Pads", type: "number", placeholder: "e.g. 25000", suffix: "miles" },
        { name: "annualMiles", label: "Annual Miles Driven", type: "number", placeholder: "e.g. 12000" },
      ],
      calculate: (inputs) => {
        const current = inputs.currentThickness as number;
        const newThick = (inputs.newThickness as number) || 12;
        const minThick = (inputs.minThickness as number) || 3;
        const milesDone = (inputs.milesSinceNew as number) || 0;
        const annual = (inputs.annualMiles as number) || 12000;
        if (!current) return null;

        const usableThickness = newThick - minThick;
        const wornThickness = newThick - current;
        const remainingThickness = current - minThick;
        const percentRemaining = Math.max(0, (remainingThickness / usableThickness) * 100);

        let remainingMiles = 0;
        if (milesDone > 0 && wornThickness > 0) {
          const wearRatePerMile = wornThickness / milesDone;
          remainingMiles = remainingThickness / wearRatePerMile;
        }
        const monthsRemaining = annual > 0 ? (remainingMiles / annual) * 12 : 0;

        return {
          primary: { label: "Brake Pad Life", value: `${formatNumber(percentRemaining, 0)}%` },
          details: [
            { label: "Remaining thickness", value: `${formatNumber(remainingThickness, 1)} mm` },
            { label: "Estimated miles remaining", value: remainingMiles > 0 ? `${formatNumber(remainingMiles, 0)} miles` : "Enter miles since new" },
            { label: "Estimated months remaining", value: remainingMiles > 0 ? `${formatNumber(monthsRemaining, 0)} months` : "N/A" },
            { label: "Current thickness", value: `${current} mm` },
            { label: "Replace below", value: `${minThick} mm` },
          ],
        };
      },
    },
    {
      id: "cost",
      name: "Brake Replacement Cost",
      description: "Estimate brake pad replacement costs",
      fields: [
        { name: "padCost", label: "Brake Pad Set Cost", type: "number", placeholder: "e.g. 50", prefix: "$" },
        { name: "rotorCost", label: "Rotor Pair Cost (if needed)", type: "number", placeholder: "e.g. 120", prefix: "$" },
        { name: "laborCost", label: "Labor Cost", type: "number", placeholder: "e.g. 150", prefix: "$" },
        { name: "axles", label: "Number of Axles", type: "select", options: [
          { label: "Front only", value: "1" },
          { label: "Front and rear", value: "2" },
        ], defaultValue: "1" },
        { name: "includeRotors", label: "Replace Rotors?", type: "select", options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ], defaultValue: "no" },
      ],
      calculate: (inputs) => {
        const padCost = (inputs.padCost as number) || 0;
        const rotorCost = (inputs.rotorCost as number) || 0;
        const labor = (inputs.laborCost as number) || 0;
        const axles = parseInt(inputs.axles as string) || 1;
        const includeRotors = (inputs.includeRotors as string) === "yes";

        const totalPads = padCost * axles;
        const totalRotors = includeRotors ? rotorCost * axles : 0;
        const totalLabor = labor * axles;
        const grandTotal = totalPads + totalRotors + totalLabor;

        return {
          primary: { label: "Total Brake Job Cost", value: `$${formatNumber(grandTotal)}` },
          details: [
            { label: "Brake pads", value: `$${formatNumber(totalPads)}` },
            { label: "Rotors", value: includeRotors ? `$${formatNumber(totalRotors)}` : "Not included" },
            { label: "Labor", value: `$${formatNumber(totalLabor)}` },
            { label: "Axles serviced", value: `${axles}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["car-maintenance-cost-calculator", "tire-wear-calculator"],
  faq: [
    { question: "How long do brake pads last?", answer: "Brake pads typically last 30,000-70,000 miles depending on driving style, vehicle weight, and pad material. City driving with frequent stops wears pads faster than highway driving." },
    { question: "How do I know when brake pads need replacing?", answer: "Warning signs include squealing or grinding noises, longer stopping distances, brake pedal vibration, and the brake warning light. Most pads have built-in wear indicators that squeal when pads are thin." },
  ],
  formula: "Remaining Life % = (Current - Minimum) / (New - Minimum) × 100",
};
