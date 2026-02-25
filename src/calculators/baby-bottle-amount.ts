import type { CalculatorDefinition } from "./types";

export const babyBottleAmountCalculator: CalculatorDefinition = {
  slug: "baby-bottle-amount-calculator",
  title: "Baby Bottle Amount Calculator",
  description:
    "Free baby bottle amount calculator. Determine how much formula or breast milk your baby needs per feeding and per day based on age and weight.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "baby bottle amount",
    "formula amount",
    "breast milk amount",
    "baby feeding amount",
    "how much milk baby",
  ],
  variants: [
    {
      id: "by-weight",
      name: "By Baby Weight",
      description: "Calculate feeding amount based on your baby's current weight",
      fields: [
        {
          name: "weightLbs",
          label: "Baby Weight (lbs)",
          type: "number",
          placeholder: "e.g. 12",
          min: 4,
          max: 30,
        },
        {
          name: "ageWeeks",
          label: "Baby Age (weeks)",
          type: "number",
          placeholder: "e.g. 8",
          min: 0,
          max: 52,
        },
        {
          name: "feedType",
          label: "Feed Type",
          type: "select",
          options: [
            { label: "Formula", value: "formula" },
            { label: "Breast Milk", value: "breastmilk" },
          ],
        },
      ],
      calculate: (inputs) => {
        const weightLbs = inputs.weightLbs as number;
        const ageWeeks = inputs.ageWeeks as number;
        const feedType = inputs.feedType as string;
        if (!weightLbs || ageWeeks === undefined || !feedType) return null;

        const weightOz = weightLbs * 16;
        // General rule: 2.5 oz per pound of body weight per day
        let dailyOz = weightLbs * 2.5;
        // Cap at around 32 oz per day
        if (dailyOz > 32) dailyOz = 32;

        let feedingsPerDay: number;
        if (ageWeeks <= 2) feedingsPerDay = 10;
        else if (ageWeeks <= 8) feedingsPerDay = 8;
        else if (ageWeeks <= 16) feedingsPerDay = 7;
        else if (ageWeeks <= 26) feedingsPerDay = 6;
        else feedingsPerDay = 5;

        const perFeedingOz = dailyOz / feedingsPerDay;

        const perFeedingMl = perFeedingOz * 29.5735;
        const dailyMl = dailyOz * 29.5735;

        const typeLabel = feedType === "formula" ? "Formula" : "Breast Milk";

        return {
          primary: {
            label: "Per Feeding Amount",
            value: `${perFeedingOz.toFixed(1)} oz (${Math.round(perFeedingMl)} ml)`,
          },
          details: [
            {
              label: "Daily total",
              value: `${dailyOz.toFixed(1)} oz (${Math.round(dailyMl)} ml)`,
            },
            {
              label: "Feedings per day",
              value: `~${feedingsPerDay} times`,
            },
            { label: "Feed type", value: typeLabel },
            {
              label: "Baby weight",
              value: `${weightLbs} lbs`,
            },
            {
              label: "Calculation basis",
              value: "~2.5 oz per pound of body weight per day",
            },
          ],
          note: "These are general guidelines. Every baby is different. Follow your pediatrician's advice and watch for hunger/fullness cues.",
        };
      },
    },
    {
      id: "by-age",
      name: "By Baby Age",
      description: "Quick estimate based on baby's age range",
      fields: [
        {
          name: "ageRange",
          label: "Baby Age Range",
          type: "select",
          options: [
            { label: "Newborn (0-2 weeks)", value: "newborn" },
            { label: "1 month", value: "1mo" },
            { label: "2 months", value: "2mo" },
            { label: "3-4 months", value: "3mo" },
            { label: "5-6 months", value: "5mo" },
            { label: "7-9 months", value: "7mo" },
            { label: "10-12 months", value: "10mo" },
          ],
        },
      ],
      calculate: (inputs) => {
        const ageRange = inputs.ageRange as string;
        if (!ageRange) return null;

        const data: Record<string, { perFeed: string; daily: string; feedings: string; notes: string }> = {
          newborn: { perFeed: "1-2 oz", daily: "12-20 oz", feedings: "8-12", notes: "Feed on demand, every 2-3 hours" },
          "1mo": { perFeed: "2-4 oz", daily: "20-28 oz", feedings: "7-8", notes: "Every 2.5-3.5 hours" },
          "2mo": { perFeed: "4-5 oz", daily: "24-32 oz", feedings: "6-7", notes: "Every 3-4 hours" },
          "3mo": { perFeed: "4-6 oz", daily: "24-32 oz", feedings: "5-6", notes: "May start longer stretches at night" },
          "5mo": { perFeed: "5-7 oz", daily: "24-32 oz", feedings: "5-6", notes: "May begin introducing solids" },
          "7mo": { perFeed: "6-8 oz", daily: "24-32 oz", feedings: "4-5", notes: "Solids supplement milk feedings" },
          "10mo": { perFeed: "6-8 oz", daily: "24-30 oz", feedings: "3-4", notes: "3 meals of solids plus milk" },
        };

        const info = data[ageRange];
        if (!info) return null;

        return {
          primary: { label: "Per Feeding Amount", value: info.perFeed },
          details: [
            { label: "Daily total", value: info.daily },
            { label: "Feedings per day", value: info.feedings },
            { label: "Notes", value: info.notes },
          ],
          note: "Amounts are general guidelines. Always follow your pediatrician's recommendations.",
        };
      },
    },
  ],
  relatedSlugs: ["baby-growth-calculator", "baby-feeding-schedule-calculator"],
  faq: [
    {
      question: "How much should my newborn eat?",
      answer:
        "Newborns typically eat 1-2 oz per feeding, 8-12 times per day. By one month, most babies eat 2-4 oz per feeding. The general rule is about 2.5 oz per pound of body weight per day.",
    },
    {
      question: "Is the amount different for breast milk vs formula?",
      answer:
        "The total daily volume is similar. However, breastfed babies may feed more frequently in smaller amounts because breast milk is digested faster than formula.",
    },
  ],
  formula:
    "Daily amount (oz) = baby weight (lbs) x 2.5, capped at 32 oz/day. Per feeding = daily total / number of feedings.",
};
