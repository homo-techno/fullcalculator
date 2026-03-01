import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const shippingCostEstimatorCalculator: CalculatorDefinition = {
  slug: "shipping-cost-estimator-calculator",
  title: "Shipping Cost Estimator Calculator",
  description: "Estimate shipping cost from weight and dimensions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["shipping cost","shipping estimator"],
  variants: [{
    id: "standard",
    name: "Shipping Cost Estimator",
    description: "Estimate shipping cost from weight and dimensions.",
    fields: [
      { name: "weight", label: "Weight (lbs)", type: "number", min: 0.1, max: 2000, defaultValue: 5 },
      { name: "length", label: "Length (in)", type: "number", min: 1, max: 200, defaultValue: 12 },
      { name: "width", label: "Width (in)", type: "number", min: 1, max: 200, defaultValue: 10 },
      { name: "height", label: "Height (in)", type: "number", min: 1, max: 200, defaultValue: 8 },
    ],
    calculate: (inputs) => {
      const wt = inputs.weight as number;
      const l = inputs.length as number;
      const w = inputs.width as number;
      const h = inputs.height as number;
      if (!wt || !l || !w || !h) return null;
      const dimWeight = Math.round((l * w * h) / 139 * 100) / 100;
      const billable = Math.max(wt, dimWeight);
      const cost = Math.round(billable * 1.5 * 100) / 100;
      return {
        primary: { label: "Estimated Cost", value: "$" + formatNumber(cost) },
        details: [
          { label: "Actual Weight", value: wt + " lbs" },
          { label: "Dimensional Weight", value: dimWeight + " lbs" },
          { label: "Billable Weight", value: billable + " lbs" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is dimensional weight?", answer: "A pricing method using package volume instead of actual weight." },
    { question: "Why is my shipping cost higher than expected?", answer: "Carriers charge the greater of actual weight or dimensional weight." },
  ],
  formula: "DIM Weight = (L x W x H) / 139; Cost = Billable Weight x Rate",
};
