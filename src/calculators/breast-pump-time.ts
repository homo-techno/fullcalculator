import type { CalculatorDefinition } from "./types";

export const breastPumpTimeCalculator: CalculatorDefinition = {
  slug: "breast-pump-time-calculator",
  title: "Breast Pump Schedule Calculator",
  description:
    "Free breast pump schedule calculator. Plan your pumping sessions based on baby's age, feeding frequency, and your pumping goals to maintain or build milk supply.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "breast pump schedule",
    "pumping schedule calculator",
    "how often to pump",
    "breast pump time",
    "pumping frequency",
  ],
  variants: [
    {
      id: "pump-schedule",
      name: "Pumping Schedule Planner",
      description: "Get a recommended pumping schedule based on your situation",
      fields: [
        {
          name: "babyAge",
          label: "Baby's Age",
          type: "select",
          options: [
            { label: "Newborn (0-4 weeks)", value: "newborn" },
            { label: "1-3 months", value: "1-3" },
            { label: "3-6 months", value: "3-6" },
            { label: "6-9 months", value: "6-9" },
            { label: "9-12 months", value: "9-12" },
            { label: "12+ months", value: "12+" },
          ],
          defaultValue: "newborn",
        },
        {
          name: "pumpingGoal",
          label: "Pumping Goal",
          type: "select",
          options: [
            { label: "Exclusive Pumping (no nursing)", value: "exclusive" },
            { label: "Supplement Nursing (build supply)", value: "supplement" },
            { label: "Maintain Supply (working mom)", value: "maintain" },
            { label: "Build Freezer Stash", value: "stash" },
          ],
          defaultValue: "maintain",
        },
        {
          name: "wakeHours",
          label: "Hours Awake Per Day",
          type: "number",
          placeholder: "e.g. 16",
          min: 12,
          max: 20,
          defaultValue: 16,
        },
      ],
      calculate: (inputs) => {
        const babyAge = inputs.babyAge as string;
        const goal = inputs.pumpingGoal as string;
        const wakeHours = (inputs.wakeHours as number) || 16;

        let sessionsPerDay: number;
        let minutesPerSession: number;
        let nightPumping: string;
        let ageNote: string;

        // Determine base sessions by age
        if (babyAge === "newborn") {
          sessionsPerDay = 8;
          minutesPerSession = 20;
          nightPumping = "Yes, every 2-3 hours including overnight";
          ageNote = "Newborns need 8-12 feeds per day. Frequent pumping is crucial to establish supply.";
        } else if (babyAge === "1-3") {
          sessionsPerDay = 7;
          minutesPerSession = 20;
          nightPumping = "Yes, at least once overnight";
          ageNote = "Supply is still being established. Keep sessions frequent.";
        } else if (babyAge === "3-6") {
          sessionsPerDay = 6;
          minutesPerSession = 15;
          nightPumping = "Optional, 1 session if possible";
          ageNote = "Supply is typically well-established. Can begin reducing frequency slightly.";
        } else if (babyAge === "6-9") {
          sessionsPerDay = 5;
          minutesPerSession = 15;
          nightPumping = "Usually not needed";
          ageNote = "Baby is starting solids. Milk still the primary nutrition source.";
        } else if (babyAge === "9-12") {
          sessionsPerDay = 4;
          minutesPerSession = 15;
          nightPumping = "Not needed";
          ageNote = "Solids increase. Can gradually reduce pumping sessions.";
        } else {
          sessionsPerDay = 3;
          minutesPerSession = 15;
          nightPumping = "Not needed";
          ageNote = "Milk becomes complementary to solid foods.";
        }

        // Adjust for goal
        if (goal === "exclusive") {
          sessionsPerDay = Math.max(sessionsPerDay, 7);
          minutesPerSession = Math.max(minutesPerSession, 20);
        } else if (goal === "stash") {
          sessionsPerDay += 1;
        } else if (goal === "supplement") {
          sessionsPerDay = Math.max(3, sessionsPerDay - 2);
          minutesPerSession = 15;
        } else if (goal === "maintain") {
          sessionsPerDay = Math.max(3, sessionsPerDay - 1);
        }

        const intervalHours = Math.round((wakeHours / (sessionsPerDay - (nightPumping.startsWith("Yes") ? 1 : 0))) * 10) / 10;
        const totalMinutes = sessionsPerDay * minutesPerSession;
        const totalHours = (totalMinutes / 60).toFixed(1);

        // Estimated daily output
        const ozPerSession = babyAge === "newborn" ? 2 : babyAge === "1-3" ? 3 : 4;
        const dailyOz = sessionsPerDay * ozPerSession;

        return {
          primary: {
            label: "Recommended Sessions",
            value: `${sessionsPerDay} sessions/day`,
          },
          details: [
            { label: "Minutes Per Session", value: `${minutesPerSession} minutes` },
            { label: "Interval Between Sessions", value: `Every ~${intervalHours} hours` },
            { label: "Total Pumping Time", value: `${totalMinutes} min (~${totalHours} hours/day)` },
            { label: "Overnight Pumping", value: nightPumping },
            { label: "Estimated Daily Output", value: `~${dailyOz} oz (varies widely)` },
            { label: "Age Guidance", value: ageNote },
          ],
          note: "Every person's milk supply is different. Output varies significantly based on individual factors. If concerned about supply, consult a lactation consultant. Power pumping (20 min on, 10 off, 10 on, 10 off, 10 on) can help boost supply.",
        };
      },
    },
  ],
  relatedSlugs: ["breast-milk-storage-calculator", "breastfeeding-calorie-calculator", "baby-formula-calculator"],
  faq: [
    {
      question: "How often should I pump?",
      answer:
        "For newborns and exclusive pumping: every 2-3 hours (8-12 times per day including overnight). For maintaining supply while working: 2-3 times during work hours plus morning/evening. As baby gets older and starts solids, pumping frequency can gradually decrease.",
    },
    {
      question: "How long should each pumping session be?",
      answer:
        "Most pumping sessions should last 15-20 minutes per breast, or about 2 minutes after milk stops flowing. Double pumping (both breasts simultaneously) is more efficient and can stimulate more prolactin release. Don't pump for more than 30 minutes as this can cause irritation.",
    },
    {
      question: "What is power pumping?",
      answer:
        "Power pumping mimics cluster feeding to boost supply. The pattern is: pump 20 minutes, rest 10 minutes, pump 10 minutes, rest 10 minutes, pump 10 minutes. Do this once daily for 2-3 days to signal your body to make more milk. Results typically show within 48-72 hours.",
    },
  ],
  formula:
    "Sessions/Day = Based on baby age and goal | Interval = Wake Hours / Daytime Sessions | Total Time = Sessions x Minutes Per Session",
};
