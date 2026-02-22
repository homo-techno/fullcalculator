import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const electricVsGasCalculator: CalculatorDefinition = {
  slug: "electric-vs-gas-calculator",
  title: "Electric vs Gas Car Cost Comparison Calculator",
  description:
    "Free electric vs gas car cost comparison calculator. Compare total ownership costs including fuel, maintenance, and environmental impact.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "electric vs gas",
    "ev comparison",
    "electric car cost",
    "gas car cost",
    "ev vs ice",
    "electric vehicle savings",
  ],
  variants: [
    {
      id: "compare",
      name: "EV vs Gas Comparison",
      fields: [
        {
          name: "annualMiles",
          label: "Annual Miles Driven",
          type: "number",
          placeholder: "e.g. 12000",
        },
        {
          name: "gasPrice",
          label: "Gas Price ($/gallon)",
          type: "number",
          placeholder: "e.g. 3.50",
        },
        {
          name: "gasMpg",
          label: "Gas Car MPG",
          type: "number",
          placeholder: "e.g. 28",
        },
        {
          name: "electricRate",
          label: "Electricity Rate ($/kWh)",
          type: "number",
          placeholder: "e.g. 0.13",
          defaultValue: 0.13,
        },
        {
          name: "evEfficiency",
          label: "EV Efficiency",
          type: "select",
          options: [
            { label: "Efficient (3.0 mi/kWh)", value: "3.0" },
            { label: "Average (3.5 mi/kWh)", value: "3.5" },
            { label: "Very Efficient (4.0 mi/kWh)", value: "4.0" },
            { label: "Large EV/Truck (2.5 mi/kWh)", value: "2.5" },
          ],
        },
        {
          name: "years",
          label: "Ownership Period (years)",
          type: "number",
          placeholder: "e.g. 5",
          defaultValue: 5,
        },
      ],
      calculate: (inputs) => {
        const annualMiles = inputs.annualMiles as number;
        const gasPrice = inputs.gasPrice as number;
        const gasMpg = inputs.gasMpg as number;
        const electricRate = (inputs.electricRate as number) || 0.13;
        const evEfficiency = parseFloat((inputs.evEfficiency as string) || "3.5");
        const years = (inputs.years as number) || 5;
        if (!annualMiles || !gasPrice || !gasMpg) return null;

        // Annual fuel costs
        const annualGasCost = (annualMiles / gasMpg) * gasPrice;
        const annualElecCost = (annualMiles / evEfficiency) * electricRate;
        const annualFuelSavings = annualGasCost - annualElecCost;

        // Maintenance costs (EV is ~40% less)
        const gasMaintenancePerMile = 0.09;
        const evMaintenancePerMile = 0.06;
        const annualGasMaint = annualMiles * gasMaintenancePerMile;
        const annualEvMaint = annualMiles * evMaintenancePerMile;
        const annualMaintSavings = annualGasMaint - annualEvMaint;

        const totalAnnualSavings = annualFuelSavings + annualMaintSavings;
        const totalSavings = totalAnnualSavings * years;

        // CO2 comparison
        const gasCO2Lbs = (annualMiles / gasMpg) * 19.6;
        const evCO2Lbs = (annualMiles / evEfficiency) * 0.92; // grid electricity
        const co2Savings = gasCO2Lbs - evCO2Lbs;

        return {
          primary: {
            label: "Annual EV Savings",
            value: "$" + formatNumber(totalAnnualSavings, 0),
          },
          details: [
            { label: "Gas Annual Fuel Cost", value: "$" + formatNumber(annualGasCost, 0) },
            { label: "EV Annual Fuel Cost", value: "$" + formatNumber(annualElecCost, 0) },
            { label: "Annual Fuel Savings", value: "$" + formatNumber(annualFuelSavings, 0) },
            { label: "Annual Maintenance Savings", value: "$" + formatNumber(annualMaintSavings, 0) },
            { label: years + "-Year Total Savings", value: "$" + formatNumber(totalSavings, 0) },
            { label: "Annual CO2 Reduction", value: formatNumber(co2Savings, 0) + " lbs" },
            { label: "Gas Car CO2/Year", value: formatNumber(gasCO2Lbs, 0) + " lbs" },
            { label: "EV CO2/Year", value: formatNumber(evCO2Lbs, 0) + " lbs" },
          ],
          note: "This comparison focuses on operating costs. EV purchase prices are typically higher but federal/state incentives can offset the difference. Charging at home overnight is usually cheapest.",
        };
      },
    },
  ],
  relatedSlugs: ["ev-charging-calculator", "carbon-footprint-calculator"],
  faq: [
    {
      question: "Are electric cars really cheaper to operate?",
      answer:
        "Yes. EVs typically cost $0.03-0.05 per mile for electricity vs $0.10-0.15 per mile for gasoline. EVs also have lower maintenance costs due to fewer moving parts, no oil changes, and regenerative braking that reduces brake wear.",
    },
    {
      question: "How do EV emissions compare to gas cars?",
      answer:
        "Even accounting for electricity generation, EVs produce 50-70% fewer lifecycle emissions than gas cars in most regions. As the grid gets cleaner, this advantage grows. In areas with clean electricity, EVs can produce up to 90% fewer emissions.",
    },
  ],
  formula:
    "Annual Fuel: Gas = (Miles / MPG) x Gas Price, EV = (Miles / mi/kWh) x Rate. Maintenance: Gas $0.09/mi, EV $0.06/mi. Total Savings = Fuel Savings + Maintenance Savings.",
};
