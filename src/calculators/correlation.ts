import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const correlationCalculator: CalculatorDefinition = {
  slug: "correlation-calculator",
  title: "Correlation Calculator",
  description:
    "Free Pearson correlation coefficient calculator. Calculate the linear correlation between two data sets.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "correlation calculator",
    "Pearson r",
    "correlation coefficient",
    "linear relationship",
    "statistics",
  ],
  variants: [
    {
      id: "calculate",
      name: "Calculate Pearson r",
      fields: [
        {
          name: "xvals",
          label: "X values (comma-separated)",
          type: "text" as "number",
          placeholder: "e.g. 1, 2, 3, 4, 5",
        },
        {
          name: "yvals",
          label: "Y values (comma-separated)",
          type: "text" as "number",
          placeholder: "e.g. 2, 4, 5, 4, 5",
        },
      ],
      calculate: (inputs) => {
        const xs = (inputs.xvals as string || "")
          .split(",")
          .map((s) => parseFloat(s.trim()))
          .filter((n) => !isNaN(n));
        const ys = (inputs.yvals as string || "")
          .split(",")
          .map((s) => parseFloat(s.trim()))
          .filter((n) => !isNaN(n));
        if (xs.length < 2 || ys.length < 2 || xs.length !== ys.length)
          return null;

        const n = xs.length;
        const sumX = xs.reduce((a, b) => a + b, 0);
        const sumY = ys.reduce((a, b) => a + b, 0);
        const sumXY = xs.reduce((acc, x, i) => acc + x * ys[i], 0);
        const sumX2 = xs.reduce((acc, x) => acc + x * x, 0);
        const sumY2 = ys.reduce((acc, y) => acc + y * y, 0);

        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt(
          (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
        );
        if (denominator === 0) return null;

        const r = numerator / denominator;
        const r2 = r * r;

        let strength = "No correlation";
        const absR = Math.abs(r);
        if (absR >= 0.9) strength = "Very strong";
        else if (absR >= 0.7) strength = "Strong";
        else if (absR >= 0.5) strength = "Moderate";
        else if (absR >= 0.3) strength = "Weak";
        else if (absR > 0) strength = "Very weak";

        return {
          primary: { label: "Pearson r", value: formatNumber(r, 6) },
          details: [
            { label: "R²", value: formatNumber(r2, 6) },
            { label: "Strength", value: strength },
            { label: "Data points", value: String(n) },
            { label: "Mean X", value: formatNumber(sumX / n, 4) },
            { label: "Mean Y", value: formatNumber(sumY / n, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "regression-calculator",
    "covariance-calculator",
    "variance-calculator",
  ],
  faq: [
    {
      question: "What is Pearson's correlation coefficient?",
      answer:
        "Pearson's r measures the strength and direction of the linear relationship between two variables. It ranges from -1 (perfect negative) to +1 (perfect positive), with 0 meaning no linear correlation.",
    },
  ],
  formula: "r = [nΣxy - (Σx)(Σy)] / √{[nΣx² - (Σx)²][nΣy² - (Σy)²]}",
};
