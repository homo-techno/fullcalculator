import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const droneFlightTimeCalculator: CalculatorDefinition = {
  slug: "drone-flight-time-calculator",
  title: "Drone Battery & Flight Time Calculator",
  description: "Free online drone flight time calculator. Estimate battery life, flight time, and power consumption for multi-rotor drones.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["drone flight time calculator", "drone battery calculator", "quadcopter battery life", "drone power calculator", "flight time estimator"],
  variants: [
    {
      id: "flight-time",
      name: "Flight Time Estimator",
      description: "Estimate flight time based on battery and drone specs",
      fields: [
        { name: "batteryCapacity", label: "Battery Capacity (mAh)", type: "number", placeholder: "e.g. 5000" },
        { name: "voltage", label: "Battery Voltage (V)", type: "select", options: [
          { label: "7.4V (2S)", value: "7.4" },
          { label: "11.1V (3S)", value: "11.1" },
          { label: "14.8V (4S)", value: "14.8" },
          { label: "22.2V (6S)", value: "22.2" },
        ], defaultValue: "14.8" },
        { name: "auw", label: "All-Up Weight (grams)", type: "number", placeholder: "e.g. 1500" },
        { name: "numMotors", label: "Number of Motors", type: "select", options: [
          { label: "3 (tricopter)", value: "3" },
          { label: "4 (quadcopter)", value: "4" },
          { label: "6 (hexacopter)", value: "6" },
          { label: "8 (octocopter)", value: "8" },
        ], defaultValue: "4" },
        { name: "efficiency", label: "Motor Efficiency (g/W)", type: "number", placeholder: "e.g. 5", defaultValue: 5 },
        { name: "dischargePct", label: "Usable Battery (%)", type: "number", placeholder: "e.g. 80", defaultValue: 80 },
      ],
      calculate: (inputs) => {
        const capacity = parseFloat(inputs.batteryCapacity as string) || 0;
        const voltage = parseFloat(inputs.voltage as string) || 14.8;
        const auw = parseFloat(inputs.auw as string) || 0;
        const numMotors = parseFloat(inputs.numMotors as string) || 4;
        const efficiency = parseFloat(inputs.efficiency as string) || 5;
        const discharge = parseFloat(inputs.dischargePct as string) || 80;
        if (!capacity || !auw) return null;

        const energyWh = (capacity / 1000) * voltage;
        const usableEnergy = energyWh * (discharge / 100);
        const hoverPower = auw / efficiency;
        const flightTimeHours = usableEnergy / hoverPower;
        const flightTimeMin = flightTimeHours * 60;
        const perMotorPower = hoverPower / numMotors;
        const currentDraw = hoverPower / voltage;

        return {
          primary: { label: "Estimated Flight Time", value: `${formatNumber(flightTimeMin, 1)} minutes` },
          details: [
            { label: "Battery energy", value: `${formatNumber(energyWh, 1)} Wh` },
            { label: "Usable energy", value: `${formatNumber(usableEnergy, 1)} Wh (${discharge}%)` },
            { label: "Hover power draw", value: `${formatNumber(hoverPower, 1)} W` },
            { label: "Power per motor", value: `${formatNumber(perMotorPower, 1)} W` },
            { label: "Total current draw", value: `${formatNumber(currentDraw, 1)} A` },
            { label: "All-up weight", value: `${formatNumber(auw)} g` },
          ],
          note: "Actual flight time varies with wind, flying style, payload, and temperature. Aggressive flying can reduce time by 30-50%.",
        };
      },
    },
    {
      id: "battery-compare",
      name: "Battery Comparison",
      description: "Compare two batteries for the same drone",
      fields: [
        { name: "cap1", label: "Battery 1 Capacity (mAh)", type: "number", placeholder: "e.g. 3000" },
        { name: "weight1", label: "Battery 1 Weight (grams)", type: "number", placeholder: "e.g. 280" },
        { name: "cap2", label: "Battery 2 Capacity (mAh)", type: "number", placeholder: "e.g. 5000" },
        { name: "weight2", label: "Battery 2 Weight (grams)", type: "number", placeholder: "e.g. 450" },
        { name: "voltage", label: "Battery Voltage (V)", type: "number", placeholder: "e.g. 14.8", defaultValue: 14.8 },
        { name: "droneWeight", label: "Drone Weight without Battery (g)", type: "number", placeholder: "e.g. 1000" },
        { name: "efficiency", label: "Motor Efficiency (g/W)", type: "number", placeholder: "e.g. 5", defaultValue: 5 },
      ],
      calculate: (inputs) => {
        const cap1 = parseFloat(inputs.cap1 as string) || 0;
        const w1 = parseFloat(inputs.weight1 as string) || 0;
        const cap2 = parseFloat(inputs.cap2 as string) || 0;
        const w2 = parseFloat(inputs.weight2 as string) || 0;
        const voltage = parseFloat(inputs.voltage as string) || 14.8;
        const droneW = parseFloat(inputs.droneWeight as string) || 0;
        const eff = parseFloat(inputs.efficiency as string) || 5;
        if (!cap1 || !cap2 || !droneW) return null;

        const auw1 = droneW + w1;
        const auw2 = droneW + w2;
        const energy1 = (cap1 / 1000) * voltage * 0.8;
        const energy2 = (cap2 / 1000) * voltage * 0.8;
        const power1 = auw1 / eff;
        const power2 = auw2 / eff;
        const time1 = (energy1 / power1) * 60;
        const time2 = (energy2 / power2) * 60;
        const energyDensity1 = energy1 / (w1 / 1000);
        const energyDensity2 = energy2 / (w2 / 1000);

        return {
          primary: { label: "Best Flight Time", value: `${formatNumber(Math.max(time1, time2), 1)} min (Battery ${time1 > time2 ? "1" : "2"})` },
          details: [
            { label: "Battery 1 flight time", value: `${formatNumber(time1, 1)} min` },
            { label: "Battery 1 AUW", value: `${formatNumber(auw1)} g` },
            { label: "Battery 1 energy density", value: `${formatNumber(energyDensity1, 1)} Wh/kg` },
            { label: "Battery 2 flight time", value: `${formatNumber(time2, 1)} min` },
            { label: "Battery 2 AUW", value: `${formatNumber(auw2)} g` },
            { label: "Battery 2 energy density", value: `${formatNumber(energyDensity2, 1)} Wh/kg` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["electricity-cost-calculator", "speed-calculator"],
  faq: [
    { question: "How is drone flight time calculated?", answer: "Flight time = Battery energy (Wh) / Power consumption (W). Energy = capacity (Ah) × voltage. Power consumption depends on drone weight and motor efficiency. Use only 80% of battery capacity to protect battery health." },
    { question: "What affects drone flight time?", answer: "Key factors: battery capacity, drone weight, wind conditions, flying style (hovering vs. aggressive), temperature (cold reduces capacity), altitude, and payload. Hovering is more efficient than constant maneuvering." },
    { question: "How do I improve flight time?", answer: "Use a larger battery (if thrust-to-weight ratio allows), reduce weight, fly in calm conditions, use efficient propellers, and avoid aggressive maneuvers. Keep batteries warm in cold weather." },
  ],
  formula: "Flight Time (min) = (Battery mAh / 1000 × Voltage × Discharge%) / (Weight / Efficiency) × 60",
};
