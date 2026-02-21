import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const electricRangeCalculator: CalculatorDefinition = {
  slug: "electric-range-calculator",
  title: "Electric Vehicle Range Calculator",
  description: "Free EV range calculator. Estimate your electric vehicle's real-world driving range based on battery size, efficiency, speed, temperature, and conditions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["ev range calculator", "electric vehicle range", "electric car range", "ev battery range", "ev driving range estimator"],
  variants: [
    {
      id: "range",
      name: "Estimate EV Range",
      description: "Calculate real-world EV range based on conditions",
      fields: [
        { name: "batteryKwh", label: "Battery Capacity (kWh)", type: "number", placeholder: "e.g. 75" },
        { name: "efficiency", label: "Rated Efficiency (mi/kWh)", type: "number", placeholder: "e.g. 3.5", step: 0.1 },
        { name: "currentCharge", label: "Current State of Charge (%)", type: "number", placeholder: "e.g. 90", suffix: "%", defaultValue: 100 },
        { name: "speed", label: "Average Speed", type: "select", options: [
          { label: "City driving (25-35 mph)", value: "city" },
          { label: "Suburban (35-50 mph)", value: "suburban" },
          { label: "Highway (55-65 mph)", value: "highway55" },
          { label: "Highway (65-75 mph)", value: "highway70" },
          { label: "Highway (75+ mph)", value: "highway80" },
        ], defaultValue: "highway55" },
        { name: "temperature", label: "Outside Temperature", type: "select", options: [
          { label: "Very cold (below 20°F)", value: "verycold" },
          { label: "Cold (20-40°F)", value: "cold" },
          { label: "Cool (40-60°F)", value: "cool" },
          { label: "Mild (60-80°F)", value: "mild" },
          { label: "Hot (80-95°F)", value: "hot" },
          { label: "Very hot (above 95°F)", value: "veryhot" },
        ], defaultValue: "mild" },
        { name: "hvac", label: "HVAC Use", type: "select", options: [
          { label: "Off", value: "off" },
          { label: "Low (fan/light climate)", value: "low" },
          { label: "High (heating or AC)", value: "high" },
        ], defaultValue: "low" },
      ],
      calculate: (inputs) => {
        const batteryKwh = inputs.batteryKwh as number;
        const ratedEfficiency = inputs.efficiency as number;
        const soc = (inputs.currentCharge as number) || 100;
        const speed = (inputs.speed as string) || "highway55";
        const temp = (inputs.temperature as string) || "mild";
        const hvac = (inputs.hvac as string) || "low";
        if (!batteryKwh || !ratedEfficiency) return null;

        const usableKwh = batteryKwh * (soc / 100);

        // Speed factor (highway speeds reduce efficiency significantly)
        const speedFactors: Record<string, number> = {
          city: 1.10,      // city driving is often more efficient for EVs (regen)
          suburban: 1.0,
          highway55: 0.92,
          highway70: 0.80,
          highway80: 0.68,
        };

        // Temperature factor (cold and hot reduce range)
        const tempFactors: Record<string, number> = {
          verycold: 0.60,
          cold: 0.75,
          cool: 0.90,
          mild: 1.0,
          hot: 0.95,
          veryhot: 0.88,
        };

        // HVAC factor
        const hvacFactors: Record<string, number> = {
          off: 1.0,
          low: 0.95,
          high: 0.85,
        };

        const speedF = speedFactors[speed] || 1.0;
        const tempF = tempFactors[temp] || 1.0;
        const hvacF = hvacFactors[hvac] || 1.0;

        const adjustedEfficiency = ratedEfficiency * speedF * tempF * hvacF;
        const estimatedRange = usableKwh * adjustedEfficiency;
        const ratedRange = batteryKwh * ratedEfficiency;
        const rangeLoss = ratedRange - (batteryKwh * adjustedEfficiency);
        const rangeLossPct = (rangeLoss / ratedRange) * 100;

        return {
          primary: { label: "Estimated Range", value: `${formatNumber(estimatedRange, 0)} miles` },
          details: [
            { label: "EPA-rated range (100%)", value: `${formatNumber(ratedRange, 0)} miles` },
            { label: "Adjusted efficiency", value: `${formatNumber(adjustedEfficiency, 2)} mi/kWh` },
            { label: "Usable energy", value: `${formatNumber(usableKwh, 1)} kWh` },
            { label: "Range reduction", value: `${formatNumber(rangeLossPct, 0)}% from rated` },
            { label: "Energy cost ($0.13/kWh)", value: `$${formatNumber(usableKwh * 0.13, 2)} for full charge` },
          ],
        };
      },
    },
    {
      id: "trip",
      name: "EV Trip Planner",
      description: "Check if you can make a trip without charging",
      fields: [
        { name: "tripDistance", label: "Trip Distance (miles)", type: "number", placeholder: "e.g. 200" },
        { name: "batteryKwh", label: "Battery Capacity (kWh)", type: "number", placeholder: "e.g. 75" },
        { name: "efficiency", label: "Expected Efficiency (mi/kWh)", type: "number", placeholder: "e.g. 3.0", step: 0.1 },
        { name: "startCharge", label: "Starting Charge (%)", type: "number", placeholder: "e.g. 90", suffix: "%" },
        { name: "minArrival", label: "Min Arrival Charge (%)", type: "number", placeholder: "e.g. 10", suffix: "%", defaultValue: 10 },
      ],
      calculate: (inputs) => {
        const distance = inputs.tripDistance as number;
        const battery = inputs.batteryKwh as number;
        const efficiency = inputs.efficiency as number;
        const startPct = (inputs.startCharge as number) || 100;
        const minPct = (inputs.minArrival as number) || 10;
        if (!distance || !battery || !efficiency) return null;

        const startKwh = battery * (startPct / 100);
        const minKwh = battery * (minPct / 100);
        const usableKwh = startKwh - minKwh;
        const maxRange = usableKwh * efficiency;
        const energyNeeded = distance / efficiency;
        const arrivalKwh = startKwh - energyNeeded;
        const arrivalPct = (arrivalKwh / battery) * 100;

        const canMakeIt = arrivalPct >= minPct;
        const chargeNeeded = canMakeIt ? 0 : (minPct - arrivalPct) / 100 * battery;

        return {
          primary: { label: canMakeIt ? "You Can Make It!" : "Charging Stop Needed", value: canMakeIt ? `${formatNumber(arrivalPct, 0)}% remaining` : `Need ${formatNumber(chargeNeeded, 1)} kWh` },
          details: [
            { label: "Energy needed", value: `${formatNumber(energyNeeded, 1)} kWh` },
            { label: "Usable energy", value: `${formatNumber(usableKwh, 1)} kWh` },
            { label: "Arrival charge", value: `${formatNumber(Math.max(0, arrivalPct), 0)}%` },
            { label: "Buffer range", value: `${formatNumber(Math.max(0, maxRange - distance), 0)} miles` },
            { label: "Max range (to ${minPct}%)", value: `${formatNumber(maxRange, 0)} miles` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ev-charging-calculator", "emission-calculator", "mpg-calculator"],
  faq: [
    { question: "How does temperature affect EV range?", answer: "Cold weather is the biggest range killer. At 20°F, an EV can lose 20-40% of its range due to battery chemistry (lithium-ion batteries are less efficient when cold) and cabin heating (which draws from the same battery). Heat also reduces range by 5-15% due to AC use and thermal management." },
    { question: "Why is highway range lower than city range for EVs?", answer: "Unlike gas cars, EVs are more efficient at lower speeds. At highway speeds (70+ mph), aerodynamic drag increases exponentially and there is no regenerative braking. An EV rated at 300 miles may only achieve 200-240 miles of highway range at 75 mph." },
    { question: "What is a good mi/kWh efficiency?", answer: "Smaller efficient EVs (like a Tesla Model 3) achieve 3.5-4.5 mi/kWh. Mid-size EVs get 2.5-3.5 mi/kWh. Large electric trucks and SUVs get 1.8-2.5 mi/kWh. Higher numbers mean more efficient use of battery energy." },
  ],
  formula: "Range = Battery (kWh) x Efficiency (mi/kWh) x Speed Factor x Temperature Factor x HVAC Factor",
};
