import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cakeServingCalculator: CalculatorDefinition = {
  slug: "cake-serving-calculator",
  title: "Cake Serving Size Calculator",
  description:
    "Free cake serving calculator. Determine how many servings you can get from different cake sizes and shapes.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "cake serving",
    "cake size",
    "cake portions",
    "party cake",
    "wedding cake servings",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "shape",
          label: "Cake Shape",
          type: "select",
          options: [
            { label: "Round", value: "round" },
            { label: "Square", value: "square" },
            { label: "Sheet (Rectangle)", value: "sheet" },
          ],
        },
        {
          name: "size",
          label: "Cake Size (inches)",
          type: "select",
          options: [
            { label: "6 inch", value: "6" },
            { label: "8 inch", value: "8" },
            { label: "9 inch", value: "9" },
            { label: "10 inch", value: "10" },
            { label: "12 inch", value: "12" },
            { label: "14 inch", value: "14" },
          ],
        },
        {
          name: "layers",
          label: "Number of Layers",
          type: "select",
          options: [
            { label: "1 Layer", value: "1" },
            { label: "2 Layers", value: "2" },
            { label: "3 Layers", value: "3" },
            { label: "4 Layers", value: "4" },
          ],
        },
      ],
      calculate: (inputs) => {
        const shape = inputs.shape as string;
        const size = parseFloat(inputs.size as string) || 8;
        const layers = parseFloat(inputs.layers as string) || 2;
        if (!size) return null;

        let area: number;
        if (shape === "round") {
          area = Math.PI * Math.pow(size / 2, 2);
        } else if (shape === "square") {
          area = size * size;
        } else {
          area = size * (size * 1.5);
        }

        const servingArea = 4;
        const baseServings = Math.floor(area / servingArea);
        const layerMultiplier = layers >= 3 ? 1 + (layers - 2) * 0.25 : 1;
        const totalServings = Math.round(baseServings * layerMultiplier);
        const partyServings = Math.round(totalServings * 1.3);
        const batterCups = Math.round(area * layers * 0.04 * 10) / 10;
        const frostingCups = Math.round((layers + 1) * area * 0.015 * 10) / 10;

        return {
          primary: {
            label: "Standard Servings",
            value: String(totalServings),
          },
          details: [
            { label: "Party-Size Servings", value: String(partyServings) },
            { label: "Cake Shape", value: shape.charAt(0).toUpperCase() + shape.slice(1) },
            { label: "Cake Size", value: size + " inches" },
            { label: "Layers", value: String(layers) },
            { label: "Batter Needed (approx)", value: formatNumber(batterCups, 1) + " cups" },
            { label: "Frosting Needed (approx)", value: formatNumber(frostingCups, 1) + " cups" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cake-pan-size-calculator", "party-food-calculator"],
  faq: [
    {
      question: "How many servings does a 9 inch cake have?",
      answer:
        "A 2-layer 9-inch round cake typically provides 16-20 standard servings. For party-sized (smaller) slices, you can get up to 24 servings.",
    },
    {
      question: "How do I cut a round cake into equal servings?",
      answer:
        "For a round cake, cut across the center first, then make parallel cuts about 1-1.5 inches apart. Then cut perpendicular lines to create rectangular portions.",
    },
  ],
  formula:
    "Round area = π × (d/2)². Square area = d². Servings = area / 4 sq inches per serving. Party servings are approximately 30% more than standard due to smaller slice size.",
};
