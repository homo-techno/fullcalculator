import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const modelScaleCalculator: CalculatorDefinition = {
  slug: "model-scale-calculator",
  title: "Model Scale Calculator",
  description: "Free online model scale calculator. Convert between real-world and scale dimensions for model trains, miniatures, dollhouses, and architectural models.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["model scale calculator", "scale converter", "model train scale calculator", "miniature scale calculator", "scale ratio calculator"],
  variants: [
    {
      id: "real-to-scale",
      name: "Real to Scale Size",
      description: "Convert real-world dimensions to scale model dimensions",
      fields: [
        { name: "scale", label: "Scale Ratio", type: "select", options: [
          { label: "1:12 (Dollhouse)", value: "12" },
          { label: "1:18 (Large diecast)", value: "18" },
          { label: "1:24 (Large model car)", value: "24" },
          { label: "1:32 (Slot car / S gauge)", value: "32" },
          { label: "1:43 (O gauge)", value: "43" },
          { label: "1:48 (O scale / Quarter inch)", value: "48" },
          { label: "1:64 (S scale / Hot Wheels)", value: "64" },
          { label: "1:72 (Aircraft model)", value: "72" },
          { label: "1:87 (HO scale)", value: "87" },
          { label: "1:100 (Architectural)", value: "100" },
          { label: "1:120 (TT scale)", value: "120" },
          { label: "1:148 (N scale UK)", value: "148" },
          { label: "1:160 (N scale)", value: "160" },
          { label: "1:220 (Z scale)", value: "220" },
          { label: "Custom", value: "0" },
        ], defaultValue: "87" },
        { name: "customScale", label: "Custom Scale (1:X)", type: "number", placeholder: "e.g. 87" },
        { name: "realLength", label: "Real Length", type: "number", placeholder: "e.g. 60" },
        { name: "realUnit", label: "Real Unit", type: "select", options: [
          { label: "Feet", value: "feet" },
          { label: "Inches", value: "inches" },
          { label: "Meters", value: "meters" },
          { label: "Centimeters", value: "cm" },
        ], defaultValue: "feet" },
      ],
      calculate: (inputs) => {
        const scaleVal = parseFloat(inputs.scale as string) || 0;
        const customScale = parseFloat(inputs.customScale as string) || 0;
        const realLength = parseFloat(inputs.realLength as string) || 0;
        const realUnit = inputs.realUnit as string;
        if (!realLength) return null;

        const scale = scaleVal > 0 ? scaleVal : customScale;
        if (!scale) return null;

        let realInches: number;
        switch (realUnit) {
          case "feet": realInches = realLength * 12; break;
          case "meters": realInches = realLength * 39.3701; break;
          case "cm": realInches = realLength * 0.393701; break;
          default: realInches = realLength;
        }

        const modelInches = realInches / scale;
        const modelMm = modelInches * 25.4;
        const modelCm = modelMm / 10;
        const modelFeet = modelInches / 12;

        return {
          primary: { label: "Model Size", value: `${formatNumber(modelInches, 2)} inches` },
          details: [
            { label: "Model size (mm)", value: formatNumber(modelMm, 1) },
            { label: "Model size (cm)", value: formatNumber(modelCm, 2) },
            { label: "Scale ratio", value: `1:${formatNumber(scale, 0)}` },
            { label: "Real size", value: `${formatNumber(realLength)} ${realUnit}` },
            { label: "Real size (inches)", value: formatNumber(realInches, 1) },
            { label: "Scale factor", value: `÷ ${formatNumber(scale, 0)}` },
          ],
        };
      },
    },
    {
      id: "scale-to-real",
      name: "Scale to Real Size",
      description: "Convert model dimensions back to real-world size",
      fields: [
        { name: "scale", label: "Scale Ratio", type: "select", options: [
          { label: "1:12 (Dollhouse)", value: "12" },
          { label: "1:24 (Model car)", value: "24" },
          { label: "1:48 (O scale)", value: "48" },
          { label: "1:64 (S scale)", value: "64" },
          { label: "1:87 (HO scale)", value: "87" },
          { label: "1:160 (N scale)", value: "160" },
          { label: "1:220 (Z scale)", value: "220" },
          { label: "Custom", value: "0" },
        ], defaultValue: "87" },
        { name: "customScale", label: "Custom Scale (1:X)", type: "number", placeholder: "e.g. 87" },
        { name: "modelSize", label: "Model Size (mm)", type: "number", placeholder: "e.g. 200" },
      ],
      calculate: (inputs) => {
        const scaleVal = parseFloat(inputs.scale as string) || 0;
        const customScale = parseFloat(inputs.customScale as string) || 0;
        const modelMm = parseFloat(inputs.modelSize as string) || 0;
        if (!modelMm) return null;

        const scale = scaleVal > 0 ? scaleVal : customScale;
        if (!scale) return null;

        const realMm = modelMm * scale;
        const realCm = realMm / 10;
        const realM = realMm / 1000;
        const realInches = realMm / 25.4;
        const realFeet = realInches / 12;

        return {
          primary: { label: "Real-World Size", value: `${formatNumber(realFeet, 1)} feet` },
          details: [
            { label: "Real size (meters)", value: formatNumber(realM, 2) },
            { label: "Real size (cm)", value: formatNumber(realCm, 1) },
            { label: "Real size (inches)", value: formatNumber(realInches, 1) },
            { label: "Model size", value: `${formatNumber(modelMm, 1)} mm` },
            { label: "Scale ratio", value: `1:${formatNumber(scale, 0)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ratio-calculator", "unit-converter"],
  faq: [
    { question: "What are common model scales?", answer: "Popular scales include: 1:87 (HO trains), 1:160 (N scale trains), 1:48 (O scale), 1:12 (dollhouses), 1:24 (model cars), 1:72 (aircraft), and 1:35 (military models). The ratio means the model is that many times smaller than reality." },
    { question: "How do I calculate model scale?", answer: "Divide the real measurement by the scale number. For 1:87 (HO scale), a 60-foot building becomes 60 × 12 / 87 = 8.28 inches tall in model form." },
    { question: "What scale is HO?", answer: "HO scale is 1:87, the most popular model railroad scale. The name comes from 'Half O' since it is roughly half the size of O scale (1:48). In HO, 1 foot = 3.5mm." },
  ],
  formula: "Model Size = Real Size / Scale Factor",
};
