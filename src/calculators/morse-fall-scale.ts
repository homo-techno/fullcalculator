import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const morseFallScaleCalculator: CalculatorDefinition = {
  slug: "morse-fall-scale",
  title: "Morse Fall Scale Calculator",
  description: "Free Morse Fall Scale calculator. Assess patient fall risk using history of falling, secondary diagnosis, ambulatory aid, IV therapy, gait, and mental status.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["morse fall scale", "fall risk assessment", "fall risk calculator", "patient safety", "nursing fall assessment", "fall prevention"],
  variants: [
    {
      id: "morse-fall",
      name: "Morse Fall Scale Assessment",
      fields: [
        { name: "fallHistory", label: "History of Falling (within 3 months)", type: "select", options: [{ label: "No", value: "0" }, { label: "Yes", value: "25" }] },
        { name: "secondaryDx", label: "Secondary Diagnosis", type: "select", options: [{ label: "No", value: "0" }, { label: "Yes", value: "15" }] },
        { name: "ambulatoryAid", label: "Ambulatory Aid", type: "select", options: [{ label: "None / Bedrest / Nurse Assist", value: "0" }, { label: "Crutches / Cane / Walker", value: "15" }, { label: "Furniture for support", value: "30" }] },
        { name: "ivTherapy", label: "IV Therapy / Heparin Lock", type: "select", options: [{ label: "No", value: "0" }, { label: "Yes", value: "20" }] },
        { name: "gait", label: "Gait / Transferring", type: "select", options: [{ label: "Normal / Bedrest / Immobile", value: "0" }, { label: "Weak", value: "10" }, { label: "Impaired", value: "20" }] },
        { name: "mentalStatus", label: "Mental Status", type: "select", options: [{ label: "Oriented to own ability", value: "0" }, { label: "Overestimates / Forgets limitations", value: "15" }] },
      ],
      calculate: (inputs) => {
        const fh = parseInt(inputs.fallHistory as string);
        const sd = parseInt(inputs.secondaryDx as string);
        const aa = parseInt(inputs.ambulatoryAid as string);
        const iv = parseInt(inputs.ivTherapy as string);
        const gt = parseInt(inputs.gait as string);
        const ms = parseInt(inputs.mentalStatus as string);
        if (isNaN(fh) || isNaN(sd) || isNaN(aa) || isNaN(iv) || isNaN(gt) || isNaN(ms)) return null;
        const score = fh + sd + aa + iv + gt + ms;
        let risk = "";
        let interventions = "";
        if (score >= 51) { risk = "High Risk"; interventions = "Implement high-risk fall prevention protocol: fall risk bracelet, bed alarm, non-skid footwear, assist with ambulation, hourly rounding"; }
        else if (score >= 25) { risk = "Moderate Risk"; interventions = "Standard fall prevention: orient to environment, call light within reach, assist as needed, non-skid footwear"; }
        else { risk = "Low Risk"; interventions = "Good basic nursing care: orient to environment, keep call light within reach"; }
        return {
          primary: { label: "Morse Fall Scale", value: formatNumber(score, 0) },
          details: [
            { label: "Total Score", value: formatNumber(score, 0) },
            { label: "Risk Level", value: risk },
            { label: "Interventions", value: interventions },
            { label: "Fall History", value: formatNumber(fh, 0) + " pts" },
            { label: "Secondary Diagnosis", value: formatNumber(sd, 0) + " pts" },
            { label: "Ambulatory Aid", value: formatNumber(aa, 0) + " pts" },
            { label: "IV/Heparin Lock", value: formatNumber(iv, 0) + " pts" },
            { label: "Gait", value: formatNumber(gt, 0) + " pts" },
            { label: "Mental Status", value: formatNumber(ms, 0) + " pts" },
          ],
          note: "Morse Fall Scale: 0-24 = low risk, 25-50 = moderate risk, 51+ = high risk. Reassess with change in condition, after a fall, and per facility protocol.",
        };
      },
    },
  ],
  relatedSlugs: ["braden-scale", "norton-scale", "news-score"],
  faq: [
    { question: "What is the Morse Fall Scale?", answer: "The Morse Fall Scale is a validated tool to assess fall risk in hospitalized patients. It evaluates 6 variables to produce a score that guides fall prevention interventions." },
    { question: "What score indicates high fall risk?", answer: "Scores 0-24: low risk, 25-50: moderate risk, 51+: high risk. Higher scores require more intensive fall prevention measures." },
    { question: "How often should fall risk be assessed?", answer: "Assess on admission, with change in condition, after a fall, on transfer, and per unit protocol (typically every shift or daily)." },
  ],
  formula: "Morse Fall Scale = Fall History + Secondary Dx + Ambulatory Aid + IV + Gait + Mental Status (0-125)",
};
