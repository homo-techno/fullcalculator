import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sleepQualityCalculator: CalculatorDefinition = {
  slug: "sleep-quality-calculator",
  title: "Sleep Quality Calculator",
  description: "Free sleep quality calculator. Assess and track your sleep quality with our evidence-based tool.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["sleep quality calculator", "health calculator", "wellness tool"],
  variants: [
    {
      id: "standard",
      name: "Sleep Quality",
      description: "Free sleep quality calculator. Assess and track your sleep quality with our evid",
      fields: [
        {
          name: "bedtime",
          label: "Time to Fall Asleep",
          type: "number",
          placeholder: "e.g. 20",
          suffix: "minutes",
          min: 0,
          max: 180,
        },
        {
          name: "totalSleep",
          label: "Total Sleep Time",
          type: "number",
          placeholder: "e.g. 7",
          suffix: "hours",
          min: 0,
          max: 14,
          step: 0.5,
        },
        {
          name: "wakeups",
          label: "Night Wakeups",
          type: "number",
          placeholder: "e.g. 2",
          min: 0,
          max: 20,
        },
        {
          name: "wakeupTime",
          label: "Time Awake at Night",
          type: "number",
          placeholder: "e.g. 15",
          suffix: "minutes",
          min: 0,
          max: 300,
        }
      ],
      calculate: (inputs) => {
        const latency = inputs.bedtime as number;
        const total = inputs.totalSleep as number;
        const wakeups = inputs.wakeups as number;
        const wakeTime = inputs.wakeupTime as number || 0;
        if (latency === undefined || !total) return null;
        const timeInBed = total + latency / 60 + wakeTime / 60;
        const efficiency = (total / timeInBed) * 100;
        const latencyScore = latency <= 15 ? 3 : latency <= 30 ? 2 : latency <= 60 ? 1 : 0;
        const durationScore = total >= 7 ? 3 : total >= 6 ? 2 : 1;
        const wakeScore = (wakeups || 0) <= 1 ? 3 : (wakeups || 0) <= 3 ? 2 : 1;
        const qualityScore = Math.round(((latencyScore + durationScore + wakeScore) / 9) * 100);
        const rating = qualityScore >= 75 ? "Good" : qualityScore >= 50 ? "Fair" : "Poor";
        return {
          primary: { label: "Sleep Quality", value: qualityScore + "/100 (" + rating + ")" },
          details: [
            { label: "Sleep efficiency", value: formatNumber(efficiency) + "%" },
            { label: "Sleep latency", value: latency + " minutes" },
            { label: "Total sleep", value: total + " hours" },
            { label: "Sleep cycles (est.)", value: Math.round(total / 1.5) + " cycles" },
          ],
        };
      },
    }
  ],
  relatedSlugs: ["bmi-calculator", "calorie-calculator"],
  faq: [
    {
      question: "How is the sleep quality measured?",
      answer: "This calculator uses multiple factors to provide an overall score. It is meant for educational purposes and is not a medical diagnosis.",
    },
    {
      question: "Should I consult a doctor?",
      answer: "This calculator is for informational purposes only. Always consult healthcare professionals for medical advice and treatment.",
    }
  ],
  formula: "Score based on multiple weighted factors",
};
