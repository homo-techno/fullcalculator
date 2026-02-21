import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mapScaleCalculator: CalculatorDefinition = {
  slug: "map-scale-calculator",
  title: "Map Scale Calculator",
  description: "Free map scale calculator. Convert map distances to real-world distances using map scale ratios.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["map scale", "distance", "ratio", "cartography", "map reading", "calculator"],
  variants: [
    {
      id: "convert",
      name: "Calculate Real Distance",
      fields: [
        { name: "mapDistance", label: "Map Distance", type: "number", placeholder: "e.g. 5" },
        { name: "distanceUnit", label: "Map Distance Unit", type: "select", options: [
          { label: "Centimetres (cm)", value: "cm" },
          { label: "Inches (in)", value: "in" },
        ]},
        { name: "scaleRatio", label: "Scale Ratio (1:X)", type: "number", placeholder: "e.g. 50000" },
      ],
      calculate: (inputs) => {
        const mapDistance = inputs.mapDistance as number;
        const distanceUnit = (inputs.distanceUnit as string) || "cm";
        const scaleRatio = inputs.scaleRatio as number;
        if (!mapDistance || !scaleRatio) return null;
        // Convert map distance to cm first
        const mapDistanceCm = distanceUnit === "in" ? mapDistance * 2.54 : mapDistance;
        // Real distance in cm
        const realDistanceCm = mapDistanceCm * scaleRatio;
        const realDistanceM = realDistanceCm / 100;
        const realDistanceKm = realDistanceCm / 100000;
        const realDistanceMiles = realDistanceKm * 0.621371;
        const realDistanceFt = realDistanceM * 3.28084;
        return {
          primary: { label: "Real Distance", value: `${formatNumber(realDistanceKm, 4)} km` },
          details: [
            { label: "Map Distance", value: `${formatNumber(mapDistance, 2)} ${distanceUnit}` },
            { label: "Scale", value: `1:${formatNumber(scaleRatio, 0)}` },
            { label: "Real Distance (m)", value: formatNumber(realDistanceM, 2) },
            { label: "Real Distance (km)", value: formatNumber(realDistanceKm, 4) },
            { label: "Real Distance (miles)", value: formatNumber(realDistanceMiles, 4) },
            { label: "Real Distance (feet)", value: formatNumber(realDistanceFt, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["nautical-converter", "astronomical-unit-converter"],
  faq: [
    { question: "How do I use a map scale?", answer: "Multiply the distance measured on the map by the scale ratio. For example, 3 cm on a 1:50,000 map = 3 × 50,000 = 150,000 cm = 1.5 km." },
    { question: "What does 1:25000 mean?", answer: "A scale of 1:25,000 means 1 cm on the map represents 25,000 cm (250 m or 0.25 km) in reality." },
  ],
  formula: "Real distance = map distance × scale ratio. Convert units as needed: 100 cm = 1 m, 100,000 cm = 1 km.",
};
