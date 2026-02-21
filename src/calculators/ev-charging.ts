import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const evChargingCalculator: CalculatorDefinition = {
  slug: "ev-charging-calculator",
  title: "EV Charging Calculator",
  description: "Free EV charging calculator. Calculate electric vehicle charging time, cost, and energy needed for Level 1 and Level 2 home charging.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["EV charging calculator", "electric vehicle charging cost", "EV charge time calculator", "Level 2 charging calculator", "EV electricity cost"],
  variants: [
    {
      id: "calc",
      name: "Calculate EV Charging",
      description: "Calculate charging time and cost for your electric vehicle",
      fields: [
        { name: "batteryCapacity", label: "Battery Capacity (kWh)", type: "number", placeholder: "e.g. 75" },
        { name: "currentCharge", label: "Current Charge Level (%)", type: "number", placeholder: "e.g. 20", defaultValue: 20 },
        { name: "electricRate", label: "Electricity Rate ($/kWh)", type: "number", placeholder: "e.g. 0.13", step: 0.01 },
      ],
      calculate: (inputs) => {
        const batteryCapacity = inputs.batteryCapacity as number;
        const currentCharge = (inputs.currentCharge as number) ?? 20;
        const electricRate = inputs.electricRate as number;
        if (!batteryCapacity || !electricRate) return null;

        const chargeNeeded = batteryCapacity * ((100 - currentCharge) / 100);
        const fullChargeCost = chargeNeeded * electricRate;

        // Level 1: 120V, ~12A = 1.44 kW (typical 1.4 kW)
        const level1Power = 1.4; // kW
        const level1Hours = chargeNeeded / level1Power;
        const level1Days = level1Hours / 24;

        // Level 2: 240V, ~30A = 7.2 kW
        const level2Power = 7.2; // kW
        const level2Hours = chargeNeeded / level2Power;

        // DC Fast Charging: ~50-150 kW (use 100 kW average)
        const dcFastPower = 100; // kW
        const dcFastMinutes = (chargeNeeded / dcFastPower) * 60;

        // Monthly cost estimate (assume 1,000 miles/month, 3.5 mi/kWh efficiency)
        const monthlyMiles = 1000;
        const efficiency = 3.5; // miles per kWh
        const monthlyKwh = monthlyMiles / efficiency;
        const monthlyCost = monthlyKwh * electricRate;

        return {
          primary: { label: "Charge Cost (to full)", value: `$${formatNumber(fullChargeCost, 2)}` },
          details: [
            { label: "Energy needed", value: `${formatNumber(chargeNeeded, 1)} kWh` },
            { label: "Current to full charge cost", value: `$${formatNumber(fullChargeCost, 2)}` },
            { label: "Level 1 time (1.4 kW)", value: `${formatNumber(level1Hours, 1)} hours (${formatNumber(level1Days, 1)} days)` },
            { label: "Level 2 time (7.2 kW)", value: `${formatNumber(level2Hours, 1)} hours` },
            { label: "DC Fast Charge (~100 kW)", value: `~${formatNumber(dcFastMinutes, 0)} minutes` },
            { label: "Cost per full charge", value: `$${formatNumber(batteryCapacity * electricRate, 2)}` },
            { label: "Est. monthly cost (1,000 mi)", value: `$${formatNumber(monthlyCost, 2)}` },
          ],
          note: "Level 1 uses a standard 120V outlet (1.4 kW). Level 2 uses a 240V outlet or EVSE (7.2 kW). Actual charging speed varies with battery temperature, state of charge, and vehicle limits.",
        };
      },
    },
  ],
  relatedSlugs: ["electricity-usage-calculator", "solar-savings-calculator", "fuel-cost-calculator"],
  faq: [
    { question: "How long does it take to charge an EV at home?", answer: "On Level 1 (120V outlet), a full charge can take 40-60 hours. On Level 2 (240V/7.2kW), most EVs charge in 8-12 hours. Most people plug in overnight and wake up to a full charge with Level 2." },
    { question: "How much does it cost to charge an EV?", answer: "At the national average of $0.13/kWh, charging a 75 kWh battery costs about $9.75 for a full charge, giving roughly 250-300 miles of range. This is equivalent to about $0.03-0.04 per mile." },
    { question: "Is Level 1 or Level 2 charging better?", answer: "Level 2 is strongly recommended for home EV charging. It charges 5-6x faster than Level 1, easily providing a full charge overnight. Level 2 requires a 240V outlet and an EVSE (charger), typically costing $300-$800 installed." },
  ],
  formula: "Charge Cost = (Battery kWh x (100% - Current%) / 100) x $/kWh | Charge Time = kWh Needed / Charger Power (kW)",
};
