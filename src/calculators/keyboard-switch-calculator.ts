import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const keyboardSwitchCalculator: CalculatorDefinition = {
  slug: "keyboard-switch-calculator",
  title: "Keyboard Switch Calculator",
  description: "Calculate switches and stabilizers for a custom keyboard.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["keyboard switch","custom keyboard calculator"],
  variants: [{
    id: "standard",
    name: "Keyboard Switch",
    description: "Calculate switches and stabilizers for a custom keyboard.",
    fields: [
      { name: "layout", label: "Layout Size", type: "select", options: [{ value: "61", label: "60% (61 keys)" }, { value: "68", label: "65% (68 keys)" }, { value: "75", label: "75% (75 keys)" }, { value: "87", label: "TKL (87 keys)" }, { value: "104", label: "Full (104 keys)" }], defaultValue: "87" },
      { name: "switchPrice", label: "Price Per Switch (cents)", type: "number", min: 1, max: 500, defaultValue: 50 },
      { name: "extraPct", label: "Extra Switches (%)", type: "number", min: 0, max: 50, defaultValue: 10 },
    ],
    calculate: (inputs) => {
      const keys = inputs.layout as number;
      const price = inputs.switchPrice as number;
      const extra = inputs.extraPct as number;
      if (!keys || !price) return null;
      const totalSwitches = Math.ceil(keys * (1 + extra / 100));
      const cost = Math.round(totalSwitches * price) / 100;
      const stabs = keys >= 100 ? 7 : keys >= 80 ? 5 : 4;
      return {
        primary: { label: "Switches Needed", value: formatNumber(totalSwitches) },
        details: [
          { label: "Base Keys", value: formatNumber(keys) },
          { label: "Switch Cost", value: "$" + formatNumber(cost) },
          { label: "Stabilizers Needed", value: formatNumber(stabs) },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How many extra switches should I order?", answer: "Order 10% extra for spares and replacements." },
    { question: "What are stabilizers for?", answer: "Stabilizers support wider keys like spacebar and shift." },
  ],
  formula: "Switches = Keys x (1 + Extra%)",
};
