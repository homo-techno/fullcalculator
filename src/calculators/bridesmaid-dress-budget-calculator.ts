import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bridesmaidDressBudgetCalculator: CalculatorDefinition = {
  slug: "bridesmaid-dress-budget-calculator",
  title: "Bridesmaid Dress Budget Calculator",
  description: "Calculate the total cost of bridesmaid dresses including alterations, accessories, and shoes for the entire bridal party.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["bridesmaid dress cost","bridal party budget","bridesmaid outfit","wedding party attire"],
  variants: [{
    id: "standard",
    name: "Bridesmaid Dress Budget",
    description: "Calculate the total cost of bridesmaid dresses including alterations, accessories, and shoes for the entire bridal party.",
    fields: [
      { name: "bridesmaids", label: "Number of Bridesmaids", type: "number", min: 1, max: 15, defaultValue: 5 },
      { name: "dressPrice", label: "Dress Price Per Person ($)", type: "number", min: 50, max: 1000, defaultValue: 180 },
      { name: "alterationCost", label: "Alteration Cost Per Dress ($)", type: "number", min: 0, max: 500, defaultValue: 75 },
      { name: "shoesCost", label: "Shoes Per Person ($)", type: "number", min: 0, max: 300, defaultValue: 65 },
      { name: "accessoryCost", label: "Accessories Per Person ($)", type: "number", min: 0, max: 200, defaultValue: 40 },
    ],
    calculate: (inputs) => {
    const count = inputs.bridesmaids as number;
    const dress = inputs.dressPrice as number;
    const alteration = inputs.alterationCost as number;
    const shoes = inputs.shoesCost as number;
    const accessories = inputs.accessoryCost as number;
    const perPerson = dress + alteration + shoes + accessories;
    const totalDresses = count * dress;
    const totalAlterations = count * alteration;
    const totalShoes = count * shoes;
    const totalAccessories = count * accessories;
    const grandTotal = count * perPerson;
    return {
      primary: { label: "Total Bridal Party Cost", value: "$" + formatNumber(Math.round(grandTotal)) },
      details: [
        { label: "Cost Per Bridesmaid", value: "$" + formatNumber(Math.round(perPerson)) },
        { label: "All Dresses", value: "$" + formatNumber(totalDresses) },
        { label: "All Alterations", value: "$" + formatNumber(totalAlterations) },
        { label: "All Shoes", value: "$" + formatNumber(totalShoes) },
        { label: "All Accessories", value: "$" + formatNumber(totalAccessories) }
      ]
    };
  },
  }],
  relatedSlugs: ["wedding-budget-calculator","groomsmen-cost-calculator","wedding-dress-alteration-cost-calculator"],
  faq: [
    { question: "How much do bridesmaid dresses cost?", answer: "Bridesmaid dresses typically range from $100 to $300 each. Designer options can cost $300 to $600 or more." },
    { question: "Who pays for bridesmaid dresses?", answer: "Traditionally, bridesmaids pay for their own dresses and accessories. Some brides choose to cover these costs as a gift to their bridal party." },
    { question: "Do bridesmaid dresses need alterations?", answer: "Most bridesmaid dresses need some alterations for proper fit. Common adjustments include hemming, taking in the waist, or adjusting straps, costing $50 to $150." },
  ],
  formula: "Per Person = DressPrice + Alterations + Shoes + Accessories; Total = NumberOfBridesmaids x PerPersonCost",
};
