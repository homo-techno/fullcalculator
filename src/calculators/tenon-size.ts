import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tenonSizeCalculator: CalculatorDefinition = {
  slug: "tenon-size-calculator",
  title: "Mortise and Tenon Size Calculator",
  description: "Free mortise and tenon size calculator. Determine optimal tenon dimensions based on stock size for strong, well-proportioned joints.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["mortise and tenon calculator", "tenon size calculator", "mortise size calculator", "woodworking joint", "tenon proportions"],
  variants: [
    {
      id: "standard-tenon",
      name: "Standard Mortise and Tenon",
      description: "Calculate tenon dimensions from stock size",
      fields: [
        { name: "stockThickness", label: "Stock Thickness (inches)", type: "number", placeholder: "e.g. 0.75" },
        { name: "stockWidth", label: "Stock Width (inches)", type: "number", placeholder: "e.g. 3" },
        { name: "railLength", label: "Rail Length (inches)", type: "number", placeholder: "e.g. 18" },
        {
          name: "tenonType",
          label: "Tenon Type",
          type: "select",
          options: [
            { label: "Standard (1/3 rule)", value: "standard" },
            { label: "Thick (2/5 rule)", value: "thick" },
            { label: "Haunched", value: "haunched" },
          ],
        },
      ],
      calculate: (inputs) => {
        const stockThickness = inputs.stockThickness as number;
        const stockWidth = inputs.stockWidth as number;
        const railLength = inputs.railLength as number;
        const tenonType = inputs.tenonType as string;
        if (!stockThickness || !stockWidth || !railLength) return null;
        const tenonThickness = tenonType === "thick" ? stockThickness * 2 / 5 : stockThickness / 3;
        const tenonLength = stockWidth * 0.75;
        const tenonWidth = stockWidth - 0.5;
        const shoulderWidth = (stockThickness - tenonThickness) / 2;
        const mortiseDepth = tenonLength + 0.0625;
        const mortiseWidth = tenonThickness;
        const mortiseLength = tenonWidth;
        const haunchDepth = tenonType === "haunched" ? tenonLength / 3 : 0;
        const haunchWidth = tenonType === "haunched" ? stockWidth * 0.25 : 0;
        const overallLength = railLength + 2 * tenonLength;
        return {
          primary: { label: "Tenon Thickness", value: `${formatNumber(tenonThickness, 3)} inches` },
          details: [
            { label: "Tenon Length", value: `${formatNumber(tenonLength, 3)} inches` },
            { label: "Tenon Width", value: `${formatNumber(tenonWidth, 3)} inches` },
            { label: "Shoulder Width", value: `${formatNumber(shoulderWidth, 3)} inches` },
            { label: "Mortise Depth", value: `${formatNumber(mortiseDepth, 3)} inches` },
            { label: "Mortise Width", value: `${formatNumber(mortiseWidth, 3)} inches` },
            { label: "Mortise Length", value: `${formatNumber(mortiseLength, 3)} inches` },
            { label: "Haunch Depth", value: tenonType === "haunched" ? `${formatNumber(haunchDepth, 3)} inches` : "N/A" },
            { label: "Haunch Width", value: tenonType === "haunched" ? `${formatNumber(haunchWidth, 3)} inches` : "N/A" },
            { label: "Overall Rail Length", value: `${formatNumber(overallLength, 3)} inches` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["dovetail-joint-calculator", "dado-joint-calculator", "dowel-spacing-calculator"],
  faq: [
    { question: "What is the rule of thirds for tenons?", answer: "The traditional rule is to make the tenon thickness one-third of the stock thickness, leaving equal-sized shoulders on each side for a balanced, strong joint." },
    { question: "How long should a tenon be?", answer: "A tenon should be about 3/4 of the width of the stock it enters. This provides good glue surface while leaving enough material around the mortise." },
  ],
  formula: "Tenon Thickness = Stock Thickness / 3 | Tenon Length = Stock Width x 0.75 | Shoulder = (Stock - Tenon) / 2",
};
