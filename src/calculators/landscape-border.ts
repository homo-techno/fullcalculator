import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const landscapeBorderCalculator: CalculatorDefinition = {
  slug: "landscape-border-calculator",
  title: "Landscape Edging Calculator",
  description: "Free landscape edging calculator. Estimate how much edging material you need for garden beds, walkways, driveways, and lawn borders.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["landscape edging calculator", "garden border calculator", "lawn edging calculator", "how much edging do I need", "landscape border calculator"],
  variants: [
    {
      id: "calc",
      name: "Calculate Landscape Edging",
      description: "Estimate edging materials and accessories",
      fields: [
        { name: "totalLength", label: "Total Edging Length (feet)", type: "number", placeholder: "e.g. 120" },
        { name: "edgingType", label: "Edging Type", type: "select", options: [{ label: "Steel Edging (4\" tall)", value: "steel" }, { label: "Aluminum Edging (4\" tall)", value: "aluminum" }, { label: "Plastic Roll (20' rolls)", value: "plastic" }, { label: "Concrete Curb Stones", value: "curb" }, { label: "Brick Soldier Course", value: "brick" }], defaultValue: "steel" },
        { name: "costPerUnit", label: "Cost per Piece/Roll (optional)", type: "number", placeholder: "e.g. 15", prefix: "$" },
      ],
      calculate: (inputs) => {
        const totalLength = inputs.totalLength as number;
        const edgingType = (inputs.edgingType as string) || "steel";
        const costPerUnit = inputs.costPerUnit as number;
        if (!totalLength) return null;

        let pieces = 0;
        let pieceLength = 0;
        let stakes = 0;
        let connectors = 0;
        let unitLabel = "";

        if (edgingType === "steel") {
          pieceLength = 16; // 16-foot sections
          pieces = Math.ceil(totalLength / pieceLength);
          stakes = Math.ceil(totalLength / 3); // stake every 3 feet
          connectors = pieces > 1 ? pieces - 1 : 0;
          unitLabel = "16' steel sections";
        } else if (edgingType === "aluminum") {
          pieceLength = 8; // 8-foot sections
          pieces = Math.ceil(totalLength / pieceLength);
          stakes = Math.ceil(totalLength / 3);
          connectors = pieces > 1 ? pieces - 1 : 0;
          unitLabel = "8' aluminum sections";
        } else if (edgingType === "plastic") {
          pieceLength = 20; // 20-foot rolls
          pieces = Math.ceil(totalLength / pieceLength);
          stakes = Math.ceil(totalLength / 2); // stake every 2 feet for plastic
          connectors = 0;
          unitLabel = "20' plastic rolls";
        } else if (edgingType === "curb") {
          pieceLength = 1; // ~12" curb stones
          pieces = Math.ceil(totalLength * 1);
          stakes = 0;
          connectors = 0;
          unitLabel = "curb stones (12\" each)";
        } else {
          // brick soldier course
          pieceLength = 8 / 12; // standard brick = 8" long
          pieces = Math.ceil(totalLength / pieceLength);
          stakes = 0;
          connectors = 0;
          unitLabel = "bricks";
        }

        const piecesWithWaste = Math.ceil(pieces * 1.05);

        const details: { label: string; value: string }[] = [
          { label: "Total Length", value: `${formatNumber(totalLength)} feet` },
          { label: "Edging Type", value: edgingType.charAt(0).toUpperCase() + edgingType.slice(1) },
          { label: "Pieces/Rolls Needed", value: `${formatNumber(pieces)} ${unitLabel}` },
          { label: "With 5% Extra", value: formatNumber(piecesWithWaste) },
        ];

        if (stakes > 0) {
          details.push({ label: "Stakes Needed", value: formatNumber(stakes) });
        }
        if (connectors > 0) {
          details.push({ label: "Connectors Needed", value: formatNumber(connectors) });
        }

        if (costPerUnit) {
          const edgingCost = piecesWithWaste * costPerUnit;
          const stakeCost = stakes * 1.5;
          const connectorCost = connectors * 3;
          const totalCost = edgingCost + stakeCost + connectorCost;
          details.push({ label: "Edging Cost", value: `$${formatNumber(edgingCost, 2)}` });
          if (stakes > 0) {
            details.push({ label: "Stakes & Connectors", value: `$${formatNumber(stakeCost + connectorCost, 2)}` });
          }
          details.push({ label: "Estimated Total", value: `$${formatNumber(totalCost, 2)}` });
          details.push({ label: "Cost per linear foot", value: `$${formatNumber(totalCost / totalLength, 2)}` });
        }

        return {
          primary: { label: "Edging Needed", value: `${formatNumber(piecesWithWaste)} ${unitLabel}` },
          details,
          note: "Steel and aluminum edging require stakes every 3 feet and connectors between sections. Plastic edging needs stakes every 2 feet. Include 5% extra for curves and waste.",
        };
      },
    },
  ],
  relatedSlugs: ["mulch-calculator", "landscape-stone-calculator", "landscape-fabric-calc-calculator"],
  faq: [
    { question: "What is the best landscape edging material?", answer: "Steel edging is the most durable and professional-looking, lasting 20+ years. Aluminum is lighter and corrosion-resistant. Plastic is the most affordable but less durable. Choose based on budget and aesthetic goals." },
    { question: "How deep should landscape edging be installed?", answer: "Standard landscape edging should be installed with about 3-4 inches below ground level. The top edge should sit at or slightly above the mulch level to contain materials effectively." },
    { question: "How many stakes do I need for landscape edging?", answer: "For steel and aluminum edging, place stakes every 3 feet and at every connection point. For plastic edging, use stakes every 2 feet. Use more stakes on curves." },
  ],
  formula: "Pieces = Total Length (ft) / Piece Length (ft) x 1.05 waste factor",
};
