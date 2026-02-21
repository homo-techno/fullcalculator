import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const soundSpeedCalculator: CalculatorDefinition = {
  slug: "sound-speed-calculator",
  title: "Speed of Sound Calculator",
  description:
    "Free speed of sound calculator. Calculate the speed of sound in air at any temperature, plus speeds in water and steel.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "speed of sound",
    "sound velocity",
    "mach number",
    "acoustics",
    "sound in air",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "temperature",
          label: "Air Temperature",
          type: "number",
          placeholder: "e.g. 20",
        },
        {
          name: "tempUnit",
          label: "Temperature Unit",
          type: "select",
          options: [
            { label: "Celsius (C)", value: "C" },
            { label: "Fahrenheit (F)", value: "F" },
          ],
        },
      ],
      calculate: (inputs) => {
        const temp = inputs.temperature as number;
        const unit = (inputs.tempUnit as string) || "C";
        if (temp === undefined || temp === null) return null;

        let tempC = temp;
        if (unit === "F") {
          tempC = (temp - 32) * (5 / 9);
        }

        // Speed of sound in dry air: v = 331.3 + 0.606 * T(C)
        const speedAirMs = 331.3 + 0.606 * tempC;
        const speedAirKmh = speedAirMs * 3.6;
        const speedAirMph = speedAirMs * 2.237;
        const speedAirFtS = speedAirMs * 3.281;

        // Other media (approximate, less temperature dependent)
        const speedWater = 1480; // m/s at ~20C
        const speedSteel = 5960; // m/s
        const speedGlass = 5640; // m/s
        const speedWood = 3850; // m/s

        // Mach 1 at this temperature
        const mach1 = speedAirMs;

        return {
          primary: {
            label: "Speed in Air",
            value: formatNumber(speedAirMs, 1) + " m/s",
          },
          details: [
            {
              label: "Speed (km/h)",
              value: formatNumber(speedAirKmh, 1) + " km/h",
            },
            {
              label: "Speed (mph)",
              value: formatNumber(speedAirMph, 1) + " mph",
            },
            {
              label: "Speed (ft/s)",
              value: formatNumber(speedAirFtS, 1) + " ft/s",
            },
            {
              label: "Temperature",
              value: formatNumber(tempC, 1) + " C / " + formatNumber(tempC * 9 / 5 + 32, 1) + " F",
            },
            {
              label: "Mach 1",
              value: formatNumber(mach1, 1) + " m/s at this temp",
            },
            {
              label: "Speed in Water (~20C)",
              value: formatNumber(speedWater, 0) + " m/s",
            },
            {
              label: "Speed in Steel",
              value: formatNumber(speedSteel, 0) + " m/s",
            },
            {
              label: "Speed in Glass",
              value: formatNumber(speedGlass, 0) + " m/s",
            },
            {
              label: "Speed in Wood",
              value: formatNumber(speedWood, 0) + " m/s",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["tuning-frequency-calculator", "room-acoustics-calculator"],
  faq: [
    {
      question: "How fast does sound travel in air?",
      answer:
        "At 20C (68F), sound travels at about 343 m/s (1,235 km/h or 767 mph) in dry air. The speed increases by about 0.6 m/s for each degree Celsius increase in temperature.",
    },
    {
      question: "Why does sound travel faster in water than air?",
      answer:
        "Sound travels about 4.3 times faster in water (~1,480 m/s) than air because water is denser and more elastic. Sound waves transfer energy more efficiently through the closely packed molecules.",
    },
  ],
  formula:
    "Speed in air (m/s) = 331.3 + 0.606 x Temperature(C). Conversions: x 3.6 = km/h, x 2.237 = mph, x 3.281 = ft/s. Water ~1480 m/s, Steel ~5960 m/s.",
};
