import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const projectileRangeCalculator: CalculatorDefinition = {
  slug: "projectile-range-calculator",
  title: "Projectile Range Calculator",
  description: "Calculate the horizontal distance of a projectile.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["projectile range","projectile motion calculator"],
  variants: [{
    id: "standard",
    name: "Projectile Range",
    description: "Calculate the horizontal distance of a projectile.",
    fields: [
      { name: "velocity", label: "Launch Velocity (m/s)", type: "number", min: 0.1, max: 10000, defaultValue: 20 },
      { name: "angle", label: "Launch Angle (degrees)", type: "number", min: 1, max: 89, defaultValue: 45 },
      { name: "height", label: "Launch Height (m)", type: "number", min: 0, max: 10000, defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const v = inputs.velocity as number;
      const deg = inputs.angle as number;
      const h = inputs.height as number;
      if (!v || !deg) return null;
      const g = 9.81;
      const rad = deg * Math.PI / 180;
      const vx = v * Math.cos(rad);
      const vy = v * Math.sin(rad);
      const tUp = vy / g;
      const maxH = h + vy * tUp - 0.5 * g * tUp * tUp;
      const tTotal = (vy + Math.sqrt(vy * vy + 2 * g * h)) / g;
      const range = Math.round(vx * tTotal * 100) / 100;
      return {
        primary: { label: "Range", value: formatNumber(range) + " m" },
        details: [
          { label: "Max Height", value: formatNumber(Math.round(maxH * 100) / 100) + " m" },
          { label: "Time of Flight", value: formatNumber(Math.round(tTotal * 100) / 100) + " s" },
          { label: "Launch Angle", value: formatNumber(deg) + " deg" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What angle gives maximum range?", answer: "45 degrees gives the maximum range on level ground with no air resistance." },
    { question: "Does launch height affect range?", answer: "Yes. A higher launch point increases the total range." },
  ],
  formula: "Range = vx x (vy + sqrt(vy^2 + 2gh)) / g",
};
