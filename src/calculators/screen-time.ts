import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const screenTimeCalculator: CalculatorDefinition = {
  slug: "screen-time-calculator",
  title: "Screen Time Calculator",
  description:
    "Free screen time calculator. See how much of your life you spend on screens and get insights on daily, weekly, and yearly screen usage.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "screen time",
    "phone usage",
    "digital wellness",
    "screen hours",
    "device time",
    "daily screen time",
  ],
  variants: [
    {
      id: "daily-screen-time",
      name: "Daily Screen Time",
      description: "Calculate total screen time across all your devices",
      fields: [
        {
          name: "phoneHours",
          label: "Phone (hours/day)",
          type: "number",
          placeholder: "e.g. 3",
          min: 0,
          max: 24,
          step: 0.5,
        },
        {
          name: "computerHours",
          label: "Computer/Laptop (hours/day)",
          type: "number",
          placeholder: "e.g. 6",
          min: 0,
          max: 24,
          step: 0.5,
        },
        {
          name: "tvHours",
          label: "TV/Streaming (hours/day)",
          type: "number",
          placeholder: "e.g. 2",
          min: 0,
          max: 24,
          step: 0.5,
        },
        {
          name: "tabletHours",
          label: "Tablet/Other (hours/day)",
          type: "number",
          placeholder: "e.g. 1",
          min: 0,
          max: 24,
          step: 0.5,
        },
        {
          name: "age",
          label: "Your Age",
          type: "number",
          placeholder: "e.g. 30",
          min: 1,
          max: 120,
        },
      ],
      calculate: (inputs) => {
        const phone = (inputs.phoneHours as number) || 0;
        const computer = (inputs.computerHours as number) || 0;
        const tv = (inputs.tvHours as number) || 0;
        const tablet = (inputs.tabletHours as number) || 0;
        const age = (inputs.age as number) || 30;

        const dailyTotal = phone + computer + tv + tablet;
        if (dailyTotal <= 0) return null;

        const weeklyTotal = dailyTotal * 7;
        const monthlyTotal = dailyTotal * 30.44;
        const yearlyTotal = dailyTotal * 365.25;
        const yearlyDays = yearlyTotal / 24;
        const awakeHours = 16;
        const percentAwake = (dailyTotal / awakeHours) * 100;
        const remainingLifeYears = Math.max(0, 78 - age);
        const lifetimeScreenHours = remainingLifeYears * yearlyTotal;
        const lifetimeScreenYears = lifetimeScreenHours / (365.25 * 24);

        return {
          primary: {
            label: "Daily Screen Time",
            value: formatNumber(dailyTotal, 1),
            suffix: "hours/day",
          },
          details: [
            { label: "Phone", value: `${formatNumber(phone, 1)} hrs/day` },
            { label: "Computer", value: `${formatNumber(computer, 1)} hrs/day` },
            { label: "TV/Streaming", value: `${formatNumber(tv, 1)} hrs/day` },
            { label: "Tablet/Other", value: `${formatNumber(tablet, 1)} hrs/day` },
            { label: "Weekly total", value: `${formatNumber(weeklyTotal, 1)} hours` },
            { label: "Monthly total", value: `${formatNumber(monthlyTotal, 0)} hours` },
            { label: "Yearly total", value: `${formatNumber(yearlyTotal, 0)} hours (${formatNumber(yearlyDays, 1)} full days)` },
            { label: "% of waking hours", value: `${formatNumber(percentAwake, 1)}%` },
            { label: "Projected lifetime screen time", value: `${formatNumber(lifetimeScreenYears, 1)} years` },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "productivity-calculator",
    "sleep-calculator",
    "binge-watch-time-calculator",
  ],
  faq: [
    {
      question: "How much screen time is too much?",
      answer:
        "Experts recommend no more than 2 hours of recreational screen time per day for adults. Work-related screen time is harder to avoid but should be offset with regular breaks.",
    },
    {
      question: "How is lifetime screen time calculated?",
      answer:
        "The calculator multiplies your daily screen time by 365.25 days per year, then by the estimated remaining years of life (based on a 78-year average lifespan).",
    },
  ],
  formula:
    "Daily Total = Phone + Computer + TV + Tablet. Yearly = Daily x 365.25. Lifetime = Yearly x (78 - Age).",
};
