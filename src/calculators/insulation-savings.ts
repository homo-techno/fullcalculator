import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const insulationSavingsCalculator: CalculatorDefinition = {
  slug: "insulation-savings-calculator",
  title: "Insulation Energy Savings Calculator",
  description:
    "Free insulation energy savings calculator. Estimate how much you can save on heating and cooling by upgrading your home insulation.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "insulation savings",
    "insulation r-value",
    "home insulation",
    "energy savings insulation",
    "attic insulation",
    "wall insulation",
  ],
  variants: [
    {
      id: "upgrade",
      name: "Insulation Upgrade Savings",
      fields: [
        {
          name: "annualHeatingCooling",
          label: "Annual Heating/Cooling Cost ($)",
          type: "number",
          placeholder: "e.g. 2000",
        },
        {
          name: "currentInsulation",
          label: "Current Insulation Level",
          type: "select",
          options: [
            { label: "None / Very Poor (R-0 to R-5)", value: "poor" },
            { label: "Below Standard (R-5 to R-13)", value: "below" },
            { label: "Standard (R-13 to R-19)", value: "standard" },
            { label: "Good (R-19 to R-30)", value: "good" },
            { label: "Excellent (R-30+)", value: "excellent" },
          ],
        },
        {
          name: "targetInsulation",
          label: "Target Insulation Level",
          type: "select",
          options: [
            { label: "Standard (R-13 to R-19)", value: "standard" },
            { label: "Good (R-19 to R-30)", value: "good" },
            { label: "Excellent (R-30 to R-49)", value: "excellent" },
            { label: "Superior (R-49+)", value: "superior" },
          ],
        },
        {
          name: "area",
          label: "Area to Insulate (sq ft)",
          type: "number",
          placeholder: "e.g. 1500",
        },
        {
          name: "location",
          label: "Insulation Location",
          type: "select",
          options: [
            { label: "Attic", value: "attic" },
            { label: "Walls", value: "walls" },
            { label: "Basement/Crawlspace", value: "basement" },
            { label: "Whole House", value: "whole" },
          ],
        },
      ],
      calculate: (inputs) => {
        const annualCost = inputs.annualHeatingCooling as number;
        const current = (inputs.currentInsulation as string) || "below";
        const target = (inputs.targetInsulation as string) || "good";
        const area = (inputs.area as number) || 0;
        const location = (inputs.location as string) || "attic";
        if (!annualCost) return null;

        const savingsRates: Record<string, Record<string, number>> = {
          poor: { standard: 0.25, good: 0.35, excellent: 0.42, superior: 0.45 },
          below: { standard: 0.15, good: 0.25, excellent: 0.32, superior: 0.35 },
          standard: { standard: 0, good: 0.12, excellent: 0.20, superior: 0.25 },
          good: { standard: 0, good: 0, excellent: 0.10, superior: 0.15 },
          excellent: { standard: 0, good: 0, excellent: 0, superior: 0.05 },
        };

        const locationMultiplier: Record<string, number> = {
          attic: 0.6,
          walls: 0.25,
          basement: 0.15,
          whole: 1.0,
        };

        const baseSavingsRate = savingsRates[current]?.[target] || 0;
        const effectiveSavingsRate = baseSavingsRate * (locationMultiplier[location] || 1.0);
        const annualSavings = annualCost * effectiveSavingsRate;

        // Installation cost estimate
        const costPerSqFt: Record<string, number> = {
          attic: 1.5,
          walls: 3.5,
          basement: 2.0,
          whole: 2.5,
        };
        const installCost = area ? area * (costPerSqFt[location] || 2.5) : 0;
        const paybackYears = annualSavings > 0 && installCost > 0 ? installCost / annualSavings : 0;

        const co2SavedLbs = (annualSavings / 0.13) * 0.92; // kWh equivalent

        return {
          primary: {
            label: "Annual Energy Savings",
            value: "$" + formatNumber(annualSavings, 0),
          },
          details: [
            { label: "Savings Rate", value: formatNumber(effectiveSavingsRate * 100, 1) + "%" },
            { label: "Estimated Install Cost", value: area ? "$" + formatNumber(installCost, 0) : "Enter area for estimate" },
            { label: "Payback Period", value: paybackYears > 0 ? formatNumber(paybackYears, 1) + " years" : "N/A" },
            { label: "10-Year Savings", value: "$" + formatNumber(annualSavings * 10, 0) },
            { label: "CO2 Reduced/Year", value: formatNumber(co2SavedLbs, 0) + " lbs" },
            { label: "Location Impact", value: formatNumber((locationMultiplier[location] || 1) * 100, 0) + "% of total" },
          ],
          note: "Attic insulation provides the most savings per dollar. Heat rises, so an under-insulated attic is the biggest source of energy waste in most homes.",
        };
      },
    },
  ],
  relatedSlugs: ["energy-audit-calculator", "window-efficiency-calculator"],
  faq: [
    {
      question: "What R-value do I need?",
      answer:
        "Recommended R-values depend on your climate zone. Attics: R-30 to R-60. Walls: R-13 to R-21. Floors: R-13 to R-30. Colder climates need higher R-values. Check the DOE guidelines for your specific zone.",
    },
    {
      question: "Which insulation type is best?",
      answer:
        "Fiberglass batts are cheapest but may leave gaps. Blown-in cellulose fills cavities well. Spray foam has the highest R-value per inch and provides air sealing. The best choice depends on location, budget, and existing construction.",
    },
  ],
  formula:
    "Annual Savings = Heating/Cooling Cost x Savings Rate x Location Multiplier. Payback = Install Cost / Annual Savings. Install Cost = Area x Cost per sq ft.",
};
