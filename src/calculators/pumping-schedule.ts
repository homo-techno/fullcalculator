import type { CalculatorDefinition } from "./types";

export const pumpingScheduleCalculator: CalculatorDefinition = {
  slug: "pumping-schedule-calculator",
  title: "Pumping Schedule Calculator",
  description:
    "Free pumping schedule calculator. Create an optimal breast pump schedule based on your baby's age, work schedule, and milk supply goals.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "pumping schedule",
    "breast pump schedule",
    "pumping at work",
    "milk supply schedule",
    "how often to pump",
  ],
  variants: [
    {
      id: "schedule",
      name: "Create Pumping Schedule",
      description: "Build a pumping schedule based on your situation",
      fields: [
        {
          name: "babyAgeWeeks",
          label: "Baby Age (weeks)",
          type: "number",
          placeholder: "e.g. 8",
          min: 0,
          max: 52,
        },
        {
          name: "scenario",
          label: "Pumping Scenario",
          type: "select",
          options: [
            { label: "Exclusive pumping (no nursing)", value: "exclusive" },
            { label: "Pumping at work + nursing", value: "work" },
            { label: "Supplemental pumping (building supply)", value: "supplement" },
            { label: "Occasional pumping (date night, etc.)", value: "occasional" },
          ],
        },
        {
          name: "workHours",
          label: "Hours Away from Baby (if applicable)",
          type: "number",
          placeholder: "e.g. 9",
          min: 0,
          max: 14,
        },
      ],
      calculate: (inputs) => {
        const ageWeeks = inputs.babyAgeWeeks as number;
        const scenario = inputs.scenario as string;
        const workHours = inputs.workHours as number;
        if (ageWeeks === undefined || !scenario) return null;

        let sessionsPerDay: number;
        let minutesPerSession: number;
        let nightPumping: string;
        let schedule: string;
        let expectedOutput: string;

        if (scenario === "exclusive") {
          if (ageWeeks <= 4) {
            sessionsPerDay = 10;
            minutesPerSession = 20;
            nightPumping = "Yes - every 3 hours including night";
            schedule = "Every 2-3 hours around the clock";
          } else if (ageWeeks <= 12) {
            sessionsPerDay = 8;
            minutesPerSession = 20;
            nightPumping = "Yes - at least once at night";
            schedule = "Every 3 hours during day, once at night";
          } else {
            sessionsPerDay = 6;
            minutesPerSession = 20;
            nightPumping = "Optional if supply is established";
            schedule = "Every 3-4 hours during day";
          }
          expectedOutput = "25-35 oz/day total";
        } else if (scenario === "work") {
          const pumpSessionsAtWork = Math.max(2, Math.floor((workHours || 9) / 3));
          sessionsPerDay = pumpSessionsAtWork;
          minutesPerSession = 20;
          nightPumping = "Nurse before bed and morning; pump only if needed";
          schedule = `${pumpSessionsAtWork} sessions at work (~every 3 hrs) + nurse morning/evening`;
          expectedOutput = `${(pumpSessionsAtWork * 4).toFixed(0)}-${(pumpSessionsAtWork * 5).toFixed(0)} oz while at work`;
        } else if (scenario === "supplement") {
          sessionsPerDay = 2;
          minutesPerSession = 15;
          nightPumping = "1 session after first morning feed (highest supply)";
          schedule = "After morning nursing + 1 additional session";
          expectedOutput = "2-6 oz/day extra";
        } else {
          sessionsPerDay = 1;
          minutesPerSession = 15;
          nightPumping = "Not needed";
          schedule = "Pump once daily to store, or as needed before outing";
          expectedOutput = "1-4 oz per session";
        }

        const totalDailyMinutes = sessionsPerDay * minutesPerSession;

        const storageGuide =
          "Room temp: 4 hrs | Fridge: 4 days | Freezer: 6-12 months";

        return {
          primary: { label: "Pumping Sessions/Day", value: `${sessionsPerDay} sessions` },
          details: [
            { label: "Minutes per session", value: `${minutesPerSession} minutes` },
            { label: "Total daily pump time", value: `~${totalDailyMinutes} minutes` },
            { label: "Schedule", value: schedule },
            { label: "Night pumping", value: nightPumping },
            { label: "Expected output", value: expectedOutput },
            { label: "Milk storage guide", value: storageGuide },
          ],
          note: "Pump for at least 15-20 minutes or 2 minutes after milk stops flowing. Hands-on pumping (massage while pumping) can increase output by 48%.",
        };
      },
    },
  ],
  relatedSlugs: ["breastfeeding-timer-calculator", "baby-bottle-amount-calculator"],
  faq: [
    {
      question: "How often should I pump if exclusively pumping?",
      answer:
        "Exclusive pumpers should pump 8-10 times per day in the early weeks to establish supply, similar to a newborn's feeding pattern. After 12 weeks with established supply, many can reduce to 6-7 sessions.",
    },
    {
      question: "How many times should I pump at work?",
      answer:
        "Most working mothers pump 2-3 times during a standard 8-9 hour workday, roughly every 3 hours. You'll also nurse at home in the morning and evening. Aim to pump as many times as baby would normally feed while you're away.",
    },
  ],
  formula:
    "Exclusive: 8-10 sessions/day (early) to 6/day (established). Work: 1 session per 3 hours away. Supplement: 1-2 extra sessions/day. Session length: 15-20 minutes.",
};
