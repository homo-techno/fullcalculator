import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const survivalRateCalculator: CalculatorDefinition = {
  slug: "survival-rate-calculator",
  title: "Survival Rate Calculator",
  description: "Free survival rate calculator. Calculate cumulative survival probability over multiple time periods using the Kaplan-Meier method.",
  category: "Math", categorySlug: "math", icon: "+",
  keywords: ["survival rate calculator", "kaplan meier", "cumulative survival", "mortality rate"],
  variants: [
    {
      id: "simple", name: "Simple Survival Rate",
      fields: [
        { name: "atRisk", label: "Number at Risk (start)", type: "number", placeholder: "e.g. 100", min: 1 },
        { name: "events", label: "Number of Events (deaths)", type: "number", placeholder: "e.g. 15", min: 0 },
        { name: "time", label: "Time Period", type: "number", placeholder: "e.g. 5", min: 0 },
      ],
      calculate: (inputs) => {
        const atRisk = inputs.atRisk as number, events = inputs.events as number, time = inputs.time as number;
        if ([atRisk, events, time].some((v) => v === undefined || isNaN(v))) return null;
        if (atRisk < 1 || events < 0 || events > atRisk) return null;
        const sr = (atRisk - events) / atRisk;
        const mr = events / atRisk;
        const hr = events === atRisk ? Infinity : -Math.log(sr) / (time || 1);
        return {
          primary: { label: "Survival Rate", value: formatNumber(sr * 100, 2) + "%" },
          details: [
            { label: "Mortality Rate", value: formatNumber(mr * 100, 2) + "%" },
            { label: "Number Surviving", value: formatNumber(atRisk - events) },
            { label: "Hazard Rate", value: formatNumber(hr, 6) },
          ],
        };
      },
    },
    {
      id: "multi-period", name: "Two-Period Cumulative",
      fields: [
        { name: "n1", label: "At Risk Period 1", type: "number", placeholder: "e.g. 100", min: 1 },
        { name: "e1", label: "Events Period 1", type: "number", placeholder: "e.g. 10", min: 0 },
        { name: "n2", label: "At Risk Period 2", type: "number", placeholder: "e.g. 90", min: 1 },
        { name: "e2", label: "Events Period 2", type: "number", placeholder: "e.g. 8", min: 0 },
      ],
      calculate: (inputs) => {
        const n1 = inputs.n1 as number, e1 = inputs.e1 as number, n2 = inputs.n2 as number, e2 = inputs.e2 as number;
        if ([n1, e1, n2, e2].some((v) => v === undefined || isNaN(v))) return null;
        const s1 = (n1 - e1) / n1, s2 = (n2 - e2) / n2;
        const cumSurv = s1 * s2;
        return {
          primary: { label: "Cumulative Survival", value: formatNumber(cumSurv * 100, 2) + "%" },
          details: [
            { label: "Period 1 Survival", value: formatNumber(s1 * 100, 2) + "%" },
            { label: "Period 2 Survival", value: formatNumber(s2 * 100, 2) + "%" },
            { label: "Cumulative Mortality", value: formatNumber((1 - cumSurv) * 100, 2) + "%" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["number-needed-treat-calculator", "relative-risk-calculator"],
  faq: [{ question: "What is a survival rate?", answer: "The survival rate is the proportion of subjects surviving past a given time point. Cumulative survival multiplies survival probabilities across intervals." }],
  formula: "S(t) = product of (1 - di/ni) for each interval",
};
