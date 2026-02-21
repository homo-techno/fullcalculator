import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const irrigationCalculator: CalculatorDefinition = {
  slug: "irrigation-calculator",
  title: "Irrigation Calculator",
  description:
    "Free irrigation calculator. Estimate sprinkler runtime based on lawn area, water needs, and flow rate.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["irrigation", "sprinkler", "watering", "lawn", "GPM", "runtime"],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "area",
          label: "Lawn Area (sq ft)",
          type: "number",
          placeholder: "e.g. 5000",
        },
        {
          name: "inchesPerWeek",
          label: "Inches of Water per Week",
          type: "number",
          placeholder: "e.g. 1",
        },
        {
          name: "flowRate",
          label: "Sprinkler Flow Rate (GPM)",
          type: "number",
          placeholder: "e.g. 3",
        },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const inchesPerWeek = inputs.inchesPerWeek as number;
        const flowRate = inputs.flowRate as number;
        if (!area || !inchesPerWeek || !flowRate) return null;

        // 1 inch of water over 1 sq ft = 0.623 gallons
        const gallonsNeeded = area * inchesPerWeek * 0.623;
        const runtimeMinutes = gallonsNeeded / flowRate;
        const runtimeHours = runtimeMinutes / 60;

        // Suggest splitting into sessions
        const sessions = Math.ceil(runtimeMinutes / 30); // 30 min max per session
        const minutesPerSession = runtimeMinutes / sessions;

        return {
          primary: {
            label: "Total Runtime per Week",
            value: formatNumber(runtimeMinutes, 0) + " minutes",
          },
          details: [
            { label: "Gallons Needed per Week", value: formatNumber(gallonsNeeded, 0) },
            { label: "Runtime in Hours", value: formatNumber(runtimeHours, 1) },
            { label: "Suggested Sessions", value: String(sessions) },
            { label: "Minutes per Session", value: formatNumber(minutesPerSession, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["lawn-calculator", "water-intake-calculator"],
  faq: [
    {
      question: "How much water does a lawn need per week?",
      answer:
        "Most lawns need about 1 to 1.5 inches of water per week, including rainfall.",
    },
    {
      question: "What is a typical sprinkler flow rate?",
      answer:
        "Residential sprinklers typically deliver 1-5 GPM (gallons per minute) depending on the type and water pressure.",
    },
  ],
  formula:
    "Gallons = Area × Inches × 0.623. Runtime (min) = Gallons ÷ Flow Rate (GPM).",
};
