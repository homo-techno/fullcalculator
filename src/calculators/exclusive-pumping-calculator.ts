import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const exclusivePumpingCalculator: CalculatorDefinition = {
  slug: "exclusive-pumping-calculator",
  title: "Exclusive Pumping Calculator",
  description: "Plan an exclusive pumping schedule with estimated daily output, session frequency, and storage needs.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["exclusive pumping", "pumping schedule calculator", "breast pump output"],
  variants: [{
    id: "standard",
    name: "Exclusive Pumping",
    description: "Plan an exclusive pumping schedule with estimated daily output, session frequency, and storage needs",
    fields: [
      { name: "sessionsPerDay", label: "Pumping Sessions Per Day", type: "number", min: 4, max: 12, defaultValue: 8 },
      { name: "ozPerSession", label: "Average Output Per Session", type: "number", suffix: "oz", min: 0.5, max: 10, step: 0.5, defaultValue: 3.5 },
      { name: "babyAgeMo", label: "Baby Age", type: "number", suffix: "months", min: 0, max: 12, defaultValue: 2 },
      { name: "babyWeightLbs", label: "Baby Weight", type: "number", suffix: "lbs", min: 4, max: 25, step: 0.5, defaultValue: 10 },
    ],
    calculate: (inputs) => {
      const sessions = inputs.sessionsPerDay as number;
      const ozPer = inputs.ozPerSession as number;
      const ageMo = inputs.babyAgeMo as number;
      const weightLbs = inputs.babyWeightLbs as number;
      if (!sessions || !ozPer || !weightLbs || weightLbs <= 0) return null;
      const dailyOutput = sessions * ozPer;
      const dailyNeed = Math.min(32, weightLbs * 2.5);
      const surplus = dailyOutput - dailyNeed;
      const minutesBetween = Math.round((24 * 60) / sessions);
      return {
        primary: { label: "Daily Pumping Output", value: formatNumber(Math.round(dailyOutput * 10) / 10) + " oz" },
        details: [
          { label: "Baby Daily Need", value: formatNumber(Math.round(dailyNeed * 10) / 10) + " oz" },
          { label: "Surplus or Deficit", value: (surplus >= 0 ? "+" : "") + formatNumber(Math.round(surplus * 10) / 10) + " oz" },
          { label: "Minutes Between Sessions", value: formatNumber(minutesBetween) + " min" },
        ],
      };
    },
  }],
  relatedSlugs: ["baby-milk-intake-calculator", "baby-formula-amount-calculator"],
  faq: [
    { question: "How many pumping sessions per day are recommended?", answer: "Most exclusive pumping guidelines recommend 8 to 12 sessions per day in the early weeks, gradually reducing to 6 to 8 sessions after milk supply is established around 12 weeks." },
    { question: "What is a normal pumping output per session?", answer: "A typical output is 2 to 4 ounces per session once supply is established. Output varies throughout the day and tends to be higher in the morning." },
  ],
  formula: "Daily Output = Sessions Per Day x Average Output Per Session; Baby Need = Weight (lbs) x 2.5 oz/lb",
};
