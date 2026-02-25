import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hybridSavingsCalculator: CalculatorDefinition = {
  slug: "hybrid-savings-calculator",
  title: "Hybrid vs Gas Savings",
  description: "Free hybrid vs gas savings calculator. Compare fuel costs and total savings between a hybrid and a conventional gas vehicle.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["hybrid vs gas savings", "hybrid car savings", "hybrid fuel savings", "hybrid cost comparison", "is hybrid worth it"],
  variants: [
    {
      id: "fuel",
      name: "Fuel Savings",
      description: "Compare fuel costs between hybrid and gas vehicles",
      fields: [
        { name: "annualMiles", label: "Annual Miles Driven", type: "number", placeholder: "e.g. 12000" },
        { name: "gasMpg", label: "Gas Car MPG", type: "number", placeholder: "e.g. 28", suffix: "MPG" },
        { name: "hybridMpg", label: "Hybrid MPG", type: "number", placeholder: "e.g. 50", suffix: "MPG" },
        { name: "gasPrice", label: "Gas Price per Gallon", type: "number", placeholder: "e.g. 3.50", prefix: "$", step: 0.01 },
        { name: "years", label: "Ownership Period", type: "number", placeholder: "e.g. 5", suffix: "years" },
      ],
      calculate: (inputs) => {
        const miles = inputs.annualMiles as number;
        const gasMpg = inputs.gasMpg as number;
        const hybridMpg = inputs.hybridMpg as number;
        const price = inputs.gasPrice as number;
        const years = (inputs.years as number) || 5;
        if (!miles || !gasMpg || !hybridMpg || !price) return null;

        const gasAnnual = (miles / gasMpg) * price;
        const hybridAnnual = (miles / hybridMpg) * price;
        const annualSavings = gasAnnual - hybridAnnual;
        const totalSavings = annualSavings * years;
        const gasGallonsYear = miles / gasMpg;
        const hybridGallonsYear = miles / hybridMpg;

        return {
          primary: { label: "Annual Fuel Savings", value: `$${formatNumber(annualSavings)}` },
          details: [
            { label: "Gas car annual fuel", value: `$${formatNumber(gasAnnual)}` },
            { label: "Hybrid annual fuel", value: `$${formatNumber(hybridAnnual)}` },
            { label: `Total savings (${years} yr)`, value: `$${formatNumber(totalSavings)}` },
            { label: "Gas car gallons/year", value: formatNumber(gasGallonsYear, 0) },
            { label: "Hybrid gallons/year", value: formatNumber(hybridGallonsYear, 0) },
            { label: "Gallons saved/year", value: formatNumber(gasGallonsYear - hybridGallonsYear, 0) },
          ],
        };
      },
    },
    {
      id: "breakeven",
      name: "Hybrid Break-Even",
      description: "Calculate when the hybrid premium pays for itself",
      fields: [
        { name: "hybridPrice", label: "Hybrid Price", type: "number", placeholder: "e.g. 32000", prefix: "$" },
        { name: "gasPrice", label: "Gas Car Price", type: "number", placeholder: "e.g. 27000", prefix: "$" },
        { name: "annualMiles", label: "Annual Miles Driven", type: "number", placeholder: "e.g. 12000" },
        { name: "hybridMpg", label: "Hybrid MPG", type: "number", placeholder: "e.g. 50", suffix: "MPG" },
        { name: "gasMpg", label: "Gas Car MPG", type: "number", placeholder: "e.g. 28", suffix: "MPG" },
        { name: "fuelPrice", label: "Gas Price per Gallon", type: "number", placeholder: "e.g. 3.50", prefix: "$", step: 0.01 },
      ],
      calculate: (inputs) => {
        const hybridCost = inputs.hybridPrice as number;
        const gasCost = inputs.gasPrice as number;
        const miles = inputs.annualMiles as number;
        const hybridMpg = inputs.hybridMpg as number;
        const gasMpg = inputs.gasMpg as number;
        const fuelPrice = inputs.fuelPrice as number;
        if (!hybridCost || !gasCost || !miles || !hybridMpg || !gasMpg || !fuelPrice) return null;

        const premium = hybridCost - gasCost;
        const annualGasSavings = ((miles / gasMpg) - (miles / hybridMpg)) * fuelPrice;
        const breakEvenYears = annualGasSavings > 0 ? premium / annualGasSavings : Infinity;

        return {
          primary: { label: "Break-Even Point", value: breakEvenYears < 100 ? `${formatNumber(breakEvenYears, 1)} years` : "Never" },
          details: [
            { label: "Hybrid premium", value: `$${formatNumber(premium)}` },
            { label: "Annual fuel savings", value: `$${formatNumber(annualGasSavings)}` },
            { label: "Monthly fuel savings", value: `$${formatNumber(annualGasSavings / 12)}` },
            { label: "Break-even mileage", value: `${formatNumber(breakEvenYears * miles, 0)} miles` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ev-savings-calculator", "fuel-cost-calculator", "car-total-cost-calculator"],
  faq: [
    { question: "Is a hybrid car worth the extra cost?", answer: "If you drive 12,000+ miles per year and gas costs $3.50+/gallon, a hybrid typically pays for its premium in 3-6 years through fuel savings. High-mileage drivers and those in stop-and-go traffic benefit most." },
    { question: "Do hybrids really save money on gas?", answer: "Yes. A hybrid getting 50 MPG vs a gas car getting 28 MPG saves about $600-$900 per year in fuel at current gas prices. Savings increase with higher gas prices and more miles driven." },
  ],
  formula: "Break-Even Years = (Hybrid Price - Gas Price) / ((Miles/Gas MPG - Miles/Hybrid MPG) × Fuel Price)",
};
