import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const solarBatteryCalculator: CalculatorDefinition = {
  slug: "solar-battery-calc",
  title: "Solar Battery Storage Calculator",
  description:
    "Free solar battery storage sizing calculator. Calculate the battery capacity needed for solar energy storage based on daily usage, solar production, and backup requirements.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "solar battery calculator",
    "battery storage sizing",
    "home battery calculator",
    "solar energy storage",
    "off-grid battery",
    "Powerwall calculator",
    "solar backup battery",
  ],
  variants: [
    {
      id: "battery-sizing",
      name: "Battery Capacity Sizing",
      description: "Calculate required battery capacity for your solar system",
      fields: [
        {
          name: "dailyUsage",
          label: "Daily Energy Usage (kWh)",
          type: "number",
          placeholder: "e.g. 30",
        },
        {
          name: "solarSize",
          label: "Solar Panel System Size (kW)",
          type: "number",
          placeholder: "e.g. 8",
        },
        {
          name: "sunHours",
          label: "Peak Sun Hours per Day",
          type: "select",
          options: [
            { label: "3 hours (cloudy/northern)", value: "3" },
            { label: "4 hours (average)", value: "4" },
            { label: "5 hours (good sun)", value: "5" },
            { label: "6 hours (sunny climate)", value: "6" },
            { label: "7 hours (desert/tropical)", value: "7" },
          ],
          defaultValue: "5",
        },
        {
          name: "backupDays",
          label: "Days of Backup Desired",
          type: "select",
          options: [
            { label: "Partial day (evening only)", value: "0.5" },
            { label: "1 day", value: "1" },
            { label: "2 days", value: "2" },
            { label: "3 days (extended backup)", value: "3" },
          ],
          defaultValue: "1",
        },
        {
          name: "batteryType",
          label: "Battery Chemistry",
          type: "select",
          options: [
            { label: "Lithium-ion (LFP) - 90% DoD", value: "0.90" },
            { label: "Lithium-ion (NMC) - 80% DoD", value: "0.80" },
            { label: "Lead-acid (AGM) - 50% DoD", value: "0.50" },
          ],
          defaultValue: "0.90",
        },
      ],
      calculate: (inputs) => {
        const dailyUsage = parseFloat(inputs.dailyUsage as string);
        const solarSize = parseFloat(inputs.solarSize as string);
        const sunHours = parseFloat(inputs.sunHours as string);
        const backupDays = parseFloat(inputs.backupDays as string);
        const dod = parseFloat(inputs.batteryType as string);
        if ([dailyUsage, solarSize, sunHours, backupDays, dod].some((v) => isNaN(v) || v <= 0)) return null;

        const dailySolarProduction = solarSize * sunHours * 0.85; // 85% system efficiency
        const excessSolar = Math.max(0, dailySolarProduction - dailyUsage * 0.6); // ~60% used during day
        const eveningUsage = dailyUsage * 0.4; // ~40% used in evening/night

        // Battery needs to cover evening usage + backup period
        const energyToStore = backupDays <= 0.5
          ? eveningUsage
          : dailyUsage * backupDays;

        // Account for depth of discharge and inverter losses (95%)
        const rawCapacity = energyToStore / dod / 0.95;

        // Common battery sizes
        const commonBatteries: Record<string, number> = {
          "Tesla Powerwall 3": 13.5,
          "Enphase IQ 5P": 5.0,
          "LG RESU Prime": 16.0,
          "Generac PWRcell": 9.0,
        };

        // How many Powerwalls equivalent
        const powerwallEquiv = rawCapacity / 13.5;

        return {
          primary: {
            label: "Required Battery Capacity",
            value: formatNumber(rawCapacity, 1),
            suffix: "kWh",
          },
          details: [
            { label: "Daily Solar Production", value: formatNumber(dailySolarProduction, 1) + " kWh" },
            { label: "Daily Usage", value: formatNumber(dailyUsage, 1) + " kWh" },
            { label: "Energy to Store", value: formatNumber(energyToStore, 1) + " kWh" },
            { label: "Depth of Discharge", value: formatNumber(dod * 100) + "%" },
            { label: "Backup Duration", value: backupDays <= 0.5 ? "Evening only" : formatNumber(backupDays) + " day(s)" },
            { label: "Powerwall 3 Equivalent", value: formatNumber(Math.ceil(powerwallEquiv)) + " unit(s)" },
          ],
          note: dailySolarProduction < dailyUsage
            ? "Solar production is less than daily usage. Consider a larger solar array or grid-tied system."
            : undefined,
        };
      },
    },
    {
      id: "solar-roi",
      name: "Solar + Battery ROI",
      description: "Calculate return on investment for solar battery storage",
      fields: [
        {
          name: "batteryCost",
          label: "Battery System Cost ($)",
          type: "number",
          placeholder: "e.g. 12000",
        },
        {
          name: "batteryCapacity",
          label: "Battery Capacity (kWh)",
          type: "number",
          placeholder: "e.g. 13.5",
        },
        {
          name: "electricityRate",
          label: "Peak Electricity Rate ($/kWh)",
          type: "number",
          placeholder: "e.g. 0.35",
          step: 0.01,
        },
        {
          name: "offPeakRate",
          label: "Off-Peak Rate ($/kWh)",
          type: "number",
          placeholder: "e.g. 0.12",
          step: 0.01,
        },
        {
          name: "cyclesPerDay",
          label: "Daily Charge Cycles",
          type: "select",
          options: [
            { label: "0.5 (partial daily use)", value: "0.5" },
            { label: "1.0 (full daily cycle)", value: "1.0" },
            { label: "1.5 (heavy use / TOU)", value: "1.5" },
          ],
          defaultValue: "1.0",
        },
        {
          name: "taxCredit",
          label: "Federal Tax Credit (%)",
          type: "select",
          options: [
            { label: "30% ITC (current)", value: "30" },
            { label: "26%", value: "26" },
            { label: "22%", value: "22" },
            { label: "None (0%)", value: "0" },
          ],
          defaultValue: "30",
        },
      ],
      calculate: (inputs) => {
        const cost = parseFloat(inputs.batteryCost as string);
        const capacity = parseFloat(inputs.batteryCapacity as string);
        const peakRate = parseFloat(inputs.electricityRate as string);
        const offPeakRate = parseFloat(inputs.offPeakRate as string);
        const cycles = parseFloat(inputs.cyclesPerDay as string);
        const taxCreditPct = parseFloat(inputs.taxCredit as string);
        if ([cost, capacity, peakRate, offPeakRate, cycles].some((v) => isNaN(v) || v <= 0)) return null;
        if (isNaN(taxCreditPct)) return null;

        const taxCredit = cost * (taxCreditPct / 100);
        const netCost = cost - taxCredit;

        // Daily savings from arbitrage (charge off-peak, use during peak)
        const dailyEnergy = capacity * 0.9 * cycles; // 90% round-trip efficiency
        const dailySavings = dailyEnergy * (peakRate - offPeakRate);
        const annualSavings = dailySavings * 365;
        const paybackYears = annualSavings > 0 ? netCost / annualSavings : Infinity;

        // Battery warranty typically 10 years
        const totalSavings10yr = annualSavings * 10 - netCost;

        return {
          primary: {
            label: "Payback Period",
            value: paybackYears === Infinity ? "N/A" : formatNumber(paybackYears, 1),
            suffix: paybackYears === Infinity ? "" : "years",
          },
          details: [
            { label: "System Cost", value: "$" + formatNumber(cost, 2) },
            { label: "Tax Credit", value: "$" + formatNumber(taxCredit, 2) + " (" + formatNumber(taxCreditPct) + "%)" },
            { label: "Net Cost", value: "$" + formatNumber(netCost, 2) },
            { label: "Annual Savings", value: "$" + formatNumber(annualSavings, 2) },
            { label: "10-Year Net Savings", value: "$" + formatNumber(totalSavings10yr, 2) },
            { label: "Daily Energy Cycled", value: formatNumber(dailyEnergy, 1) + " kWh" },
          ],
          note: paybackYears > 10
            ? "Payback exceeds typical battery warranty period. Battery may be justified for backup power and grid independence."
            : undefined,
        };
      },
    },
  ],
  relatedSlugs: ["electricity-calculator", "ev-charging-time", "rainwater-tank-calc"],
  faq: [
    {
      question: "How much battery storage do I need for my home?",
      answer:
        "The average US home uses 30 kWh/day. For evening-only backup, 10-15 kWh is sufficient (one Tesla Powerwall 3). For full-day backup, 30-40 kWh. For multi-day outage protection, multiply daily usage by desired backup days and add 20% for losses.",
    },
    {
      question: "What is depth of discharge (DoD)?",
      answer:
        "DoD is how much of the battery capacity you can actually use. Lithium iron phosphate (LFP) batteries allow 90-100% DoD. NMC lithium batteries allow 80-90%. Lead-acid only 50%. A 10 kWh battery at 90% DoD provides 9 kWh of usable energy.",
    },
    {
      question: "Is a solar battery worth the investment?",
      answer:
        "It depends on your electricity rates, rate structure (time-of-use vs flat), and how much you value backup power. Batteries pay for themselves fastest with high peak rates ($0.30+/kWh) and low off-peak rates. The 30% federal tax credit significantly improves ROI.",
    },
  ],
  formula:
    "Battery Capacity = (Daily Usage x Backup Days) / DoD / Inverter Efficiency | Annual Savings = Daily Energy x (Peak Rate - Off-Peak Rate) x 365",
};
