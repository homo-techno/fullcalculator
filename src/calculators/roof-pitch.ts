import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const roofPitchCalculator: CalculatorDefinition = {
  slug: "roof-pitch-calculator",
  title: "Roof Pitch Calculator",
  description: "Free roof pitch calculator. Convert between roof pitch, degrees, and percentage. Calculate rise, run, rafter length, and roof area from pitch.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["roof pitch calculator", "roof slope calculator", "roof angle calculator", "pitch to degrees", "rafter length calculator"],
  variants: [
    {
      id: "pitch-from-rise-run",
      name: "Pitch from Rise & Run",
      description: "Calculate roof pitch from rise and run measurements",
      fields: [
        { name: "rise", label: "Rise (inches)", type: "number", placeholder: "e.g. 6" },
        { name: "run", label: "Run (inches)", type: "number", placeholder: "e.g. 12", defaultValue: 12 },
      ],
      calculate: (inputs) => {
        const rise = inputs.rise as number;
        const run = (inputs.run as number) || 12;
        if (!rise) return null;

        const pitchRatio = rise / run;
        const pitchPer12 = (rise / run) * 12;
        const degrees = Math.atan(pitchRatio) * (180 / Math.PI);
        const percentGrade = pitchRatio * 100;
        const rafterLengthPer12 = Math.sqrt(144 + pitchPer12 * pitchPer12);
        const pitchMultiplier = rafterLengthPer12 / 12;

        let walkability: string;
        if (pitchPer12 <= 4) walkability = "Walkable - Low slope";
        else if (pitchPer12 <= 7) walkability = "Walkable with caution";
        else if (pitchPer12 <= 10) walkability = "Steep - Requires roof jacks";
        else walkability = "Very steep - Requires scaffolding";

        return {
          primary: { label: "Roof Pitch", value: `${formatNumber(pitchPer12, 1)}/12` },
          details: [
            { label: "Pitch (X/12)", value: `${formatNumber(pitchPer12, 2)}/12` },
            { label: "Angle (degrees)", value: `${formatNumber(degrees, 1)}°` },
            { label: "Slope percentage", value: `${formatNumber(percentGrade, 1)}%` },
            { label: "Rafter length per 12\" run", value: `${formatNumber(rafterLengthPer12, 2)}"` },
            { label: "Roof area multiplier", value: `× ${formatNumber(pitchMultiplier, 4)}` },
            { label: "Walkability", value: walkability },
          ],
          note: "Roof area multiplier: Multiply your footprint area by this factor to get the actual roof surface area. Example: 1,000 sq ft footprint × 1.118 (6/12 pitch) = 1,118 sq ft roof area.",
        };
      },
    },
    {
      id: "rafter-length",
      name: "Rafter Length Calculator",
      description: "Calculate rafter length from span and pitch",
      fields: [
        { name: "span", label: "Building Span / Width (feet)", type: "number", placeholder: "e.g. 30" },
        { name: "pitch", label: "Roof Pitch", type: "select", options: [
          { label: "2/12", value: "2" },
          { label: "3/12", value: "3" },
          { label: "4/12", value: "4" },
          { label: "5/12", value: "5" },
          { label: "6/12", value: "6" },
          { label: "7/12", value: "7" },
          { label: "8/12", value: "8" },
          { label: "9/12", value: "9" },
          { label: "10/12", value: "10" },
          { label: "12/12", value: "12" },
        ], defaultValue: "6" },
        { name: "overhang", label: "Eave Overhang (inches)", type: "number", placeholder: "e.g. 12", defaultValue: 12 },
        { name: "ridgeBoard", label: "Ridge Board Thickness", type: "select", options: [
          { label: "1.5\" (2× lumber)", value: "1.5" },
          { label: "0\" (No ridge / trusses)", value: "0" },
        ], defaultValue: "1.5" },
      ],
      calculate: (inputs) => {
        const span = inputs.span as number;
        const pitch = parseInt(inputs.pitch as string) || 6;
        const overhang = (inputs.overhang as number) || 12;
        const ridgeThickness = parseFloat(inputs.ridgeBoard as string) || 1.5;
        if (!span) return null;

        const run = (span / 2) - (ridgeThickness / 2 / 12);
        const rise = run * (pitch / 12);
        const rafterLength = Math.sqrt(run * run + rise * rise);
        const overhangFt = overhang / 12;
        const overhangRafter = overhangFt / Math.cos(Math.atan(pitch / 12));
        const totalRafterLength = rafterLength + overhangRafter;
        const degrees = Math.atan(pitch / 12) * (180 / Math.PI);

        // Birdsmouth cut dimensions
        const birdsmouthSeat = 3.5; // inches for 2×6 rafter on 2×4 wall
        const birdsmouthPlumb = birdsmouthSeat * (pitch / 12);

        return {
          primary: { label: "Rafter Length", value: `${formatNumber(totalRafterLength, 2)} feet` },
          details: [
            { label: "Rafter length (no overhang)", value: `${formatNumber(rafterLength, 2)} ft` },
            { label: "Overhang rafter addition", value: `${formatNumber(overhangRafter, 2)} ft` },
            { label: "Total rafter length", value: `${formatNumber(totalRafterLength, 2)} ft (${formatNumber(totalRafterLength * 12, 1)}")` },
            { label: "Rise (peak height)", value: `${formatNumber(rise, 2)} ft` },
            { label: "Run (half span)", value: `${formatNumber(run, 2)} ft` },
            { label: "Roof angle", value: `${formatNumber(degrees, 1)}°` },
            { label: "Birdsmouth seat cut", value: `${formatNumber(birdsmouthSeat, 1)}" (for 2×4 wall)` },
          ],
          note: "Order lumber at least 6\" longer than the calculated rafter length for cutting waste. HAP (height above plate) should be at least 2/3 of the rafter depth for structural integrity.",
        };
      },
    },
  ],
  relatedSlugs: ["truss-calculator", "roofing-calculator", "soffit-calculator"],
  faq: [
    { question: "What does roof pitch mean?", answer: "Roof pitch is the slope of a roof expressed as a ratio of rise to run. A 6/12 pitch means the roof rises 6 inches for every 12 inches of horizontal run. Common residential pitches range from 4/12 to 9/12. Low-slope roofs are under 3/12; steep roofs are over 9/12." },
    { question: "How do I measure roof pitch?", answer: "Place a level horizontally on the roof, mark 12 inches from the end touching the roof. Measure vertically from that 12-inch mark down to the roof surface. That measurement (in inches) is your pitch over 12. Example: 6 inches = 6/12 pitch." },
  ],
  formula: "Pitch = Rise / Run × 12 | Angle = arctan(Rise/Run) | Rafter Length = √(Run² + Rise²) | Roof Area = Footprint × √(1 + (Pitch/12)²)",
};
