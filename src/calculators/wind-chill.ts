import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const windChillCalculator: CalculatorDefinition = {
  slug: "wind-chill-calculator",
  title: "Wind Chill Calculator",
  description: "Free wind chill calculator. Calculate the wind chill temperature index from air temperature and wind speed.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["wind chill calculator", "wind chill factor", "feels like temperature", "wind chill index", "windchill"],
  variants: [
    {
      id: "fahrenheit",
      name: "Fahrenheit / MPH",
      fields: [
        { name: "temp", label: "Air Temperature (°F)", type: "number", placeholder: "e.g. 20" },
        { name: "wind", label: "Wind Speed (mph)", type: "number", placeholder: "e.g. 15" },
      ],
      calculate: (inputs) => {
        const t = inputs.temp as number, v = inputs.wind as number;
        if (t === undefined || !v) return null;
        if (t > 50 || v < 3) return { primary: { label: "Wind Chill", value: `${formatNumber(t, 1)}°F` }, details: [{ label: "Note", value: "Wind chill only applies when temp ≤ 50°F and wind ≥ 3 mph" }] };
        const wc = 35.74 + 0.6215 * t - 35.75 * Math.pow(v, 0.16) + 0.4275 * t * Math.pow(v, 0.16);
        let risk = "Low";
        if (wc <= -20) risk = "High – frostbite in 30 min";
        else if (wc <= 0) risk = "Moderate – frostbite in 10-30 min";
        if (wc <= -40) risk = "Extreme – frostbite in < 5 min";
        return {
          primary: { label: "Wind Chill", value: `${formatNumber(wc, 1)}°F` },
          details: [
            { label: "Actual temperature", value: `${t}°F` },
            { label: "Wind speed", value: `${v} mph` },
            { label: "Frostbite risk", value: risk },
          ],
        };
      },
    },
    {
      id: "celsius",
      name: "Celsius / km/h",
      fields: [
        { name: "temp", label: "Air Temperature (°C)", type: "number", placeholder: "e.g. -5" },
        { name: "wind", label: "Wind Speed (km/h)", type: "number", placeholder: "e.g. 25" },
      ],
      calculate: (inputs) => {
        const t = inputs.temp as number, v = inputs.wind as number;
        if (t === undefined || !v) return null;
        if (t > 10 || v < 4.8) return { primary: { label: "Wind Chill", value: `${formatNumber(t, 1)}°C` }, details: [{ label: "Note", value: "Wind chill only applies when temp ≤ 10°C and wind ≥ 4.8 km/h" }] };
        const wc = 13.12 + 0.6215 * t - 11.37 * Math.pow(v, 0.16) + 0.3965 * t * Math.pow(v, 0.16);
        return {
          primary: { label: "Wind Chill", value: `${formatNumber(wc, 1)}°C` },
          details: [
            { label: "Actual temperature", value: `${t}°C` },
            { label: "Wind speed", value: `${v} km/h` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["heat-index-calculator", "dew-point-calculator", "unit-converter"],
  faq: [{ question: "What is wind chill?", answer: "Wind chill is the perceived decrease in air temperature felt by the body due to wind. The NWS formula considers air temperature and wind speed to calculate how cold it 'feels like'. Wind chill only applies when temp ≤ 50°F (10°C) and wind ≥ 3 mph." }],
  formula: "WC = 35.74 + 0.6215T - 35.75V^0.16 + 0.4275TV^0.16 (°F, mph)",
};
