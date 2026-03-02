import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const battingCageSizeCalculator: CalculatorDefinition = {
  slug: "batting-cage-size-calculator",
  title: "Batting Cage Size Calculator",
  description: "Determine batting cage dimensions for your space.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["batting","cage","size","baseball"],
  variants: [{
    id: "standard",
    name: "Batting Cage Size",
    description: "Determine batting cage dimensions for your space.",
    fields: [
      { name: "cageType", label: "Cage Type", type: "select", options: [{ value: "1", label: "Softball" }, { value: "2", label: "Baseball" }, { value: "3", label: "Youth" }], defaultValue: "2" },
      { name: "cages", label: "Number of Cages", type: "number", min: 1, max: 10, defaultValue: 1 },
    ],
    calculate: (inputs) => {
    const cageType = inputs.cageType as number;
    const cages = inputs.cages as number;
    let length = 70;
    let width = 14;
    let height = 12;
    if (cageType === 1) { length = 55; width = 14; height = 12; }
    if (cageType === 3) { length = 50; width = 12; height = 10; }
    const totalWidth = width * cages;
    const area = length * totalWidth;
    return {
      primary: { label: "Cage Dimensions", value: length + " x " + width + " x " + height + " ft" },
      details: [
        { label: "Total Width for All Cages", value: formatNumber(totalWidth) + " ft" },
        { label: "Total Footprint", value: formatNumber(area) + " sq ft" }
      ]
    };
  },
  }],
  relatedSlugs: ["basketball-court-size-calculator","archery-range-calculator"],
  faq: [
    { question: "How long should a batting cage be?", answer: "A standard baseball batting cage is 70 feet long." },
    { question: "How wide is a batting cage?", answer: "A standard batting cage is 12 to 14 feet wide." },
  ],
  formula: "Cage Length varies by type; Total Width = Cage Width x Number of Cages",
};
