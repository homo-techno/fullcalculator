import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const burnoutRiskCalculator: CalculatorDefinition = {
  slug: "burnout-risk-calculator",
  title: "Burnout Risk Calculator",
  description: "Free burnout risk calculator. Assess and track your burnout risk with our evidence-based tool.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["burnout risk calculator", "health calculator", "wellness tool"],
  variants: [
    {
      id: "standard",
      name: "Burnout Risk",
      description: "Free burnout risk calculator. Assess and track your burnout risk with our eviden",
      fields: [
        {
          name: "workHours",
          label: "Weekly Work Hours",
          type: "number",
          placeholder: "e.g. 50",
          suffix: "hrs",
          min: 0,
          max: 100,
        },
        {
          name: "vacationDays",
          label: "Vacation Days Taken/Year",
          type: "number",
          placeholder: "e.g. 10",
          min: 0,
          max: 365,
        },
        {
          name: "satisfaction",
          label: "Job Satisfaction (1-10)",
          type: "number",
          placeholder: "e.g. 5",
          min: 1,
          max: 10,
        },
        {
          name: "autonomy",
          label: "Work Autonomy (1-10)",
          type: "number",
          placeholder: "e.g. 6",
          min: 1,
          max: 10,
        },
        {
          name: "sleepQuality",
          label: "Sleep Quality (1-10)",
          type: "number",
          placeholder: "e.g. 5",
          min: 1,
          max: 10,
        }
      ],
      calculate: (inputs) => {
        const hours = inputs.workHours as number;
        const vacation = inputs.vacationDays as number;
        const satisfaction = inputs.satisfaction as number;
        const autonomy = inputs.autonomy as number;
        const sleep = inputs.sleepQuality as number;
        if (!hours || !satisfaction || !autonomy || !sleep) return null;
        const hoursScore = hours > 55 ? 9 : hours > 45 ? 6 : hours > 35 ? 3 : 1;
        const vacationScore = (vacation || 0) < 5 ? 8 : (vacation || 0) < 15 ? 4 : 1;
        const risk = Math.round((hoursScore + vacationScore + (10 - satisfaction) + (10 - autonomy) + (10 - sleep)) / 5 * 10);
        const level = risk > 70 ? "High Risk" : risk > 40 ? "Moderate Risk" : "Low Risk";
        return {
          primary: { label: "Burnout Risk", value: risk + "/100 (" + level + ")" },
          details: [
            { label: "Work hours factor", value: hoursScore + "/10" },
            { label: "Recovery factor", value: vacationScore + "/10" },
            { label: "Satisfaction factor", value: (10 - satisfaction) + "/10" },
            { label: "Autonomy factor", value: (10 - autonomy) + "/10" },
          ],
        };
      },
    }
  ],
  relatedSlugs: ["bmi-calculator", "calorie-calculator"],
  faq: [
    {
      question: "How is the burnout risk measured?",
      answer: "This calculator uses multiple factors to provide an overall score. It is meant for educational purposes and is not a medical diagnosis.",
    },
    {
      question: "Should I consult a doctor?",
      answer: "This calculator is for informational purposes only. Always consult healthcare professionals for medical advice and treatment.",
    }
  ],
  formula: "Score based on multiple weighted factors",
};
