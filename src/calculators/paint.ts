import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const paintCalculator: CalculatorDefinition = {
  slug: "paint-calculator",
  title: "Paint Calculator",
  description: "Free paint calculator. Calculate how much paint you need for walls, ceilings, and rooms. Estimate gallons and cost for your painting project.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["paint calculator", "how much paint do I need", "wall paint calculator", "room paint calculator", "paint estimator"],
  variants: [
    {
      id: "room",
      name: "Room Paint Calculator",
      description: "Calculate paint needed for a rectangular room (walls)",
      fields: [
        { name: "length", label: "Room Length (feet)", type: "number", placeholder: "e.g. 14" },
        { name: "width", label: "Room Width (feet)", type: "number", placeholder: "e.g. 12" },
        { name: "height", label: "Wall Height (feet)", type: "number", placeholder: "e.g. 8", defaultValue: 8 },
        { name: "doors", label: "Number of Doors", type: "number", placeholder: "e.g. 2", defaultValue: 1 },
        { name: "windows", label: "Number of Windows", type: "number", placeholder: "e.g. 2", defaultValue: 2 },
        { name: "coats", label: "Number of Coats", type: "select", options: [
          { label: "1 coat", value: "1" },
          { label: "2 coats (recommended)", value: "2" },
          { label: "3 coats", value: "3" },
        ], defaultValue: "2" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const height = (inputs.height as number) || 8;
        const doors = (inputs.doors as number) || 0;
        const windows = (inputs.windows as number) || 0;
        const coats = parseInt(inputs.coats as string) || 2;
        if (!length || !width) return null;

        const perimeter = 2 * (length + width);
        const wallArea = perimeter * height;
        const doorArea = doors * 21;
        const windowArea = windows * 15;
        const paintableArea = wallArea - doorArea - windowArea;
        const totalArea = paintableArea * coats;
        const gallons = totalArea / 350;
        const gallonsRounded = Math.ceil(gallons);

        return {
          primary: { label: "Paint Needed", value: `${gallonsRounded} gallon${gallonsRounded > 1 ? "s" : ""}` },
          details: [
            { label: "Exact amount", value: `${formatNumber(gallons, 1)} gallons` },
            { label: "Paintable wall area", value: `${formatNumber(paintableArea)} sq ft` },
            { label: "Total coverage needed", value: `${formatNumber(totalArea)} sq ft (${coats} coat${coats > 1 ? "s" : ""})` },
            { label: "Gross wall area", value: `${formatNumber(wallArea)} sq ft` },
            { label: "Deducted (doors+windows)", value: `${formatNumber(doorArea + windowArea)} sq ft` },
          ],
          note: "Based on 350 sq ft coverage per gallon. Standard door = 21 sq ft, window = 15 sq ft. Buy slightly more for touchups.",
        };
      },
    },
    {
      id: "wall",
      name: "Single Wall / Area",
      description: "Calculate paint for a custom wall area",
      fields: [
        { name: "area", label: "Area to Paint (sq ft)", type: "number", placeholder: "e.g. 200" },
        { name: "coats", label: "Number of Coats", type: "select", options: [
          { label: "1 coat", value: "1" }, { label: "2 coats", value: "2" }, { label: "3 coats", value: "3" },
        ], defaultValue: "2" },
        { name: "pricePerGallon", label: "Price per Gallon (optional)", type: "number", placeholder: "e.g. 35", prefix: "$" },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const coats = parseInt(inputs.coats as string) || 2;
        const price = inputs.pricePerGallon as number;
        if (!area) return null;

        const totalArea = area * coats;
        const gallons = totalArea / 350;
        const gallonsRounded = Math.ceil(gallons);

        const details = [
          { label: "Exact gallons", value: formatNumber(gallons, 1) },
          { label: "Total coverage", value: `${formatNumber(totalArea)} sq ft` },
          { label: "Coats", value: `${coats}` },
        ];
        if (price) {
          details.push({ label: "Estimated cost", value: `$${formatNumber(gallonsRounded * price)}` });
        }

        return {
          primary: { label: "Paint Needed", value: `${gallonsRounded} gallon${gallonsRounded > 1 ? "s" : ""}` },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["square-footage-calculator", "concrete-calculator", "unit-converter"],
  faq: [
    { question: "How much area does a gallon of paint cover?", answer: "One gallon of paint covers approximately 350-400 square feet with one coat. Coverage varies by paint quality, surface texture, and application method. Most walls need 2 coats." },
    { question: "How do I calculate how much paint I need?", answer: "Measure the room perimeter (2 × length + 2 × width), multiply by wall height, subtract doors (21 sq ft each) and windows (15 sq ft each), multiply by number of coats, divide by 350." },
  ],
  formula: "Gallons = (Wall Area - Doors - Windows) × Coats / 350",
};
