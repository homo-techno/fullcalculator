import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wattHoursToJoules: CalculatorDefinition = {
  slug: "watt-hours-to-joules",
  title: "Watt-hours to Joules",
  description: "Free watt-hours to Joules converter. Convert energy from watt-hours to Joules instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["watt hours to joules", "Wh to J", "energy conversion", "watt-hours joules"],
  variants: [
    {
      id: "watt-hours-to-joules",
      name: "Watt-hours to Joules",
      fields: [
        { name: "wattHours", label: "Energy (Wh)", type: "number", placeholder: "e.g. 1", suffix: "Wh" },
      ],
      calculate: (inputs) => {
        const wattHours = inputs.wattHours as number;
        if (wattHours === undefined) return null;
        const joules = wattHours * 3600;
        const kJ = joules / 1000;
        const calories = joules / 4.184;
        const kilocalories = calories / 1000;
        const btu = joules / 1055.06;
        const kWh = wattHours / 1000;
        return {
          primary: { label: "Joules", value: formatNumber(joules, 2), suffix: "J" },
          details: [
            { label: "Watt-hours", value: `${formatNumber(wattHours, 4)} Wh` },
            { label: "Joules", value: `${formatNumber(joules, 2)} J` },
            { label: "Kilojoules", value: `${formatNumber(kJ, 4)} kJ` },
            { label: "Calories", value: `${formatNumber(calories, 2)} cal` },
            { label: "Kilocalories", value: `${formatNumber(kilocalories, 4)} kcal` },
            { label: "BTU", value: `${formatNumber(btu, 4)} BTU` },
            { label: "Kilowatt-hours", value: `${formatNumber(kWh, 6)} kWh` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["joules-to-calories", "calories-to-joules", "energy"],
  faq: [
    { question: "How do I convert watt-hours to Joules?", answer: "Multiply the energy in watt-hours by 3,600. For example, 1 Wh = 3,600 J." },
    { question: "Why multiply by 3600?", answer: "One watt-hour is the energy of 1 watt sustained for 1 hour. Since 1 hour = 3,600 seconds and 1 watt = 1 joule per second, 1 Wh = 3,600 J." },
  ],
  formula: "J = Wh × 3,600",
};
