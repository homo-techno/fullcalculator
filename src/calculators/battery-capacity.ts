import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const batteryCapacityCalculator: CalculatorDefinition = {
  slug: "battery-capacity-calculator",
  title: "Battery Capacity Calculator",
  description:
    "Free battery capacity calculator. Convert between Ah and Wh, calculate battery runtime, and estimate charge time for any battery.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "battery capacity",
    "battery calculator",
    "Ah to Wh",
    "Wh to Ah",
    "battery runtime",
    "battery charge time",
    "mAh calculator",
  ],
  variants: [
    {
      id: "ah-wh-conversion",
      name: "Ah to Wh / Wh to Ah Conversion",
      description: "Wh = Ah × V and Ah = Wh / V",
      fields: [
        {
          name: "mode",
          label: "Convert",
          type: "select",
          options: [
            { label: "Ah to Wh", value: "ah-to-wh" },
            { label: "Wh to Ah", value: "wh-to-ah" },
            { label: "mAh to Wh", value: "mah-to-wh" },
          ],
          defaultValue: "ah-to-wh",
        },
        {
          name: "capacity",
          label: "Capacity (Ah, Wh, or mAh)",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          name: "voltage",
          label: "Nominal Voltage (V)",
          type: "number",
          placeholder: "e.g. 12",
        },
      ],
      calculate: (inputs) => {
        const mode = inputs.mode as string;
        const capacity = inputs.capacity as number;
        const voltage = inputs.voltage as number;
        if (!capacity || !voltage) return null;

        let ah: number;
        let wh: number;

        if (mode === "ah-to-wh") {
          ah = capacity;
          wh = capacity * voltage;
        } else if (mode === "wh-to-ah") {
          wh = capacity;
          ah = capacity / voltage;
        } else {
          // mAh to Wh
          ah = capacity / 1000;
          wh = ah * voltage;
        }

        const mah = ah * 1000;
        const kwh = wh / 1000;

        return {
          primary: {
            label: mode === "wh-to-ah" ? "Capacity (Ah)" : "Energy (Wh)",
            value: mode === "wh-to-ah" ? `${formatNumber(ah, 4)} Ah` : `${formatNumber(wh, 4)} Wh`,
          },
          details: [
            { label: "Amp-hours (Ah)", value: `${formatNumber(ah, 4)} Ah` },
            { label: "Milliamp-hours (mAh)", value: `${formatNumber(mah, 0)} mAh` },
            { label: "Watt-hours (Wh)", value: `${formatNumber(wh, 4)} Wh` },
            { label: "Kilowatt-hours (kWh)", value: `${formatNumber(kwh, 4)} kWh` },
            { label: "Nominal Voltage", value: `${voltage} V` },
          ],
        };
      },
    },
    {
      id: "runtime",
      name: "Battery Runtime",
      description: "Calculate how long a battery will last under a given load",
      fields: [
        {
          name: "capacity",
          label: "Battery Capacity (Ah)",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          name: "voltage",
          label: "Battery Voltage (V)",
          type: "number",
          placeholder: "e.g. 12",
        },
        {
          name: "loadWatts",
          label: "Load Power (W)",
          type: "number",
          placeholder: "e.g. 60",
        },
        {
          name: "efficiency",
          label: "Inverter Efficiency (%)",
          type: "number",
          placeholder: "e.g. 90",
          defaultValue: 90,
        },
        {
          name: "dod",
          label: "Max Depth of Discharge (%)",
          type: "number",
          placeholder: "e.g. 80",
          defaultValue: 80,
        },
      ],
      calculate: (inputs) => {
        const ah = inputs.capacity as number;
        const v = inputs.voltage as number;
        const loadW = inputs.loadWatts as number;
        const eff = inputs.efficiency as number;
        const dod = inputs.dod as number;
        if (!ah || !v || !loadW) return null;

        const efficiency = (eff || 90) / 100;
        const dodFraction = (dod || 80) / 100;
        const usableWh = ah * v * dodFraction;
        const actualLoad = loadW / efficiency;
        const runtimeHours = usableWh / actualLoad;
        const runtimeMinutes = runtimeHours * 60;

        const hours = Math.floor(runtimeHours);
        const minutes = Math.round((runtimeHours - hours) * 60);

        return {
          primary: {
            label: "Battery Runtime",
            value: `${hours}h ${minutes}m`,
          },
          details: [
            { label: "Runtime", value: `${formatNumber(runtimeHours, 2)} hours (${formatNumber(runtimeMinutes, 0)} min)` },
            { label: "Usable Energy", value: `${formatNumber(usableWh, 2)} Wh` },
            { label: "Total Energy", value: `${formatNumber(ah * v, 2)} Wh` },
            { label: "Actual Load (with inverter)", value: `${formatNumber(actualLoad, 2)} W` },
            { label: "Current Draw", value: `${formatNumber(actualLoad / v, 2)} A` },
          ],
        };
      },
    },
    {
      id: "charge-time",
      name: "Battery Charge Time",
      description: "Estimate time to charge a battery",
      fields: [
        {
          name: "capacity",
          label: "Battery Capacity (Ah)",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          name: "chargeCurrent",
          label: "Charge Current (A)",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "chargeEfficiency",
          label: "Charge Efficiency (%)",
          type: "number",
          placeholder: "e.g. 85",
          defaultValue: 85,
        },
        {
          name: "currentSoc",
          label: "Current State of Charge (%)",
          type: "number",
          placeholder: "e.g. 20",
          defaultValue: 20,
        },
      ],
      calculate: (inputs) => {
        const ah = inputs.capacity as number;
        const chargeA = inputs.chargeCurrent as number;
        const eff = inputs.chargeEfficiency as number;
        const soc = inputs.currentSoc as number;
        if (!ah || !chargeA) return null;

        const efficiency = (eff || 85) / 100;
        const currentSoc = (soc || 20) / 100;
        const ahNeeded = ah * (1 - currentSoc);
        const chargeTime = ahNeeded / (chargeA * efficiency);

        const hours = Math.floor(chargeTime);
        const minutes = Math.round((chargeTime - hours) * 60);

        return {
          primary: {
            label: "Charge Time",
            value: `${hours}h ${minutes}m`,
          },
          details: [
            { label: "Charge Time", value: `${formatNumber(chargeTime, 2)} hours` },
            { label: "Ah to Charge", value: `${formatNumber(ahNeeded, 2)} Ah` },
            { label: "Charge Current", value: `${formatNumber(chargeA, 2)} A` },
            { label: "Charge Efficiency", value: `${(eff || 85)}%` },
            { label: "C-Rate", value: `${formatNumber(chargeA / ah, 3)}C` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["battery-life-calculator", "solar-panel-sizing-calculator", "power-consumption-calculator"],
  faq: [
    {
      question: "What is the difference between Ah and Wh?",
      answer:
        "Ah (amp-hours) measures charge capacity regardless of voltage. Wh (watt-hours) measures energy and includes voltage: Wh = Ah × V. Two batteries can have the same Ah but different Wh if their voltages differ. Wh is better for comparing energy storage across different voltage systems.",
    },
    {
      question: "What is depth of discharge (DoD)?",
      answer:
        "Depth of discharge is how much of the battery's total capacity is used. Lead-acid batteries should only be discharged to 50% to preserve lifespan. Lithium-ion batteries can typically handle 80% DoD, while LiFePO4 can handle 90-100%. Deeper discharge reduces battery cycle life.",
    },
    {
      question: "What is C-rate?",
      answer:
        "C-rate indicates the charge or discharge rate relative to battery capacity. 1C means the battery is charged/discharged in 1 hour (e.g., 10A for a 10Ah battery). 0.5C takes 2 hours, 2C takes 30 minutes. Most batteries perform best at 0.2C-0.5C charging rate.",
    },
  ],
  formula:
    "Wh = Ah × V | Runtime = (Ah × V × DoD) / (Load W / Efficiency) | Charge Time = Ah needed / (Charge A × Efficiency)",
};
