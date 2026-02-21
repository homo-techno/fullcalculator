import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const frictionCalculator: CalculatorDefinition = {
  slug: "friction-calculator",
  title: "Friction Calculator",
  description: "Free friction calculator. Calculate friction force, normal force, and coefficient of friction.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["friction calculator", "coefficient of friction", "friction force", "static friction", "kinetic friction"],
  variants: [
    {
      id: "findForce",
      name: "Find Friction Force",
      fields: [
        { name: "mu", label: "Coefficient of Friction (μ)", type: "number", placeholder: "e.g. 0.5" },
        { name: "N", label: "Normal Force (N)", type: "number", placeholder: "e.g. 100" },
      ],
      calculate: (inputs) => {
        const mu = inputs.mu as number, N = inputs.N as number;
        if (mu === undefined || !N) return null;
        const Ff = mu * N;
        return {
          primary: { label: "Friction Force", value: `${formatNumber(Ff, 4)} N` },
          details: [
            { label: "Coefficient (μ)", value: formatNumber(mu, 4) },
            { label: "Normal force", value: `${formatNumber(N, 4)} N` },
            { label: "Formula", value: `f = ${mu} × ${N} = ${formatNumber(Ff, 4)} N` },
          ],
        };
      },
    },
    {
      id: "findMu",
      name: "Find Coefficient (μ)",
      fields: [
        { name: "Ff", label: "Friction Force (N)", type: "number", placeholder: "e.g. 50" },
        { name: "N", label: "Normal Force (N)", type: "number", placeholder: "e.g. 100" },
      ],
      calculate: (inputs) => {
        const Ff = inputs.Ff as number, N = inputs.N as number;
        if (!Ff || !N) return null;
        const mu = Ff / N;
        let material = "";
        if (mu > 0.9) material = "Rubber on concrete (dry)";
        else if (mu > 0.5) material = "Wood on wood";
        else if (mu > 0.3) material = "Steel on steel";
        else if (mu > 0.1) material = "Lubricated surfaces";
        else material = "Ice / Teflon";
        return {
          primary: { label: "Coefficient (μ)", value: formatNumber(mu, 4) },
          details: [
            { label: "Similar to", value: material },
            { label: "Angle of repose", value: `${formatNumber(Math.atan(mu) * 180 / Math.PI, 2)}°` },
          ],
        };
      },
    },
    {
      id: "onSlope",
      name: "Object on Incline",
      fields: [
        { name: "mass", label: "Mass (kg)", type: "number", placeholder: "e.g. 10" },
        { name: "angle", label: "Incline Angle (degrees)", type: "number", placeholder: "e.g. 30" },
        { name: "mu", label: "Coefficient of Friction (μ)", type: "number", placeholder: "e.g. 0.3" },
      ],
      calculate: (inputs) => {
        const mass = inputs.mass as number, angle = inputs.angle as number, mu = inputs.mu as number;
        if (!mass || !angle || mu === undefined) return null;
        const g = 9.81;
        const rad = angle * Math.PI / 180;
        const N = mass * g * Math.cos(rad);
        const grav = mass * g * Math.sin(rad);
        const friction = mu * N;
        const net = grav - friction;
        const accel = net / mass;
        return {
          primary: { label: "Net Force", value: `${formatNumber(net, 4)} N ${net > 0 ? "(slides down)" : "(stays put)"}` },
          details: [
            { label: "Gravity component (parallel)", value: `${formatNumber(grav, 4)} N` },
            { label: "Friction force", value: `${formatNumber(friction, 4)} N` },
            { label: "Normal force", value: `${formatNumber(N, 4)} N` },
            { label: "Acceleration", value: net > 0 ? `${formatNumber(accel, 4)} m/s²` : "0 (stationary)" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["force-calculator", "acceleration-calculator", "momentum-calculator"],
  faq: [{ question: "What is friction?", answer: "Friction force = μ × Normal Force, where μ is the coefficient of friction. Static friction (before motion) is usually higher than kinetic friction (during motion). Common μ values: rubber on concrete ~1.0, wood on wood ~0.4, steel on steel ~0.3, ice ~0.03." }],
  formula: "f = μN | Incline: f = μmg·cos(θ)",
};
