import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const smartThermostatSavingsCalculator: CalculatorDefinition = {
  slug: "smart-thermostat-savings-calculator",
  title: "Smart Thermostat Annual Energy Savings Calculator",
  description:
    "Calculate how much a smart thermostat can save on your heating and cooling bills. Estimates savings based on your climate, habits, and current thermostat type.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "smart thermostat savings",
    "nest savings",
    "ecobee savings",
    "thermostat energy savings",
    "programmable thermostat",
    "hvac savings",
  ],
  variants: [
    {
      id: "detailed",
      name: "Detailed Savings Estimate",
      description: "Estimate savings based on your specific home and habits",
      fields: [
        { name: "annualHvacCost", label: "Annual Heating & Cooling Cost ($)", type: "number", placeholder: "e.g. 1800" },
        {
          name: "currentThermostat",
          label: "Current Thermostat Type",
          type: "select",
          options: [
            { label: "Manual (non-programmable)", value: "manual" },
            { label: "Basic programmable", value: "programmable" },
            { label: "Older smart thermostat", value: "oldsmart" },
          ],
          defaultValue: "manual",
        },
        {
          name: "occupancy",
          label: "Home Occupancy Pattern",
          type: "select",
          options: [
            { label: "Away 8+ hours daily (work commute)", value: "away" },
            { label: "Partially home (hybrid work)", value: "partial" },
            { label: "Home most of the time", value: "home" },
          ],
          defaultValue: "away",
        },
        { name: "thermostatCost", label: "Smart Thermostat Cost ($)", type: "number", placeholder: "e.g. 200" },
        { name: "utilityRebate", label: "Utility Rebate ($)", type: "number", placeholder: "e.g. 50" },
        { name: "zones", label: "Number of Zones/Thermostats", type: "number", placeholder: "e.g. 1" },
        {
          name: "climateType",
          label: "Climate Type",
          type: "select",
          options: [
            { label: "Extreme (very hot/cold)", value: "1.3" },
            { label: "Moderate (seasonal)", value: "1.0" },
            { label: "Mild (minimal HVAC needed)", value: "0.7" },
          ],
          defaultValue: "1.0",
        },
      ],
      calculate: (inputs) => {
        const annualHvacCost = parseFloat(inputs.annualHvacCost as string);
        const currentThermostat = inputs.currentThermostat as string;
        const occupancy = inputs.occupancy as string;
        const thermostatCost = parseFloat(inputs.thermostatCost as string);
        const utilityRebate = parseFloat(inputs.utilityRebate as string) || 0;
        const zones = parseFloat(inputs.zones as string) || 1;
        const climateFactor = parseFloat(inputs.climateType as string);

        if (!annualHvacCost || !thermostatCost) return null;

        const baseSavingsRates: Record<string, number> = {
          manual: 0.23,
          programmable: 0.12,
          oldsmart: 0.05,
        };

        const occupancyMultiplier: Record<string, number> = {
          away: 1.2,
          partial: 1.0,
          home: 0.7,
        };

        const baseSavings = baseSavingsRates[currentThermostat] || 0.15;
        const adjustedRate = baseSavings * (occupancyMultiplier[occupancy] || 1.0) * climateFactor;
        const annualSavings = annualHvacCost * adjustedRate;
        const totalCost = thermostatCost * zones;
        const netCost = totalCost - utilityRebate;
        const paybackMonths = annualSavings > 0 ? (netCost / annualSavings) * 12 : 0;
        const fiveYearSavings = annualSavings * 5 - netCost;
        const monthlySavings = annualSavings / 12;

        return {
          primary: {
            label: "Annual Savings",
            value: `$${formatNumber(annualSavings, 2)}`,
          },
          details: [
            { label: "Monthly Savings", value: `$${formatNumber(monthlySavings, 2)}` },
            { label: "Savings Rate", value: `${formatNumber(adjustedRate * 100, 1)}%` },
            { label: "Thermostat Cost", value: `$${formatNumber(totalCost, 2)}` },
            { label: "Utility Rebate", value: `-$${formatNumber(utilityRebate, 2)}` },
            { label: "Net Cost", value: `$${formatNumber(netCost, 2)}` },
            { label: "Payback Period", value: `${formatNumber(paybackMonths, 1)} months` },
            { label: "5-Year Net Savings", value: `$${formatNumber(fiveYearSavings, 2)}` },
          ],
          note: `Smart thermostats save an average of 10-23% on HVAC costs. ${occupancy === "away" ? "Your away-from-home pattern maximizes savings through automatic setbacks." : "Consider using geofencing features to maximize savings when you leave."}`,
        };
      },
    },
    {
      id: "quick",
      name: "Quick Estimate",
      fields: [
        { name: "monthlyHvac", label: "Monthly HVAC Cost ($)", type: "number", placeholder: "e.g. 150" },
        { name: "thermostatCost", label: "Thermostat Cost ($)", type: "number", placeholder: "e.g. 200" },
      ],
      calculate: (inputs) => {
        const monthlyHvac = parseFloat(inputs.monthlyHvac as string);
        const cost = parseFloat(inputs.thermostatCost as string);

        if (!monthlyHvac || !cost) return null;

        const savings = monthlyHvac * 12 * 0.15;
        const payback = cost / savings;

        return {
          primary: { label: "Estimated Annual Savings", value: `$${formatNumber(savings, 2)}` },
          details: [
            { label: "Monthly Savings (~15%)", value: `$${formatNumber(savings / 12, 2)}` },
            { label: "Payback Period", value: `${formatNumber(payback * 12, 1)} months` },
            { label: "5-Year Net Savings", value: `$${formatNumber(savings * 5 - cost, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["home-energy-score-calculator", "heat-pump-savings-calculator", "weatherization-roi-calculator"],
  faq: [
    {
      question: "How much do smart thermostats really save?",
      answer:
        "Independent studies show smart thermostats save 10-23% on heating and cooling costs. The EPA estimates ENERGY STAR certified smart thermostats save about 8% on heating and cooling bills ($50/year average). Actual savings depend on your previous thermostat type, occupancy patterns, and climate.",
    },
    {
      question: "What features save the most energy?",
      answer:
        "The biggest savers are: (1) Learning/auto-scheduling that adjusts to your routine, (2) Geofencing that activates away mode when you leave, (3) Occupancy sensing that detects empty rooms, and (4) Optimized start/stop that pre-heats or pre-cools efficiently. Remote access also helps catch forgotten schedule changes.",
    },
  ],
  formula:
    "Annual Savings = HVAC Cost × Base Rate × Occupancy Multiplier × Climate Factor; Base Rates: Manual→23%, Programmable→12%, Old Smart→5%; Payback = Net Cost / Annual Savings",
};
