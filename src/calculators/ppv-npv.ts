import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ppvNpvCalculator: CalculatorDefinition = {
  slug: "ppv-npv-calculator",
  title: "PPV and NPV Calculator",
  description: "Free PPV and NPV calculator. Calculate positive and negative predictive values from sensitivity, specificity, and prevalence.",
  category: "Math", categorySlug: "math", icon: "+",
  keywords: ["ppv calculator", "npv calculator", "positive predictive value", "negative predictive value"],
  variants: [
    {
      id: "from-sens-spec", name: "From Sensitivity, Specificity & Prevalence",
      fields: [
        { name: "sensitivity", label: "Sensitivity (%)", type: "number", placeholder: "e.g. 90", min: 0, max: 100 },
        { name: "specificity", label: "Specificity (%)", type: "number", placeholder: "e.g. 95", min: 0, max: 100 },
        { name: "prevalence", label: "Prevalence (%)", type: "number", placeholder: "e.g. 5", min: 0, max: 100 },
      ],
      calculate: (inputs) => {
        const sens = (inputs.sensitivity as number) / 100;
        const spec = (inputs.specificity as number) / 100;
        const prev = (inputs.prevalence as number) / 100;
        if ([sens, spec, prev].some((v) => isNaN(v))) return null;
        const ppvD = sens * prev + (1 - spec) * (1 - prev);
        const npvD = (1 - sens) * prev + spec * (1 - prev);
        const ppv = ppvD === 0 ? 0 : (sens * prev) / ppvD;
        const npv = npvD === 0 ? 0 : (spec * (1 - prev)) / npvD;
        return {
          primary: { label: "PPV", value: formatNumber(ppv * 100, 2) + "%" },
          details: [
            { label: "NPV", value: formatNumber(npv * 100, 2) + "%" },
            { label: "Sensitivity", value: formatNumber(sens * 100, 2) + "%" },
            { label: "Specificity", value: formatNumber(spec * 100, 2) + "%" },
            { label: "Prevalence", value: formatNumber(prev * 100, 2) + "%" },
          ],
        };
      },
    },
    {
      id: "from-counts", name: "From Counts (2x2 Table)",
      fields: [
        { name: "tp", label: "True Positives", type: "number", placeholder: "e.g. 80", min: 0 },
        { name: "fp", label: "False Positives", type: "number", placeholder: "e.g. 10", min: 0 },
        { name: "fn", label: "False Negatives", type: "number", placeholder: "e.g. 20", min: 0 },
        { name: "tn", label: "True Negatives", type: "number", placeholder: "e.g. 90", min: 0 },
      ],
      calculate: (inputs) => {
        const tp = inputs.tp as number, fp = inputs.fp as number, fn = inputs.fn as number, tn = inputs.tn as number;
        if ([tp, fp, fn, tn].some((v) => v === undefined || isNaN(v) || v < 0)) return null;
        const ppv = (tp + fp) === 0 ? 0 : tp / (tp + fp);
        const npv = (fn + tn) === 0 ? 0 : tn / (fn + tn);
        return {
          primary: { label: "PPV", value: formatNumber(ppv * 100, 2) + "%" },
          details: [
            { label: "NPV", value: formatNumber(npv * 100, 2) + "%" },
            { label: "TP", value: formatNumber(tp) }, { label: "FP", value: formatNumber(fp) },
            { label: "FN", value: formatNumber(fn) }, { label: "TN", value: formatNumber(tn) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["sensitivity-specificity-calculator", "odds-ratio-calculator"],
  faq: [{ question: "What is PPV?", answer: "Positive Predictive Value is the probability that a person with a positive test truly has the condition. It depends heavily on prevalence." }],
  formula: "PPV = (Sens*Prev) / (Sens*Prev + (1-Spec)*(1-Prev))",
};
