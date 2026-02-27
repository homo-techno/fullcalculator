import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gallonsPerMinuteCalculator: CalculatorDefinition = {
  slug: "gallons-per-minute",
  title: "Flow Rate Converter (GPM / LPM / m\u00B3/h)",
  description:
    "Convert flow rates between gallons per minute (GPM), liters per minute (LPM), cubic meters per hour, and other common units used in plumbing, irrigation, and industrial systems.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "gallons per minute",
    "GPM",
    "LPM",
    "liters per minute",
    "flow rate",
    "cubic meters per hour",
    "plumbing",
    "irrigation",
    "hydraulic",
  ],
  variants: [
    {
      slug: "gpm-convert",
      title: "GPM to Other Units",
      fields: [
        {
          name: "gpm",
          label: "Flow Rate (GPM)",
          type: "number",
        },
      ],
      calculate(inputs) {
        const gpm = parseFloat(inputs.gpm as string);
        if (isNaN(gpm)) return { error: "Please enter a valid flow rate in GPM." };

        const lpm = gpm * 3.78541;
        const m3h = gpm * 0.227125;
        const cfs = gpm * 0.002228;
        const gph = gpm * 60;
        const lps = lpm / 60;

        return {
          results: [
            { label: "Liters per Minute (LPM)", value: formatNumber(lpm) },
            { label: "Cubic Meters per Hour (m\u00B3/h)", value: formatNumber(m3h) },
            { label: "Cubic Feet per Second (CFS)", value: formatNumber(cfs) },
            { label: "Gallons per Hour (GPH)", value: formatNumber(gph) },
            { label: "Liters per Second (L/s)", value: formatNumber(lps) },
          ],
        };
      },
    },
    {
      slug: "lpm-convert",
      title: "LPM to Other Units",
      fields: [
        {
          name: "lpm",
          label: "Flow Rate (LPM)",
          type: "number",
        },
      ],
      calculate(inputs) {
        const lpm = parseFloat(inputs.lpm as string);
        if (isNaN(lpm)) return { error: "Please enter a valid flow rate in LPM." };

        const gpm = lpm / 3.78541;
        const m3h = lpm * 0.06;
        const cfs = gpm * 0.002228;
        const gph = gpm * 60;
        const lps = lpm / 60;

        return {
          results: [
            { label: "Gallons per Minute (GPM)", value: formatNumber(gpm) },
            { label: "Cubic Meters per Hour (m\u00B3/h)", value: formatNumber(m3h) },
            { label: "Cubic Feet per Second (CFS)", value: formatNumber(cfs) },
            { label: "Gallons per Hour (GPH)", value: formatNumber(gph) },
            { label: "Liters per Second (L/s)", value: formatNumber(lps) },
          ],
        };
      },
    },
    {
      slug: "universal-flow",
      title: "Universal Flow Converter",
      fields: [
        {
          name: "value",
          label: "Flow Rate Value",
          type: "number",
        },
        {
          name: "unit",
          label: "Input Unit",
          type: "select",
          options: [
            { label: "Gallons per Minute (GPM)", value: "gpm" },
            { label: "Liters per Minute (LPM)", value: "lpm" },
            { label: "Cubic Meters per Hour (m\u00B3/h)", value: "m3h" },
            { label: "Cubic Feet per Second (CFS)", value: "cfs" },
          ],
        },
      ],
      calculate(inputs) {
        const value = parseFloat(inputs.value as string);
        const unit = inputs.unit as string;
        if (isNaN(value)) return { error: "Please enter a valid flow rate value." };

        let gpm: number;
        if (unit === "gpm") gpm = value;
        else if (unit === "lpm") gpm = value / 3.78541;
        else if (unit === "m3h") gpm = value / 0.227125;
        else gpm = value / 0.002228;

        const lpm = gpm * 3.78541;
        const m3h = gpm * 0.227125;
        const cfs = gpm * 0.002228;
        const gph = gpm * 60;
        const lps = lpm / 60;

        return {
          results: [
            { label: "Gallons per Minute (GPM)", value: formatNumber(gpm) },
            { label: "Liters per Minute (LPM)", value: formatNumber(lpm) },
            { label: "Cubic Meters per Hour (m\u00B3/h)", value: formatNumber(m3h) },
            { label: "Cubic Feet per Second (CFS)", value: formatNumber(cfs) },
            { label: "Gallons per Hour (GPH)", value: formatNumber(gph) },
            { label: "Liters per Second (L/s)", value: formatNumber(lps) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["btu-to-kw", "newtons-to-pounds", "nautical-miles-to-km"],
  faq: [
    {
      question: "How many liters per minute is 1 GPM?",
      answer:
        "One US gallon per minute equals approximately 3.785 liters per minute (LPM). This conversion is critical in plumbing, irrigation, and water treatment applications.",
    },
    {
      question: "What is a typical household water flow rate?",
      answer:
        "A typical US household faucet flows at 1.5-2.2 GPM (5.7-8.3 LPM), a shower at 2.0-2.5 GPM (7.6-9.5 LPM), and a garden hose at 5-10 GPM (19-38 LPM).",
    },
    {
      question: "What is CFS and when is it used?",
      answer:
        "CFS (cubic feet per second) is used to measure large-scale water flow such as rivers, streams, and stormwater systems. One CFS equals approximately 448.8 GPM or 28.3 liters per second.",
    },
  ],
  formula:
    "LPM = GPM x 3.78541 | m\u00B3/h = GPM x 0.227125 | CFS = GPM x 0.002228 | GPH = GPM x 60",
};
