import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rcFlightTimeCalculator: CalculatorDefinition = {
  slug: "rc-flight-time-calculator",
  title: "RC Flight Time Calculator",
  description:
    "Free RC airplane and drone flight time calculator. Estimate flight duration based on battery capacity, motor power draw, and aircraft weight.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "rc flight time calculator",
    "drone flight time",
    "rc airplane battery calculator",
    "lipo flight time",
    "drone battery life",
  ],
  variants: [
    {
      id: "flight-time",
      name: "Flight Time Estimator",
      description: "Estimate flight time from battery and current draw",
      fields: [
        {
          name: "batteryMah",
          label: "Battery Capacity (mAh)",
          type: "number",
          placeholder: "e.g. 2200",
          min: 100,
          max: 50000,
        },
        {
          name: "avgCurrentDraw",
          label: "Average Current Draw (A)",
          type: "number",
          placeholder: "e.g. 15",
          min: 0.1,
          max: 200,
          step: 0.1,
        },
        {
          name: "cellCount",
          label: "Battery Cell Count (S)",
          type: "select",
          options: [
            { label: "1S (3.7V)", value: "1" },
            { label: "2S (7.4V)", value: "2" },
            { label: "3S (11.1V)", value: "3" },
            { label: "4S (14.8V)", value: "4" },
            { label: "6S (22.2V)", value: "6" },
          ],
          defaultValue: "3",
        },
        {
          name: "dischargeLimit",
          label: "Discharge Limit",
          type: "select",
          options: [
            { label: "80% (safe, LiPo longevity)", value: "80" },
            { label: "90% (normal use)", value: "90" },
            { label: "100% (maximum, reduces battery life)", value: "100" },
          ],
          defaultValue: "80",
        },
      ],
      calculate: (inputs) => {
        const mah = parseFloat(inputs.batteryMah as string);
        const amps = parseFloat(inputs.avgCurrentDraw as string);
        const cells = parseFloat(inputs.cellCount as string);
        const dischargePct = parseFloat(inputs.dischargeLimit as string) / 100;
        if (!mah || !amps || !cells) return null;

        const usableMah = mah * dischargePct;
        const flightTimeMinutes = (usableMah / 1000) / amps * 60;
        const voltage = cells * 3.7;
        const powerWatts = voltage * amps;
        const energyWh = (mah / 1000) * voltage;
        const usableWh = energyWh * dischargePct;

        return {
          primary: {
            label: "Estimated Flight Time",
            value: formatNumber(flightTimeMinutes, 1) + " minutes",
          },
          details: [
            { label: "Usable Capacity", value: formatNumber(usableMah, 0) + " mAh" },
            { label: "Battery Voltage", value: formatNumber(voltage, 1) + " V" },
            { label: "Power Draw", value: formatNumber(powerWatts, 0) + " W" },
            { label: "Total Energy", value: formatNumber(energyWh, 1) + " Wh" },
            { label: "Usable Energy", value: formatNumber(usableWh, 1) + " Wh" },
            { label: "Avg Current", value: formatNumber(amps, 1) + " A" },
          ],
          note: "Actual flight time varies with throttle usage, wind, maneuvers, and temperature. Budget 80% of calculated time for safety margin. Land before voltage sags.",
        };
      },
    },
    {
      id: "battery-sizing",
      name: "Battery Size Selector",
      description: "Find the right battery for target flight time",
      fields: [
        {
          name: "targetMinutes",
          label: "Target Flight Time (minutes)",
          type: "number",
          placeholder: "e.g. 10",
          min: 1,
          max: 120,
        },
        {
          name: "avgCurrentDraw",
          label: "Average Current Draw (A)",
          type: "number",
          placeholder: "e.g. 15",
          min: 0.1,
          max: 200,
          step: 0.1,
        },
        {
          name: "cellCount",
          label: "Battery Cells (S)",
          type: "select",
          options: [
            { label: "2S (7.4V)", value: "2" },
            { label: "3S (11.1V)", value: "3" },
            { label: "4S (14.8V)", value: "4" },
            { label: "6S (22.2V)", value: "6" },
          ],
          defaultValue: "3",
        },
        {
          name: "maxWeight",
          label: "Max Battery Weight (grams)",
          type: "number",
          placeholder: "e.g. 300",
          min: 10,
          max: 5000,
        },
      ],
      calculate: (inputs) => {
        const targetMin = parseFloat(inputs.targetMinutes as string);
        const amps = parseFloat(inputs.avgCurrentDraw as string);
        const cells = parseFloat(inputs.cellCount as string);
        const maxWeight = parseFloat(inputs.maxWeight as string);
        if (!targetMin || !amps || !cells) return null;

        // Required capacity at 80% discharge
        const requiredMah = (amps * targetMin / 60) * 1000 / 0.8;
        const voltage = cells * 3.7;
        const energyWh = (requiredMah / 1000) * voltage;

        // Approximate LiPo weight (roughly 6-8 Wh/kg for standard packs)
        const estimatedWeightG = energyWh / 0.15; // ~150 Wh/kg for modern LiPo
        const estimatedWeightOz = estimatedWeightG / 28.35;

        // C-rating needed
        const cRating = (amps * 1000) / requiredMah;
        const recommendedC = Math.ceil(cRating * 1.5); // 50% headroom

        const fitsWeight = maxWeight ? (estimatedWeightG <= maxWeight ? "Yes" : "No - too heavy") : "N/A";

        return {
          primary: {
            label: "Minimum Battery Size",
            value: formatNumber(requiredMah, 0) + " mAh",
          },
          details: [
            { label: "Battery Config", value: formatNumber(cells, 0) + "S " + formatNumber(requiredMah, 0) + " mAh" },
            { label: "Energy Required", value: formatNumber(energyWh, 1) + " Wh" },
            { label: "Est. Battery Weight", value: formatNumber(estimatedWeightG, 0) + " g (" + formatNumber(estimatedWeightOz, 1) + " oz)" },
            { label: "Min C-Rating", value: formatNumber(recommendedC, 0) + "C" },
            { label: "Fits Weight Limit", value: fitsWeight },
            { label: "Voltage", value: formatNumber(voltage, 1) + " V" },
          ],
          note: "Round up to the nearest standard battery size. Higher capacity = more weight = more current draw. Find the sweet spot for your aircraft.",
        };
      },
    },
  ],
  relatedSlugs: ["electricity-calculator", "speed-converter", "unit-converter"],
  faq: [
    {
      question: "How do I calculate RC flight time?",
      answer:
        "Flight time (minutes) = (Battery mAh × Discharge % / 1000) / Average Amps × 60. For example, a 2200 mAh battery at 80% discharge with 15A average draw: (2200 × 0.8 / 1000) / 15 × 60 = 7 minutes. Real-world times are typically 70-80% of calculated.",
    },
    {
      question: "What is a safe LiPo discharge level?",
      answer:
        "Never discharge a LiPo battery below 3.5V per cell (80% discharge). For maximum battery longevity, land at 3.7V per cell (roughly 60-70% discharge). Discharging below 3.0V per cell can permanently damage the battery and create a fire hazard.",
    },
    {
      question: "How does battery weight affect flight time?",
      answer:
        "Adding a larger battery increases capacity but also weight, which increases current draw. There is a diminishing return point where adding battery weight reduces flight time. The optimal battery weight is typically 30-40% of the all-up weight for multirotors.",
    },
  ],
  formula:
    "Flight Time (min) = (mAh × Discharge% / 1000) / Amps × 60 | Power (W) = Voltage × Current | Energy (Wh) = (mAh / 1000) × Voltage",
};
