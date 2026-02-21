import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const projectileCalculator: CalculatorDefinition = {
  slug: "projectile-motion-calculator",
  title: "Projectile Motion Calculator",
  description: "Free projectile motion calculator. Calculate range, max height, and flight time of a projectile from velocity and angle.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["projectile motion calculator", "trajectory calculator", "launch angle", "range calculator", "ballistics calculator"],
  variants: [
    {
      id: "calculate",
      name: "From Velocity & Angle",
      fields: [
        { name: "v", label: "Initial Velocity (m/s)", type: "number", placeholder: "e.g. 50" },
        { name: "angle", label: "Launch Angle (degrees)", type: "number", placeholder: "e.g. 45" },
        { name: "h", label: "Initial Height (m)", type: "number", placeholder: "e.g. 0", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const v = inputs.v as number, angle = inputs.angle as number;
        const h0 = (inputs.h as number) || 0;
        if (!v || angle === undefined) return null;
        const g = 9.81;
        const rad = angle * Math.PI / 180;
        const vx = v * Math.cos(rad), vy = v * Math.sin(rad);
        const tUp = vy / g;
        const maxH = h0 + (vy * vy) / (2 * g);
        const tTotal = (vy + Math.sqrt(vy * vy + 2 * g * h0)) / g;
        const range = vx * tTotal;
        return {
          primary: { label: "Range", value: `${formatNumber(range, 4)} m` },
          details: [
            { label: "Max height", value: `${formatNumber(maxH, 4)} m` },
            { label: "Flight time", value: `${formatNumber(tTotal, 4)} s` },
            { label: "Time to peak", value: `${formatNumber(tUp, 4)} s` },
            { label: "Horizontal velocity", value: `${formatNumber(vx, 4)} m/s` },
            { label: "Vertical velocity", value: `${formatNumber(vy, 4)} m/s` },
            { label: "Impact speed", value: `${formatNumber(Math.sqrt(vx * vx + Math.pow(vy - g * tTotal, 2)), 4)} m/s` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["force-calculator", "acceleration-calculator", "speed-calculator"],
  faq: [{ question: "What angle gives maximum range?", answer: "On flat ground, 45° gives the maximum range. Range = v²sin(2θ)/g. Max height = v²sin²(θ)/(2g). Flight time = 2v·sin(θ)/g. These assume no air resistance and g = 9.81 m/s²." }],
  formula: "R = v²sin(2θ)/g | H = v²sin²(θ)/(2g) | T = 2v·sin(θ)/g",
};
