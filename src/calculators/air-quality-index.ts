import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const airQualityIndexCalculator: CalculatorDefinition = {
  slug: "air-quality-index-calculator",
  title: "Air Quality Index Calculator",
  description: "Free air quality index (AQI) calculator. Convert pollutant concentrations to AQI values and understand health implications.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["air quality index calculator", "AQI calculator", "air pollution calculator", "PM2.5 calculator", "air quality health index"],
  variants: [
    {
      id: "pm25",
      name: "PM2.5 (Fine Particles)",
      description: "Calculate AQI from PM2.5 concentration",
      fields: [
        { name: "concentration", label: "PM2.5 Concentration (ug/m3)", type: "number", placeholder: "e.g. 35.5", step: 0.1 },
      ],
      calculate: (inputs) => {
        const c = inputs.concentration as number;
        if (c === undefined || c < 0) return null;
        // EPA breakpoints for PM2.5 (24-hour average)
        const breakpoints = [
          { cLow: 0, cHigh: 12.0, iLow: 0, iHigh: 50 },
          { cLow: 12.1, cHigh: 35.4, iLow: 51, iHigh: 100 },
          { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150 },
          { cLow: 55.5, cHigh: 150.4, iLow: 151, iHigh: 200 },
          { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },
          { cLow: 250.5, cHigh: 500.4, iLow: 301, iHigh: 500 },
        ];
        let bp = breakpoints[breakpoints.length - 1];
        for (const b of breakpoints) {
          if (c >= b.cLow && c <= b.cHigh) { bp = b; break; }
        }
        const aqi = Math.round(((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (c - bp.cLow) + bp.iLow);
        let category = "Good";
        let color = "Green";
        let healthMsg = "Air quality is satisfactory. Little to no health risk.";
        if (aqi > 300) { category = "Hazardous"; color = "Maroon"; healthMsg = "Health emergency. Everyone should avoid all outdoor activity."; }
        else if (aqi > 200) { category = "Very Unhealthy"; color = "Purple"; healthMsg = "Health alert. Everyone may experience serious health effects."; }
        else if (aqi > 150) { category = "Unhealthy"; color = "Red"; healthMsg = "Everyone may begin to experience health effects. Sensitive groups at greater risk."; }
        else if (aqi > 100) { category = "Unhealthy for Sensitive Groups"; color = "Orange"; healthMsg = "Sensitive groups (children, elderly, those with respiratory conditions) should limit prolonged outdoor exertion."; }
        else if (aqi > 50) { category = "Moderate"; color = "Yellow"; healthMsg = "Acceptable air quality. Some pollutants may be a concern for unusually sensitive people."; }
        return {
          primary: { label: "Air Quality Index (AQI)", value: `${aqi}` },
          details: [
            { label: "Category", value: category },
            { label: "Color code", value: color },
            { label: "PM2.5 concentration", value: `${c} ug/m3` },
            { label: "Health advisory", value: healthMsg },
          ],
        };
      },
    },
    {
      id: "pm10",
      name: "PM10 (Coarse Particles)",
      description: "Calculate AQI from PM10 concentration",
      fields: [
        { name: "concentration", label: "PM10 Concentration (ug/m3)", type: "number", placeholder: "e.g. 155", step: 1 },
      ],
      calculate: (inputs) => {
        const c = inputs.concentration as number;
        if (c === undefined || c < 0) return null;
        const breakpoints = [
          { cLow: 0, cHigh: 54, iLow: 0, iHigh: 50 },
          { cLow: 55, cHigh: 154, iLow: 51, iHigh: 100 },
          { cLow: 155, cHigh: 254, iLow: 101, iHigh: 150 },
          { cLow: 255, cHigh: 354, iLow: 151, iHigh: 200 },
          { cLow: 355, cHigh: 424, iLow: 201, iHigh: 300 },
          { cLow: 425, cHigh: 604, iLow: 301, iHigh: 500 },
        ];
        let bp = breakpoints[breakpoints.length - 1];
        for (const b of breakpoints) {
          if (c >= b.cLow && c <= b.cHigh) { bp = b; break; }
        }
        const aqi = Math.round(((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (c - bp.cLow) + bp.iLow);
        let category = "Good";
        if (aqi > 300) category = "Hazardous";
        else if (aqi > 200) category = "Very Unhealthy";
        else if (aqi > 150) category = "Unhealthy";
        else if (aqi > 100) category = "Unhealthy for Sensitive Groups";
        else if (aqi > 50) category = "Moderate";
        return {
          primary: { label: "Air Quality Index (AQI)", value: `${aqi}` },
          details: [
            { label: "Category", value: category },
            { label: "PM10 concentration", value: `${c} ug/m3` },
            { label: "Pollutant", value: "Particulate Matter (coarse, < 10 um)" },
          ],
        };
      },
    },
    {
      id: "ozone",
      name: "Ozone (O3)",
      description: "Calculate AQI from ozone concentration",
      fields: [
        { name: "concentration", label: "Ozone Concentration (ppb)", type: "number", placeholder: "e.g. 70", step: 1 },
      ],
      calculate: (inputs) => {
        const c = inputs.concentration as number;
        if (c === undefined || c < 0) return null;
        // 8-hour average breakpoints for ozone (ppb)
        const breakpoints = [
          { cLow: 0, cHigh: 54, iLow: 0, iHigh: 50 },
          { cLow: 55, cHigh: 70, iLow: 51, iHigh: 100 },
          { cLow: 71, cHigh: 85, iLow: 101, iHigh: 150 },
          { cLow: 86, cHigh: 105, iLow: 151, iHigh: 200 },
          { cLow: 106, cHigh: 200, iLow: 201, iHigh: 300 },
        ];
        let bp = breakpoints[breakpoints.length - 1];
        for (const b of breakpoints) {
          if (c >= b.cLow && c <= b.cHigh) { bp = b; break; }
        }
        const aqi = Math.round(((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (c - bp.cLow) + bp.iLow);
        let category = "Good";
        if (aqi > 200) category = "Very Unhealthy";
        else if (aqi > 150) category = "Unhealthy";
        else if (aqi > 100) category = "Unhealthy for Sensitive Groups";
        else if (aqi > 50) category = "Moderate";
        return {
          primary: { label: "Air Quality Index (AQI)", value: `${aqi}` },
          details: [
            { label: "Category", value: category },
            { label: "Ozone concentration", value: `${c} ppb (8-hr avg)` },
            { label: "Pollutant", value: "Ground-level Ozone (O3)" },
          ],
          note: "Based on 8-hour average concentration. Ozone is typically highest in warm, sunny afternoons.",
        };
      },
    },
  ],
  relatedSlugs: ["humidity-calculator", "wind-chill-calculator", "uv-index-calculator"],
  faq: [
    { question: "What is AQI and how is it calculated?", answer: "The Air Quality Index (AQI) is a standardized scale from 0-500 that translates pollutant concentrations into health risk categories. The EPA uses a piecewise linear function to convert raw concentrations of pollutants (PM2.5, PM10, ozone, CO, SO2, NO2) into a unified 0-500 index." },
    { question: "What AQI level is safe?", answer: "AQI 0-50 (Good/Green) is considered safe for everyone. AQI 51-100 (Moderate/Yellow) is acceptable but may affect unusually sensitive people. Above 100, sensitive groups should reduce outdoor activity. Above 150, everyone should limit exposure." },
    { question: "What causes bad air quality?", answer: "Major causes include: vehicle emissions, industrial pollution, wildfires, dust storms, power plant emissions, and chemical reactions forming ground-level ozone. PM2.5 from wildfires is a growing concern in many US regions." },
  ],
  formula: "AQI = ((IHi - ILo) / (BPHi - BPLo)) × (Cp - BPLo) + ILo | where Cp = concentration, BP = breakpoint, I = AQI index value",
};
