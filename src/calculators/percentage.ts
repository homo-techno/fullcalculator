import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const percentageCalculator: CalculatorDefinition = {
  slug: "percentage-calculator",
  title: "Percentage Calculator",
  description:
    "Free online percentage calculator. Find percentages, percentage change, percentage difference, and more. Fast, accurate, no signup required.",
  category: "Math",
  categorySlug: "math",
  icon: "%",
  keywords: [
    "percentage calculator",
    "percent calculator",
    "what is percent of",
    "percentage change",
    "percentage difference",
  ],
  variants: [
    {
      id: "basic",
      name: "What is X% of Y?",
      description: "Calculate a percentage of a number",
      fields: [
        {
          name: "percentage",
          label: "Percentage",
          type: "number",
          placeholder: "e.g. 25",
          suffix: "%",
        },
        {
          name: "value",
          label: "of",
          type: "number",
          placeholder: "e.g. 200",
        },
      ],
      calculate: (inputs) => {
        const p = inputs.percentage as number;
        const v = inputs.value as number;
        if (!p && p !== 0) return null;
        if (!v && v !== 0) return null;
        const result = (p / 100) * v;
        return {
          primary: { label: "Result", value: formatNumber(result) },
          details: [
            { label: "Calculation", value: `${p}% of ${formatNumber(v)} = ${formatNumber(result)}` },
          ],
        };
      },
    },
    {
      id: "reverse",
      name: "X is what % of Y?",
      description: "Find what percentage one number is of another",
      fields: [
        {
          name: "part",
          label: "Value",
          type: "number",
          placeholder: "e.g. 50",
        },
        {
          name: "whole",
          label: "is what % of",
          type: "number",
          placeholder: "e.g. 200",
        },
      ],
      calculate: (inputs) => {
        const part = inputs.part as number;
        const whole = inputs.whole as number;
        if ((!part && part !== 0) || !whole) return null;
        const result = (part / whole) * 100;
        return {
          primary: { label: "Result", value: formatNumber(result), suffix: "%" },
          details: [
            { label: "Calculation", value: `${formatNumber(part)} is ${formatNumber(result)}% of ${formatNumber(whole)}` },
          ],
        };
      },
    },
    {
      id: "change",
      name: "Percentage Change",
      description: "Calculate the percentage increase or decrease between two values",
      fields: [
        {
          name: "from",
          label: "From",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          name: "to",
          label: "To",
          type: "number",
          placeholder: "e.g. 150",
        },
      ],
      calculate: (inputs) => {
        const from = inputs.from as number;
        const to = inputs.to as number;
        if (!from) return null;
        if (!to && to !== 0) return null;
        const change = ((to - from) / Math.abs(from)) * 100;
        const direction = change >= 0 ? "increase" : "decrease";
        return {
          primary: {
            label: `Percentage ${direction}`,
            value: formatNumber(Math.abs(change)),
            suffix: "%",
          },
          details: [
            { label: "Direction", value: change >= 0 ? "Increase" : "Decrease" },
            { label: "Difference", value: formatNumber(to - from) },
          ],
        };
      },
    },
    {
      id: "difference",
      name: "Percentage Difference",
      description: "Calculate the percentage difference between two values",
      fields: [
        {
          name: "value1",
          label: "Value 1",
          type: "number",
          placeholder: "e.g. 30",
        },
        {
          name: "value2",
          label: "Value 2",
          type: "number",
          placeholder: "e.g. 50",
        },
      ],
      calculate: (inputs) => {
        const v1 = inputs.value1 as number;
        const v2 = inputs.value2 as number;
        if ((!v1 && v1 !== 0) || (!v2 && v2 !== 0)) return null;
        const avg = (Math.abs(v1) + Math.abs(v2)) / 2;
        if (avg === 0) return null;
        const diff = (Math.abs(v1 - v2) / avg) * 100;
        return {
          primary: { label: "Difference", value: formatNumber(diff), suffix: "%" },
          details: [
            { label: "Absolute difference", value: formatNumber(Math.abs(v1 - v2)) },
            { label: "Average", value: formatNumber(avg) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["tip-calculator", "compound-interest-calculator"],
  faq: [
    {
      question: "What is a percentage?",
      answer:
        "A percentage is a number or ratio expressed as a fraction of 100. It is denoted using the percent sign (%). For example, 45% is equal to 45/100, or 0.45.",
    },
    {
      question: "How do I calculate what X% of Y is?",
      answer:
        "To calculate X% of Y, divide X by 100 and multiply by Y. For example, 25% of 200 = (25/100) x 200 = 50.",
    },
    {
      question: "How do I calculate percentage change?",
      answer:
        "Percentage change = ((New Value - Old Value) / |Old Value|) x 100. A positive result means an increase, a negative result means a decrease.",
    },
    {
      question: "What is the difference between percentage change and percentage difference?",
      answer:
        "Percentage change measures how much a value increased or decreased from an original value. Percentage difference measures the relative difference between any two values using their average as the baseline.",
    },
  ],
  formula: "Percentage = (Part / Whole) x 100",
};
