import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bearingCapacityCalculator: CalculatorDefinition = {
  slug: "bearing-capacity-calculator",
  title: "Bearing Capacity Calculator",
  description: "Calculate the ultimate and allowable bearing capacity of soil using Terzaghi bearing capacity equation for foundation design.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["bearing capacity","foundation design","Terzaghi equation","soil bearing strength","footing design"],
  variants: [{
    id: "standard",
    name: "Bearing Capacity",
    description: "Calculate the ultimate and allowable bearing capacity of soil using Terzaghi bearing capacity equation for foundation design.",
    fields: [
      { name: "cohesion", label: "Soil Cohesion (kPa)", type: "number", min: 0, max: 500, defaultValue: 20 },
      { name: "frictionAngle", label: "Friction Angle (degrees)", type: "number", min: 0, max: 45, defaultValue: 30 },
      { name: "foundationWidth", label: "Foundation Width (m)", type: "number", min: 0.3, max: 20, defaultValue: 2 },
      { name: "foundationDepth", label: "Foundation Depth (m)", type: "number", min: 0.3, max: 10, defaultValue: 1.5 },
      { name: "soilUnitWeight", label: "Soil Unit Weight (kN/m3)", type: "number", min: 10, max: 25, defaultValue: 18 },
      { name: "factorOfSafety", label: "Factor of Safety", type: "number", min: 1, max: 5, defaultValue: 3 },
    ],
    calculate: (inputs) => {
    const c = inputs.cohesion as number;
    const phi = inputs.frictionAngle as number;
    const B = inputs.foundationWidth as number;
    const D = inputs.foundationDepth as number;
    const gamma = inputs.soilUnitWeight as number;
    const FOS = inputs.factorOfSafety as number;
    const phiRad = phi * Math.PI / 180;
    const Nq = Math.exp(Math.PI * Math.tan(phiRad)) * Math.pow(Math.tan(Math.PI / 4 + phiRad / 2), 2);
    const Nc = (Nq - 1) / Math.tan(phiRad || 0.001);
    const Ngamma = 2 * (Nq + 1) * Math.tan(phiRad);
    const q = gamma * D;
    const qu = c * Nc + q * Nq + 0.5 * gamma * B * Ngamma;
    const qa = qu / FOS;
    return {
      primary: { label: "Allowable Bearing Capacity", value: formatNumber(Math.round(qa)) + " kPa" },
      details: [
        { label: "Ultimate Bearing Capacity", value: formatNumber(Math.round(qu)) + " kPa" },
        { label: "Nc Factor", value: formatNumber(parseFloat(Nc.toFixed(2))) },
        { label: "Nq Factor", value: formatNumber(parseFloat(Nq.toFixed(2))) },
        { label: "Ngamma Factor", value: formatNumber(parseFloat(Ngamma.toFixed(2))) },
        { label: "Overburden Pressure (q)", value: formatNumber(parseFloat(q.toFixed(1))) + " kPa" }
      ]
    };
  },
  }],
  relatedSlugs: ["soil-compaction-test-calculator","slope-stability-factor-calculator","excavation-volume-calculator"],
  faq: [
    { question: "What is bearing capacity?", answer: "Bearing capacity is the maximum pressure a soil can support from a foundation without failing through shear or excessive settlement. It determines the size and type of foundation needed for a structure." },
    { question: "What factor of safety is used for foundations?", answer: "A factor of safety of 3 is standard for most building foundations. Critical structures may use higher values. The allowable bearing capacity is the ultimate capacity divided by the factor of safety." },
    { question: "What affects soil bearing capacity?", answer: "Key factors include soil type, cohesion, internal friction angle, depth of foundation, groundwater level, and foundation width and shape. Clay soils rely on cohesion while sandy soils rely on friction." },
  ],
  formula: "qu = c x Nc + q x Nq + 0.5 x gamma x B x Ngamma; qa = qu / Factor of Safety; Nq = e^(pi x tan(phi)) x tan^2(45 + phi/2); Nc = (Nq - 1) / tan(phi); Ngamma = 2(Nq + 1) x tan(phi)",
};
