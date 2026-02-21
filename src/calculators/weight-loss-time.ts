import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weightLossTimeCalculator: CalculatorDefinition = {
  slug: "weight-loss-time-calculator",
  title: "Weight Loss Time Calculator",
  description:
    "Free weight loss time calculator. Estimate how long it will take to reach your goal weight based on your calorie deficit and activity level.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "weight loss time calculator",
    "how long to lose weight",
    "weight loss timeline",
    "weight loss duration",
    "calorie deficit weight loss",
  ],
  variants: [
    {
      id: "timeline",
      name: "Weight Loss Timeline",
      description: "Calculate time to reach your goal weight",
      fields: [
        { name: "currentWeight", label: "Current Weight (lbs)", type: "number", placeholder: "e.g. 200" },
        { name: "goalWeight", label: "Goal Weight (lbs)", type: "number", placeholder: "e.g. 170" },
        {
          name: "rate",
          label: "Weight Loss Rate",
          type: "select",
          options: [
            { label: "Slow (0.5 lbs/week - 250 cal deficit)", value: "0.5" },
            { label: "Moderate (1 lb/week - 500 cal deficit)", value: "1" },
            { label: "Fast (1.5 lbs/week - 750 cal deficit)", value: "1.5" },
            { label: "Aggressive (2 lbs/week - 1000 cal deficit)", value: "2" },
          ],
          defaultValue: "1",
        },
      ],
      calculate: (inputs) => {
        const current = inputs.currentWeight as number;
        const goal = inputs.goalWeight as number;
        const rate = parseFloat(inputs.rate as string);
        if (!current || !goal || !rate) return null;

        const tolose = current - goal;
        if (tolose <= 0) return null;

        const weeks = tolose / rate;
        const months = weeks / 4.33;
        const days = weeks * 7;

        const dailyDeficit = rate * 500; // 3500 cal per pound / 7 days
        const totalCalDeficit = tolose * 3500;

        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + Math.round(days));
        const dateStr = targetDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

        return {
          primary: { label: "Time to Goal", value: formatNumber(weeks, 0), suffix: "weeks" },
          details: [
            { label: "Approximately", value: `${formatNumber(months, 1)} months` },
            { label: "Target Date", value: dateStr },
            { label: "Weight to Lose", value: `${formatNumber(tolose, 0)} lbs` },
            { label: "Weekly Rate", value: `${rate} lbs/week` },
            { label: "Daily Calorie Deficit", value: `${formatNumber(dailyDeficit, 0)} cal` },
            { label: "Total Calorie Deficit Needed", value: `${formatNumber(totalCalDeficit, 0)} cal` },
          ],
          note: "A safe rate of weight loss is 1-2 lbs per week. Faster rates may lead to muscle loss, nutrient deficiencies, and metabolic slowdown. Consult a healthcare provider for personalized guidance.",
        };
      },
    },
    {
      id: "by-deficit",
      name: "From Calorie Deficit",
      description: "Calculate weight loss from a specific daily calorie deficit",
      fields: [
        { name: "currentWeight", label: "Current Weight (lbs)", type: "number", placeholder: "e.g. 200" },
        { name: "goalWeight", label: "Goal Weight (lbs)", type: "number", placeholder: "e.g. 170" },
        { name: "tdee", label: "Daily TDEE (calories)", type: "number", placeholder: "e.g. 2500" },
        { name: "intake", label: "Daily Calorie Intake", type: "number", placeholder: "e.g. 2000" },
      ],
      calculate: (inputs) => {
        const current = inputs.currentWeight as number;
        const goal = inputs.goalWeight as number;
        const tdee = inputs.tdee as number;
        const intake = inputs.intake as number;
        if (!current || !goal || !tdee || !intake) return null;

        const tolose = current - goal;
        if (tolose <= 0) return null;

        const dailyDeficit = tdee - intake;
        if (dailyDeficit <= 0) return { primary: { label: "Error", value: "Intake must be less than TDEE" }, details: [] };

        const weeklyLoss = (dailyDeficit * 7) / 3500;
        const weeks = tolose / weeklyLoss;
        const months = weeks / 4.33;
        const days = weeks * 7;

        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + Math.round(days));
        const dateStr = targetDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

        return {
          primary: { label: "Time to Goal", value: formatNumber(weeks, 0), suffix: "weeks" },
          details: [
            { label: "Approximately", value: `${formatNumber(months, 1)} months` },
            { label: "Target Date", value: dateStr },
            { label: "Daily Deficit", value: `${formatNumber(dailyDeficit, 0)} cal` },
            { label: "Weekly Loss Rate", value: `${formatNumber(weeklyLoss, 1)} lbs/week` },
            { label: "Weight to Lose", value: `${formatNumber(tolose, 0)} lbs` },
          ],
          note: "This calculation assumes a constant TDEE. In reality, your TDEE decreases as you lose weight, so actual timelines may be 10-20% longer.",
        };
      },
    },
  ],
  relatedSlugs: ["calorie-calculator", "tdee-calculator", "calorie-deficit-calculator", "bmi-calculator"],
  faq: [
    {
      question: "How long does it take to lose 20 pounds?",
      answer:
        "At a healthy rate of 1-2 lbs per week, losing 20 lbs takes approximately 10-20 weeks (2.5-5 months). At 1 lb/week (500 cal daily deficit), it takes about 20 weeks. At 2 lbs/week (1000 cal deficit), about 10 weeks.",
    },
    {
      question: "Is it safe to lose 2 pounds per week?",
      answer:
        "For most overweight individuals, 2 lbs/week is considered the maximum safe rate. This requires a 1000-calorie daily deficit. Faster rates increase risk of muscle loss, gallstones, and nutritional deficiencies. Those with less to lose should aim for 0.5-1 lb/week.",
    },
    {
      question: "Why does weight loss slow down over time?",
      answer:
        "As you lose weight, your body requires fewer calories (lower TDEE), reducing your calorie deficit unless you adjust intake or activity. Additionally, metabolic adaptation can reduce TDEE by 5-15% beyond what weight loss alone would predict.",
    },
  ],
  formula: "Weeks = Weight to Lose / Weekly Rate | 1 lb fat = ~3,500 calories | Daily Deficit = TDEE - Intake",
};
