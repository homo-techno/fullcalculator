import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const roomPaintCostCalculator: CalculatorDefinition = {
  slug: "room-paint-cost-calculator",
  title: "Room Paint Cost Calculator",
  description: "Free room paint cost calculator. Estimate total cost for painting a room including paint, primer, supplies, and labor.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["room paint cost", "painting cost calculator", "how much to paint a room", "paint cost estimator", "interior painting cost"],
  variants: [
    {
      id: "room",
      name: "Room Paint Cost",
      fields: [
        { name: "length", label: "Room Length (feet)", type: "number", placeholder: "e.g. 15" },
        { name: "width", label: "Room Width (feet)", type: "number", placeholder: "e.g. 12" },
        { name: "height", label: "Wall Height (feet)", type: "number", placeholder: "e.g. 8", defaultValue: 8 },
        { name: "doors", label: "Number of Doors", type: "number", placeholder: "e.g. 2", defaultValue: 1 },
        { name: "windows", label: "Number of Windows", type: "number", placeholder: "e.g. 2", defaultValue: 2 },
        { name: "coats", label: "Number of Coats", type: "select", options: [
          { label: "1 coat", value: "1" },
          { label: "2 coats (recommended)", value: "2" },
          { label: "3 coats", value: "3" },
        ], defaultValue: "2" },
        { name: "paintGrade", label: "Paint Grade", type: "select", options: [
          { label: "Economy ($25/gallon)", value: "25" },
          { label: "Standard ($40/gallon)", value: "40" },
          { label: "Premium ($60/gallon)", value: "60" },
          { label: "Ultra Premium ($80/gallon)", value: "80" },
        ], defaultValue: "40" },
        { name: "includeLabor", label: "Include Labor?", type: "select", options: [
          { label: "DIY (no labor)", value: "0" },
          { label: "Professional ($2/sq ft)", value: "2" },
          { label: "Premium contractor ($4/sq ft)", value: "4" },
        ], defaultValue: "0" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const height = (inputs.height as number) || 8;
        const doors = (inputs.doors as number) || 0;
        const windows = (inputs.windows as number) || 0;
        const coats = parseInt(inputs.coats as string) || 2;
        const paintPrice = parseInt(inputs.paintGrade as string) || 40;
        const laborRate = parseInt(inputs.includeLabor as string) || 0;
        if (!length || !width) return null;
        const perimeter = 2 * (length + width);
        const wallArea = perimeter * height;
        const doorArea = doors * 21; // ~3x7 ft per door
        const windowArea = windows * 15; // ~3x5 ft per window
        const paintableArea = wallArea - doorArea - windowArea;
        const coveragePerGallon = 350; // sq ft per gallon
        const gallonsPerCoat = paintableArea / coveragePerGallon;
        const totalGallons = Math.ceil(gallonsPerCoat * coats);
        const paintCost = totalGallons * paintPrice;
        const supplies = 35 + (paintableArea > 400 ? 20 : 0); // tape, rollers, brushes, drop cloths
        const laborCost = laborRate * paintableArea;
        const totalCost = paintCost + supplies + laborCost;
        const details = [
          { label: "Paintable wall area", value: `${formatNumber(paintableArea, 0)} sq ft` },
          { label: "Gallons needed", value: `${totalGallons}` },
          { label: "Paint cost", value: `$${formatNumber(paintCost)}` },
          { label: "Supplies (tape, rollers, etc.)", value: `$${formatNumber(supplies)}` },
        ];
        if (laborCost > 0) {
          details.push({ label: "Labor cost", value: `$${formatNumber(laborCost)}` });
        }
        details.push({ label: "Number of coats", value: `${coats}` });
        return {
          primary: { label: "Total Estimated Cost", value: `$${formatNumber(totalCost)}` },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["paint-calculator", "square-footage-calculator", "tile-calculator"],
  faq: [
    { question: "How much does it cost to paint a room?", answer: "DIY painting a 12x12 room typically costs $100-$300 for paint and supplies. Professional painting costs $300-$800+ depending on room size, paint quality, and your location. Two coats of quality paint over primer gives the best results." },
  ],
  formula: "Paint Gallons = (Wall Area - Doors - Windows) × Coats / 350 | Total Cost = Paint + Supplies + Labor",
};
