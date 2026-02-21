import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hvacCalculator: CalculatorDefinition = {
  slug: "hvac-calculator",
  title: "HVAC Calculator",
  description:
    "Free HVAC BTU calculator. Estimate heating and cooling BTUs needed based on square footage and climate.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["HVAC", "BTU", "heating", "cooling", "air conditioning", "furnace"],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "sqft",
          label: "Area (sq ft)",
          type: "number",
          placeholder: "e.g. 1500",
        },
        {
          name: "climate",
          label: "Climate",
          type: "select",
          options: [
            { label: "Cold", value: "cold" },
            { label: "Moderate", value: "moderate" },
            { label: "Hot", value: "hot" },
          ],
        },
        {
          name: "ceilingHeight",
          label: "Ceiling Height (feet)",
          type: "number",
          placeholder: "e.g. 8",
        },
      ],
      calculate: (inputs) => {
        const sqft = inputs.sqft as number;
        const climate = inputs.climate as string;
        const ceilingHeight = (inputs.ceilingHeight as number) || 8;
        if (!sqft || !climate) return null;

        const baseBTU = sqft * 20;

        const climateMultiplier: Record<string, number> = {
          cold: 1.3,
          moderate: 1.0,
          hot: 1.2,
        };

        const ceilingMultiplier = ceilingHeight > 8 ? 1 + (ceilingHeight - 8) * 0.05 : 1.0;
        const multiplier = (climateMultiplier[climate] || 1.0) * ceilingMultiplier;
        const totalBTU = baseBTU * multiplier;
        const tons = totalBTU / 12000;

        return {
          primary: {
            label: "BTU Needed",
            value: formatNumber(totalBTU, 0),
          },
          details: [
            { label: "Base BTU (20 per sq ft)", value: formatNumber(baseBTU, 0) },
            { label: "Climate Adjustment", value: climate + " (×" + formatNumber(climateMultiplier[climate] || 1, 1) + ")" },
            { label: "Ceiling Adjustment", value: "×" + formatNumber(ceilingMultiplier, 2) },
            { label: "Tons of Cooling", value: formatNumber(tons, 2) },
            { label: "Recommended Unit Size", value: formatNumber(Math.ceil(tons * 2) / 2, 1) + " ton" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["btu-calculator", "electricity-usage-calculator"],
  faq: [
    {
      question: "How many BTU per square foot?",
      answer:
        "A general rule is 20 BTU per square foot for standard 8-foot ceilings in a moderate climate.",
    },
    {
      question: "What is a ton of cooling?",
      answer:
        "One ton of cooling equals 12,000 BTU per hour. Most residential systems range from 1.5 to 5 tons.",
    },
  ],
  formula:
    "BTU = Sq Ft × 20 × Climate Multiplier × Ceiling Multiplier. Tons = BTU ÷ 12,000.",
};
