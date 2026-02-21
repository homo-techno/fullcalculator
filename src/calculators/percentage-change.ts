import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const percentageChangeCalculator: CalculatorDefinition = {
  slug: "percentage-change-calculator",
  title: "Percentage Change Calculator",
  description: "Free percentage change calculator. Calculate percent increase, decrease, and difference between two values.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["percentage change calculator", "percent increase calculator", "percent decrease", "percentage difference", "percent change formula"],
  variants: [
    {
      id: "change",
      name: "Percentage Change",
      description: "Calculate the percentage increase or decrease from old to new value",
      fields: [
        { name: "oldValue", label: "Old Value", type: "number", placeholder: "e.g. 200" },
        { name: "newValue", label: "New Value", type: "number", placeholder: "e.g. 250" },
      ],
      calculate: (inputs) => {
        const old_ = inputs.oldValue as number;
        const new_ = inputs.newValue as number;
        if (!old_ || new_ === undefined) return null;
        const change = new_ - old_;
        const pctChange = (change / Math.abs(old_)) * 100;
        const direction = change >= 0 ? "Increase" : "Decrease";
        return {
          primary: { label: `% ${direction}`, value: `${formatNumber(Math.abs(pctChange), 2)}%` },
          details: [
            { label: "Change direction", value: direction },
            { label: "Absolute change", value: formatNumber(change) },
            { label: "Old value", value: formatNumber(old_) },
            { label: "New value", value: formatNumber(new_) },
            { label: "Multiplier", value: `${formatNumber(new_ / old_, 4)}×` },
          ],
        };
      },
    },
    {
      id: "apply",
      name: "Apply Percentage Change",
      description: "Increase or decrease a number by a percentage",
      fields: [
        { name: "value", label: "Starting Value", type: "number", placeholder: "e.g. 200" },
        { name: "percent", label: "Percentage", type: "number", placeholder: "e.g. 25", suffix: "%" },
        { name: "direction", label: "Direction", type: "select", options: [
          { label: "Increase (+)", value: "increase" }, { label: "Decrease (-)", value: "decrease" },
        ], defaultValue: "increase" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        const pct = inputs.percent as number;
        const dir = inputs.direction as string;
        if (!value || pct === undefined) return null;
        const change = value * (pct / 100);
        const result = dir === "decrease" ? value - change : value + change;
        return {
          primary: { label: "Result", value: formatNumber(result, 4) },
          details: [
            { label: "Original", value: formatNumber(value) },
            { label: "Change amount", value: `${dir === "decrease" ? "-" : "+"}${formatNumber(change)}` },
            { label: "Percentage", value: `${pct}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "discount-calculator", "margin-calculator"],
  faq: [
    { question: "How do I calculate percentage change?", answer: "% Change = ((New - Old) / |Old|) × 100. From 200 to 250: (250-200)/200 × 100 = 25% increase. From 200 to 150: (150-200)/200 × 100 = -25% decrease." },
  ],
  formula: "% Change = ((New - Old) / |Old|) × 100",
};
