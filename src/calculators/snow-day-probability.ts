import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const snowDayProbabilityCalculator: CalculatorDefinition = {
  slug: "snow-day-probability-calculator",
  title: "Snow Day Probability Calculator",
  description:
    "Free snow day probability calculator. Estimate the chance of a school snow day based on expected snowfall, temperature, timing, and local conditions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "snow day",
    "snow day probability",
    "school closing",
    "snow day calculator",
    "will school close",
    "snow forecast",
  ],
  variants: [
    {
      id: "snow-probability",
      name: "Snow Day Chance",
      description: "Estimate the probability of a snow day",
      fields: [
        {
          name: "snowfall",
          label: "Expected Snowfall (inches)",
          type: "number",
          placeholder: "e.g. 6",
          min: 0,
          max: 48,
          step: 0.5,
        },
        {
          name: "temperature",
          label: "Low Temperature (°F)",
          type: "number",
          placeholder: "e.g. 20",
          min: -40,
          max: 50,
        },
        {
          name: "timing",
          label: "When is Snow Expected?",
          type: "select",
          options: [
            { label: "Overnight (before morning)", value: "overnight" },
            { label: "Early morning (4-7 AM)", value: "early" },
            { label: "During school hours", value: "during" },
            { label: "Afternoon/evening before", value: "before" },
          ],
        },
        {
          name: "region",
          label: "Region Type",
          type: "select",
          options: [
            { label: "South (rarely snows)", value: "south" },
            { label: "Mid-Atlantic", value: "mid" },
            { label: "Midwest", value: "midwest" },
            { label: "Northeast", value: "northeast" },
            { label: "Mountain/North", value: "mountain" },
          ],
        },
        {
          name: "icyRoads",
          label: "Icy Road Conditions?",
          type: "select",
          options: [
            { label: "No", value: "no" },
            { label: "Possible", value: "possible" },
            { label: "Likely", value: "likely" },
          ],
        },
      ],
      calculate: (inputs) => {
        const snowfall = (inputs.snowfall as number) || 0;
        const temperature = (inputs.temperature as number) ?? 25;
        const timing = (inputs.timing as string) || "overnight";
        const region = (inputs.region as string) || "mid";
        const icyRoads = (inputs.icyRoads as string) || "no";

        // Base probability from snowfall
        let probability = 0;
        if (snowfall >= 12) probability = 95;
        else if (snowfall >= 8) probability = 85;
        else if (snowfall >= 6) probability = 70;
        else if (snowfall >= 4) probability = 50;
        else if (snowfall >= 3) probability = 35;
        else if (snowfall >= 2) probability = 20;
        else if (snowfall >= 1) probability = 10;
        else probability = 2;

        // Temperature modifier
        if (temperature <= 0) probability += 15;
        else if (temperature <= 10) probability += 10;
        else if (temperature <= 20) probability += 5;
        else if (temperature >= 35) probability -= 10;

        // Timing modifier
        if (timing === "overnight" || timing === "early") probability += 10;
        else if (timing === "during") probability += 5;
        else probability -= 5;

        // Region modifier (southern schools close more easily)
        const regionModifiers: Record<string, number> = {
          south: 25,
          mid: 10,
          midwest: 0,
          northeast: -5,
          mountain: -15,
        };
        probability += regionModifiers[region] || 0;

        // Icy roads
        if (icyRoads === "likely") probability += 20;
        else if (icyRoads === "possible") probability += 10;

        probability = Math.max(0, Math.min(99, probability));

        let verdict: string;
        if (probability >= 80) verdict = "Very likely - set that alarm late!";
        else if (probability >= 60) verdict = "Good chance - keep your fingers crossed";
        else if (probability >= 40) verdict = "Maybe - could go either way";
        else if (probability >= 20) verdict = "Unlikely - probably have school";
        else verdict = "Very unlikely - do your homework";

        return {
          primary: {
            label: "Snow Day Probability",
            value: `${formatNumber(probability, 0)}%`,
          },
          details: [
            { label: "Verdict", value: verdict },
            { label: "Expected snowfall", value: `${formatNumber(snowfall, 1)} inches` },
            { label: "Low temperature", value: `${formatNumber(temperature, 0)}°F` },
            { label: "Snow timing", value: timing },
            { label: "Region", value: region },
            { label: "Icy roads", value: icyRoads },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "wind-chill-calculator",
    "dew-point-calculator",
    "weather-calculator",
  ],
  faq: [
    {
      question: "How much snow does it take for a snow day?",
      answer:
        "This varies greatly by region. Southern US schools may close with 1-2 inches, while northern schools may stay open with 6+ inches. Generally, 4-6 inches gives a moderate chance in most areas.",
    },
    {
      question: "Is this calculator accurate?",
      answer:
        "This is a fun estimate based on common factors. Actual snow day decisions depend on road conditions, bus routes, local policies, and school district judgment. Always check official announcements.",
    },
  ],
  formula:
    "Probability is estimated from snowfall amount, temperature, timing of snowfall, regional tolerance, and road conditions. Each factor adjusts a base percentage.",
};
