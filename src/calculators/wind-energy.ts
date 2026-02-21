import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const AIR_DENSITY = 1.225; // kg/m³ at sea level

export const windEnergyCalculator: CalculatorDefinition = {
  slug: "wind-energy-calculator",
  title: "Wind Energy Calculator",
  description:
    "Free wind energy calculator. Compute power output using P = 0.5 × ρ × A × v³ × Cp with Betz limit consideration.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "wind energy",
    "wind turbine",
    "betz limit",
    "wind power",
    "rotor",
    "renewable",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Wind Power",
      fields: [
        {
          name: "diameter",
          label: "Rotor Diameter (m)",
          type: "number",
          placeholder: "e.g. 80",
        },
        {
          name: "windSpeed",
          label: "Wind Speed (m/s)",
          type: "number",
          placeholder: "e.g. 12",
        },
        {
          name: "cp",
          label: "Power Coefficient Cp (0 to 0.59)",
          type: "number",
          placeholder: "e.g. 0.4",
        },
        {
          name: "airDensity",
          label: "Air Density (kg/m³) — default 1.225",
          type: "number",
          placeholder: "1.225",
        },
      ],
      calculate: (inputs) => {
        const diameter = inputs.diameter as number;
        const windSpeed = inputs.windSpeed as number;
        const cp = inputs.cp as number;
        const rho = (inputs.airDensity as number) || AIR_DENSITY;
        if (!diameter || !windSpeed || !cp) return null;
        if (cp <= 0 || cp > 0.5927) return null; // Betz limit

        const radius = diameter / 2;
        const area = Math.PI * radius * radius;
        const availablePower = 0.5 * rho * area * Math.pow(windSpeed, 3);
        const extractedPower = availablePower * cp;
        const dailyEnergy = (extractedPower * 24) / 1000; // kWh per day
        const betzMax = availablePower * 0.5927;

        return {
          primary: {
            label: "Extracted Power",
            value: formatNumber(extractedPower, 2) + " W",
          },
          details: [
            {
              label: "Extracted Power (kW)",
              value: formatNumber(extractedPower / 1000, 4) + " kW",
            },
            {
              label: "Available Wind Power",
              value: formatNumber(availablePower, 2) + " W",
            },
            {
              label: "Betz Limit Maximum",
              value: formatNumber(betzMax, 2) + " W",
            },
            {
              label: "Swept Area",
              value: formatNumber(area, 2) + " m²",
            },
            {
              label: "Daily Energy (at constant wind)",
              value: formatNumber(dailyEnergy, 2) + " kWh",
            },
            {
              label: "Air Density",
              value: formatNumber(rho, 4) + " kg/m³",
            },
            { label: "Cp", value: formatNumber(cp, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["solar-panel-calculator", "work-energy-calculator"],
  faq: [
    {
      question: "What is the Betz limit?",
      answer:
        "The Betz limit (59.3%) is the theoretical maximum fraction of wind energy that can be extracted by a turbine. No wind turbine can exceed this efficiency.",
    },
    {
      question: "Why does power increase with the cube of wind speed?",
      answer:
        "Wind power is proportional to v³ because kinetic energy depends on velocity squared, and the mass flow rate through the rotor increases linearly with velocity. Together, P = 0.5ρAv³.",
    },
  ],
  formula:
    "P = 0.5 × ρ × A × v³ × Cp, where ρ = air density (1.225 kg/m³), A = πr² (swept area), v = wind speed, Cp = power coefficient (max 0.5927 Betz limit).",
};
