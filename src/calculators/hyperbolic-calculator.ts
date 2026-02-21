import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hyperbolicCalculator: CalculatorDefinition = {
  slug: "hyperbolic-calculator",
  title: "Hyperbolic Function Calculator",
  description: "Free hyperbolic function calculator. Calculate sinh, cosh, tanh, and their inverses with exponential form and identities shown.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["hyperbolic calculator", "sinh cosh tanh", "hyperbolic sine", "hyperbolic cosine", "hyperbolic functions"],
  variants: [
    {
      id: "evaluate",
      name: "Evaluate Hyperbolic Functions",
      description: "Calculate all hyperbolic functions for a given value",
      fields: [
        { name: "x", label: "Input value (x)", type: "number", placeholder: "e.g. 1", step: 0.1 },
      ],
      calculate: (inputs) => {
        const x = inputs.x as number;
        if (x === undefined) return null;

        const sinhVal = Math.sinh(x);
        const coshVal = Math.cosh(x);
        const tanhVal = Math.tanh(x);
        const cschVal = sinhVal !== 0 ? 1 / sinhVal : NaN;
        const sechVal = 1 / coshVal;
        const cothVal = tanhVal !== 0 ? 1 / tanhVal : NaN;

        return {
          primary: { label: `sinh(${x})`, value: formatNumber(sinhVal, 10) },
          details: [
            { label: "sinh(x)", value: formatNumber(sinhVal, 10) },
            { label: "cosh(x)", value: formatNumber(coshVal, 10) },
            { label: "tanh(x)", value: formatNumber(tanhVal, 10) },
            { label: "csch(x)", value: isNaN(cschVal) ? "undefined" : formatNumber(cschVal, 10) },
            { label: "sech(x)", value: formatNumber(sechVal, 10) },
            { label: "coth(x)", value: isNaN(cothVal) ? "undefined" : formatNumber(cothVal, 10) },
            { label: "cosh² - sinh²", value: formatNumber(coshVal * coshVal - sinhVal * sinhVal, 10) },
            { label: "eˣ", value: formatNumber(Math.exp(x), 10) },
            { label: "e⁻ˣ", value: formatNumber(Math.exp(-x), 10) },
          ],
        };
      },
    },
    {
      id: "inverse-hyp",
      name: "Inverse Hyperbolic Functions",
      description: "Calculate arcsinh, arccosh, arctanh",
      fields: [
        { name: "func", label: "Function", type: "select", options: [
          { label: "arcsinh (sinh⁻¹)", value: "asinh" },
          { label: "arccosh (cosh⁻¹)", value: "acosh" },
          { label: "arctanh (tanh⁻¹)", value: "atanh" },
        ], defaultValue: "asinh" },
        { name: "x", label: "Input value (x)", type: "number", placeholder: "e.g. 1", step: 0.1 },
      ],
      calculate: (inputs) => {
        const func = inputs.func as string;
        const x = inputs.x as number;
        if (x === undefined) return null;

        let result: number;
        let domain: string;
        let logForm: string;

        switch (func) {
          case "asinh":
            result = Math.asinh(x);
            domain = "All real numbers";
            logForm = `ln(${x} + √(${x}² + 1)) = ln(${formatNumber(x + Math.sqrt(x * x + 1), 6)})`;
            break;
          case "acosh":
            if (x < 1) return null;
            result = Math.acosh(x);
            domain = "x ≥ 1";
            logForm = `ln(${x} + √(${x}² - 1)) = ln(${formatNumber(x + Math.sqrt(x * x - 1), 6)})`;
            break;
          case "atanh":
            if (Math.abs(x) >= 1) return null;
            result = Math.atanh(x);
            domain = "-1 < x < 1";
            logForm = `½ ln((1+${x})/(1-${x})) = ½ ln(${formatNumber((1 + x) / (1 - x), 6)})`;
            break;
          default:
            return null;
        }

        const funcNames: Record<string, string> = { asinh: "arcsinh", acosh: "arccosh", atanh: "arctanh" };

        return {
          primary: { label: `${funcNames[func]}(${x})`, value: formatNumber(result, 10) },
          details: [
            { label: "Result", value: formatNumber(result, 10) },
            { label: "Domain", value: domain },
            { label: "Logarithmic form", value: logForm },
            { label: "Verification", value: formatNumber(func === "asinh" ? Math.sinh(result) : func === "acosh" ? Math.cosh(result) : Math.tanh(result), 10) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["trig-calculator", "inverse-trig-calculator", "exponential-growth-calculator"],
  faq: [
    { question: "What are hyperbolic functions?", answer: "Hyperbolic functions are analogs of trig functions defined using exponentials: sinh(x) = (eˣ - e⁻ˣ)/2, cosh(x) = (eˣ + e⁻ˣ)/2, tanh(x) = sinh(x)/cosh(x). They describe the shape of hanging cables (catenaries) and appear in relativity and engineering." },
    { question: "How are hyperbolic functions related to exponentials?", answer: "sinh(x) = (eˣ - e⁻ˣ)/2 and cosh(x) = (eˣ + e⁻ˣ)/2. The key identity is cosh²(x) - sinh²(x) = 1 (compared to sin²+cos² = 1 for trig). Inverse hyperbolics can be expressed as logarithms: arcsinh(x) = ln(x + √(x²+1))." },
  ],
  formula: "sinh(x) = (eˣ-e⁻ˣ)/2 | cosh(x) = (eˣ+e⁻ˣ)/2 | cosh²-sinh² = 1 | arcsinh(x) = ln(x+√(x²+1))",
};
