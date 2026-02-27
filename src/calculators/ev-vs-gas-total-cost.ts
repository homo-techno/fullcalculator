import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const evVsGasTotalCostCalculator: CalculatorDefinition = {
  slug: "ev-vs-gas-total-cost-calculator",
  title: "EV vs Gas Total Cost of Ownership Calculator",
  description:
    "Compare the 5 or 10-year total cost of owning an electric vehicle versus a gas car. Includes purchase price, fuel, maintenance, insurance, depreciation, and tax credits.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "ev vs gas cost",
    "electric vs gas car",
    "total cost of ownership",
    "ev tco",
    "ev savings",
    "electric car cost comparison",
  ],
  variants: [
    {
      id: "detailed",
      name: "Detailed 10-Year Comparison",
      description: "Full total cost of ownership comparison over 10 years",
      fields: [
        { name: "evPrice", label: "EV Purchase Price ($)", type: "number", placeholder: "e.g. 42000" },
        { name: "gasPrice", label: "Gas Car Purchase Price ($)", type: "number", placeholder: "e.g. 32000" },
        { name: "annualMiles", label: "Annual Miles Driven", type: "number", placeholder: "e.g. 12000" },
        { name: "years", label: "Ownership Period (years)", type: "number", placeholder: "e.g. 10" },
        { name: "electricityRate", label: "Electricity Rate ($/kWh)", type: "number", placeholder: "e.g. 0.13", step: 0.01 },
        { name: "gasRate", label: "Gas Price ($/gallon)", type: "number", placeholder: "e.g. 3.50", step: 0.01 },
        { name: "evEfficiency", label: "EV Efficiency (mi/kWh)", type: "number", placeholder: "e.g. 3.5", step: 0.1 },
        { name: "gasMpg", label: "Gas Car MPG", type: "number", placeholder: "e.g. 30" },
        { name: "evTaxCredit", label: "EV Federal Tax Credit ($)", type: "number", placeholder: "e.g. 7500" },
        { name: "evInsurance", label: "EV Annual Insurance ($)", type: "number", placeholder: "e.g. 1800" },
        { name: "gasInsurance", label: "Gas Car Annual Insurance ($)", type: "number", placeholder: "e.g. 1500" },
        { name: "fuelInflation", label: "Annual Fuel Price Increase (%)", type: "number", placeholder: "e.g. 3", step: 0.1 },
      ],
      calculate: (inputs) => {
        const evPrice = parseFloat(inputs.evPrice as string);
        const gasPurchasePrice = parseFloat(inputs.gasPrice as string);
        const annualMiles = parseFloat(inputs.annualMiles as string);
        const years = parseFloat(inputs.years as string);
        const electricityRate = parseFloat(inputs.electricityRate as string);
        const gasRate = parseFloat(inputs.gasRate as string);
        const evEfficiency = parseFloat(inputs.evEfficiency as string);
        const gasMpg = parseFloat(inputs.gasMpg as string);
        const evTaxCredit = parseFloat(inputs.evTaxCredit as string) || 0;
        const evInsurance = parseFloat(inputs.evInsurance as string) || 0;
        const gasInsurance = parseFloat(inputs.gasInsurance as string) || 0;
        const fuelInflation = parseFloat(inputs.fuelInflation as string) || 3;

        if (!evPrice || !gasPurchasePrice || !annualMiles || !years || !electricityRate || !gasRate || !evEfficiency || !gasMpg) return null;

        let totalEvFuel = 0;
        let totalGasFuel = 0;
        for (let y = 0; y < years; y++) {
          const inflationFactor = Math.pow(1 + fuelInflation / 100, y);
          totalEvFuel += (annualMiles / evEfficiency) * electricityRate * inflationFactor;
          totalGasFuel += (annualMiles / gasMpg) * gasRate * inflationFactor;
        }

        const evMaintenancePerMile = 0.04;
        const gasMaintenancePerMile = 0.09;
        const evMaintenance = annualMiles * evMaintenancePerMile * years;
        const gasMaintenance = annualMiles * gasMaintenancePerMile * years;

        const evDepreciationRate = 0.50;
        const gasDepreciationRate = 0.55;
        const evResidual = evPrice * (1 - evDepreciationRate);
        const gasResidual = gasPurchasePrice * (1 - gasDepreciationRate);

        const totalEvInsurance = evInsurance * years;
        const totalGasInsurance = gasInsurance * years;

        const totalEv = evPrice - evTaxCredit + totalEvFuel + evMaintenance + totalEvInsurance - evResidual;
        const totalGas = gasPurchasePrice + totalGasFuel + gasMaintenance + totalGasInsurance - gasResidual;
        const savings = totalGas - totalEv;

        return {
          primary: {
            label: savings > 0 ? "EV Saves You Over " + years + " Years" : "Gas Car Saves Over " + years + " Years",
            value: `$${formatNumber(Math.abs(savings), 2)}`,
          },
          details: [
            { label: "Total EV Cost", value: `$${formatNumber(totalEv, 2)}` },
            { label: "Total Gas Car Cost", value: `$${formatNumber(totalGas, 2)}` },
            { label: `EV Fuel Cost (${years}yr)`, value: `$${formatNumber(totalEvFuel, 2)}` },
            { label: `Gas Fuel Cost (${years}yr)`, value: `$${formatNumber(totalGasFuel, 2)}` },
            { label: "EV Maintenance", value: `$${formatNumber(evMaintenance, 2)}` },
            { label: "Gas Maintenance", value: `$${formatNumber(gasMaintenance, 2)}` },
            { label: "EV Resale Value", value: `$${formatNumber(evResidual, 2)}` },
            { label: "Gas Car Resale Value", value: `$${formatNumber(gasResidual, 2)}` },
            { label: "EV Tax Credit", value: `$${formatNumber(evTaxCredit, 2)}` },
          ],
          note: `Based on ${formatNumber(annualMiles * years, 0)} total miles over ${years} years with ${fuelInflation}% annual fuel inflation.`,
        };
      },
    },
    {
      id: "quick",
      name: "Quick Fuel Comparison",
      fields: [
        { name: "annualMiles", label: "Annual Miles", type: "number", placeholder: "e.g. 12000" },
        { name: "evEfficiency", label: "EV Efficiency (mi/kWh)", type: "number", placeholder: "e.g. 3.5", step: 0.1 },
        { name: "electricityRate", label: "Electricity ($/kWh)", type: "number", placeholder: "e.g. 0.13", step: 0.01 },
        { name: "gasMpg", label: "Gas Car MPG", type: "number", placeholder: "e.g. 30" },
        { name: "gasRate", label: "Gas Price ($/gallon)", type: "number", placeholder: "e.g. 3.50", step: 0.01 },
      ],
      calculate: (inputs) => {
        const annualMiles = parseFloat(inputs.annualMiles as string);
        const evEfficiency = parseFloat(inputs.evEfficiency as string);
        const electricityRate = parseFloat(inputs.electricityRate as string);
        const gasMpg = parseFloat(inputs.gasMpg as string);
        const gasRate = parseFloat(inputs.gasRate as string);

        if (!annualMiles || !evEfficiency || !electricityRate || !gasMpg || !gasRate) return null;

        const evAnnual = (annualMiles / evEfficiency) * electricityRate;
        const gasAnnual = (annualMiles / gasMpg) * gasRate;
        const savings = gasAnnual - evAnnual;

        return {
          primary: { label: "Annual Fuel Savings with EV", value: `$${formatNumber(savings, 2)}` },
          details: [
            { label: "EV Annual Fuel Cost", value: `$${formatNumber(evAnnual, 2)}` },
            { label: "Gas Annual Fuel Cost", value: `$${formatNumber(gasAnnual, 2)}` },
            { label: "5-Year Savings", value: `$${formatNumber(savings * 5, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ev-lease-vs-buy-calculator", "ev-tax-credit-calculator", "ev-home-charger-cost-calculator"],
  faq: [
    {
      question: "Are electric cars really cheaper to own than gas cars?",
      answer:
        "In most cases, yes. While EVs often have higher purchase prices, they are significantly cheaper to fuel (electricity vs gas) and maintain (no oil changes, fewer brake replacements, no transmission service). Over 5-10 years, total cost of ownership is typically lower for EVs.",
    },
    {
      question: "How much do you save on maintenance with an EV?",
      answer:
        "EV owners save roughly $0.05 per mile on maintenance compared to gas cars. That's about $600/year for the average driver. EVs don't need oil changes, have regenerative braking that reduces brake wear, and have far fewer moving parts than internal combustion engines.",
    },
    {
      question: "How does EV depreciation compare to gas vehicles?",
      answer:
        "EVs have historically depreciated faster than gas cars, losing about 50% of value in 5 years compared to 40-45% for gas vehicles. However, popular models with strong demand (like Tesla) depreciate more slowly. As the used EV market matures, depreciation rates are improving.",
    },
  ],
  formula:
    "Total Cost = Purchase Price − Tax Credits + Σ(Annual Fuel × Inflation^year) + (Maintenance/mi × Miles × Years) + (Insurance × Years) − Residual Value",
};
