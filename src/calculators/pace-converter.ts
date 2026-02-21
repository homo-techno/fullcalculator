import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const paceConverterCalculator: CalculatorDefinition = {
  slug: "pace-converter-calculator",
  title: "Pace Converter Calculator",
  description:
    "Free running pace converter. Convert between min/mile and min/km, plus calculate speed in mph and kph instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "pace converter",
    "min per mile to min per km",
    "running pace converter",
    "pace conversion",
    "km pace to mile pace",
  ],
  variants: [
    {
      id: "mile-to-km",
      name: "Min/Mile to Min/Km",
      description: "Convert pace from minutes per mile to minutes per kilometer",
      fields: [
        { name: "minutes", label: "Minutes", type: "number", placeholder: "e.g. 8", min: 0 },
        { name: "seconds", label: "Seconds", type: "number", placeholder: "e.g. 30", min: 0, max: 59 },
      ],
      calculate: (inputs) => {
        const mins = (inputs.minutes as number) || 0;
        const secs = (inputs.seconds as number) || 0;
        if (mins <= 0 && secs <= 0) return null;

        const totalSecPerMile = mins * 60 + secs;
        const totalSecPerKm = totalSecPerMile * 0.621371;
        const kmMin = Math.floor(totalSecPerKm / 60);
        const kmSec = Math.round(totalSecPerKm % 60);

        const speedMph = 3600 / totalSecPerMile;
        const speedKph = speedMph * 1.60934;

        return {
          primary: {
            label: "Pace per Km",
            value: `${kmMin}:${kmSec.toString().padStart(2, "0")}`,
            suffix: "min/km",
          },
          details: [
            { label: "Pace per Mile", value: `${mins}:${secs.toString().padStart(2, "0")} min/mi` },
            { label: "Speed (mph)", value: formatNumber(speedMph, 2) },
            { label: "Speed (kph)", value: formatNumber(speedKph, 2) },
          ],
        };
      },
    },
    {
      id: "km-to-mile",
      name: "Min/Km to Min/Mile",
      description: "Convert pace from minutes per kilometer to minutes per mile",
      fields: [
        { name: "minutes", label: "Minutes", type: "number", placeholder: "e.g. 5", min: 0 },
        { name: "seconds", label: "Seconds", type: "number", placeholder: "e.g. 15", min: 0, max: 59 },
      ],
      calculate: (inputs) => {
        const mins = (inputs.minutes as number) || 0;
        const secs = (inputs.seconds as number) || 0;
        if (mins <= 0 && secs <= 0) return null;

        const totalSecPerKm = mins * 60 + secs;
        const totalSecPerMile = totalSecPerKm / 0.621371;
        const mileMin = Math.floor(totalSecPerMile / 60);
        const mileSec = Math.round(totalSecPerMile % 60);

        const speedKph = 3600 / totalSecPerKm;
        const speedMph = speedKph / 1.60934;

        return {
          primary: {
            label: "Pace per Mile",
            value: `${mileMin}:${mileSec.toString().padStart(2, "0")}`,
            suffix: "min/mi",
          },
          details: [
            { label: "Pace per Km", value: `${mins}:${secs.toString().padStart(2, "0")} min/km` },
            { label: "Speed (kph)", value: formatNumber(speedKph, 2) },
            { label: "Speed (mph)", value: formatNumber(speedMph, 2) },
          ],
        };
      },
    },
    {
      id: "speed-to-pace",
      name: "Speed to Pace",
      description: "Convert speed (mph or kph) to pace (min/mile or min/km)",
      fields: [
        { name: "speed", label: "Speed", type: "number", placeholder: "e.g. 6.5", step: 0.1 },
        {
          name: "unit",
          label: "Unit",
          type: "select",
          options: [
            { label: "mph", value: "mph" },
            { label: "kph", value: "kph" },
          ],
          defaultValue: "mph",
        },
      ],
      calculate: (inputs) => {
        const speed = inputs.speed as number;
        const unit = inputs.unit as string;
        if (!speed || speed <= 0) return null;

        const speedMph = unit === "kph" ? speed / 1.60934 : speed;
        const speedKph = unit === "mph" ? speed * 1.60934 : speed;

        const secPerMile = 3600 / speedMph;
        const secPerKm = 3600 / speedKph;

        const mileMin = Math.floor(secPerMile / 60);
        const mileSec = Math.round(secPerMile % 60);
        const kmMin = Math.floor(secPerKm / 60);
        const kmSec = Math.round(secPerKm % 60);

        return {
          primary: {
            label: "Pace per Mile",
            value: `${mileMin}:${mileSec.toString().padStart(2, "0")}`,
            suffix: "min/mi",
          },
          details: [
            { label: "Pace per Km", value: `${kmMin}:${kmSec.toString().padStart(2, "0")} min/km` },
            { label: "Speed (mph)", value: formatNumber(speedMph, 2) },
            { label: "Speed (kph)", value: formatNumber(speedKph, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pace-calculator", "running-splits-calculator", "running-calorie-calculator"],
  faq: [
    {
      question: "How do I convert min/mile to min/km?",
      answer:
        "Multiply your pace in min/mile by 0.621371 to get min/km. For example, 8:00 min/mile = 4:58 min/km. Alternatively, divide total seconds per mile by 1.60934 to get seconds per km.",
    },
    {
      question: "What is a good running pace?",
      answer:
        "For beginners, 10-12 min/mile (6:13-7:27 min/km) is typical. Intermediate runners average 8-10 min/mile (4:58-6:13 min/km). Competitive runners often run 6-8 min/mile (3:43-4:58 min/km).",
    },
    {
      question: "How do I convert speed to pace?",
      answer:
        "Divide 60 by your speed in mph (or kph) to get minutes per mile (or km). For example, 7.5 mph = 60/7.5 = 8:00 min/mile.",
    },
  ],
  formula: "min/km = min/mile × 0.621371 | min/mile = min/km ÷ 0.621371 | Pace = 60 / Speed",
};
