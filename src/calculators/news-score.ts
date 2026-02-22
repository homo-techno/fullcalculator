import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const newsScoreCalculator: CalculatorDefinition = {
  slug: "news-score",
  title: "National Early Warning Score (NEWS2) Calculator",
  description: "Free NEWS2 calculator. Calculate the National Early Warning Score to detect clinical deterioration and guide escalation of care in adult patients.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["news score", "news2", "early warning score", "clinical deterioration", "sepsis screening", "rapid response"],
  variants: [
    {
      id: "news2",
      name: "NEWS2 Assessment",
      fields: [
        { name: "respRate", label: "Respiratory Rate (/min)", type: "number", placeholder: "e.g. 16", min: 0, max: 60 },
        { name: "spo2", label: "SpO2 (%)", type: "number", placeholder: "e.g. 96", min: 50, max: 100 },
        { name: "onO2", label: "Supplemental Oxygen?", type: "select", options: [{ label: "No (room air)", value: "0" }, { label: "Yes", value: "2" }] },
        { name: "temperature", label: "Temperature (C)", type: "number", placeholder: "e.g. 37.0", min: 30, max: 43, step: 0.1 },
        { name: "systolic", label: "Systolic BP (mmHg)", type: "number", placeholder: "e.g. 120", min: 40, max: 280 },
        { name: "heartRate", label: "Heart Rate (bpm)", type: "number", placeholder: "e.g. 75", min: 20, max: 250 },
        { name: "consciousness", label: "Level of Consciousness", type: "select", options: [{ label: "Alert", value: "0" }, { label: "Confusion (new)", value: "3" }, { label: "Voice responsive", value: "3" }, { label: "Pain responsive", value: "3" }, { label: "Unresponsive", value: "3" }] },
      ],
      calculate: (inputs) => {
        const rr = inputs.respRate as number;
        const spo2 = inputs.spo2 as number;
        const o2 = parseInt(inputs.onO2 as string);
        const temp = inputs.temperature as number;
        const sbp = inputs.systolic as number;
        const hr = inputs.heartRate as number;
        const loc = parseInt(inputs.consciousness as string);
        if (!rr || !spo2 || !temp || !sbp || !hr) return null;
        let score = 0;
        // Resp rate
        if (rr <= 8) score += 3; else if (rr <= 11) score += 1; else if (rr <= 20) score += 0; else if (rr <= 24) score += 2; else score += 3;
        // SpO2 (Scale 1)
        if (spo2 <= 91) score += 3; else if (spo2 <= 93) score += 2; else if (spo2 <= 95) score += 1; else score += 0;
        // Supplemental O2
        score += o2;
        // Temperature
        if (temp <= 35.0) score += 3; else if (temp <= 36.0) score += 1; else if (temp <= 38.0) score += 0; else if (temp <= 39.0) score += 1; else score += 2;
        // Systolic BP
        if (sbp <= 90) score += 3; else if (sbp <= 100) score += 2; else if (sbp <= 110) score += 1; else if (sbp <= 219) score += 0; else score += 3;
        // Heart rate
        if (hr <= 40) score += 3; else if (hr <= 50) score += 1; else if (hr <= 90) score += 0; else if (hr <= 110) score += 1; else if (hr <= 130) score += 2; else score += 3;
        // Consciousness
        score += loc;
        let risk = "";
        let response = "";
        if (score >= 7) { risk = "High clinical risk"; response = "Urgent/emergency response - continuous monitoring, senior clinician review"; }
        else if (score >= 5) { risk = "Medium clinical risk"; response = "Urgent response - increase monitoring frequency, clinician assessment"; }
        else if (score >= 1) { risk = "Low clinical risk"; response = "Ward-based assessment - inform registered nurse, increase monitoring"; }
        else { risk = "Low clinical risk"; response = "Continue routine monitoring"; }
        let singleParam = false;
        // Check for any single parameter scoring 3
        const rrPts = rr <= 8 ? 3 : rr >= 25 ? 3 : 0;
        const spo2Pts = spo2 <= 91 ? 3 : 0;
        const sbpPts = sbp <= 90 ? 3 : sbp >= 220 ? 3 : 0;
        const hrPts = hr <= 40 ? 3 : hr >= 131 ? 3 : 0;
        const tempPts = temp <= 35.0 ? 3 : 0;
        if (rrPts === 3 || spo2Pts === 3 || sbpPts === 3 || hrPts === 3 || tempPts === 3 || loc === 3) singleParam = true;
        if (singleParam && score < 5) { risk = "Low-Medium clinical risk (single parameter 3)"; response = "Urgent ward-based response - clinician review within 30 minutes"; }
        return {
          primary: { label: "NEWS2 Score", value: formatNumber(score, 0) },
          details: [
            { label: "Total Score", value: formatNumber(score, 0) + " / 20" },
            { label: "Clinical Risk", value: risk },
            { label: "Recommended Response", value: response },
            { label: "Single Parameter 3?", value: singleParam ? "Yes - triggers escalation" : "No" },
          ],
          note: "NEWS2 aggregate score: 0 = low risk, 1-4 = low, 5-6 or single param 3 = medium, 7+ = high risk. Reassess frequency based on score. Validated for adult inpatients.",
        };
      },
    },
  ],
  relatedSlugs: ["qsofa-score", "apache-score", "revised-trauma"],
  faq: [
    { question: "What is NEWS2?", answer: "NEWS2 (National Early Warning Score 2) is a standardized system for detecting clinical deterioration in adults. It scores 6 physiological parameters plus consciousness level." },
    { question: "What NEWS2 score triggers escalation?", answer: "Score 5-6 or any single parameter of 3: medium risk with urgent response. Score 7+: high risk requiring emergency response." },
    { question: "How often should NEWS2 be assessed?", answer: "Score 0: minimum q12h. Score 1-4: minimum q4-6h. Score 5-6: minimum q1h. Score 7+: continuous monitoring." },
  ],
  formula: "NEWS2 = RR + SpO2 + Supplemental O2 + Temperature + Systolic BP + Heart Rate + Consciousness (0-20)",
};
