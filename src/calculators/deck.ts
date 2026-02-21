import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const deckCalculator: CalculatorDefinition = {
  slug: "deck-calculator",
  title: "Deck Calculator",
  description: "Free deck calculator. Calculate decking boards, screws, joists, and materials needed for your deck project.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["deck calculator", "deck board calculator", "deck material calculator", "deck cost estimator", "deck building"],
  variants: [
    {
      id: "materials",
      name: "Deck Materials",
      fields: [
        { name: "length", label: "Deck Length (ft)", type: "number", placeholder: "e.g. 20" },
        { name: "width", label: "Deck Width (ft)", type: "number", placeholder: "e.g. 12" },
        { name: "boardWidth", label: "Board Width (inches)", type: "number", placeholder: "e.g. 5.5", defaultValue: 5.5 },
        { name: "boardLength", label: "Board Length (ft)", type: "number", placeholder: "e.g. 12", defaultValue: 12 },
        { name: "joistSpacing", label: "Joist Spacing (inches)", type: "number", placeholder: "e.g. 16", defaultValue: 16 },
      ],
      calculate: (inputs) => {
        const l = inputs.length as number, w = inputs.width as number;
        const bw = (inputs.boardWidth as number) || 5.5;
        const bl = (inputs.boardLength as number) || 12;
        const js = (inputs.joistSpacing as number) || 16;
        if (!l || !w) return null;
        const sqft = l * w;
        const boardsAcross = Math.ceil(l / (bw / 12));
        const boardsPerRow = Math.ceil(w / bl);
        const totalBoards = Math.ceil(boardsAcross * boardsPerRow * 1.1);
        const joists = Math.ceil(l / (js / 12)) + 1;
        const screwsPerBoard = Math.ceil(w / (js / 12)) * 2;
        const totalScrews = boardsAcross * screwsPerBoard;
        const screwBoxes = Math.ceil(totalScrews / 100);
        return {
          primary: { label: "Deck Boards", value: `${totalBoards} boards (${bl}ft)` },
          details: [
            { label: "Deck area", value: `${formatNumber(sqft, 0)} sq ft` },
            { label: "Joists needed", value: `${joists} @ ${js}\" O.C.` },
            { label: "Screws needed", value: `≈ ${formatNumber(totalScrews, 0)}` },
            { label: "Screw boxes (100ct)", value: String(screwBoxes) },
            { label: "Includes 10% waste", value: "Yes" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["fence-calculator", "concrete-calculator", "square-footage-calculator"],
  faq: [{ question: "How many deck boards do I need?", answer: "Divide deck length by board width to get boards across. Multiply by number of boards per row (deck width / board length, rounded up). Add 10% for waste. Standard deck boards are 5.5\" wide and 8-16 ft long." }],
  formula: "Boards = (Length / Board Width) × (Width / Board Length) × 1.1",
};
