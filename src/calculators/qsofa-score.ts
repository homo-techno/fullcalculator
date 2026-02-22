import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const qsofaScoreCalculator: CalculatorDefinition = {
  slug: "qsofa-score",
  title: "qSOFA Score Calculator",
  description: "Free qSOFA (quick Sequential Organ Failure Assessment) calculator. Screen for sepsis risk at the bedside using mental status, respiratory rate, and blood pressure.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["qsofa", "qsofa score", "sepsis screening", "quick sofa", "sepsis calculator", "sepsis criteria"],
  variants: [
    {
      id: "qsofa",
      name: "qSOFA Score",
      fields: [
        { name: "alteredMental", label: "Altered Mental Status (GCS < 15)", type: "select", options: [{ label: "No", value: "0" }, { label: "Yes", value: "1" }] },
        { name: "respRate", label: "Respiratory Rate >= 22/min", type: "select", options: [{ label: "No (RR < 22)", value: "0" }, { label: "Yes (RR >= 22)", value: "1" }] },
        { name: "systolic", label: "Systolic BP <= 100 mmHg", type: "select", options: [{ label: "No (SBP > 100)", value: "0" }, { label: "Yes (SBP <= 100)", value: "1" }] },
      ],
      calculate: (inputs) => {
        const mental = parseInt(inputs.alteredMental as string);
        const rr = parseInt(inputs.respRate as string);
        const sbp = parseInt(inputs.systolic as string);
        if (isNaN(mental) || isNaN(rr) || isNaN(sbp)) return null;
        const score = mental + rr + sbp;
        let risk = "";
        let action = "";
        if (score >= 2) {
          risk = "High risk for poor outcome";
          action = "Suspect sepsis - obtain blood cultures, lactate, start empiric antibiotics within 1 hour, assess for organ dysfunction (full SOFA), consider ICU";
        } else if (score === 1) {
          risk = "Intermediate risk";
          action = "Monitor closely, reassess frequently, consider infection workup if clinical suspicion";
        } else {
          risk = "Low risk";
          action = "Low likelihood of sepsis based on qSOFA alone - continue standard assessment";
        }
        return {
          primary: { label: "qSOFA Score", value: formatNumber(score, 0) + " / 3" },
          details: [
            { label: "Total Score", value: formatNumber(score, 0) + " / 3" },
            { label: "Risk Level", value: risk },
            { label: "Recommended Action", value: action },
            { label: "Altered Mental Status", value: mental === 1 ? "Present (+1)" : "Absent (0)" },
            { label: "Respiratory Rate >= 22", value: rr === 1 ? "Yes (+1)" : "No (0)" },
            { label: "Systolic BP <= 100", value: sbp === 1 ? "Yes (+1)" : "No (0)" },
          ],
          note: "qSOFA >= 2 suggests higher risk of poor outcomes and should prompt further evaluation for sepsis. qSOFA is a screening tool, not diagnostic. Use with Sepsis-3 criteria.",
        };
      },
    },
  ],
  relatedSlugs: ["news-score", "apache-score", "revised-trauma"],
  faq: [
    { question: "What is qSOFA?", answer: "qSOFA (quick Sequential Organ Failure Assessment) is a bedside screening tool for sepsis. It uses 3 criteria: altered mental status, RR >= 22, SBP <= 100 mmHg." },
    { question: "What does a qSOFA score of 2 mean?", answer: "A score of 2 or higher indicates increased risk of poor outcomes and should prompt evaluation for organ dysfunction and initiation of sepsis management." },
    { question: "Is qSOFA the same as SOFA?", answer: "No. qSOFA is a simplified bedside screen. SOFA is the full Sequential Organ Failure Assessment requiring lab values. qSOFA is a trigger for further workup." },
  ],
  formula: "qSOFA = Altered Mental Status (1) + RR >= 22 (1) + SBP <= 100 (1) | Score 0-3",
};
