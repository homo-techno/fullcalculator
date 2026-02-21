import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const moonPhaseCalculator: CalculatorDefinition = {
  slug: "moon-phase-calculator",
  title: "Moon Phase Calculator",
  description: "Free moon phase calculator. Find the moon phase, illumination percentage, and days until the next full or new moon for any date.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["moon phase calculator", "moon phase today", "full moon calculator", "lunar phase", "moon illumination", "new moon calculator"],
  variants: [
    {
      id: "calc",
      name: "Calculate Moon Phase",
      fields: [
        { name: "month", label: "Month (1–12)", type: "number", placeholder: "e.g. 3", min: 1, max: 12 },
        { name: "day", label: "Day (1–31)", type: "number", placeholder: "e.g. 15", min: 1, max: 31 },
        { name: "year", label: "Year", type: "number", placeholder: "e.g. 2024", min: 1900, max: 2100 },
      ],
      calculate: (inputs) => {
        const month = inputs.month as number;
        const day = inputs.day as number;
        const year = inputs.year as number;
        if (!month || !day || !year) return null;

        const date = new Date(year, month - 1, day);
        if (date.getMonth() !== month - 1 || date.getDate() !== day) {
          return { primary: { label: "Error", value: "Invalid date" }, details: [] };
        }

        // Reference: January 6, 2000 = New Moon
        const referenceDate = new Date(2000, 0, 6);
        const synodicMonth = 29.53058867; // days

        const diffDays = (date.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24);
        const moonAge = ((diffDays % synodicMonth) + synodicMonth) % synodicMonth;

        // Phase name based on moon age
        let phaseName: string;
        let phaseEmoji: string;
        if (moonAge < 1.85) { phaseName = "New Moon"; phaseEmoji = "New"; }
        else if (moonAge < 7.38) { phaseName = "Waxing Crescent"; phaseEmoji = "Waxing Crescent"; }
        else if (moonAge < 9.23) { phaseName = "First Quarter"; phaseEmoji = "First Quarter"; }
        else if (moonAge < 14.77) { phaseName = "Waxing Gibbous"; phaseEmoji = "Waxing Gibbous"; }
        else if (moonAge < 16.61) { phaseName = "Full Moon"; phaseEmoji = "Full"; }
        else if (moonAge < 22.15) { phaseName = "Waning Gibbous"; phaseEmoji = "Waning Gibbous"; }
        else if (moonAge < 23.99) { phaseName = "Last Quarter"; phaseEmoji = "Last Quarter"; }
        else if (moonAge < 27.68) { phaseName = "Waning Crescent"; phaseEmoji = "Waning Crescent"; }
        else { phaseName = "New Moon"; phaseEmoji = "New"; }

        // Illumination percentage (approximate)
        const illumination = (1 - Math.cos(2 * Math.PI * moonAge / synodicMonth)) / 2 * 100;

        // Days until next new moon
        const daysToNewMoon = synodicMonth - moonAge;

        // Days until next full moon
        const halfSynodic = synodicMonth / 2;
        let daysToFullMoon = halfSynodic - moonAge;
        if (daysToFullMoon < 0) daysToFullMoon += synodicMonth;

        return {
          primary: { label: "Moon Phase", value: phaseName },
          details: [
            { label: "Moon Age", value: `${formatNumber(moonAge, 1)} days into cycle` },
            { label: "Illumination", value: `${formatNumber(illumination, 1)}%` },
            { label: "Days to Next New Moon", value: formatNumber(daysToNewMoon, 1) },
            { label: "Days to Next Full Moon", value: formatNumber(daysToFullMoon, 1) },
            { label: "Synodic Month", value: `${formatNumber(synodicMonth, 2)} days` },
            { label: "Cycle Position", value: `${formatNumber(moonAge / synodicMonth * 100, 1)}%` },
          ],
          note: "This is an approximation based on the average synodic month. Actual moon phases may differ by up to a day due to orbital variations.",
        };
      },
    },
  ],
  relatedSlugs: ["sunrise-sunset-calculator", "day-of-week-calculator", "date-calculator"],
  faq: [
    { question: "What is a synodic month?", answer: "A synodic month (about 29.53 days) is the time between two consecutive new moons. It represents one complete cycle of moon phases as seen from Earth." },
    { question: "How accurate is this moon phase calculator?", answer: "This calculator uses the average synodic month of 29.53 days from a known new moon reference date (January 6, 2000). It is accurate to within about 1 day for dates within a few decades of the reference." },
    { question: "What causes moon phases?", answer: "Moon phases are caused by the changing angle between the Sun, Earth, and Moon as the Moon orbits Earth. We see different amounts of the Moon's illuminated half depending on this angle." },
  ],
  formula: "Moon age = (date − Jan 6, 2000) mod 29.53 days | Illumination ≈ (1 − cos(2π × age / 29.53)) / 2",
};
