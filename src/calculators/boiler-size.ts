import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const boilerSizeCalculator: CalculatorDefinition = {
  slug: "boiler-size-calculator",
  title: "Boiler Sizing Calculator",
  description: "Free boiler sizing calculator. Determine the right boiler capacity in BTU/hr based on building heat loss and domestic hot water needs.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["boiler size calculator", "boiler capacity", "boiler BTU", "heating boiler sizing", "boiler output"],
  variants: [
    {
      id: "simplified",
      name: "Simplified Boiler Sizing",
      description: "Quick estimate based on building area and insulation",
      fields: [
        { name: "area", label: "Heated Area (sq ft)", type: "number", placeholder: "e.g. 2000" },
        { name: "insulation", label: "Insulation Quality", type: "select", options: [
          { label: "Poor (30-40 BTU/sq ft)", value: "poor" },
          { label: "Average (20-30 BTU/sq ft)", value: "average" },
          { label: "Good (15-20 BTU/sq ft)", value: "good" },
          { label: "Excellent (10-15 BTU/sq ft)", value: "excellent" },
        ], defaultValue: "average" },
        { name: "dhw", label: "Include Domestic Hot Water?", type: "select", options: [
          { label: "Yes (add 20%)", value: "yes" },
          { label: "No", value: "no" },
        ], defaultValue: "yes" },
        { name: "climate", label: "Climate", type: "select", options: [
          { label: "Mild (South)", value: "mild" },
          { label: "Moderate (Mid-Atlantic)", value: "moderate" },
          { label: "Cold (North)", value: "cold" },
          { label: "Very Cold (Northern Border)", value: "very_cold" },
        ], defaultValue: "moderate" },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const insulation = inputs.insulation as string;
        const dhw = inputs.dhw as string;
        const climate = inputs.climate as string;
        if (!area) return null;
        const btuPerSqFt: Record<string, number> = { poor: 35, average: 25, good: 17, excellent: 12 };
        const climateMult: Record<string, number> = { mild: 0.8, moderate: 1.0, cold: 1.2, very_cold: 1.4 };
        let totalBtu = area * (btuPerSqFt[insulation] || 25) * (climateMult[climate] || 1.0);
        if (dhw === "yes") totalBtu *= 1.2;
        const boilerHp = totalBtu / 33475;
        const kw = totalBtu / 3412;
        return {
          primary: { label: "Required Boiler Output", value: `${formatNumber(totalBtu, 0)}` + " BTU/hr" },
          details: [
            { label: "Boiler HP", value: `${formatNumber(boilerHp, 2)}` + " BHP" },
            { label: "kW Equivalent", value: `${formatNumber(kw, 1)}` + " kW" },
            { label: "BTU/sq ft Used", value: `${formatNumber((btuPerSqFt[insulation] || 25) * (climateMult[climate] || 1.0), 1)}` },
            { label: "Includes DHW", value: dhw === "yes" ? "Yes (+20%)" : "No" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["heat-loss-calculator", "radiator-size-calculator", "expansion-tank-calculator"],
  faq: [
    { question: "How do I size a boiler?", answer: "The best method is a Manual J heat loss calculation. As a rough estimate, multiply heated area by 25-35 BTU/sq ft for average insulation and add 20% for domestic hot water." },
    { question: "Should I oversize my boiler?", answer: "Avoid oversizing. An oversized boiler short-cycles, reducing efficiency and increasing wear. Size to 110-120% of calculated heat loss at most." },
  ],
  formula: "Boiler BTU = Area x BTU/sqft x Climate Factor x DHW Factor | 1 BHP = 33,475 BTU/hr",
};