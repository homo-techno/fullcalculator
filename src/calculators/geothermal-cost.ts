import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const geothermalCostCalculator: CalculatorDefinition = {
  slug: "geothermal-cost-calculator",
  title: "Geothermal Heat Pump Cost & Savings Calculator",
  description:
    "Calculate the installation cost and 20-year savings of a geothermal heat pump system. Compare against traditional HVAC with the 30% federal tax credit included.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "geothermal cost",
    "geothermal heat pump",
    "ground source heat pump",
    "geothermal savings",
    "geothermal installation",
    "geothermal tax credit",
  ],
  variants: [
    {
      id: "fullAnalysis",
      name: "Full Cost & Savings Analysis",
      description: "20-year geothermal vs conventional HVAC comparison",
      fields: [
        { name: "homeSize", label: "Home Size (sq ft)", type: "number", placeholder: "e.g. 2500" },
        {
          name: "loopType",
          label: "Loop System Type",
          type: "select",
          options: [
            { label: "Horizontal (lower cost, needs land)", value: "horizontal" },
            { label: "Vertical (higher cost, less land)", value: "vertical" },
            { label: "Pond/Lake (if available)", value: "pond" },
          ],
          defaultValue: "vertical",
        },
        { name: "systemTons", label: "System Size (tons)", type: "number", placeholder: "e.g. 4", step: 0.5 },
        { name: "annualHeatingCost", label: "Current Annual Heating Cost ($)", type: "number", placeholder: "e.g. 2500" },
        { name: "annualCoolingCost", label: "Current Annual Cooling Cost ($)", type: "number", placeholder: "e.g. 1200" },
        {
          name: "currentFuel",
          label: "Current Heating Fuel",
          type: "select",
          options: [
            { label: "Natural Gas", value: "gas" },
            { label: "Oil/Propane", value: "oil" },
            { label: "Electric Resistance", value: "electric" },
            { label: "Air Source Heat Pump", value: "ashp" },
          ],
          defaultValue: "gas",
        },
        { name: "electricityRate", label: "Electricity Rate ($/kWh)", type: "number", placeholder: "e.g. 0.13", step: 0.01 },
        { name: "energyInflation", label: "Annual Energy Cost Increase (%)", type: "number", placeholder: "e.g. 3", step: 0.1 },
      ],
      calculate: (inputs) => {
        const homeSize = parseFloat(inputs.homeSize as string);
        const loopType = inputs.loopType as string;
        const systemTons = parseFloat(inputs.systemTons as string);
        const annualHeatingCost = parseFloat(inputs.annualHeatingCost as string);
        const annualCoolingCost = parseFloat(inputs.annualCoolingCost as string);
        const currentFuel = inputs.currentFuel as string;
        const electricityRate = parseFloat(inputs.electricityRate as string);
        const energyInflation = parseFloat(inputs.energyInflation as string) || 3;

        if (!homeSize || !systemTons || !annualHeatingCost || !annualCoolingCost || !electricityRate) return null;

        const costPerTon: Record<string, number> = { horizontal: 4500, vertical: 6500, pond: 4000 };
        const installCost = systemTons * (costPerTon[loopType] || 6500);
        const itc = installCost * 0.30;
        const netCost = installCost - itc;

        const copHeating = 4.0;
        const copCooling = 5.5;
        const heatingEfficiency: Record<string, number> = { gas: 0.92, oil: 0.85, electric: 1.0, ashp: 2.5 };
        const currentHeatingEff = heatingEfficiency[currentFuel] || 0.92;

        const heatingBtu = annualHeatingCost / (electricityRate / (currentFuel === "gas" ? 0.04 : currentFuel === "oil" ? 0.08 : electricityRate));
        const geoHeatingCost = (annualHeatingCost / currentHeatingEff) * (electricityRate / (electricityRate * copHeating / currentHeatingEff));
        const geoCoolingCost = annualCoolingCost * (3.0 / copCooling);
        const geoAnnualCost = geoHeatingCost + geoCoolingCost;
        const currentAnnualCost = annualHeatingCost + annualCoolingCost;
        const annualSavings = currentAnnualCost - geoAnnualCost;

        let cumSavings = 0;
        let paybackYear = 0;
        let totalSavings20 = 0;

        for (let y = 1; y <= 20; y++) {
          const yearSavings = annualSavings * Math.pow(1 + energyInflation / 100, y - 1);
          cumSavings += yearSavings;
          totalSavings20 += yearSavings;
          if (paybackYear === 0 && cumSavings >= netCost) paybackYear = y;
        }

        const conventionalReplacement = 8000;
        const totalSavingsWithReplacement = totalSavings20 + conventionalReplacement;

        return {
          primary: {
            label: "Payback Period",
            value: paybackYear > 0 ? `${formatNumber(paybackYear, 0)} years` : "20+ years",
          },
          details: [
            { label: "Installation Cost", value: `$${formatNumber(installCost, 2)}` },
            { label: "Federal ITC (30%)", value: `-$${formatNumber(itc, 2)}` },
            { label: "Net Cost", value: `$${formatNumber(netCost, 2)}` },
            { label: "Current Annual HVAC Cost", value: `$${formatNumber(currentAnnualCost, 2)}` },
            { label: "Geothermal Annual Cost", value: `$${formatNumber(geoAnnualCost, 2)}` },
            { label: "Annual Savings (Year 1)", value: `$${formatNumber(annualSavings, 2)}` },
            { label: "20-Year Energy Savings", value: `$${formatNumber(totalSavings20, 2)}` },
            { label: "20-Year Net Savings", value: `$${formatNumber(totalSavings20 - netCost, 2)}` },
            { label: "Avoided HVAC Replacement", value: `$${formatNumber(conventionalReplacement, 2)}` },
          ],
          note: `Geothermal systems typically last 25+ years (indoor) and 50+ years (ground loop). COP of ${copHeating} for heating is 3-4x more efficient than conventional systems.`,
        };
      },
    },
    {
      id: "quickEstimate",
      name: "Quick Cost Estimate",
      fields: [
        { name: "homeSize", label: "Home Size (sq ft)", type: "number", placeholder: "e.g. 2500" },
        {
          name: "loopType",
          label: "Loop Type",
          type: "select",
          options: [
            { label: "Horizontal", value: "horizontal" },
            { label: "Vertical", value: "vertical" },
          ],
          defaultValue: "vertical",
        },
      ],
      calculate: (inputs) => {
        const homeSize = parseFloat(inputs.homeSize as string);
        const loopType = inputs.loopType as string;

        if (!homeSize) return null;

        const tons = Math.ceil(homeSize / 600);
        const costPerTon = loopType === "horizontal" ? 4500 : 6500;
        const totalCost = tons * costPerTon;
        const itc = totalCost * 0.30;
        const netCost = totalCost - itc;

        return {
          primary: { label: "Estimated Net Cost", value: `$${formatNumber(netCost, 2)}` },
          details: [
            { label: "Estimated System Size", value: `${formatNumber(tons, 0)} tons` },
            { label: "Gross Installation Cost", value: `$${formatNumber(totalCost, 2)}` },
            { label: "Federal ITC (30%)", value: `-$${formatNumber(itc, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["heat-pump-savings-calculator", "home-electrification-calculator", "energy-rebate-calculator"],
  faq: [
    {
      question: "How much does geothermal installation cost?",
      answer:
        "A typical residential geothermal system costs $18,000-$45,000 before incentives, depending on system size, loop type, and soil conditions. After the 30% federal ITC, costs drop to $12,600-$31,500. Vertical loop systems cost more but require less land area.",
    },
    {
      question: "Is geothermal worth it in my climate?",
      answer:
        "Geothermal works in all climates because ground temperature is constant year-round (50-60°F in most US regions). It's most cost-effective where heating/cooling costs are high, especially for homes using oil, propane, or electric resistance heating. Even in mild climates, the high efficiency provides savings.",
    },
  ],
  formula:
    "Install Cost = System Tons × Cost per Ton; Net Cost = Install − (Install × 30% ITC); Annual Savings = Current HVAC Cost − Geothermal Operating Cost; Payback = Net Cost / Annual Savings",
};
