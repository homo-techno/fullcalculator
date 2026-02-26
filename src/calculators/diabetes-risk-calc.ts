import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const diabetesRiskCalculator: CalculatorDefinition = {
  slug: "diabetes-risk-calculator",
  title: "Type 2 Diabetes Risk Calculator",
  description:
    "Assess your risk for Type 2 diabetes using the ADA risk test criteria. Evaluate factors including age, BMI, family history, activity level, and more.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "diabetes risk calculator",
    "type 2 diabetes risk",
    "ADA risk test",
    "prediabetes risk",
    "diabetes screening",
    "blood sugar risk",
    "diabetes prevention",
  ],
  variants: [
    {
      id: "ada-risk-test",
      name: "ADA Risk Assessment",
      description: "Assess Type 2 diabetes risk based on the American Diabetes Association risk test",
      fields: [
        {
          name: "age",
          label: "Age Group",
          type: "select",
          options: [
            { label: "Under 40", value: "0" },
            { label: "40-49", value: "1" },
            { label: "50-59", value: "2" },
            { label: "60 or older", value: "3" },
          ],
        },
        {
          name: "sex",
          label: "Sex",
          type: "select",
          options: [
            { label: "Female", value: "0" },
            { label: "Male", value: "1" },
          ],
        },
        {
          name: "familyHistory",
          label: "Family History of Diabetes (parent/sibling)",
          type: "select",
          options: [
            { label: "No", value: "0" },
            { label: "Yes", value: "1" },
          ],
        },
        {
          name: "highBP",
          label: "High Blood Pressure (diagnosed or on medication)",
          type: "select",
          options: [
            { label: "No", value: "0" },
            { label: "Yes", value: "1" },
          ],
        },
        {
          name: "active",
          label: "Physically Active (at least 3 days/week)",
          type: "select",
          options: [
            { label: "Yes", value: "0" },
            { label: "No", value: "1" },
          ],
        },
        {
          name: "bmi",
          label: "BMI Category",
          type: "select",
          options: [
            { label: "Below 25 (Normal)", value: "0" },
            { label: "25-30 (Overweight)", value: "1" },
            { label: "30-40 (Obese)", value: "2" },
            { label: "Above 40 (Severely Obese)", value: "3" },
          ],
        },
        {
          name: "gestational",
          label: "History of Gestational Diabetes (females only)",
          type: "select",
          options: [
            { label: "No / Not Applicable", value: "0" },
            { label: "Yes", value: "1" },
          ],
        },
      ],
      calculate: (inputs) => {
        const age = parseFloat(inputs.age as string);
        const sex = parseFloat(inputs.sex as string);
        const familyHistory = parseFloat(inputs.familyHistory as string);
        const highBP = parseFloat(inputs.highBP as string);
        const active = parseFloat(inputs.active as string);
        const bmi = parseFloat(inputs.bmi as string);
        const gestational = parseFloat(inputs.gestational as string);

        if (isNaN(age) || isNaN(sex) || isNaN(bmi)) return null;

        const score = age + sex + familyHistory + highBP + active + bmi + gestational;

        let risk: string;
        let recommendation: string;
        if (score <= 2) {
          risk = "Low Risk";
          recommendation = "Continue healthy lifestyle. Routine screening per guidelines.";
        } else if (score <= 4) {
          risk = "Moderate Risk";
          recommendation = "Consider lifestyle modifications. Discuss screening with your doctor.";
        } else if (score <= 6) {
          risk = "High Risk";
          recommendation = "Speak with your healthcare provider about blood glucose testing. Consider diabetes prevention programs.";
        } else {
          risk = "Very High Risk";
          recommendation = "Strongly recommended to get tested for prediabetes/diabetes. Consider enrollment in a CDC-recognized Diabetes Prevention Program.";
        }

        const riskFactors: string[] = [];
        if (age >= 2) riskFactors.push("Age 50+");
        if (sex === 1) riskFactors.push("Male sex");
        if (familyHistory === 1) riskFactors.push("Family history");
        if (highBP === 1) riskFactors.push("High blood pressure");
        if (active === 1) riskFactors.push("Physical inactivity");
        if (bmi >= 2) riskFactors.push("Obesity (BMI 30+)");
        if (gestational === 1) riskFactors.push("Gestational diabetes history");

        return {
          primary: { label: "Risk Score", value: `${formatNumber(score, 0)} / 11` },
          details: [
            { label: "Risk Level", value: risk },
            { label: "Key Risk Factors", value: riskFactors.length > 0 ? riskFactors.join(", ") : "None identified" },
            { label: "Recommendation", value: recommendation },
          ],
          note: "This is a screening tool based on ADA risk criteria. A score of 5 or higher suggests you should be tested. This is not a diagnosis — consult your healthcare provider.",
        };
      },
    },
    {
      id: "bmi-risk",
      name: "BMI-Based Diabetes Risk",
      description: "Calculate BMI and associated diabetes risk from height and weight",
      fields: [
        {
          name: "weight",
          label: "Weight",
          type: "number",
          placeholder: "e.g. 180",
          suffix: "lbs",
          min: 50,
          max: 700,
        },
        {
          name: "heightFeet",
          label: "Height (feet)",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "ft",
          min: 3,
          max: 8,
        },
        {
          name: "heightInches",
          label: "Height (inches)",
          type: "number",
          placeholder: "e.g. 10",
          suffix: "in",
          min: 0,
          max: 11,
        },
      ],
      calculate: (inputs) => {
        const weight = parseFloat(inputs.weight as string);
        const heightFeet = parseFloat(inputs.heightFeet as string);
        const heightInches = parseFloat(inputs.heightInches as string) || 0;

        if (!weight || !heightFeet) return null;

        const totalInches = heightFeet * 12 + heightInches;
        const bmi = (weight / (totalInches * totalInches)) * 703;

        let bmiCategory: string;
        let relativeRisk: string;
        if (bmi < 18.5) {
          bmiCategory = "Underweight";
          relativeRisk = "Low — but underweight carries other health risks";
        } else if (bmi < 25) {
          bmiCategory = "Normal Weight";
          relativeRisk = "Baseline (1x)";
        } else if (bmi < 30) {
          bmiCategory = "Overweight";
          relativeRisk = "Increased (~2-3x baseline)";
        } else if (bmi < 35) {
          bmiCategory = "Obese Class I";
          relativeRisk = "High (~5-8x baseline)";
        } else if (bmi < 40) {
          bmiCategory = "Obese Class II";
          relativeRisk = "Very High (~10-18x baseline)";
        } else {
          bmiCategory = "Obese Class III";
          relativeRisk = "Extremely High (~20+ x baseline)";
        }

        return {
          primary: { label: "BMI", value: formatNumber(bmi, 1) },
          details: [
            { label: "BMI Category", value: bmiCategory },
            { label: "Relative Diabetes Risk", value: relativeRisk },
            { label: "Weight", value: `${formatNumber(weight, 0)} lbs` },
            { label: "Height", value: `${formatNumber(heightFeet, 0)}'${formatNumber(heightInches, 0)}"` },
          ],
          note: "BMI is a major risk factor for Type 2 diabetes. Losing 5-7% of body weight can reduce diabetes risk by 58% (DPP study). Waist circumference is an additional important risk factor.",
        };
      },
    },
  ],
  relatedSlugs: ["a1c-calculator", "glycemic-index-calculator", "bmi-calculator"],
  faq: [
    {
      question: "What score on the ADA risk test means I should get tested?",
      answer:
        "The ADA recommends that individuals with a score of 5 or higher on their risk test should talk to their doctor about getting tested for Type 2 diabetes. However, anyone with symptoms or concerns should consult a healthcare provider regardless of score.",
    },
    {
      question: "Can Type 2 diabetes be prevented?",
      answer:
        "Research shows that Type 2 diabetes can often be prevented or delayed through lifestyle changes. The Diabetes Prevention Program (DPP) study showed that moderate weight loss (5-7% of body weight) and 150 minutes of physical activity per week reduced diabetes risk by 58%.",
    },
    {
      question: "What blood tests diagnose diabetes?",
      answer:
        "Three main tests are used: Fasting Plasma Glucose (FPG) where 126 mg/dL or higher indicates diabetes; A1C test where 6.5% or higher indicates diabetes; and Oral Glucose Tolerance Test (OGTT) where 200 mg/dL or higher at 2 hours indicates diabetes.",
    },
  ],
  formula:
    "ADA Risk Score = Sum of risk factor points (age, sex, BMI, family history, high BP, activity, gestational diabetes) | BMI = (weight in lbs / height in inches^2) x 703",
};
