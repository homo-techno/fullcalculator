import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const garageDoorCostCalculator: CalculatorDefinition = {
  slug: "garage-door-cost-calculator",
  title: "Garage Door Cost Calculator",
  description: "Free garage door cost calculator. Estimate the cost of garage door replacement or installation including the door, opener, and labor.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["garage door cost", "garage door replacement cost", "garage door installation", "garage door price", "how much for a garage door"],
  variants: [
    {
      id: "replacement",
      name: "Garage Door Replacement",
      fields: [
        { name: "doorSize", label: "Door Size", type: "select", options: [
          { label: "Single (8×7 ft)", value: "single" },
          { label: "Single wide (9×7 ft)", value: "single_wide" },
          { label: "Double (16×7 ft)", value: "double" },
          { label: "Double tall (16×8 ft)", value: "double_tall" },
        ], defaultValue: "double" },
        { name: "material", label: "Door Material", type: "select", options: [
          { label: "Steel (non-insulated) - $600-$1,200", value: "900" },
          { label: "Steel (insulated) - $800-$2,000", value: "1400" },
          { label: "Wood - $1,200-$3,500", value: "2200" },
          { label: "Aluminum/glass - $1,500-$4,000", value: "2500" },
          { label: "Composite - $1,000-$3,000", value: "2000" },
          { label: "Fiberglass - $900-$2,500", value: "1700" },
        ], defaultValue: "1400" },
        { name: "opener", label: "Garage Door Opener", type: "select", options: [
          { label: "Keep existing", value: "0" },
          { label: "Chain drive ($150-$250)", value: "200" },
          { label: "Belt drive ($200-$400)", value: "300" },
          { label: "Smart opener ($300-$600)", value: "450" },
        ], defaultValue: "300" },
        { name: "insulation", label: "Insulation Level", type: "select", options: [
          { label: "None (single layer)", value: "1.0" },
          { label: "Standard (polystyrene)", value: "1.1" },
          { label: "Premium (polyurethane)", value: "1.25" },
        ], defaultValue: "1.1" },
        { name: "windows", label: "Window Inserts", type: "select", options: [
          { label: "No windows", value: "0" },
          { label: "Standard windows ($50-100/panel)", value: "300" },
          { label: "Decorative windows ($100-200/panel)", value: "600" },
        ], defaultValue: "0" },
      ],
      calculate: (inputs) => {
        const doorSize = inputs.doorSize as string;
        const baseDoorCost = parseInt(inputs.material as string) || 1400;
        const openerCost = parseInt(inputs.opener as string) || 0;
        const insulationFactor = parseFloat(inputs.insulation as string) || 1.0;
        const windowCost = parseInt(inputs.windows as string) || 0;
        let sizeFactor: number;
        let sizeLabel: string;
        if (doorSize === "single") { sizeFactor = 0.7; sizeLabel = "8×7 ft (single)"; }
        else if (doorSize === "single_wide") { sizeFactor = 0.8; sizeLabel = "9×7 ft (single wide)"; }
        else if (doorSize === "double_tall") { sizeFactor = 1.15; sizeLabel = "16×8 ft (double tall)"; }
        else { sizeFactor = 1.0; sizeLabel = "16×7 ft (double)"; }
        const doorCost = baseDoorCost * sizeFactor * insulationFactor;
        const laborCost = doorSize.includes("single") ? 300 : 450;
        const removalCost = 75;
        const hardwareCost = 150;
        const totalCost = doorCost + openerCost + laborCost + removalCost + hardwareCost + windowCost;
        return {
          primary: { label: "Estimated Total Cost", value: `$${formatNumber(totalCost)}` },
          details: [
            { label: "Door cost", value: `$${formatNumber(doorCost)}` },
            { label: "Door size", value: sizeLabel },
            { label: "Opener", value: openerCost > 0 ? `$${formatNumber(openerCost)}` : "Keeping existing" },
            { label: "Windows", value: windowCost > 0 ? `$${formatNumber(windowCost)}` : "None" },
            { label: "Installation labor", value: `$${formatNumber(laborCost)}` },
            { label: "Old door removal", value: `$${formatNumber(removalCost)}` },
            { label: "Hardware (springs, tracks)", value: `$${formatNumber(hardwareCost)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["door-replacement-cost-calculator", "driveway-cost-calculator", "window-replacement-cost-calculator"],
  faq: [
    { question: "How much does a garage door cost to replace?", answer: "Single door: $800-$3,000 installed. Double door: $1,200-$5,000+ installed. Steel insulated doors are the most popular ($1,200-$2,500 for a double). Adding a new opener adds $200-$600. Premium materials like wood or aluminum/glass cost significantly more." },
  ],
  formula: "Total = (Door Cost × Size Factor × Insulation) + Opener + Windows + Labor + Removal + Hardware",
};
