import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const apacheScoreCalculator: CalculatorDefinition = {
  slug: "apache-score",
  title: "APACHE II Score Calculator",
  description: "Free APACHE II score calculator. Estimate ICU mortality risk using the Acute Physiology and Chronic Health Evaluation II scoring system.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["apache ii score", "apache 2 calculator", "icu mortality score", "acute physiology score", "critical care scoring"],
  variants: [
    {
      id: "apache-simplified",
      name: "APACHE II Simplified",
      description: "Simplified APACHE II score based on key physiological variables",
      fields: [
        { name: "age", label: "Age (years)", type: "number", placeholder: "e.g. 65", min: 15, max: 120 },
        { name: "temperature", label: "Temperature (C)", type: "number", placeholder: "e.g. 37.0", min: 25, max: 45, step: 0.1 },
        { name: "meanBP", label: "Mean Arterial Pressure (mmHg)", type: "number", placeholder: "e.g. 80", min: 20, max: 200 },
        { name: "heartRate", label: "Heart Rate (bpm)", type: "number", placeholder: "e.g. 80", min: 20, max: 250 },
        { name: "respRate", label: "Respiratory Rate (/min)", type: "number", placeholder: "e.g. 16", min: 0, max: 60 },
        { name: "sodium", label: "Sodium (mEq/L)", type: "number", placeholder: "e.g. 140", min: 100, max: 200 },
        { name: "potassium", label: "Potassium (mEq/L)", type: "number", placeholder: "e.g. 4.0", min: 1, max: 10, step: 0.1 },
        { name: "creatinine", label: "Creatinine (mg/dL)", type: "number", placeholder: "e.g. 1.0", min: 0.1, max: 20, step: 0.1 },
        { name: "hematocrit", label: "Hematocrit (%)", type: "number", placeholder: "e.g. 42", min: 10, max: 70 },
        { name: "wbc", label: "WBC (x1000/mm3)", type: "number", placeholder: "e.g. 8", min: 0, max: 100, step: 0.1 },
        { name: "gcs", label: "Glasgow Coma Scale", type: "number", placeholder: "e.g. 15", min: 3, max: 15 },
        { name: "chronicHealth", label: "Chronic Health", type: "select", options: [
          { label: "None", value: "0" },
          { label: "Non-operative severe organ insufficiency", value: "5" },
          { label: "Elective postoperative", value: "2" },
        ] },
      ],
      calculate: (inputs) => {
        const age = inputs.age as number;
        const temp = inputs.temperature as number;
        const map = inputs.meanBP as number;
        const hr = inputs.heartRate as number;
        const rr = inputs.respRate as number;
        const na = inputs.sodium as number;
        const k = inputs.potassium as number;
        const cr = inputs.creatinine as number;
        const hct = inputs.hematocrit as number;
        const wbc = inputs.wbc as number;
        const gcs = inputs.gcs as number;
        const chronic = parseInt(inputs.chronicHealth as string) || 0;
        if (!age || !temp || !map || !hr || !rr || !gcs) return null;
        let score = 0;
        if (age >= 75) score += 6;
        else if (age >= 65) score += 5;
        else if (age >= 55) score += 3;
        else if (age >= 45) score += 2;
        const tempDev = Math.abs(temp - 37);
        if (tempDev >= 4) score += 4; else if (tempDev >= 3) score += 3; else if (tempDev >= 2) score += 2; else if (tempDev >= 1) score += 1;
        if (map >= 160 || map < 50) score += 4; else if (map >= 130 || map < 70) score += 2; else if (map >= 110) score += 2;
        if (hr >= 180 || hr < 40) score += 4; else if (hr >= 140 || hr < 55) score += 3; else if (hr >= 110 || hr < 70) score += 2;
        if (rr >= 50 || rr < 6) score += 4; else if (rr >= 35) score += 3; else if (rr >= 25 || rr < 10) score += 1;
        if (na) { if (na >= 180 || na < 111) score += 4; else if (na >= 160 || na < 120) score += 3; else if (na >= 155 || na < 130) score += 2; else if (na >= 150) score += 1; }
        if (k) { if (k >= 7 || k < 2.5) score += 4; else if (k >= 6) score += 3; else if (k < 3) score += 2; else if (k >= 5.5) score += 1; }
        if (cr) { if (cr >= 3.5) score += 4; else if (cr >= 2) score += 3; else if (cr >= 1.5) score += 2; else if (cr < 0.6) score += 2; }
        if (hct) { if (hct >= 60 || hct < 20) score += 4; else if (hct >= 50 || hct < 30) score += 2; else if (hct >= 46) score += 1; }
        if (wbc) { if (wbc >= 40 || wbc < 1) score += 4; else if (wbc >= 20 || wbc < 3) score += 2; else if (wbc >= 15) score += 1; }
        score += (15 - gcs);
        score += chronic;
        let mortality = "";
        if (score <= 4) mortality = "Approx. 4% non-operative mortality";
        else if (score <= 9) mortality = "Approx. 8% non-operative mortality";
        else if (score <= 14) mortality = "Approx. 15% non-operative mortality";
        else if (score <= 19) mortality = "Approx. 25% non-operative mortality";
        else if (score <= 24) mortality = "Approx. 40% non-operative mortality";
        else if (score <= 29) mortality = "Approx. 55% non-operative mortality";
        else if (score <= 34) mortality = "Approx. 73% non-operative mortality";
        else mortality = "Approx. 85%+ non-operative mortality";
        let severity = "";
        if (score <= 9) severity = "Low severity";
        else if (score <= 19) severity = "Moderate severity";
        else if (score <= 29) severity = "High severity";
        else severity = "Very high severity";
        return {
          primary: { label: "APACHE II Score", value: formatNumber(score, 0) },
          details: [
            { label: "Total Score", value: formatNumber(score, 0) + " / 71" },
            { label: "Severity", value: severity },
            { label: "Estimated Mortality", value: mortality },
            { label: "Age Points", value: age >= 75 ? "6" : age >= 65 ? "5" : age >= 55 ? "3" : age >= 45 ? "2" : "0" },
            { label: "GCS Points", value: formatNumber(15 - gcs, 0) },
            { label: "Chronic Health Points", value: formatNumber(chronic, 0) },
          ],
          note: "APACHE II is validated for ICU populations. Score range 0-71. Higher scores indicate greater severity and mortality risk.",
        };
      },
    },
  ],
  relatedSlugs: ["qsofa-score", "news-score", "revised-trauma"],
  faq: [
    { question: "What is the APACHE II score?", answer: "APACHE II (Acute Physiology and Chronic Health Evaluation II) is a severity-of-disease scoring system used in ICUs to predict hospital mortality using physiological variables, age, and chronic health status." },
    { question: "What is a normal APACHE II score?", answer: "Scores range from 0-71. Scores 0-9 indicate low severity with about 4-8% mortality. Scores above 25 indicate very high severity with mortality exceeding 50%." },
    { question: "When is APACHE II used?", answer: "APACHE II is calculated within 24 hours of ICU admission using the worst values to assess illness severity and guide treatment decisions." },
  ],
  formula: "APACHE II = Age Points + Acute Physiology Score (12 variables) + Chronic Health Points",
};
