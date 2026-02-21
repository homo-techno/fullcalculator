import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const forceCalculator: CalculatorDefinition = {
  slug: "force-calculator",
  title: "Force Calculator (F = ma)",
  description: "Free force calculator. Calculate force, mass, or acceleration using Newton's second law F = ma.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["force calculator", "f=ma calculator", "newton calculator", "mass acceleration calculator", "physics force calculator"],
  variants: [
    {
      id: "force",
      name: "Force / Mass / Acceleration",
      description: "Enter any two to calculate the third",
      fields: [
        { name: "force", label: "Force (N)", type: "number", placeholder: "e.g. 100" },
        { name: "mass", label: "Mass (kg)", type: "number", placeholder: "e.g. 10" },
        { name: "acceleration", label: "Acceleration (m/s²)", type: "number", placeholder: "e.g. 9.81" },
      ],
      calculate: (inputs) => {
        const f = inputs.force as number;
        const m = inputs.mass as number;
        const a = inputs.acceleration as number;
        const hasF = f !== undefined && f !== null && String(f) !== "";
        const hasM = m !== undefined && m !== null && String(m) !== "";
        const hasA = a !== undefined && a !== null && String(a) !== "";
        if ([hasF, hasM, hasA].filter(Boolean).length < 2) return null;
        let force = f, mass = m, accel = a;
        let solved = "";
        if (!hasF) { force = m * a; solved = "Force"; }
        else if (!hasM) { mass = f / a; solved = "Mass"; }
        else if (!hasA) { accel = f / m; solved = "Acceleration"; }
        else { solved = "All given"; }
        const weightOnEarth = mass * 9.81;
        return {
          primary: { label: solved !== "All given" ? solved : "Results", value: solved === "Force" ? `${formatNumber(force, 4)} N` : solved === "Mass" ? `${formatNumber(mass, 4)} kg` : solved === "Acceleration" ? `${formatNumber(accel, 4)} m/s²` : `F=${formatNumber(force)}N` },
          details: [
            { label: "Force", value: `${formatNumber(force, 4)} N` },
            { label: "Mass", value: `${formatNumber(mass, 4)} kg` },
            { label: "Acceleration", value: `${formatNumber(accel, 4)} m/s²` },
            { label: "Weight on Earth", value: `${formatNumber(weightOnEarth, 2)} N` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["acceleration-calculator", "energy-calculator", "scientific-calculator"],
  faq: [
    { question: "What is Newton's second law?", answer: "F = ma. Force (Newtons) = Mass (kg) × Acceleration (m/s²). One Newton is the force needed to accelerate 1 kg by 1 m/s²." },
  ],
  formula: "F = m × a | 1 N = 1 kg⋅m/s²",
};
