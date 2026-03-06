import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const centerPivotIrrigationCalculator: CalculatorDefinition = {
  slug: "center-pivot-irrigation-calculator",
  title: "Center Pivot Irrigation Calculator",
  description: "Calculate the coverage area, water application rate, and operating cost of a center pivot irrigation system.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["center pivot calculator","pivot irrigation","irrigation system sizing"],
  variants: [{
    id: "standard",
    name: "Center Pivot Irrigation",
    description: "Calculate the coverage area, water application rate, and operating cost of a center pivot irrigation system.",
    fields: [
      { name: "pivotLength", label: "Pivot Length (feet)", type: "number", min: 100, max: 3000, defaultValue: 1320 },
      { name: "flowRate", label: "Flow Rate (GPM)", type: "number", min: 100, max: 3000, defaultValue: 800 },
      { name: "hoursPerRev", label: "Hours Per Revolution", type: "number", min: 10, max: 200, defaultValue: 60 },
      { name: "energyCostPerHr", label: "Energy Cost ($/hour)", type: "number", min: 1, max: 100, defaultValue: 15 },
      { name: "seasonDays", label: "Irrigation Season (days)", type: "number", min: 30, max: 250, defaultValue: 120 },
    ],
    calculate: (inputs) => {
      const pl = inputs.pivotLength as number;
      const fr = inputs.flowRate as number;
      const hpr = inputs.hoursPerRev as number;
      const ec = inputs.energyCostPerHr as number;
      const sd = inputs.seasonDays as number;
      if (!pl || !fr || !hpr || !ec || !sd) return null;
      var areaSqFt = 3.14159 * pl * pl;
      var areaAcres = Math.round(areaSqFt / 43560 * 10) / 10;
      var gallonsPerRev = fr * hpr * 60;
      var inchesPerRev = Math.round(gallonsPerRev / (areaSqFt * 0.0623) * 100) / 100;
      var revsPerSeason = Math.round(sd * 24 / hpr * 10) / 10;
      var seasonGallons = Math.round(gallonsPerRev * revsPerSeason);
      var seasonCost = Math.round(sd * 24 * ec);
      return {
        primary: { label: "Coverage Area", value: formatNumber(areaAcres) + " acres" },
        details: [
          { label: "Inches Per Revolution", value: formatNumber(inchesPerRev) + " in" },
          { label: "Gallons Per Revolution", value: formatNumber(gallonsPerRev) },
          { label: "Revolutions Per Season", value: formatNumber(revsPerSeason) },
          { label: "Season Energy Cost", value: "$" + formatNumber(seasonCost) },
        ],
      };
  },
  }],
  relatedSlugs: ["irrigation-water-calculator","drip-irrigation-calculator"],
  faq: [
    { question: "How much area does a center pivot cover?", answer: "A standard quarter-mile (1,320 ft) center pivot covers about 132 acres in a circular pattern within a 160-acre quarter section. Corner systems can increase coverage to 148 to 152 acres." },
    { question: "How much water does a center pivot apply?", answer: "A typical center pivot applies 0.5 to 1.5 inches of water per revolution. Application depth depends on flow rate, speed, and system length. Most pivots complete one revolution in 12 to 96 hours." },
  ],
  formula: "Coverage = Pi x Pivot Length^2 / 43,560; Inches Per Rev = (GPM x Hours x 60) / (Area sq ft x 0.0623); Season Cost = Days x 24 x Energy Cost/Hr",
};
