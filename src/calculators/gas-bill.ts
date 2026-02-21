import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gasBillCalculator: CalculatorDefinition = {
  slug: "gas-bill-calculator",
  title: "Gas Bill Calculator",
  description: "Free gas bill calculator. Estimate your monthly natural gas bill based on therms or MCF usage and your local rate.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["gas bill calculator", "natural gas calculator", "gas bill estimator", "monthly gas bill", "therms calculator"],
  variants: [
    {
      id: "therms",
      name: "Calculate by Therms",
      description: "Estimate gas bill from therms per month",
      fields: [
        { name: "therms", label: "Monthly Usage (therms)", type: "number", placeholder: "e.g. 50" },
        { name: "ratePerTherm", label: "Rate per Therm ($)", type: "number", placeholder: "e.g. 1.10", step: 0.01 },
        { name: "baseCharge", label: "Monthly Base Charge ($)", type: "number", placeholder: "e.g. 12", defaultValue: 12 },
      ],
      calculate: (inputs) => {
        const therms = inputs.therms as number;
        const rate = inputs.ratePerTherm as number;
        const baseCharge = (inputs.baseCharge as number) || 0;
        if (!therms || !rate) return null;

        const usageCost = therms * rate;
        const monthlyTotal = usageCost + baseCharge;
        const annualTotal = monthlyTotal * 12;

        // Seasonal comparison (winter ~2x average, summer ~0.5x)
        const winterMonthly = monthlyTotal * 2;
        const summerMonthly = monthlyTotal * 0.4;
        const mcf = therms / 10.37; // 1 MCF ≈ 10.37 therms

        return {
          primary: { label: "Monthly Gas Bill", value: `$${formatNumber(monthlyTotal, 2)}` },
          details: [
            { label: "Monthly usage", value: `${formatNumber(therms)} therms` },
            { label: "Equivalent MCF", value: formatNumber(mcf, 2) },
            { label: "Usage charge", value: `$${formatNumber(usageCost, 2)}` },
            { label: "Base charge", value: `$${formatNumber(baseCharge, 2)}` },
            { label: "Monthly total", value: `$${formatNumber(monthlyTotal, 2)}` },
            { label: "Annual estimate", value: `$${formatNumber(annualTotal, 2)}` },
            { label: "Est. winter month", value: `$${formatNumber(winterMonthly, 2)}` },
            { label: "Est. summer month", value: `$${formatNumber(summerMonthly, 2)}` },
          ],
          note: "Average US residential gas rate is $0.80-$1.50 per therm. Winter heating months typically use 2-3x more gas than summer. 1 MCF (1,000 cubic feet) equals approximately 10.37 therms.",
        };
      },
    },
    {
      id: "mcf",
      name: "Calculate by MCF",
      description: "Estimate gas bill from MCF (1,000 cubic feet)",
      fields: [
        { name: "mcf", label: "Monthly Usage (MCF)", type: "number", placeholder: "e.g. 5", step: 0.1 },
        { name: "ratePerMcf", label: "Rate per MCF ($)", type: "number", placeholder: "e.g. 11.00", step: 0.01 },
        { name: "baseCharge", label: "Monthly Base Charge ($)", type: "number", placeholder: "e.g. 12", defaultValue: 12 },
      ],
      calculate: (inputs) => {
        const mcf = inputs.mcf as number;
        const rate = inputs.ratePerMcf as number;
        const baseCharge = (inputs.baseCharge as number) || 0;
        if (!mcf || !rate) return null;

        const therms = mcf * 10.37;
        const usageCost = mcf * rate;
        const monthlyTotal = usageCost + baseCharge;
        const annualTotal = monthlyTotal * 12;
        const winterMonthly = monthlyTotal * 2;
        const summerMonthly = monthlyTotal * 0.4;

        return {
          primary: { label: "Monthly Gas Bill", value: `$${formatNumber(monthlyTotal, 2)}` },
          details: [
            { label: "Monthly usage", value: `${formatNumber(mcf, 1)} MCF` },
            { label: "Equivalent therms", value: formatNumber(therms, 1) },
            { label: "Usage charge", value: `$${formatNumber(usageCost, 2)}` },
            { label: "Base charge", value: `$${formatNumber(baseCharge, 2)}` },
            { label: "Monthly total", value: `$${formatNumber(monthlyTotal, 2)}` },
            { label: "Annual estimate", value: `$${formatNumber(annualTotal, 2)}` },
            { label: "Est. winter month", value: `$${formatNumber(winterMonthly, 2)}` },
            { label: "Est. summer month", value: `$${formatNumber(summerMonthly, 2)}` },
          ],
          note: "1 MCF = 1,000 cubic feet of natural gas = ~10.37 therms. Winter months use significantly more gas for heating.",
        };
      },
    },
  ],
  relatedSlugs: ["water-bill-calculator", "electricity-usage-calculator", "btu-calculator"],
  faq: [
    { question: "What is a therm of natural gas?", answer: "A therm equals 100,000 BTUs of energy. It is the standard billing unit for natural gas in many areas. One therm is roughly equivalent to 100 cubic feet of natural gas." },
    { question: "How much gas does a typical household use?", answer: "The average US household uses about 50-60 therms per month year-round. Winter months average 100-150 therms for heating, while summer months may use only 15-25 therms for water heating and cooking." },
    { question: "What is MCF?", answer: "MCF stands for 1,000 cubic feet (M = Roman numeral for 1,000). One MCF of natural gas contains approximately 10.37 therms of energy. Some utilities bill in MCF while others bill in therms." },
  ],
  formula: "Monthly Bill = (Therms x Rate per Therm) + Base Charge | 1 MCF ≈ 10.37 Therms",
};
