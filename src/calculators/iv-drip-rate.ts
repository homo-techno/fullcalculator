import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ivDripRateCalculator: CalculatorDefinition = {
  slug: "iv-drip-rate-calculator",
  title: "IV Drip Rate Calculator",
  description:
    "Free IV drip rate calculator. Calculate drops per minute for intravenous fluid administration based on volume, time, and drop factor.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["IV drip rate", "drops per minute", "infusion rate", "drop factor"],
  variants: [
    {
      id: "dripRate",
      name: "Drip Rate Calculation",
      fields: [
        {
          name: "volume",
          label: "Total Volume (mL)",
          type: "number",
          placeholder: "e.g. 1000",
        },
        {
          name: "timeHours",
          label: "Time (hours)",
          type: "number",
          placeholder: "e.g. 8",
        },
        {
          name: "dropFactor",
          label: "Drop Factor (gtt/mL)",
          type: "select",
          options: [
            { label: "10 gtt/mL (macro)", value: "10" },
            { label: "15 gtt/mL (macro)", value: "15" },
            { label: "20 gtt/mL (macro)", value: "20" },
            { label: "60 gtt/mL (micro)", value: "60" },
          ],
        },
      ],
      calculate: (inputs) => {
        const volume = inputs.volume as number;
        const timeHours = inputs.timeHours as number;
        const dropFactor = parseFloat(inputs.dropFactor as string);
        if (!volume || !timeHours || !dropFactor) return null;

        const timeMinutes = timeHours * 60;
        const dropsPerMin = (volume * dropFactor) / timeMinutes;
        const mlPerHour = volume / timeHours;

        return {
          primary: {
            label: "Drip Rate",
            value: `${formatNumber(dropsPerMin, 1)} gtt/min`,
          },
          details: [
            { label: "Flow Rate", value: `${formatNumber(mlPerHour, 1)} mL/hr` },
            { label: "Total Volume", value: `${formatNumber(volume, 0)} mL` },
            { label: "Infusion Time", value: `${formatNumber(timeHours, 1)} hours (${formatNumber(timeMinutes, 0)} min)` },
            { label: "Drop Factor", value: `${formatNumber(dropFactor, 0)} gtt/mL` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["medication-dosage-calculator", "pediatric-dose-calculator"],
  faq: [
    {
      question: "What is a drop factor?",
      answer:
        "A drop factor is the number of drops per milliliter that an IV administration set delivers. Common macro drip sets are 10, 15, or 20 gtt/mL, while micro drip sets deliver 60 gtt/mL.",
    },
    {
      question: "How do I calculate IV drip rate?",
      answer:
        "IV drip rate (gtt/min) = (Volume in mL \u00D7 Drop factor) / (Time in minutes). For example, 1000 mL over 8 hours with a 15 gtt/mL set = (1000 \u00D7 15) / 480 = 31.25 gtt/min.",
    },
  ],
  formula:
    "Drip Rate (gtt/min) = (Volume mL \u00D7 Drop Factor) / (Time in minutes)",
};
