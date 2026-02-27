import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const septicPercTestCalculator: CalculatorDefinition = {
  slug: "septic-perc-test",
  title: "Septic Percolation Test Interpreter",
  description:
    "Interpret septic percolation (perc) test results to determine soil suitability for a septic drain field. Calculate required drain field size based on daily wastewater flow.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "septic",
    "percolation",
    "perc test",
    "drain field",
    "soil",
    "wastewater",
    "leach field",
    "absorption",
    "well",
    "rural",
  ],
  variants: [
    {
      slug: "interpret-perc",
      title: "Interpret Perc Test Results",
      fields: [
        {
          name: "percRate",
          label: "Percolation Rate (minutes per inch)",
          type: "number",
        },
        {
          name: "bedrooms",
          label: "Number of Bedrooms",
          type: "number",
        },
      ],
      calculate(inputs) {
        const percRate = parseFloat(inputs.percRate as string);
        const bedrooms = parseFloat(inputs.bedrooms as string);
        if (isNaN(percRate) || isNaN(bedrooms))
          return { error: "Please enter valid perc rate and bedroom count." };

        const dailyFlow = bedrooms * 150;

        let suitability: string;
        let soilType: string;
        let applicationRate: number;

        if (percRate < 1) {
          suitability = "Too Fast - soil too sandy/gravelly, may not filter properly";
          soilType = "Coarse gravel/sand";
          applicationRate = 1.2;
        } else if (percRate <= 5) {
          suitability = "Excellent - rapid drainage, ideal for septic";
          soilType = "Sandy loam";
          applicationRate = 1.0;
        } else if (percRate <= 15) {
          suitability = "Good - suitable for conventional septic system";
          soilType = "Loam/silt loam";
          applicationRate = 0.8;
        } else if (percRate <= 30) {
          suitability = "Acceptable - may need larger drain field";
          soilType = "Clay loam";
          applicationRate = 0.6;
        } else if (percRate <= 60) {
          suitability = "Marginal - may require engineered system";
          soilType = "Silty clay";
          applicationRate = 0.4;
        } else {
          suitability = "Unsuitable - soil drains too slowly for conventional septic";
          soilType = "Heavy clay";
          applicationRate = 0;
        }

        const drainFieldSqFt = applicationRate > 0 ? dailyFlow / applicationRate : 0;

        return {
          results: [
            { label: "Soil Suitability", value: suitability },
            { label: "Likely Soil Type", value: soilType },
            { label: "Estimated Daily Flow (gallons)", value: formatNumber(dailyFlow) },
            { label: "Application Rate (gpd/sqft)", value: formatNumber(applicationRate) },
            { label: "Min. Drain Field Size (sq ft)", value: formatNumber(drainFieldSqFt) },
          ],
        };
      },
    },
    {
      slug: "drain-field-size",
      title: "Drain Field Size Calculator",
      fields: [
        {
          name: "dailyFlow",
          label: "Daily Wastewater Flow (gallons)",
          type: "number",
        },
        {
          name: "soilType",
          label: "Soil Percolation Category",
          type: "select",
          options: [
            { label: "Fast (1-5 min/in) - 1.0 gpd/sqft", value: "1.0" },
            { label: "Medium (5-15 min/in) - 0.8 gpd/sqft", value: "0.8" },
            { label: "Slow (15-30 min/in) - 0.6 gpd/sqft", value: "0.6" },
            { label: "Very Slow (30-60 min/in) - 0.4 gpd/sqft", value: "0.4" },
          ],
        },
      ],
      calculate(inputs) {
        const dailyFlow = parseFloat(inputs.dailyFlow as string);
        const appRate = parseFloat(inputs.soilType as string);
        if (isNaN(dailyFlow) || isNaN(appRate))
          return { error: "Please enter valid inputs." };

        const drainFieldSqFt = dailyFlow / appRate;
        const drainFieldM2 = drainFieldSqFt * 0.0929;
        const trenchLength3ft = drainFieldSqFt / 3;
        const trenchLength2ft = drainFieldSqFt / 2;

        return {
          results: [
            { label: "Min. Drain Field (sq ft)", value: formatNumber(drainFieldSqFt) },
            { label: "Min. Drain Field (m\u00B2)", value: formatNumber(drainFieldM2) },
            { label: "Trench Length at 3ft wide (ft)", value: formatNumber(trenchLength3ft) },
            { label: "Trench Length at 2ft wide (ft)", value: formatNumber(trenchLength2ft) },
            { label: "Daily Flow (gpd)", value: formatNumber(dailyFlow) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["well-water-test", "roof-snow-load", "home-appraisal-value"],
  faq: [
    {
      question: "What is a percolation (perc) test?",
      answer:
        "A perc test measures how quickly water drains through soil. A hole is dug, filled with water, and the time for the water level to drop one inch is measured. Results are expressed in minutes per inch (MPI). Most jurisdictions require a perc test before approving a septic system installation.",
    },
    {
      question: "What perc rate is acceptable for a septic system?",
      answer:
        "Generally, percolation rates between 1 and 60 minutes per inch are acceptable, though ideal rates are 5-30 MPI. Rates below 1 MPI indicate soil that drains too fast (poor filtration), and rates above 60 MPI indicate soil that drains too slowly for a conventional system.",
    },
  ],
  formula:
    "Drain Field Size (sqft) = Daily Flow (gpd) / Application Rate (gpd/sqft) | Daily Flow = Bedrooms x 150 gpd | Application rate varies by soil perc rate",
};
