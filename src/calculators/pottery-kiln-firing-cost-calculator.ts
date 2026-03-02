import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const potteryKilnFiringCostCalculator: CalculatorDefinition = {
  slug: "pottery-kiln-firing-cost-calculator",
  title: "Pottery Kiln Firing Cost Calculator",
  description: "Estimate electricity or gas cost for pottery kiln firings based on kiln size, cone temperature, and energy rates.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["kiln cost","pottery firing cost","kiln electricity","ceramics firing"],
  variants: [{
    id: "standard",
    name: "Pottery Kiln Firing Cost",
    description: "Estimate electricity or gas cost for pottery kiln firings based on kiln size, cone temperature, and energy rates.",
    fields: [
      { name: "kilnKw", label: "Kiln Power (kW)", type: "number", min: 1, max: 30, defaultValue: 8 },
      { name: "coneTemp", label: "Cone Temperature", type: "select", options: [{ value: "1", label: "Cone 06 (Bisque, ~1830F)" }, { value: "2", label: "Cone 6 (Mid-Fire, ~2230F)" }, { value: "3", label: "Cone 10 (High-Fire, ~2380F)" }], defaultValue: "2" },
      { name: "electricRate", label: "Electricity Rate ($/kWh)", type: "number", min: 0.05, max: 0.5, defaultValue: 0.12 },
      { name: "firingsPerMonth", label: "Firings Per Month", type: "number", min: 1, max: 30, defaultValue: 4 },
    ],
    calculate: (inputs) => {
    const kilnKw = inputs.kilnKw as number;
    const cone = parseInt(inputs.coneTemp as string);
    const rate = inputs.electricRate as number;
    const firings = inputs.firingsPerMonth as number;
    const firingHours = { 1: 8, 2: 10, 3: 12 };
    const hours = firingHours[cone] || 10;
    const kwhPerFiring = kilnKw * hours * 0.65;
    const costPerFiring = kwhPerFiring * rate;
    const monthlyCost = costPerFiring * firings;
    const annualCost = monthlyCost * 12;
    return {
      primary: { label: "Cost Per Firing", value: "$" + formatNumber(Math.round(costPerFiring * 100) / 100) },
      details: [
        { label: "kWh Per Firing", value: formatNumber(Math.round(kwhPerFiring * 10) / 10) + " kWh" },
        { label: "Firing Duration", value: formatNumber(hours) + " hours" },
        { label: "Monthly Cost", value: "$" + formatNumber(Math.round(monthlyCost * 100) / 100) },
        { label: "Annual Cost", value: "$" + formatNumber(Math.round(annualCost * 100) / 100) }
      ]
    };
  },
  }],
  relatedSlugs: ["candle-making-wax-calculator","leather-working-cost-calculator"],
  faq: [
    { question: "How much does it cost to fire a kiln?", answer: "A typical cone 6 firing in an 8 kW kiln costs around 5 to 8 dollars in electricity at average US rates. Larger kilns and higher temperatures increase the cost." },
    { question: "Why is the duty cycle 65 percent?", answer: "Electric kilns cycle their elements on and off to maintain temperature. On average they draw about 65 percent of their rated power over a full firing cycle." },
    { question: "Is gas or electric cheaper for pottery firing?", answer: "Gas kilns can be cheaper at high temperatures (cone 10) but have higher upfront costs. Electric kilns are simpler and more common for home potters." },
  ],
  formula: "kWh Per Firing = Kiln kW x Firing Hours x 0.65 (duty cycle)
Cost Per Firing = kWh x Electricity Rate
Monthly Cost = Cost Per Firing x Firings Per Month",
};
