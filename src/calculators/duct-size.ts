import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ductSizeCalculator: CalculatorDefinition = {
  slug: "duct-size-calculator",
  title: "Duct Size Calculator",
  description: "Free duct size calculator. Convert CFM airflow to round or rectangular duct dimensions for HVAC systems.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["duct size calculator", "CFM to duct diameter", "HVAC duct sizing", "round duct calculator", "rectangular duct calculator", "duct velocity"],
  variants: [
    {
      id: "round-duct",
      name: "Round Duct from CFM",
      description: "Calculate round duct diameter from CFM and target velocity",
      fields: [
        { name: "cfm", label: "Airflow (CFM)", type: "number", placeholder: "e.g. 400" },
        { name: "velocity", label: "Target Velocity (FPM)", type: "number", placeholder: "e.g. 900", defaultValue: 900 },
        { name: "frictionMethod", label: "Friction Rate", type: "select", options: [
          { label: "Low (0.06 in. w.g./100ft)", value: "0.06" },
          { label: "Medium (0.08 in. w.g./100ft)", value: "0.08" },
          { label: "High (0.10 in. w.g./100ft)", value: "0.10" },
        ], defaultValue: "0.08" },
      ],
      calculate: (inputs) => {
        const cfm = inputs.cfm as number;
        const velocity = inputs.velocity as number;
        if (!cfm || !velocity) return null;
        const areaFt2 = cfm / velocity;
        const areaIn2 = areaFt2 * 144;
        const diameterIn = Math.sqrt((4 * areaIn2) / Math.PI);
        const roundedDiam = Math.ceil(diameterIn);
        const actualArea = Math.PI * Math.pow(roundedDiam / 2, 2);
        const actualVelocity = cfm / (actualArea / 144);
        return {
          primary: { label: "Recommended Duct Diameter", value: `${formatNumber(roundedDiam, 0)} inches` },
          details: [
            { label: "Exact Diameter", value: `${formatNumber(diameterIn, 2)} in` },
            { label: "Duct Area (rounded)", value: `${formatNumber(actualArea, 2)} sq in` },
            { label: "Actual Velocity", value: `${formatNumber(actualVelocity, 0)} FPM` },
            { label: "Airflow", value: `${formatNumber(cfm, 0)} CFM` },
          ],
        };
      },
    },
    {
      id: "rectangular-duct",
      name: "Rectangular Duct from CFM",
      description: "Calculate rectangular duct dimensions from CFM",
      fields: [
        { name: "cfm", label: "Airflow (CFM)", type: "number", placeholder: "e.g. 600" },
        { name: "velocity", label: "Target Velocity (FPM)", type: "number", placeholder: "e.g. 900", defaultValue: 900 },
        { name: "side", label: "One Side Dimension (inches)", type: "number", placeholder: "e.g. 12" },
      ],
      calculate: (inputs) => {
        const cfm = inputs.cfm as number;
        const velocity = inputs.velocity as number;
        const side = inputs.side as number;
        if (!cfm || !velocity || !side) return null;
        const areaFt2 = cfm / velocity;
        const areaIn2 = areaFt2 * 144;
        const otherSide = areaIn2 / side;
        const roundedOther = Math.ceil(otherSide / 2) * 2;
        const actualArea = side * roundedOther;
        const actualVelocity = cfm / (actualArea / 144);
        const eqDiam = 1.3 * Math.pow(side * roundedOther, 0.625) / Math.pow(side + roundedOther, 0.25);
        return {
          primary: { label: "Rectangular Duct Size", value: `${formatNumber(side, 0)} x ${formatNumber(roundedOther, 0)} inches` },
          details: [
            { label: "Exact Other Side", value: `${formatNumber(otherSide, 2)} in` },
            { label: "Actual Area", value: `${formatNumber(actualArea, 1)} sq in` },
            { label: "Actual Velocity", value: `${formatNumber(actualVelocity, 0)} FPM` },
            { label: "Equivalent Round Diameter", value: `${formatNumber(eqDiam, 1)} in` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["airflow-cfm-calculator", "static-pressure-calculator", "air-handler-size-calculator"],
  faq: [
    { question: "How do I determine the right duct size?", answer: "Duct size depends on required airflow (CFM) and maximum acceptable velocity. Residential ducts typically use 600-900 FPM for main trunks and 400-600 FPM for branches to keep noise acceptable." },
    { question: "What velocity should I use for duct sizing?", answer: "For residential systems, use 600-900 FPM for trunk lines and 400-600 FPM for branch runs. Commercial systems may use 1000-2000 FPM depending on noise requirements." },
    { question: "Is round or rectangular duct better?", answer: "Round duct has less friction loss per CFM and uses less material. Rectangular duct is useful where ceiling height is limited." },
  ],
  formula: "D = sqrt(4 x CFM x 144 / (pi x Velocity)) | Area = CFM / Velocity",
};
