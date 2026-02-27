import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const solarBatteryPaybackCalculator: CalculatorDefinition = {
  slug: "solar-battery-payback-calculator",
  title: "Solar Battery Storage Payback Calculator",
  description:
    "Determine if home battery storage is cost-effective for your situation. Calculate payback considering time-of-use arbitrage, backup power value, and the 30% ITC.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "solar battery payback",
    "home battery cost",
    "powerwall cost",
    "battery storage roi",
    "home battery savings",
    "energy storage payback",
  ],
  variants: [
    {
      id: "touArbitrage",
      name: "Time-of-Use Arbitrage",
      description: "Calculate savings from charging during off-peak and discharging during peak hours",
      fields: [
        { name: "batteryCost", label: "Battery System Cost ($)", type: "number", placeholder: "e.g. 12000" },
        { name: "batteryCapacity", label: "Usable Battery Capacity (kWh)", type: "number", placeholder: "e.g. 13.5" },
        { name: "peakRate", label: "Peak Electricity Rate ($/kWh)", type: "number", placeholder: "e.g. 0.40", step: 0.01 },
        { name: "offPeakRate", label: "Off-Peak Rate ($/kWh)", type: "number", placeholder: "e.g. 0.12", step: 0.01 },
        { name: "cyclesPerDay", label: "Discharge Cycles per Day", type: "number", placeholder: "e.g. 1", step: 0.1 },
        { name: "roundTripEfficiency", label: "Round-Trip Efficiency (%)", type: "number", placeholder: "e.g. 90" },
        { name: "annualDegradation", label: "Annual Capacity Degradation (%)", type: "number", placeholder: "e.g. 2", step: 0.1 },
        {
          name: "applyItc",
          label: "Apply 30% Federal ITC?",
          type: "select",
          options: [
            { label: "Yes - 30% ITC", value: "30" },
            { label: "No ITC", value: "0" },
          ],
          defaultValue: "30",
        },
        { name: "warrantyYears", label: "Battery Warranty (years)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const batteryCost = parseFloat(inputs.batteryCost as string);
        const batteryCapacity = parseFloat(inputs.batteryCapacity as string);
        const peakRate = parseFloat(inputs.peakRate as string);
        const offPeakRate = parseFloat(inputs.offPeakRate as string);
        const cyclesPerDay = parseFloat(inputs.cyclesPerDay as string);
        const efficiency = parseFloat(inputs.roundTripEfficiency as string) || 90;
        const degradation = parseFloat(inputs.annualDegradation as string) || 2;
        const itcRate = parseFloat(inputs.applyItc as string);
        const warrantyYears = parseFloat(inputs.warrantyYears as string) || 10;

        if (!batteryCost || !batteryCapacity || !peakRate || !offPeakRate || !cyclesPerDay) return null;

        const itcSavings = batteryCost * (itcRate / 100);
        const netCost = batteryCost - itcSavings;
        const effFactor = efficiency / 100;
        const rateDiff = peakRate - offPeakRate / effFactor;

        let cumulativeSavings = 0;
        let paybackYear = 0;
        let totalSavings = 0;

        for (let year = 1; year <= warrantyYears; year++) {
          const yearCapacity = batteryCapacity * Math.pow(1 - degradation / 100, year - 1);
          const dailySavings = yearCapacity * cyclesPerDay * rateDiff;
          const annualSavings = dailySavings * 365;
          cumulativeSavings += annualSavings;
          totalSavings += annualSavings;

          if (paybackYear === 0 && cumulativeSavings >= netCost) {
            paybackYear = year;
          }
        }

        const firstYearSavings = batteryCapacity * cyclesPerDay * rateDiff * 365;
        const costPerCycleKwh = netCost / (batteryCapacity * cyclesPerDay * 365 * warrantyYears);

        return {
          primary: {
            label: "Battery Payback Period",
            value: paybackYear > 0 ? `${formatNumber(paybackYear, 0)} years` : `${formatNumber(warrantyYears, 0)}+ years`,
          },
          details: [
            { label: "Battery Cost", value: `$${formatNumber(batteryCost, 2)}` },
            { label: "Federal ITC Savings", value: `-$${formatNumber(itcSavings, 2)}` },
            { label: "Net Battery Cost", value: `$${formatNumber(netCost, 2)}` },
            { label: "Rate Spread (peak−off-peak)", value: `$${formatNumber(peakRate - offPeakRate, 3)}/kWh` },
            { label: "First Year Savings", value: `$${formatNumber(firstYearSavings, 2)}` },
            { label: `${warrantyYears}-Year Total Savings`, value: `$${formatNumber(totalSavings, 2)}` },
            { label: `${warrantyYears}-Year Net Return`, value: `$${formatNumber(totalSavings - netCost, 2)}` },
            { label: "Cost per kWh Cycled", value: `$${formatNumber(costPerCycleKwh, 3)}` },
          ],
          note: rateDiff < 0.10
            ? "Low rate spread makes battery arbitrage less economical. Consider backup power value."
            : "Good rate spread for TOU arbitrage. Battery storage can provide meaningful savings.",
        };
      },
    },
    {
      id: "solarPaired",
      name: "Solar + Battery",
      description: "Battery paired with solar for self-consumption maximization",
      fields: [
        { name: "batteryCost", label: "Battery Cost ($)", type: "number", placeholder: "e.g. 12000" },
        { name: "batteryCapacity", label: "Battery Capacity (kWh)", type: "number", placeholder: "e.g. 13.5" },
        { name: "solarExcess", label: "Daily Solar Excess (kWh)", type: "number", placeholder: "e.g. 15" },
        { name: "eveningUsage", label: "Evening Usage (kWh)", type: "number", placeholder: "e.g. 12" },
        { name: "electricityRate", label: "Electricity Rate ($/kWh)", type: "number", placeholder: "e.g. 0.20", step: 0.01 },
        { name: "exportRate", label: "Net Metering Export Rate ($/kWh)", type: "number", placeholder: "e.g. 0.08", step: 0.01 },
      ],
      calculate: (inputs) => {
        const batteryCost = parseFloat(inputs.batteryCost as string);
        const batteryCapacity = parseFloat(inputs.batteryCapacity as string);
        const solarExcess = parseFloat(inputs.solarExcess as string);
        const eveningUsage = parseFloat(inputs.eveningUsage as string);
        const electricityRate = parseFloat(inputs.electricityRate as string);
        const exportRate = parseFloat(inputs.exportRate as string);

        if (!batteryCost || !batteryCapacity || !solarExcess || !eveningUsage || !electricityRate) return null;

        const itc = batteryCost * 0.30;
        const netCost = batteryCost - itc;
        const storable = Math.min(batteryCapacity * 0.9, solarExcess);
        const usable = Math.min(storable, eveningUsage);
        const dailyValueGain = usable * (electricityRate - (exportRate || 0));
        const annualSavings = dailyValueGain * 365;
        const payback = annualSavings > 0 ? netCost / annualSavings : 0;

        return {
          primary: { label: "Payback Period", value: `${formatNumber(payback, 1)} years` },
          details: [
            { label: "Net Battery Cost (after ITC)", value: `$${formatNumber(netCost, 2)}` },
            { label: "Daily Energy Stored", value: `${formatNumber(storable, 1)} kWh` },
            { label: "Daily Savings", value: `$${formatNumber(dailyValueGain, 2)}` },
            { label: "Annual Savings", value: `$${formatNumber(annualSavings, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["solar-payback-period-calculator", "solar-tax-credit-calculator", "electricity-time-of-use-calculator"],
  faq: [
    {
      question: "Is a home battery worth the investment?",
      answer:
        "It depends on your utility rate structure. If you have time-of-use rates with a large peak/off-peak spread ($0.20+), batteries can pay back in 5-8 years. With flat rates, the financial case is weaker, but backup power during outages adds value that's hard to quantify.",
    },
    {
      question: "How long do home batteries last?",
      answer:
        "Most home batteries (Tesla Powerwall, Enphase, etc.) are warrantied for 10-15 years at 70-80% capacity. Real-world data suggests lithium-ion home batteries can last 15-20 years with proper management. They typically lose 2-3% capacity per year.",
    },
  ],
  formula:
    "Daily Savings = Usable Capacity × Cycles × (Peak Rate − Off-Peak / Efficiency); Payback = Net Cost / Annual Savings; Net Cost = Battery Cost × (1 − ITC Rate)",
};
