import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const grabBarPlacementCalculator: CalculatorDefinition = {
  slug: "grab-bar-placement-calculator",
  title: "Grab Bar Placement Calculator",
  description: "Determine grab bar height and position for bathrooms.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["grab bar height","grab bar placement","bathroom safety"],
  variants: [{
    id: "standard",
    name: "Grab Bar Placement",
    description: "Determine grab bar height and position for bathrooms.",
    fields: [
      { name: "userHeight", label: "User Height (in)", type: "number", min: 48, max: 84, defaultValue: 66 },
      { name: "location", label: "Location", type: "select", options: [{ value: "shower", label: "Shower" }, { value: "toilet", label: "Toilet" }, { value: "tub", label: "Bathtub" }], defaultValue: "shower" },
      { name: "barLength", label: "Bar Length (in)", type: "select", options: [{ value: "12", label: "12 inch" }, { value: "18", label: "18 inch" }, { value: "24", label: "24 inch" }, { value: "36", label: "36 inch" }], defaultValue: "18" },
    ],
    calculate: (inputs) => {
      const height = inputs.userHeight as number;
      const location = inputs.location as string;
      const barLen = parseInt(inputs.barLength as string);
      if (!height) return null;
      const heightMap: Record<string, number> = { shower: 36, toilet: 33, tub: 34 };
      const baseHeight = heightMap[location] || 34;
      const adjusted = Math.round(baseHeight * (height / 66));
      return {
        primary: { label: "Recommended Height", value: formatNumber(adjusted) + " in" },
        details: [
          { label: "Location", value: location },
          { label: "Bar Length", value: formatNumber(barLen) + " in" },
          { label: "ADA Standard", value: formatNumber(baseHeight) + " in" },
        ],
      };
  },
  }],
  relatedSlugs: ["wheelchair-ramp-calculator","fall-risk-calculator"],
  faq: [
    { question: "How high should a grab bar be in a shower?", answer: "Shower grab bars are typically placed at 33 to 36 inches." },
    { question: "What size grab bar do I need?", answer: "An 18-inch bar works for most bathroom applications." },
  ],
  formula: "Height = Base Height x (User Height / 66)",
};
