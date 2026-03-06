import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ductSizingCalculator: CalculatorDefinition = {
  slug: "duct-sizing-calculator",
  title: "Duct Sizing Calculator",
  description: "Calculate the correct HVAC duct dimensions based on airflow requirements, friction rate, and duct shape for efficient air distribution in heating and cooling systems.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["duct sizing","HVAC duct calculator","air duct size","ductwork sizing calculator"],
  variants: [{
    id: "standard",
    name: "Duct Sizing",
    description: "Calculate the correct HVAC duct dimensions based on airflow requirements, friction rate, and duct shape for efficient air distribution in heating and cooling systems.",
    fields: [
      { name: "cfm", label: "Required Airflow (CFM)", type: "number", min: 50, max: 5000, defaultValue: 400 },
      { name: "frictionRate", label: "Friction Rate (in. w.g. per 100 ft)", type: "select", options: [{ value: "0.06", label: "0.06 (quiet, residential)" }, { value: "0.08", label: "0.08 (standard residential)" }, { value: "0.10", label: "0.10 (commercial)" }], defaultValue: "0.08" },
      { name: "ductShape", label: "Duct Shape", type: "select", options: [{ value: "1", label: "Round" }, { value: "2", label: "Rectangular" }], defaultValue: "1" },
      { name: "maxVelocity", label: "Max Air Velocity (fpm)", type: "number", min: 300, max: 2000, defaultValue: 700 },
    ],
    calculate: (inputs) => {
    const cfm = inputs.cfm as number;
    const friction = parseFloat(inputs.frictionRate as string);
    const shape = parseInt(inputs.ductShape as string);
    const maxVel = inputs.maxVelocity as number;
    const areaSqIn = (cfm / maxVel) * 144;
    const roundDia = Math.sqrt(areaSqIn / Math.PI) * 2;
    const roundDiaStd = Math.ceil(roundDia);
    const actualArea = Math.PI * Math.pow(roundDiaStd / 2, 2);
    const actualVel = (cfm * 144) / actualArea;
    let rectW = 0;
    let rectH = 0;
    if (shape === 2) {
      rectW = Math.ceil(roundDiaStd * 1.2 / 2) * 2;
      rectH = Math.ceil(areaSqIn / rectW / 2) * 2;
      if (rectH < 4) rectH = 4;
    }
    const equivRound = shape === 2 ? Math.round(1.3 * Math.pow(rectW * rectH, 0.625) / Math.pow(rectW + rectH, 0.25)) : roundDiaStd;
    return {
      primary: { label: shape === 1 ? "Round Duct Diameter" : "Rectangular Duct Size", value: shape === 1 ? formatNumber(roundDiaStd) + " inches" : formatNumber(rectW) + " x " + formatNumber(rectH) + " inches" },
      details: [
        { label: "Required Cross-Section", value: formatNumber(Math.round(areaSqIn * 10) / 10) + " sq in" },
        { label: "Air Velocity", value: formatNumber(Math.round(actualVel)) + " fpm" },
        { label: "Equivalent Round Diameter", value: formatNumber(equivRound) + " inches" },
        { label: "Friction Rate", value: formatNumber(friction) + " in. w.g./100ft" }
      ]
    };
  },
  }],
  relatedSlugs: ["btu-heating-calculator","exhaust-fan-cfm-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Cross-Section Area = (CFM / Max Velocity) x 144; Round Diameter = sqrt(Area / Pi) x 2; Rectangular Equivalent = Based on equal friction method; Actual Velocity = (CFM x 144) / Actual Area",
};
