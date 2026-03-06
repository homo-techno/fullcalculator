import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wirelessChargerEfficiencyCalculator: CalculatorDefinition = {
  slug: "wireless-charger-efficiency-calculator",
  title: "Wireless Charger Efficiency Calculator",
  description: "Calculate the energy efficiency and cost overhead of wireless charging compared to wired charging for your devices.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["wireless charging efficiency","qi charger energy loss","wireless vs wired charging","inductive charging cost","wireless charger waste"],
  variants: [{
    id: "standard",
    name: "Wireless Charger Efficiency",
    description: "Calculate the energy efficiency and cost overhead of wireless charging compared to wired charging for your devices.",
    fields: [
      { name: "batteryCapacity", label: "Device Battery (mAh)", type: "number", min: 1000, max: 10000, defaultValue: 4500 },
      { name: "batteryVoltage", label: "Battery Voltage (V)", type: "number", min: 3.0, max: 5.0, defaultValue: 3.85 },
      { name: "wirelessEfficiency", label: "Wireless Charging Efficiency (%)", type: "number", min: 50, max: 95, defaultValue: 75 },
      { name: "chargesPerWeek", label: "Charges Per Week", type: "number", min: 1, max: 14, defaultValue: 7 },
      { name: "electricRate", label: "Electricity Rate ($/kWh)", type: "number", min: 0.05, max: 0.60, defaultValue: 0.13 },
    ],
    calculate: (inputs) => {
    const battery = inputs.batteryCapacity as number;
    const voltage = inputs.batteryVoltage as number;
    const efficiency = inputs.wirelessEfficiency as number / 100;
    const chargesWeek = inputs.chargesPerWeek as number;
    const rate = inputs.electricRate as number;
    const batteryWh = battery * voltage / 1000;
    const wiredEnergy = batteryWh / 0.92;
    const wirelessEnergy = batteryWh / efficiency;
    const wastedPerCharge = wirelessEnergy - wiredEnergy;
    const weeklyWaste = wastedPerCharge * chargesWeek;
    const annualWasteKwh = weeklyWaste * 52 / 1000;
    const annualExtraCost = annualWasteKwh * rate;
    const wiredAnnualKwh = wiredEnergy * chargesWeek * 52 / 1000;
    const wirelessAnnualKwh = wirelessEnergy * chargesWeek * 52 / 1000;
    return {
      primary: { label: "Energy Wasted Per Charge", value: formatNumber(Math.round(wastedPerCharge * 100) / 100) + " Wh" },
      details: [
        { label: "Wireless Energy Per Charge", value: formatNumber(Math.round(wirelessEnergy * 100) / 100) + " Wh" },
        { label: "Wired Energy Per Charge", value: formatNumber(Math.round(wiredEnergy * 100) / 100) + " Wh" },
        { label: "Annual Extra Energy", value: formatNumber(Math.round(annualWasteKwh * 100) / 100) + " kWh" },
        { label: "Annual Extra Cost", value: "$" + formatNumber(Math.round(annualExtraCost * 100) / 100) }
      ]
    };
  },
  }],
  relatedSlugs: ["phone-battery-health-calculator","e-reader-battery-calculator","electric-bill-device-cost-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Energy Per Charge (Wireless) = Battery Wh / Wireless Efficiency; Energy Per Charge (Wired) = Battery Wh / 0.92; Wasted Per Charge = Wireless Energy - Wired Energy; Annual Extra Cost = Weekly Waste x 52 / 1000 x Rate",
};
