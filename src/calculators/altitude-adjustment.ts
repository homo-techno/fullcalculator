import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const altitudeAdjustment: CalculatorDefinition = {
  slug: "altitude-adjustment",
  title: "Altitude Adjustment Calculator",
  description:
    "Free online altitude adjustment calculator. Calculate altitude effects on boiling point, cooking time, exercise performance, and baking adjustments.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "altitude",
    "boiling point",
    "high altitude cooking",
    "elevation",
    "altitude adjustment",
    "baking altitude",
  ],
  variants: [
    {
      id: "boiling-point",
      name: "Boiling Point at Altitude",
      fields: [
        {
          name: "altitude",
          label: "Altitude",
          type: "number",
          placeholder: "e.g. 5000",
        },
        {
          name: "unit",
          label: "Altitude Unit",
          type: "select",
          options: [
            { label: "Feet", value: "feet" },
            { label: "Meters", value: "meters" },
          ],
        },
      ],
      calculate: (inputs) => {
        const altitude = parseFloat(inputs.altitude as string) || 0;
        const unit = inputs.unit as string;

        const altFeet = unit === "meters" ? altitude * 3.28084 : altitude;
        const altMeters = unit === "meters" ? altitude : altitude / 3.28084;

        // Boiling point decreases ~1.8°F per 1000 feet
        const boilingF = 212 - (altFeet / 1000) * 1.8;
        const boilingC = (boilingF - 32) * (5 / 9);

        // Atmospheric pressure approximation
        const pressureAtm = Math.pow(1 - (0.0000225577 * altMeters), 5.25588);
        const pressurePsi = pressureAtm * 14.696;

        return {
          primary: {
            label: "Boiling Point",
            value: formatNumber(boilingF, 1) + " °F / " + formatNumber(boilingC, 1) + " °C",
          },
          details: [
            { label: "Altitude", value: formatNumber(altFeet, 0) + " ft / " + formatNumber(altMeters, 0) + " m" },
            { label: "Atmospheric Pressure", value: formatNumber(pressurePsi, 2) + " psi" },
            { label: "Pressure Ratio", value: formatNumber(pressureAtm, 4) + " atm" },
            { label: "Boiling Point Drop", value: formatNumber(212 - boilingF, 1) + " °F below sea level" },
          ],
        };
      },
    },
    {
      id: "cooking-time",
      name: "Cooking Time Adjustment",
      fields: [
        {
          name: "seaLevelTime",
          label: "Sea-Level Cooking Time (minutes)",
          type: "number",
          placeholder: "e.g. 30",
        },
        {
          name: "altitude",
          label: "Your Altitude (feet)",
          type: "number",
          placeholder: "e.g. 5000",
        },
      ],
      calculate: (inputs) => {
        const seaLevelTime = parseFloat(inputs.seaLevelTime as string) || 0;
        const altitude = parseFloat(inputs.altitude as string) || 0;

        // Increase cooking time by ~25% per 5000 feet
        const factor = 1 + (altitude / 5000) * 0.25;
        const adjustedTime = seaLevelTime * factor;
        const additionalTime = adjustedTime - seaLevelTime;

        return {
          primary: {
            label: "Adjusted Cooking Time",
            value: formatNumber(adjustedTime, 1) + " minutes",
          },
          details: [
            { label: "Sea-Level Time", value: formatNumber(seaLevelTime, 1) + " minutes" },
            { label: "Additional Time", value: "+" + formatNumber(additionalTime, 1) + " minutes" },
            { label: "Increase Factor", value: formatNumber(factor, 2) + "x" },
            { label: "Altitude", value: formatNumber(altitude) + " feet" },
          ],
        };
      },
    },
    {
      id: "exercise-performance",
      name: "Exercise Performance at Altitude",
      fields: [
        {
          name: "altitude",
          label: "Altitude (feet)",
          type: "number",
          placeholder: "e.g. 8000",
        },
        {
          name: "activityType",
          label: "Activity Type",
          type: "select",
          options: [
            { label: "Running", value: "running" },
            { label: "Cycling", value: "cycling" },
            { label: "Hiking", value: "hiking" },
            { label: "Swimming", value: "swimming" },
          ],
        },
      ],
      calculate: (inputs) => {
        const altitude = parseFloat(inputs.altitude as string) || 0;
        const activityType = inputs.activityType as string;

        // VO2max decreases ~1.9% per 1000 feet above 5000 feet
        const effectiveAlt = Math.max(0, altitude - 5000);
        const vo2Drop = (effectiveAlt / 1000) * 1.9;

        const impactMultiplier: Record<string, number> = {
          running: 1.0,
          cycling: 0.9,
          hiking: 0.8,
          swimming: 0.3,
        };

        const multiplier = impactMultiplier[activityType] || 1.0;
        const performanceDrop = vo2Drop * multiplier;
        const acclimatizationDays = Math.ceil(altitude / 2000);

        return {
          primary: {
            label: "Performance Reduction",
            value: formatNumber(performanceDrop, 1) + "%",
          },
          details: [
            { label: "VO2max Reduction", value: formatNumber(vo2Drop, 1) + "%" },
            { label: "Activity Impact", value: formatNumber(multiplier * 100, 0) + "%" },
            { label: "Acclimatization Needed", value: formatNumber(acclimatizationDays) + " days" },
            { label: "Oxygen Availability", value: formatNumber(100 - vo2Drop, 1) + "% of sea level" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["backpacking-cost", "camping-checklist-cost", "ski-trip-cost"],
  faq: [
    {
      question: "How does altitude affect cooking?",
      answer:
        "At higher altitudes, atmospheric pressure is lower, which means water boils at a lower temperature. This causes food to cook more slowly, requiring longer cooking times or the use of a pressure cooker.",
    },
    {
      question: "At what altitude do you need to adjust recipes?",
      answer:
        "Generally, cooking adjustments are recommended above 3,000 feet (914 meters). Significant adjustments are needed above 5,000 feet.",
    },
    {
      question: "How does altitude affect exercise?",
      answer:
        "Above 5,000 feet, reduced oxygen availability decreases aerobic performance. Most people need 1-3 weeks to acclimatize to altitudes above 8,000 feet.",
    },
  ],
  formula:
    "Boiling Point (°F) = 212 - (Altitude in feet / 1000) x 1.8\nCooking Time = Sea Level Time x (1 + Altitude/5000 x 0.25)",
};
