import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const framinghamScoreCalculator: CalculatorDefinition = {
  slug: "framingham-score",
  title: "Framingham Risk Score Calculator",
  description: "Free Framingham Risk Score calculator. Estimate 10-year cardiovascular disease risk using age, cholesterol, blood pressure, smoking, and diabetes.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["framingham risk score", "cardiovascular risk", "heart disease risk", "10 year cvd risk", "cardiac risk assessment"],
  variants: [
    {
      id: "framingham-general",
      name: "Framingham General CVD Risk",
      fields: [
        { name: "age", label: "Age (years)", type: "number", placeholder: "e.g. 55", min: 30, max: 79 },
        { name: "sex", label: "Sex", type: "select", options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }] },
        { name: "totalChol", label: "Total Cholesterol (mg/dL)", type: "number", placeholder: "e.g. 200", min: 100, max: 400 },
        { name: "hdl", label: "HDL Cholesterol (mg/dL)", type: "number", placeholder: "e.g. 50", min: 10, max: 150 },
        { name: "systolic", label: "Systolic BP (mmHg)", type: "number", placeholder: "e.g. 130", min: 80, max: 250 },
        { name: "bpTreated", label: "BP Treated with Medication?", type: "select", options: [{ label: "No", value: "no" }, { label: "Yes", value: "yes" }] },
        { name: "smoker", label: "Current Smoker?", type: "select", options: [{ label: "No", value: "no" }, { label: "Yes", value: "yes" }] },
        { name: "diabetes", label: "Diabetes?", type: "select", options: [{ label: "No", value: "no" }, { label: "Yes", value: "yes" }] },
      ],
      calculate: (inputs) => {
        const age = inputs.age as number;
        const sex = inputs.sex as string;
        const tc = inputs.totalChol as number;
        const hdl = inputs.hdl as number;
        const sbp = inputs.systolic as number;
        const treated = inputs.bpTreated === "yes";
        const smoker = inputs.smoker === "yes";
        const diabetes = inputs.diabetes === "yes";
        if (!age || !sex || !tc || !hdl || !sbp) return null;
        let points = 0;
        if (sex === "male") {
          if (age >= 70) points += 13; else if (age >= 65) points += 12; else if (age >= 60) points += 11;
          else if (age >= 55) points += 10; else if (age >= 50) points += 8; else if (age >= 45) points += 6;
          else if (age >= 40) points += 5; else if (age >= 35) points += 2;
          if (hdl >= 60) points -= 2; else if (hdl < 35) points += 2; else if (hdl < 45) points += 1; else if (hdl >= 50) points -= 1;
          if (smoker) points += 4;
          if (diabetes) points += 3;
          if (treated) { if (sbp >= 160) points += 3; else if (sbp >= 140) points += 2; else if (sbp >= 130) points += 1; }
          else { if (sbp >= 160) points += 2; else if (sbp >= 140) points += 1; }
        } else {
          if (age >= 70) points += 16; else if (age >= 65) points += 14; else if (age >= 60) points += 12;
          else if (age >= 55) points += 10; else if (age >= 50) points += 8; else if (age >= 45) points += 5;
          else if (age >= 40) points += 3; else if (age >= 35) points += 1;
          if (hdl >= 60) points -= 2; else if (hdl < 35) points += 2; else if (hdl < 45) points += 1; else if (hdl >= 50) points -= 1;
          if (smoker) points += 3;
          if (diabetes) points += 4;
          if (treated) { if (sbp >= 160) points += 5; else if (sbp >= 140) points += 4; else if (sbp >= 130) points += 2; else if (sbp >= 120) points += 1; }
          else { if (sbp >= 160) points += 3; else if (sbp >= 140) points += 2; else if (sbp >= 130) points += 1; }
        }
        let risk10yr: number;
        if (points <= 0) risk10yr = 1; else if (points <= 5) risk10yr = 2; else if (points <= 7) risk10yr = 3;
        else if (points === 8) risk10yr = 4; else if (points === 9) risk10yr = 5; else if (points === 10) risk10yr = 6;
        else if (points === 11) risk10yr = 8; else if (points === 12) risk10yr = 10; else if (points === 13) risk10yr = 12;
        else if (points === 14) risk10yr = 16; else if (points === 15) risk10yr = 20; else if (points === 16) risk10yr = 25; else risk10yr = 30;
        let category = risk10yr < 10 ? "Low risk" : risk10yr < 20 ? "Moderate risk" : "High risk";
        return {
          primary: { label: "10-Year CVD Risk", value: formatNumber(risk10yr, 0) + "%" },
          details: [
            { label: "10-Year Risk", value: formatNumber(risk10yr, 0) + "%" },
            { label: "Risk Category", value: category },
            { label: "Point Total", value: formatNumber(points, 0) },
            { label: "Total Cholesterol", value: formatNumber(tc, 0) + " mg/dL" },
            { label: "HDL", value: formatNumber(hdl, 0) + " mg/dL" },
            { label: "Systolic BP", value: formatNumber(sbp, 0) + " mmHg" + (treated ? " (treated)" : "") },
          ],
          note: "Framingham Risk Score estimates 10-year CVD risk. High risk (>=20%) may warrant statin therapy. Discuss results with a healthcare provider.",
        };
      },
    },
  ],
  relatedSlugs: ["blood-pressure", "corrected-qt", "harris-benedict"],
  faq: [
    { question: "What is the Framingham Risk Score?", answer: "It estimates the 10-year risk of developing cardiovascular disease based on age, sex, cholesterol, blood pressure, smoking, and diabetes." },
    { question: "What is considered high risk?", answer: "A 10-year risk of 20% or higher is high risk, typically warranting statin therapy and lifestyle modification." },
    { question: "Is it accurate for everyone?", answer: "It was developed from a primarily Caucasian cohort. The ACC/AHA Pooled Cohort Equations may be more appropriate for diverse populations." },
  ],
  formula: "Framingham Risk Score uses points for age, cholesterol, HDL, BP, smoking, and diabetes to estimate 10-year CVD risk",
};
