import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cakePanSizeCalculator: CalculatorDefinition = {
  slug: "cake-pan-size-calculator",
  title: "Cake Pan Size Converter",
  description:
    "Free cake pan size converter. Convert cake recipes between different pan sizes and shapes. Calculate batter volume adjustments.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "cake pan size converter",
    "cake pan substitution",
    "baking pan conversion",
    "cake pan volume",
    "round to square cake pan",
    "cake recipe adjustment",
  ],
  variants: [
    {
      id: "convert",
      name: "Convert Pan Size",
      description: "Calculate recipe adjustments when changing pan sizes",
      fields: [
        {
          name: "fromShape",
          label: "Original Pan Shape",
          type: "select",
          options: [
            { label: "Round", value: "round" },
            { label: "Square", value: "square" },
            { label: "Rectangle (9x13)", value: "rect_9x13" },
            { label: "Rectangle (11x7)", value: "rect_11x7" },
          ],
        },
        {
          name: "fromSize",
          label: "Original Pan Size (inches)",
          type: "select",
          options: [
            { label: "6 inch", value: "6" },
            { label: "8 inch", value: "8" },
            { label: "9 inch", value: "9" },
            { label: "10 inch", value: "10" },
            { label: "12 inch", value: "12" },
          ],
        },
        {
          name: "toShape",
          label: "New Pan Shape",
          type: "select",
          options: [
            { label: "Round", value: "round" },
            { label: "Square", value: "square" },
            { label: "Rectangle (9x13)", value: "rect_9x13" },
            { label: "Rectangle (11x7)", value: "rect_11x7" },
          ],
        },
        {
          name: "toSize",
          label: "New Pan Size (inches)",
          type: "select",
          options: [
            { label: "6 inch", value: "6" },
            { label: "8 inch", value: "8" },
            { label: "9 inch", value: "9" },
            { label: "10 inch", value: "10" },
            { label: "12 inch", value: "12" },
          ],
        },
      ],
      calculate: (inputs) => {
        const fromShape = inputs.fromShape as string;
        const fromSize = parseFloat(inputs.fromSize as string);
        const toShape = inputs.toShape as string;
        const toSize = parseFloat(inputs.toSize as string);
        if (!fromShape || !fromSize || !toShape || !toSize) return null;

        const getArea = (shape: string, size: number): number => {
          if (shape === "round") return Math.PI * (size / 2) * (size / 2);
          if (shape === "square") return size * size;
          if (shape === "rect_9x13") return 9 * 13;
          if (shape === "rect_11x7") return 11 * 7;
          return size * size;
        };

        const fromArea = getArea(fromShape, fromSize);
        const toArea = getArea(toShape, toSize);
        const scaleFactor = toArea / fromArea;

        const fromShapeName = fromShape === "round" ? "Round" : fromShape === "square" ? "Square" : fromShape === "rect_9x13" ? "9x13 Rectangle" : "11x7 Rectangle";
        const toShapeName = toShape === "round" ? "Round" : toShape === "square" ? "Square" : toShape === "rect_9x13" ? "9x13 Rectangle" : "11x7 Rectangle";

        return {
          primary: {
            label: "Recipe Multiplier",
            value: formatNumber(scaleFactor, 2) + "x",
          },
          details: [
            { label: "Original Pan", value: fromSize + '" ' + fromShapeName },
            { label: "Original Area", value: formatNumber(fromArea, 1) + " sq in" },
            { label: "New Pan", value: toSize + '" ' + toShapeName },
            { label: "New Area", value: formatNumber(toArea, 1) + " sq in" },
            { label: "Multiply All Ingredients By", value: formatNumber(scaleFactor, 2) },
            { label: "Bake Time Adjustment", value: scaleFactor > 1.1 ? "Add 5-10 min" : scaleFactor < 0.9 ? "Reduce 5-10 min" : "Same time" },
          ],
          note: scaleFactor > 1.5 || scaleFactor < 0.5
            ? "Large scaling factor. Consider using a different pan size for better results."
            : undefined,
        };
      },
    },
  ],
  relatedSlugs: ["baking-conversion-calculator", "bread-recipe-calculator"],
  faq: [
    {
      question: "Can I substitute a round pan for a square pan?",
      answer:
        "Yes. A round pan has about 78.5% of the area of a square pan of the same size. So an 8-inch round pan has an area of about 50 sq in, while an 8-inch square pan has 64 sq in. Adjust your recipe by the ratio of the areas.",
    },
    {
      question: "How do I adjust baking time for different pan sizes?",
      answer:
        "When using a larger pan, the batter will be thinner and may bake faster (reduce time by 5-10 minutes). When using a smaller pan, the batter will be thicker and take longer (add 5-10 minutes). Always check for doneness with a toothpick.",
    },
    {
      question: "What size pan should I use for a 9x13 recipe?",
      answer:
        "A 9x13 rectangle has an area of 117 sq in. Two 9-inch round pans (127 sq in total) or two 8-inch square pans (128 sq in total) are close substitutes. You can split the batter between two pans for a layer cake.",
    },
  ],
  formula:
    "Scale Factor = New Pan Area / Original Pan Area. Round area = \u03C0 x (diameter/2)\u00B2. Square area = side\u00B2. Multiply all ingredient quantities by the scale factor. Adjust bake time +/- 5-10 minutes based on batter thickness.",
};
