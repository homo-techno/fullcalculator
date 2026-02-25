import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bingeWatchTimeCalculator: CalculatorDefinition = {
  slug: "binge-watch-time-calculator",
  title: "Binge Watch Time Calculator",
  description:
    "Free binge watch time calculator. Find out how long it takes to binge-watch an entire TV series based on number of episodes, episode length, and your daily watching time.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "binge watch",
    "binge watching",
    "tv series time",
    "show marathon",
    "episode calculator",
    "watch time",
  ],
  variants: [
    {
      id: "binge-time",
      name: "Binge Watch Planner",
      description: "Calculate how long it takes to binge a series",
      fields: [
        {
          name: "totalEpisodes",
          label: "Total Episodes",
          type: "number",
          placeholder: "e.g. 73",
          min: 1,
          max: 10000,
        },
        {
          name: "episodeLength",
          label: "Average Episode Length (minutes)",
          type: "number",
          placeholder: "e.g. 55",
          min: 1,
          max: 300,
        },
        {
          name: "hoursPerDay",
          label: "Hours of Watching per Day",
          type: "number",
          placeholder: "e.g. 3",
          min: 0.5,
          max: 24,
          step: 0.5,
        },
        {
          name: "skipIntro",
          label: "Skip Intros/Credits?",
          type: "select",
          options: [
            { label: "No", value: "0" },
            { label: "Yes (save ~2 min/ep)", value: "2" },
            { label: "Yes (save ~4 min/ep)", value: "4" },
          ],
        },
      ],
      calculate: (inputs) => {
        const episodes = inputs.totalEpisodes as number;
        const epLength = inputs.episodeLength as number;
        const hoursPerDay = inputs.hoursPerDay as number;
        const skipStr = (inputs.skipIntro as string) || "0";

        if (!episodes || !epLength || !hoursPerDay) return null;

        const skipMin = parseFloat(skipStr);
        const effectiveLength = Math.max(1, epLength - skipMin);
        const totalMinutes = episodes * effectiveLength;
        const totalHours = totalMinutes / 60;
        const totalDaysWatching = totalHours / hoursPerDay;
        const totalWeeks = totalDaysWatching / 7;
        const timeSavedMinutes = episodes * skipMin;

        const episodesPerDay = (hoursPerDay * 60) / effectiveLength;
        const nonstopDays = totalHours / 24;

        return {
          primary: {
            label: "Total Watch Time",
            value: `${formatNumber(totalHours, 1)} hours`,
          },
          details: [
            { label: "Total episodes", value: formatNumber(episodes) },
            { label: "Effective episode length", value: `${formatNumber(effectiveLength)} min` },
            { label: "Total minutes", value: formatNumber(totalMinutes, 0) },
            { label: "Days to complete", value: formatNumber(totalDaysWatching, 1) },
            { label: "Weeks to complete", value: formatNumber(totalWeeks, 1) },
            { label: "Episodes per day", value: formatNumber(episodesPerDay, 1) },
            { label: "Time saved skipping intros", value: `${formatNumber(timeSavedMinutes, 0)} min` },
            { label: "Non-stop marathon", value: `${formatNumber(nonstopDays, 1)} days` },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "screen-time-calculator",
    "streaming-cost-calculator",
    "time-duration-calculator",
  ],
  faq: [
    {
      question: "How long does it take to binge Game of Thrones?",
      answer:
        "Game of Thrones has 73 episodes averaging about 57 minutes each, totaling roughly 69 hours. At 3 hours per day, it would take about 23 days to binge.",
    },
    {
      question: "How long is a typical TV series marathon?",
      answer:
        "A typical 8-season network show (180+ episodes at 42 min each) takes about 126 hours. At 4 hours per day, that is about 32 days of watching.",
    },
  ],
  formula:
    "Total Time = Episodes x (Episode Length - Skip Time). Days = Total Time / (Hours per Day x 60).",
};
