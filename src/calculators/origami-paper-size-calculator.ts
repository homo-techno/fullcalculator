import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const origamiPaperSizeCalculator: CalculatorDefinition = {
  slug: "origami-paper-size-calculator",
  title: "Origami Paper Size Calculator",
  description: "Determine paper size needed for a desired origami model size.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["origami paper","paper size calculator"],
  variants: [{
    id: "standard",
    name: "Origami Paper Size",
    description: "Determine paper size needed for a desired origami model size.",
    fields: [
      { name: "modelSize", label: "Desired Model Size (in)", type: "number", min: 0.5, max: 48, defaultValue: 6 },
      { name: "complexity", label: "Model Complexity", type: "select", options: [{ value: "2.5", label: "Simple" }, { value: "3.5", label: "Moderate" }, { value: "5", label: "Complex" }, { value: "7", label: "Super Complex" }], defaultValue: "3.5" },
    ],
    calculate: (inputs) => {
      const model = inputs.modelSize as number;
      const ratio = inputs.complexity as number;
      if (!model || !ratio) return null;
      const paperSize = Math.round(model * ratio * 10) / 10;
      const paperCm = Math.round(paperSize * 2.54 * 10) / 10;
      const area = Math.round(paperSize * paperSize * 100) / 100;
      return {
        primary: { label: "Paper Size", value: formatNumber(paperSize) + " x " + formatNumber(paperSize) + " in" },
        details: [
          { label: "Paper Size (cm)", value: formatNumber(paperCm) + " x " + formatNumber(paperCm) + " cm" },
          { label: "Paper Area", value: formatNumber(area) + " sq in" },
          { label: "Model to Paper Ratio", value: "1:" + formatNumber(ratio) },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What size paper is standard for origami?", answer: "Standard origami paper is 6 x 6 inches or 15 x 15 cm." },
    { question: "Does thicker paper work for origami?", answer: "Thin paper is better for complex folds. Thick paper suits simple models." },
  ],
  formula: "Paper Size = Desired Model Size x Complexity Ratio",
};
