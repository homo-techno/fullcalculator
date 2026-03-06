import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const emergencyGeneratorSizingCalculator: CalculatorDefinition = {
  slug: "emergency-generator-sizing-calculator",
  title: "Emergency Generator Sizing Calculator",
  description: "Calculate the required emergency generator size in kW or kVA for backup power based on critical loads, motor starting requirements, and step loading sequence.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["generator sizing","backup generator calculator","standby generator size","emergency power calculator"],
  variants: [{
    id: "standard",
    name: "Emergency Generator Sizing",
    description: "Calculate the required emergency generator size in kW or kVA for backup power based on critical loads, motor starting requirements, and step loading sequence.",
    fields: [
      { name: "lightingLoad", label: "Lighting Load (kW)", type: "number", min: 0, max: 500, defaultValue: 15 },
      { name: "hvacLoad", label: "HVAC Load (kW)", type: "number", min: 0, max: 500, defaultValue: 20 },
      { name: "largestMotorHP", label: "Largest Motor (HP)", type: "number", min: 0, max: 200, defaultValue: 10 },
      { name: "criticalLoad", label: "Other Critical Loads (kW)", type: "number", min: 0, max: 500, defaultValue: 10 },
      { name: "powerFactor", label: "Power Factor", type: "number", min: 0.7, max: 1, defaultValue: 0.8 },
    ],
    calculate: (inputs) => {
    const lighting = inputs.lightingLoad as number;
    const hvac = inputs.hvacLoad as number;
    const motorHP = inputs.largestMotorHP as number;
    const critical = inputs.criticalLoad as number;
    const pf = inputs.powerFactor as number;
    const totalRunKW = lighting + hvac + critical;
    const motorKW = motorHP * 0.746;
    const motorStartKW = motorKW * 3;
    const peakKW = totalRunKW + motorStartKW;
    const runningKW = totalRunKW + motorKW;
    const requiredKVA = peakKW / pf;
    const stdSizes = [20, 30, 45, 60, 80, 100, 125, 150, 200, 250, 300, 350, 400, 500, 600, 750, 1000];
    let genSize = 20;
    for (let i = 0; i < stdSizes.length; i++) {
      if (stdSizes[i] >= requiredKVA) { genSize = stdSizes[i]; break; }
      if (i === stdSizes.length - 1) genSize = stdSizes[i];
    }
    const loading = (runningKW / (genSize * pf)) * 100;
    const fuelGPH = genSize * 0.07;
    return {
      primary: { label: "Recommended Generator", value: formatNumber(genSize) + " kVA" },
      details: [
        { label: "Running Load", value: formatNumber(Math.round(runningKW * 10) / 10) + " kW" },
        { label: "Peak Load (motor start)", value: formatNumber(Math.round(peakKW * 10) / 10) + " kW" },
        { label: "Running Load Factor", value: formatNumber(Math.round(loading)) + "%" },
        { label: "Est. Fuel Consumption", value: formatNumber(Math.round(fuelGPH * 10) / 10) + " gal/hr" }
      ]
    };
  },
  }],
  relatedSlugs: ["transformer-sizing-calculator","electrical-panel-load-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Total Running kW = Lighting + HVAC + Critical Loads + Motor kW
Motor Start kW = Motor HP x 0.746 x 3
Peak kW = Running Loads + Motor Start kW
Required kVA = Peak kW / Power Factor",
};
