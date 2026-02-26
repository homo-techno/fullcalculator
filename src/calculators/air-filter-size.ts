import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const airFilterSizeCalculator: CalculatorDefinition = {
  slug: "air-filter-size-calculator",
  title: "HVAC Air Filter Size Guide Calculator",
  description:
    "Determine the correct HVAC air filter size, MERV rating, and replacement schedule. Calculate filter area and airflow capacity for your system.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "air filter size",
    "HVAC filter calculator",
    "furnace filter size",
    "MERV rating",
    "air filter replacement",
  ],
  variants: [
    {
      id: "filter-sizing",
      name: "Filter Size & Airflow",
      description: "Verify your filter size handles your system airflow",
      fields: [
        {
          name: "filterWidth",
          label: "Filter Width (inches)",
          type: "select",
          options: [
            { label: '14"', value: "14" },
            { label: '16"', value: "16" },
            { label: '20"', value: "20" },
            { label: '24"', value: "24" },
            { label: '25"', value: "25" },
          ],
          defaultValue: "20",
        },
        {
          name: "filterHeight",
          label: "Filter Height (inches)",
          type: "select",
          options: [
            { label: '14"', value: "14" },
            { label: '16"', value: "16" },
            { label: '20"', value: "20" },
            { label: '24"', value: "24" },
            { label: '25"', value: "25" },
            { label: '30"', value: "30" },
          ],
          defaultValue: "25",
        },
        {
          name: "filterDepth",
          label: "Filter Depth (inches)",
          type: "select",
          options: [
            { label: '1" (standard)', value: "1" },
            { label: '2"', value: "2" },
            { label: '4" (deep pleat)', value: "4" },
            { label: '5" (media cabinet)', value: "5" },
          ],
          defaultValue: "1",
        },
        {
          name: "systemTons",
          label: "AC/Furnace Size (tons)",
          type: "select",
          options: [
            { label: "1.5 ton", value: "1.5" },
            { label: "2 ton", value: "2" },
            { label: "2.5 ton", value: "2.5" },
            { label: "3 ton", value: "3" },
            { label: "3.5 ton", value: "3.5" },
            { label: "4 ton", value: "4" },
            { label: "5 ton", value: "5" },
          ],
          defaultValue: "3",
        },
      ],
      calculate: (inputs) => {
        const filterWidth = parseFloat(inputs.filterWidth as string);
        const filterHeight = parseFloat(inputs.filterHeight as string);
        const filterDepth = parseFloat(inputs.filterDepth as string);
        const systemTons = parseFloat(inputs.systemTons as string);
        if (!filterWidth || !filterHeight || !filterDepth || !systemTons) return null;

        const filterAreaSqIn = filterWidth * filterHeight;
        const filterAreaSqFt = filterAreaSqIn / 144;
        const systemCFM = systemTons * 400;

        // Face velocity = CFM / filter area (sq ft)
        const faceVelocity = systemCFM / filterAreaSqFt;

        // Recommended: under 300 FPM for 1" filters, under 500 FPM for deeper
        const maxVelocity = filterDepth >= 4 ? 500 : 300;
        const passesAirflow = faceVelocity <= maxVelocity;

        // Replacement schedule based on depth
        const replacementMonths: Record<number, number> = {
          1: 1,
          2: 3,
          4: 6,
          5: 12,
        };
        const replaceEvery = replacementMonths[filterDepth] || 3;
        const filtersPerYear = Math.ceil(12 / replaceEvery);

        return {
          primary: {
            label: "Filter Size",
            value: `${formatNumber(filterWidth)}x${formatNumber(filterHeight)}x${formatNumber(filterDepth)}`,
          },
          details: [
            { label: "Filter face area", value: `${formatNumber(filterAreaSqFt, 2)} sq ft` },
            { label: "System airflow", value: `${formatNumber(systemCFM)} CFM` },
            { label: "Face velocity", value: `${formatNumber(faceVelocity, 0)} FPM` },
            { label: "Max recommended velocity", value: `${formatNumber(maxVelocity)} FPM` },
            { label: "Airflow check", value: passesAirflow ? "ADEQUATE" : "TOO SMALL - upgrade filter size" },
            { label: "Replace every", value: `${formatNumber(replaceEvery)} month(s)` },
            { label: "Filters per year", value: formatNumber(filtersPerYear) },
          ],
          note: passesAirflow
            ? "Filter size is adequate for your system. Use MERV 8-11 for a good balance of filtration and airflow."
            : "WARNING: Filter face velocity is too high. This restricts airflow and reduces system efficiency. Consider a larger filter or deeper pleated filter.",
        };
      },
    },
    {
      id: "merv-guide",
      name: "MERV Rating Guide",
      description: "Understand MERV ratings and choose the right filter",
      fields: [
        {
          name: "concern",
          label: "Primary Concern",
          type: "select",
          options: [
            { label: "Basic dust protection", value: "basic" },
            { label: "Allergies (pollen, pet dander)", value: "allergy" },
            { label: "Asthma / respiratory", value: "asthma" },
            { label: "Smoke / fine particles", value: "smoke" },
            { label: "Maximum filtration", value: "max" },
          ],
          defaultValue: "allergy",
        },
        {
          name: "systemAge",
          label: "HVAC System Age",
          type: "select",
          options: [
            { label: "New (< 5 years)", value: "new" },
            { label: "Mid-age (5-15 years)", value: "mid" },
            { label: "Older (> 15 years)", value: "old" },
          ],
          defaultValue: "mid",
        },
      ],
      calculate: (inputs) => {
        const concern = inputs.concern as string;
        const systemAge = inputs.systemAge as string;
        if (!concern || !systemAge) return null;

        const mervRanges: Record<string, { min: number; max: number; captures: string }> = {
          basic: { min: 4, max: 8, captures: "Large dust, lint, pollen" },
          allergy: { min: 8, max: 11, captures: "Dust mites, mold, pet dander, fine dust" },
          asthma: { min: 11, max: 13, captures: "Bacteria, smoke particles, fine allergens" },
          smoke: { min: 13, max: 14, captures: "Tobacco smoke, all bacteria, fine particles" },
          max: { min: 14, max: 16, captures: "Virus carriers, carbon dust, all smoke" },
        };

        const range = mervRanges[concern];
        // Older systems can't handle high MERV without airflow issues
        let recommended = range.max;
        if (systemAge === "old" && recommended > 11) recommended = 11;
        if (systemAge === "mid" && recommended > 13) recommended = 13;

        return {
          primary: {
            label: "Recommended MERV",
            value: `MERV ${formatNumber(recommended)}`,
          },
          details: [
            { label: "MERV range for concern", value: `MERV ${formatNumber(range.min)}-${formatNumber(range.max)}` },
            { label: "Recommended for your system", value: `MERV ${formatNumber(recommended)}` },
            { label: "Particles captured", value: range.captures },
            { label: "System compatibility", value: systemAge === "old" ? "Limited - stay under MERV 11" : "Good" },
          ],
          note: "Higher MERV filters restrict more airflow. Older systems may not have enough blower capacity for MERV 13+. Using too high a MERV can damage your system. Consult your HVAC tech.",
        };
      },
    },
  ],
  relatedSlugs: ["cfm-calculator", "ac-tonnage-calculator", "furnace-size-calculator"],
  faq: [
    {
      question: "How do I find my air filter size?",
      answer:
        "Check the existing filter for printed dimensions (e.g., 20x25x1). If no filter is installed, measure the width, height, and depth of the filter slot in your furnace or air handler. Round to the nearest standard size. Common residential sizes are 16x25x1, 20x25x1, and 20x20x1.",
    },
    {
      question: "What MERV rating should I use?",
      answer:
        "MERV 8-11 provides the best balance of filtration and airflow for most homes. MERV 8 catches large particles and is fine for most people. MERV 11 adds protection against allergens. MERV 13+ is for those with respiratory conditions, but verify your system can handle it.",
    },
    {
      question: "How often should I change my air filter?",
      answer:
        "1-inch filters: every 1-3 months. 2-inch filters: every 3-4 months. 4-inch filters: every 6-9 months. 5-inch media filters: every 9-12 months. Check monthly and replace when visibly dirty. Homes with pets or allergies should change more frequently.",
    },
  ],
  formula:
    "Face Velocity = CFM / Filter Area (sq ft) | System CFM = Tons x 400 | Max velocity: 300 FPM (1\"), 500 FPM (4\")",
};
