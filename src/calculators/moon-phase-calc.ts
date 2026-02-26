import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const moonPhaseCalc: CalculatorDefinition = {
  slug: "moon-phase-calculator",
  title: "Moon Phase Calculator",
  description:
    "Free online moon phase calculator. Determine the moon phase for any given date using a synodic month approximation.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "moon phase calculator",
    "lunar phase",
    "full moon",
    "new moon",
    "moon cycle",
    "synodic month",
  ],
  variants: [
    {
      id: "phase",
      name: "Moon Phase for a Date",
      description: "Calculate the moon phase for a specific date",
      fields: [
        {
          name: "year",
          label: "Year",
          type: "number",
          placeholder: "e.g. 2026",
          min: 1900,
          max: 2100,
        },
        {
          name: "month",
          label: "Month",
          type: "number",
          placeholder: "1-12",
          min: 1,
          max: 12,
        },
        {
          name: "day",
          label: "Day",
          type: "number",
          placeholder: "1-31",
          min: 1,
          max: 31,
        },
      ],
      calculate: (inputs) => {
        const year = parseFloat(inputs.year as string) || 0;
        const month = parseFloat(inputs.month as string) || 0;
        const day = parseFloat(inputs.day as string) || 0;
        if (!year || !month || !day) return null;

        // Known new moon reference: January 6, 2000 18:14 UTC
        const knownNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));
        const targetDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
        const synodicMonth = 29.53058867;

        const diffMs = targetDate.getTime() - knownNewMoon.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        const moonAge = ((diffDays % synodicMonth) + synodicMonth) % synodicMonth;
        const illumination = (1 - Math.cos((2 * Math.PI * moonAge) / synodicMonth)) / 2;

        let phaseName: string;
        if (moonAge < 1.85) phaseName = "New Moon";
        else if (moonAge < 7.38) phaseName = "Waxing Crescent";
        else if (moonAge < 9.23) phaseName = "First Quarter";
        else if (moonAge < 14.77) phaseName = "Waxing Gibbous";
        else if (moonAge < 16.61) phaseName = "Full Moon";
        else if (moonAge < 22.15) phaseName = "Waning Gibbous";
        else if (moonAge < 23.99) phaseName = "Last Quarter";
        else if (moonAge < 27.68) phaseName = "Waning Crescent";
        else phaseName = "New Moon";

        return {
          primary: {
            label: "Moon Phase",
            value: phaseName,
          },
          details: [
            { label: "Moon age", value: `${formatNumber(moonAge)} days` },
            { label: "Illumination", value: `${formatNumber(illumination * 100)}%` },
            { label: "Synodic month", value: `${formatNumber(synodicMonth)} days` },
          ],
        };
      },
    },
    {
      id: "next-full",
      name: "Next Full Moon",
      description: "Estimate the next full moon from a given date",
      fields: [
        {
          name: "year",
          label: "Year",
          type: "number",
          placeholder: "e.g. 2026",
          min: 1900,
          max: 2100,
        },
        {
          name: "month",
          label: "Month",
          type: "number",
          placeholder: "1-12",
          min: 1,
          max: 12,
        },
        {
          name: "day",
          label: "Day",
          type: "number",
          placeholder: "1-31",
          min: 1,
          max: 31,
        },
      ],
      calculate: (inputs) => {
        const year = parseFloat(inputs.year as string) || 0;
        const month = parseFloat(inputs.month as string) || 0;
        const day = parseFloat(inputs.day as string) || 0;
        if (!year || !month || !day) return null;

        const knownNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));
        const targetDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
        const synodicMonth = 29.53058867;

        const diffMs = targetDate.getTime() - knownNewMoon.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        const moonAge = ((diffDays % synodicMonth) + synodicMonth) % synodicMonth;

        const fullMoonAge = synodicMonth / 2;
        let daysToFull = fullMoonAge - moonAge;
        if (daysToFull < 0) daysToFull += synodicMonth;

        const nextFullDate = new Date(targetDate.getTime() + daysToFull * 24 * 60 * 60 * 1000);

        return {
          primary: {
            label: "Days Until Next Full Moon",
            value: formatNumber(Math.round(daysToFull)),
            suffix: "days",
          },
          details: [
            {
              label: "Estimated full moon date",
              value: nextFullDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
            },
            { label: "Current moon age", value: `${formatNumber(moonAge)} days` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["age-calculator", "countdown-calculator"],
  faq: [
    {
      question: "How is the moon phase calculated?",
      answer:
        "The calculator uses the synodic month (29.53 days) and a known new moon reference date (January 6, 2000) to estimate how far along the lunar cycle a given date falls.",
    },
    {
      question: "How accurate is this moon phase calculator?",
      answer:
        "This calculator provides a reasonable approximation. For precise astronomical data, consult a dedicated ephemeris or observatory resource. The approximation can be off by up to a day.",
    },
  ],
  formula: "Moon Age = (Target Date - Known New Moon) mod 29.53 days",
};
