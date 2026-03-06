import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const modelRailroadScaleCalculator: CalculatorDefinition = {
  slug: "model-railroad-scale-calculator",
  title: "Model Railroad Scale Calculator",
  description: "Convert real-world dimensions to model railroad scale dimensions for popular scales including HO, N, O, and G.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["model railroad scale","model train scale","HO scale converter","miniature scale"],
  variants: [{
    id: "standard",
    name: "Model Railroad Scale",
    description: "Convert real-world dimensions to model railroad scale dimensions for popular scales including HO, N, O, and G.",
    fields: [
      { name: "realLength", label: "Real-World Length (feet)", type: "number", min: 0.1, max: 5000, defaultValue: 50 },
      { name: "realWidth", label: "Real-World Width (feet)", type: "number", min: 0.1, max: 500, defaultValue: 12 },
      { name: "realHeight", label: "Real-World Height (feet)", type: "number", min: 0.1, max: 500, defaultValue: 15 },
      { name: "scale", label: "Model Scale", type: "select", options: [{ value: "220", label: "Z Scale (1:220)" }, { value: "160", label: "N Scale (1:160)" }, { value: "87", label: "HO Scale (1:87)" }, { value: "48", label: "O Scale (1:48)" }, { value: "22.5", label: "G Scale (1:22.5)" }], defaultValue: "87" },
    ],
    calculate: (inputs) => {
    const realL = inputs.realLength as number;
    const realW = inputs.realWidth as number;
    const realH = inputs.realHeight as number;
    const scale = parseFloat(inputs.scale as string);
    const modelL = realL * 12 / scale;
    const modelW = realW * 12 / scale;
    const modelH = realH * 12 / scale;
    const modelLmm = modelL * 25.4;
    const modelWmm = modelW * 25.4;
    const modelHmm = modelH * 25.4;
    return {
      primary: { label: "Model Length", value: formatNumber(Math.round(modelL * 100) / 100) + " inches" },
      details: [
        { label: "Model Width", value: formatNumber(Math.round(modelW * 100) / 100) + " inches" },
        { label: "Model Height", value: formatNumber(Math.round(modelH * 100) / 100) + " inches" },
        { label: "Length (mm)", value: formatNumber(Math.round(modelLmm * 10) / 10) + " mm" },
        { label: "Width (mm)", value: formatNumber(Math.round(modelWmm * 10) / 10) + " mm" },
        { label: "Scale Ratio", value: "1:" + formatNumber(scale) }
      ]
    };
  },
  }],
  relatedSlugs: ["miniature-painting-cost-calculator","wood-turning-blank-size-calculator"],
  faq: [
    { question: "What is the most popular model railroad scale?", answer: "HO scale (1:87) is the most popular worldwide. It offers a good balance between detail and space requirements." },
    { question: "How do I convert real dimensions to scale?", answer: "Divide the real dimension by the scale ratio. For HO scale, divide by 87. A 50-foot building becomes about 6.9 inches in HO." },
    { question: "How much space do I need for a model railroad?", answer: "A basic HO layout needs at least a 4 by 8 foot table. N scale can fit in smaller spaces. O and G scale require significantly more room." },
  ],
  formula: "Model Dimension (inches) = Real Dimension (feet) x 12 / Scale Ratio; Model Dimension (mm) = Model Dimension (inches) x 25.4",
};
