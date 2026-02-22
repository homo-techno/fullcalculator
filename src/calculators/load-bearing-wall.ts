import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const loadBearingWallCalculator: CalculatorDefinition = {
  slug: "load-bearing-wall-calculator",
  title: "Load Bearing Wall Calculator",
  description: "Free load bearing wall calculator. Estimate the total load on a bearing wall including dead loads, live loads, and tributary area for residential construction.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["load bearing wall calculator", "wall load calculator", "structural wall calculator", "tributary area calculator", "bearing wall load"],
  variants: [
    {
      id: "single-story",
      name: "Single Story Bearing Wall",
      description: "Calculate the load on a bearing wall supporting one floor or roof",
      fields: [
        { name: "wallLength", label: "Wall Length (feet)", type: "number", placeholder: "e.g. 20" },
        { name: "tributaryWidth", label: "Tributary Width (feet)", type: "number", placeholder: "e.g. 8" },
        { name: "deadLoad", label: "Dead Load (psf)", type: "select", options: [
          { label: "Roof only (15 psf)", value: "15" },
          { label: "Floor with ceiling (20 psf)", value: "20" },
          { label: "Floor with tile/stone (25 psf)", value: "25" },
          { label: "Heavy construction (30 psf)", value: "30" },
        ], defaultValue: "20" },
        { name: "liveLoad", label: "Live Load (psf)", type: "select", options: [
          { label: "Roof - no snow (20 psf)", value: "20" },
          { label: "Residential floor (40 psf)", value: "40" },
          { label: "Office/commercial (50 psf)", value: "50" },
          { label: "Assembly area (100 psf)", value: "100" },
        ], defaultValue: "40" },
        { name: "wallHeight", label: "Wall Height (feet)", type: "number", placeholder: "e.g. 8", defaultValue: 8 },
      ],
      calculate: (inputs) => {
        const wallLength = inputs.wallLength as number;
        const tributaryWidth = inputs.tributaryWidth as number;
        const deadLoad = parseInt(inputs.deadLoad as string) || 20;
        const liveLoad = parseInt(inputs.liveLoad as string) || 40;
        const wallHeight = (inputs.wallHeight as number) || 8;
        if (!wallLength || !tributaryWidth) return null;

        const tributaryArea = wallLength * tributaryWidth;
        const totalPsf = deadLoad + liveLoad;
        const wallSelfWeight = 8 * wallHeight * wallLength;
        const totalLoad = totalPsf * tributaryArea + wallSelfWeight;
        const loadPerLinealFoot = totalLoad / wallLength;

        return {
          primary: { label: "Total Wall Load", value: `${formatNumber(totalLoad, 0)} lbs` },
          details: [
            { label: "Load per lineal foot", value: `${formatNumber(loadPerLinealFoot, 0)} lbs/ft` },
            { label: "Tributary area", value: `${formatNumber(tributaryArea)} sq ft` },
            { label: "Dead load contribution", value: `${formatNumber(deadLoad * tributaryArea, 0)} lbs` },
            { label: "Live load contribution", value: `${formatNumber(liveLoad * tributaryArea, 0)} lbs` },
            { label: "Wall self-weight", value: `${formatNumber(wallSelfWeight, 0)} lbs` },
            { label: "Combined design load", value: `${totalPsf} psf` },
          ],
          note: "Tributary width is typically half the joist span on each side of the wall. Wall self-weight estimated at ~8 lbs/sq ft for wood-framed walls. Always consult a structural engineer for critical applications.",
        };
      },
    },
    {
      id: "multi-story",
      name: "Multi-Story Bearing Wall",
      description: "Calculate cumulative load on a bearing wall supporting multiple stories",
      fields: [
        { name: "wallLength", label: "Wall Length (feet)", type: "number", placeholder: "e.g. 20" },
        { name: "tributaryWidth", label: "Tributary Width (feet)", type: "number", placeholder: "e.g. 8" },
        { name: "stories", label: "Number of Stories Supported", type: "select", options: [
          { label: "2 Stories", value: "2" },
          { label: "3 Stories", value: "3" },
          { label: "4 Stories", value: "4" },
        ], defaultValue: "2" },
        { name: "storyHeight", label: "Story Height (feet)", type: "number", placeholder: "e.g. 8", defaultValue: 8 },
        { name: "floorDeadLoad", label: "Floor Dead Load (psf)", type: "number", placeholder: "e.g. 20", defaultValue: 20 },
        { name: "floorLiveLoad", label: "Floor Live Load (psf)", type: "number", placeholder: "e.g. 40", defaultValue: 40 },
      ],
      calculate: (inputs) => {
        const wallLength = inputs.wallLength as number;
        const tributaryWidth = inputs.tributaryWidth as number;
        const stories = parseInt(inputs.stories as string) || 2;
        const storyHeight = (inputs.storyHeight as number) || 8;
        const floorDL = (inputs.floorDeadLoad as number) || 20;
        const floorLL = (inputs.floorLiveLoad as number) || 40;
        if (!wallLength || !tributaryWidth) return null;

        const tributaryArea = wallLength * tributaryWidth;
        const floorLoadPerStory = (floorDL + floorLL) * tributaryArea;
        const wallWeightPerStory = 8 * storyHeight * wallLength;
        const totalFloorLoad = floorLoadPerStory * stories;
        const totalWallWeight = wallWeightPerStory * stories;
        const totalLoad = totalFloorLoad + totalWallWeight;
        const loadPerLinealFoot = totalLoad / wallLength;

        return {
          primary: { label: "Total Cumulative Load", value: `${formatNumber(totalLoad, 0)} lbs` },
          details: [
            { label: "Load per lineal foot", value: `${formatNumber(loadPerLinealFoot, 0)} lbs/ft` },
            { label: "Floor load per story", value: `${formatNumber(floorLoadPerStory, 0)} lbs` },
            { label: "Wall weight per story", value: `${formatNumber(wallWeightPerStory, 0)} lbs` },
            { label: "Total floor loads", value: `${formatNumber(totalFloorLoad, 0)} lbs` },
            { label: "Total wall self-weight", value: `${formatNumber(totalWallWeight, 0)} lbs` },
            { label: "Stories supported", value: `${stories}` },
          ],
          note: "Cumulative loading assumes the same tributary width and load at each level. Lower-story walls and foundations must be designed for the full cumulative load. Consult a structural engineer.",
        };
      },
    },
  ],
  relatedSlugs: ["beam-deflection-calculator", "concrete-calculator", "square-footage-calculator"],
  faq: [
    { question: "How do I determine the tributary width?", answer: "Tributary width is typically half the joist span on each side of the bearing wall. For example, if joists span 16 feet from one wall to another, the tributary width for each wall is 8 feet. If the wall is in the center of the house with joists spanning to it from both sides, add half from each side." },
    { question: "What is the difference between dead load and live load?", answer: "Dead load is the permanent weight of the structure itself (framing, drywall, flooring, roofing). Live load is the weight of occupants, furniture, and other movable items. Residential floors typically use 40 psf live load per building code." },
  ],
  formula: "Total Load = (Dead Load + Live Load) \u00D7 Tributary Area + Wall Self-Weight",
};
