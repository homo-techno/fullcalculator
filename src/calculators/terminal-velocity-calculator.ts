import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const terminalVelocityCalculator: CalculatorDefinition = {
  slug: "terminal-velocity-calculator",
  title: "Terminal Velocity Calculator",
  description: "Calculate the terminal velocity of a falling object based on mass, drag, and area.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["terminal velocity", "falling speed calculator", "drag force calculator"],
  variants: [{
    id: "standard",
    name: "Terminal Velocity",
    description: "Calculate the terminal velocity of a falling object based on mass, drag, and area",
    fields: [
      { name: "mass", label: "Object Mass", type: "number", suffix: "kg", min: 0.001, max: 10000, defaultValue: 80 },
      { name: "area", label: "Cross-sectional Area", type: "number", suffix: "sq m", min: 0.001, max: 100, defaultValue: 0.7 },
      { name: "dragCoeff", label: "Drag Coefficient", type: "number", suffix: "", min: 0.01, max: 3, defaultValue: 1.0 },
      { name: "airDensity", label: "Air Density", type: "number", suffix: "kg/m3", min: 0.1, max: 2, defaultValue: 1.225 },
    ],
    calculate: (inputs) => {
      const m = inputs.mass as number;
      const A = inputs.area as number;
      const Cd = inputs.dragCoeff as number;
      const rho = inputs.airDensity as number;
      if (!m || !A || !Cd || !rho) return null;
      const g = 9.80665;
      const vt = Math.sqrt((2 * m * g) / (rho * Cd * A));
      const vtKmh = vt * 3.6;
      const vtMph = vt * 2.237;
      return {
        primary: { label: "Terminal Velocity", value: formatNumber(Math.round(vt * 100) / 100) + " m/s" },
        details: [
          { label: "In km/h", value: formatNumber(Math.round(vtKmh * 10) / 10) + " km/h" },
          { label: "In mph", value: formatNumber(Math.round(vtMph * 10) / 10) + " mph" },
          { label: "Drag Force at Terminal V", value: formatNumber(Math.round(m * g * 100) / 100) + " N (equals weight)" },
        ],
      };
    },
  }],
  relatedSlugs: ["escape-velocity-calculator", "altitude-pressure-calculator"],
  faq: [
    { question: "What is terminal velocity?", answer: "Terminal velocity is the maximum speed a falling object reaches when the drag force equals gravitational force, resulting in zero net acceleration." },
    { question: "What is the terminal velocity of a skydiver?", answer: "A typical skydiver in a belly-down position reaches about 55 m/s (120 mph). In a head-down position this increases to about 90 m/s (200 mph)." },
  ],
  formula: "Terminal Velocity = sqrt(2mg / (rho x Cd x A))",
};
