import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const a1cCalculator: CalculatorDefinition = {
  slug: "a1c-calculator",
  title: "A1C Calculator",
  description:
    "Free A1C to average blood sugar converter. Convert HbA1c percentage to estimated average glucose (eAG) in mg/dL or mmol/L. Understand your diabetes management.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "a1c calculator",
    "hba1c",
    "average blood sugar",
    "estimated average glucose",
    "diabetes calculator",
    "a1c to blood sugar",
    "glycated hemoglobin",
  ],
  variants: [
    {
      id: "a1c-to-glucose",
      name: "A1C to Average Blood Sugar",
      description: "Convert A1C percentage to estimated average glucose",
      fields: [
        {
          name: "a1c",
          label: "A1C (%)",
          type: "number",
          placeholder: "e.g. 6.5",
          suffix: "%",
          min: 3,
          max: 20,
          step: 0.1,
        },
      ],
      calculate: (inputs) => {
        const a1c = inputs.a1c as number;
        if (!a1c) return null;
        // ADAG study formula: eAG (mg/dL) = 28.7 × A1C − 46.7
        const eAgMgDl = 28.7 * a1c - 46.7;
        const eAgMmolL = eAgMgDl / 18.0156;
        let status: string;
        if (a1c < 5.7) status = "Normal (no diabetes)";
        else if (a1c < 6.5) status = "Prediabetes";
        else status = "Diabetes range";
        let management: string;
        if (a1c < 5.7) management = "Healthy — continue regular screening";
        else if (a1c < 6.5) management = "Lifestyle changes recommended";
        else if (a1c < 7.0) management = "Well-controlled diabetes (ADA target for most adults)";
        else if (a1c < 8.0) management = "Suboptimal control — discuss with doctor";
        else management = "Poor control — treatment adjustment needed";
        return {
          primary: { label: "Estimated Average Glucose", value: `${formatNumber(eAgMgDl, 0)} mg/dL` },
          details: [
            { label: "A1C", value: `${formatNumber(a1c, 1)}%` },
            { label: "eAG (mg/dL)", value: formatNumber(eAgMgDl, 0) },
            { label: "eAG (mmol/L)", value: formatNumber(eAgMmolL, 1) },
            { label: "Status", value: status },
            { label: "Management", value: management },
          ],
          note: "The A1C test reflects average blood sugar over the past 2-3 months. ADA target for most adults with diabetes is below 7%. This is an estimate — consult your healthcare provider.",
        };
      },
    },
    {
      id: "glucose-to-a1c",
      name: "Average Blood Sugar to A1C",
      description: "Estimate A1C from your average blood sugar readings",
      fields: [
        {
          name: "glucose",
          label: "Average Blood Sugar",
          type: "number",
          placeholder: "e.g. 140",
          suffix: "mg/dL",
          min: 40,
          max: 600,
        },
      ],
      calculate: (inputs) => {
        const glucose = inputs.glucose as number;
        if (!glucose) return null;
        // Reverse of ADAG formula: A1C = (eAG + 46.7) / 28.7
        const a1c = (glucose + 46.7) / 28.7;
        const mmolL = glucose / 18.0156;
        let status: string;
        if (a1c < 5.7) status = "Normal range";
        else if (a1c < 6.5) status = "Prediabetes range";
        else status = "Diabetes range";
        return {
          primary: { label: "Estimated A1C", value: `${formatNumber(a1c, 1)}%` },
          details: [
            { label: "Average glucose", value: `${glucose} mg/dL` },
            { label: "Average glucose", value: `${formatNumber(mmolL, 1)} mmol/L` },
            { label: "Estimated A1C", value: `${formatNumber(a1c, 1)}%` },
            { label: "Status", value: status },
          ],
          note: "This is an estimate based on the ADAG study formula. Actual A1C depends on many factors including red blood cell turnover. Consult your doctor for accurate testing.",
        };
      },
    },
  ],
  relatedSlugs: ["blood-sugar-calculator", "cholesterol-ratio-calculator", "calorie-calculator"],
  faq: [
    {
      question: "What is a normal A1C level?",
      answer:
        "A normal A1C is below 5.7%. Prediabetes is 5.7-6.4%. Diabetes is diagnosed at 6.5% or higher. For most adults with diabetes, the ADA recommends a target below 7%.",
    },
    {
      question: "How is A1C different from blood sugar?",
      answer:
        "A1C measures the percentage of hemoglobin with attached sugar (glycated hemoglobin) and reflects your average blood sugar over 2-3 months. A blood sugar test measures glucose at a single point in time.",
    },
    {
      question: "How often should A1C be tested?",
      answer:
        "The ADA recommends A1C testing at least twice a year for people meeting treatment goals, and quarterly for those not meeting goals or whose therapy has changed.",
    },
    {
      question: "What factors can affect A1C accuracy?",
      answer:
        "Conditions affecting red blood cells (anemia, sickle cell disease, recent blood loss/transfusion), pregnancy, and certain hemoglobin variants can cause inaccurate A1C results.",
    },
  ],
  formula:
    "eAG (mg/dL) = 28.7 x A1C - 46.7 (ADAG Study, 2008) | eAG (mmol/L) = eAG (mg/dL) / 18.0156 | A1C = (eAG + 46.7) / 28.7",
};
