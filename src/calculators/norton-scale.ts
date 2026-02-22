import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const nortonScaleCalculator: CalculatorDefinition = {
  slug: "norton-scale",
  title: "Norton Scale Calculator",
  description: "Free Norton Scale calculator. Assess pressure ulcer risk using physical condition, mental condition, activity, mobility, and incontinence.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["norton scale", "norton score", "pressure ulcer risk", "pressure sore assessment", "skin integrity", "nursing assessment"],
  variants: [
    {
      id: "norton-assessment",
      name: "Norton Scale Assessment",
      fields: [
        { name: "physical", label: "Physical Condition", type: "select", options: [{ label: "4 - Good", value: "4" }, { label: "3 - Fair", value: "3" }, { label: "2 - Poor", value: "2" }, { label: "1 - Very bad", value: "1" }] },
        { name: "mental", label: "Mental Condition", type: "select", options: [{ label: "4 - Alert", value: "4" }, { label: "3 - Apathetic", value: "3" }, { label: "2 - Confused", value: "2" }, { label: "1 - Stuporous", value: "1" }] },
        { name: "activity", label: "Activity", type: "select", options: [{ label: "4 - Ambulant", value: "4" }, { label: "3 - Walks with help", value: "3" }, { label: "2 - Chairbound", value: "2" }, { label: "1 - Bedbound", value: "1" }] },
        { name: "mobility", label: "Mobility", type: "select", options: [{ label: "4 - Full", value: "4" }, { label: "3 - Slightly limited", value: "3" }, { label: "2 - Very limited", value: "2" }, { label: "1 - Immobile", value: "1" }] },
        { name: "incontinence", label: "Incontinence", type: "select", options: [{ label: "4 - None", value: "4" }, { label: "3 - Occasional", value: "3" }, { label: "2 - Usually urinary", value: "2" }, { label: "1 - Doubly incontinent", value: "1" }] },
      ],
      calculate: (inputs) => {
        const ph = parseInt(inputs.physical as string);
        const me = parseInt(inputs.mental as string);
        const ac = parseInt(inputs.activity as string);
        const mo = parseInt(inputs.mobility as string);
        const ic = parseInt(inputs.incontinence as string);
        if (isNaN(ph) || isNaN(me) || isNaN(ac) || isNaN(mo) || isNaN(ic)) return null;
        const score = ph + me + ac + mo + ic;
        let risk = "";
        let interventions = "";
        if (score <= 10) { risk = "High Risk"; interventions = "Intensive prevention: specialty surface, q2h turning, skin care protocol, nutrition optimization"; }
        else if (score <= 14) { risk = "Medium Risk"; interventions = "Active prevention: pressure redistribution, regular repositioning, skin inspection, nutrition assessment"; }
        else if (score <= 18) { risk = "Low Risk"; interventions = "Standard care: routine skin assessment, adequate nutrition, mobility encouragement"; }
        else { risk = "Minimal Risk"; interventions = "Continue routine care and monitoring"; }
        return {
          primary: { label: "Norton Scale Score", value: formatNumber(score, 0) },
          details: [
            { label: "Total Score", value: formatNumber(score, 0) + " / 20" },
            { label: "Risk Level", value: risk },
            { label: "Interventions", value: interventions },
            { label: "Physical Condition", value: formatNumber(ph, 0) + " / 4" },
            { label: "Mental Condition", value: formatNumber(me, 0) + " / 4" },
            { label: "Activity", value: formatNumber(ac, 0) + " / 4" },
            { label: "Mobility", value: formatNumber(mo, 0) + " / 4" },
            { label: "Incontinence", value: formatNumber(ic, 0) + " / 4" },
          ],
          note: "Norton Scale range: 5-20. Scores 14 or below indicate risk for pressure ulcer development. Lower scores = higher risk. Reassess regularly and with changes in condition.",
        };
      },
    },
  ],
  relatedSlugs: ["braden-scale", "morse-fall-scale", "news-score"],
  faq: [
    { question: "What is the Norton Scale?", answer: "The Norton Scale is one of the original pressure ulcer risk assessment tools. It evaluates 5 categories (physical condition, mental condition, activity, mobility, incontinence) scoring 5-20." },
    { question: "How does Norton compare to Braden?", answer: "Both assess pressure ulcer risk. Norton is simpler (5 items). Braden is more detailed (6 items) and more widely used. Lower Norton scores = higher risk (opposite direction from some scales)." },
    { question: "What Norton score is considered at risk?", answer: "Scores of 14 or below are considered at risk for pressure ulcer development. Scores of 10 or below indicate high risk." },
  ],
  formula: "Norton Score = Physical + Mental + Activity + Mobility + Incontinence (5-20)",
};
