import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const evChargingCostCalculator: CalculatorDefinition = {
  slug: "ev-charging-cost-calculator",
  title: "EV Charging Cost Calculator",
  description: "Free EV charging cost calculator. Estimate the cost to charge your electric vehicle at home or at public charging stations.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["ev charging cost", "electric car charging cost", "EV electricity cost", "home charging cost", "public charging cost"],
  variants: [
    {
      id: "home",
      name: "Home Charging Cost",
      description: "Calculate the cost of charging your EV at home",
      fields: [
        { name: "batteryKwh", label: "Battery Capacity", type: "number", placeholder: "e.g. 75", suffix: "kWh" },
        { name: "currentCharge", label: "Current Charge Level", type: "number", placeholder: "e.g. 20", suffix: "%" },
        { name: "targetCharge", label: "Target Charge Level", type: "number", placeholder: "e.g. 80", suffix: "%" },
        { name: "electricityRate", label: "Electricity Rate", type: "number", placeholder: "e.g. 0.13", prefix: "$", step: 0.01, suffix: "/kWh" },
        { name: "chargingEfficiency", label: "Charging Efficiency", type: "number", placeholder: "e.g. 90", suffix: "%" },
      ],
      calculate: (inputs) => {
        const battery = inputs.batteryKwh as number;
        const current = (inputs.currentCharge as number) || 0;
        const target = (inputs.targetCharge as number) || 100;
        const rate = inputs.electricityRate as number;
        const efficiency = (inputs.chargingEfficiency as number) || 90;
        if (!battery || !rate) return null;

        const kwhNeeded = battery * (target - current) / 100;
        const actualKwh = kwhNeeded / (efficiency / 100);
        const cost = actualKwh * rate;
        const costPerPercent = cost / (target - current);

        return {
          primary: { label: "Charging Cost", value: `$${formatNumber(cost)}` },
          details: [
            { label: "Energy needed", value: `${formatNumber(kwhNeeded, 1)} kWh` },
            { label: "Actual energy drawn", value: `${formatNumber(actualKwh, 1)} kWh` },
            { label: "Cost per % charged", value: `$${formatNumber(costPerPercent, 3)}` },
            { label: "Full charge cost (0-100%)", value: `$${formatNumber(battery / (efficiency / 100) * rate)}` },
            { label: "Charging efficiency loss", value: `${formatNumber(actualKwh - kwhNeeded, 1)} kWh` },
          ],
        };
      },
    },
    {
      id: "monthly",
      name: "Monthly Charging Cost",
      description: "Estimate monthly EV charging expenses",
      fields: [
        { name: "monthlyMiles", label: "Monthly Miles Driven", type: "number", placeholder: "e.g. 1000", suffix: "miles" },
        { name: "efficiency", label: "Vehicle Efficiency", type: "number", placeholder: "e.g. 3.5", suffix: "mi/kWh" },
        { name: "homeRate", label: "Home Electricity Rate", type: "number", placeholder: "e.g. 0.13", prefix: "$", step: 0.01, suffix: "/kWh" },
        { name: "homePercent", label: "% Charged at Home", type: "number", placeholder: "e.g. 80", suffix: "%" },
        { name: "publicRate", label: "Public Charging Rate", type: "number", placeholder: "e.g. 0.35", prefix: "$", step: 0.01, suffix: "/kWh" },
      ],
      calculate: (inputs) => {
        const miles = inputs.monthlyMiles as number;
        const eff = inputs.efficiency as number;
        const homeRate = inputs.homeRate as number;
        const homePercent = (inputs.homePercent as number) || 100;
        const publicRate = (inputs.publicRate as number) || 0;
        if (!miles || !eff || !homeRate) return null;

        const totalKwh = miles / eff;
        const homeKwh = totalKwh * (homePercent / 100);
        const publicKwh = totalKwh * ((100 - homePercent) / 100);
        const homeCost = homeKwh * homeRate;
        const publicCost = publicKwh * publicRate;
        const totalCost = homeCost + publicCost;
        const costPerMile = totalCost / miles;

        return {
          primary: { label: "Monthly Charging Cost", value: `$${formatNumber(totalCost)}` },
          details: [
            { label: "Home charging cost", value: `$${formatNumber(homeCost)}` },
            { label: "Public charging cost", value: `$${formatNumber(publicCost)}` },
            { label: "Total kWh used", value: `${formatNumber(totalKwh, 1)} kWh` },
            { label: "Cost per mile", value: `$${formatNumber(costPerMile, 3)}` },
            { label: "Annual cost estimate", value: `$${formatNumber(totalCost * 12)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ev-range-calculator", "ev-savings-calculator", "fuel-cost-calculator"],
  faq: [
    { question: "How much does it cost to charge an EV at home?", answer: "At the US average electricity rate of ~$0.13/kWh, a full charge for a 75 kWh battery costs about $10-12. Monthly costs for average driving (1,000 miles) are typically $30-50, significantly less than gasoline." },
    { question: "Is public charging more expensive?", answer: "Yes, public charging typically costs $0.25-0.60/kWh, 2-4x more than home charging. DC fast charging is the most expensive. Home charging during off-peak hours is the most economical option." },
  ],
  formula: "Cost = (Battery kWh × (Target% - Current%) / 100 / Efficiency) × Rate per kWh",
};
