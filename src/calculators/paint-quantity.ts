import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const paintQuantityCalculator: CalculatorDefinition = {
  slug: "paint-quantity-calculator",
  title: "Paint Quantity Calculator",
  description: "Free paint quantity calculator. Calculate exactly how many gallons of paint you need for a room based on dimensions, coats, doors, and windows.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["paint quantity calculator", "how many gallons of paint", "paint gallon calculator", "room paint estimator", "paint amount calculator"],
  variants: [
    {
      id: "calc",
      name: "Calculate Paint Quantity",
      description: "Calculate gallons of paint for your room",
      fields: [
        { name: "length", label: "Room Length (ft)", type: "number", placeholder: "e.g. 15" },
        { name: "width", label: "Room Width (ft)", type: "number", placeholder: "e.g. 12" },
        { name: "height", label: "Wall Height (ft)", type: "number", placeholder: "e.g. 8", defaultValue: 8 },
        { name: "coats", label: "Number of Coats", type: "select", options: [
          { label: "1 coat (touch-up)", value: "1" },
          { label: "2 coats (standard)", value: "2" },
          { label: "3 coats (color change)", value: "3" },
        ], defaultValue: "2" },
        { name: "doors", label: "Number of Doors", type: "number", placeholder: "e.g. 2", defaultValue: 1 },
        { name: "windows", label: "Number of Windows", type: "number", placeholder: "e.g. 2", defaultValue: 2 },
        { name: "pricePerGallon", label: "Price per Gallon (optional)", type: "number", placeholder: "e.g. 40", prefix: "$" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const height = (inputs.height as number) || 8;
        const coats = parseInt(inputs.coats as string) || 2;
        const doors = (inputs.doors as number) || 0;
        const windows = (inputs.windows as number) || 0;
        const pricePerGallon = inputs.pricePerGallon as number;
        if (!length || !width) return null;

        const perimeter = 2 * (length + width);
        const grossWallArea = perimeter * height;
        const doorArea = doors * 20; // 20 sq ft per door
        const windowArea = windows * 15; // 15 sq ft per window
        const netWallArea = grossWallArea - doorArea - windowArea;
        const totalCoverageNeeded = netWallArea * coats;
        const coveragePerGallon = 350; // sq ft
        const gallonsExact = totalCoverageNeeded / coveragePerGallon;
        const gallonsRounded = Math.ceil(gallonsExact);

        // Quarts for small amounts
        const quartsExact = gallonsExact * 4;

        const details: { label: string; value: string }[] = [
          { label: "Room dimensions", value: `${length} ft x ${width} ft x ${height} ft` },
          { label: "Wall perimeter", value: `${formatNumber(perimeter)} ft` },
          { label: "Gross wall area", value: `${formatNumber(grossWallArea)} sq ft` },
          { label: "Door area deducted", value: `${doors} doors x 20 sq ft = ${formatNumber(doorArea)} sq ft` },
          { label: "Window area deducted", value: `${windows} windows x 15 sq ft = ${formatNumber(windowArea)} sq ft` },
          { label: "Net paintable area", value: `${formatNumber(netWallArea)} sq ft` },
          { label: "Coats", value: `${coats}` },
          { label: "Total coverage needed", value: `${formatNumber(totalCoverageNeeded)} sq ft` },
          { label: "Exact gallons", value: formatNumber(gallonsExact, 2) },
        ];

        if (pricePerGallon) {
          const totalCost = gallonsRounded * pricePerGallon;
          details.push({ label: "Estimated cost", value: `$${formatNumber(totalCost, 2)}` });
        }

        return {
          primary: { label: "Paint Needed", value: `${gallonsRounded} gallon${gallonsRounded !== 1 ? "s" : ""}` },
          details,
          note: `Based on 350 sq ft coverage per gallon. Standard door opening = 20 sq ft, window = 15 sq ft. Buy a little extra for touch-ups. ${gallonsExact < 1 ? `Consider buying ${Math.ceil(quartsExact)} quart(s) instead of a full gallon.` : ""}`,
        };
      },
    },
  ],
  relatedSlugs: ["paint-calculator", "wallpaper-rolls-calculator", "square-footage-calculator"],
  faq: [
    { question: "How many gallons of paint for a 12x12 room?", answer: "A 12x12 room with 8-foot ceilings has about 384 sq ft of wall area. Minus 1 door (20 sq ft) and 2 windows (30 sq ft) = 334 sq ft. With 2 coats, you need 668 sq ft of coverage, or about 2 gallons (at 350 sq ft per gallon)." },
    { question: "How much area does one gallon of paint cover?", answer: "One gallon of quality interior paint covers approximately 350-400 square feet per coat on smooth surfaces. Textured walls, bare drywall, or porous surfaces may reduce coverage to 250-300 sq ft per gallon." },
    { question: "Should I get 2 or 3 coats of paint?", answer: "Two coats are standard for most paint jobs. Use 3 coats when making a dramatic color change (light to dark or dark to light), painting over patches and repairs, or covering stains. Use a tinted primer for color changes instead of extra coats." },
  ],
  formula: "Gallons = (2(L+W) x H - Doors x 20 - Windows x 15) x Coats / 350",
};
