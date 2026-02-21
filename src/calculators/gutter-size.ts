import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gutterSizeCalculator: CalculatorDefinition = {
  slug: "gutter-size-calculator",
  title: "Gutter Size Calculator",
  description: "Free gutter size calculator. Determine the right gutter size and capacity based on roof area, pitch, and local rainfall intensity.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["gutter size calculator", "gutter capacity", "gutter drainage calculator", "rain gutter sizing", "gutter dimensions"],
  variants: [
    {
      id: "gutter-sizing",
      name: "Gutter Size Selection",
      description: "Calculate the right gutter size based on roof drainage area and rainfall",
      fields: [
        { name: "roofLength", label: "Roof Length Along Gutter (feet)", type: "number", placeholder: "e.g. 40" },
        { name: "roofWidth", label: "Roof Width (eave to ridge) (feet)", type: "number", placeholder: "e.g. 15" },
        { name: "roofPitch", label: "Roof Pitch", type: "select", options: [
          { label: "Flat to 3/12 (factor 1.0)", value: "1.0" },
          { label: "4/12 to 5/12 (factor 1.05)", value: "1.05" },
          { label: "6/12 to 8/12 (factor 1.1)", value: "1.1" },
          { label: "9/12 to 11/12 (factor 1.2)", value: "1.2" },
          { label: "12/12 and steeper (factor 1.3)", value: "1.3" },
        ], defaultValue: "1.05" },
        { name: "rainfall", label: "Max Rainfall Intensity (inches/hour)", type: "select", options: [
          { label: "Light (1-2 in/hr) - Northwest US", value: "2" },
          { label: "Moderate (3-4 in/hr) - Midwest, Northeast", value: "4" },
          { label: "Heavy (5-6 in/hr) - Southeast, Gulf Coast", value: "6" },
          { label: "Extreme (7-8 in/hr) - Florida, Tropics", value: "8" },
        ], defaultValue: "4" },
      ],
      calculate: (inputs) => {
        const roofLength = inputs.roofLength as number;
        const roofWidth = inputs.roofWidth as number;
        const pitchFactor = parseFloat(inputs.roofPitch as string) || 1.05;
        const rainfallIntensity = parseInt(inputs.rainfall as string) || 4;
        if (!roofLength || !roofWidth) return null;

        const drainageArea = roofLength * roofWidth * pitchFactor;
        const adjustedArea = drainageArea * (rainfallIntensity / 1);

        // Gutter capacity (sq ft of drainage area at 1 in/hr)
        // 5" K-style: handles ~5520 sq ft at 1 in/hr
        // 6" K-style: handles ~7960 sq ft at 1 in/hr
        // 5" half-round: handles ~2500 sq ft
        // 6" half-round: handles ~3840 sq ft

        let recommendedSize: string;
        let capacity: number;
        if (adjustedArea <= 2500) {
          recommendedSize = "5\" Half-Round or 5\" K-Style";
          capacity = 2500;
        } else if (adjustedArea <= 5520) {
          recommendedSize = "5\" K-Style";
          capacity = 5520;
        } else if (adjustedArea <= 7960) {
          recommendedSize = "6\" K-Style";
          capacity = 7960;
        } else {
          recommendedSize = "6\" K-Style (multiple downspouts needed)";
          capacity = 7960;
        }

        const downspoutCount = Math.ceil(adjustedArea / capacity);
        const gutterLengthFt = roofLength;
        const sectionsNeeded = Math.ceil(gutterLengthFt / 10); // 10-ft sections

        return {
          primary: { label: "Recommended Gutter Size", value: recommendedSize },
          details: [
            { label: "Roof drainage area", value: `${formatNumber(drainageArea, 0)} sq ft` },
            { label: "Adjusted area (rainfall factored)", value: `${formatNumber(adjustedArea, 0)} sq ft` },
            { label: "Gutter length needed", value: `${formatNumber(gutterLengthFt, 0)} linear ft` },
            { label: "10-ft sections needed", value: `${sectionsNeeded}` },
            { label: "Downspouts required", value: `${Math.max(downspoutCount, 1)}` },
            { label: "Rainfall intensity", value: `${rainfallIntensity} in/hr` },
          ],
          note: "K-style gutters handle more water than half-round. Install downspouts every 20-40 feet. Gutter slope should be 1/4\" per 10 feet toward downspouts.",
        };
      },
    },
    {
      id: "gutter-materials",
      name: "Gutter Materials & Cost",
      description: "Estimate gutter materials and installation cost",
      fields: [
        { name: "totalLength", label: "Total Gutter Length (feet)", type: "number", placeholder: "e.g. 120" },
        { name: "gutterMaterial", label: "Gutter Material", type: "select", options: [
          { label: "Aluminum (most common)", value: "aluminum" },
          { label: "Vinyl / PVC", value: "vinyl" },
          { label: "Steel", value: "steel" },
          { label: "Copper", value: "copper" },
          { label: "Zinc", value: "zinc" },
        ], defaultValue: "aluminum" },
        { name: "gutterSize", label: "Gutter Size", type: "select", options: [
          { label: "5\" K-Style", value: "5k" },
          { label: "6\" K-Style", value: "6k" },
          { label: "5\" Half-Round", value: "5hr" },
          { label: "6\" Half-Round", value: "6hr" },
        ], defaultValue: "5k" },
        { name: "stories", label: "Building Height", type: "select", options: [
          { label: "1 Story", value: "1" },
          { label: "2 Stories", value: "2" },
          { label: "3 Stories", value: "3" },
        ], defaultValue: "1" },
      ],
      calculate: (inputs) => {
        const totalLength = inputs.totalLength as number;
        const gutterMaterial = inputs.gutterMaterial as string;
        const stories = parseInt(inputs.stories as string) || 1;
        if (!totalLength) return null;

        let costPerFt: number;
        switch (gutterMaterial) {
          case "vinyl": costPerFt = 4; break;
          case "aluminum": costPerFt = 7; break;
          case "steel": costPerFt = 9; break;
          case "copper": costPerFt = 25; break;
          case "zinc": costPerFt = 18; break;
          default: costPerFt = 7;
        }

        const heightMultiplier = 1 + (stories - 1) * 0.25;
        const downspouts = Math.ceil(totalLength / 30);
        const downspoutLength = stories * 10;
        const corners = 4; // typical
        const endCaps = downspouts * 2;

        const materialCost = totalLength * costPerFt;
        const downspoutCost = downspouts * downspoutLength * (costPerFt * 0.8);
        const installCost = totalLength * 4 * heightMultiplier;
        const totalCost = materialCost + downspoutCost + installCost;

        return {
          primary: { label: "Estimated Total Cost", value: `$${formatNumber(totalCost, 0)}` },
          details: [
            { label: "Gutter material cost", value: `$${formatNumber(materialCost, 0)}` },
            { label: "Downspout material cost", value: `$${formatNumber(downspoutCost, 0)}` },
            { label: "Installation cost", value: `$${formatNumber(installCost, 0)}` },
            { label: "Downspouts needed", value: `${downspouts}` },
            { label: "Corners (estimated)", value: `${corners}` },
            { label: "End caps", value: `${endCaps}` },
          ],
          note: "Seamless gutters (formed on-site) are recommended over sectional for reduced leaks. Copper and zinc develop a natural patina over time.",
        };
      },
    },
  ],
  relatedSlugs: ["gutter-calculator", "downspout-calculator", "roofing-calculator"],
  faq: [
    { question: "What size gutters do I need?", answer: "Most homes use 5\" K-style gutters. Upgrade to 6\" K-style if your roof area exceeds 5,500 sq ft per gutter run, you live in a heavy rainfall area (5+ in/hr), or your roof has a steep pitch (8/12 or steeper)." },
    { question: "How often should gutters be cleaned?", answer: "Clean gutters at least twice a year - in late fall (after leaves drop) and late spring. Homes near pine trees or with heavy tree coverage may need quarterly cleaning. Gutter guards can reduce cleaning frequency." },
  ],
  formula: "Drainage Area = Roof Length × Width × Pitch Factor | Adjusted Area = Drainage Area × Rainfall Intensity | Downspouts = Adjusted Area / Gutter Capacity",
};
