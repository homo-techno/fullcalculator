import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const anesthesiaRiskCalculator: CalculatorDefinition = {
  slug: "anesthesia-risk",
  title: "Anesthesia Risk Assessment Calculator",
  description:
    "Free online anesthesia risk assessment calculator using the ASA Physical Status Classification system.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "anesthesia",
    "ASA classification",
    "surgical risk",
    "preoperative",
    "physical status",
    "surgery risk",
    "perioperative",
  ],
  variants: [
    {
      id: "asa-classification",
      name: "ASA Physical Status Classification",
      description:
        "Determine ASA class and estimate perioperative mortality risk.",
      fields: [
        {
          name: "age",
          label: "Patient Age",
          type: "number",
          placeholder: "e.g. 65",
          suffix: "years",
        },
        {
          name: "healthStatus",
          label: "Overall Health Status",
          type: "select",
          options: [
            { label: "Normal healthy patient", value: "1" },
            { label: "Mild systemic disease", value: "2" },
            { label: "Severe systemic disease", value: "3" },
            { label: "Severe disease - constant threat to life", value: "4" },
            { label: "Moribund - not expected to survive without surgery", value: "5" },
          ],
        },
        {
          name: "emergency",
          label: "Emergency Surgery?",
          type: "select",
          options: [
            { label: "No (Elective)", value: "no" },
            { label: "Yes (Emergency)", value: "yes" },
          ],
        },
        {
          name: "bmi",
          label: "BMI",
          type: "number",
          placeholder: "e.g. 28",
          suffix: "kg/m²",
        },
        {
          name: "smoking",
          label: "Smoking Status",
          type: "select",
          options: [
            { label: "Non-smoker", value: "none" },
            { label: "Former smoker", value: "former" },
            { label: "Current smoker", value: "current" },
          ],
        },
        {
          name: "surgeryType",
          label: "Surgery Complexity",
          type: "select",
          options: [
            { label: "Minor (e.g., skin biopsy)", value: "minor" },
            { label: "Moderate (e.g., hernia repair)", value: "moderate" },
            { label: "Major (e.g., joint replacement)", value: "major" },
            { label: "Complex (e.g., cardiac surgery)", value: "complex" },
          ],
        },
      ],
      calculate: (inputs) => {
        const age = parseFloat(inputs.age as string) || 0;
        const bmi = parseFloat(inputs.bmi as string) || 0;
        const asaClass = parseFloat(inputs.healthStatus as string) || 1;
        const emergency = inputs.emergency === "yes";
        const smoking = inputs.smoking as string;
        const surgeryType = inputs.surgeryType as string;

        if (age <= 0) return null;

        // Baseline perioperative mortality rates by ASA class
        const baseMortality: Record<number, number> = {
          1: 0.03,
          2: 0.2,
          3: 1.8,
          4: 7.8,
          5: 25.0,
        };

        let mortality = baseMortality[asaClass] || 0.03;

        // Emergency modifier (E suffix doubles risk approximately)
        if (emergency) mortality *= 2.0;

        // Age modifier
        if (age > 80) mortality *= 1.8;
        else if (age > 70) mortality *= 1.4;
        else if (age > 60) mortality *= 1.2;

        // BMI modifier
        if (bmi > 40) mortality *= 1.5;
        else if (bmi > 35) mortality *= 1.3;
        else if (bmi > 30) mortality *= 1.1;

        // Smoking modifier
        if (smoking === "current") mortality *= 1.3;
        else if (smoking === "former") mortality *= 1.1;

        // Surgery complexity modifier
        if (surgeryType === "complex") mortality *= 2.0;
        else if (surgeryType === "major") mortality *= 1.5;
        else if (surgeryType === "moderate") mortality *= 1.2;

        mortality = Math.min(mortality, 99);

        const asaLabels: Record<number, string> = {
          1: "ASA I - Normal healthy patient",
          2: "ASA II - Mild systemic disease",
          3: "ASA III - Severe systemic disease",
          4: "ASA IV - Severe systemic disease, constant threat to life",
          5: "ASA V - Moribund patient",
        };

        const asaLabel = asaLabels[asaClass] + (emergency ? "E" : "");

        let riskLevel: string;
        if (mortality < 0.5) riskLevel = "Low Risk";
        else if (mortality < 2) riskLevel = "Moderate Risk";
        else if (mortality < 10) riskLevel = "High Risk";
        else riskLevel = "Very High Risk";

        // Complication risk estimate (roughly 3-5x mortality)
        const complicationRisk = Math.min(mortality * 4, 99);

        return {
          primary: {
            label: "Estimated Perioperative Mortality",
            value: formatNumber(mortality),
            suffix: "%",
          },
          details: [
            { label: "ASA Classification", value: asaLabel },
            { label: "Risk Level", value: riskLevel },
            {
              label: "Estimated Complication Risk",
              value: formatNumber(complicationRisk) + "%",
            },
            { label: "Patient Age", value: formatNumber(age) + " years" },
            { label: "BMI", value: formatNumber(bmi) + " kg/m²" },
            {
              label: "Emergency",
              value: emergency ? "Yes (risk multiplied)" : "No",
            },
          ],
          note: "This is an approximation for educational purposes. Actual surgical risk depends on many additional factors. Always consult the anesthesiologist for individualized risk assessment.",
        };
      },
    },
  ],
  relatedSlugs: ["ascvd-risk", "life-expectancy-calc", "body-surface-area"],
  faq: [
    {
      question: "What is the ASA Physical Status Classification?",
      answer:
        "The ASA (American Society of Anesthesiologists) Physical Status Classification is a system for assessing patient fitness before surgery. It ranges from ASA I (healthy) to ASA VI (brain-dead organ donor), with an 'E' suffix for emergency cases.",
    },
    {
      question: "How does the ASA class affect anesthesia risk?",
      answer:
        "Higher ASA classes correlate with increased perioperative morbidity and mortality. ASA I patients have a mortality rate of approximately 0.03%, while ASA V patients have rates around 25% or higher. Emergency status roughly doubles the risk for any class.",
    },
    {
      question: "What factors beyond ASA class affect anesthesia risk?",
      answer:
        "Additional factors include the type and duration of surgery, the patient's airway anatomy, BMI, cardiopulmonary status, renal function, medications, recent food intake, and the experience of the anesthesia team.",
    },
  ],
  formula:
    "Adjusted Mortality = Base_Mortality(ASA_Class) × Emergency_Factor × Age_Factor × BMI_Factor × Smoking_Factor × Surgery_Factor. Base rates: ASA I=0.03%, II=0.2%, III=1.8%, IV=7.8%, V=25%.",
};
