import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const movingBoxCalculator: CalculatorDefinition = {
  slug: "moving-box-calculator",
  title: "Moving Box Calculator",
  description:
    "Free moving box calculator. Estimate how many boxes you need based on home size and number of rooms.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "moving boxes",
    "packing calculator",
    "moving estimate",
    "boxes needed",
    "relocation",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "rooms",
          label: "Number of Rooms",
          type: "number",
          placeholder: "e.g. 5",
        },
        {
          name: "homeSize",
          label: "Home Size",
          type: "select",
          options: [
            { label: "Studio", value: "studio" },
            { label: "1 Bedroom", value: "1br" },
            { label: "2 Bedroom", value: "2br" },
            { label: "3 Bedroom", value: "3br" },
            { label: "4+ Bedroom", value: "4br" },
          ],
        },
      ],
      calculate: (inputs) => {
        const rooms = inputs.rooms as number;
        const homeSize = (inputs.homeSize as string) || "2br";
        if (!rooms || rooms <= 0) return null;

        const baseBoxes: Record<string, { small: number; medium: number; large: number; wardrobe: number }> = {
          studio: { small: 10, medium: 8, large: 5, wardrobe: 1 },
          "1br": { small: 15, medium: 12, large: 8, wardrobe: 2 },
          "2br": { small: 25, medium: 20, large: 12, wardrobe: 3 },
          "3br": { small: 35, medium: 28, large: 18, wardrobe: 4 },
          "4br": { small: 50, medium: 40, large: 25, wardrobe: 6 },
        };

        const base = baseBoxes[homeSize] || baseBoxes["2br"];
        const roomMultiplier = rooms / (homeSize === "studio" ? 1 : homeSize === "1br" ? 3 : homeSize === "2br" ? 5 : homeSize === "3br" ? 7 : 9);
        const factor = Math.max(0.7, Math.min(1.5, roomMultiplier));

        const small = Math.ceil(base.small * factor);
        const medium = Math.ceil(base.medium * factor);
        const large = Math.ceil(base.large * factor);
        const wardrobe = Math.ceil(base.wardrobe * factor);
        const total = small + medium + large + wardrobe;

        return {
          primary: {
            label: "Total Boxes Needed",
            value: formatNumber(total, 0),
          },
          details: [
            { label: "Small Boxes (16x12x12)", value: formatNumber(small, 0) },
            { label: "Medium Boxes (18x18x16)", value: formatNumber(medium, 0) },
            { label: "Large Boxes (18x18x24)", value: formatNumber(large, 0) },
            { label: "Wardrobe Boxes", value: formatNumber(wardrobe, 0) },
            { label: "Packing Paper (lbs)", value: formatNumber(total * 0.75, 0) },
            { label: "Tape Rolls", value: formatNumber(Math.ceil(total / 15), 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["gift-wrap-calculator", "postage-calculator"],
  faq: [
    {
      question: "How many boxes do I need to move?",
      answer:
        "A general rule is about 10 boxes per room. A studio may need 20-30 boxes total, a 2-bedroom home 50-60, and a 4-bedroom home over 100 boxes.",
    },
    {
      question: "What size moving boxes should I use?",
      answer:
        "Use small boxes for heavy items like books, medium boxes for kitchen items and toys, large boxes for lightweight bulky items like bedding, and wardrobe boxes for hanging clothes.",
    },
  ],
  formula:
    "Base box estimates by home size, adjusted by actual room count. Small boxes for heavy items, medium for general, large for bulky lightweight items, wardrobe for hanging clothes.",
};
