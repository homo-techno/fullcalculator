import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const deltaVCalculator: CalculatorDefinition = {
  slug: "delta-v-calculator",
  title: "Delta-V Calculator",
  description: "Free delta-v calculator. Calculate the delta-v of a rocket using the Tsiolkovsky rocket equation.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["delta-v calculator", "tsiolkovsky equation", "rocket equation", "delta v budget", "space maneuver"],
  variants: [
    {
      id: "delta-v",
      name: "Calculate Delta-V",
      description: "dv = Ve * ln(m0 / mf)",
      fields: [
        { name: "exhaustVel", label: "Exhaust Velocity (m/s)", type: "number", placeholder: "e.g. 3000" },
        { name: "wetMass", label: "Wet Mass / Initial Mass (kg)", type: "number", placeholder: "e.g. 100000" },
        { name: "dryMass", label: "Dry Mass / Final Mass (kg)", type: "number", placeholder: "e.g. 10000" },
      ],
      calculate: (inputs) => {
        const ve = inputs.exhaustVel as number;
        const m0 = inputs.wetMass as number;
        const mf = inputs.dryMass as number;
        if (!ve || !m0 || !mf || mf >= m0) return null;
        const dv = ve * Math.log(m0 / mf);
        const massRatio = m0 / mf;
        const propMass = m0 - mf;
        const isp = ve / 9.81;
        return {
          primary: { label: "Delta-V", value: `${formatNumber(dv, 2)} m/s` },
          details: [
            { label: "Delta-V (km/s)", value: formatNumber(dv / 1000, 4) },
            { label: "Mass Ratio", value: formatNumber(massRatio, 3) },
            { label: "Propellant Mass", value: `${formatNumber(propMass)} kg` },
            { label: "Specific Impulse", value: `${formatNumber(isp, 1)} s` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["rocket-thrust-calculator", "satellite-velocity-calculator", "space-travel-time-calculator"],
  faq: [
    { question: "What is delta-v?", answer: "Delta-v is the total change in velocity a rocket can achieve. It determines what orbital maneuvers are possible." },
    { question: "What is the Tsiolkovsky equation?", answer: "dv = Ve * ln(m0/mf). It relates delta-v to exhaust velocity and mass ratio." },
  ],
  formula: "dv = Ve * ln(m0 / mf)",
};
