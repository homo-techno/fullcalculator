import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const roofSnowLoadCalculator: CalculatorDefinition = {
  slug: "roof-snow-load",
  title: "Roof Snow Load Stress Calculator",
  description:
    "Calculate roof snow load stress based on snow depth, density, and roof geometry. Helps determine if snow removal is needed to prevent structural damage.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "roof",
    "snow load",
    "stress",
    "structural",
    "winter",
    "weight",
    "psf",
    "safety",
    "building",
    "collapse",
  ],
  variants: [
    {
      slug: "basic-snow-load",
      title: "Basic Snow Load Calculator",
      fields: [
        {
          name: "depth",
          label: "Snow Depth (inches)",
          type: "number",
        },
        {
          name: "snowType",
          label: "Snow Type",
          type: "select",
          options: [
            { label: "Fresh/Fluffy Snow (3-5 lb/ft\u00B3)", value: "4" },
            { label: "Settled Snow (5-12 lb/ft\u00B3)", value: "8" },
            { label: "Packed/Wind-blown (12-18 lb/ft\u00B3)", value: "15" },
            { label: "Wet/Heavy Snow (18-25 lb/ft\u00B3)", value: "22" },
            { label: "Ice Layer (56 lb/ft\u00B3)", value: "56" },
          ],
        },
      ],
      calculate(inputs) {
        const depthInches = parseFloat(inputs.depth as string);
        const densityPcf = parseFloat(inputs.snowType as string);
        if (isNaN(depthInches) || isNaN(densityPcf))
          return { error: "Please enter valid snow depth and type." };

        const depthFt = depthInches / 12;
        const loadPsf = depthFt * densityPcf;
        const loadKpa = loadPsf * 0.04788;
        const loadKgm2 = loadPsf * 4.88243;

        const riskLevel =
          loadPsf < 20
            ? "Low - typical roof can handle this"
            : loadPsf < 40
            ? "Moderate - monitor closely"
            : loadPsf < 60
            ? "High - consider snow removal"
            : "Critical - remove snow immediately";

        return {
          results: [
            { label: "Snow Load (psf)", value: formatNumber(loadPsf) },
            { label: "Snow Load (kPa)", value: formatNumber(loadKpa) },
            { label: "Snow Load (kg/m\u00B2)", value: formatNumber(loadKgm2) },
            { label: "Snow Depth (ft)", value: formatNumber(depthFt) },
            { label: "Risk Level", value: riskLevel },
          ],
        };
      },
    },
    {
      slug: "roof-area-total",
      title: "Total Roof Load",
      fields: [
        {
          name: "depth",
          label: "Snow Depth (inches)",
          type: "number",
        },
        {
          name: "snowType",
          label: "Snow Type",
          type: "select",
          options: [
            { label: "Fresh/Fluffy Snow (4 lb/ft\u00B3)", value: "4" },
            { label: "Settled Snow (8 lb/ft\u00B3)", value: "8" },
            { label: "Packed Snow (15 lb/ft\u00B3)", value: "15" },
            { label: "Wet/Heavy Snow (22 lb/ft\u00B3)", value: "22" },
          ],
        },
        {
          name: "roofArea",
          label: "Roof Area (sq ft)",
          type: "number",
        },
        {
          name: "roofPitch",
          label: "Roof Pitch",
          type: "select",
          options: [
            { label: "Flat (0-1:12)", value: "1.0" },
            { label: "Low Slope (2-4:12)", value: "0.9" },
            { label: "Medium Slope (5-7:12)", value: "0.7" },
            { label: "Steep Slope (8-12:12)", value: "0.5" },
          ],
        },
      ],
      calculate(inputs) {
        const depthInches = parseFloat(inputs.depth as string);
        const densityPcf = parseFloat(inputs.snowType as string);
        const area = parseFloat(inputs.roofArea as string);
        const slopeFactor = parseFloat(inputs.roofPitch as string);
        if (isNaN(depthInches) || isNaN(densityPcf) || isNaN(area) || isNaN(slopeFactor))
          return { error: "Please enter all values." };

        const depthFt = depthInches / 12;
        const basePsf = depthFt * densityPcf;
        const adjustedPsf = basePsf * slopeFactor;
        const totalLbs = adjustedPsf * area;
        const totalTons = totalLbs / 2000;
        const totalKg = totalLbs * 0.453592;

        return {
          results: [
            { label: "Adjusted Load (psf)", value: formatNumber(adjustedPsf) },
            { label: "Total Weight (lbs)", value: formatNumber(totalLbs) },
            { label: "Total Weight (tons)", value: formatNumber(totalTons) },
            { label: "Total Weight (kg)", value: formatNumber(totalKg) },
            { label: "Slope Reduction Factor", value: formatNumber(slopeFactor) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["home-appraisal-value", "mold-remediation-cost", "radon-mitigation-cost"],
  faq: [
    {
      question: "How much weight can a typical roof support from snow?",
      answer:
        "Most residential roofs are designed to support 20-40 psf (pounds per square foot) of snow load, depending on local building codes and climate zone. Older or flat roofs may have lower capacities. Check local building codes for specific requirements.",
    },
    {
      question: "When should I remove snow from my roof?",
      answer:
        "Consider removal when snow load exceeds 20-25 psf, if you notice doors sticking, cracks in walls or ceilings, visible roof sagging, or when there are multiple layers of different snow densities. Wet, heavy snow and ice are more concerning than light, fluffy snow.",
    },
    {
      question: "How do I estimate snow density?",
      answer:
        "Fresh snow is about 3-5 lb/ft\u00B3, settled snow 5-12 lb/ft\u00B3, packed or wind-blown snow 12-18 lb/ft\u00B3, and wet heavy snow 18-25 lb/ft\u00B3. Ice weighs about 56 lb/ft\u00B3. Real-world snow often has multiple layers of different densities.",
    },
  ],
  formula:
    "Snow Load (psf) = Snow Depth (ft) x Snow Density (lb/ft\u00B3) | Adjusted Load = Base Load x Slope Factor | Total Weight = Adjusted Load x Roof Area",
};
