import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pergolaCalculator: CalculatorDefinition = {
  slug: "pergola-calculator",
  title: "Pergola Calculator",
  description:
    "Free pergola calculator. Estimate posts, beams, rafters, and total lumber for your pergola project.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["pergola", "arbor", "outdoor structure", "rafters", "beams", "lumber"],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "length",
          label: "Pergola Length (feet)",
          type: "number",
          placeholder: "e.g. 12",
        },
        {
          name: "width",
          label: "Pergola Width (feet)",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "height",
          label: "Post Height (feet)",
          type: "number",
          placeholder: "e.g. 8",
        },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const height = inputs.height as number;
        if (!length || !width || !height) return null;

        // Posts: 4 corners + intermediate posts if length > 10 ft
        const posts = length > 10 ? 6 : 4;
        const postLumber = posts * (height + 2); // +2 ft for burial/footing

        // Beams: 2 beams running the length
        const beams = 2;
        const beamLumber = beams * (length + 2); // +2 ft overhang

        // Rafters: spaced 16" OC across the length
        const rafterSpacingFt = 16 / 12;
        const rafterCount = Math.floor(length / rafterSpacingFt) + 1;
        const rafterLumber = rafterCount * (width + 2); // +2 ft overhang

        const totalLumberFeet = postLumber + beamLumber + rafterLumber;

        return {
          primary: {
            label: "Total Lumber Needed",
            value: formatNumber(totalLumberFeet, 0) + " linear feet",
          },
          details: [
            { label: "Posts (6×6)", value: String(posts) + " × " + (height + 2) + "' = " + formatNumber(postLumber, 0) + " ft" },
            { label: "Beams (2×8 or 2×10)", value: String(beams) + " × " + (length + 2) + "' = " + formatNumber(beamLumber, 0) + " ft" },
            { label: 'Rafters (2×6, 16" OC)', value: String(rafterCount) + " × " + (width + 2) + "' = " + formatNumber(rafterLumber, 0) + " ft" },
            { label: "Coverage Area", value: formatNumber(length * width, 0) + " sq ft" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["lumber-calculator", "deck-calculator"],
  faq: [
    {
      question: "How many posts does a pergola need?",
      answer:
        "A small pergola (10 ft or less) needs 4 corner posts. Longer pergolas benefit from 6 posts with intermediate supports.",
    },
    {
      question: "What spacing for pergola rafters?",
      answer:
        "16 inches on center is standard rafter spacing, providing a good balance of shade and open sky.",
    },
  ],
  formula:
    "Posts = 4-6 × (Height + 2 ft). Beams = 2 × (Length + 2 ft). Rafters = (Length ÷ 1.33 + 1) × (Width + 2 ft).",
};
