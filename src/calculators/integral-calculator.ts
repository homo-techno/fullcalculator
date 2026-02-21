import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const integralCalculator: CalculatorDefinition = {
  slug: "integral-calculator",
  title: "Integral Calculator",
  description: "Free integral calculator. Calculate integrals using power rule, trig integrals, and definite integrals with step-by-step solutions.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["integral calculator", "antiderivative calculator", "integration calculator", "definite integral", "indefinite integral"],
  variants: [
    {
      id: "power-rule",
      name: "Power Rule (∫ xⁿ dx)",
      description: "Integrate xⁿ using the power rule",
      fields: [
        { name: "coefficient", label: "Coefficient (a)", type: "number", placeholder: "e.g. 3" },
        { name: "exponent", label: "Exponent (n)", type: "number", placeholder: "e.g. 2" },
      ],
      calculate: (inputs) => {
        const a = inputs.coefficient as number;
        const n = inputs.exponent as number;
        if (a === undefined || n === undefined) return null;

        if (n === -1) {
          return {
            primary: { label: `∫ ${a}/x dx`, value: `${a}ln|x| + C` },
            details: [
              { label: "Rule", value: "∫ x⁻¹ dx = ln|x| + C" },
              { label: "Note", value: "Special case when n = -1" },
            ],
          };
        }

        const newExp = n + 1;
        const newCoeff = a / newExp;

        let resultStr: string;
        if (newExp === 1) resultStr = `${formatNumber(newCoeff, 6)}x + C`;
        else resultStr = `${formatNumber(newCoeff, 6)}x^${formatNumber(newExp)} + C`;

        return {
          primary: { label: `∫ ${a}x^${n} dx`, value: resultStr },
          details: [
            { label: "Rule", value: "∫ axⁿ dx = a·x^(n+1)/(n+1) + C" },
            { label: "New exponent", value: `${n} + 1 = ${formatNumber(newExp)}` },
            { label: "New coefficient", value: `${a} / ${formatNumber(newExp)} = ${formatNumber(newCoeff, 6)}` },
          ],
        };
      },
    },
    {
      id: "definite",
      name: "Definite Integral (∫ₐᵇ xⁿ dx)",
      description: "Evaluate a definite integral of xⁿ between bounds",
      fields: [
        { name: "coefficient", label: "Coefficient (a)", type: "number", placeholder: "e.g. 1" },
        { name: "exponent", label: "Exponent (n)", type: "number", placeholder: "e.g. 2" },
        { name: "lower", label: "Lower Bound (a)", type: "number", placeholder: "e.g. 0" },
        { name: "upper", label: "Upper Bound (b)", type: "number", placeholder: "e.g. 3" },
      ],
      calculate: (inputs) => {
        const a = inputs.coefficient as number;
        const n = inputs.exponent as number;
        const lo = inputs.lower as number;
        const hi = inputs.upper as number;
        if (a === undefined || n === undefined || lo === undefined || hi === undefined) return null;

        let result: number;
        if (n === -1) {
          if (lo <= 0 && hi >= 0) return null;
          result = a * (Math.log(Math.abs(hi)) - Math.log(Math.abs(lo)));
        } else {
          const newExp = n + 1;
          const antideriv = (x: number) => a * Math.pow(x, newExp) / newExp;
          result = antideriv(hi) - antideriv(lo);
        }

        return {
          primary: { label: `∫ from ${lo} to ${hi}`, value: formatNumber(result, 8) },
          details: [
            { label: "Function", value: `${a}x^${n}` },
            { label: "F(upper) - F(lower)", value: formatNumber(result, 8) },
            { label: "Fundamental Theorem", value: "∫ₐᵇ f(x)dx = F(b) - F(a)" },
          ],
        };
      },
    },
    {
      id: "trig-integral",
      name: "Trigonometric Integral",
      description: "Integrate common trigonometric functions",
      fields: [
        { name: "func", label: "Function", type: "select", options: [
          { label: "sin(x)", value: "sin" },
          { label: "cos(x)", value: "cos" },
          { label: "sec²(x)", value: "sec2" },
          { label: "csc²(x)", value: "csc2" },
          { label: "sec(x)tan(x)", value: "sectan" },
          { label: "csc(x)cot(x)", value: "csccot" },
        ], defaultValue: "sin" },
        { name: "coefficient", label: "Coefficient", type: "number", placeholder: "e.g. 1", defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const func = inputs.func as string;
        const c = (inputs.coefficient as number) || 1;

        const integrals: Record<string, string> = {
          sin: `${-c}cos(x) + C`,
          cos: `${c}sin(x) + C`,
          sec2: `${c}tan(x) + C`,
          csc2: `${-c}cot(x) + C`,
          sectan: `${c}sec(x) + C`,
          csccot: `${-c}csc(x) + C`,
        };

        const rules: Record<string, string> = {
          sin: "∫ sin(x)dx = -cos(x) + C",
          cos: "∫ cos(x)dx = sin(x) + C",
          sec2: "∫ sec²(x)dx = tan(x) + C",
          csc2: "∫ csc²(x)dx = -cot(x) + C",
          sectan: "∫ sec(x)tan(x)dx = sec(x) + C",
          csccot: "∫ csc(x)cot(x)dx = -csc(x) + C",
        };

        return {
          primary: { label: "Integral", value: integrals[func] || "0" },
          details: [
            { label: "Rule", value: rules[func] || "" },
            { label: "Don't forget", value: "Always add the constant of integration C" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["derivative-calculator", "limit-calculator", "taylor-series-calculator"],
  faq: [
    { question: "What is an integral?", answer: "An integral is the reverse of a derivative. It finds the area under a curve. The indefinite integral ∫f(x)dx = F(x) + C where F'(x) = f(x). The definite integral ∫ₐᵇf(x)dx gives the exact area between x=a and x=b." },
    { question: "What is the difference between definite and indefinite integrals?", answer: "An indefinite integral gives a family of functions (antiderivative + C). A definite integral evaluates the antiderivative at two bounds and gives a numerical value representing the area under the curve." },
  ],
  formula: "∫ xⁿdx = x^(n+1)/(n+1) + C (n≠-1) | ∫ x⁻¹dx = ln|x| + C | ∫ₐᵇ f(x)dx = F(b) - F(a)",
};
