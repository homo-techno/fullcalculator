import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const heartDiseaseRiskCalculator: CalculatorDefinition = {
  slug: "heart-disease-risk-calculator",
  title: "Heart Disease Risk Calculator",
  description:
    "Free heart disease risk calculator based on the Framingham Risk Score. Estimate your 10-year cardiovascular disease risk using key health factors.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "heart disease risk",
    "Framingham risk score",
    "cardiovascular risk",
    "heart attack risk",
    "10 year heart risk",
    "cardiac risk calculator",
  ],
  variants: [
    {
      id: "framingham",
      name: "Framingham Risk Score (Simplified)",
      description: "Estimate 10-year cardiovascular risk based on major risk factors",
      fields: [
        {
          name: "age",
          label: "Age",
          type: "number",
          placeholder: "e.g. 55",
          suffix: "years",
          min: 20,
          max: 80,
        },
        {
          name: "sex",
          label: "Sex",
          type: "select",
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ],
        },
        {
          name: "totalCholesterol",
          label: "Total Cholesterol",
          type: "number",
          placeholder: "e.g. 200",
          suffix: "mg/dL",
          min: 100,
          max: 400,
        },
        {
          name: "hdl",
          label: "HDL Cholesterol",
          type: "number",
          placeholder: "e.g. 50",
          suffix: "mg/dL",
          min: 10,
          max: 150,
        },
        {
          name: "systolic",
          label: "Systolic Blood Pressure",
          type: "number",
          placeholder: "e.g. 130",
          suffix: "mmHg",
          min: 80,
          max: 250,
        },
        {
          name: "smoking",
          label: "Current Smoker?",
          type: "select",
          options: [
            { label: "No", value: "no" },
            { label: "Yes", value: "yes" },
          ],
        },
        {
          name: "diabetes",
          label: "Have Diabetes?",
          type: "select",
          options: [
            { label: "No", value: "no" },
            { label: "Yes", value: "yes" },
          ],
        },
        {
          name: "bpTreatment",
          label: "On Blood Pressure Medication?",
          type: "select",
          options: [
            { label: "No", value: "no" },
            { label: "Yes", value: "yes" },
          ],
        },
      ],
      calculate: (inputs) => {
        const age = inputs.age as number;
        const sex = inputs.sex as string;
        const tc = inputs.totalCholesterol as number;
        const hdl = inputs.hdl as number;
        const sbp = inputs.systolic as number;
        const isSmoker = inputs.smoking === "yes";
        const hasDiabetes = inputs.diabetes === "yes";
        const onBpMeds = inputs.bpTreatment === "yes";
        if (!age || !sex || !tc || !hdl || !sbp) return null;

        // Simplified Framingham point-based approach
        const isMale = sex === "male";
        let points = 0;

        // Age points
        if (isMale) {
          if (age <= 34) points += -1;
          else if (age <= 39) points += 0;
          else if (age <= 44) points += 1;
          else if (age <= 49) points += 2;
          else if (age <= 54) points += 3;
          else if (age <= 59) points += 4;
          else if (age <= 64) points += 5;
          else if (age <= 69) points += 6;
          else points += 7;
        } else {
          if (age <= 34) points += -9;
          else if (age <= 39) points += -4;
          else if (age <= 44) points += 0;
          else if (age <= 49) points += 3;
          else if (age <= 54) points += 6;
          else if (age <= 59) points += 7;
          else if (age <= 64) points += 8;
          else if (age <= 69) points += 8;
          else points += 8;
        }

        // Total cholesterol points
        if (tc < 160) points += 0;
        else if (tc < 200) points += 1;
        else if (tc < 240) points += 2;
        else if (tc < 280) points += 3;
        else points += 4;

        // HDL points
        if (hdl >= 60) points += -2;
        else if (hdl >= 50) points += -1;
        else if (hdl >= 45) points += 0;
        else if (hdl >= 35) points += 1;
        else points += 2;

        // SBP points
        if (onBpMeds) {
          if (sbp < 120) points += 0;
          else if (sbp < 130) points += 2;
          else if (sbp < 140) points += 3;
          else if (sbp < 160) points += 4;
          else points += 5;
        } else {
          if (sbp < 120) points += -2;
          else if (sbp < 130) points += 0;
          else if (sbp < 140) points += 1;
          else if (sbp < 160) points += 2;
          else points += 3;
        }

        // Smoking points
        if (isSmoker) points += isMale ? 4 : 3;

        // Diabetes points
        if (hasDiabetes) points += isMale ? 3 : 4;

        // Convert points to approximate 10-year risk percentage
        let risk10yr: number;
        if (isMale) {
          if (points <= -3) risk10yr = 1;
          else if (points <= -1) risk10yr = 2;
          else if (points <= 1) risk10yr = 3;
          else if (points <= 3) risk10yr = 5;
          else if (points <= 5) risk10yr = 7;
          else if (points <= 7) risk10yr = 10;
          else if (points <= 9) risk10yr = 14;
          else if (points <= 11) risk10yr = 20;
          else if (points <= 13) risk10yr = 25;
          else if (points <= 15) risk10yr = 30;
          else risk10yr = Math.min(points * 2.5, 50);
        } else {
          if (points <= -2) risk10yr = 1;
          else if (points <= 0) risk10yr = 2;
          else if (points <= 2) risk10yr = 3;
          else if (points <= 4) risk10yr = 4;
          else if (points <= 6) risk10yr = 5;
          else if (points <= 8) risk10yr = 7;
          else if (points <= 10) risk10yr = 10;
          else if (points <= 12) risk10yr = 14;
          else if (points <= 14) risk10yr = 18;
          else if (points <= 16) risk10yr = 22;
          else risk10yr = Math.min(points * 2, 40);
        }

        let riskCategory: string;
        if (risk10yr < 5) riskCategory = "Low risk";
        else if (risk10yr < 10) riskCategory = "Borderline risk";
        else if (risk10yr < 20) riskCategory = "Intermediate risk";
        else riskCategory = "High risk";

        const riskFactors: string[] = [];
        if (isSmoker) riskFactors.push("Smoking");
        if (hasDiabetes) riskFactors.push("Diabetes");
        if (sbp >= 140) riskFactors.push("High blood pressure");
        if (tc >= 240) riskFactors.push("High cholesterol");
        if (hdl < 40) riskFactors.push("Low HDL");

        return {
          primary: { label: "10-Year Risk", value: `${formatNumber(risk10yr, 0)}%` },
          details: [
            { label: "Risk category", value: riskCategory },
            { label: "Framingham points", value: String(points) },
            { label: "Risk factors present", value: riskFactors.length > 0 ? riskFactors.join(", ") : "None identified" },
            { label: "Total cholesterol/HDL ratio", value: formatNumber(tc / hdl, 1) },
            { label: "Recommendation", value: risk10yr >= 20 ? "Discuss statin therapy with doctor" : risk10yr >= 10 ? "Discuss risk reduction strategies" : "Maintain healthy lifestyle" },
          ],
          note: "This is a simplified Framingham-based estimate for educational purposes. The actual Framingham Risk Score uses more detailed calculations. For clinical decisions, use the ACC/AHA ASCVD risk calculator. This is not medical advice.",
        };
      },
    },
  ],
  relatedSlugs: ["cholesterol-ratio-calculator", "blood-pressure-calculator", "stroke-risk-calculator"],
  faq: [
    {
      question: "What is the Framingham Risk Score?",
      answer:
        "The Framingham Risk Score estimates 10-year cardiovascular disease risk based on age, sex, cholesterol, blood pressure, smoking status, and diabetes. It was developed from the Framingham Heart Study.",
    },
    {
      question: "What is considered high cardiovascular risk?",
      answer:
        "A 10-year risk of 20% or higher is considered high risk. Intermediate risk is 10-19.9%. Borderline is 5-9.9%. Low risk is below 5%.",
    },
    {
      question: "How can I reduce my heart disease risk?",
      answer:
        "Key modifiable risk factors include quitting smoking, managing blood pressure and cholesterol, controlling diabetes, regular physical activity (150+ min/week), maintaining a healthy weight, and eating a heart-healthy diet.",
    },
    {
      question: "Is this the same as the ASCVD risk calculator?",
      answer:
        "No. The ACC/AHA ASCVD (Atherosclerotic Cardiovascular Disease) risk calculator uses different equations (Pooled Cohort Equations). This Framingham-based tool provides a simplified estimate for educational purposes.",
    },
  ],
  formula:
    "Framingham Risk Score uses point-based system considering: Age, Total Cholesterol, HDL, Systolic BP (treated/untreated), Smoking, and Diabetes. Points are converted to 10-year cardiovascular disease risk percentage.",
};
