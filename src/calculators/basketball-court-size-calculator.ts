import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const basketballCourtSizeCalculator: CalculatorDefinition = {
  slug: "basketball-court-size-calculator",
  title: "Basketball Court Size Calculator",
  description: "Get court dimensions by basketball court type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["basketball","court","size","dimensions"],
  variants: [{
    id: "standard",
    name: "Basketball Court Size",
    description: "Get court dimensions by basketball court type.",
    fields: [
      { name: "courtType", label: "Court Type", type: "select", options: [{ value: "1", label: "Full NBA" }, { value: "2", label: "Full College" }, { value: "3", label: "Half Court" }, { value: "4", label: "High School" }], defaultValue: "3" },
      { name: "surfaceCost", label: "Surface Cost per Sq Ft ($)", type: "number", min: 1, max: 50, defaultValue: 5 },
    ],
    calculate: (inputs) => {
    const courtType = inputs.courtType as number;
    const surfaceCost = inputs.surfaceCost as number;
    let length = 94;
    let width = 50;
    if (courtType === 2) { length = 94; width = 50; }
    if (courtType === 3) { length = 47; width = 50; }
    if (courtType === 4) { length = 84; width = 50; }
    const area = length * width;
    const cost = area * surfaceCost;
    return {
      primary: { label: "Court Dimensions", value: length + " x " + width + " ft" },
      details: [
        { label: "Total Area", value: formatNumber(area) + " sq ft" },
        { label: "Surface Cost", value: "$" + formatNumber(cost) }
      ]
    };
  },
  }],
  relatedSlugs: ["tennis-court-cost-calculator","batting-cage-size-calculator"],
  faq: [
    { question: "How big is an NBA basketball court?", answer: "An NBA court is 94 feet long by 50 feet wide." },
    { question: "What is the size of a half court?", answer: "A half court is 47 feet long by 50 feet wide." },
  ],
  formula: "Area = Court Length x Court Width; Cost = Area x Surface Cost per Sq Ft",
};
