import type { CalculatorDefinition } from "./types";

export const diaperSizeCalculator: CalculatorDefinition = {
  slug: "diaper-size-calculator",
  title: "Diaper Size Calculator",
  description:
    "Free diaper size calculator. Find the right diaper size for your baby based on weight and age, plus estimate monthly diaper usage and cost.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "diaper size",
    "diaper calculator",
    "baby diaper size",
    "diaper size chart",
    "how many diapers",
  ],
  variants: [
    {
      id: "size",
      name: "Find Diaper Size",
      description: "Determine the right diaper size based on baby's weight",
      fields: [
        {
          name: "weightLbs",
          label: "Baby Weight (lbs)",
          type: "number",
          placeholder: "e.g. 14",
          min: 3,
          max: 45,
        },
        {
          name: "ageMonths",
          label: "Baby Age (months)",
          type: "number",
          placeholder: "e.g. 4",
          min: 0,
          max: 36,
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weightLbs as number;
        const age = inputs.ageMonths as number;
        if (!weight) return null;

        // Standard diaper size ranges
        const sizes = [
          { name: "Preemie", minLbs: 0, maxLbs: 6, diapersPerDay: 12 },
          { name: "Newborn (N)", minLbs: 6, maxLbs: 10, diapersPerDay: 10 },
          { name: "Size 1", minLbs: 8, maxLbs: 14, diapersPerDay: 10 },
          { name: "Size 2", minLbs: 12, maxLbs: 18, diapersPerDay: 9 },
          { name: "Size 3", minLbs: 16, maxLbs: 28, diapersPerDay: 8 },
          { name: "Size 4", minLbs: 22, maxLbs: 37, diapersPerDay: 7 },
          { name: "Size 5", minLbs: 27, maxLbs: 41, diapersPerDay: 6 },
          { name: "Size 6", minLbs: 35, maxLbs: 45, diapersPerDay: 5 },
        ];

        let bestSize = sizes[0];
        for (const s of sizes) {
          if (weight >= s.minLbs && weight <= s.maxLbs) {
            bestSize = s;
          }
        }

        const monthlyDiapers = bestSize.diapersPerDay * 30;
        const monthlyCostLow = monthlyDiapers * 0.2;
        const monthlyCostHigh = monthlyDiapers * 0.35;

        let nextSizeUp = "";
        const idx = sizes.indexOf(bestSize);
        if (idx < sizes.length - 1) {
          nextSizeUp = `${sizes[idx + 1].name} (at ${sizes[idx + 1].minLbs}+ lbs)`;
        } else {
          nextSizeUp = "Currently at largest standard size";
        }

        return {
          primary: { label: "Recommended Diaper Size", value: bestSize.name },
          details: [
            {
              label: "Weight range for this size",
              value: `${bestSize.minLbs}-${bestSize.maxLbs} lbs`,
            },
            {
              label: "Diapers per day (est.)",
              value: `~${bestSize.diapersPerDay}`,
            },
            {
              label: "Monthly diapers (est.)",
              value: `~${monthlyDiapers}`,
            },
            {
              label: "Monthly cost (est.)",
              value: `$${monthlyCostLow.toFixed(0)}-$${monthlyCostHigh.toFixed(0)}`,
            },
            { label: "Next size up", value: nextSizeUp },
          ],
          note: "Sizing varies by brand. If you notice frequent leaks or red marks, it may be time to size up. Always check the specific brand's size chart.",
        };
      },
    },
  ],
  relatedSlugs: ["baby-growth-calculator", "baby-clothing-size-calculator"],
  faq: [
    {
      question: "How do I know when to go up a diaper size?",
      answer:
        "Signs you need the next size include: frequent blowouts or leaks, red marks on baby's thighs or waist, difficulty fastening the tabs, or the diaper looks too snug. It's better to size up slightly early than too late.",
    },
    {
      question: "How many diapers will my baby use?",
      answer:
        "Newborns use about 10-12 diapers per day. This decreases to about 6-8 per day by 6 months and 5-6 per day by 12 months. Most babies use about 2,500-3,000 diapers in their first year.",
    },
  ],
  formula:
    "Diaper size determined by weight range. Preemie: <6 lbs, NB: 6-10, Size 1: 8-14, Size 2: 12-18, Size 3: 16-28, Size 4: 22-37, Size 5: 27-41, Size 6: 35-45 lbs.",
};
