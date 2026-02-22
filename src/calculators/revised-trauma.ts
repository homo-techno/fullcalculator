import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const revisedTraumaCalculator: CalculatorDefinition = {
  slug: "revised-trauma",
  title: "Revised Trauma Score Calculator",
  description: "Free Revised Trauma Score (RTS) calculator. Assess trauma severity and predict survival using GCS, systolic blood pressure, and respiratory rate.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["revised trauma score", "rts calculator", "trauma severity", "trauma triage", "injury severity", "trauma assessment"],
  variants: [
    {
      id: "rts",
      name: "Revised Trauma Score",
      fields: [
        { name: "gcs", label: "Glasgow Coma Scale", type: "select", options: [
          { label: "13-15", value: "4" },
          { label: "9-12", value: "3" },
          { label: "6-8", value: "2" },
          { label: "4-5", value: "1" },
          { label: "3", value: "0" },
        ] },
        { name: "systolic", label: "Systolic Blood Pressure (mmHg)", type: "select", options: [
          { label: "> 89 mmHg", value: "4" },
          { label: "76-89 mmHg", value: "3" },
          { label: "50-75 mmHg", value: "2" },
          { label: "1-49 mmHg", value: "1" },
          { label: "0 mmHg", value: "0" },
        ] },
        { name: "respRate", label: "Respiratory Rate (/min)", type: "select", options: [
          { label: "10-29", value: "4" },
          { label: "6-9", value: "3" },
          { label: "> 29", value: "2" },
          { label: "1-5", value: "1" },
          { label: "0", value: "0" },
        ] },
      ],
      calculate: (inputs) => {
        const gcsCode = parseInt(inputs.gcs as string);
        const sbpCode = parseInt(inputs.systolic as string);
        const rrCode = parseInt(inputs.respRate as string);
        if (isNaN(gcsCode) || isNaN(sbpCode) || isNaN(rrCode)) return null;
        const rts = (0.9368 * gcsCode) + (0.7326 * sbpCode) + (0.2908 * rrCode);
        const traigeRts = gcsCode + sbpCode + rrCode;
        let survival = "";
        if (rts >= 7.84) survival = "Probability of survival > 97%";
        else if (rts >= 6.0) survival = "Probability of survival 60-90%";
        else if (rts >= 4.0) survival = "Probability of survival 30-60%";
        else if (rts >= 2.0) survival = "Probability of survival 10-30%";
        else survival = "Probability of survival < 10%";
        let triage = "";
        if (traigeRts === 12) triage = "Minor/Delayed (Green)";
        else if (traigeRts >= 11) triage = "Urgent (Yellow)";
        else if (traigeRts >= 3) triage = "Immediate (Red)";
        else triage = "Expectant (Black)";
        return {
          primary: { label: "Revised Trauma Score", value: formatNumber(rts, 2) },
          details: [
            { label: "RTS (Weighted)", value: formatNumber(rts, 2) },
            { label: "Triage RTS", value: formatNumber(traigeRts, 0) + " / 12" },
            { label: "Survival Estimate", value: survival },
            { label: "Triage Category", value: triage },
            { label: "GCS Coded Value", value: formatNumber(gcsCode, 0) },
            { label: "SBP Coded Value", value: formatNumber(sbpCode, 0) },
            { label: "RR Coded Value", value: formatNumber(rrCode, 0) },
          ],
          note: "RTS ranges 0-7.84. Higher scores indicate better prognosis. Triage RTS < 11 should be triaged to a trauma center. The weighted RTS is used for outcome prediction.",
        };
      },
    },
  ],
  relatedSlugs: ["pediatric-gcs", "apache-score", "qsofa-score"],
  faq: [
    { question: "What is the Revised Trauma Score?", answer: "The RTS is a physiologic scoring system using GCS, systolic BP, and respiratory rate to predict trauma survival. Maximum score is 7.84 (best prognosis)." },
    { question: "How is RTS used in triage?", answer: "Triage RTS (unweighted sum, 0-12) guides field triage. Scores < 11 suggest transport to a trauma center. Scores of 12 indicate minor injuries." },
    { question: "What is the difference between triage RTS and weighted RTS?", answer: "Triage RTS is the simple sum (0-12) used in the field. Weighted RTS applies coefficients (GCS x 0.9368 + SBP x 0.7326 + RR x 0.2908) for survival prediction." },
  ],
  formula: "RTS = 0.9368 x GCS code + 0.7326 x SBP code + 0.2908 x RR code | Range: 0-7.84",
};
