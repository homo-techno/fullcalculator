import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const doorSizeCalculator: CalculatorDefinition = {
  slug: "door-size-calculator",
  title: "Door Size Calculator",
  description: "Free door size calculator. Calculate interior and exterior door dimensions, rough opening sizes, and door frame requirements.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["door size calculator", "door dimensions", "rough opening calculator", "door frame size", "door replacement size"],
  variants: [
    {
      id: "rough-opening",
      name: "Door Rough Opening",
      description: "Calculate the rough opening needed for a door",
      fields: [
        { name: "doorWidth", label: "Door Width (inches)", type: "number", placeholder: "e.g. 36" },
        { name: "doorHeight", label: "Door Height (inches)", type: "number", placeholder: "e.g. 80" },
        { name: "doorType", label: "Door Type", type: "select", options: [
          { label: "Interior Hinged", value: "interior" },
          { label: "Exterior Hinged", value: "exterior" },
          { label: "Pocket Door", value: "pocket" },
          { label: "Sliding / Barn Door", value: "sliding" },
          { label: "French Door (pair)", value: "french" },
          { label: "Bifold Door", value: "bifold" },
        ], defaultValue: "interior" },
      ],
      calculate: (inputs) => {
        const doorWidth = inputs.doorWidth as number;
        const doorHeight = inputs.doorHeight as number;
        const doorType = inputs.doorType as string;
        if (!doorWidth || !doorHeight) return null;

        let roughWidth: number;
        let roughHeight: number;
        let notes: string;

        switch (doorType) {
          case "interior":
            roughWidth = doorWidth + 2;
            roughHeight = doorHeight + 2.5;
            notes = "Interior doors need 2\" extra width (1\" each side for jambs) and 2.5\" extra height (for jamb head and floor clearance).";
            break;
          case "exterior":
            roughWidth = doorWidth + 2.5;
            roughHeight = doorHeight + 2.5;
            notes = "Exterior doors need 2.5\" extra width for weatherstripping and shimming space. Include threshold height.";
            break;
          case "pocket":
            roughWidth = doorWidth * 2 + 1;
            roughHeight = doorHeight + 2.5;
            notes = "Pocket doors need double the door width plus 1\" for the pocket frame. Wall must be free of wiring and plumbing.";
            break;
          case "sliding":
            roughWidth = doorWidth * 2 + 4;
            roughHeight = doorHeight + 4;
            notes = "Barn/sliding doors need clearance for the track hardware. Door should be 2-4\" wider and taller than the opening for full coverage.";
            break;
          case "french":
            roughWidth = doorWidth * 2 + 2;
            roughHeight = doorHeight + 2.5;
            notes = "French door rough opening is double the door width plus 2\" for jambs. Both doors are the specified width.";
            break;
          case "bifold":
            roughWidth = doorWidth + 1;
            roughHeight = doorHeight + 2;
            notes = "Bifold doors need minimal extra width. Track mounts inside the rough opening. Common widths: 24\", 30\", 36\" (closets).";
            break;
          default:
            roughWidth = doorWidth + 2;
            roughHeight = doorHeight + 2.5;
            notes = "";
        }

        const doorArea = (doorWidth * doorHeight) / 144;

        return {
          primary: { label: "Rough Opening", value: `${formatNumber(roughWidth, 1)}" × ${formatNumber(roughHeight, 1)}"` },
          details: [
            { label: "Door size", value: `${formatNumber(doorWidth, 0)}" × ${formatNumber(doorHeight, 0)}"` },
            { label: "Rough opening width", value: `${formatNumber(roughWidth, 1)} inches` },
            { label: "Rough opening height", value: `${formatNumber(roughHeight, 1)} inches` },
            { label: "Door area", value: `${formatNumber(doorArea, 2)} sq ft` },
            { label: "Door type", value: doorType },
          ],
          note: notes,
        };
      },
    },
    {
      id: "door-swing",
      name: "Door Swing Clearance",
      description: "Calculate the floor clearance area needed for a swinging door",
      fields: [
        { name: "doorWidth", label: "Door Width (inches)", type: "number", placeholder: "e.g. 36" },
        { name: "swingAngle", label: "Swing Angle", type: "select", options: [
          { label: "90° (Standard)", value: "90" },
          { label: "120° (Wide)", value: "120" },
          { label: "180° (Full)", value: "180" },
        ], defaultValue: "90" },
        { name: "hingeSide", label: "Hinge Side", type: "select", options: [
          { label: "Left Hinge", value: "left" },
          { label: "Right Hinge", value: "right" },
        ], defaultValue: "left" },
      ],
      calculate: (inputs) => {
        const doorWidth = inputs.doorWidth as number;
        const swingAngle = parseInt(inputs.swingAngle as string) || 90;
        if (!doorWidth) return null;

        const radiusFt = doorWidth / 12;
        const swingRad = (swingAngle * Math.PI) / 180;
        const arcArea = 0.5 * radiusFt * radiusFt * swingRad;
        const clearanceDepth = radiusFt * Math.sin(Math.min(swingRad, Math.PI / 2));
        const clearanceWidth = radiusFt * (1 - Math.cos(Math.min(swingRad, Math.PI / 2)));

        return {
          primary: { label: "Swing Clearance Area", value: `${formatNumber(arcArea, 2)} sq ft` },
          details: [
            { label: "Door width", value: `${formatNumber(doorWidth, 0)} inches (${formatNumber(radiusFt, 2)} ft)` },
            { label: "Swing angle", value: `${swingAngle}°` },
            { label: "Clearance depth from wall", value: `${formatNumber(clearanceDepth * 12, 1)} inches` },
            { label: "Clearance width from jamb", value: `${formatNumber(clearanceWidth * 12, 1)} inches` },
            { label: "Floor area swept", value: `${formatNumber(arcArea, 2)} sq ft` },
          ],
          note: "Ensure no furniture or fixtures are within the swing path. ADA requires 18\" minimum clearance on the pull side of the door.",
        };
      },
    },
  ],
  relatedSlugs: ["window-size-calculator", "square-footage-calculator", "staircase-calculator"],
  faq: [
    { question: "What is a standard interior door size?", answer: "The most common interior door size is 32\" or 36\" wide by 80\" tall. Bedroom and bathroom doors are typically 28\"-32\" wide. Closet doors range from 24\"-36\". ADA requires a minimum 32\" clear opening width." },
    { question: "What is a rough opening for a door?", answer: "A rough opening is the framed opening in the wall where the door unit fits. For interior doors, add 2\" to the door width and 2.5\" to the height. For example, a 36\"×80\" door needs a 38\"×82.5\" rough opening." },
  ],
  formula: "Rough Opening Width = Door Width + 2\" | Rough Opening Height = Door Height + 2.5\" | Swing Area = 0.5 × r² × θ",
};
