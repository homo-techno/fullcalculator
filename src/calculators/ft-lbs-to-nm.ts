import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ftLbsToNmConverter: CalculatorDefinition = {
  slug: "ft-lbs-to-nm-converter",
  title: "Foot-Pounds to Newton-Meters Converter",
  description: "Free ft-lbs to Nm converter. Convert foot-pounds to Newton-meters of torque instantly. Perfect for automotive and mechanical work.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["ft lbs to nm", "foot pounds to newton meters", "torque converter", "ft-lbs to nm", "torque conversion"],
  variants: [
    {
      id: "convert",
      name: "Convert ft-lbs to Nm",
      fields: [
        { name: "value", label: "Foot-Pounds (ft-lbs)", type: "number", placeholder: "e.g. 75" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (value === undefined) return null;
        const nm = value * 1.35582;
        return {
          primary: { label: `${formatNumber(value)} ft-lbs`, value: `${formatNumber(nm, 4)} Nm` },
          details: [
            { label: "Newton-Meters (Nm)", value: formatNumber(nm, 6) },
            { label: "Inch-Pounds (in-lbs)", value: formatNumber(value * 12, 2) },
            { label: "Kilogram-force cm", value: formatNumber(nm * 10.1972, 4) },
            { label: "Kilogram-force m", value: formatNumber(nm * 0.101972, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["nm-to-ft-lbs-converter", "unit-converter", "force-calculator"],
  faq: [
    { question: "How do I convert ft-lbs to Nm?", answer: "Multiply foot-pounds by 1.35582 to get Newton-meters. For example, 75 ft-lbs = 101.69 Nm. Quick estimate: multiply ft-lbs by 1.36." },
    { question: "What is a foot-pound of torque?", answer: "A foot-pound (ft-lb) is the torque created by one pound of force acting at a perpendicular distance of one foot from the pivot point. It is the standard unit for torque in the US customary system." },
  ],
  formula: "1 ft-lb = 1.35582 Nm | 1 ft-lb = 12 in-lbs | 1 Nm = 0.737562 ft-lbs",
};
