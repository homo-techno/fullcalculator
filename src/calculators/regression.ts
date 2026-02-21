import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const regressionCalculator: CalculatorDefinition = {
  slug: "regression-calculator",
  title: "Regression Calculator",
  description:
    "Free linear regression calculator. Calculate the slope, intercept, and R² for a simple linear regression model.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "regression calculator",
    "linear regression",
    "slope",
    "intercept",
    "least squares",
    "R squared",
  ],
  variants: [
    {
      id: "calculate",
      name: "Simple Linear Regression",
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

        const denomX = n * sumX2 - sumX * sumX;
        if (denomX === 0) return null;

        const m = (n * sumXY - sumX * sumY) / denomX;
        const b = (sumY - m * sumX) / n;

        // R²
        const meanY = sumY / n;
        const ssTot = ys.reduce((acc, y) => acc + (y - meanY) ** 2, 0);
        const ssRes = xs.reduce((acc, x, i) => acc + (ys[i] - (m * x + b)) ** 2, 0);
        const r2 = ssTot === 0 ? 1 : 1 - ssRes / ssTot;

        return {
          primary: {
            label: "Equation",
            value: `y = ${formatNumber(m, 4)}x + ${formatNumber(b, 4)}`,
          },
          details: [
            { label: "Slope (m)", value: formatNumber(m, 6) },
            { label: "Intercept (b)", value: formatNumber(b, 6) },
            { label: "R²", value: formatNumber(r2, 6) },
            { label: "Data points", value: String(n) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "correlation-calculator",
    "covariance-calculator",
    "interpolation-calculator",
  ],
  faq: [
    {
      question: "What is simple linear regression?",
      answer:
        "Simple linear regression finds the straight line (y = mx + b) that best fits a set of data points by minimizing the sum of squared residuals. The slope m shows how much y changes per unit change in x, and b is the y-intercept.",
    },
  ],
  formula: "m = [nΣxy - (Σx)(Σy)] / [nΣx² - (Σx)²], b = (Σy - mΣx) / n",
};
