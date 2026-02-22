import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const nmToFtLbsConverter: CalculatorDefinition = {
  slug: "nm-to-ft-lbs-converter",
  title: "Newton-Meters to Foot-Pounds Converter",
  description: "Free Nm to ft-lbs converter. Convert Newton-meters to foot-pounds of torque instantly. Essential for automotive and engineering.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["nm to ft lbs", "newton meters to foot pounds", "torque converter", "nm to ft-lbs", "torque conversion"],
  variants: [
    {
      id: "convert",
      name: "Convert Nm to ft-lbs",
      fields: [
        { name: "value", label: "Newton-Meters (Nm)", type: "number", placeholder: "e.g. 100" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (value === undefined) return null;
        const ftLbs = value * 0.737562;
        return {
          primary: { label: `${formatNumber(value)} Nm`, value: `${formatNumber(ftLbs, 4)} ft-lbs` },
          details: [
            { label: "Foot-Pounds (ft-lbs)", value: formatNumber(ftLbs, 6) },
            { label: "Inch-Pounds (in-lbs)", value: formatNumber(value * 8.85075, 4) },
            { label: "Kilogram-force cm", value: formatNumber(value * 10.1972, 4) },
            { label: "Kilogram-force m", value: formatNumber(value * 0.101972, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ft-lbs-to-nm-converter", "unit-converter", "force-calculator"],
  faq: [
    { question: "How do I convert Nm to ft-lbs?", answer: "Multiply Newton-meters by 0.737562 to get foot-pounds. For example, 100 Nm = 73.76 ft-lbs. Quick estimate: multiply Nm by 0.74." },
    { question: "Why is torque conversion important?", answer: "Torque specs are listed in Nm in metric countries and ft-lbs in the US. Converting between them is essential for automotive work, especially when following torque specifications for bolts and fasteners." },
  ],
  formula: "1 Nm = 0.737562 ft-lbs | 1 Nm = 8.85075 in-lbs | 1 ft-lb = 1.35582 Nm",
};
