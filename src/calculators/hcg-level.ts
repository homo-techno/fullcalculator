import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hcgLevelCalculator: CalculatorDefinition = {
  slug: "hcg-level-calculator",
  title: "HCG Level Doubling Time Calculator",
  description:
    "Free HCG doubling time calculator. Track your hCG levels and calculate doubling time to monitor early pregnancy progression.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "hCG doubling time",
    "hCG level calculator",
    "hCG levels in pregnancy",
    "beta hCG calculator",
    "hCG doubling rate",
  ],
  variants: [
    {
      id: "hcg-doubling",
      name: "HCG Doubling Time",
      description: "Calculate how fast your hCG levels are doubling",
      fields: [
        {
          name: "firstLevel",
          label: "First hCG Level (mIU/mL)",
          type: "number",
          placeholder: "e.g. 120",
          min: 1,
          max: 200000,
        },
        {
          name: "secondLevel",
          label: "Second hCG Level (mIU/mL)",
          type: "number",
          placeholder: "e.g. 350",
          min: 1,
          max: 200000,
        },
        {
          name: "daysBetween",
          label: "Days Between Tests",
          type: "number",
          placeholder: "e.g. 2",
          min: 1,
          max: 14,
          defaultValue: 2,
        },
        {
          name: "weeksPregnant",
          label: "Weeks Pregnant (approx)",
          type: "select",
          options: [
            { label: "3-4 weeks", value: "3" },
            { label: "4-5 weeks", value: "4" },
            { label: "5-6 weeks", value: "5" },
            { label: "6-7 weeks", value: "6" },
            { label: "7-8 weeks", value: "7" },
            { label: "8-10 weeks", value: "8" },
            { label: "10-12 weeks", value: "10" },
          ],
          defaultValue: "5",
        },
      ],
      calculate: (inputs) => {
        const first = inputs.firstLevel as number;
        const second = inputs.secondLevel as number;
        const days = (inputs.daysBetween as number) || 2;
        const weeks = parseInt(inputs.weeksPregnant as string) || 5;
        if (!first || !second) return null;

        // Doubling time formula: t × log(2) / log(second/first)
        const doublingTime = (days * Math.log(2)) / Math.log(second / first);
        const percentIncrease = ((second - first) / first) * 100;
        const dailyGrowthRate = (Math.pow(second / first, 1 / days) - 1) * 100;

        // Expected hCG ranges by week (wide ranges)
        const expectedRanges: Record<number, string> = {
          3: "5 - 50 mIU/mL",
          4: "5 - 426 mIU/mL",
          5: "18 - 7,340 mIU/mL",
          6: "1,080 - 56,500 mIU/mL",
          7: "7,650 - 229,000 mIU/mL",
          8: "25,700 - 288,000 mIU/mL",
          10: "13,300 - 254,000 mIU/mL",
        };

        // Normal doubling time interpretation
        let interpretation: string;
        if (second < first) {
          interpretation = "hCG is declining - consult your healthcare provider immediately";
        } else if (doublingTime < 24) {
          interpretation = "Very fast doubling - may indicate multiples; consult provider";
        } else if (doublingTime < 48 && weeks <= 6) {
          interpretation = "Normal - hCG typically doubles every 48-72 hours in early pregnancy";
        } else if (doublingTime < 72 && weeks <= 6) {
          interpretation = "Normal range - within expected 48-72 hour doubling time";
        } else if (doublingTime < 96 && weeks > 6) {
          interpretation = "Acceptable - doubling slows naturally after 6 weeks";
        } else if (doublingTime >= 96 && weeks <= 6) {
          interpretation = "Slower than typical - consult your healthcare provider for evaluation";
        } else {
          interpretation = "hCG rise slows in later first trimester - this may be normal after 8-10 weeks";
        }

        return {
          primary: {
            label: "Doubling Time",
            value: `${formatNumber(doublingTime, 1)} hours`,
          },
          details: [
            { label: "Interpretation", value: interpretation },
            { label: "First hCG", value: `${formatNumber(first, 0)} mIU/mL` },
            { label: "Second hCG", value: `${formatNumber(second, 0)} mIU/mL` },
            { label: "Increase", value: `${formatNumber(percentIncrease, 1)}% over ${days} day${days > 1 ? "s" : ""}` },
            { label: "Daily Growth Rate", value: `${formatNumber(dailyGrowthRate, 1)}% per day` },
            { label: `Expected Range (week ${weeks})`, value: expectedRanges[weeks] || "Varies" },
          ],
          note: "Normal hCG doubling time is 48-72 hours in early pregnancy (under 6 weeks). After 6 weeks, doubling slows, and hCG peaks around 8-11 weeks. A single hCG value matters less than the trend. Always discuss results with your healthcare provider.",
        };
      },
    },
  ],
  relatedSlugs: ["pregnancy-calculator", "fertility-window-calculator", "ovulation-calculator"],
  faq: [
    {
      question: "What is a normal hCG doubling time?",
      answer:
        "In a healthy early pregnancy, hCG typically doubles every 48-72 hours until it reaches about 1,200 mIU/mL. From 1,200-6,000, doubling slows to every 72-96 hours. Above 6,000, it doubles every 96+ hours. hCG peaks around 8-11 weeks, then gradually declines.",
    },
    {
      question: "What does slow hCG rise mean?",
      answer:
        "A slower-than-expected hCG rise can indicate: ectopic pregnancy, miscarriage, or simply normal variation (not all healthy pregnancies follow the '48-hour doubling' rule). About 15% of normal pregnancies have slower initial hCG rise. Your provider will evaluate the complete clinical picture.",
    },
    {
      question: "Can hCG levels indicate twins?",
      answer:
        "Higher-than-average hCG levels or very fast doubling times can sometimes indicate twins or multiples, but this is not a reliable indicator. Many twin pregnancies have normal hCG levels, and some singleton pregnancies have high levels. Ultrasound is the only reliable way to confirm multiples.",
    },
  ],
  formula:
    "Doubling Time (hours) = (Days Between × 24 × log(2)) / log(Second hCG / First hCG) | Daily Growth Rate = ((Second/First)^(1/days) - 1) × 100% | Percentage Increase = ((Second - First) / First) × 100%.",
};
