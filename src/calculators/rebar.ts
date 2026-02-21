import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rebarCalculator: CalculatorDefinition = {
  slug: "rebar-calculator",
  title: "Rebar Calculator",
  description:
    "Free rebar calculator. Estimate bars needed each direction and total linear feet for concrete slabs.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["rebar", "reinforcement", "concrete", "steel", "slab"],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "length",
          label: "Slab Length (feet)",
          type: "number",
          placeholder: "e.g. 20",
        },
        {
          name: "width",
          label: "Slab Width (feet)",
          type: "number",
          placeholder: "e.g. 20",
        },
        {
          name: "spacing",
          label: "Bar Spacing",
          type: "select",
          options: [
            { label: '12" on center', value: "12" },
            { label: '18" on center', value: "18" },
          ],
        },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const spacing = inputs.spacing as string;
        if (!length || !width || !spacing) return null;

        const spacingFt = Number(spacing) / 12;

        // Bars running along the length (spaced across the width)
        const barsAlongLength = Math.floor(width / spacingFt) + 1;
        // Bars running along the width (spaced across the length)
        const barsAlongWidth = Math.floor(length / spacingFt) + 1;

        const totalBars = barsAlongLength + barsAlongWidth;
        const linearFeetLength = barsAlongLength * length;
        const linearFeetWidth = barsAlongWidth * width;
        const totalLinearFeet = linearFeetLength + linearFeetWidth;

        // Standard rebar comes in 20 ft lengths
        const standardBarLength = 20;
        const barsToOrder = Math.ceil(totalLinearFeet / standardBarLength);

        return {
          primary: {
            label: "Total Linear Feet of Rebar",
            value: formatNumber(totalLinearFeet, 0) + " ft",
          },
          details: [
            { label: "Bars Along Length", value: String(barsAlongLength) + " (each " + length + " ft)" },
            { label: "Bars Along Width", value: String(barsAlongWidth) + " (each " + width + " ft)" },
            { label: "Total Bars", value: String(totalBars) },
            { label: "20-ft Bars to Order", value: String(barsToOrder) },
            { label: "Spacing", value: spacing + '" on center' },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["concrete-calculator", "mortar-calculator"],
  faq: [
    {
      question: "What spacing should I use for rebar?",
      answer:
        "12 inches on center is common for driveways and structural slabs. 18 inches on center works for patios and walkways.",
    },
    {
      question: "What size rebar for a residential slab?",
      answer:
        "Number 4 rebar (1/2-inch diameter) is most common for residential concrete slabs and footings.",
    },
  ],
  formula:
    "Bars Each Direction = (Perpendicular Dimension ÷ Spacing) + 1. Linear Feet = Sum of (Bars × Bar Length) for each direction.",
};
