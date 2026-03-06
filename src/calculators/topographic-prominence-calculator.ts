import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const topographicProminenceCalculator: CalculatorDefinition = {
  slug: "topographic-prominence-calculator",
  title: "Topographic Prominence Calculator",
  description: "Calculate the topographic prominence and isolation of a peak by comparing its summit elevation to the highest col connecting it to a higher peak.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["topographic prominence","peak prominence","mountain elevation","summit isolation","peak bagging"],
  variants: [{
    id: "standard",
    name: "Topographic Prominence",
    description: "Calculate the topographic prominence and isolation of a peak by comparing its summit elevation to the highest col connecting it to a higher peak.",
    fields: [
      { name: "summitElevation", label: "Summit Elevation (meters)", type: "number", min: 1, max: 9000, defaultValue: 3000 },
      { name: "colElevation", label: "Key Col Elevation (meters)", type: "number", min: 0, max: 8999, defaultValue: 2200 },
      { name: "parentPeakElevation", label: "Parent Peak Elevation (meters)", type: "number", min: 1, max: 9000, defaultValue: 4000 },
      { name: "distanceToParent", label: "Distance to Parent Peak (km)", type: "number", min: 0.1, max: 1000, defaultValue: 25 },
    ],
    calculate: (inputs) => {
    const summit = inputs.summitElevation as number;
    const col = inputs.colElevation as number;
    const parent = inputs.parentPeakElevation as number;
    const dist = inputs.distanceToParent as number;
    const prominence = summit - col;
    const promRatio = summit > 0 ? (prominence / summit) * 100 : 0;
    const isolation = dist;
    const rise = parent - col;
    const colDepth = summit - col;
    const classification = prominence >= 1500 ? "Ultra-Prominent Peak" : prominence >= 600 ? "Major Peak" : prominence >= 150 ? "Notable Peak" : prominence >= 30 ? "Minor Peak" : "Subpeak";
    const lineOfSight = Math.sqrt(Math.pow(dist * 1000, 2) + Math.pow(parent - summit, 2)) / 1000;
    return {
      primary: { label: "Topographic Prominence", value: formatNumber(Math.round(prominence)) + " m" },
      details: [
        { label: "Prominence Ratio", value: formatNumber(parseFloat(promRatio.toFixed(1))) + "%" },
        { label: "Classification", value: classification },
        { label: "Isolation Distance", value: formatNumber(parseFloat(isolation.toFixed(1))) + " km" },
        { label: "Col Depth", value: formatNumber(Math.round(colDepth)) + " m" },
        { label: "Line-of-Sight to Parent", value: formatNumber(parseFloat(lineOfSight.toFixed(2))) + " km" }
      ]
    };
  },
  }],
  relatedSlugs: ["land-survey-area-calculator","slope-stability-factor-calculator","river-discharge-rate-calculator"],
  faq: [
    { question: "What is topographic prominence?", answer: "Prominence is the height of a peak above the lowest contour that encircles it but no higher peak. In simpler terms, it is how far you must descend from the summit before ascending a higher peak." },
    { question: "What is an ultra-prominent peak?", answer: "An ultra-prominent peak has at least 1,500 meters (about 4,921 feet) of topographic prominence. There are roughly 1,524 ultra-prominent peaks worldwide. Mount Everest has the greatest prominence at 8,849 meters." },
    { question: "What is the difference between prominence and elevation?", answer: "Elevation is the height above sea level. Prominence measures how much a peak stands out from its surroundings. A 3,000m peak next to a 2,900m ridge has only 100m prominence despite its high elevation." },
  ],
  formula: "Prominence = Summit Elevation - Key Col Elevation; Prominence Ratio = (Prominence / Summit Elevation) x 100%; Line-of-Sight = sqrt(Distance^2 + Elevation Difference^2)",
};
