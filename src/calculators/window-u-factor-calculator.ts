import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const windowUFactorCalculator: CalculatorDefinition = {
  slug: "window-u-factor-calculator",
  title: "Window U-Factor Calculator",
  description: "Calculate window U-factor for energy efficiency rating.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["window U-factor","window insulation","window R-value"],
  variants: [{
    id: "standard",
    name: "Window U-Factor",
    description: "Calculate window U-factor for energy efficiency rating.",
    fields: [
      { name: "panes", label: "Number of Panes", type: "select", options: [{ value: "1", label: "Single" }, { value: "2", label: "Double" }, { value: "3", label: "Triple" }], defaultValue: "2" },
      { name: "gasType", label: "Gas Fill", type: "select", options: [{ value: "air", label: "Air" }, { value: "argon", label: "Argon" }, { value: "krypton", label: "Krypton" }], defaultValue: "argon" },
      { name: "lowE", label: "Low-E Coating", type: "select", options: [{ value: "1", label: "Yes" }, { value: "0", label: "No" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
      const panes = parseInt(inputs.panes as string);
      const gas = inputs.gasType as string;
      const lowE = inputs.lowE as string;
      const baseU: Record<number, number> = { 1: 1.1, 2: 0.5, 3: 0.3 };
      let u = baseU[panes] || 0.5;
      if (gas === "argon") u -= 0.05;
      if (gas === "krypton") u -= 0.1;
      if (lowE === "1") u -= 0.08;
      u = Math.max(u, 0.15);
      const rValue = 1 / u;
      return {
        primary: { label: "U-Factor", value: formatNumber(Math.round(u * 100) / 100) },
        details: [
          { label: "R-Value", value: formatNumber(Math.round(rValue * 100) / 100) },
          { label: "Panes", value: formatNumber(panes) },
          { label: "Energy Star Qualified", value: u <= 0.3 ? "Yes" : "No" },
        ],
      };
  },
  }],
  relatedSlugs: ["insulation-calculator","energy-cost-calculator"],
  faq: [
    { question: "What is a good U-factor for windows?", answer: "A U-factor of 0.30 or lower is considered energy efficient." },
    { question: "What is the difference between U-factor and R-value?", answer: "U-factor measures heat transfer; R-value is its inverse measuring resistance." },
  ],
  formula: "U-Factor = Base U - Gas Adjustment - Low-E Adjustment",
};
