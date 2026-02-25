import type { CalculatorDefinition } from "./types";

export const babyGrowthSpurtCalculator: CalculatorDefinition = {
  slug: "baby-growth-spurt-calculator",
  title: "Baby Growth Spurt Calculator",
  description:
    "Free baby growth spurt calculator. Predict when your baby's growth spurts will occur based on their birth date and current age.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "baby growth spurt",
    "growth spurt schedule",
    "when do babies growth spurt",
    "growth spurt timeline",
    "wonder weeks",
  ],
  variants: [
    {
      id: "predict",
      name: "Predict Growth Spurts",
      description: "See upcoming and past growth spurts based on baby's age",
      fields: [
        {
          name: "birthYear",
          label: "Baby Birth Year",
          type: "number",
          placeholder: "e.g. 2026",
          min: 2024,
          max: 2028,
        },
        {
          name: "birthMonth",
          label: "Baby Birth Month",
          type: "number",
          placeholder: "1-12",
          min: 1,
          max: 12,
        },
        {
          name: "birthDay",
          label: "Baby Birth Day",
          type: "number",
          placeholder: "1-31",
          min: 1,
          max: 31,
        },
      ],
      calculate: (inputs) => {
        const y = inputs.birthYear as number;
        const m = inputs.birthMonth as number;
        const d = inputs.birthDay as number;
        if (!y || !m || !d) return null;

        const birthDate = new Date(y, m - 1, d);
        const today = new Date();
        const ageInDays = Math.floor(
          (today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        const ageWeeks = Math.floor(ageInDays / 7);

        // Common growth spurt windows (in weeks)
        const spurts = [
          { weekStart: 1, weekEnd: 2, label: "1-2 weeks", description: "Regaining birth weight, cluster feeding" },
          { weekStart: 3, weekEnd: 4, label: "3-4 weeks", description: "First major growth spurt, increased hunger" },
          { weekStart: 6, weekEnd: 8, label: "6-8 weeks", description: "Rapid growth, possible fussiness" },
          { weekStart: 12, weekEnd: 13, label: "3 months", description: "Growth spurt + developmental leap" },
          { weekStart: 16, weekEnd: 17, label: "4 months", description: "Major growth + sleep regression common" },
          { weekStart: 24, weekEnd: 26, label: "6 months", description: "Growth spurt, may be ready for solids" },
          { weekStart: 36, weekEnd: 38, label: "9 months", description: "Crawling, pulling up, brain development" },
          { weekStart: 52, weekEnd: 54, label: "12 months", description: "Birthday growth spurt, walking development" },
          { weekStart: 72, weekEnd: 78, label: "18 months", description: "Toddler growth spurt, language explosion" },
          { weekStart: 104, weekEnd: 108, label: "24 months", description: "Toddler growth spurt, independence" },
        ];

        let currentSpurt = "No active growth spurt predicted";
        let nextSpurt = "";
        let nextSpurtWeeks = 0;
        const pastSpurts: string[] = [];
        const upcomingSpurts: string[] = [];

        for (const spurt of spurts) {
          if (ageWeeks >= spurt.weekStart && ageWeeks <= spurt.weekEnd) {
            currentSpurt = `${spurt.label}: ${spurt.description}`;
          } else if (ageWeeks < spurt.weekStart) {
            const weeksUntil = spurt.weekStart - ageWeeks;
            upcomingSpurts.push(`${spurt.label} (in ~${weeksUntil} weeks)`);
            if (!nextSpurt) {
              nextSpurt = `${spurt.label} (in ~${weeksUntil} weeks)`;
              nextSpurtWeeks = weeksUntil;
            }
          } else {
            pastSpurts.push(spurt.label);
          }
        }

        const details: { label: string; value: string }[] = [
          { label: "Baby age", value: `${ageWeeks} weeks (${Math.floor(ageWeeks / 4.33)} months)` },
          { label: "Current growth spurt", value: currentSpurt },
        ];

        if (nextSpurt) {
          details.push({ label: "Next growth spurt", value: nextSpurt });
        }

        if (upcomingSpurts.length > 0) {
          details.push({ label: "Upcoming spurts", value: upcomingSpurts.slice(0, 3).join(", ") });
        }

        if (pastSpurts.length > 0) {
          details.push({ label: "Completed spurts", value: pastSpurts.join(", ") });
        }

        details.push({
          label: "Signs of a growth spurt",
          value: "Increased hunger, fussiness, disrupted sleep, clinginess",
        });

        const statusValue = currentSpurt.includes("No active")
          ? nextSpurt
            ? `Next spurt in ~${nextSpurtWeeks} weeks`
            : "Past typical growth spurt period"
          : "Growth Spurt Active!";

        return {
          primary: { label: "Growth Spurt Status", value: statusValue },
          details,
          note: "Growth spurts typically last 2-7 days. During this time, baby may feed more frequently and be fussier than usual. This is normal and temporary.",
        };
      },
    },
  ],
  relatedSlugs: ["baby-growth-calculator", "baby-feeding-schedule-calculator"],
  faq: [
    {
      question: "When do babies have growth spurts?",
      answer:
        "Common growth spurt ages are: 1-2 weeks, 3-4 weeks, 6-8 weeks, 3 months, 4 months, 6 months, 9 months, and 12 months. However, every baby is different and spurts may not occur exactly at these times.",
    },
    {
      question: "How long do baby growth spurts last?",
      answer:
        "Growth spurts typically last 2-7 days. During this time, babies often want to eat more frequently (cluster feeding), may be fussier than usual, and may have disrupted sleep. Once the spurt passes, feeding and sleep usually normalize.",
    },
  ],
  formula:
    "Growth spurt windows: 1-2 wks, 3-4 wks, 6-8 wks, 3 mo, 4 mo, 6 mo, 9 mo, 12 mo, 18 mo, 24 mo. Duration: typically 2-7 days each.",
};
