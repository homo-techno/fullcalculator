import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const flowRateConverterCalculator: CalculatorDefinition = {
  slug: "flow-rate-converter",
  title: "Flow Rate Converter Calculator",
  description:
    "Free flow rate converter. Convert between GPM, LPM, CFM, m³/h, and other flow rate units for liquids and gases.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "flow rate converter",
    "GPM to LPM",
    "CFM converter",
    "cubic meters per hour",
    "gallons per minute",
    "liters per minute",
    "flow rate calculator",
  ],
  variants: [
    {
      id: "liquid-flow",
      name: "Liquid Flow Rate",
      description: "Convert between liquid flow rate units",
      fields: [
        {
          name: "value",
          label: "Flow Rate Value",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "from",
          label: "From Unit",
          type: "select",
          options: [
            { label: "Gallons/min (GPM)", value: "GPM" },
            { label: "Liters/min (LPM)", value: "LPM" },
            { label: "Liters/hour (L/h)", value: "LPH" },
            { label: "Cubic meters/hour (m³/h)", value: "M3H" },
            { label: "Gallons/hour (GPH)", value: "GPH" },
            { label: "Barrels/day (BPD)", value: "BPD" },
          ],
          defaultValue: "GPM",
        },
        {
          name: "to",
          label: "To Unit",
          type: "select",
          options: [
            { label: "Gallons/min (GPM)", value: "GPM" },
            { label: "Liters/min (LPM)", value: "LPM" },
            { label: "Liters/hour (L/h)", value: "LPH" },
            { label: "Cubic meters/hour (m³/h)", value: "M3H" },
            { label: "Gallons/hour (GPH)", value: "GPH" },
            { label: "Barrels/day (BPD)", value: "BPD" },
          ],
          defaultValue: "LPM",
        },
      ],
      calculate: (inputs) => {
        const value = parseFloat(inputs.value as string);
        const from = inputs.from as string;
        const to = inputs.to as string;
        if (isNaN(value)) return null;

        // Convert to LPM first
        const toLPM: Record<string, number> = {
          "GPM": 3.78541,
          "LPM": 1,
          "LPH": 1 / 60,
          "M3H": 1000 / 60,
          "GPH": 3.78541 / 60,
          "BPD": 158.987 / 1440,
        };

        const lpm = value * (toLPM[from] || 1);
        const result = lpm / (toLPM[to] || 1);

        const unitLabels: Record<string, string> = {
          "GPM": "gal/min",
          "LPM": "L/min",
          "LPH": "L/h",
          "M3H": "m³/h",
          "GPH": "gal/h",
          "BPD": "bbl/day",
        };

        return {
          primary: {
            label: `${formatNumber(value)} ${unitLabels[from]}`,
            value: formatNumber(result, 4),
            suffix: unitLabels[to],
          },
          details: [
            { label: "GPM", value: formatNumber(lpm / toLPM["GPM"], 4) },
            { label: "LPM", value: formatNumber(lpm, 4) },
            { label: "m³/h", value: formatNumber(lpm / toLPM["M3H"], 4) },
            { label: "Barrels/day", value: formatNumber(lpm / toLPM["BPD"], 4) },
          ],
        };
      },
    },
    {
      id: "gas-flow",
      name: "Gas Flow Rate (CFM)",
      description: "Convert between gas/air flow rate units",
      fields: [
        {
          name: "value",
          label: "Flow Rate Value",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          name: "from",
          label: "From Unit",
          type: "select",
          options: [
            { label: "Cubic feet/min (CFM)", value: "CFM" },
            { label: "Cubic meters/hour (m³/h)", value: "M3H" },
            { label: "Cubic meters/min (m³/min)", value: "M3M" },
            { label: "Liters/second (L/s)", value: "LS" },
            { label: "Liters/min (LPM)", value: "LPM" },
          ],
          defaultValue: "CFM",
        },
        {
          name: "to",
          label: "To Unit",
          type: "select",
          options: [
            { label: "Cubic feet/min (CFM)", value: "CFM" },
            { label: "Cubic meters/hour (m³/h)", value: "M3H" },
            { label: "Cubic meters/min (m³/min)", value: "M3M" },
            { label: "Liters/second (L/s)", value: "LS" },
            { label: "Liters/min (LPM)", value: "LPM" },
          ],
          defaultValue: "M3H",
        },
      ],
      calculate: (inputs) => {
        const value = parseFloat(inputs.value as string);
        const from = inputs.from as string;
        const to = inputs.to as string;
        if (isNaN(value)) return null;

        // Convert to CFM first
        const toCFM: Record<string, number> = {
          "CFM": 1,
          "M3H": 0.58858,
          "M3M": 35.3147,
          "LS": 2.11888,
          "LPM": 0.035315,
        };

        const cfm = value * (toCFM[from] || 1);
        const result = cfm / (toCFM[to] || 1);

        return {
          primary: {
            label: `${formatNumber(value)} ${from}`,
            value: formatNumber(result, 4),
            suffix: to,
          },
          details: [
            { label: "CFM", value: formatNumber(cfm, 4) },
            { label: "m³/h", value: formatNumber(cfm / toCFM["M3H"], 4) },
            { label: "L/s", value: formatNumber(cfm / toCFM["LS"], 4) },
            { label: "LPM", value: formatNumber(cfm / toCFM["LPM"], 4) },
          ],
        };
      },
    },
    {
      id: "pipe-flow",
      name: "Pipe Flow Rate",
      description: "Calculate flow rate from pipe diameter and velocity",
      fields: [
        {
          name: "diameter",
          label: "Pipe Inner Diameter",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "diameterUnit",
          label: "Diameter Unit",
          type: "select",
          options: [
            { label: "Inches", value: "in" },
            { label: "Millimeters", value: "mm" },
          ],
          defaultValue: "in",
        },
        {
          name: "velocity",
          label: "Flow Velocity (ft/s)",
          type: "number",
          placeholder: "e.g. 5",
        },
      ],
      calculate: (inputs) => {
        const diameter = parseFloat(inputs.diameter as string);
        const diameterUnit = inputs.diameterUnit as string;
        const velocity = parseFloat(inputs.velocity as string);
        if (isNaN(diameter) || isNaN(velocity) || diameter <= 0 || velocity <= 0) return null;

        let diameterFt = diameterUnit === "mm" ? diameter / 304.8 : diameter / 12;
        const area = Math.PI * Math.pow(diameterFt / 2, 2); // sq ft
        const flowCFS = area * velocity; // cubic ft/s
        const flowGPM = flowCFS * 448.831;
        const flowLPM = flowGPM * 3.78541;

        return {
          primary: {
            label: "Flow Rate",
            value: formatNumber(flowGPM, 2),
            suffix: "GPM",
          },
          details: [
            { label: "Liters/min", value: formatNumber(flowLPM, 2) + " LPM" },
            { label: "Cubic ft/sec", value: formatNumber(flowCFS, 4) + " CFS" },
            { label: "Pipe Area", value: formatNumber(area * 144, 3) + " sq in" },
            { label: "m³/hour", value: formatNumber(flowLPM * 60 / 1000, 3) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter", "pressure-calculator", "pool-volume-calculator"],
  faq: [
    {
      question: "How do I convert GPM to LPM?",
      answer:
        "Multiply GPM by 3.78541 to get LPM. For example, 10 GPM = 37.85 LPM. One US gallon equals 3.78541 liters.",
    },
    {
      question: "What is CFM and when is it used?",
      answer:
        "CFM (Cubic Feet per Minute) measures air or gas flow rate. It is commonly used for HVAC systems, air compressors, ventilation fans, and pneumatic tools.",
    },
    {
      question: "How do I calculate flow rate from pipe diameter?",
      answer:
        "Flow Rate = Cross-sectional Area x Velocity. The area is calculated as pi x (diameter/2)². For example, a 2-inch pipe with 5 ft/s velocity flows at about 98 GPM.",
    },
  ],
  formula:
    "1 GPM = 3.785 LPM = 0.2271 m³/h | 1 CFM = 1.699 m³/h | Flow = Area x Velocity",
};
