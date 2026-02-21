import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dewPointCalculator: CalculatorDefinition = {
  slug: "dew-point-calculator",
  title: "Dew Point Calculator",
  description: "Free dew point calculator. Calculate the dew point temperature from air temperature and relative humidity.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["dew point calculator", "dew point temperature", "humidity dew point", "condensation temperature"],
  variants: [
    {
      id: "celsius",
      name: "Celsius",
      fields: [
        { name: "temp", label: "Air Temperature (°C)", type: "number", placeholder: "e.g. 25" },
        { name: "rh", label: "Relative Humidity (%)", type: "number", placeholder: "e.g. 60" },
      ],
      calculate: (inputs) => {
        const t = inputs.temp as number, rh = inputs.rh as number;
        if (t === undefined || !rh) return null;
        const a = 17.27, b = 237.7;
        const alpha = (a * t) / (b + t) + Math.log(rh / 100);
        const dp = (b * alpha) / (a - alpha);
        let comfort = "Comfortable";
        if (dp > 24) comfort = "Severely uncomfortable";
        else if (dp > 20) comfort = "Uncomfortable – muggy";
        else if (dp > 16) comfort = "Somewhat uncomfortable";
        else if (dp < 0) comfort = "Very dry";
        return {
          primary: { label: "Dew Point", value: `${formatNumber(dp, 1)}°C` },
          details: [
            { label: "Comfort level", value: comfort },
            { label: "Spread (T - Dp)", value: `${formatNumber(t - dp, 1)}°C` },
          ],
        };
      },
    },
    {
      id: "fahrenheit",
      name: "Fahrenheit",
      fields: [
        { name: "temp", label: "Air Temperature (°F)", type: "number", placeholder: "e.g. 77" },
        { name: "rh", label: "Relative Humidity (%)", type: "number", placeholder: "e.g. 60" },
      ],
      calculate: (inputs) => {
        const tF = inputs.temp as number, rh = inputs.rh as number;
        if (tF === undefined || !rh) return null;
        const t = (tF - 32) * 5 / 9;
        const a = 17.27, b = 237.7;
        const alpha = (a * t) / (b + t) + Math.log(rh / 100);
        const dpC = (b * alpha) / (a - alpha);
        const dpF = dpC * 9 / 5 + 32;
        return {
          primary: { label: "Dew Point", value: `${formatNumber(dpF, 1)}°F` },
          details: [
            { label: "Dew point (°C)", value: `${formatNumber(dpC, 1)}°C` },
            { label: "Spread (T - Dp)", value: `${formatNumber(tF - dpF, 1)}°F` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["heat-index-calculator", "wind-chill-calculator", "unit-converter"],
  faq: [{ question: "What is dew point?", answer: "Dew point is the temperature at which air becomes saturated and water vapor condenses into dew. A dew point above 65°F (18°C) feels humid, above 70°F (21°C) is uncomfortable, and above 75°F (24°C) is oppressive." }],
  formula: "Dp = 237.7 × α / (17.27 - α), where α = 17.27T/(237.7+T) + ln(RH/100)",
};
