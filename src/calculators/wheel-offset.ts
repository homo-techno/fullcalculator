import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wheelOffsetCalculator: CalculatorDefinition = {
  slug: "wheel-offset-calculator",
  title: "Wheel Offset Calculator",
  description: "Free wheel offset calculator. Compare wheel and tire fitment, calculate offset differences, and check if new wheels will fit your vehicle.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["wheel offset calculator", "rim offset", "wheel fitment calculator", "tire offset", "wheel spacer calculator"],
  variants: [
    {
      id: "compare",
      name: "Compare Wheel Offset",
      description: "Compare old and new wheel offset and width",
      fields: [
        { name: "oldWidth", label: "Old Wheel Width (inches)", type: "number", placeholder: "e.g. 7.0", step: 0.5 },
        { name: "oldOffset", label: "Old Wheel Offset (mm)", type: "number", placeholder: "e.g. 45" },
        { name: "newWidth", label: "New Wheel Width (inches)", type: "number", placeholder: "e.g. 8.0", step: 0.5 },
        { name: "newOffset", label: "New Wheel Offset (mm)", type: "number", placeholder: "e.g. 35" },
      ],
      calculate: (inputs) => {
        const oldWidth = inputs.oldWidth as number;
        const oldOffset = inputs.oldOffset as number;
        const newWidth = inputs.newWidth as number;
        const newOffset = inputs.newOffset as number;
        if (!oldWidth || oldOffset === undefined || !newWidth || newOffset === undefined) return null;

        // Convert widths to mm
        const oldWidthMm = oldWidth * 25.4;
        const newWidthMm = newWidth * 25.4;

        // Calculate inner and outer lip positions relative to mounting surface
        // Offset = distance from center of wheel to mounting surface
        const oldInner = (oldWidthMm / 2) + oldOffset;
        const oldOuter = (oldWidthMm / 2) - oldOffset;
        const newInner = (newWidthMm / 2) + newOffset;
        const newOuter = (newWidthMm / 2) - newOffset;

        // Differences (positive = sticks out more)
        const innerDiff = newInner - oldInner; // positive = closer to strut/fender well
        const outerDiff = newOuter - oldOuter; // positive = sticks out more from fender

        const offsetDiff = newOffset - oldOffset;

        let fitment = "Should fit";
        if (Math.abs(outerDiff) > 15 || Math.abs(innerDiff) > 15) {
          fitment = "May not fit - significant change";
        } else if (Math.abs(outerDiff) > 8 || Math.abs(innerDiff) > 8) {
          fitment = "Borderline - check clearance";
        }

        return {
          primary: { label: "Offset Difference", value: `${offsetDiff > 0 ? "+" : ""}${formatNumber(offsetDiff, 0)} mm` },
          details: [
            { label: "Outer lip change", value: `${outerDiff > 0 ? "+" : ""}${formatNumber(outerDiff, 1)} mm ${outerDiff > 0 ? "(wider)" : "(narrower)"}` },
            { label: "Inner lip change", value: `${innerDiff > 0 ? "+" : ""}${formatNumber(innerDiff, 1)} mm ${innerDiff > 0 ? "(wider)" : "(narrower)"}` },
            { label: "Width change", value: `${newWidth - oldWidth > 0 ? "+" : ""}${formatNumber(newWidth - oldWidth, 1)} inches` },
            { label: "Fitment assessment", value: fitment },
          ],
          note: "Positive outer lip change means the wheel sticks out more from the fender. Positive inner lip change means the wheel moves closer to the suspension/strut. Always verify clearance before purchasing.",
        };
      },
    },
    {
      id: "spacer",
      name: "Wheel Spacer Calculator",
      description: "Calculate the effective offset change with wheel spacers",
      fields: [
        { name: "currentOffset", label: "Current Wheel Offset (mm)", type: "number", placeholder: "e.g. 45" },
        { name: "spacerSize", label: "Spacer Thickness (mm)", type: "number", placeholder: "e.g. 15" },
        { name: "wheelWidth", label: "Wheel Width (inches)", type: "number", placeholder: "e.g. 8.0", step: 0.5 },
      ],
      calculate: (inputs) => {
        const offset = inputs.currentOffset as number;
        const spacer = inputs.spacerSize as number;
        const width = inputs.wheelWidth as number;
        if (offset === undefined || !spacer || !width) return null;

        const effectiveOffset = offset - spacer;
        const widthMm = width * 25.4;
        const outerPoke = (widthMm / 2) - effectiveOffset;

        return {
          primary: { label: "Effective Offset", value: `${formatNumber(effectiveOffset, 0)} mm (ET${formatNumber(effectiveOffset, 0)})` },
          details: [
            { label: "Original offset", value: `ET${offset}` },
            { label: "Spacer thickness", value: `${spacer} mm` },
            { label: "Offset change", value: `-${spacer} mm` },
            { label: "Outer lip from hub", value: `${formatNumber(outerPoke, 1)} mm` },
          ],
          note: "Spacers push the wheel outward, effectively reducing the offset. Ensure you use hub-centric spacers and longer wheel studs/bolts if necessary.",
        };
      },
    },
  ],
  relatedSlugs: ["tire-pressure-calculator", "gear-ratio-vehicle-calculator", "braking-distance-calculator"],
  faq: [
    { question: "What is wheel offset?", answer: "Wheel offset (ET) is the distance in millimeters from the wheel's center line to its mounting surface. Positive offset means the mounting surface is toward the outside of the wheel (common on FWD cars). Negative offset means it is toward the inside (common on trucks). Zero offset means the mounting surface is at the center line." },
    { question: "How much offset change is safe?", answer: "Generally, a change of 5-10mm from stock is safe for most vehicles. Changes beyond 15mm may cause rubbing on fenders or suspension components. Wider wheels with lower offset push the tire outward, which can affect handling and put stress on wheel bearings." },
    { question: "What do wheel spacers do?", answer: "Wheel spacers push the wheel outward from the hub, effectively reducing the offset. A 15mm spacer on an ET45 wheel makes it behave like an ET30 wheel. This creates a wider stance but can stress bearings if overdone. Always use hub-centric spacers for safety." },
  ],
  formula: "Effective Offset = Original Offset - Spacer Thickness; Outer Lip Position = (Wheel Width / 2) - Offset",
};
