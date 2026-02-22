import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const handrailHeightCalculator: CalculatorDefinition = {
  slug: "handrail-height-calculator",
  title: "Handrail Height Calculator",
  description: "Free handrail height calculator. Determine the correct handrail and guardrail height per building codes for stairs, decks, and balconies.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["handrail height calculator", "railing height calculator", "guardrail height", "deck railing height", "stair handrail height"],
  variants: [
    {
      id: "stair-handrail",
      name: "Stair Handrail",
      description: "Calculate handrail height and post lengths for stairs",
      fields: [
        { name: "riserHeight", label: "Riser Height (inches)", type: "number", placeholder: "e.g. 7.25" },
        { name: "treadDepth", label: "Tread Depth (inches)", type: "number", placeholder: "e.g. 10" },
        { name: "railHeight", label: "Desired Handrail Height (inches)", type: "select", options: [
          { label: "34 inches (IRC minimum)", value: "34" },
          { label: "36 inches (standard)", value: "36" },
          { label: "38 inches (IRC maximum)", value: "38" },
          { label: "42 inches (commercial / IBC)", value: "42" },
        ], defaultValue: "36" },
        { name: "numRisers", label: "Number of Risers", type: "number", placeholder: "e.g. 14" },
      ],
      calculate: (inputs) => {
        const riser = inputs.riserHeight as number;
        const tread = inputs.treadDepth as number;
        const railHeight = parseInt(inputs.railHeight as string) || 36;
        const numRisers = inputs.numRisers as number;
        if (!riser || !tread || !numRisers) return null;

        const stairAngle = Math.atan(riser / tread) * (180 / Math.PI);
        const stairAngleRad = Math.atan(riser / tread);
        const totalRise = riser * numRisers;
        const totalRun = tread * (numRisers - 1);

        const topPostHeight = railHeight;
        const bottomPostHeight = railHeight;
        const railLength = Math.sqrt(totalRise * totalRise + totalRun * totalRun);
        const meetsCode = railHeight >= 34 && railHeight <= 38;

        return {
          primary: { label: "Handrail Height", value: `${railHeight} inches` },
          details: [
            { label: "Post height (plumb cut)", value: `${formatNumber(topPostHeight, 1)} in` },
            { label: "Rail length (along slope)", value: `${formatNumber(railLength / 12, 1)} ft (${formatNumber(railLength, 1)} in)` },
            { label: "Stair angle", value: `${formatNumber(stairAngle, 1)}\u00B0` },
            { label: "Total rise", value: `${formatNumber(totalRise / 12, 1)} ft` },
            { label: "Total run", value: `${formatNumber(totalRun / 12, 1)} ft` },
            { label: "Meets IRC code (34-38\")", value: meetsCode ? "Yes" : "No" },
            { label: "Number of risers", value: `${numRisers}` },
          ],
          note: "IRC requires stair handrails between 34\" and 38\" measured vertically from the stair nosing. Handrails must be graspable (1.25\" to 2\" diameter). Guardrails on open sides of stairs over 30\" above grade must be at least 36\" high.",
        };
      },
    },
    {
      id: "deck-guardrail",
      name: "Deck / Balcony Guardrail",
      description: "Determine guardrail requirements based on deck height above grade",
      fields: [
        { name: "deckHeight", label: "Deck Height Above Grade (inches)", type: "number", placeholder: "e.g. 48" },
        { name: "codeType", label: "Building Code", type: "select", options: [
          { label: "IRC (Residential) - 36\" min guardrail", value: "IRC" },
          { label: "IBC (Commercial) - 42\" min guardrail", value: "IBC" },
        ], defaultValue: "IRC" },
        { name: "postSpacing", label: "Post Spacing (feet)", type: "number", placeholder: "e.g. 6", defaultValue: 6 },
        { name: "deckPerimeter", label: "Railing Length / Perimeter (feet)", type: "number", placeholder: "e.g. 40" },
      ],
      calculate: (inputs) => {
        const deckHeight = inputs.deckHeight as number;
        const codeType = inputs.codeType as string;
        const postSpacing = (inputs.postSpacing as number) || 6;
        const perimeter = inputs.deckPerimeter as number;
        if (!deckHeight || !perimeter) return null;

        const needsGuardrail = deckHeight > 30;
        const minHeight = codeType === "IBC" ? 42 : 36;
        const numPosts = Math.ceil(perimeter / postSpacing) + 1;
        const postLength = minHeight + deckHeight + 6;

        return {
          primary: { label: "Guardrail Required", value: needsGuardrail ? `Yes - ${minHeight}\" minimum` : "Not required (under 30\" above grade)" },
          details: [
            { label: "Deck height above grade", value: `${deckHeight} in (${formatNumber(deckHeight / 12, 1)} ft)` },
            { label: "Min guardrail height", value: needsGuardrail ? `${minHeight} in` : "N/A" },
            { label: "Building code", value: codeType },
            { label: "Number of posts needed", value: `${numPosts}` },
            { label: "Railing length", value: `${formatNumber(perimeter)} ft` },
            { label: "Post spacing", value: `${postSpacing} ft` },
            { label: "Max baluster spacing", value: "4 inches (sphere test)" },
          ],
          note: "Guardrails are required when the walking surface is more than 30\" above grade. Balusters must be spaced so a 4\" sphere cannot pass through. Posts must be securely bolted to the structure, not just screwed.",
        };
      },
    },
  ],
  relatedSlugs: ["stair-stringer-calculator", "baluster-spacing-calculator", "deck-board-calculator"],
  faq: [
    { question: "What is the code-required handrail height for stairs?", answer: "Per the IRC (International Residential Code), stair handrails must be between 34 and 38 inches high, measured vertically from the stair nosing to the top of the handrail. Commercial stairs per IBC require 34-38 inch handrails plus a 42-inch guardrail if open on the side." },
    { question: "When is a guardrail required?", answer: "A guardrail is required when the walking surface (deck, balcony, landing) is more than 30 inches above the grade or floor below. Residential guardrails must be at least 36 inches high (IRC). Commercial guardrails must be at least 42 inches high (IBC)." },
  ],
  formula: "Rail height measured vertically from nosing line | Post count = Perimeter / Spacing + 1",
};
