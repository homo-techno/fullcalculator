import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const miniatureScaleCalculator: CalculatorDefinition = {
  slug: "miniature-scale-calculator",
  title: "Miniature Scale Calculator",
  description: "Convert real dimensions to scale model dimensions.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["miniature scale","scale model calculator"],
  variants: [{
    id: "standard",
    name: "Miniature Scale",
    description: "Convert real dimensions to scale model dimensions.",
    fields: [
      { name: "realSize", label: "Real Size (in)", type: "number", min: 0.1, max: 100000, defaultValue: 72 },
      { name: "scaleRatio", label: "Scale Ratio (1:X)", type: "number", min: 1, max: 1000, defaultValue: 48 },
    ],
    calculate: (inputs) => {
      const real = inputs.realSize as number;
      const ratio = inputs.scaleRatio as number;
      if (!real || !ratio) return null;
      const model = Math.round(real / ratio * 1000) / 1000;
      const modelMm = Math.round(model * 25.4 * 100) / 100;
      const pct = Math.round(100 / ratio * 100) / 100;
      return {
        primary: { label: "Model Size", value: formatNumber(model) + " in" },
        details: [
          { label: "Model Size (mm)", value: formatNumber(modelMm) + " mm" },
          { label: "Scale Ratio", value: "1:" + formatNumber(ratio) },
          { label: "Scale Percentage", value: pct + "%" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What does 1:48 scale mean?", answer: "It means the model is 48 times smaller than real life." },
    { question: "What is O scale for models?", answer: "O scale is 1:48 commonly used for toy trains and dioramas." },
  ],
  formula: "Model Size = Real Size / Scale Ratio",
};
