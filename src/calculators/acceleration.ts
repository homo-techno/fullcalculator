import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const accelerationCalculator: CalculatorDefinition = {
  slug: "acceleration-calculator",
  title: "Acceleration Calculator",
  description: "Free acceleration calculator. Calculate acceleration from velocity change and time, or from force and mass.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["acceleration calculator", "velocity change calculator", "deceleration calculator", "physics acceleration", "a=v/t calculator"],
  variants: [
    {
      id: "velocity",
      name: "From Velocity Change",
      description: "a = (v₂ - v₁) / t",
      fields: [
        { name: "v1", label: "Initial Velocity (m/s)", type: "number", placeholder: "e.g. 0" },
        { name: "v2", label: "Final Velocity (m/s)", type: "number", placeholder: "e.g. 30" },
        { name: "time", label: "Time (seconds)", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const v1 = inputs.v1 as number;
        const v2 = inputs.v2 as number;
        const t = inputs.time as number;
        if (v1 === undefined || v2 === undefined || !t) return null;
        const a = (v2 - v1) / t;
        const distance = v1 * t + 0.5 * a * t * t;
        const gForce = a / 9.81;
        return {
          primary: { label: "Acceleration", value: `${formatNumber(a, 4)} m/s²` },
          details: [
            { label: "In g-force", value: `${formatNumber(gForce, 3)} g` },
            { label: "Distance covered", value: `${formatNumber(distance, 2)} m` },
            { label: "Velocity change", value: `${formatNumber(v2 - v1)} m/s` },
            { label: "Type", value: a >= 0 ? "Acceleration" : "Deceleration" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["force-calculator", "speed-distance-time-calculator", "momentum-calculator"],
  faq: [
    { question: "What is acceleration?", answer: "Acceleration is the rate of change of velocity over time: a = Δv/Δt. Measured in m/s². Earth's gravity = 9.81 m/s². A car going 0-60 mph in 5 seconds accelerates at ~5.4 m/s² (0.55g)." },
  ],
  formula: "a = (v₂ - v₁) / t | s = v₁t + ½at² | v₂² = v₁² + 2as",
};
