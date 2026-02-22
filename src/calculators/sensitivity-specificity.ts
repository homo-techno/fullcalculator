import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sensitivitySpecificityCalculator: CalculatorDefinition = {
  slug: "sensitivity-specificity-calculator",
  title: "Sensitivity & Specificity Calculator",
  description: "Free sensitivity and specificity calculator. Evaluate diagnostic test performance from true/false positives and negatives.",
  category: "Math", categorySlug: "math", icon: "+",
  keywords: ["sensitivity specificity calculator", "diagnostic test", "true positive", "false positive", "accuracy"],
  variants: [{
    id: "from-counts", name: "From Counts",
    fields: [
      { name: "tp", label: "True Positives (TP)", type: "number", placeholder: "e.g. 80", min: 0 },
      { name: "fp", label: "False Positives (FP)", type: "number", placeholder: "e.g. 10", min: 0 },
      { name: "fn", label: "False Negatives (FN)", type: "number", placeholder: "e.g. 20", min: 0 },
      { name: "tn", label: "True Negatives (TN)", type: "number", placeholder: "e.g. 90", min: 0 },
    ],
    calculate: (inputs) => {
      const tp = inputs.tp as number, fp = inputs.fp as number, fn = inputs.fn as number, tn = inputs.tn as number;
      if ([tp, fp, fn, tn].some((v) => v === undefined || isNaN(v) || v < 0)) return null;
      const total = tp + fp + fn + tn;
      if (total === 0) return null;
      const sens = (tp + fn) === 0 ? 0 : tp / (tp + fn);
      const spec = (fp + tn) === 0 ? 0 : tn / (fp + tn);
      const ppv = (tp + fp) === 0 ? 0 : tp / (tp + fp);
      const npv = (fn + tn) === 0 ? 0 : tn / (fn + tn);
      const accuracy = (tp + tn) / total;
      const prevalence = (tp + fn) / total;
      return {
        primary: { label: "Sensitivity", value: formatNumber(sens * 100, 2) + "%" },
        details: [
          { label: "Specificity", value: formatNumber(spec * 100, 2) + "%" },
          { label: "PPV", value: formatNumber(ppv * 100, 2) + "%" },
          { label: "NPV", value: formatNumber(npv * 100, 2) + "%" },
          { label: "Accuracy", value: formatNumber(accuracy * 100, 2) + "%" },
          { label: "Prevalence", value: formatNumber(prevalence * 100, 2) + "%" },
          { label: "LR+", value: formatNumber(spec === 1 ? Infinity : sens / (1 - spec), 4) },
          { label: "LR-", value: formatNumber(sens === 1 ? 0 : (1 - sens) / spec, 4) },
        ],
      };
    },
  }],
  relatedSlugs: ["ppv-npv-calculator", "odds-ratio-calculator"],
  faq: [
    { question: "What is sensitivity?", answer: "Sensitivity (true positive rate) is the proportion of actual positives correctly identified. High sensitivity means few false negatives." },
    { question: "What is specificity?", answer: "Specificity (true negative rate) is the proportion of actual negatives correctly identified. High specificity means few false positives." },
  ],
  formula: "Sensitivity = TP/(TP+FN). Specificity = TN/(FP+TN)",
};
