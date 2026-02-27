import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const glp1WeightLossCalculator: CalculatorDefinition = {
  slug: "glp1-weight-loss-calculator",
  title: "GLP-1 Weight Loss Calculator",
  description:
    "Estimate your expected weight loss timeline on GLP-1 medications like semaglutide (Wegovy/Ozempic) and tirzepatide (Mounjaro/Zepbound). Based on clinical trial data.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "glp-1 weight loss",
    "semaglutide weight loss calculator",
    "tirzepatide weight loss",
    "wegovy weight loss timeline",
    "ozempic weight loss",
    "mounjaro weight loss",
    "zepbound weight loss",
  ],
  variants: [
    {
      id: "semaglutide",
      name: "Semaglutide (Wegovy/Ozempic)",
      description: "Projected weight loss on semaglutide based on STEP trial data",
      fields: [
        {
          name: "currentWeight",
          label: "Current Weight",
          type: "number",
          placeholder: "e.g. 220",
          suffix: "lbs",
          min: 80,
          max: 700,
        },
        {
          name: "duration",
          label: "Treatment Duration",
          type: "select",
          options: [
            { label: "3 months", value: "3" },
            { label: "6 months", value: "6" },
            { label: "9 months", value: "9" },
            { label: "12 months", value: "12" },
            { label: "18 months", value: "18" },
          ],
          defaultValue: "12",
        },
        {
          name: "response",
          label: "Expected Response",
          type: "select",
          options: [
            { label: "Below average (~10%)", value: "low" },
            { label: "Average (~15%)", value: "avg" },
            { label: "Above average (~20%)", value: "high" },
          ],
          defaultValue: "avg",
        },
      ],
      calculate: (inputs) => {
        const weight = parseFloat(inputs.currentWeight as string);
        const months = parseFloat(inputs.duration as string);
        const response = inputs.response as string;
        if (!weight || !months) return null;

        const responseRates: Record<string, number> = { low: 0.10, avg: 0.15, high: 0.20 };
        const maxLossPercent = responseRates[response] || 0.15;

        // Weight loss follows a logarithmic curve, most loss in first 6-9 months
        const progressFactor = Math.min(1, Math.log(1 + months / 6) / Math.log(1 + 18 / 6));
        const totalLossPercent = maxLossPercent * progressFactor;
        const weightLost = weight * totalLossPercent;
        const newWeight = weight - weightLost;

        return {
          primary: { label: "Estimated Weight Loss", value: formatNumber(weightLost, 1), suffix: "lbs" },
          details: [
            { label: "Projected Weight", value: `${formatNumber(newWeight, 1)} lbs` },
            { label: "Body Weight Lost", value: `${formatNumber(totalLossPercent * 100, 1)}%` },
            { label: "Avg Loss per Month", value: `${formatNumber(weightLost / months, 1)} lbs/mo` },
            { label: "Treatment Duration", value: `${months} months` },
          ],
          note: "Based on STEP clinical trial averages for semaglutide 2.4mg. Individual results vary significantly. This is an estimate only -- consult your healthcare provider.",
        };
      },
    },
    {
      id: "tirzepatide",
      name: "Tirzepatide (Mounjaro/Zepbound)",
      description: "Projected weight loss on tirzepatide based on SURMOUNT trial data",
      fields: [
        {
          name: "currentWeight",
          label: "Current Weight",
          type: "number",
          placeholder: "e.g. 220",
          suffix: "lbs",
          min: 80,
          max: 700,
        },
        {
          name: "dose",
          label: "Target Dose",
          type: "select",
          options: [
            { label: "5 mg", value: "5" },
            { label: "10 mg", value: "10" },
            { label: "15 mg", value: "15" },
          ],
          defaultValue: "15",
        },
        {
          name: "duration",
          label: "Treatment Duration",
          type: "select",
          options: [
            { label: "3 months", value: "3" },
            { label: "6 months", value: "6" },
            { label: "12 months", value: "12" },
            { label: "18 months", value: "18" },
          ],
          defaultValue: "12",
        },
      ],
      calculate: (inputs) => {
        const weight = parseFloat(inputs.currentWeight as string);
        const dose = parseFloat(inputs.dose as string);
        const months = parseFloat(inputs.duration as string);
        if (!weight || !dose || !months) return null;

        // SURMOUNT-1 data: 5mg ~15%, 10mg ~19.5%, 15mg ~20.9% at 72 weeks
        const doseMaxLoss: Record<number, number> = { 5: 0.15, 10: 0.195, 15: 0.209 };
        const maxLossPercent = doseMaxLoss[dose] || 0.195;

        const progressFactor = Math.min(1, Math.log(1 + months / 6) / Math.log(1 + 18 / 6));
        const totalLossPercent = maxLossPercent * progressFactor;
        const weightLost = weight * totalLossPercent;
        const newWeight = weight - weightLost;

        return {
          primary: { label: "Estimated Weight Loss", value: formatNumber(weightLost, 1), suffix: "lbs" },
          details: [
            { label: "Projected Weight", value: `${formatNumber(newWeight, 1)} lbs` },
            { label: "Body Weight Lost", value: `${formatNumber(totalLossPercent * 100, 1)}%` },
            { label: "Avg Loss per Month", value: `${formatNumber(weightLost / months, 1)} lbs/mo` },
            { label: "Target Dose", value: `${dose} mg weekly` },
          ],
          note: "Based on SURMOUNT-1 clinical trial data for tirzepatide. Individual results vary. Consult your healthcare provider before starting or adjusting any medication.",
        };
      },
    },
  ],
  relatedSlugs: ["bmi-calculator", "calorie-calculator", "ideal-weight-calculator"],
  faq: [
    {
      question: "How much weight can you lose on GLP-1 medications?",
      answer:
        "Clinical trials show average weight loss of 15% body weight on semaglutide (Wegovy) and up to 20.9% on tirzepatide (Zepbound) over 68-72 weeks. Results vary widely -- some patients lose more, others less. Factors include diet, exercise, starting weight, and individual biology.",
    },
    {
      question: "When do you start losing weight on semaglutide or tirzepatide?",
      answer:
        "Most patients begin losing weight within the first 4 weeks, though the dose is gradually increased over 16-20 weeks. The fastest weight loss typically occurs between months 3 and 9. Weight loss generally plateaus around 12-18 months.",
    },
    {
      question: "Is weight loss on GLP-1 medications permanent?",
      answer:
        "Studies show that most patients regain approximately two-thirds of lost weight within one year of stopping GLP-1 medications. Maintaining weight loss typically requires ongoing treatment, lifestyle changes, or both. Discuss long-term plans with your doctor.",
    },
  ],
  formula:
    "Estimated Loss = Current Weight x Max Loss% x Progress Factor | Progress Factor = ln(1 + months/6) / ln(1 + 18/6)",
};
