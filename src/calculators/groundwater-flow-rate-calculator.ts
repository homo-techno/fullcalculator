import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const groundwaterFlowRateCalculator: CalculatorDefinition = {
  slug: "groundwater-flow-rate-calculator",
  title: "Groundwater Flow Rate Calculator",
  description: "Calculate groundwater flow velocity and discharge rate using hydraulic conductivity, hydraulic gradient, and aquifer cross-sectional area.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["groundwater flow","Darcy law","hydraulic conductivity","aquifer flow rate","seepage velocity"],
  variants: [{
    id: "standard",
    name: "Groundwater Flow Rate",
    description: "Calculate groundwater flow velocity and discharge rate using hydraulic conductivity, hydraulic gradient, and aquifer cross-sectional area.",
    fields: [
      { name: "hydraulicConductivity", label: "Hydraulic Conductivity (m/day)", type: "number", min: 0.001, max: 1000, defaultValue: 10 },
      { name: "hydraulicGradient", label: "Hydraulic Gradient (m/m)", type: "number", min: 0.0001, max: 1, defaultValue: 0.01 },
      { name: "crossSectionArea", label: "Cross-Sectional Area (m2)", type: "number", min: 1, max: 100000, defaultValue: 100 },
      { name: "porosity", label: "Effective Porosity (%)", type: "number", min: 1, max: 60, defaultValue: 25 },
    ],
    calculate: (inputs) => {
    const K = inputs.hydraulicConductivity as number;
    const i = inputs.hydraulicGradient as number;
    const A = inputs.crossSectionArea as number;
    const n = inputs.porosity as number / 100;
    const darcyVelocity = K * i;
    const seepageVelocity = darcyVelocity / n;
    const discharge = K * i * A;
    const dailyVolume = discharge;
    const yearlyVolume = discharge * 365;
    const travelTime100m = n > 0 ? 100 / seepageVelocity : 0;
    return {
      primary: { label: "Darcy Velocity", value: formatNumber(parseFloat(darcyVelocity.toFixed(4))) + " m/day" },
      details: [
        { label: "Seepage Velocity", value: formatNumber(parseFloat(seepageVelocity.toFixed(4))) + " m/day" },
        { label: "Discharge (Q)", value: formatNumber(parseFloat(discharge.toFixed(2))) + " m3/day" },
        { label: "Annual Volume", value: formatNumber(Math.round(yearlyVolume)) + " m3/year" },
        { label: "Travel Time (100m)", value: formatNumber(parseFloat(travelTime100m.toFixed(1))) + " days" },
        { label: "Effective Porosity", value: formatNumber(n * 100) + "%" }
      ]
    };
  },
  }],
  relatedSlugs: ["well-drilling-cost-calculator","aquifer-yield-calculator","river-discharge-rate-calculator"],
  faq: [
    { question: "What is Darcy velocity vs seepage velocity?", answer: "Darcy velocity is the apparent flow rate through the entire cross-section. Seepage velocity is the actual speed water moves through pore spaces, which is always faster since water only flows through the pores, not the solid rock." },
    { question: "What is hydraulic conductivity?", answer: "Hydraulic conductivity measures how easily water flows through soil or rock. Sand and gravel have high values (1-1000 m/day), while clay has very low values (less than 0.001 m/day)." },
    { question: "How fast does groundwater move?", answer: "Groundwater typically moves very slowly, from centimeters per day to a few meters per day. In highly permeable gravel aquifers, it can move faster, but it is generally much slower than surface water." },
  ],
  formula: "Darcy Velocity (v) = K x i
Seepage Velocity = v / n (effective porosity)
Discharge (Q) = K x i x A
Travel Time = Distance / Seepage Velocity",
};
