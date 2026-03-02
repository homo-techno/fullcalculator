import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const barometricPressureAltitudeCalculator: CalculatorDefinition = {
  slug: "barometric-pressure-altitude-calculator",
  title: "Barometric Pressure Altitude Calculator",
  description: "Estimate atmospheric pressure at a given altitude.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["barometric","pressure","altitude","atmosphere"],
  variants: [{
    id: "standard",
    name: "Barometric Pressure Altitude",
    description: "Estimate atmospheric pressure at a given altitude.",
    fields: [
      { name: "altitude", label: "Altitude (ft)", type: "number", min: 0, max: 60000, defaultValue: 5000 },
      { name: "seaLevelPressure", label: "Sea Level Pressure (inHg)", type: "number", min: 28, max: 31, defaultValue: 29.92 },
    ],
    calculate: (inputs) => {
    const altitude = inputs.altitude as number;
    const seaLevelPressure = inputs.seaLevelPressure as number;
    const pressureRatio = Math.pow(1 - altitude / 145442, 5.2559);
    const pressure = seaLevelPressure * pressureRatio;
    const pressureMb = pressure * 33.8639;
    return {
      primary: { label: "Pressure at Altitude", value: formatNumber(pressure) + " inHg" },
      details: [
        { label: "Pressure in Millibars", value: formatNumber(pressureMb) + " mb" },
        { label: "Altitude", value: formatNumber(altitude) + " ft" },
        { label: "Sea Level Pressure", value: formatNumber(seaLevelPressure) + " inHg" }
      ]
    };
  },
  }],
  relatedSlugs: ["density-altitude-calculator","dew-point-calculator"],
  faq: [
    { question: "How does pressure change with altitude?", answer: "Pressure decreases about 1 inHg per 1000 feet near sea level." },
    { question: "What is standard sea level pressure?", answer: "Standard sea level pressure is 29.92 inHg or 1013.25 mb." },
  ],
  formula: "Pressure = Sea Level x (1 - Altitude / 145442)^5.2559",
};
