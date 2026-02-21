import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const covarianceCalculator: CalculatorDefinition = {
  slug: "covariance-calculator",
  title: "Covariance Calculator",
  description:
    "Free covariance calculator. Calculate the covariance between two data sets to measure how they vary together.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "covariance",
    "covariance calculator",
    "joint variability",
    "statistics",
    "two variables",
  ],
  variants: [
    {
      id: "calculate",
      name: "Calculate Covariance",
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
        const meanX = xs.reduce((a, b) => a + b, 0) / n;
        const meanY = ys.reduce((a, b) => a + b, 0) / n;

        const sumProduct = xs.reduce(
          (acc, x, i) => acc + (x - meanX) * (ys[i] - meanY),
          0
        );

        const popCovariance = sumProduct / n;
        const sampleCovariance = sumProduct / (n - 1);

        // Variances for context
        const varX = xs.reduce((acc, x) => acc + (x - meanX) ** 2, 0) / n;
        const varY = ys.reduce((acc, y) => acc + (y - meanY) ** 2, 0) / n;

        const direction =
          popCovariance > 0
            ? "Positive (variables tend to increase together)"
            : popCovariance < 0
            ? "Negative (one increases as the other decreases)"
            : "Zero (no linear relationship)";

        return {
          primary: {
            label: "Population Covariance",
            value: formatNumber(popCovariance, 6),
          },
          details: [
            {
              label: "Sample Covariance",
              value: formatNumber(sampleCovariance, 6),
            },
            { label: "Mean X", value: formatNumber(meanX, 4) },
            { label: "Mean Y", value: formatNumber(meanY, 4) },
            { label: "Var(X)", value: formatNumber(varX, 6) },
            { label: "Var(Y)", value: formatNumber(varY, 6) },
            { label: "Direction", value: direction },
            { label: "Data points", value: String(n) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "correlation-calculator",
    "variance-calculator",
    "regression-calculator",
  ],
  faq: [
    {
      question: "What is covariance?",
      answer:
        "Covariance measures the joint variability of two random variables. A positive covariance means they tend to increase together, a negative covariance means one increases as the other decreases, and zero means no linear relationship. Unlike correlation, covariance is not standardized and depends on the scale of the variables.",
    },
  ],
  formula: "Cov(X,Y) = Σ(xᵢ - x̄)(yᵢ - ȳ) / N",
};
