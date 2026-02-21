import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mapDistanceCalculator: CalculatorDefinition = {
  slug: "map-distance-calculator",
  title: "Map Distance Calculator",
  description:
    "Free map distance calculator. Convert map measurements to real-world distances using map scale ratios and ruler measurements.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "map distance",
    "map scale",
    "map measurement",
    "scale calculator",
    "map ruler distance",
  ],
  variants: [
    {
      id: "scale",
      name: "Map Scale to Real Distance",
      description: "Convert a map measurement to real distance using scale",
      fields: [
        {
          name: "mapMeasurement",
          label: "Measurement on Map",
          type: "number",
          placeholder: "e.g. 3.5",
        },
        {
          name: "mapUnit",
          label: "Map Measurement Unit",
          type: "select",
          options: [
            { label: "Inches", value: "in" },
            { label: "Centimeters", value: "cm" },
            { label: "Millimeters", value: "mm" },
          ],
          defaultValue: "in",
        },
        {
          name: "scaleRatio",
          label: "Map Scale",
          type: "select",
          options: [
            { label: "1:10,000 (city detail)", value: "10000" },
            { label: "1:24,000 (USGS topo)", value: "24000" },
            { label: "1:50,000 (regional)", value: "50000" },
            { label: "1:100,000 (area map)", value: "100000" },
            { label: "1:250,000 (state/province)", value: "250000" },
            { label: "1:500,000 (regional)", value: "500000" },
            { label: "1:1,000,000 (country)", value: "1000000" },
            { label: "1:5,000,000 (continent)", value: "5000000" },
          ],
          defaultValue: "24000",
        },
      ],
      calculate: (inputs) => {
        const mapMeasurement = inputs.mapMeasurement as number;
        const mapUnit = inputs.mapUnit as string;
        const scaleRatio = parseInt(inputs.scaleRatio as string);
        if (!mapMeasurement || mapMeasurement <= 0 || !scaleRatio) return null;

        let measurementCm: number;
        if (mapUnit === "in") measurementCm = mapMeasurement * 2.54;
        else if (mapUnit === "mm") measurementCm = mapMeasurement / 10;
        else measurementCm = mapMeasurement;

        const realDistanceCm = measurementCm * scaleRatio;
        const realDistanceM = realDistanceCm / 100;
        const realDistanceKm = realDistanceM / 1000;
        const realDistanceMiles = realDistanceKm * 0.621371;
        const realDistanceFeet = realDistanceMiles * 5280;
        const realDistanceYards = realDistanceFeet / 3;

        return {
          primary: {
            label: "Real-World Distance",
            value: realDistanceKm >= 1
              ? `${formatNumber(realDistanceKm, 2)} km (${formatNumber(realDistanceMiles, 2)} mi)`
              : `${formatNumber(realDistanceM, 1)} meters (${formatNumber(realDistanceFeet, 0)} ft)`,
          },
          details: [
            { label: "Map measurement", value: `${formatNumber(mapMeasurement, 2)} ${mapUnit}` },
            { label: "Scale", value: `1:${formatNumber(scaleRatio, 0)}` },
            { label: "Real distance (km)", value: `${formatNumber(realDistanceKm, 3)} km` },
            { label: "Real distance (miles)", value: `${formatNumber(realDistanceMiles, 3)} mi` },
            { label: "Real distance (meters)", value: `${formatNumber(realDistanceM, 1)} m` },
            { label: "Real distance (feet)", value: `${formatNumber(realDistanceFeet, 0)} ft` },
            { label: "Real distance (yards)", value: `${formatNumber(realDistanceYards, 0)} yd` },
          ],
        };
      },
    },
    {
      id: "custom",
      name: "Custom Scale Bar",
      description: "Calculate distance using a custom scale bar",
      fields: [
        {
          name: "scaleBarMap",
          label: "Scale Bar Length on Map (cm)",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "scaleBarReal",
          label: "Scale Bar Real Distance",
          type: "number",
          placeholder: "e.g. 5",
        },
        {
          name: "scaleBarUnit",
          label: "Scale Bar Real Unit",
          type: "select",
          options: [
            { label: "Kilometers", value: "km" },
            { label: "Miles", value: "mi" },
            { label: "Meters", value: "m" },
            { label: "Feet", value: "ft" },
          ],
          defaultValue: "km",
        },
        {
          name: "measurementOnMap",
          label: "Your Measurement on Map (cm)",
          type: "number",
          placeholder: "e.g. 7.5",
        },
      ],
      calculate: (inputs) => {
        const scaleBarMap = inputs.scaleBarMap as number;
        const scaleBarReal = inputs.scaleBarReal as number;
        const scaleBarUnit = inputs.scaleBarUnit as string;
        const measurementOnMap = inputs.measurementOnMap as number;
        if (!scaleBarMap || !scaleBarReal || !measurementOnMap) return null;

        const ratio = measurementOnMap / scaleBarMap;
        const realDistance = scaleBarReal * ratio;

        let distKm: number;
        if (scaleBarUnit === "km") distKm = realDistance;
        else if (scaleBarUnit === "mi") distKm = realDistance * 1.60934;
        else if (scaleBarUnit === "m") distKm = realDistance / 1000;
        else distKm = realDistance * 0.0003048;

        const distMi = distKm * 0.621371;

        return {
          primary: {
            label: "Real-World Distance",
            value: `${formatNumber(realDistance, 2)} ${scaleBarUnit}`,
          },
          details: [
            { label: "Scale bar (map)", value: `${formatNumber(scaleBarMap, 1)} cm` },
            { label: "Scale bar (real)", value: `${formatNumber(scaleBarReal, 1)} ${scaleBarUnit}` },
            { label: "Your measurement", value: `${formatNumber(measurementOnMap, 1)} cm` },
            { label: "Ratio to scale bar", value: `${formatNumber(ratio, 2)}x` },
            { label: "Distance (km)", value: `${formatNumber(distKm, 2)} km` },
            { label: "Distance (miles)", value: `${formatNumber(distMi, 2)} mi` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["latitude-longitude-calculator", "driving-time-calculator"],
  faq: [
    {
      question: "How do I read a map scale?",
      answer:
        "A map scale like 1:24,000 means 1 unit on the map equals 24,000 of the same units in reality. So 1 inch on the map = 24,000 inches (2,000 feet or about 0.38 miles) in the real world. Larger ratios like 1:1,000,000 cover more area with less detail.",
    },
    {
      question: "What map scale is best for hiking?",
      answer:
        "For hiking and trail navigation, 1:24,000 or 1:25,000 scale maps are ideal. These show enough detail to identify trails, contour lines, water features, and landmarks. USGS topographic maps use 1:24,000 scale in the US.",
    },
    {
      question: "How accurate is measuring distance on a map?",
      answer:
        "Map measurements are approximate because maps are 2D projections of a 3D surface. Straight-line measurements don't account for terrain changes. For accurate trail distances, measure in small segments along curves. Digital mapping tools typically provide more accurate distance calculations.",
    },
  ],
  formula:
    "Real Distance = Map Measurement x Scale Ratio; Custom: Real Distance = (Your Measurement / Scale Bar Map Length) x Scale Bar Real Distance.",
};
