import type { CalculatorDefinition } from "./types";

export const sleepCalculator: CalculatorDefinition = {
  slug: "sleep-calculator",
  title: "Sleep Calculator",
  description: "Free sleep calculator. Find the best time to go to sleep or wake up based on 90-minute sleep cycles. Wake up feeling refreshed.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["sleep calculator", "sleep cycle calculator", "bedtime calculator", "when to wake up", "sleep cycles"],
  variants: [
    {
      id: "wake-time",
      name: "I need to wake up at...",
      description: "Find the best bedtime to wake up refreshed",
      fields: [
        { name: "wakeHour", label: "Wake Up Hour (0-23)", type: "number", placeholder: "e.g. 7", min: 0, max: 23 },
        { name: "wakeMin", label: "Wake Up Minute", type: "number", placeholder: "e.g. 0", min: 0, max: 59 },
      ],
      calculate: (inputs) => {
        const h = inputs.wakeHour as number;
        const m = (inputs.wakeMin as number) || 0;
        if (h === undefined) return null;

        const wakeMinutes = h * 60 + m;
        const fallAsleepTime = 15; // average time to fall asleep
        const cycleLength = 90;

        const times: string[] = [];
        for (let cycles = 6; cycles >= 3; cycles--) {
          let bedMin = wakeMinutes - cycles * cycleLength - fallAsleepTime;
          if (bedMin < 0) bedMin += 24 * 60;
          const bh = Math.floor(bedMin / 60) % 24;
          const bm = bedMin % 60;
          const sleepHours = (cycles * cycleLength) / 60;
          times.push(`${bh.toString().padStart(2, "0")}:${bm.toString().padStart(2, "0")} (${sleepHours}h, ${cycles} cycles)`);
        }

        return {
          primary: { label: "Best bedtimes", value: times[0].split(" ")[0] },
          details: times.map((t, i) => ({
            label: i === 0 ? "Best (6 cycles)" : i === 1 ? "Good (5 cycles)" : i === 2 ? "OK (4 cycles)" : "Minimum (3 cycles)",
            value: t,
          })),
          note: "Includes ~15 min to fall asleep. A full sleep cycle is 90 minutes. Waking at the end of a cycle (not mid-cycle) helps you feel refreshed.",
        };
      },
    },
    {
      id: "bed-time",
      name: "I'm going to bed at...",
      description: "Find the best wake-up times based on your bedtime",
      fields: [
        { name: "bedHour", label: "Bedtime Hour (0-23)", type: "number", placeholder: "e.g. 23", min: 0, max: 23 },
        { name: "bedMin", label: "Bedtime Minute", type: "number", placeholder: "e.g. 0", min: 0, max: 59 },
      ],
      calculate: (inputs) => {
        const h = inputs.bedHour as number;
        const m = (inputs.bedMin as number) || 0;
        if (h === undefined) return null;

        const bedMinutes = h * 60 + m;
        const fallAsleepTime = 15;
        const cycleLength = 90;

        const times: string[] = [];
        for (let cycles = 3; cycles <= 6; cycles++) {
          let wakeMin = bedMinutes + fallAsleepTime + cycles * cycleLength;
          wakeMin = wakeMin % (24 * 60);
          const wh = Math.floor(wakeMin / 60) % 24;
          const wm = wakeMin % 60;
          const sleepHours = (cycles * cycleLength) / 60;
          times.push(`${wh.toString().padStart(2, "0")}:${wm.toString().padStart(2, "0")} (${sleepHours}h, ${cycles} cycles)`);
        }

        return {
          primary: { label: "Best wake times", value: times[3].split(" ")[0] },
          details: times.map((t, i) => ({
            label: i === 3 ? "Best (6 cycles)" : i === 2 ? "Good (5 cycles)" : i === 1 ? "OK (4 cycles)" : "Minimum (3 cycles)",
            value: t,
          })),
          note: "Includes ~15 min to fall asleep. Try to get 5-6 full sleep cycles (7.5-9 hours) for optimal rest.",
        };
      },
    },
  ],
  relatedSlugs: ["age-calculator", "calorie-calculator"],
  faq: [
    { question: "What is a sleep cycle?", answer: "A sleep cycle lasts about 90 minutes and consists of light sleep, deep sleep, and REM sleep. Adults typically need 5-6 cycles (7.5-9 hours) per night." },
    { question: "Why do I feel tired even after 8 hours of sleep?", answer: "You may be waking up in the middle of a sleep cycle. Try adjusting your alarm to coincide with the end of a 90-minute cycle. For example, 7.5 hours (5 cycles) may feel more restful than 8 hours." },
  ],
  formula: "Wake Time = Bedtime + 15 min (fall asleep) + N x 90 min cycles",
};
