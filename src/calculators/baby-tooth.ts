import type { CalculatorDefinition } from "./types";

export const babyToothCalculator: CalculatorDefinition = {
  slug: "baby-tooth-calculator",
  title: "Baby Tooth Timeline Calculator",
  description:
    "Free baby tooth timeline calculator. Predict when your baby's teeth will come in based on age and track teething milestones.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "baby teeth",
    "teething timeline",
    "baby tooth chart",
    "when do babies teeth",
    "teething calculator",
  ],
  variants: [
    {
      id: "timeline",
      name: "Teething Timeline",
      description: "See which teeth to expect based on your baby's age",
      fields: [
        {
          name: "ageMonths",
          label: "Baby Age (months)",
          type: "number",
          placeholder: "e.g. 8",
          min: 0,
          max: 36,
        },
        {
          name: "teethCount",
          label: "Current Number of Teeth",
          type: "number",
          placeholder: "e.g. 2",
          min: 0,
          max: 20,
        },
      ],
      calculate: (inputs) => {
        const age = inputs.ageMonths as number;
        const currentTeeth = inputs.teethCount as number;
        if (age === undefined || currentTeeth === undefined) return null;

        // Typical teething schedule (average months)
        const teethSchedule = [
          { name: "Lower central incisors", avgMonth: 6, count: 2 },
          { name: "Upper central incisors", avgMonth: 8, count: 2 },
          { name: "Upper lateral incisors", avgMonth: 10, count: 2 },
          { name: "Lower lateral incisors", avgMonth: 12, count: 2 },
          { name: "First molars (upper & lower)", avgMonth: 14, count: 4 },
          { name: "Canines (upper & lower)", avgMonth: 18, count: 4 },
          { name: "Second molars (lower)", avgMonth: 24, count: 2 },
          { name: "Second molars (upper)", avgMonth: 28, count: 2 },
        ];

        let expectedTeeth = 0;
        let currentlyTeething = "None expected yet";
        let nextTeeth = "";
        let nextMonth = 0;

        for (const tooth of teethSchedule) {
          if (age >= tooth.avgMonth) {
            expectedTeeth += tooth.count;
            currentlyTeething = tooth.name;
          } else if (!nextTeeth) {
            nextTeeth = tooth.name;
            nextMonth = tooth.avgMonth;
          }
        }

        if (expectedTeeth > 20) expectedTeeth = 20;

        let status = "On track";
        if (currentTeeth > expectedTeeth + 2) {
          status = "Ahead of average";
        } else if (currentTeeth < expectedTeeth - 4 && age > 12) {
          status = "Behind average (consult dentist)";
        } else if (age > 13 && currentTeeth === 0) {
          status = "Delayed - consult your pediatric dentist";
        }

        const allTeethDone = age >= 28 && currentTeeth >= 18;
        const completionNote = allTeethDone
          ? "Nearly all baby teeth should be in!"
          : nextTeeth
          ? `Next expected: ${nextTeeth} (around ${nextMonth} months)`
          : "All 20 baby teeth typically in by age 3";

        const firstDentistVisit = age < 12
          ? `Schedule first dentist visit by age 1 (in ${12 - age} months)`
          : "Should have had first dental visit already";

        return {
          primary: { label: "Teething Status", value: status },
          details: [
            {
              label: "Expected teeth at this age",
              value: `~${expectedTeeth} teeth`,
            },
            { label: "Current teeth", value: `${currentTeeth} teeth` },
            {
              label: "Most recent teeth expected",
              value: currentlyTeething,
            },
            { label: "What's next", value: completionNote },
            { label: "First dentist visit", value: firstDentistVisit },
            {
              label: "Full set",
              value: "20 baby teeth, usually complete by age 2.5-3",
            },
          ],
          note: "Teething timelines vary widely. Some babies get teeth early (3 months), others late (12+ months). Both are usually normal.",
        };
      },
    },
  ],
  relatedSlugs: ["baby-growth-calculator", "baby-milestone-calculator"],
  faq: [
    {
      question: "When do babies start teething?",
      answer:
        "Most babies get their first tooth around 6 months, but the range is wide: 3-14 months is considered normal. Lower front teeth usually come in first.",
    },
    {
      question: "How many baby teeth are there total?",
      answer:
        "Children get 20 baby (primary) teeth total: 8 incisors, 4 canines, and 8 molars. These typically all come in by age 2.5-3 years.",
    },
  ],
  formula:
    "Typical eruption: central incisors (6-8 mo), lateral incisors (10-12 mo), first molars (14 mo), canines (18 mo), second molars (24-28 mo). Total: 20 primary teeth.",
};
