import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const microphoneSensitivityCalculator: CalculatorDefinition = {
  slug: "microphone-sensitivity-calculator",
  title: "Microphone Sensitivity Calculator",
  description: "Convert microphone sensitivity between dBV and mV/Pa and calculate output levels.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["microphone","sensitivity","dBV","preamp","gain","audio"],
  variants: [{
    id: "standard",
    name: "Microphone Sensitivity",
    description: "Convert microphone sensitivity between dBV and mV/Pa and calculate output levels.",
    fields: [
      { name: "sensitivityDBV", label: "Sensitivity (dBV/Pa)", type: "number", min: -70, max: -10, defaultValue: -40 },
      { name: "spl", label: "Sound Pressure Level (dB SPL)", type: "number", min: 40, max: 140, defaultValue: 85 },
      { name: "preampGain", label: "Preamp Gain (dB)", type: "number", min: 0, max: 70, defaultValue: 30 },
      { name: "micType", label: "Microphone Type", type: "select", options: [{ value: "1", label: "Dynamic" }, { value: "2", label: "Condenser (Large)" }, { value: "3", label: "Condenser (Small)" }, { value: "4", label: "Ribbon" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const sensitivityDBV = inputs.sensitivityDBV as number;
    const spl = inputs.spl as number;
    const preampGain = inputs.preampGain as number;
    const micType = inputs.micType as number;
    const mvPerPa = Math.pow(10, sensitivityDBV / 20) * 1000;
    const splPa = Math.pow(10, (spl - 94) / 20);
    const outputVoltage = (mvPerPa / 1000) * splPa;
    const outputDBV = 20 * Math.log10(outputVoltage);
    const afterPreamp = outputDBV + preampGain;
    const micLabels = { 1: "Dynamic", 2: "Large Condenser", 3: "Small Condenser", 4: "Ribbon" };
    const headroom = -afterPreamp;
    return {
      primary: { label: "Output Level (after preamp)", value: formatNumber(afterPreamp) + " dBV" },
      details: [
        { label: "Sensitivity", value: formatNumber(mvPerPa) + " mV/Pa" },
        { label: "Raw Output Voltage", value: formatNumber(outputVoltage * 1000) + " mV" },
        { label: "Mic Type", value: micLabels[micType] },
        { label: "Headroom to Clip", value: formatNumber(Math.abs(headroom)) + " dB" }
      ]
    };
  },
  }],
  relatedSlugs: ["equalizer-frequency-calculator","drum-tuning-frequency-calculator","speaker-wattage-calculator"],
  faq: [
    { question: "What is microphone sensitivity?", answer: "Sensitivity measures how much electrical output a microphone produces for a given sound pressure, usually measured in dBV/Pa." },
    { question: "Is higher or lower sensitivity better?", answer: "Neither is inherently better. Higher sensitivity mics need less gain but may clip on loud sources. Lower sensitivity mics handle louder sounds." },
    { question: "What sensitivity do I need for vocals?", answer: "For vocals, a large diaphragm condenser with around -30 to -40 dBV sensitivity is ideal for most recording situations." },
  ],
  formula: "mV/Pa = 10^(dBV/20) x 1000; Output = Sensitivity x SPL Pressure x Preamp Gain",
};
