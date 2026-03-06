import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const groomsmenCostCalculator: CalculatorDefinition = {
  slug: "groomsmen-cost-calculator",
  title: "Groomsmen Cost Calculator",
  description: "Estimate the total cost for outfitting groomsmen including suit rental or purchase, shoes, accessories, and gifts.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["groomsmen cost","groomsmen suit rental","wedding party men","best man attire cost"],
  variants: [{
    id: "standard",
    name: "Groomsmen Cost",
    description: "Estimate the total cost for outfitting groomsmen including suit rental or purchase, shoes, accessories, and gifts.",
    fields: [
      { name: "groomsmen", label: "Number of Groomsmen", type: "number", min: 1, max: 15, defaultValue: 5 },
      { name: "attireOption", label: "Attire Option", type: "select", options: [{ value: "1", label: "Suit Rental" }, { value: "2", label: "Suit Purchase" }, { value: "3", label: "Tuxedo Rental" }], defaultValue: "1" },
      { name: "attireCost", label: "Attire Cost Per Person ($)", type: "number", min: 50, max: 1500, defaultValue: 200 },
      { name: "shoesCost", label: "Shoes Per Person ($)", type: "number", min: 0, max: 400, defaultValue: 70 },
      { name: "accessoryCost", label: "Accessories Per Person ($)", type: "number", min: 0, max: 200, defaultValue: 50 },
      { name: "giftCost", label: "Gift Per Groomsman ($)", type: "number", min: 0, max: 300, defaultValue: 50 },
    ],
    calculate: (inputs) => {
    const count = inputs.groomsmen as number;
    const attire = inputs.attireCost as number;
    const shoes = inputs.shoesCost as number;
    const accessories = inputs.accessoryCost as number;
    const gift = inputs.giftCost as number;
    const perPerson = attire + shoes + accessories + gift;
    const totalAttire = count * attire;
    const totalGifts = count * gift;
    const grandTotal = count * perPerson;
    return {
      primary: { label: "Total Groomsmen Cost", value: "$" + formatNumber(Math.round(grandTotal)) },
      details: [
        { label: "Cost Per Groomsman", value: "$" + formatNumber(Math.round(perPerson)) },
        { label: "All Attire", value: "$" + formatNumber(totalAttire) },
        { label: "All Shoes", value: "$" + formatNumber(count * shoes) },
        { label: "All Accessories", value: "$" + formatNumber(count * accessories) },
        { label: "All Gifts", value: "$" + formatNumber(totalGifts) }
      ]
    };
  },
  }],
  relatedSlugs: ["wedding-budget-calculator","bridesmaid-dress-budget-calculator","wedding-guest-calculator"],
  faq: [
    { question: "How much does a groomsman outfit cost?", answer: "Suit rentals typically cost $150 to $250, while purchased suits range from $200 to $800. Tuxedo rentals average $175 to $300." },
    { question: "Who pays for groomsmen attire?", answer: "Traditionally, groomsmen pay for their own attire. The groom may cover the cost as a gift or split expenses with the wedding party." },
    { question: "Should the groom give gifts to groomsmen?", answer: "Yes, it is customary for the groom to give groomsmen a thank-you gift ranging from $25 to $100 per person." },
  ],
  formula: "Per Groomsman = AttireCost + Shoes + Accessories + Gift; Total = NumberOfGroomsmen x PerPersonCost",
};
