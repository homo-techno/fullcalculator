import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const humidityCalculator2: CalculatorDefinition = {
  slug: "humidity-calculator",
  title: "Humidity Calculator",
  description: "Free relative humidity calculator. Calculate relative humidity from temperature and dew point, plus comfort level assessment.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["humidity calculator", "relative humidity calculator", "dew point calculator", "humidity from temperature", "moisture calculator"],
  variants: [
    {
      id: "fahrenheit",
      name: "From °F Temperature & Dew Point",
      fields: [
        { name: "temp", label: "Air Temperature", type: "number", placeholder: "e.g. 85", suffix: "°F", step: 0.1 },
        { name: "dewPoint", label: "Dew Point", type: "number", placeholder: "e.g. 65", suffix: "°F", step: 0.1 },
      ],
      calculate: (inputs) => {
        const tempF = inputs.temp as number;
        const dpF = inputs.dewPoint as number;
        if (tempF === undefined || tempF === null || dpF === undefined || dpF === null) return null;

        // Convert to Celsius
        const T = (tempF - 32) * 5 / 9;
        const Td = (dpF - 32) * 5 / 9;

        // Magnus formula: RH = 100 × exp((17.625 × Td)/(243.04 + Td)) / exp((17.625 × T)/(243.04 + T))
        const rh = 100 * Math.exp((17.625 * Td) / (243.04 + Td)) / Math.exp((17.625 * T) / (243.04 + T));
        const rhClamped = Math.max(0, Math.min(100, rh));

        // Comfort level
        let comfort: string;
        if (dpF < 50) comfort = "Dry and comfortable";
        else if (dpF < 55) comfort = "Comfortable";
        else if (dpF < 60) comfort = "Slightly humid";
        else if (dpF < 65) comfort = "Humid — somewhat uncomfortable";
        else if (dpF < 70) comfort = "Very humid — quite uncomfortable";
        else if (dpF < 75) comfort = "Oppressive";
        else comfort = "Extremely oppressive — dangerous";

        // Heat index approximation (if temp > 80°F)
        let heatIndex = "N/A";
        if (tempF >= 80 && rhClamped >= 40) {
          const hi = -42.379 + 2.04901523 * tempF + 10.14333127 * (rhClamped / 100 * 100)
            - 0.22475541 * tempF * rhClamped
            - 0.00683783 * tempF * tempF
            - 0.05481717 * rhClamped * rhClamped
            + 0.00122874 * tempF * tempF * rhClamped
            + 0.00085282 * tempF * rhClamped * rhClamped
            - 0.00000199 * tempF * tempF * rhClamped * rhClamped;
          heatIndex = `${formatNumber(hi, 1)}°F`;
        }

        // Absolute humidity (g/m³)
        const absHumidity = (6.112 * Math.exp((17.67 * T) / (T + 243.5)) * (rhClamped / 100) * 2.1674) / (T + 273.15);

        return {
          primary: { label: "Relative Humidity", value: `${formatNumber(rhClamped, 1)}%` },
          details: [
            { label: "Comfort Level", value: comfort },
            { label: "Air Temperature", value: `${formatNumber(tempF, 1)}°F (${formatNumber(T, 1)}°C)` },
            { label: "Dew Point", value: `${formatNumber(dpF, 1)}°F (${formatNumber(Td, 1)}°C)` },
            { label: "Dew Point Depression", value: `${formatNumber(tempF - dpF, 1)}°F` },
            { label: "Absolute Humidity", value: `${formatNumber(absHumidity, 1)} g/m³` },
            { label: "Heat Index", value: heatIndex },
          ],
          note: "Dew point is a more reliable comfort indicator than relative humidity. A dew point above 65°F feels uncomfortable; above 70°F feels oppressive.",
        };
      },
    },
    {
      id: "celsius",
      name: "From °C Temperature & Dew Point",
      fields: [
        { name: "tempC", label: "Air Temperature", type: "number", placeholder: "e.g. 30", suffix: "°C", step: 0.1 },
        { name: "dewPointC", label: "Dew Point", type: "number", placeholder: "e.g. 18", suffix: "°C", step: 0.1 },
      ],
      calculate: (inputs) => {
        const T = inputs.tempC as number;
        const Td = inputs.dewPointC as number;
        if (T === undefined || T === null || Td === undefined || Td === null) return null;

        const rh = 100 * Math.exp((17.625 * Td) / (243.04 + Td)) / Math.exp((17.625 * T) / (243.04 + T));
        const rhClamped = Math.max(0, Math.min(100, rh));

        const dpF = Td * 9 / 5 + 32;
        let comfort: string;
        if (dpF < 50) comfort = "Dry and comfortable";
        else if (dpF < 55) comfort = "Comfortable";
        else if (dpF < 60) comfort = "Slightly humid";
        else if (dpF < 65) comfort = "Humid — somewhat uncomfortable";
        else if (dpF < 70) comfort = "Very humid — quite uncomfortable";
        else if (dpF < 75) comfort = "Oppressive";
        else comfort = "Extremely oppressive — dangerous";

        const absHumidity = (6.112 * Math.exp((17.67 * T) / (T + 243.5)) * (rhClamped / 100) * 2.1674) / (T + 273.15);

        return {
          primary: { label: "Relative Humidity", value: `${formatNumber(rhClamped, 1)}%` },
          details: [
            { label: "Comfort Level", value: comfort },
            { label: "Air Temperature", value: `${formatNumber(T, 1)}°C` },
            { label: "Dew Point", value: `${formatNumber(Td, 1)}°C` },
            { label: "Dew Point Depression", value: `${formatNumber(T - Td, 1)}°C` },
            { label: "Absolute Humidity", value: `${formatNumber(absHumidity, 1)} g/m³` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["beaufort-scale-calculator", "uv-index-calculator", "sunrise-sunset-calculator"],
  faq: [
    { question: "What is relative humidity?", answer: "Relative humidity is the ratio of the current amount of water vapor in the air to the maximum amount the air can hold at that temperature, expressed as a percentage. 100% means the air is fully saturated." },
    { question: "What is a comfortable humidity level?", answer: "Indoor relative humidity of 30–50% is generally comfortable. Outdoors, comfort depends more on dew point: below 55°F (13°C) is comfortable, 60–65°F (15–18°C) is noticeable, and above 70°F (21°C) is oppressive." },
    { question: "What is the difference between dew point and humidity?", answer: "Dew point is the temperature at which air becomes saturated and dew forms. It's an absolute measure of moisture. Relative humidity changes with temperature — the same moisture content gives different RH% at different temperatures." },
  ],
  formula: "RH = 100 × exp((17.625 × Td)/(243.04 + Td)) / exp((17.625 × T)/(243.04 + T))",
};
