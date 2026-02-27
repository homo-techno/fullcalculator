import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const modelTrainScaleCalculator: CalculatorDefinition = {
  slug: "model-train-scale-calculator",
  title: "Model Railroad Scale Converter",
  description:
    "Free model railroad scale converter. Convert real-world dimensions to model scale dimensions for HO, N, O, G, Z, and other popular model train scales.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "model train scale converter",
    "HO scale calculator",
    "N scale dimensions",
    "model railroad calculator",
    "scale conversion model",
  ],
  variants: [
    {
      id: "real-to-model",
      name: "Real to Model Scale",
      description: "Convert real-world dimensions to model scale",
      fields: [
        {
          name: "realValue",
          label: "Real-World Dimension",
          type: "number",
          placeholder: "e.g. 50",
          min: 0.1,
          step: 0.1,
        },
        {
          name: "realUnit",
          label: "Real-World Unit",
          type: "select",
          options: [
            { label: "Feet", value: "feet" },
            { label: "Inches", value: "inches" },
            { label: "Meters", value: "meters" },
            { label: "Centimeters", value: "cm" },
          ],
          defaultValue: "feet",
        },
        {
          name: "scale",
          label: "Model Scale",
          type: "select",
          options: [
            { label: "G Scale (1:22.5)", value: "22.5" },
            { label: "O Scale (1:48)", value: "48" },
            { label: "S Scale (1:64)", value: "64" },
            { label: "HO Scale (1:87.1)", value: "87.1" },
            { label: "TT Scale (1:120)", value: "120" },
            { label: "N Scale (1:160)", value: "160" },
            { label: "Z Scale (1:220)", value: "220" },
          ],
          defaultValue: "87.1",
        },
      ],
      calculate: (inputs) => {
        const realValue = parseFloat(inputs.realValue as string);
        const realUnit = inputs.realUnit as string;
        const scale = parseFloat(inputs.scale as string);
        if (!realValue || !scale) return null;

        // Convert everything to inches first
        let realInches: number;
        if (realUnit === "feet") realInches = realValue * 12;
        else if (realUnit === "inches") realInches = realValue;
        else if (realUnit === "meters") realInches = realValue * 39.37;
        else realInches = realValue / 2.54;

        const modelInches = realInches / scale;
        const modelMm = modelInches * 25.4;
        const modelCm = modelMm / 10;
        const modelFraction = modelInches;

        // Convenient fraction approximation
        const wholePart = Math.floor(modelInches);
        const fracPart = modelInches - wholePart;
        const sixteenths = Math.round(fracPart * 16);

        const scaleNames: Record<string, string> = {
          "22.5": "G Scale", "48": "O Scale", "64": "S Scale",
          "87.1": "HO Scale", "120": "TT Scale", "160": "N Scale", "220": "Z Scale",
        };

        return {
          primary: {
            label: `${scaleNames[String(scale)] || "Scale"} Dimension`,
            value: formatNumber(modelInches, 3) + " inches",
          },
          details: [
            { label: "Millimeters", value: formatNumber(modelMm, 1) + " mm" },
            { label: "Centimeters", value: formatNumber(modelCm, 2) + " cm" },
            { label: "Approx. Fraction", value: wholePart + " " + formatNumber(sixteenths, 0) + "/16\"" },
            { label: "Scale Ratio", value: "1:" + formatNumber(scale, 1) },
            { label: "Real-World Size", value: formatNumber(realValue, 1) + " " + realUnit },
          ],
        };
      },
    },
    {
      id: "model-to-real",
      name: "Model to Real Scale",
      description: "Convert model dimensions to real-world size",
      fields: [
        {
          name: "modelValue",
          label: "Model Dimension",
          type: "number",
          placeholder: "e.g. 2.5",
          min: 0.01,
          step: 0.01,
        },
        {
          name: "modelUnit",
          label: "Model Unit",
          type: "select",
          options: [
            { label: "Inches", value: "inches" },
            { label: "Millimeters", value: "mm" },
            { label: "Centimeters", value: "cm" },
          ],
          defaultValue: "inches",
        },
        {
          name: "scale",
          label: "Model Scale",
          type: "select",
          options: [
            { label: "G Scale (1:22.5)", value: "22.5" },
            { label: "O Scale (1:48)", value: "48" },
            { label: "S Scale (1:64)", value: "64" },
            { label: "HO Scale (1:87.1)", value: "87.1" },
            { label: "TT Scale (1:120)", value: "120" },
            { label: "N Scale (1:160)", value: "160" },
            { label: "Z Scale (1:220)", value: "220" },
          ],
          defaultValue: "87.1",
        },
      ],
      calculate: (inputs) => {
        const modelValue = parseFloat(inputs.modelValue as string);
        const modelUnit = inputs.modelUnit as string;
        const scale = parseFloat(inputs.scale as string);
        if (!modelValue || !scale) return null;

        // Convert model dimension to inches
        let modelInches: number;
        if (modelUnit === "inches") modelInches = modelValue;
        else if (modelUnit === "mm") modelInches = modelValue / 25.4;
        else modelInches = modelValue / 2.54;

        const realInches = modelInches * scale;
        const realFeet = realInches / 12;
        const realMeters = realInches * 0.0254;
        const realCm = realInches * 2.54;

        const ftWhole = Math.floor(realFeet);
        const ftInches = (realFeet - ftWhole) * 12;

        return {
          primary: {
            label: "Real-World Size",
            value: formatNumber(ftWhole, 0) + "' " + formatNumber(ftInches, 1) + '"',
          },
          details: [
            { label: "Total Inches", value: formatNumber(realInches, 1) },
            { label: "Total Feet", value: formatNumber(realFeet, 2) },
            { label: "Meters", value: formatNumber(realMeters, 2) },
            { label: "Centimeters", value: formatNumber(realCm, 1) },
            { label: "Scale Ratio", value: "1:" + formatNumber(scale, 1) },
            { label: "Model Size", value: formatNumber(modelValue, 2) + " " + modelUnit },
          ],
        };
      },
    },
    {
      id: "speed",
      name: "Scale Speed Calculator",
      description: "Convert real speed to scale speed",
      fields: [
        {
          name: "realSpeed",
          label: "Real-World Speed (mph)",
          type: "number",
          placeholder: "e.g. 60",
          min: 1,
          max: 200,
        },
        {
          name: "scale",
          label: "Model Scale",
          type: "select",
          options: [
            { label: "G Scale (1:22.5)", value: "22.5" },
            { label: "O Scale (1:48)", value: "48" },
            { label: "HO Scale (1:87.1)", value: "87.1" },
            { label: "N Scale (1:160)", value: "160" },
            { label: "Z Scale (1:220)", value: "220" },
          ],
          defaultValue: "87.1",
        },
      ],
      calculate: (inputs) => {
        const realMph = parseFloat(inputs.realSpeed as string);
        const scale = parseFloat(inputs.scale as string);
        if (!realMph || !scale) return null;

        const scaleMph = realMph / scale;
        const scaleFtPerSec = (realMph * 5280) / (3600 * scale);
        const scaleInPerSec = scaleFtPerSec * 12;
        const realKmh = realMph * 1.60934;
        const scaleKmh = realKmh / scale;

        return {
          primary: {
            label: "Scale Speed",
            value: formatNumber(scaleMph, 2) + " mph",
          },
          details: [
            { label: "Scale Speed (in/sec)", value: formatNumber(scaleInPerSec, 1) },
            { label: "Scale Speed (ft/sec)", value: formatNumber(scaleFtPerSec, 2) },
            { label: "Real Speed", value: formatNumber(realMph, 0) + " mph (" + formatNumber(realKmh, 0) + " km/h)" },
            { label: "Scale Ratio", value: "1:" + formatNumber(scale, 1) },
          ],
          note: "To achieve realistic operation, model trains should travel at scale speed. A 60 mph prototype in HO scale moves at about 0.69 mph or 12 inches per second.",
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter", "speed-converter", "area-converter"],
  faq: [
    {
      question: "What is HO scale?",
      answer:
        "HO scale is the most popular model railroad scale at 1:87.1 ratio. One foot in real life equals approximately 0.138 inches (3.5mm) in HO scale. HO stands for 'Half O' as it is roughly half the size of O scale. Track gauge is 16.5mm.",
    },
    {
      question: "What is the difference between N scale and HO scale?",
      answer:
        "N scale (1:160) is roughly half the size of HO scale (1:87.1). N scale allows larger layouts in smaller spaces. HO has more available models and is easier to detail, while N scale is better for apartment-sized layouts and dramatic scenery.",
    },
  ],
  formula:
    "Model Size = Real Size / Scale Ratio | Real Size = Model Size × Scale Ratio | Scale Speed = Real Speed / Scale Ratio",
};
