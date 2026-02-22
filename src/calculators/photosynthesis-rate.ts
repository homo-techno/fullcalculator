import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const photosynthesisRateCalculator: CalculatorDefinition = {
  slug: "photosynthesis-rate-calculator",
  title: "Photosynthesis Rate Calculator",
  description:
    "Free photosynthesis rate calculator. Estimate net and gross photosynthesis rates from oxygen evolution, CO2 uptake, or biomass data.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "photosynthesis rate",
    "oxygen evolution",
    "carbon fixation",
    "CO2 uptake",
    "net photosynthesis",
    "gross photosynthesis",
    "plant biology",
  ],
  variants: [
    {
      id: "oxygen-evolution",
      name: "From O₂ Evolution",
      description: "Calculate photosynthesis rate from oxygen produced",
      fields: [
        {
          name: "oxygenProduced",
          label: "O₂ Produced (mL or µmol)",
          type: "number",
          placeholder: "e.g. 5",
          min: 0,
        },
        {
          name: "time",
          label: "Time (minutes)",
          type: "number",
          placeholder: "e.g. 30",
          min: 0,
        },
        {
          name: "leafArea",
          label: "Leaf Area (cm²)",
          type: "number",
          placeholder: "e.g. 10",
          min: 0,
        },
        {
          name: "respirationRate",
          label: "Dark Respiration Rate (same unit/min/cm²)",
          type: "number",
          placeholder: "e.g. 0.002",
          min: 0,
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const O2 = inputs.oxygenProduced as number;
        const time = inputs.time as number;
        const area = inputs.leafArea as number;
        const resp = (inputs.respirationRate as number) || 0;
        if (!O2 || !time || !area || O2 < 0 || time <= 0 || area <= 0) return null;

        const netRate = O2 / (time * area); // per min per cm²
        const grossRate = netRate + resp;
        const netPerHour = netRate * 60;
        const grossPerHour = grossRate * 60;

        return {
          primary: {
            label: "Net Photosynthesis Rate",
            value: formatNumber(netRate, 6) + " O₂/min/cm²",
          },
          details: [
            { label: "Net rate per hour", value: formatNumber(netPerHour, 4) + " O₂/hr/cm²" },
            { label: "Gross photosynthesis rate", value: formatNumber(grossRate, 6) + " O₂/min/cm²" },
            { label: "Gross rate per hour", value: formatNumber(grossPerHour, 4) + " O₂/hr/cm²" },
            { label: "Dark respiration rate", value: formatNumber(resp, 6) + " O₂/min/cm²" },
            { label: "Total O₂ produced", value: formatNumber(O2, 4) },
            { label: "Measurement duration", value: formatNumber(time, 2) + " min" },
            { label: "Leaf area", value: formatNumber(area, 2) + " cm²" },
          ],
        };
      },
    },
    {
      id: "co2-uptake",
      name: "From CO₂ Uptake",
      description: "Calculate photosynthesis rate from CO₂ assimilation",
      fields: [
        {
          name: "co2Absorbed",
          label: "CO₂ Absorbed (µmol)",
          type: "number",
          placeholder: "e.g. 10",
          min: 0,
        },
        {
          name: "time",
          label: "Time (seconds)",
          type: "number",
          placeholder: "e.g. 60",
          min: 0,
        },
        {
          name: "leafArea",
          label: "Leaf Area (m²)",
          type: "number",
          placeholder: "e.g. 0.001",
          min: 0,
          step: 0.0001,
        },
      ],
      calculate: (inputs) => {
        const co2 = inputs.co2Absorbed as number;
        const time = inputs.time as number;
        const area = inputs.leafArea as number;
        if (!co2 || !time || !area || co2 < 0 || time <= 0 || area <= 0) return null;

        const rate = co2 / (time * area); // µmol CO₂ m⁻² s⁻¹
        const ratePerMin = rate * 60;

        // Approximate glucose production: 6CO₂ → 1 glucose
        const glucoseRate = rate / 6;

        return {
          primary: {
            label: "Photosynthesis Rate",
            value: formatNumber(rate, 4) + " µmol CO₂ m⁻² s⁻¹",
          },
          details: [
            { label: "Rate per minute", value: formatNumber(ratePerMin, 4) + " µmol CO₂ m⁻² min⁻¹" },
            { label: "Glucose production rate", value: formatNumber(glucoseRate, 4) + " µmol m⁻² s⁻¹" },
            { label: "Total CO₂ absorbed", value: formatNumber(co2, 4) + " µmol" },
            { label: "Measurement time", value: formatNumber(time, 2) + " s" },
            { label: "Leaf area", value: formatNumber(area, 6) + " m²" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "respiration-rate-calculator",
    "beer-lambert-bio-calculator",
    "population-growth-calculator",
  ],
  faq: [
    {
      question: "What is net vs gross photosynthesis?",
      answer:
        "Gross photosynthesis is the total amount of carbon fixed or O₂ produced. Net photosynthesis = Gross photosynthesis − Respiration. Net photosynthesis is what we actually measure, since respiration occurs simultaneously.",
    },
    {
      question: "What factors affect photosynthesis rate?",
      answer:
        "Key factors include light intensity, CO₂ concentration, temperature, water availability, and leaf area. The light compensation point is where photosynthesis equals respiration (net = 0).",
    },
    {
      question: "What is the overall equation for photosynthesis?",
      answer:
        "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂. Six molecules of carbon dioxide and water produce one glucose and six oxygen molecules, using light energy.",
    },
  ],
  formula:
    "Net photosynthesis rate = O₂ produced / (time × leaf area). Gross = Net + Respiration. 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂.",
};
