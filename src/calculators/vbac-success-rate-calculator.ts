import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vbacSuccessRateCalculator: CalculatorDefinition = {
  slug: "vbac-success-rate-calculator",
  title: "VBAC Success Rate Calculator",
  description: "Estimate the probability of a successful vaginal birth after cesarean (VBAC) based on clinical factors.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["vbac success rate", "vbac calculator", "vaginal birth after cesarean"],
  variants: [{
    id: "standard",
    name: "VBAC Success Rate",
    description: "Estimate the probability of a successful vaginal birth after cesarean (VBAC) based on clinical factors",
    fields: [
      { name: "age", label: "Maternal Age", type: "number", suffix: "years", min: 18, max: 50, defaultValue: 30 },
      { name: "previousVaginal", label: "Previous Vaginal Births", type: "select", options: [{value:"0",label:"None"},{value:"1",label:"1"},{value:"2",label:"2 or more"}], defaultValue: "0" },
      { name: "reasonForCS", label: "Reason for Prior Cesarean", type: "select", options: [{value:"nonrecurring",label:"Non-recurring (breech, fetal distress)"},{value:"failure",label:"Failure to progress"},{value:"elective",label:"Elective or scheduled"}], defaultValue: "nonrecurring" },
      { name: "bmi", label: "Current BMI", type: "number", min: 15, max: 60, step: 0.5, defaultValue: 26 },
    ],
    calculate: (inputs) => {
      const age = inputs.age as number;
      const prevVag = inputs.previousVaginal as string;
      const reason = inputs.reasonForCS as string;
      const bmi = inputs.bmi as number;
      if (!age || !bmi) return null;
      let score = 60;
      if (prevVag === "1") score += 15;
      else if (prevVag === "2") score += 20;
      if (reason === "nonrecurring") score += 10;
      else if (reason === "elective") score += 5;
      else score -= 5;
      if (age > 35) score -= 5;
      if (age > 40) score -= 5;
      if (bmi > 30) score -= 5;
      if (bmi > 35) score -= 5;
      score = Math.min(95, Math.max(20, score));
      const riskCategory = score >= 70 ? "Favorable candidate" : score >= 50 ? "Moderate candidate" : "Higher risk - discuss with provider";
      return {
        primary: { label: "Estimated VBAC Success Rate", value: formatNumber(score) + "%" },
        details: [
          { label: "Risk Category", value: riskCategory },
          { label: "Prior Vaginal Deliveries", value: prevVag === "0" ? "None" : prevVag },
          { label: "Maternal BMI", value: formatNumber(bmi) },
        ],
      };
    },
  }],
  relatedSlugs: ["bishop-score-calculator", "fertility-by-age-calculator"],
  faq: [
    { question: "What is the average VBAC success rate?", answer: "The overall VBAC success rate is approximately 60 to 80 percent. Factors such as previous vaginal delivery, reason for prior cesarean, and maternal health significantly influence the outcome." },
    { question: "Who is not a candidate for VBAC?", answer: "VBAC is generally not recommended for individuals with a classical (vertical) uterine incision, prior uterine rupture, or certain placental abnormalities. A healthcare provider should evaluate each case." },
  ],
  formula: "VBAC Score = Base 60 + Previous Vaginal Birth Bonus + Cesarean Reason Modifier - Age Penalty - BMI Penalty",
};
