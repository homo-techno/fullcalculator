import type { CalculatorDefinition } from "./types";

function countSigFigs(s: string): number {
  s = s.trim().replace(/^-/, "");
  if (s.includes("e") || s.includes("E")) {
    const parts = s.split(/[eE]/);
    return countSigFigs(parts[0]);
  }
  s = s.replace(/^0+/, "");
  if (s === "" || s === ".") return 0;
  if (s.includes(".")) {
    return s.replace(".", "").replace(/^0+/, "").length || s.replace(".", "").length;
  }
  return s.replace(/0+$/, "").length || 1;
}

export const significantFiguresCalculator: CalculatorDefinition = {
  slug: "significant-figures-calculator",
  title: "Significant Figures Calculator",
  description: "Free significant figures calculator. Count significant figures, round numbers to a specific number of sig figs.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["significant figures calculator", "sig figs calculator", "significant digits", "round to sig figs"],
  variants: [
    {
      id: "count",
      name: "Count Sig Figs",
      fields: [
        { name: "num", label: "Number", type: "text" as "number", placeholder: "e.g. 0.00340" },
      ],
      calculate: (inputs) => {
        const s = String(inputs.num || "").trim();
        if (!s || isNaN(Number(s))) return null;
        const sf = countSigFigs(s);
        return {
          primary: { label: s, value: `${sf} significant figures` },
          details: [
            { label: "Number", value: s },
            { label: "Scientific notation", value: Number(s).toExponential(Math.max(sf - 1, 0)) },
          ],
        };
      },
    },
    {
      id: "round",
      name: "Round to Sig Figs",
      fields: [
        { name: "num", label: "Number", type: "number", placeholder: "e.g. 123456.789" },
        { name: "sf", label: "Significant Figures", type: "number", placeholder: "e.g. 3", min: 1, max: 15 },
      ],
      calculate: (inputs) => {
        const num = inputs.num as number, sf = inputs.sf as number;
        if (num === undefined || !sf) return null;
        const rounded = Number(num.toPrecision(sf));
        return {
          primary: { label: `Rounded to ${sf} sig figs`, value: String(rounded) },
          details: [
            { label: "Original", value: String(num) },
            { label: "Scientific notation", value: rounded.toExponential(sf - 1) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["rounding-calculator", "scientific-calculator", "percentage-error-calculator"],
  faq: [{ question: "What are significant figures?", answer: "Significant figures are the meaningful digits in a number. Rules: 1) Non-zero digits are always significant. 2) Zeros between non-zero digits are significant. 3) Leading zeros are not significant. 4) Trailing zeros after a decimal point are significant." }],
  formula: "Rules: non-zero always, captive zeros yes, leading zeros no, trailing zeros after decimal yes",
};
