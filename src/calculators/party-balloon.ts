import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const partyBalloonCalculator: CalculatorDefinition = {
  slug: "party-balloon",
  title: "Party Balloon Calculator",
  description: "Free party balloon calculator. Determine how many balloons, helium tanks, and ribbon you need for your party or event decoration.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["party balloons", "helium calculator", "balloon quantity", "party decorations", "balloon arch"],
  variants: [
    {
      id: "generalDecor",
      name: "General Party Decor",
      fields: [
        { name: "tableCount", label: "Number of Tables", type: "number", placeholder: "e.g. 10" },
        { name: "balloonsPerTable", label: "Balloons Per Table", type: "number", placeholder: "e.g. 3" },
        { name: "entranceBalloons", label: "Entrance/Arch Balloons", type: "number", placeholder: "e.g. 50" },
        { name: "ceilingBalloons", label: "Ceiling/Floating Balloons", type: "number", placeholder: "e.g. 30" },
        { name: "balloonType", label: "Balloon Type", type: "select", options: [
          { label: "Standard Latex (11 in)", value: "standard" },
          { label: "Large Latex (17 in)", value: "large" },
          { label: "Foil/Mylar", value: "foil" },
          { label: "Mixed", value: "mixed" },
        ] },
        { name: "costPerBalloon", label: "Cost Per Balloon ($)", type: "number", placeholder: "e.g. 1.50" },
      ],
      calculate: (inputs) => {
        const tableCount = (inputs.tableCount as number) || 0;
        const balloonsPerTable = (inputs.balloonsPerTable as number) || 3;
        const entranceBalloons = (inputs.entranceBalloons as number) || 0;
        const ceilingBalloons = (inputs.ceilingBalloons as number) || 0;
        const balloonType = (inputs.balloonType as string) || "standard";
        const costPerBalloon = (inputs.costPerBalloon as number) || 1.5;
        const tableBalloons = tableCount * balloonsPerTable;
        const totalBalloons = tableBalloons + entranceBalloons + ceilingBalloons;
        if (totalBalloons <= 0) return null;
        const buffer = Math.ceil(totalBalloons * 0.15);
        const orderTotal = totalBalloons + buffer;
        const heliumFactor = balloonType === "large" ? 0.5 : balloonType === "foil" ? 0.4 : balloonType === "mixed" ? 0.42 : 0.35;
        const heliumTanks = Math.ceil(orderTotal * heliumFactor / 14.9);
        const ribbonFeet = orderTotal * 4;
        const totalCost = orderTotal * costPerBalloon;
        return {
          primary: { label: "Total Balloons to Order", value: formatNumber(orderTotal) },
          details: [
            { label: "Table Balloons", value: formatNumber(tableBalloons) },
            { label: "Entrance/Arch Balloons", value: formatNumber(entranceBalloons) },
            { label: "Ceiling Balloons", value: formatNumber(ceilingBalloons) },
            { label: "Buffer (15%)", value: formatNumber(buffer) },
            { label: "Helium Tanks Needed", value: formatNumber(heliumTanks) },
            { label: "Ribbon Needed (ft)", value: formatNumber(ribbonFeet) },
            { label: "Estimated Cost", value: "$" + formatNumber(totalCost, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["event-space-capacity", "wedding-seating", "event-rental"],
  faq: [
    { question: "How many balloons for a balloon arch?", answer: "A standard balloon arch (8-10 feet) requires about 100-150 balloons. A full entrance arch may need 200-300 balloons depending on size and density." },
    { question: "How long do helium balloons last?", answer: "Standard latex helium balloons last 8-12 hours. Foil/mylar balloons can last 3-5 days. Using Hi-Float can extend latex balloon life to 2-3 days." },
  ],
  formula: "Total Balloons = (Table Balloons + Entrance + Ceiling) x 1.15 (15% buffer)",
};
