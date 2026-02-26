import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sigFigsCalc: CalculatorDefinition = {
  slug: "sig-figs-calculator",
  title: "Significant Figures Calculator",
  description:
    "Free online significant figures calculator. Count significant figures in a number and round numbers to a specific number of significant figures.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "significant figures",
    "sig figs calculator",
    "significant digits",
    "round sig figs",
    "significant figures counter",
  ],
  variants: [
    {
      id: "count-sig-figs",
      name: "Count Significant Figures",
      description: "Count the significant figures in a number",
      fields: [
        {
          name: "number",
          label: "Number (enter as text)",
          type: "number",
          placeholder: "e.g. 0.00450",
        },
      ],
      calculate: (inputs) => {
        const raw = String(inputs.number).trim();
        if (!raw || raw === "undefined") return null;

        const num = parseFloat(raw);
        if (isNaN(num)) return null;

        // Count sig figs from string representation
        let str = raw.replace(/^-/, "");

        // Remove leading zeros
        let sigFigStr = str;
        let sigFigs = 0;

        if (str.includes(".")) {
          // Has decimal point
          sigFigStr = str.replace(/^0+/, "");
          if (sigFigStr.startsWith(".")) sigFigStr = sigFigStr.slice(1);
          // Count all digits (trailing zeros after decimal are significant)
          const noLeadingZeros = str.replace(/^0*\.?0*/, "");
          sigFigs = noLeadingZeros.replace(/\./g, "").length;
          if (sigFigs === 0) sigFigs = 1;
        } else {
          // No decimal point
          // Remove leading zeros
          const noLeading = str.replace(/^0+/, "");
          // Remove trailing zeros (ambiguous, but typically not significant without decimal)
          const noTrailing = noLeading.replace(/0+$/, "");
          sigFigs = noTrailing.length;
          if (sigFigs === 0) sigFigs = 1;
        }

        return {
          primary: {
            label: "Significant Figures",
            value: formatNumber(sigFigs),
          },
          details: [
            { label: "Number entered", value: raw },
            { label: "Decimal value", value: formatNumber(num, 10) },
            { label: "Significant figures count", value: formatNumber(sigFigs) },
          ],
        };
      },
    },
    {
      id: "round-sig-figs",
      name: "Round to Significant Figures",
      description: "Round a number to a specific number of significant figures",
      fields: [
        {
          name: "number",
          label: "Number",
          type: "number",
          placeholder: "e.g. 123456.789",
        },
        {
          name: "sigFigs",
          label: "Significant Figures",
          type: "number",
          placeholder: "e.g. 3",
          min: 1,
          max: 15,
        },
      ],
      calculate: (inputs) => {
        const num = parseFloat(inputs.number as string);
        const sf = parseFloat(inputs.sigFigs as string);
        if (isNaN(num) || isNaN(sf) || sf < 1) return null;

        const sigFigs = Math.round(sf);
        const rounded = parseFloat(num.toPrecision(sigFigs));

        return {
          primary: {
            label: "Rounded Result",
            value: num.toPrecision(sigFigs),
          },
          details: [
            { label: "Original number", value: formatNumber(num, 10) },
            { label: "Rounded to sig figs", value: formatNumber(sigFigs) },
            { label: "Numeric value", value: formatNumber(rounded, 10) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["scientific-notation-calculator", "percentage-calculator"],
  faq: [
    {
      question: "What are significant figures?",
      answer:
        "Significant figures (sig figs) are the meaningful digits in a number that contribute to its precision. They include all non-zero digits, zeros between non-zero digits, and trailing zeros after a decimal point.",
    },
    {
      question: "Are trailing zeros significant?",
      answer:
        "Trailing zeros after a decimal point are significant (e.g., 2.50 has 3 sig figs). Trailing zeros without a decimal point are ambiguous (e.g., 2500 could have 2, 3, or 4 sig figs).",
    },
  ],
  formula: "Rules: Non-zero digits are always significant. Zeros between non-zero digits are significant. Leading zeros are not significant. Trailing zeros after a decimal are significant.",
};
