import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const speakerPlacementCalculator: CalculatorDefinition = {
  slug: "speaker-placement-calculator",
  title: "Speaker Placement Calculator",
  description:
    "Free speaker placement calculator. Calculate optimal stereo speaker positions, listening distance, and toe-in angle for any room size.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "speaker placement calculator",
    "speaker position",
    "stereo triangle",
    "listening position",
    "speaker distance",
    "room acoustics",
    "speaker setup",
  ],
  variants: [
    {
      id: "stereo-triangle",
      name: "Stereo Triangle Setup",
      description: "Calculate ideal stereo speaker placement using the equilateral triangle rule",
      fields: [
        {
          name: "roomWidth",
          label: "Room Width (feet)",
          type: "number",
          placeholder: "e.g. 12",
          min: 5,
          step: 0.5,
        },
        {
          name: "roomLength",
          label: "Room Length (feet)",
          type: "number",
          placeholder: "e.g. 16",
          min: 5,
          step: 0.5,
        },
        {
          name: "speakerType",
          label: "Speaker Type",
          type: "select",
          options: [
            { label: "Bookshelf / Stand-mount", value: "bookshelf" },
            { label: "Floor-standing / Tower", value: "tower" },
            { label: "Studio Monitor (nearfield)", value: "nearfield" },
          ],
          defaultValue: "bookshelf",
        },
      ],
      calculate: (inputs) => {
        const width = inputs.roomWidth as number;
        const length = inputs.roomLength as number;
        const speakerType = inputs.speakerType as string;
        if (!width || !length || width <= 0 || length <= 0) return null;

        // Wall distances recommendation based on speaker type
        const sideWallMin = speakerType === "nearfield" ? 1.5 : 2.5;
        const backWallMin = speakerType === "tower" ? 3 : 2;

        // Speaker separation: roughly 60-80% of room width, at least 2 feet from side walls
        const maxSeparation = width - sideWallMin * 2;
        const idealSeparation = Math.min(maxSeparation, width * 0.67);

        // Equilateral triangle: listener distance = speaker separation
        const listenerDistance = idealSeparation;
        const listenerFromBackWall = length - backWallMin - listenerDistance;

        // Toe-in angle (pointing toward listener)
        const toeInAngle = Math.atan2(idealSeparation / 2, listenerDistance) * (180 / Math.PI);

        // Height recommendation
        const earHeight = speakerType === "tower" ? "36-42 inches (built-in)" : "36-42 inches (use stands)";

        // First reflection points
        const firstReflectionSide = idealSeparation / 4; // approx distance from speaker to side reflection

        return {
          primary: { label: "Speaker Separation", value: formatNumber(idealSeparation, 1) + " ft" },
          details: [
            { label: "Listener Distance", value: formatNumber(listenerDistance, 1) + " ft from speakers" },
            { label: "Speakers from Front Wall", value: formatNumber(backWallMin, 1) + " ft minimum" },
            { label: "Speakers from Side Walls", value: formatNumber(sideWallMin, 1) + " ft minimum" },
            { label: "Listener from Back Wall", value: formatNumber(Math.max(listenerFromBackWall, 2), 1) + " ft" },
            { label: "Toe-in Angle", value: formatNumber(toeInAngle, 1) + " degrees" },
            { label: "Tweeter Height", value: earHeight },
            { label: "First Reflection (side wall)", value: formatNumber(firstReflectionSide, 1) + " ft from speaker" },
            { label: "Room Ratio", value: formatNumber(length / width, 2) + ":1 (L:W)" },
          ],
          note: "The equilateral triangle rule places you at the same distance from each speaker as the speakers are from each other. Fine-tune by ear.",
        };
      },
    },
    {
      id: "subwoofer-placement",
      name: "Subwoofer Placement Guide",
      description: "Calculate room modes and optimal subwoofer position",
      fields: [
        {
          name: "roomLength",
          label: "Room Length (feet)",
          type: "number",
          placeholder: "e.g. 16",
          min: 5,
        },
        {
          name: "roomWidth",
          label: "Room Width (feet)",
          type: "number",
          placeholder: "e.g. 12",
          min: 5,
        },
        {
          name: "roomHeight",
          label: "Room Height (feet)",
          type: "number",
          placeholder: "e.g. 8",
          min: 6,
          defaultValue: 8,
        },
      ],
      calculate: (inputs) => {
        const l = inputs.roomLength as number;
        const w = inputs.roomWidth as number;
        const h = (inputs.roomHeight as number) || 8;
        if (!l || !w || l <= 0 || w <= 0) return null;

        const speedOfSound = 1125; // ft/s
        const modeLengthHz = speedOfSound / (2 * l);
        const modeWidthHz = speedOfSound / (2 * w);
        const modeHeightHz = speedOfSound / (2 * h);

        return {
          primary: { label: "Length Room Mode", value: formatNumber(modeLengthHz, 1) + " Hz" },
          details: [
            { label: "Width Room Mode", value: formatNumber(modeWidthHz, 1) + " Hz" },
            { label: "Height Room Mode", value: formatNumber(modeHeightHz, 1) + " Hz" },
            { label: "2nd Length Mode", value: formatNumber(modeLengthHz * 2, 1) + " Hz" },
            { label: "2nd Width Mode", value: formatNumber(modeWidthHz * 2, 1) + " Hz" },
            { label: "Recommended Sub Position", value: "38% of room length from front wall" },
            { label: "Alt Sub Position", value: "Front wall corner (maximum output)" },
            { label: "Avoid Position", value: "Center of room (worst nulls)" },
          ],
          note: "Room modes cause bass peaks and nulls. Place the subwoofer away from exact room center. The 'subwoofer crawl' method is recommended for fine-tuning.",
        };
      },
    },
  ],
  relatedSlugs: ["subwoofer-box-calculator", "cable-length-audio-calculator", "frequency-to-note-calculator"],
  faq: [
    {
      question: "What is the stereo triangle?",
      answer:
        "The stereo triangle is a speaker placement method where the two speakers and the listener form an equilateral triangle. The distance between speakers equals the distance from each speaker to the listener. This creates the best stereo imaging.",
    },
    {
      question: "How far should speakers be from the wall?",
      answer:
        "Bookshelf speakers should be at least 2 feet from the back wall and side walls to reduce bass buildup and comb filtering. Ported speakers need even more space behind them. Corner placement exaggerates bass.",
    },
    {
      question: "What are room modes?",
      answer:
        "Room modes are standing waves that form at frequencies related to your room dimensions. They cause certain bass frequencies to be much louder (peaks) or much quieter (nulls) at specific positions. Treating room modes with bass traps and careful placement improves sound quality.",
    },
  ],
  formula:
    "Ideal Separation = Room Width x 0.67 | Listener Distance = Speaker Separation (equilateral triangle) | Room Mode (Hz) = Speed of Sound / (2 x Dimension)",
};
