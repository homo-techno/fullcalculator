import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const joistSpanCalculator: CalculatorDefinition = {
  slug: "joist-span-calculator",
  title: "Joist Span Calculator",
  description: "Free joist span calculator. Find the maximum span for floor and deck joists based on size, spacing, and wood species.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["joist span calculator", "floor joist span", "deck joist span", "joist span table", "maximum joist span"],
  variants: [
    {
      id: "calc",
      name: "Calculate Maximum Joist Span",
      description: "Look up maximum joist span based on size and spacing",
      fields: [
        { name: "joistSize", label: "Joist Size", type: "select", options: [
          { label: "2x6", value: "2x6" },
          { label: "2x8", value: "2x8" },
          { label: "2x10", value: "2x10" },
          { label: "2x12", value: "2x12" },
        ], defaultValue: "2x8" },
        { name: "spacing", label: "Joist Spacing", type: "select", options: [
          { label: "12\" on center", value: "12" },
          { label: "16\" on center", value: "16" },
          { label: "24\" on center", value: "24" },
        ], defaultValue: "16" },
        { name: "species", label: "Wood Species", type: "select", options: [
          { label: "SPF (Spruce-Pine-Fir)", value: "SPF" },
          { label: "Douglas Fir-Larch", value: "DF" },
          { label: "Southern Pine", value: "SP" },
        ], defaultValue: "SPF" },
      ],
      calculate: (inputs) => {
        const joistSize = inputs.joistSize as string;
        const spacing = inputs.spacing as string;
        const species = inputs.species as string;
        if (!joistSize || !spacing || !species) return null;

        // Span tables (in feet-inches) for #2 grade lumber, 40 psf live load + 10 psf dead load
        // Simplified lookup table
        const spanTable: Record<string, Record<string, Record<string, { floor: number; deck: number }>>> = {
          "2x6": {
            "12": { SPF: { floor: 9.5, deck: 9 }, DF: { floor: 10.5, deck: 10 }, SP: { floor: 10, deck: 9.5 } },
            "16": { SPF: { floor: 8.5, deck: 8 }, DF: { floor: 9.5, deck: 9 }, SP: { floor: 9, deck: 8.5 } },
            "24": { SPF: { floor: 7, deck: 7 }, DF: { floor: 8, deck: 7.5 }, SP: { floor: 7.5, deck: 7 } },
          },
          "2x8": {
            "12": { SPF: { floor: 12.5, deck: 12 }, DF: { floor: 14, deck: 13 }, SP: { floor: 13, deck: 12.5 } },
            "16": { SPF: { floor: 11.5, deck: 10.5 }, DF: { floor: 12.5, deck: 12 }, SP: { floor: 12, deck: 11 } },
            "24": { SPF: { floor: 9.5, deck: 9 }, DF: { floor: 10.5, deck: 10 }, SP: { floor: 10, deck: 9.5 } },
          },
          "2x10": {
            "12": { SPF: { floor: 16, deck: 15 }, DF: { floor: 17.5, deck: 16.5 }, SP: { floor: 17, deck: 16 } },
            "16": { SPF: { floor: 14.5, deck: 13.5 }, DF: { floor: 16, deck: 15 }, SP: { floor: 15.5, deck: 14 } },
            "24": { SPF: { floor: 12, deck: 11 }, DF: { floor: 13.5, deck: 12.5 }, SP: { floor: 13, deck: 12 } },
          },
          "2x12": {
            "12": { SPF: { floor: 19.5, deck: 18 }, DF: { floor: 21.5, deck: 20 }, SP: { floor: 20.5, deck: 19 } },
            "16": { SPF: { floor: 17.5, deck: 16.5 }, DF: { floor: 19.5, deck: 18 }, SP: { floor: 18.5, deck: 17 } },
            "24": { SPF: { floor: 14.5, deck: 13.5 }, DF: { floor: 16, deck: 15 }, SP: { floor: 15.5, deck: 14.5 } },
          },
        };

        const entry = spanTable[joistSize]?.[spacing]?.[species];
        if (!entry) return null;

        const speciesName = species === "SPF" ? "Spruce-Pine-Fir" : species === "DF" ? "Douglas Fir-Larch" : "Southern Pine";
        const floorFt = Math.floor(entry.floor);
        const floorIn = Math.round((entry.floor - floorFt) * 12);
        const deckFt = Math.floor(entry.deck);
        const deckIn = Math.round((entry.deck - deckFt) * 12);

        return {
          primary: { label: "Max Floor Joist Span", value: `${floorFt}' - ${floorIn}"` },
          details: [
            { label: "Floor joist max span", value: `${formatNumber(entry.floor, 1)} ft (${floorFt}' - ${floorIn}")` },
            { label: "Deck joist max span", value: `${formatNumber(entry.deck, 1)} ft (${deckFt}' - ${deckIn}")` },
            { label: "Joist size", value: joistSize },
            { label: "Spacing", value: `${spacing}" on center` },
            { label: "Species", value: speciesName },
            { label: "Grade", value: "#2 or better" },
            { label: "Design load", value: "40 psf live + 10 psf dead" },
          ],
          note: "Spans are for #2 grade lumber with 40 psf live load and 10 psf dead load (residential floor). Deck spans may be lower due to exposure. Always verify with local building codes and an engineer for structural applications.",
        };
      },
    },
  ],
  relatedSlugs: ["beam-size-calculator", "deck-calculator", "lumber-calculator"],
  faq: [
    { question: "How far can a 2x8 joist span?", answer: "A #2 grade SPF 2x8 at 16\" on center can span approximately 11 feet 6 inches for a floor (40 psf live load). Douglas Fir can span about 12 feet 6 inches at the same spacing." },
    { question: "Should I use 16\" or 24\" joist spacing?", answer: "16\" on center is standard for residential floors and most decks. 24\" spacing is sometimes used for roofs or floors with thicker subfloor sheathing. Closer spacing allows longer spans and less floor bounce." },
    { question: "What size joist do I need?", answer: "Joist size depends on span length, spacing, and load. For typical residential floors: 2x6 for spans up to 9 ft, 2x8 for up to 12 ft, 2x10 for up to 15 ft, and 2x12 for up to 18 ft (at 16\" OC with SPF lumber)." },
  ],
  formula: "Max span from IRC span tables based on joist size, spacing, species, and grade",
};
