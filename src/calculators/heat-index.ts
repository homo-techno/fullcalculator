import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const heatIndexCalculator: CalculatorDefinition = {
  slug: "heat-index-calculator",
  title: "Heat Index Calculator",
  description: "Free heat index calculator. Calculate the heat index (feels-like temperature) from air temperature and relative humidity.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["heat index calculator", "feels like temperature", "humidity calculator", "apparent temperature"],
  variants: [
    {
      id: "fahrenheit",
      name: "Fahrenheit",
      fields: [
        { name: "temp", label: "Air Temperature (°F)", type: "number", placeholder: "e.g. 90" },
        { name: "rh", label: "Relative Humidity (%)", type: "number", placeholder: "e.g. 65" },
      ],
      calculate: (inputs) => {
        const t = inputs.temp as number, rh = inputs.rh as number;
        if (!t || !rh) return null;
        if (t < 80) return { primary: { label: "Heat Index", value: `${formatNumber(t, 1)}°F` }, details: [{ label: "Note", value: "Heat index is only calculated when temp ≥ 80°F" }] };
        const c1 = -42.379, c2 = 2.04901523, c3 = 10.14333127, c4 = -0.22475541;
        const c5 = -0.00683783, c6 = -0.05481717, c7 = 0.00122874, c8 = 0.00085282, c9 = -0.00000199;
        let hi = c1 + c2*t + c3*rh + c4*t*rh + c5*t*t + c6*rh*rh + c7*t*t*rh + c8*t*rh*rh + c9*t*t*rh*rh;
        let danger = "Caution";
        if (hi >= 130) danger = "Extreme Danger";
        else if (hi >= 105) danger = "Danger";
        else if (hi >= 90) danger = "Extreme Caution";
        return {
          primary: { label: "Heat Index", value: `${formatNumber(hi, 1)}°F` },
          details: [
            { label: "Danger level", value: danger },
            { label: "Actual temperature", value: `${t}°F` },
            { label: "Humidity", value: `${rh}%` },
          ],
        };
      },
    },
    {
      id: "celsius",
      name: "Celsius",
      fields: [
        { name: "temp", label: "Air Temperature (°C)", type: "number", placeholder: "e.g. 32" },
        { name: "rh", label: "Relative Humidity (%)", type: "number", placeholder: "e.g. 65" },
      ],
      calculate: (inputs) => {
        const tC = inputs.temp as number, rh = inputs.rh as number;
        if (!tC || !rh) return null;
        const t = tC * 9 / 5 + 32;
        if (t < 80) return { primary: { label: "Heat Index", value: `${formatNumber(tC, 1)}°C` }, details: [{ label: "Note", value: "Heat index is only calculated when temp ≥ 27°C" }] };
        const c1 = -42.379, c2 = 2.04901523, c3 = 10.14333127, c4 = -0.22475541;
        const c5 = -0.00683783, c6 = -0.05481717, c7 = 0.00122874, c8 = 0.00085282, c9 = -0.00000199;
        const hiF = c1 + c2*t + c3*rh + c4*t*rh + c5*t*t + c6*rh*rh + c7*t*t*rh + c8*t*rh*rh + c9*t*t*rh*rh;
        const hiC = (hiF - 32) * 5 / 9;
        return {
          primary: { label: "Heat Index", value: `${formatNumber(hiC, 1)}°C` },
          details: [
            { label: "Heat index (°F)", value: `${formatNumber(hiF, 1)}°F` },
            { label: "Actual temperature", value: `${tC}°C` },
            { label: "Humidity", value: `${rh}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wind-chill-calculator", "dew-point-calculator", "unit-converter"],
  faq: [{ question: "What is the heat index?", answer: "The heat index combines air temperature and humidity to show how hot it really feels. High humidity prevents sweat from evaporating, making it feel hotter. A temp of 90°F with 65% humidity feels like 103°F." }],
  formula: "Rothfusz regression equation (NWS)",
};
