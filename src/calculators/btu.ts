import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const btuCalculator: CalculatorDefinition = {
  slug: "btu-calculator",
  title: "BTU Calculator",
  description: "Free BTU calculator. Calculate heating and cooling BTU requirements for a room based on square footage and conditions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["btu calculator", "heating btu", "cooling btu", "air conditioner size", "hvac calculator"],
  variants: [
    {
      id: "cooling",
      name: "Cooling (AC) BTU",
      fields: [
        { name: "sqft", label: "Room Size (sq ft)", type: "number", placeholder: "e.g. 300" },
        { name: "ceiling", label: "Ceiling Height (ft)", type: "number", placeholder: "e.g. 8", defaultValue: 8 },
        { name: "sun", label: "Sun Exposure", type: "select", options: [{ label: "Average", value: "1" }, { label: "Heavy sun", value: "1.1" }, { label: "Shaded", value: "0.9" }] },
        { name: "people", label: "Number of People", type: "number", placeholder: "e.g. 2", defaultValue: 2 },
      ],
      calculate: (inputs) => {
        const sqft = inputs.sqft as number;
        const ceiling = (inputs.ceiling as number) || 8;
        const sun = parseFloat((inputs.sun as string) || "1");
        const people = (inputs.people as number) || 2;
        if (!sqft) return null;
        let btu = sqft * 20;
        if (ceiling > 8) btu *= ceiling / 8;
        btu *= sun;
        if (people > 2) btu += (people - 2) * 600;
        const tons = btu / 12000;
        return {
          primary: { label: "Cooling BTU", value: `${formatNumber(btu, 0)} BTU/hr` },
          details: [
            { label: "Tonnage", value: `${formatNumber(tons, 2)} tons` },
            { label: "Room size", value: `${sqft} sq ft` },
            { label: "Watts equivalent", value: `${formatNumber(btu * 0.293, 0)} W` },
          ],
        };
      },
    },
    {
      id: "heating",
      name: "Heating BTU",
      fields: [
        { name: "sqft", label: "Room Size (sq ft)", type: "number", placeholder: "e.g. 1500" },
        { name: "tempDiff", label: "Temp Difference (°F)", type: "number", placeholder: "e.g. 40" },
        { name: "insulation", label: "Insulation Quality", type: "select", options: [{ label: "Average", value: "1" }, { label: "Good", value: "0.85" }, { label: "Poor", value: "1.3" }] },
      ],
      calculate: (inputs) => {
        const sqft = inputs.sqft as number, tempDiff = inputs.tempDiff as number;
        const ins = parseFloat((inputs.insulation as string) || "1");
        if (!sqft || !tempDiff) return null;
        const btu = sqft * tempDiff * 0.133 * 3.413 * ins;
        return {
          primary: { label: "Heating BTU", value: `${formatNumber(btu, 0)} BTU/hr` },
          details: [
            { label: "Room size", value: `${sqft} sq ft` },
            { label: "kW equivalent", value: `${formatNumber(btu / 3412, 2)} kW` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["electricity-cost-calculator", "square-footage-calculator", "energy-calculator"],
  faq: [{ question: "How many BTUs do I need?", answer: "For cooling: roughly 20 BTU per sq ft. A 300 sq ft room needs ~6,000 BTU. For every extra person above 2, add 600 BTU. Adjust for sun exposure, ceiling height, and insulation." }],
  formula: "Cooling: ~20 BTU/sq ft | 1 ton = 12,000 BTU",
};
