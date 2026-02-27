import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const christmasLightCostCalculator: CalculatorDefinition = {
  slug: "christmas-light-cost-calculator",
  title: "Christmas Lights Electricity Cost Calculator",
  description:
    "Calculate how much your Christmas lights cost in electricity. Compare LED vs incandescent lights and estimate your holiday season electric bill impact.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "christmas lights cost",
    "holiday lights electricity",
    "LED vs incandescent",
    "christmas electric bill",
    "holiday lights calculator",
  ],
  variants: [
    {
      id: "standard",
      name: "Standard Calculation",
      description: "Calculate cost for a set number of light strings",
      fields: [
        { name: "numStrings", label: "Number of Light Strings", type: "number", placeholder: "e.g. 10", defaultValue: 10 },
        { name: "wattsPerString", label: "Watts per String", type: "number", placeholder: "e.g. 40", defaultValue: 40 },
        { name: "hoursPerDay", label: "Hours On per Day", type: "number", placeholder: "e.g. 6", defaultValue: 6 },
        { name: "numDays", label: "Number of Days Displayed", type: "number", placeholder: "e.g. 30", defaultValue: 30 },
        { name: "electricRate", label: "Electric Rate ($/kWh)", type: "number", placeholder: "e.g. 0.13", defaultValue: 0.13 },
      ],
      calculate: (inputs) => {
        const numStrings = parseFloat(inputs.numStrings as string);
        const wattsPerString = parseFloat(inputs.wattsPerString as string);
        const hoursPerDay = parseFloat(inputs.hoursPerDay as string);
        const numDays = parseFloat(inputs.numDays as string);
        const electricRate = parseFloat(inputs.electricRate as string);

        if (isNaN(numStrings) || isNaN(wattsPerString) || isNaN(hoursPerDay) || isNaN(numDays) || isNaN(electricRate)) return null;

        const totalWatts = numStrings * wattsPerString;
        const totalKWh = (totalWatts / 1000) * hoursPerDay * numDays;
        const totalCost = totalKWh * electricRate;
        const dailyCost = totalCost / numDays;

        return {
          primary: { label: "Total Electricity Cost", value: `$${formatNumber(totalCost, 2)}` },
          details: [
            { label: "Total Power Draw", value: `${formatNumber(totalWatts, 0)} watts` },
            { label: "Total Energy Used", value: `${formatNumber(totalKWh, 2)} kWh` },
            { label: "Daily Cost", value: `$${formatNumber(dailyCost, 3)}` },
            { label: "Cost per String (season)", value: `$${formatNumber(totalCost / numStrings, 3)}` },
          ],
        };
      },
    },
    {
      id: "ledComparison",
      name: "LED vs Incandescent Comparison",
      description: "Compare cost of LED lights versus traditional incandescent lights",
      fields: [
        { name: "numStrings", label: "Number of Light Strings", type: "number", placeholder: "e.g. 10", defaultValue: 10 },
        { name: "incandescentWatts", label: "Incandescent Watts/String", type: "number", placeholder: "e.g. 40", defaultValue: 40 },
        { name: "ledWatts", label: "LED Watts/String", type: "number", placeholder: "e.g. 5", defaultValue: 5 },
        { name: "hoursPerDay", label: "Hours On per Day", type: "number", placeholder: "e.g. 6", defaultValue: 6 },
        { name: "numDays", label: "Number of Days Displayed", type: "number", placeholder: "e.g. 30", defaultValue: 30 },
        { name: "electricRate", label: "Electric Rate ($/kWh)", type: "number", placeholder: "e.g. 0.13", defaultValue: 0.13 },
      ],
      calculate: (inputs) => {
        const numStrings = parseFloat(inputs.numStrings as string);
        const incandescentWatts = parseFloat(inputs.incandescentWatts as string);
        const ledWatts = parseFloat(inputs.ledWatts as string);
        const hoursPerDay = parseFloat(inputs.hoursPerDay as string);
        const numDays = parseFloat(inputs.numDays as string);
        const electricRate = parseFloat(inputs.electricRate as string);

        if (isNaN(numStrings) || isNaN(incandescentWatts) || isNaN(ledWatts) || isNaN(hoursPerDay) || isNaN(numDays) || isNaN(electricRate)) return null;

        const incanKWh = (numStrings * incandescentWatts / 1000) * hoursPerDay * numDays;
        const ledKWh = (numStrings * ledWatts / 1000) * hoursPerDay * numDays;
        const incanCost = incanKWh * electricRate;
        const ledCost = ledKWh * electricRate;
        const savings = incanCost - ledCost;
        const savingsPercent = incanCost > 0 ? (savings / incanCost) * 100 : 0;

        return {
          primary: { label: "LED Season Savings", value: `$${formatNumber(savings, 2)}` },
          details: [
            { label: "Incandescent Cost", value: `$${formatNumber(incanCost, 2)}` },
            { label: "LED Cost", value: `$${formatNumber(ledCost, 2)}` },
            { label: "Savings Percentage", value: `${formatNumber(savingsPercent, 1)}%` },
            { label: "Incandescent kWh", value: formatNumber(incanKWh, 2) },
            { label: "LED kWh", value: formatNumber(ledKWh, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["christmas-budget-calculator", "electricity-cost-calculator", "energy-calculator"],
  faq: [
    {
      question: "How much do Christmas lights add to my electric bill?",
      answer:
        "A typical display of 10 incandescent light strings running 6 hours a day for 30 days adds roughly $10-$15 to your bill. Switching to LED reduces this to about $1-$2 for the same display.",
    },
    {
      question: "Are LED Christmas lights worth the extra cost?",
      answer:
        "Yes. LED lights use about 80-90% less electricity than incandescent lights and last 10-25 times longer. The higher upfront cost is typically recouped within 1-2 holiday seasons.",
    },
  ],
  formula:
    "Total Cost = (Number of Strings × Watts per String / 1000) × Hours per Day × Days × Electric Rate ($/kWh)",
};
