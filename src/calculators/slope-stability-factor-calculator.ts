import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const slopeStabilityFactorCalculator: CalculatorDefinition = {
  slug: "slope-stability-factor-calculator",
  title: "Slope Stability Factor Calculator",
  description: "Calculate the factor of safety for slope stability using the infinite slope method considering soil properties, slope angle, and water table.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["slope stability","factor of safety","landslide risk","slope angle","geotechnical analysis"],
  variants: [{
    id: "standard",
    name: "Slope Stability Factor",
    description: "Calculate the factor of safety for slope stability using the infinite slope method considering soil properties, slope angle, and water table.",
    fields: [
      { name: "slopeAngle", label: "Slope Angle (degrees)", type: "number", min: 1, max: 80, defaultValue: 30 },
      { name: "cohesion", label: "Soil Cohesion (kPa)", type: "number", min: 0, max: 200, defaultValue: 10 },
      { name: "frictionAngle", label: "Internal Friction Angle (degrees)", type: "number", min: 0, max: 45, defaultValue: 25 },
      { name: "soilDepth", label: "Soil Depth to Failure Plane (m)", type: "number", min: 0.5, max: 30, defaultValue: 3 },
      { name: "unitWeight", label: "Soil Unit Weight (kN/m3)", type: "number", min: 10, max: 25, defaultValue: 19 },
      { name: "waterTable", label: "Water Table Condition", type: "select", options: [{ value: "0", label: "Dry Slope" }, { value: "0.5", label: "Water at Half Depth" }, { value: "1", label: "Fully Saturated" }], defaultValue: "0" },
    ],
    calculate: (inputs) => {
    const beta = inputs.slopeAngle as number * Math.PI / 180;
    const c = inputs.cohesion as number;
    const phi = inputs.frictionAngle as number * Math.PI / 180;
    const H = inputs.soilDepth as number;
    const gamma = inputs.unitWeight as number;
    const waterRatio = parseFloat(inputs.waterTable as unknown as string);
    const gammaW = 9.81;
    const u = gammaW * H * waterRatio * Math.cos(beta) * Math.cos(beta);
    const normalStress = gamma * H * Math.cos(beta) * Math.cos(beta);
    const shearStress = gamma * H * Math.sin(beta) * Math.cos(beta);
    const shearStrength = c + (normalStress - u) * Math.tan(phi);
    const FOS = shearStress > 0 ? shearStrength / shearStress : 999;
    const status = FOS >= 1.5 ? "Stable" : FOS >= 1.0 ? "Marginally Stable" : "Unstable";
    return {
      primary: { label: "Factor of Safety", value: formatNumber(parseFloat(FOS.toFixed(3))) },
      details: [
        { label: "Stability Status", value: status },
        { label: "Shear Strength", value: formatNumber(parseFloat(shearStrength.toFixed(2))) + " kPa" },
        { label: "Shear Stress", value: formatNumber(parseFloat(shearStress.toFixed(2))) + " kPa" },
        { label: "Normal Stress", value: formatNumber(parseFloat(normalStress.toFixed(2))) + " kPa" },
        { label: "Pore Water Pressure", value: formatNumber(parseFloat(u.toFixed(2))) + " kPa" }
      ]
    };
  },
  }],
  relatedSlugs: ["bearing-capacity-calculator","soil-compaction-test-calculator","excavation-volume-calculator"],
  faq: [
    { question: "What factor of safety is considered stable?", answer: "A factor of safety of 1.5 or greater is generally considered stable for permanent slopes. Temporary construction slopes may use 1.25. Values below 1.0 indicate the slope will fail." },
    { question: "How does water affect slope stability?", answer: "Water is the most common trigger for landslides. It increases pore water pressure, reduces the effective normal stress, and thus reduces the shear strength along the failure plane, dramatically lowering the factor of safety." },
    { question: "What is the infinite slope method?", answer: "The infinite slope method analyzes a long, uniform slope by examining a thin slice of soil parallel to the surface. It works well for shallow, planar failures and is the simplest slope stability analysis method." },
  ],
  formula: "FOS = Shear Strength / Shear Stress
Shear Strength = c + (Normal Stress - Pore Pressure) x tan(phi)
Normal Stress = gamma x H x cos^2(beta)
Shear Stress = gamma x H x sin(beta) x cos(beta)",
};
