import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bradenScaleCalculator: CalculatorDefinition = {
  slug: "braden-scale",
  title: "Braden Scale Calculator",
  description: "Free Braden Scale calculator. Assess pressure ulcer risk using sensory perception, moisture, activity, mobility, nutrition, and friction/shear.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["braden scale", "braden score", "pressure ulcer risk", "pressure injury risk", "skin assessment nursing"],
  variants: [
    {
      id: "braden-assessment",
      name: "Braden Scale Assessment",
      fields: [
        { name: "sensory", label: "Sensory Perception", type: "select", options: [{ label: "1 - Completely limited", value: "1" }, { label: "2 - Very limited", value: "2" }, { label: "3 - Slightly limited", value: "3" }, { label: "4 - No impairment", value: "4" }] },
        { name: "moisture", label: "Moisture", type: "select", options: [{ label: "1 - Constantly moist", value: "1" }, { label: "2 - Very moist", value: "2" }, { label: "3 - Occasionally moist", value: "3" }, { label: "4 - Rarely moist", value: "4" }] },
        { name: "activity", label: "Activity", type: "select", options: [{ label: "1 - Bedfast", value: "1" }, { label: "2 - Chairfast", value: "2" }, { label: "3 - Walks occasionally", value: "3" }, { label: "4 - Walks frequently", value: "4" }] },
        { name: "mobility", label: "Mobility", type: "select", options: [{ label: "1 - Completely immobile", value: "1" }, { label: "2 - Very limited", value: "2" }, { label: "3 - Slightly limited", value: "3" }, { label: "4 - No limitations", value: "4" }] },
        { name: "nutrition", label: "Nutrition", type: "select", options: [{ label: "1 - Very poor", value: "1" }, { label: "2 - Probably inadequate", value: "2" }, { label: "3 - Adequate", value: "3" }, { label: "4 - Excellent", value: "4" }] },
        { name: "frictionShear", label: "Friction and Shear", type: "select", options: [{ label: "1 - Problem", value: "1" }, { label: "2 - Potential problem", value: "2" }, { label: "3 - No apparent problem", value: "3" }] },
      ],
      calculate: (inputs) => {
        const se = parseInt(inputs.sensory as string);
        const mo = parseInt(inputs.moisture as string);
        const ac = parseInt(inputs.activity as string);
        const mb = parseInt(inputs.mobility as string);
        const nu = parseInt(inputs.nutrition as string);
        const fr = parseInt(inputs.frictionShear as string);
        if (isNaN(se) || isNaN(mo) || isNaN(ac) || isNaN(mb) || isNaN(nu) || isNaN(fr)) return null;
        const score = se + mo + ac + mb + nu + fr;
        let risk = "";
        let interventions = "";
        if (score <= 9) { risk = "Very High Risk"; interventions = "Specialty mattress, q1-2h repositioning, moisture management, nutrition consult"; }
        else if (score <= 12) { risk = "High Risk"; interventions = "Specialty mattress, q2h repositioning, moisture barrier, nutritional support"; }
        else if (score <= 14) { risk = "Moderate Risk"; interventions = "Pressure redistribution, q2h repositioning, optimize nutrition"; }
        else if (score <= 18) { risk = "Mild Risk"; interventions = "Standard prevention: turning schedule, skin inspection, adequate nutrition"; }
        else { risk = "No Significant Risk"; interventions = "Continue routine care and skin assessment"; }
        return {
          primary: { label: "Braden Scale Score", value: formatNumber(score, 0) },
          details: [
            { label: "Total Score", value: formatNumber(score, 0) + " / 23" },
            { label: "Risk Level", value: risk },
            { label: "Interventions", value: interventions },
            { label: "Sensory Perception", value: formatNumber(se, 0) + " / 4" },
            { label: "Moisture", value: formatNumber(mo, 0) + " / 4" },
            { label: "Activity", value: formatNumber(ac, 0) + " / 4" },
            { label: "Mobility", value: formatNumber(mb, 0) + " / 4" },
            { label: "Nutrition", value: formatNumber(nu, 0) + " / 4" },
            { label: "Friction/Shear", value: formatNumber(fr, 0) + " / 3" },
          ],
          note: "Lower Braden scores = higher risk. Reassess: ICU q24-48h, acute care q48-72h, long-term care weekly.",
        };
      },
    },
  ],
  relatedSlugs: ["norton-scale", "morse-fall-scale", "news-score"],
  faq: [
    { question: "What is the Braden Scale?", answer: "The Braden Scale assesses pressure ulcer risk using 6 subscales scored 6-23. Lower scores mean higher risk." },
    { question: "What Braden score is high risk?", answer: "15-18: mild risk, 13-14: moderate, 10-12: high, 9 or below: very high risk." },
    { question: "How often should Braden be assessed?", answer: "ICU: q24-48h. Acute care: q48-72h. Long-term care: weekly and with condition changes." },
  ],
  formula: "Braden Score = Sensory + Moisture + Activity + Mobility + Nutrition + Friction/Shear (6-23)",
};
