import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dropCeilingCalcCalculator: CalculatorDefinition = {
  slug: "drop-ceiling-calc-calculator",
  title: "Drop Ceiling Grid Calculator",
  description: "Free drop ceiling calculator. Estimate how many ceiling tiles, grid runners, cross tees, wall angles, and hanger wires you need for a suspended ceiling.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["drop ceiling calculator", "suspended ceiling calculator", "ceiling tile calculator", "ceiling grid calculator", "how many ceiling tiles do I need"],
  variants: [
    {
      id: "calc",
      name: "Calculate Drop Ceiling Materials",
      description: "Estimate tiles, grid components, and hangers",
      fields: [
        { name: "roomLength", label: "Room Length (feet)", type: "number", placeholder: "e.g. 20" },
        { name: "roomWidth", label: "Room Width (feet)", type: "number", placeholder: "e.g. 16" },
        { name: "tileSize", label: "Tile Size", type: "select", options: [{ label: "2' x 2'", value: "2x2" }, { label: "2' x 4'", value: "2x4" }], defaultValue: "2x4" },
        { name: "costPerTile", label: "Cost per Tile (optional)", type: "number", placeholder: "e.g. 2.50", prefix: "$" },
      ],
      calculate: (inputs) => {
        const roomLength = inputs.roomLength as number;
        const roomWidth = inputs.roomWidth as number;
        const tileSize = (inputs.tileSize as string) || "2x4";
        const costPerTile = inputs.costPerTile as number;
        if (!roomLength || !roomWidth) return null;

        const areaSqFt = roomLength * roomWidth;
        const perimeter = 2 * (roomLength + roomWidth);

        // Tiles
        let tilesExact = 0;
        if (tileSize === "2x4") {
          tilesExact = Math.ceil(roomLength / 4) * Math.ceil(roomWidth / 2);
        } else {
          tilesExact = Math.ceil(roomLength / 2) * Math.ceil(roomWidth / 2);
        }
        const tilesWithExtra = tilesExact + Math.ceil(tilesExact * 0.05);

        // Main runners: run the length of the room, spaced 4' apart
        const mainRunnerRows = Math.ceil(roomWidth / 4);
        const mainRunnerLength = mainRunnerRows * roomLength;
        const mainRunners12ft = Math.ceil(mainRunnerLength / 12);

        // Cross tees: perpendicular to main runners
        let crossTees4ft = 0;
        let crossTees2ft = 0;
        if (tileSize === "2x4") {
          // 4' cross tees between main runners, spaced every 2'
          crossTees4ft = Math.ceil(roomWidth / 4) * Math.ceil(roomLength / 2);
        } else {
          // 2x2 grid needs both 4' and 2' cross tees
          crossTees4ft = Math.ceil(roomWidth / 4) * Math.ceil(roomLength / 2);
          crossTees2ft = Math.ceil(roomWidth / 4) * Math.ceil(roomLength / 4);
        }

        // Wall angle: perimeter
        const wallAngle12ft = Math.ceil(perimeter / 12);

        // Hanger wires: every 4' along main runners
        const hangerWires = Math.ceil(mainRunnerLength / 4);

        const details: { label: string; value: string }[] = [
          { label: "Room Area", value: `${formatNumber(areaSqFt)} sq ft` },
          { label: "Tile Size", value: tileSize === "2x4" ? "2' x 4'" : "2' x 2'" },
          { label: "Tiles Needed", value: formatNumber(tilesExact) },
          { label: "Tiles with 5% Extra", value: formatNumber(tilesWithExtra) },
          { label: "Main Runners (12')", value: formatNumber(mainRunners12ft) },
          { label: "4' Cross Tees", value: formatNumber(crossTees4ft) },
        ];

        if (crossTees2ft > 0) {
          details.push({ label: "2' Cross Tees", value: formatNumber(crossTees2ft) });
        }

        details.push(
          { label: "Wall Angle (12')", value: formatNumber(wallAngle12ft) },
          { label: "Hanger Wires", value: formatNumber(hangerWires) },
        );

        if (costPerTile) {
          const tileCost = tilesWithExtra * costPerTile;
          const gridCost = mainRunners12ft * 8 + crossTees4ft * 2 + crossTees2ft * 1.5 + wallAngle12ft * 5;
          const hangerCost = hangerWires * 0.5;
          const totalCost = tileCost + gridCost + hangerCost;
          details.push({ label: "Tile Cost", value: `$${formatNumber(tileCost, 2)}` });
          details.push({ label: "Grid & Hardware", value: `$${formatNumber(gridCost + hangerCost, 2)}` });
          details.push({ label: "Estimated Total", value: `$${formatNumber(totalCost, 2)}` });
          details.push({ label: "Cost per sq ft", value: `$${formatNumber(totalCost / areaSqFt, 2)}` });
        }

        return {
          primary: { label: "Ceiling Tiles Needed", value: `${formatNumber(tilesWithExtra)} tiles (${tileSize === "2x4" ? "2'x4'" : "2'x2'"})` },
          details,
          note: "Layout assumes full tiles with border cuts as needed. Main runners are spaced 4' apart. Hanger wires are placed every 4' along main runners. Includes 5% extra tiles for cuts and spares.",
        };
      },
    },
  ],
  relatedSlugs: ["drywall-calculator", "square-footage-calculator", "paint-calculator"],
  faq: [
    { question: "How many ceiling tiles do I need?", answer: "Divide the room length by the tile length and width by the tile width, then multiply. For a 20x16 room using 2x4 tiles: (20/4) x (16/2) = 40 tiles. Add 5% for cuts and spares." },
    { question: "How far below the existing ceiling should a drop ceiling be?", answer: "A suspended ceiling should hang at least 3-4 inches below the lowest obstruction (pipes, ducts, joists). This allows room to angle tiles in and out of the grid. Most codes require minimum 7.5 foot finished ceiling height." },
    { question: "What are the components of a drop ceiling grid?", answer: "A drop ceiling grid consists of wall angles (L-shaped perimeter trim), main runners (long T-shaped rails), cross tees (shorter T-shaped rails), hanger wires, and ceiling tiles." },
  ],
  formula: "Tiles = (Room Length / Tile Length) x (Room Width / Tile Width) + 5% extra",
};
