import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const solarSavingsCalculator: CalculatorDefinition = {
  slug: "solar-savings-calculator",
  title: "Solar Savings Calculator",
  description: "Free solar savings calculator. Estimate monthly and annual savings from solar panels, payback period, and return on investment.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["solar savings calculator", "solar panel savings", "solar ROI calculator", "solar payback period", "solar panel cost calculator"],
  variants: [
    {
      id: "calc",
      name: "Calculate Solar Savings",
      description: "Estimate savings and payback period for solar panels",
      fields: [
        { name: "systemSize", label: "System Size (kW)", type: "number", placeholder: "e.g. 8" },
        { name: "sunHours", label: "Peak Sun Hours per Day", type: "number", placeholder: "e.g. 4.5", defaultValue: 4.5, step: 0.5 },
        { name: "electricRate", label: "Electricity Rate ($/kWh)", type: "number", placeholder: "e.g. 0.13", step: 0.01 },
        { name: "systemCost", label: "System Cost ($)", type: "number", placeholder: "e.g. 20000", prefix: "$" },
      ],
      calculate: (inputs) => {
        const systemSize = inputs.systemSize as number;
        const sunHours = (inputs.sunHours as number) || 4.5;
        const electricRate = inputs.electricRate as number;
        const systemCost = inputs.systemCost as number;
        if (!systemSize || !electricRate) return null;

        // Daily output with 80% system efficiency
        const dailyKwh = systemSize * sunHours * 0.80;
        const monthlyKwh = dailyKwh * 30;
        const annualKwh = dailyKwh * 365;
        const monthlySavings = monthlyKwh * electricRate;
        const annualSavings = annualKwh * electricRate;

        // 25-year savings (with 0.5% annual degradation average)
        const twentyFiveYearSavings = annualSavings * 25 * 0.9; // average over degradation

        const details: { label: string; value: string }[] = [
          { label: "System size", value: `${systemSize} kW` },
          { label: "Peak sun hours", value: `${sunHours} hrs/day` },
          { label: "Daily production", value: `${formatNumber(dailyKwh, 1)} kWh` },
          { label: "Monthly production", value: `${formatNumber(monthlyKwh, 0)} kWh` },
          { label: "Annual production", value: `${formatNumber(annualKwh, 0)} kWh` },
          { label: "Monthly savings", value: `$${formatNumber(monthlySavings, 2)}` },
          { label: "Annual savings", value: `$${formatNumber(annualSavings, 2)}` },
        ];

        if (systemCost) {
          const federalCredit = systemCost * 0.30; // 30% ITC
          const netCost = systemCost - federalCredit;
          const paybackYears = netCost / annualSavings;
          details.push({ label: "System cost", value: `$${formatNumber(systemCost)}` });
          details.push({ label: "Federal tax credit (30%)", value: `-$${formatNumber(federalCredit)}` });
          details.push({ label: "Net cost after credit", value: `$${formatNumber(netCost)}` });
          details.push({ label: "Payback period", value: `${formatNumber(paybackYears, 1)} years` });
          details.push({ label: "25-year savings", value: `$${formatNumber(twentyFiveYearSavings - netCost)}` });
        }

        return {
          primary: { label: "Annual Savings", value: `$${formatNumber(annualSavings, 2)}` },
          details,
          note: "Based on 80% system efficiency factor (accounts for inverter losses, shading, temperature, and wiring). Federal solar tax credit is 30% through 2032. Actual savings depend on net metering policies, rate structure, and local incentives.",
        };
      },
    },
  ],
  relatedSlugs: ["solar-panel-calculator", "electricity-usage-calculator", "ev-charging-calculator"],
  faq: [
    { question: "How much can I save with solar panels?", answer: "Savings depend on system size, sun hours, and electricity rates. A typical 8 kW system in an area with 4.5 peak sun hours saves $1,200-$1,800 per year at average electricity rates." },
    { question: "What is the payback period for solar panels?", answer: "After the 30% federal tax credit, most residential solar systems pay for themselves in 6-10 years. With rising electricity costs, the payback period may be shorter. Solar panels typically last 25-30 years." },
    { question: "How many peak sun hours does my area get?", answer: "Peak sun hours vary by location. The US Southwest averages 5-6 hours, the Southeast 4-5 hours, the Midwest 3.5-4.5 hours, and the Northeast 3-4 hours. Check the NREL PVWatts calculator for your specific location." },
  ],
  formula: "Daily Output = System kW x Sun Hours x 0.80 | Annual Savings = Daily Output x 365 x $/kWh | Payback = Net Cost / Annual Savings",
};
