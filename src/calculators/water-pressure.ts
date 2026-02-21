import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const waterPressureCalculator: CalculatorDefinition = {
  slug: "water-pressure-calculator",
  title: "Water Pressure Calculator",
  description:
    "Free water pressure calculator. Calculate hydrostatic pressure from the height of a water column. P = rho × g × h. 1 foot of water = 0.433 PSI.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "water pressure",
    "hydrostatic pressure",
    "water column pressure",
    "head pressure",
    "feet of water to psi",
    "water head calculator",
  ],
  variants: [
    {
      id: "feet-to-pressure",
      name: "Water Column Height (Feet) to Pressure",
      fields: [
        {
          name: "heightFeet",
          label: "Water Column Height (feet)",
          type: "number",
          placeholder: "e.g. 100",
        },
      ],
      calculate: (inputs) => {
        const heightFt = inputs.heightFeet as number;
        if (heightFt === undefined || heightFt === null) return null;
        const psi = heightFt * 0.433;
        const kpa = psi * 6.89476;
        const bar = kpa / 100;
        const atm = psi / 14.696;
        const meters = heightFt * 0.3048;
        return {
          primary: {
            label: `${formatNumber(heightFt, 4)} feet of water`,
            value: `${formatNumber(psi, 4)} PSI`,
          },
          details: [
            { label: "PSI", value: formatNumber(psi, 4) },
            { label: "kPa", value: formatNumber(kpa, 4) },
            { label: "Bar", value: formatNumber(bar, 4) },
            { label: "Atmospheres", value: formatNumber(atm, 4) },
            { label: "Height in Meters", value: formatNumber(meters, 4) },
          ],
        };
      },
    },
    {
      id: "meters-to-pressure",
      name: "Water Column Height (Meters) to Pressure",
      fields: [
        {
          name: "heightMeters",
          label: "Water Column Height (meters)",
          type: "number",
          placeholder: "e.g. 30",
        },
      ],
      calculate: (inputs) => {
        const heightM = inputs.heightMeters as number;
        if (heightM === undefined || heightM === null) return null;
        // P = rho * g * h = 1000 * 9.80665 * h (Pa)
        const pressurePa = 1000 * 9.80665 * heightM;
        const kpa = pressurePa / 1000;
        const psi = kpa / 6.89476;
        const bar = kpa / 100;
        const atm = pressurePa / 101325;
        const heightFt = heightM / 0.3048;
        return {
          primary: {
            label: `${formatNumber(heightM, 4)} meters of water`,
            value: `${formatNumber(kpa, 4)} kPa`,
          },
          details: [
            { label: "kPa", value: formatNumber(kpa, 4) },
            { label: "PSI", value: formatNumber(psi, 4) },
            { label: "Bar", value: formatNumber(bar, 4) },
            { label: "Atmospheres", value: formatNumber(atm, 4) },
            { label: "Pascals", value: formatNumber(pressurePa, 2) },
            { label: "Height in Feet", value: formatNumber(heightFt, 4) },
          ],
        };
      },
    },
    {
      id: "psi-to-head",
      name: "PSI to Water Column Height",
      fields: [
        {
          name: "psi",
          label: "Pressure (PSI)",
          type: "number",
          placeholder: "e.g. 40",
        },
      ],
      calculate: (inputs) => {
        const psi = inputs.psi as number;
        if (psi === undefined || psi === null) return null;
        const heightFt = psi / 0.433;
        const heightM = heightFt * 0.3048;
        const kpa = psi * 6.89476;
        return {
          primary: {
            label: `${formatNumber(psi, 4)} PSI`,
            value: `${formatNumber(heightFt, 4)} feet of water`,
          },
          details: [
            { label: "Feet of Water", value: formatNumber(heightFt, 4) },
            { label: "Meters of Water", value: formatNumber(heightM, 4) },
            { label: "kPa", value: formatNumber(kpa, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["psi-to-bar-converter", "pressure-calculator", "pipe-flow-calculator"],
  faq: [
    {
      question: "How do I convert feet of water to PSI?",
      answer:
        "Multiply the height in feet by 0.433. For example, 100 feet of water head = 100 × 0.433 = 43.3 PSI. This is based on the density of water at standard conditions.",
    },
    {
      question: "What is hydrostatic pressure?",
      answer:
        "Hydrostatic pressure is the pressure exerted by a fluid at rest due to gravity. The formula is P = rho × g × h, where rho is the fluid density (1000 kg/m3 for water), g is gravitational acceleration (9.80665 m/s2), and h is the height of the fluid column.",
    },
  ],
  formula: "P = ρ × g × h | 1 foot of water ≈ 0.433 PSI | 1 meter of water ≈ 9.807 kPa",
};
