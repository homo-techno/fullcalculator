import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const nutritionalScreeningCalculator: CalculatorDefinition = {
  slug: "nutritional-screening",
  title: "Nutritional Risk Screening (NRS-2002) Calculator",
  description: "Free NRS-2002 calculator. Screen hospitalized patients for nutritional risk using nutritional status impairment and disease severity components.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["nrs 2002", "nutritional risk screening", "malnutrition screening", "nutrition assessment", "hospital nutrition", "nutritional status"],
  variants: [
    {
      id: "nrs-2002",
      name: "NRS-2002 Screening",
      fields: [
        { name: "nutritionalStatus", label: "Nutritional Status Impairment", type: "select", options: [
          { label: "0 - Normal nutritional status", value: "0" },
          { label: "1 - Mild: >5% weight loss in 3 months or intake 50-75% of normal", value: "1" },
          { label: "2 - Moderate: >5% weight loss in 2 months or BMI 18.5-20.5 + impaired condition", value: "2" },
          { label: "3 - Severe: >5% weight loss in 1 month or BMI <18.5 + impaired condition", value: "3" },
        ] },
        { name: "diseaseSeverity", label: "Severity of Disease", type: "select", options: [
          { label: "0 - Normal requirements (e.g., hip fracture)", value: "0" },
          { label: "1 - Mild: chronic illness, COPD, cirrhosis, hemodialysis, diabetes, oncology", value: "1" },
          { label: "2 - Moderate: major abdominal surgery, stroke, severe pneumonia, hematologic malignancy", value: "2" },
          { label: "3 - Severe: head injury, bone marrow transplant, ICU (APACHE > 10)", value: "3" },
        ] },
        { name: "ageOver70", label: "Age >= 70 years?", type: "select", options: [{ label: "No", value: "0" }, { label: "Yes", value: "1" }] },
      ],
      calculate: (inputs) => {
        const nutritional = parseInt(inputs.nutritionalStatus as string);
        const disease = parseInt(inputs.diseaseSeverity as string);
        const ageFactor = parseInt(inputs.ageOver70 as string);
        if (isNaN(nutritional) || isNaN(disease) || isNaN(ageFactor)) return null;
        const score = nutritional + disease + ageFactor;
        let risk = "";
        let action = "";
        if (score >= 3) { risk = "At nutritional risk"; action = "Initiate nutritional support plan. Consult dietitian. Set nutritional goals and monitor intake."; }
        else { risk = "Not at risk currently"; action = "Rescreen weekly. If major surgery planned, consider preventive nutritional care plan."; }
        return {
          primary: { label: "NRS-2002 Score", value: formatNumber(score, 0) },
          details: [
            { label: "Total Score", value: formatNumber(score, 0) + " / 7" },
            { label: "Risk Classification", value: risk },
            { label: "Recommended Action", value: action },
            { label: "Nutritional Status Score", value: formatNumber(nutritional, 0) + " / 3" },
            { label: "Disease Severity Score", value: formatNumber(disease, 0) + " / 3" },
            { label: "Age Adjustment", value: ageFactor === 1 ? "+1 (age >= 70)" : "0" },
          ],
          note: "NRS-2002 score >= 3 indicates nutritional risk requiring intervention. Rescreen weekly for at-risk patients. Validated for hospitalized adult patients.",
        };
      },
    },
  ],
  relatedSlugs: ["harris-benedict", "braden-scale", "apache-score"],
  faq: [
    { question: "What is NRS-2002?", answer: "NRS-2002 (Nutritional Risk Screening 2002) is a validated tool to identify hospitalized patients who are at nutritional risk and may benefit from nutritional support." },
    { question: "When is a patient at nutritional risk?", answer: "A total score of 3 or higher indicates nutritional risk and the need for a nutritional care plan. The score combines nutritional status, disease severity, and age." },
    { question: "How often should screening be done?", answer: "Screen on admission and weekly during hospitalization. Rescreen with significant changes in clinical condition." },
  ],
  formula: "NRS-2002 = Nutritional Status (0-3) + Disease Severity (0-3) + Age Factor (0-1) | At risk if >= 3",
};
