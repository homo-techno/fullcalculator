import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const breastMilkIntakeCalculator: CalculatorDefinition = {
  slug: "breast-milk-intake-calculator",
  title: "Breast Milk Intake Calculator",
  description:
    "Free breast milk intake calculator. Estimate how much breast milk your baby needs per day and per feeding based on age and weight.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "breast milk intake",
    "how much breast milk",
    "pumping amount",
    "breast milk per feeding",
    "breastfed baby intake",
  ],
  variants: [
    {
      id: "milk-intake",
      name: "Daily Breast Milk Intake",
      description: "How much breast milk does your baby need?",
      fields: [
        {
          name: "ageMonths",
          label: "Baby's Age (months)",
          type: "number",
          placeholder: "e.g. 4",
          min: 0,
          max: 12,
        },
        {
          name: "weight",
          label: "Baby's Weight (lbs)",
          type: "number",
          placeholder: "e.g. 14",
          min: 4,
          max: 30,
        },
        {
          name: "feedingsPerDay",
          label: "Feedings Per Day",
          type: "number",
          placeholder: "e.g. 8",
          min: 4,
          max: 14,
          defaultValue: 8,
        },
      ],
      calculate: (inputs) => {
        const ageMonths = inputs.ageMonths as number;
        const weightLbs = inputs.weight as number;
        const feedingsPerDay = (inputs.feedingsPerDay as number) || 8;
        if (ageMonths === undefined || ageMonths === null) return null;
        if (!weightLbs) return null;

        // Breast milk intake is remarkably consistent: ~25 oz/day from 1-6 months
        // After 6 months, solids gradually replace some milk
        let dailyOz: number;
        if (ageMonths < 1) {
          // First month: ramp up, roughly 2-2.5 oz per lb
          dailyOz = Math.min(weightLbs * 2.3, 25);
        } else if (ageMonths <= 6) {
          // 1-6 months: average 25 oz/day (range 19-30)
          dailyOz = 25;
        } else if (ageMonths <= 9) {
          // 7-9 months: ~24 oz as solids increase
          dailyOz = 24;
        } else {
          // 10-12 months: ~20 oz with more solids
          dailyOz = 20;
        }

        const ozPerFeeding = dailyOz / feedingsPerDay;
        const dailyMl = dailyOz * 29.574;
        const mlPerFeeding = ozPerFeeding * 29.574;
        const hoursBetween = 24 / feedingsPerDay;

        return {
          primary: {
            label: "Estimated Daily Intake",
            value: `${formatNumber(dailyOz, 0)} oz/day`,
          },
          details: [
            { label: "Per Feeding", value: `${formatNumber(ozPerFeeding, 1)} oz (${formatNumber(mlPerFeeding, 0)} ml)` },
            { label: "Daily Total", value: `${formatNumber(dailyOz, 0)} oz (${formatNumber(dailyMl, 0)} ml)` },
            { label: "Feedings Per Day", value: `${feedingsPerDay}` },
            { label: "Hours Between Feedings", value: `~${formatNumber(hoursBetween, 1)} hours` },
            { label: "Pumping Target", value: `${formatNumber(ozPerFeeding, 1)} oz per session (${feedingsPerDay} sessions)` },
          ],
          note: "Breast milk intake is remarkably stable at ~25 oz/day from 1-6 months regardless of baby's weight (unlike formula). After 6 months, solids gradually replace some milk. These are averages - follow your baby's hunger cues.",
        };
      },
    },
  ],
  relatedSlugs: ["baby-formula-calculator", "baby-feeding-schedule-calculator", "baby-growth-calculator"],
  faq: [
    {
      question: "How much breast milk does a baby need per day?",
      answer:
        "Exclusively breastfed babies typically consume about 25 ounces (750 ml) per day between 1-6 months, regardless of weight. This is different from formula, where intake increases with weight. In the first month, intake gradually increases to reach this level.",
    },
    {
      question: "How much should I pump per session?",
      answer:
        "If exclusively pumping, divide 25 oz by your number of pumping sessions. For 8 sessions, that is about 3 oz per session. Some sessions may yield more or less - what matters is the daily total. Many women pump more in the morning and less in the evening.",
    },
    {
      question: "Does breast milk intake increase as baby grows?",
      answer:
        "Surprisingly, no. Unlike formula feeding, breast milk intake stays relatively constant at about 25 oz/day from 1-6 months. The milk composition changes to meet growing nutritional needs instead. After 6 months, solid foods gradually replace some milk volume.",
    },
  ],
  formula:
    "Daily Intake ≈ 25 oz (1-6 months) | Per Feeding = Daily Total / Number of Feedings | 1 oz = 29.574 ml. Newborns ramp up to full intake over the first month.",
};
