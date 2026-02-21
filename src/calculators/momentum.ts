import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const momentumCalculator: CalculatorDefinition = {
  slug: "momentum-calculator",
  title: "Momentum Calculator",
  description: "Free momentum calculator. Calculate linear momentum (p = mv) and impulse for physics problems.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["momentum calculator", "p=mv calculator", "impulse calculator", "linear momentum", "physics momentum"],
  variants: [
    {
      id: "momentum",
      name: "Linear Momentum",
      fields: [
        { name: "mass", label: "Mass (kg)", type: "number", placeholder: "e.g. 5" },
        { name: "velocity", label: "Velocity (m/s)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const m = inputs.mass as number;
        const v = inputs.velocity as number;
        if (!m || v === undefined) return null;
        const p = m * v;
        const ke = 0.5 * m * v * v;
        return {
          primary: { label: "Momentum (p)", value: `${formatNumber(p, 4)} kg⋅m/s` },
          details: [
            { label: "Mass", value: `${formatNumber(m)} kg` },
            { label: "Velocity", value: `${formatNumber(v)} m/s` },
            { label: "Kinetic energy", value: `${formatNumber(ke, 4)} J` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["force-calculator", "energy-calculator", "acceleration-calculator"],
  faq: [
    { question: "What is momentum?", answer: "Momentum (p) = mass × velocity. It measures how much 'motion' an object has. A 10 kg object at 5 m/s has p = 50 kg⋅m/s. Momentum is conserved in collisions." },
  ],
  formula: "p = m × v | Impulse = F × Δt = Δp",
};
