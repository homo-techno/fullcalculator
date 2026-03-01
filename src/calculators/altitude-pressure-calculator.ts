import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const altitudePressureCalculator: CalculatorDefinition = {
  slug: "altitude-pressure-calculator",
  title: "Altitude Pressure Calculator",
  description: "Calculate atmospheric pressure at a given altitude using the barometric formula.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["altitude pressure", "atmospheric pressure altitude", "barometric formula"],
  variants: [{
    id: "standard",
    name: "Altitude Pressure",
    description: "Calculate atmospheric pressure at a given altitude using the barometric formula",
    fields: [
      { name: "altitude", label: "Altitude", type: "number", suffix: "meters", min: 0, max: 50000, defaultValue: 2000 },
      { name: "seaLevelPressure", label: "Sea Level Pressure", type: "number", suffix: "hPa", min: 900, max: 1100, defaultValue: 1013.25 },
      { name: "temperature", label: "Temperature at Sea Level", type: "number", suffix: "C", min: -50, max: 50, defaultValue: 15 },
    ],
    calculate: (inputs) => {
      const alt = inputs.altitude as number;
      const P0 = inputs.seaLevelPressure as number;
      const T0 = (inputs.temperature as number) + 273.15;
      if (alt === undefined || !P0 || !T0) return null;
      const g = 9.80665;
      const M = 0.0289644;
      const R = 8.31447;
      const L = 0.0065;
      const pressure = P0 * Math.pow((T0 - L * alt) / T0, (g * M) / (R * L));
      const pctSeaLevel = (pressure / P0) * 100;
      const oxygenPct = 20.9 * (pressure / 1013.25);
      return {
        primary: { label: "Pressure at Altitude", value: formatNumber(Math.round(pressure * 100) / 100) + " hPa" },
        details: [
          { label: "Percent of Sea Level", value: formatNumber(Math.round(pctSeaLevel * 10) / 10) + "%" },
          { label: "Effective Oxygen", value: formatNumber(Math.round(oxygenPct * 10) / 10) + "% equivalent" },
          { label: "Altitude", value: formatNumber(alt) + " m (" + formatNumber(Math.round(alt * 3.28084)) + " ft)" },
        ],
      };
    },
  }],
  relatedSlugs: ["escape-velocity-calculator", "terminal-velocity-calculator"],
  faq: [
    { question: "How does pressure change with altitude?", answer: "Atmospheric pressure decreases roughly exponentially with altitude. At about 5,500 meters (18,000 ft), pressure is approximately half of sea level pressure." },
    { question: "At what altitude is breathing difficult?", answer: "Most people begin to feel altitude effects above 2,400 meters (8,000 ft). Above 8,000 meters (26,000 ft) is the death zone where supplemental oxygen is required." },
  ],
  formula: "P = P0 x ((T0 - L x h) / T0)^(gM / RL) where L = 0.0065 K/m",
};
