import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const treeHeightCalculator: CalculatorDefinition = {
  slug: "tree-height-calculator",
  title: "Tree Height Calculator",
  description: "Free tree height calculator. Estimate the height of a tree using shadow length, angle measurement, or stick methods without climbing.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["tree height calculator", "how tall is my tree", "tree height estimator", "measure tree height", "tree height from shadow"],
  variants: [
    {
      id: "shadow",
      name: "Shadow Method",
      description: "Use your shadow and the tree's shadow to calculate height",
      fields: [
        { name: "yourHeight", label: "Your Height (feet)", type: "number", placeholder: "e.g. 5.75", step: 0.25 },
        { name: "yourShadow", label: "Your Shadow Length (feet)", type: "number", placeholder: "e.g. 8" },
        { name: "treeShadow", label: "Tree Shadow Length (feet)", type: "number", placeholder: "e.g. 60" },
      ],
      calculate: (inputs) => {
        const h = inputs.yourHeight as number;
        const ys = inputs.yourShadow as number;
        const ts = inputs.treeShadow as number;
        if (!h || !ys || !ts) return null;
        const treeHeight = (h / ys) * ts;
        const treeHeightM = treeHeight * 0.3048;
        const sunAngle = Math.atan(h / ys) * (180 / Math.PI);
        return {
          primary: { label: "Tree Height", value: `${formatNumber(treeHeight, 1)} feet` },
          details: [
            { label: "Tree height (meters)", value: formatNumber(treeHeightM, 1) },
            { label: "Sun angle", value: `${formatNumber(sunAngle, 1)}°` },
            { label: "Shadow ratio", value: `${formatNumber(ts / ys, 1)}:1` },
          ],
          note: "Measure shadows at the same time on level ground. Best accuracy occurs when the sun is between 30-60 degrees above the horizon.",
        };
      },
    },
    {
      id: "angle",
      name: "Angle Method (Clinometer)",
      description: "Use distance and angle to calculate height",
      fields: [
        { name: "distance", label: "Distance from Tree Base (feet)", type: "number", placeholder: "e.g. 100" },
        { name: "angle", label: "Angle to Tree Top (degrees)", type: "number", placeholder: "e.g. 45" },
        { name: "eyeHeight", label: "Your Eye Height (feet)", type: "number", placeholder: "e.g. 5.5", defaultValue: 5.5 },
      ],
      calculate: (inputs) => {
        const dist = inputs.distance as number;
        const angle = inputs.angle as number;
        const eyeH = (inputs.eyeHeight as number) || 5.5;
        if (!dist || !angle) return null;
        const angleRad = angle * (Math.PI / 180);
        const heightAboveEye = dist * Math.tan(angleRad);
        const totalHeight = heightAboveEye + eyeH;
        const totalHeightM = totalHeight * 0.3048;
        return {
          primary: { label: "Tree Height", value: `${formatNumber(totalHeight, 1)} feet` },
          details: [
            { label: "Height above eye level", value: `${formatNumber(heightAboveEye, 1)} ft` },
            { label: "Your eye height added", value: `${formatNumber(eyeH, 1)} ft` },
            { label: "Tree height (meters)", value: formatNumber(totalHeightM, 1) },
            { label: "Distance from tree", value: `${formatNumber(dist, 0)} ft` },
          ],
          note: "Stand on level ground with the tree. Use a clinometer app on your phone to measure the angle to the treetop.",
        };
      },
    },
    {
      id: "stick",
      name: "Stick Method",
      description: "Use a stick at arm's length to estimate height",
      fields: [
        { name: "stickLength", label: "Stick Length (inches)", type: "number", placeholder: "e.g. 12" },
        { name: "armLength", label: "Arm Length / Distance to Stick (inches)", type: "number", placeholder: "e.g. 24" },
        { name: "distToTree", label: "Distance from Tree (feet)", type: "number", placeholder: "e.g. 80" },
      ],
      calculate: (inputs) => {
        const stick = inputs.stickLength as number;
        const arm = inputs.armLength as number;
        const dist = inputs.distToTree as number;
        if (!stick || !arm || !dist) return null;
        const treeHeight = (stick / arm) * dist;
        return {
          primary: { label: "Tree Height", value: `${formatNumber(treeHeight, 1)} feet` },
          details: [
            { label: "Stick/arm ratio", value: formatNumber(stick / arm, 3) },
            { label: "Distance to tree", value: `${dist} ft` },
            { label: "Tree height (meters)", value: formatNumber(treeHeight * 0.3048, 1) },
          ],
          note: "Hold a stick vertically at arm's length. Line up the bottom of the stick with the tree base and note where the treetop aligns on the stick.",
        };
      },
    },
  ],
  relatedSlugs: ["firewood-calculator", "elevation-gain-calculator", "pythagorean-calculator"],
  faq: [
    { question: "How can I measure tree height without climbing?", answer: "Three common methods: (1) Shadow method - compare your shadow to the tree's shadow, (2) Angle method - measure the angle to the treetop from a known distance using a clinometer, (3) Stick method - use similar triangles with a stick at arm's length. The angle method with a phone clinometer app is the most accurate." },
    { question: "How tall do common trees get?", answer: "Average mature heights: Dogwood 15-30 ft, Maple 40-80 ft, Oak 50-80 ft, Pine 50-100 ft, Douglas Fir 100-250 ft, Redwood 200-350+ ft. Heights vary by species, climate, and growing conditions." },
    { question: "Why would I need to know tree height?", answer: "Tree height is important for: assessing fall zone for removal, determining if a tree threatens structures or power lines, estimating timber/firewood volume, landscaping planning, and arborist assessments." },
  ],
  formula: "Shadow: TreeHeight = (YourHeight / YourShadow) × TreeShadow | Angle: TreeHeight = Distance × tan(Angle) + EyeHeight",
};
