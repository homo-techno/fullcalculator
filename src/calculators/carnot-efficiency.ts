import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carnotEfficiencyCalculator: CalculatorDefinition = {
  slug: "carnot-efficiency-calculator",
  title: "Carnot Engine Efficiency Calculator",
  description: "Free Carnot engine efficiency calculator. Compute the maximum theoretical efficiency, work output, and heat rejected for a Carnot heat engine.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["carnot efficiency", "carnot engine", "heat engine", "thermodynamics", "thermal efficiency", "carnot cycle"],
  variants: [
    {
      id: "efficiency",
      name: "Carnot Efficiency",
      description: "Calculate maximum efficiency from hot and cold reservoir temperatures",
      fields: [
        { name: "tHot", label: "Hot Reservoir Temperature", type: "number", placeholder: "e.g. 500" },
        { name: "tCold", label: "Cold Reservoir Temperature", type: "number", placeholder: "e.g. 300" },
        {
          name: "unit",
          label: "Temperature Unit",
          type: "select",
          options: [
            { label: "Kelvin (K)", value: "K" },
            { label: "Celsius (°C)", value: "C" },
            { label: "Fahrenheit (°F)", value: "F" },
          ],
          defaultValue: "K",
        },
      ],
      calculate: (inputs) => {
        const tHotRaw = parseFloat(inputs.tHot as string);
        const tColdRaw = parseFloat(inputs.tCold as string);
        const unit = (inputs.unit as string) || "K";
        if (isNaN(tHotRaw) || isNaN(tColdRaw)) return null;

        let tHotK: number, tColdK: number;
        if (unit === "C") {
          tHotK = tHotRaw + 273.15;
          tColdK = tColdRaw + 273.15;
        } else if (unit === "F") {
          tHotK = (tHotRaw - 32) * (5 / 9) + 273.15;
          tColdK = (tColdRaw - 32) * (5 / 9) + 273.15;
        } else {
          tHotK = tHotRaw;
          tColdK = tColdRaw;
        }

        if (tHotK <= 0 || tColdK <= 0) return null;
        if (tHotK <= tColdK) return null;

        const efficiency = 1 - tColdK / tHotK;
        const cop = tColdK / (tHotK - tColdK); // COP as refrigerator
        const copHeatPump = tHotK / (tHotK - tColdK);

        return {
          primary: { label: "Carnot Efficiency", value: `${formatNumber(efficiency * 100, 2)}%` },
          details: [
            { label: "Efficiency (η)", value: formatNumber(efficiency, 6) },
            { label: "Efficiency (%)", value: `${formatNumber(efficiency * 100, 2)}%` },
            { label: "T_hot (K)", value: `${formatNumber(tHotK, 2)} K` },
            { label: "T_cold (K)", value: `${formatNumber(tColdK, 2)} K` },
            { label: "Temperature Ratio T_c/T_h", value: formatNumber(tColdK / tHotK, 4) },
            { label: "COP (Refrigerator)", value: formatNumber(cop, 4) },
            { label: "COP (Heat Pump)", value: formatNumber(copHeatPump, 4) },
          ],
        };
      },
    },
    {
      id: "work-output",
      name: "Work Output",
      description: "Calculate work output and heat rejected given heat input and temperatures",
      fields: [
        { name: "qIn", label: "Heat Input Q_H (J)", type: "number", placeholder: "e.g. 1000", min: 0 },
        { name: "tHot", label: "Hot Temperature (K)", type: "number", placeholder: "e.g. 600", min: 0.01 },
        { name: "tCold", label: "Cold Temperature (K)", type: "number", placeholder: "e.g. 300", min: 0.01 },
      ],
      calculate: (inputs) => {
        const qIn = parseFloat(inputs.qIn as string);
        const tHotK = parseFloat(inputs.tHot as string);
        const tColdK = parseFloat(inputs.tCold as string);
        if (isNaN(qIn) || isNaN(tHotK) || isNaN(tColdK)) return null;
        if (tHotK <= tColdK || tHotK <= 0 || tColdK <= 0 || qIn < 0) return null;

        const efficiency = 1 - tColdK / tHotK;
        const work = efficiency * qIn;
        const qOut = qIn - work;
        const entropyChange = qOut / tColdK - qIn / tHotK; // Should be 0 for Carnot

        return {
          primary: { label: "Work Output", value: `${formatNumber(work, 4)} J` },
          details: [
            { label: "Heat Input (Q_H)", value: `${formatNumber(qIn, 4)} J` },
            { label: "Work Output (W)", value: `${formatNumber(work, 4)} J` },
            { label: "Heat Rejected (Q_C)", value: `${formatNumber(qOut, 4)} J` },
            { label: "Efficiency", value: `${formatNumber(efficiency * 100, 2)}%` },
            { label: "Entropy Change", value: `${formatNumber(entropyChange, 8)} J/K` },
          ],
          note: "A Carnot engine is the most efficient engine possible between two temperatures. Real engines always have lower efficiency.",
        };
      },
    },
  ],
  relatedSlugs: ["adiabatic-process-calculator", "isothermal-process-calculator", "energy-calculator"],
  faq: [
    { question: "What is Carnot efficiency?", answer: "Carnot efficiency η = 1 - T_C/T_H is the maximum theoretical efficiency of any heat engine operating between two temperatures. No real engine can exceed this limit. T_H and T_C must be in absolute temperature (Kelvin)." },
    { question: "Why can't a heat engine be 100% efficient?", answer: "By the second law of thermodynamics, some heat must always be rejected to the cold reservoir. 100% efficiency would require T_C = 0 K (absolute zero), which is unattainable. This is a fundamental limit, not a practical one." },
    { question: "What is COP for a refrigerator?", answer: "The Coefficient of Performance (COP) measures refrigerator or heat pump efficiency. For a Carnot refrigerator: COP = T_C/(T_H - T_C). For a heat pump: COP = T_H/(T_H - T_C). COP can exceed 1, unlike heat engine efficiency." },
  ],
  formula: "η = 1 - T_C/T_H | W = η·Q_H | Q_C = Q_H - W | COP_ref = T_C/(T_H - T_C) | COP_hp = T_H/(T_H - T_C)",
};
