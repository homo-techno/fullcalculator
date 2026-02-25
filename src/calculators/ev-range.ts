import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const evRangeCalculator: CalculatorDefinition = {
  slug: "ev-range-calculator",
  title: "Electric Vehicle Range Calculator",
  description: "Free EV range calculator. Estimate your electric vehicle's real-world driving range based on battery size, efficiency, and conditions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["ev range calculator", "electric car range", "EV battery range", "electric vehicle range estimate", "EV mileage calculator"],
  variants: [
    {
      id: "range",
      name: "Estimated Range",
      description: "Calculate real-world EV range based on conditions",
      fields: [
        { name: "batteryKwh", label: "Battery Capacity", type: "number", placeholder: "e.g. 75", suffix: "kWh" },
        { name: "efficiency", label: "Efficiency", type: "number", placeholder: "e.g. 3.5", suffix: "mi/kWh" },
        { name: "chargeLevel", label: "Current Charge Level", type: "number", placeholder: "e.g. 90", suffix: "%" },
        { name: "temperature", label: "Outside Temperature", type: "select", options: [
          { label: "Very cold (< 20°F)", value: "0.7" },
          { label: "Cold (20-40°F)", value: "0.8" },
          { label: "Cool (40-60°F)", value: "0.9" },
          { label: "Ideal (60-80°F)", value: "1.0" },
          { label: "Hot (80-100°F)", value: "0.95" },
          { label: "Very hot (> 100°F)", value: "0.9" },
        ], defaultValue: "1.0" },
        { name: "driving", label: "Driving Type", type: "select", options: [
          { label: "City driving", value: "1.1" },
          { label: "Mixed driving", value: "1.0" },
          { label: "Highway driving", value: "0.85" },
        ], defaultValue: "1.0" },
      ],
      calculate: (inputs) => {
        const battery = inputs.batteryKwh as number;
        const efficiency = inputs.efficiency as number;
        const charge = (inputs.chargeLevel as number) || 100;
        const tempFactor = parseFloat(inputs.temperature as string) || 1.0;
        const drivingFactor = parseFloat(inputs.driving as string) || 1.0;
        if (!battery || !efficiency) return null;

        const availableKwh = battery * (charge / 100);
        const adjustedEfficiency = efficiency * tempFactor * drivingFactor;
        const estimatedRange = availableKwh * adjustedEfficiency;
        const idealRange = battery * efficiency;

        return {
          primary: { label: "Estimated Range", value: `${formatNumber(estimatedRange, 0)} miles` },
          details: [
            { label: "Available energy", value: `${formatNumber(availableKwh, 1)} kWh` },
            { label: "Adjusted efficiency", value: `${formatNumber(adjustedEfficiency, 2)} mi/kWh` },
            { label: "Ideal max range (100%)", value: `${formatNumber(idealRange, 0)} miles` },
            { label: "Range reduction", value: `${formatNumber(((idealRange - estimatedRange) / idealRange) * 100, 0)}%` },
          ],
        };
      },
    },
    {
      id: "trip",
      name: "Can I Make the Trip?",
      description: "Check if your EV can complete a trip on current charge",
      fields: [
        { name: "currentRange", label: "Current Displayed Range", type: "number", placeholder: "e.g. 200", suffix: "miles" },
        { name: "tripDistance", label: "Trip Distance (one way)", type: "number", placeholder: "e.g. 120", suffix: "miles" },
        { name: "roundTrip", label: "Round Trip?", type: "select", options: [
          { label: "One way", value: "1" },
          { label: "Round trip", value: "2" },
        ], defaultValue: "1" },
        { name: "safetyMargin", label: "Safety Margin", type: "number", placeholder: "e.g. 15", suffix: "%" },
      ],
      calculate: (inputs) => {
        const range = inputs.currentRange as number;
        const distance = inputs.tripDistance as number;
        const multiplier = parseInt(inputs.roundTrip as string) || 1;
        const margin = (inputs.safetyMargin as number) || 10;
        if (!range || !distance) return null;

        const totalDistance = distance * multiplier;
        const safeRange = range * (1 - margin / 100);
        const canMakeIt = safeRange >= totalDistance;
        const remaining = safeRange - totalDistance;

        return {
          primary: { label: "Can You Make It?", value: canMakeIt ? "Yes" : "No - Charge Needed" },
          details: [
            { label: "Total trip distance", value: `${formatNumber(totalDistance, 0)} miles` },
            { label: "Safe usable range", value: `${formatNumber(safeRange, 0)} miles` },
            { label: remaining >= 0 ? "Range to spare" : "Range shortfall", value: `${formatNumber(Math.abs(remaining), 0)} miles` },
            { label: "Safety buffer", value: `${margin}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ev-charging-cost-calculator", "ev-savings-calculator", "fuel-cost-calculator"],
  faq: [
    { question: "Why is my EV range less than advertised?", answer: "Real-world range is typically 15-30% less than EPA estimates. Cold weather, highway speeds, HVAC use, hilly terrain, and aggressive driving all reduce range. City driving often gives better range than highway due to regenerative braking." },
    { question: "What affects EV range the most?", answer: "Temperature is the biggest factor, with cold weather reducing range by 20-40%. Highway speeds above 65 mph, heating/AC use, headwinds, and aggressive driving also significantly impact range." },
  ],
  formula: "Range = Available kWh × Efficiency × Temperature Factor × Driving Factor",
};
