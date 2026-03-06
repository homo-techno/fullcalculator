import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const aquiferYieldCalculator: CalculatorDefinition = {
  slug: "aquifer-yield-calculator",
  title: "Aquifer Yield Calculator",
  description: "Calculate the sustainable yield of an aquifer using transmissivity, storativity, and pumping test data for water supply planning.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["aquifer yield","well yield","transmissivity","sustainable pumping rate","groundwater supply"],
  variants: [{
    id: "standard",
    name: "Aquifer Yield",
    description: "Calculate the sustainable yield of an aquifer using transmissivity, storativity, and pumping test data for water supply planning.",
    fields: [
      { name: "transmissivity", label: "Transmissivity (m2/day)", type: "number", min: 1, max: 10000, defaultValue: 500 },
      { name: "storativity", label: "Storativity", type: "number", min: 0.0001, max: 0.5, defaultValue: 0.001 },
      { name: "aquiferThickness", label: "Aquifer Thickness (m)", type: "number", min: 1, max: 500, defaultValue: 30 },
      { name: "maxDrawdown", label: "Maximum Allowable Drawdown (m)", type: "number", min: 1, max: 200, defaultValue: 15 },
      { name: "wellRadius", label: "Well Radius (m)", type: "number", min: 0.05, max: 1, defaultValue: 0.15 },
      { name: "pumpingDays", label: "Pumping Duration (days)", type: "number", min: 1, max: 365, defaultValue: 180 },
    ],
    calculate: (inputs) => {
    const T = inputs.transmissivity as number;
    const S = inputs.storativity as number;
    const b = inputs.aquiferThickness as number;
    const sw = inputs.maxDrawdown as number;
    const rw = inputs.wellRadius as number;
    const t = inputs.pumpingDays as number;
    const u = (rw * rw * S) / (4 * T * t);
    const W = -0.5772 - Math.log(u);
    const Q = (4 * Math.PI * T * sw) / W;
    const Qm3day = Q;
    const Qlpm = Q / 1.44;
    const Qgpm = Qlpm * 0.264172;
    const K = T / b;
    const specificCapacity = Q / sw;
    const totalVolume = Q * t;
    return {
      primary: { label: "Sustainable Yield", value: formatNumber(Math.round(Qm3day)) + " m3/day" },
      details: [
        { label: "Pumping Rate", value: formatNumber(parseFloat(Qlpm.toFixed(1))) + " L/min" },
        { label: "Pumping Rate (US)", value: formatNumber(parseFloat(Qgpm.toFixed(1))) + " gal/min" },
        { label: "Specific Capacity", value: formatNumber(parseFloat(specificCapacity.toFixed(2))) + " m3/day/m" },
        { label: "Hydraulic Conductivity", value: formatNumber(parseFloat(K.toFixed(2))) + " m/day" },
        { label: "Total Volume (" + t + " days)", value: formatNumber(Math.round(totalVolume)) + " m3" }
      ]
    };
  },
  }],
  relatedSlugs: ["groundwater-flow-rate-calculator","well-drilling-cost-calculator","river-discharge-rate-calculator"],
  faq: [
    { question: "What is transmissivity?", answer: "Transmissivity is the rate at which water flows through a unit width of aquifer for a unit hydraulic gradient. It equals hydraulic conductivity times aquifer thickness and is measured in m2/day. Higher values mean more productive aquifers." },
    { question: "What is storativity?", answer: "Storativity (storage coefficient) is the volume of water released per unit area per unit decline in head. Confined aquifers have very low storativity (0.0001-0.001), while unconfined aquifers have higher values (0.01-0.3)." },
    { question: "How do you determine sustainable yield?", answer: "Sustainable yield is determined through pumping tests, aquifer analysis, and long-term water balance studies. It must account for recharge rates, neighboring well interference, and environmental water needs." },
  ],
  formula: "Q = (4 x pi x T x Drawdown) / W(u) (Theis Equation)
u = r^2 x S / (4 x T x t)
W(u) = -0.5772 - ln(u) (approximation)
Specific Capacity = Q / Drawdown
Hydraulic Conductivity = T / Aquifer Thickness",
};
