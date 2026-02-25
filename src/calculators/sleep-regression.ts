import type { CalculatorDefinition } from "./types";

export const sleepRegressionCalculator: CalculatorDefinition = {
  slug: "sleep-regression-calculator",
  title: "Sleep Regression Calculator",
  description:
    "Free sleep regression calculator. Predict when your baby may experience sleep regressions and get tips for managing them based on age.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "sleep regression",
    "baby sleep regression",
    "4 month sleep regression",
    "sleep regression timeline",
    "when do sleep regressions happen",
  ],
  variants: [
    {
      id: "predict",
      name: "Sleep Regression Predictor",
      description: "Predict and manage sleep regressions based on baby's age",
      fields: [
        {
          name: "ageMonths",
          label: "Baby Age (months)",
          type: "number",
          placeholder: "e.g. 4",
          min: 0,
          max: 30,
        },
        {
          name: "sleepIssue",
          label: "Current Sleep Issue",
          type: "select",
          options: [
            { label: "No issues - sleeping well", value: "none" },
            { label: "Waking more frequently at night", value: "waking" },
            { label: "Fighting naps / short naps", value: "naps" },
            { label: "Difficulty falling asleep", value: "falling" },
            { label: "All of the above", value: "all" },
          ],
        },
      ],
      calculate: (inputs) => {
        const age = inputs.ageMonths as number;
        const issue = inputs.sleepIssue as string;
        if (age === undefined || !issue) return null;

        // Sleep regression windows
        const regressions = [
          {
            month: 4,
            name: "4-Month Sleep Regression",
            cause: "Brain maturation - sleep cycles permanently change from newborn to adult-like patterns",
            duration: "2-6 weeks",
            tips: "Establish consistent bedtime routine, practice drowsy-but-awake, darken room",
          },
          {
            month: 6,
            name: "6-Month Sleep Regression",
            cause: "Separation anxiety begins, major motor milestones (sitting, crawling)",
            duration: "1-2 weeks",
            tips: "Extra comfort, maintain routines, practice new skills during the day",
          },
          {
            month: 8,
            name: "8-10 Month Sleep Regression",
            cause: "Peak separation anxiety, crawling/pulling up, brain development leap",
            duration: "2-4 weeks",
            tips: "Play peek-a-boo, brief reassurance visits, keep consistent schedule",
          },
          {
            month: 12,
            name: "12-Month Sleep Regression",
            cause: "Walking development, dropping to one nap transition begins",
            duration: "1-3 weeks",
            tips: "Don't drop the second nap too early, maintain sleep boundaries",
          },
          {
            month: 18,
            name: "18-Month Sleep Regression",
            cause: "Independence, testing boundaries, language explosion, molars",
            duration: "2-6 weeks",
            tips: "Stay firm with boundaries, offer comfort but avoid new sleep crutches",
          },
          {
            month: 24,
            name: "2-Year Sleep Regression",
            cause: "Imagination develops (fear of dark), big transitions (new sibling, toddler bed)",
            duration: "1-3 weeks",
            tips: "Nightlight, validate fears, consistent response, avoid screen time before bed",
          },
        ];

        // Find current or nearest regression
        let current = null;
        let next = null;
        const past: string[] = [];

        for (const reg of regressions) {
          const windowStart = reg.month - 0.5;
          const windowEnd = reg.month + 1.5;

          if (age >= windowStart && age <= windowEnd) {
            current = reg;
          } else if (age < windowStart && !next) {
            next = reg;
          } else if (age > windowEnd) {
            past.push(reg.name);
          }
        }

        let status: string;
        let mainInfo: string;

        if (current && issue !== "none") {
          status = `Likely in ${current.name}`;
          mainInfo = current.cause;
        } else if (current) {
          status = `In ${current.name} window (but sleeping well!)`;
          mainInfo = "Your baby may be handling this regression well, or it may still begin.";
        } else if (next) {
          const monthsUntil = (next.month - age).toFixed(1);
          status = `Next: ${next.name} (in ~${monthsUntil} months)`;
          mainInfo = `Upcoming cause: ${next.cause}`;
        } else {
          status = "Past major sleep regression windows";
          mainInfo = "Most common regressions occur before 24 months.";
        }

        const details: { label: string; value: string }[] = [
          { label: "Explanation", value: mainInfo },
        ];

        if (current) {
          details.push(
            { label: "Expected duration", value: current.duration },
            { label: "Management tips", value: current.tips }
          );
        }

        if (next) {
          details.push({ label: "Next regression", value: `${next.name} - ${next.cause}` });
        }

        if (past.length > 0) {
          details.push({ label: "Past regressions", value: past.join(", ") });
        }

        details.push({
          label: "General sleep tips",
          value: "Consistent routine, dark room, white noise, age-appropriate wake windows",
        });

        return {
          primary: { label: "Sleep Regression Status", value: status },
          details,
          note: "Not all babies experience every sleep regression. Regressions are temporary and indicate healthy brain development. Maintain consistent sleep routines throughout.",
        };
      },
    },
  ],
  relatedSlugs: ["baby-sleep-schedule-calculator", "baby-growth-spurt-calculator"],
  faq: [
    {
      question: "What is a sleep regression?",
      answer:
        "A sleep regression is a temporary period when a baby who was sleeping well suddenly starts waking more at night, fighting naps, or having difficulty falling asleep. They are tied to developmental milestones and brain growth.",
    },
    {
      question: "Is the 4-month sleep regression permanent?",
      answer:
        "The 4-month regression is unique because it involves a permanent change in sleep architecture - baby's sleep cycles mature from newborn-style to adult-style with distinct sleep stages. The disruption is temporary (2-6 weeks), but the new sleep pattern is permanent. This is why establishing good sleep habits around this time is important.",
    },
  ],
  formula:
    "Common regression ages: 4 months (most significant), 6 months, 8-10 months, 12 months, 18 months, 24 months. Duration: 1-6 weeks typically.",
};
