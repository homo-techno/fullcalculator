import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sleepCycleCalculator: CalculatorDefinition = {
  slug: "sleep-cycle-calculator",
  title: "Sleep Cycle Calculator",
  description:
    "Free sleep cycle calculator. Find the optimal time to wake up or go to sleep based on 90-minute sleep cycles. Wake up feeling refreshed by timing your sleep cycles.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "sleep cycle calculator",
    "optimal wake time",
    "sleep calculator",
    "when to wake up",
    "sleep cycles",
    "REM sleep",
    "90 minute sleep cycle",
    "best time to sleep",
  ],
  variants: [
    {
      id: "wake-time",
      name: "When to Wake Up",
      description: "Find optimal wake times based on when you go to sleep",
      fields: [
        {
          name: "bedtimeHour",
          label: "Bedtime Hour (1-12)",
          type: "number",
          placeholder: "e.g. 10",
          min: 1,
          max: 12,
        },
        {
          name: "bedtimeMinute",
          label: "Bedtime Minutes",
          type: "number",
          placeholder: "e.g. 30",
          min: 0,
          max: 59,
        },
        {
          name: "bedtimePeriod",
          label: "AM or PM",
          type: "select",
          options: [
            { label: "PM", value: "pm" },
            { label: "AM", value: "am" },
          ],
        },
        {
          name: "fallAsleepTime",
          label: "Minutes to Fall Asleep",
          type: "select",
          options: [
            { label: "10 minutes", value: "10" },
            { label: "15 minutes (average)", value: "15" },
            { label: "20 minutes", value: "20" },
            { label: "30 minutes", value: "30" },
            { label: "45 minutes", value: "45" },
          ],
        },
      ],
      calculate: (inputs) => {
        const hour = inputs.bedtimeHour as number;
        const minute = (inputs.bedtimeMinute as number) || 0;
        const period = inputs.bedtimePeriod as string;
        const fallAsleepStr = inputs.fallAsleepTime as string;
        if (!hour || !period || !fallAsleepStr) return null;
        const fallAsleep = parseInt(fallAsleepStr);

        // Convert to 24-hour format
        let hour24 = hour;
        if (period === "pm" && hour !== 12) hour24 += 12;
        if (period === "am" && hour === 12) hour24 = 0;

        // Calculate sleep onset in minutes from midnight
        let sleepOnset = hour24 * 60 + minute + fallAsleep;

        // Sleep cycle = 90 minutes
        const cycleLength = 90;
        const wakeOptions: { cycles: number; time: string; totalSleep: string }[] = [];

        for (let cycles = 4; cycles <= 7; cycles++) {
          const totalSleepMin = cycles * cycleLength;
          let wakeMin = sleepOnset + totalSleepMin;
          if (wakeMin >= 1440) wakeMin -= 1440;

          const wakeHr24 = Math.floor(wakeMin / 60);
          const wakeMinute = Math.round(wakeMin % 60);
          const wakeHr12 = wakeHr24 > 12 ? wakeHr24 - 12 : wakeHr24 === 0 ? 12 : wakeHr24;
          const wakePeriod = wakeHr24 >= 12 ? "AM" : "AM";
          const wakeAmPm = wakeHr24 >= 12 ? "PM" : "AM";

          const sleepHrs = Math.floor(totalSleepMin / 60);
          const sleepMins = totalSleepMin % 60;

          wakeOptions.push({
            cycles,
            time: `${wakeHr12}:${String(wakeMinute).padStart(2, "0")} ${wakeAmPm}`,
            totalSleep: `${sleepHrs}h ${sleepMins}m`,
          });
        }

        const recommended = wakeOptions.find(w => w.cycles === 5 || w.cycles === 6);

        return {
          primary: { label: "Recommended Wake Time", value: wakeOptions[2]?.time || wakeOptions[1]?.time || "" },
          details: [
            ...wakeOptions.map(w => ({
              label: `${w.cycles} cycles (${w.totalSleep})`,
              value: `Wake at ${w.time}${w.cycles === 5 ? " (minimum recommended)" : w.cycles === 6 ? " (ideal)" : ""}`,
            })),
            { label: "Bedtime", value: `${hour}:${String(minute).padStart(2, "0")} ${period.toUpperCase()}` },
            { label: "Estimated sleep onset", value: `+${fallAsleep} min after bedtime` },
          ],
          note: "Sleep cycles average 90 minutes. Waking at the end of a cycle (light sleep phase) helps you feel more refreshed. Most adults need 5-6 complete cycles (7.5-9 hours). Individual cycle length varies (80-120 minutes). This is a general guide, not medical advice.",
        };
      },
    },
    {
      id: "bedtime",
      name: "When to Go to Sleep",
      description: "Find optimal bedtimes based on when you need to wake up",
      fields: [
        {
          name: "wakeHour",
          label: "Wake-up Hour (1-12)",
          type: "number",
          placeholder: "e.g. 6",
          min: 1,
          max: 12,
        },
        {
          name: "wakeMinute",
          label: "Wake-up Minutes",
          type: "number",
          placeholder: "e.g. 30",
          min: 0,
          max: 59,
        },
        {
          name: "wakePeriod",
          label: "AM or PM",
          type: "select",
          options: [
            { label: "AM", value: "am" },
            { label: "PM", value: "pm" },
          ],
        },
        {
          name: "fallAsleepTime",
          label: "Minutes to Fall Asleep",
          type: "select",
          options: [
            { label: "10 minutes", value: "10" },
            { label: "15 minutes (average)", value: "15" },
            { label: "20 minutes", value: "20" },
            { label: "30 minutes", value: "30" },
            { label: "45 minutes", value: "45" },
          ],
        },
      ],
      calculate: (inputs) => {
        const hour = inputs.wakeHour as number;
        const minute = (inputs.wakeMinute as number) || 0;
        const period = inputs.wakePeriod as string;
        const fallAsleepStr = inputs.fallAsleepTime as string;
        if (!hour || !period || !fallAsleepStr) return null;
        const fallAsleep = parseInt(fallAsleepStr);

        let hour24 = hour;
        if (period === "pm" && hour !== 12) hour24 += 12;
        if (period === "am" && hour === 12) hour24 = 0;

        const wakeMin = hour24 * 60 + minute;
        const cycleLength = 90;
        const bedtimeOptions: { cycles: number; time: string; totalSleep: string }[] = [];

        for (let cycles = 4; cycles <= 7; cycles++) {
          const totalSleepMin = cycles * cycleLength;
          let bedMin = wakeMin - totalSleepMin - fallAsleep;
          if (bedMin < 0) bedMin += 1440;

          const bedHr24 = Math.floor(bedMin / 60);
          const bedMinute = Math.round(bedMin % 60);
          const bedHr12 = bedHr24 > 12 ? bedHr24 - 12 : bedHr24 === 0 ? 12 : bedHr24;
          const bedAmPm = bedHr24 >= 12 ? "PM" : "AM";

          const sleepHrs = Math.floor(totalSleepMin / 60);
          const sleepMins = totalSleepMin % 60;

          bedtimeOptions.push({
            cycles,
            time: `${bedHr12}:${String(bedMinute).padStart(2, "0")} ${bedAmPm}`,
            totalSleep: `${sleepHrs}h ${sleepMins}m`,
          });
        }

        return {
          primary: { label: "Recommended Bedtime", value: bedtimeOptions[2]?.time || bedtimeOptions[1]?.time || "" },
          details: [
            ...bedtimeOptions.reverse().map(b => ({
              label: `${b.cycles} cycles (${b.totalSleep})`,
              value: `Go to bed at ${b.time}${b.cycles === 6 ? " (ideal)" : b.cycles === 5 ? " (minimum recommended)" : ""}`,
            })),
            { label: "Wake-up time", value: `${hour}:${String(minute).padStart(2, "0")} ${period.toUpperCase()}` },
            { label: "Fall-asleep buffer", value: `${fallAsleep} minutes` },
          ],
          note: "These times account for your estimated time to fall asleep. For best results, maintain a consistent sleep schedule, even on weekends. The ideal amount of sleep for most adults is 7-9 hours (5-6 cycles). This is a general guide based on average 90-minute cycles.",
        };
      },
    },
  ],
  relatedSlugs: ["sleep-calculator", "sleep-debt-calculator"],
  faq: [
    {
      question: "What is a sleep cycle?",
      answer:
        "A sleep cycle consists of four stages: NREM Stage 1 (light sleep, 5-10 min), NREM Stage 2 (deeper sleep, 20 min), NREM Stage 3 (deep/slow-wave sleep, 20-40 min), and REM sleep (dreaming, 10-60 min). One full cycle averages about 90 minutes.",
    },
    {
      question: "How many sleep cycles do I need?",
      answer:
        "Most adults need 5-6 complete cycles (7.5-9 hours of sleep) per night. The National Sleep Foundation recommends 7-9 hours for adults aged 18-64, and 7-8 hours for adults 65+. Teens need 8-10 hours.",
    },
    {
      question: "Why do I feel groggy when I wake up?",
      answer:
        "Sleep inertia (grogginess) is worse when you wake during deep sleep (NREM Stage 3). By timing your alarm to the end of a 90-minute cycle, you are more likely to wake during lighter sleep, feeling more alert and refreshed.",
    },
    {
      question: "How long does it take to fall asleep?",
      answer:
        "The average healthy adult takes about 10-20 minutes to fall asleep (sleep latency). If you consistently fall asleep in under 5 minutes, you may be sleep-deprived. If it takes over 30 minutes regularly, you may have insomnia. Consult a sleep specialist if concerned.",
    },
  ],
  formula:
    "Sleep cycle = ~90 minutes | Wake time = Bedtime + Fall asleep time + (Cycles x 90 min) | Bedtime = Wake time - Fall asleep time - (Cycles x 90 min) | Recommended: 5-6 cycles (7.5-9 hours)",
};
