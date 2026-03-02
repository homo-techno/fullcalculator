import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const smokeDetectorCalculator: CalculatorDefinition = {
  slug: "smoke-detector-calculator",
  title: "Smoke Detector Calculator",
  description: "Determine how many smoke detectors your building needs.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["smoke detector","smoke alarm calculator"],
  variants: [{
    id: "standard",
    name: "Smoke Detector",
    description: "Determine how many smoke detectors your building needs.",
    fields: [
      { name: "bedrooms", label: "Number of Bedrooms", type: "number", min: 0, max: 30, defaultValue: 3 },
      { name: "floors", label: "Number of Floors", type: "number", min: 1, max: 10, defaultValue: 2 },
      { name: "commonRooms", label: "Common Rooms", type: "number", min: 0, max: 20, defaultValue: 3 },
      { name: "basement", label: "Has Basement (0=No, 1=Yes)", type: "number", min: 0, max: 1, defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const beds = inputs.bedrooms as number;
      const floors = inputs.floors as number;
      const common = inputs.commonRooms as number;
      const bsmt = inputs.basement as number;
      const bedroomDetectors = beds;
      const hallDetectors = floors;
      const commonDetectors = common;
      const basementDetector = bsmt > 0 ? 1 : 0;
      const total = bedroomDetectors + hallDetectors + commonDetectors + basementDetector;
      return {
        primary: { label: "Smoke Detectors Needed", value: formatNumber(total) },
        details: [
          { label: "Bedroom Detectors", value: formatNumber(bedroomDetectors) },
          { label: "Hallway/Floor Detectors", value: formatNumber(hallDetectors) },
          { label: "Common Room Detectors", value: formatNumber(commonDetectors) },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "Where should I install smoke detectors?", answer: "Install in each bedroom, outside sleeping areas, on every level, and in the basement." },
    { question: "How often should I replace smoke detectors?", answer: "Replace smoke detectors every 10 years and test them monthly." },
  ],
  formula: "Total = Bedrooms + Floors + Common Rooms + Basement",
};
