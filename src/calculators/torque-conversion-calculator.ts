import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const torqueConversionCalculator: CalculatorDefinition = {
  slug: "torque-conversion-calculator",
  title: "Torque Conversion Calculator",
  description: "Convert torque values between common units including Newton-meters, foot-pounds, and inch-pounds.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["torque conversion", "torque units", "Nm to ft-lbs"],
  variants: [{
    id: "standard",
    name: "Torque Conversion",
    description: "Convert torque values between common units including Newton-meters, foot-pounds, and inch-pounds",
    fields: [
      { name: "value", label: "Torque Value", type: "number", min: 0.001, max: 1000000, defaultValue: 100 },
      { name: "fromUnit", label: "From Unit", type: "select", options: [{value:"nm",label:"Newton-meters (Nm)"},{value:"ftlb",label:"Foot-pounds (ft-lb)"},{value:"inlb",label:"Inch-pounds (in-lb)"},{value:"kgcm",label:"Kilogram-centimeters (kg-cm)"}], defaultValue: "nm" },
      { name: "toUnit", label: "To Unit", type: "select", options: [{value:"nm",label:"Newton-meters (Nm)"},{value:"ftlb",label:"Foot-pounds (ft-lb)"},{value:"inlb",label:"Inch-pounds (in-lb)"},{value:"kgcm",label:"Kilogram-centimeters (kg-cm)"}], defaultValue: "ftlb" },
    ],
    calculate: (inputs) => {
      const val = inputs.value as number;
      const from = inputs.fromUnit as string;
      const to = inputs.toUnit as string;
      if (!val) return null;
      const toNm: Record<string, number> = { nm: 1, ftlb: 1.35582, inlb: 0.112985, kgcm: 0.0980665 };
      const fromNm: Record<string, number> = { nm: 1, ftlb: 0.737562, inlb: 8.85075, kgcm: 10.1972 };
      const nm = val * (toNm[from] || 1);
      const result = nm * (fromNm[to] || 1);
      const unitLabels: Record<string, string> = { nm: "Nm", ftlb: "ft-lb", inlb: "in-lb", kgcm: "kg-cm" };
      return {
        primary: { label: "Result", value: formatNumber(parseFloat(result.toFixed(4))) + " " + (unitLabels[to] || to) },
        details: [
          { label: "Input", value: formatNumber(val) + " " + (unitLabels[from] || from) },
          { label: "In Newton-meters", value: nm.toFixed(4) + " Nm" },
          { label: "Conversion Factor", value: (result / val).toFixed(6) },
        ],
      };
    },
  }],
  relatedSlugs: ["belt-length-calculator", "spring-constant-calculator"],
  faq: [
    { question: "How do I convert Nm to ft-lbs?", answer: "Multiply Newton-meters by 0.7376 to get foot-pounds. For example, 100 Nm equals approximately 73.76 ft-lbs." },
    { question: "What torque unit is most common?", answer: "Newton-meters (Nm) are the international standard. Foot-pounds (ft-lbs) are common in the US automotive industry. Inch-pounds are used for smaller fasteners." },
  ],
  formula: "Result = Input Value x Conversion Factor (via Newton-meters)",
};
