import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rocketThrustCalculator: CalculatorDefinition = {
  slug: "rocket-thrust-calculator",
  title: "Rocket Thrust Calculator",
  description: "Free rocket thrust calculator. Calculate the thrust force of a rocket from mass flow rate and exhaust velocity.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["rocket thrust", "thrust calculator", "mass flow rate", "exhaust velocity", "rocket propulsion"],
  variants: [
    {
      id: "thrust",
      name: "Calculate Thrust",
      description: "F = mass_flow_rate * exhaust_velocity",
      fields: [
        { name: "massFlow", label: "Mass Flow Rate (kg/s)", type: "number", placeholder: "e.g. 500" },
        { name: "exhaustVel", label: "Exhaust Velocity (m/s)", type: "number", placeholder: "e.g. 3000" },
      ],
      calculate: (inputs) => {
        const mdot = inputs.massFlow as number;
        const ve = inputs.exhaustVel as number;
        if (!mdot || !ve) return null;
        const thrust = mdot * ve;
        const thrustKN = thrust / 1000;
        const isp = ve / 9.81;
        return {
          primary: { label: "Thrust", value: `${formatNumber(thrustKN, 2)} kN` },
          details: [
            { label: "Thrust (N)", value: formatNumber(thrust, 2) },
            { label: "Thrust (kN)", value: formatNumber(thrustKN, 2) },
            { label: "Specific Impulse (Isp)", value: `${formatNumber(isp, 1)} s` },
            { label: "Mass Flow Rate", value: `${formatNumber(mdot)} kg/s` },
            { label: "Exhaust Velocity", value: `${formatNumber(ve)} m/s` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["delta-v-calculator", "satellite-velocity-calculator", "satellite-period-calculator"],
  faq: [
    { question: "How is rocket thrust calculated?", answer: "Thrust equals mass flow rate times exhaust velocity: F = mdot * Ve." },
    { question: "What is specific impulse?", answer: "Specific impulse (Isp) measures engine efficiency. It equals exhaust velocity divided by g (9.81 m/s^2)." },
  ],
  formula: "F = mdot x Ve | Isp = Ve / g",
};
