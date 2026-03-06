import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const atmosphericScaleHeightCalculator: CalculatorDefinition = {
  slug: "atmospheric-scale-height-calculator",
  title: "Atmospheric Scale Height Calculator",
  description: "Calculate how atmospheric pressure decreases with altitude using the barometric formula and scale height for any planetary atmosphere.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["scale height","atmospheric pressure altitude","barometric formula","atmospheric density"],
  variants: [{
    id: "standard",
    name: "Atmospheric Scale Height",
    description: "Calculate how atmospheric pressure decreases with altitude using the barometric formula and scale height for any planetary atmosphere.",
    fields: [
      { name: "altitude", label: "Altitude (km)", type: "number", min: 0, max: 500, defaultValue: 10 },
      { name: "surfacePressure", label: "Surface Pressure (atm)", type: "number", min: 0.001, max: 1000, defaultValue: 1 },
      { name: "surfaceTemp", label: "Surface Temperature (K)", type: "number", min: 50, max: 2000, defaultValue: 288 },
      { name: "meanMolWeight", label: "Mean Molecular Weight (g/mol)", type: "number", min: 1, max: 100, defaultValue: 28.97 },
      { name: "surfaceGravity", label: "Surface Gravity (m/s2)", type: "number", min: 0.1, max: 100, defaultValue: 9.81 },
    ],
    calculate: (inputs) => {
    const h = inputs.altitude as number * 1000;
    const P0 = inputs.surfacePressure as number;
    const T = inputs.surfaceTemp as number;
    const M = inputs.meanMolWeight as number / 1000;
    const g = inputs.surfaceGravity as number;
    const R = 8.314;
    const H = R * T / (M * g);
    const pressure = P0 * Math.exp(-h / H);
    const densityRatio = Math.exp(-h / H);
    return {
      primary: { label: "Pressure at Altitude", value: formatNumber(Math.round(pressure * 100000) / 100000) + " atm" },
      details: [
        { label: "Scale Height", value: formatNumber(Math.round(H / 100) / 10) + " km" },
        { label: "Density Ratio", value: formatNumber(Math.round(densityRatio * 100000) / 100000) },
        { label: "Pressure (Pa)", value: formatNumber(Math.round(pressure * 101325 * 100) / 100) + " Pa" }
      ]
    };
  },
  }],
  relatedSlugs: ["orbital-velocity-calculator","planetary-weight-calculator"],
  faq: [
    { question: "What is atmospheric scale height?", answer: "The scale height is the altitude increase needed for atmospheric pressure to decrease by a factor of e (about 2.718). For Earth, the scale height is approximately 8.5 km." },
    { question: "How does pressure change with altitude on Earth?", answer: "At sea level pressure of 1 atm, pressure drops to about 0.37 atm at one scale height (8.5 km), 0.14 atm at two scale heights, and so on exponentially." },
    { question: "Do other planets have different scale heights?", answer: "Yes. Mars has a scale height of about 11 km despite lower gravity because of its thin CO2 atmosphere. Venus has a scale height of about 15 km. Jupiter has about 27 km." },
  ],
  formula: "Scale Height H = RT / (Mg); Pressure = P0 x exp(-h / H); where R = 8.314 J/(mol K), M = molar mass, g = gravity",
};
