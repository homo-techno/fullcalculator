import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const commercialKitchenVentilationCalculator: CalculatorDefinition = {
  slug: "commercial-kitchen-ventilation-calculator",
  title: "Commercial Kitchen Ventilation Calculator",
  description: "Calculate kitchen exhaust hood CFM requirements.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["kitchen ventilation","kitchen hood CFM calculator"],
  variants: [{
    id: "standard",
    name: "Commercial Kitchen Ventilation",
    description: "Calculate kitchen exhaust hood CFM requirements.",
    fields: [
      { name: "hoodLength", label: "Hood Length (ft)", type: "number", min: 3, max: 30, defaultValue: 10 },
      { name: "hoodWidth", label: "Hood Width (ft)", type: "number", min: 2, max: 10, defaultValue: 4 },
      { name: "cookingType", label: "Cooking Type", type: "select", options: [{ value: "300", label: "Light Duty (300 CFM/ft)" }, { value: "400", label: "Medium Duty (400 CFM/ft)" }, { value: "500", label: "Heavy Duty (500 CFM/ft)" }], defaultValue: "400" },
      { name: "hoodType", label: "Hood Style", type: "select", options: [{ value: "1", label: "Wall Canopy" }, { value: "1.4", label: "Island Canopy" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
      const hl = inputs.hoodLength as number;
      const hw = inputs.hoodWidth as number;
      const cfmPerFt = Number(inputs.cookingType as number);
      const hoodFactor = Number(inputs.hoodType as number);
      if (!hl || !hw || !cfmPerFt) return null;
      const baseCFM = cfmPerFt * hl;
      const totalCFM = Math.round(baseCFM * hoodFactor);
      const makeupAir = Math.round(totalCFM * 0.8);
      const ductDia = Math.ceil(Math.sqrt((totalCFM / 1500) * 4 / Math.PI) * 12);
      return {
        primary: { label: "Exhaust CFM Required", value: formatNumber(totalCFM) + " CFM" },
        details: [
          { label: "Makeup Air Needed", value: formatNumber(makeupAir) + " CFM" },
          { label: "Estimated Duct Diameter", value: formatNumber(ductDia) + " in" },
          { label: "Hood Area", value: formatNumber(hl * hw) + " sq ft" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How many CFM does a commercial kitchen need?", answer: "Light duty needs 300 CFM per linear foot; heavy duty needs 400 to 500 CFM per foot." },
    { question: "What is makeup air?", answer: "Makeup air replaces exhausted air to maintain proper building pressure balance." },
  ],
  formula: "CFM = CFM Per Linear Foot x Hood Length x Hood Factor",
};
