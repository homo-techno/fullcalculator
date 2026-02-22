import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const crownMoldingAngleCalculator: CalculatorDefinition = {
  slug: "crown-molding-angle-calculator",
  title: "Crown Molding Angle Calculator",
  description: "Free crown molding angle calculator. Calculate miter and bevel angles for inside and outside corners, including non-90-degree walls.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["crown molding angle calculator", "miter angle calculator", "bevel angle calculator", "crown molding corner", "crown molding cut angles"],
  variants: [
    {
      id: "standard-corner",
      name: "Standard Corner (90\u00B0 Wall)",
      description: "Calculate miter and bevel angles for standard 90-degree wall corners",
      fields: [
        { name: "springAngle", label: "Crown Spring Angle", type: "select", options: [
          { label: "38\u00B0 (most common)", value: "38" },
          { label: "45\u00B0 (larger profiles)", value: "45" },
          { label: "52\u00B0 (small profiles)", value: "52" },
        ], defaultValue: "38" },
        { name: "cornerType", label: "Corner Type", type: "select", options: [
          { label: "Inside Corner", value: "inside" },
          { label: "Outside Corner", value: "outside" },
        ], defaultValue: "inside" },
      ],
      calculate: (inputs) => {
        const springAngle = parseInt(inputs.springAngle as string) || 38;
        const cornerType = inputs.cornerType as string;
        const wallAngle = 90;

        const springRad = (springAngle * Math.PI) / 180;
        const halfWall = (wallAngle / 2) * (Math.PI / 180);

        const miterAngle = Math.atan(Math.sin(springRad) / Math.tan(halfWall)) * (180 / Math.PI);
        const bevelAngle = Math.asin(Math.cos(springRad) * Math.cos(halfWall)) * (180 / Math.PI);

        return {
          primary: { label: "Miter Saw Settings", value: `Miter: ${formatNumber(miterAngle, 1)}\u00B0 | Bevel: ${formatNumber(bevelAngle, 1)}\u00B0` },
          details: [
            { label: "Miter angle", value: `${formatNumber(miterAngle, 2)}\u00B0` },
            { label: "Bevel angle", value: `${formatNumber(bevelAngle, 2)}\u00B0` },
            { label: "Spring angle", value: `${springAngle}\u00B0` },
            { label: "Wall corner angle", value: `${wallAngle}\u00B0` },
            { label: "Corner type", value: cornerType === "inside" ? "Inside Corner" : "Outside Corner" },
            { label: "Saw position", value: cornerType === "inside" ? "Crown upside down, flat on saw" : "Crown upside down, flat on saw" },
          ],
          note: cornerType === "inside"
            ? "For inside corners: Set miter to the left for the right piece, miter to the right for the left piece. Crown sits upside down and flat on the miter saw fence."
            : "For outside corners: Set miter to the right for the right piece, miter to the left for the left piece. Crown sits upside down and flat on the miter saw fence.",
        };
      },
    },
    {
      id: "custom-corner",
      name: "Custom Wall Angle",
      description: "Calculate angles for non-90-degree wall corners (cathedral ceilings, angled walls)",
      fields: [
        { name: "wallAngle", label: "Wall Corner Angle (degrees)", type: "number", placeholder: "e.g. 135" },
        { name: "springAngle", label: "Crown Spring Angle", type: "select", options: [
          { label: "38\u00B0 (most common)", value: "38" },
          { label: "45\u00B0 (larger profiles)", value: "45" },
          { label: "52\u00B0 (small profiles)", value: "52" },
        ], defaultValue: "38" },
        { name: "cornerType", label: "Corner Type", type: "select", options: [
          { label: "Inside Corner", value: "inside" },
          { label: "Outside Corner", value: "outside" },
        ], defaultValue: "inside" },
      ],
      calculate: (inputs) => {
        const wallAngle = inputs.wallAngle as number;
        const springAngle = parseInt(inputs.springAngle as string) || 38;
        const cornerType = inputs.cornerType as string;
        if (!wallAngle) return null;

        const springRad = (springAngle * Math.PI) / 180;
        const halfWall = (wallAngle / 2) * (Math.PI / 180);

        const miterAngle = Math.atan(Math.sin(springRad) / Math.tan(halfWall)) * (180 / Math.PI);
        const bevelAngle = Math.asin(Math.cos(springRad) * Math.cos(halfWall)) * (180 / Math.PI);

        return {
          primary: { label: "Miter Saw Settings", value: `Miter: ${formatNumber(miterAngle, 1)}\u00B0 | Bevel: ${formatNumber(bevelAngle, 1)}\u00B0` },
          details: [
            { label: "Miter angle", value: `${formatNumber(miterAngle, 2)}\u00B0` },
            { label: "Bevel angle", value: `${formatNumber(bevelAngle, 2)}\u00B0` },
            { label: "Wall angle", value: `${wallAngle}\u00B0` },
            { label: "Spring angle", value: `${springAngle}\u00B0` },
            { label: "Corner type", value: cornerType === "inside" ? "Inside Corner" : "Outside Corner" },
            { label: "Half wall angle", value: `${formatNumber(wallAngle / 2, 1)}\u00B0` },
          ],
          note: "Measure the actual wall angle with a digital angle finder for best results. Odd-angle walls are common in older homes and bay windows. Always cut test pieces from scrap material first.",
        };
      },
    },
  ],
  relatedSlugs: ["stair-stringer-calculator", "slope-grade-calculator", "board-foot-calculator"],
  faq: [
    { question: "What is the spring angle of crown molding?", answer: "The spring angle is the angle between the back of the crown molding and the wall. The most common spring angle is 38\u00B0 (also called 38/52 crown). Larger profiles often have a 45\u00B0 spring angle. Check the molding packaging or hold a piece against the wall and measure." },
    { question: "How do I cut crown molding on a miter saw?", answer: "The easiest method is to place the crown upside down and flat on the miter saw table (the ceiling edge against the fence, the wall edge on the table). For a compound miter saw, you can lay the crown flat and set both the miter and bevel angles as calculated." },
  ],
  formula: "Miter = arctan(sin(spring) / tan(wall/2)) | Bevel = arcsin(cos(spring) \u00D7 cos(wall/2))",
};
