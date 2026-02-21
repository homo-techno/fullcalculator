import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const countertopCalculator: CalculatorDefinition = {
  slug: "countertop-calculator",
  title: "Countertop Calculator",
  description:
    "Free countertop calculator. Estimate total square footage and material costs for kitchen or bathroom countertops.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["countertop", "granite", "quartz", "kitchen", "marble", "surface area"],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "length",
          label: "Counter Length (inches)",
          type: "number",
          placeholder: "e.g. 96",
        },
        {
          name: "depth",
          label: "Counter Depth (inches)",
          type: "number",
          placeholder: "e.g. 25",
        },
        {
          name: "sections",
          label: "Number of Sections",
          type: "number",
          placeholder: "e.g. 2",
        },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const depth = inputs.depth as number;
        const sections = (inputs.sections as number) || 1;
        if (!length || !depth) return null;

        const sectionSqIn = length * depth;
        const totalSqIn = sectionSqIn * sections;
        const totalSqFt = totalSqIn / 144;

        // Price estimates per sq ft
        const laminate = totalSqFt * 30;
        const granite = totalSqFt * 60;
        const quartz = totalSqFt * 75;
        const marble = totalSqFt * 100;

        return {
          primary: {
            label: "Total Countertop Area",
            value: formatNumber(totalSqFt, 2) + " sq ft",
          },
          details: [
            { label: "Per Section", value: formatNumber(sectionSqIn / 144, 2) + " sq ft" },
            { label: "Sections", value: String(sections) },
            { label: "Laminate (~$30/sq ft)", value: "$" + formatNumber(laminate, 0) },
            { label: "Granite (~$60/sq ft)", value: "$" + formatNumber(granite, 0) },
            { label: "Quartz (~$75/sq ft)", value: "$" + formatNumber(quartz, 0) },
            { label: "Marble (~$100/sq ft)", value: "$" + formatNumber(marble, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["backsplash-calculator", "square-footage-calculator"],
  faq: [
    {
      question: "What is standard countertop depth?",
      answer:
        "Standard kitchen countertop depth is 25 inches (including a 1.5-inch overhang from 24-inch base cabinets).",
    },
    {
      question: "How much do countertops cost per square foot?",
      answer:
        "Laminate: $20-40, Granite: $40-80, Quartz: $50-100, Marble: $75-150 per square foot installed.",
    },
  ],
  formula:
    "Total Sq Ft = (Length × Depth × Sections) ÷ 144. Cost = Sq Ft × Price per Sq Ft.",
};
