import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bloodGlucoseA1cCalculator: CalculatorDefinition = {
  slug: "blood-glucose-a1c-calculator",
  title: "Blood Glucose to A1C Converter",
  description:
    "Convert between average blood glucose levels and A1C percentage. Bidirectional calculator using the ADAG study formula for diabetes management.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "a1c calculator",
    "blood glucose to a1c",
    "a1c to blood glucose",
    "eag calculator",
    "estimated average glucose",
    "a1c conversion",
    "diabetes calculator",
  ],
  variants: [
    {
      id: "glucoseToA1c",
      name: "Blood Glucose to A1C",
      description: "Convert average blood glucose (mg/dL) to estimated A1C",
      fields: [
        {
          name: "glucose",
          label: "Average Blood Glucose",
          type: "number",
          placeholder: "e.g. 154",
          suffix: "mg/dL",
          min: 50,
          max: 500,
        },
        {
          name: "unit",
          label: "Glucose Unit",
          type: "select",
          options: [
            { label: "mg/dL", value: "mgdl" },
            { label: "mmol/L", value: "mmol" },
          ],
          defaultValue: "mgdl",
        },
      ],
      calculate: (inputs) => {
        const glucoseRaw = parseFloat(inputs.glucose as string);
        const unit = inputs.unit as string;
        if (!glucoseRaw) return null;

        // Convert to mg/dL if needed
        const glucose = unit === "mmol" ? glucoseRaw * 18.0182 : glucoseRaw;

        // ADAG formula: A1C = (Average Glucose + 46.7) / 28.7
        const a1c = (glucose + 46.7) / 28.7;

        let category: string;
        if (a1c < 5.7) category = "Normal";
        else if (a1c < 6.5) category = "Prediabetes";
        else category = "Diabetes range";

        const glucoseMmol = glucose / 18.0182;

        return {
          primary: { label: "Estimated A1C", value: `${formatNumber(a1c, 1)}%` },
          details: [
            { label: "Average Glucose (mg/dL)", value: formatNumber(glucose, 0) },
            { label: "Average Glucose (mmol/L)", value: formatNumber(glucoseMmol, 1) },
            { label: "Category", value: category },
            { label: "Normal A1C", value: "Below 5.7%" },
            { label: "Target (diabetes)", value: "Below 7.0%" },
          ],
          note: "Based on the ADAG (A1C-Derived Average Glucose) study formula. A1C reflects average glucose over 2-3 months. Certain conditions (anemia, hemoglobin variants) can affect A1C accuracy. Consult your healthcare provider for interpretation.",
        };
      },
    },
    {
      id: "a1cToGlucose",
      name: "A1C to Blood Glucose",
      description: "Convert A1C percentage to estimated average glucose",
      fields: [
        {
          name: "a1c",
          label: "A1C",
          type: "number",
          placeholder: "e.g. 7.0",
          suffix: "%",
          min: 3,
          max: 15,
          step: 0.1,
        },
      ],
      calculate: (inputs) => {
        const a1c = parseFloat(inputs.a1c as string);
        if (!a1c) return null;

        // ADAG formula: eAG (mg/dL) = 28.7 x A1C - 46.7
        const eag = 28.7 * a1c - 46.7;
        const eagMmol = eag / 18.0182;

        let category: string;
        if (a1c < 5.7) category = "Normal";
        else if (a1c < 6.5) category = "Prediabetes";
        else category = "Diabetes range";

        // Approximate fasting glucose range from eAG
        const fastingLow = eag * 0.7;
        const fastingHigh = eag * 0.9;

        return {
          primary: { label: "Est. Average Glucose", value: `${formatNumber(eag, 0)} mg/dL` },
          details: [
            { label: "Average Glucose (mmol/L)", value: formatNumber(eagMmol, 1) },
            { label: "A1C", value: `${formatNumber(a1c, 1)}%` },
            { label: "Category", value: category },
            { label: "Approx Fasting Range", value: `${formatNumber(fastingLow, 0)}-${formatNumber(fastingHigh, 0)} mg/dL` },
            { label: "Normal Fasting Glucose", value: "70-100 mg/dL" },
          ],
          note: "eAG (estimated Average Glucose) represents a 2-3 month average. Day-to-day glucose can vary significantly above and below this average. CGM provides more detailed glucose data.",
        };
      },
    },
    {
      id: "target",
      name: "A1C Target Assessment",
      description: "Check if your A1C meets recommended targets",
      fields: [
        {
          name: "a1c",
          label: "Your A1C",
          type: "number",
          placeholder: "e.g. 7.2",
          suffix: "%",
          min: 3,
          max: 15,
          step: 0.1,
        },
        {
          name: "population",
          label: "Patient Population",
          type: "select",
          options: [
            { label: "General adult (non-pregnant)", value: "general" },
            { label: "Older adult (65+)", value: "older" },
            { label: "Pregnant (preexisting diabetes)", value: "pregnant" },
            { label: "Pediatric (Type 1)", value: "pediatric" },
          ],
          defaultValue: "general",
        },
      ],
      calculate: (inputs) => {
        const a1c = parseFloat(inputs.a1c as string);
        const population = inputs.population as string;
        if (!a1c) return null;

        const targets: Record<string, { target: number; label: string }> = {
          general: { target: 7.0, label: "< 7.0% (ADA recommendation)" },
          older: { target: 8.0, label: "< 7.5-8.0% (individualized)" },
          pregnant: { target: 6.5, label: "< 6.0-6.5% (ADA recommendation)" },
          pediatric: { target: 7.0, label: "< 7.0% (ADA recommendation)" },
        };

        const targetInfo = targets[population] || targets.general;
        const meetsTarget = a1c < targetInfo.target;
        const eag = 28.7 * a1c - 46.7;
        const reductionNeeded = meetsTarget ? 0 : a1c - targetInfo.target;

        return {
          primary: { label: "Target Status", value: meetsTarget ? "At Target" : "Above Target" },
          details: [
            { label: "Your A1C", value: `${formatNumber(a1c, 1)}%` },
            { label: "Recommended Target", value: targetInfo.label },
            { label: "Reduction Needed", value: reductionNeeded > 0 ? `${formatNumber(reductionNeeded, 1)}%` : "None" },
            { label: "Est. Average Glucose", value: `${formatNumber(eag, 0)} mg/dL` },
          ],
          note: "A1C targets should be individualized. Tighter targets (< 6.5%) may benefit younger patients with recent diagnosis. Less stringent targets (< 8%) may be appropriate for those with hypoglycemia risk or limited life expectancy.",
        };
      },
    },
  ],
  relatedSlugs: ["calorie-calculator", "bmi-calculator", "macro-calculator"],
  faq: [
    {
      question: "What A1C level is considered diabetic?",
      answer:
        "An A1C of 6.5% or higher on two separate tests indicates diabetes. A1C of 5.7-6.4% indicates prediabetes. Below 5.7% is considered normal. These thresholds are established by the American Diabetes Association.",
    },
    {
      question: "How is A1C related to average blood sugar?",
      answer:
        "A1C measures the percentage of hemoglobin with attached glucose, reflecting a 2-3 month average. An A1C of 7% corresponds to an average glucose of about 154 mg/dL. Each 1% change in A1C represents approximately 29 mg/dL change in average glucose.",
    },
    {
      question: "Can A1C be inaccurate?",
      answer:
        "Yes. Conditions affecting red blood cells can alter A1C accuracy, including iron-deficiency anemia, sickle cell disease, thalassemia, recent blood loss or transfusion, and kidney disease. Certain hemoglobin variants can also interfere. In these cases, fructosamine or CGM may be better alternatives.",
    },
  ],
  formula:
    "A1C = (Average Glucose mg/dL + 46.7) / 28.7 | eAG = (28.7 x A1C) - 46.7 mg/dL",
};
