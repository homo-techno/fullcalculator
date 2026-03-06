import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const powerFactorCorrectionCalculator: CalculatorDefinition = {
  slug: "power-factor-correction-calculator",
  title: "Power Factor Correction Calculator",
  description: "Calculate the capacitor bank size needed to correct power factor from current to target values, reducing utility penalties and improving electrical system efficiency.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["power factor correction","capacitor bank sizing","kVAR calculator","PF correction"],
  variants: [{
    id: "standard",
    name: "Power Factor Correction",
    description: "Calculate the capacitor bank size needed to correct power factor from current to target values, reducing utility penalties and improving electrical system efficiency.",
    fields: [
      { name: "realPower", label: "Real Power (kW)", type: "number", min: 10, max: 10000, defaultValue: 200 },
      { name: "currentPF", label: "Current Power Factor", type: "number", min: 0.5, max: 0.99, defaultValue: 0.75 },
      { name: "targetPF", label: "Target Power Factor", type: "number", min: 0.85, max: 1, defaultValue: 0.95 },
      { name: "voltage", label: "System Voltage", type: "select", options: [{ value: "208", label: "208V" }, { value: "240", label: "240V" }, { value: "480", label: "480V" }], defaultValue: "480" },
    ],
    calculate: (inputs) => {
    const kw = inputs.realPower as number;
    const currentPF = inputs.currentPF as number;
    const targetPF = inputs.targetPF as number;
    const voltage = parseFloat(inputs.voltage as string);
    const currentAngle = Math.acos(currentPF);
    const targetAngle = Math.acos(targetPF);
    const currentKVAR = kw * Math.tan(currentAngle);
    const targetKVAR = kw * Math.tan(targetAngle);
    const requiredKVAR = currentKVAR - targetKVAR;
    const currentKVA = kw / currentPF;
    const targetKVA = kw / targetPF;
    const kvaReduction = currentKVA - targetKVA;
    const currentSavings = kvaReduction * 1000 / (voltage * 1.732);
    const annualSavings = requiredKVAR * 3.5 * 12;
    return {
      primary: { label: "Required Capacitor Bank", value: formatNumber(Math.round(requiredKVAR * 10) / 10) + " kVAR" },
      details: [
        { label: "Current kVA Demand", value: formatNumber(Math.round(currentKVA * 10) / 10) + " kVA" },
        { label: "New kVA Demand", value: formatNumber(Math.round(targetKVA * 10) / 10) + " kVA" },
        { label: "Current Reduction", value: formatNumber(Math.round(currentSavings * 10) / 10) + " A" },
        { label: "Est. Annual Savings", value: "$" + formatNumber(Math.round(annualSavings)) }
      ]
    };
  },
  }],
  relatedSlugs: ["transformer-sizing-calculator","harmonic-distortion-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Current kVAR = kW x tan(arccos(Current PF))
Target kVAR = kW x tan(arccos(Target PF))
Required Capacitor = Current kVAR - Target kVAR
kVA Reduction = (kW / Current PF) - (kW / Target PF)",
};
