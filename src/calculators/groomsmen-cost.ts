import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const groomsmenCostCalculator: CalculatorDefinition = {
  slug: "groomsmen-cost",
  title: "Groomsmen Cost Calculator",
  description: "Free groomsmen cost calculator. Estimate the total cost of being a groomsman including suit, shoes, accessories, bachelor party, and travel.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["groomsmen cost", "groomsman budget", "best man cost", "wedding party cost", "groomsman expenses"],
  variants: [
    {
      id: "detailed",
      name: "Detailed Cost Breakdown",
      fields: [
        { name: "suitOption", label: "Suit Option", type: "select", options: [
          { label: "Rental", value: "rental" },
          { label: "Purchase", value: "purchase" },
        ] },
        { name: "suitCost", label: "Suit/Tux Cost ($)", type: "number", placeholder: "e.g. 200" },
        { name: "shoes", label: "Shoes ($)", type: "number", placeholder: "e.g. 80" },
        { name: "accessories", label: "Accessories (tie, cufflinks) ($)", type: "number", placeholder: "e.g. 50" },
        { name: "grooming", label: "Grooming/Haircut ($)", type: "number", placeholder: "e.g. 40" },
        { name: "bachelorParty", label: "Bachelor Party ($)", type: "number", placeholder: "e.g. 350" },
        { name: "weddingGift", label: "Wedding Gift ($)", type: "number", placeholder: "e.g. 100" },
        { name: "travel", label: "Travel Expenses ($)", type: "number", placeholder: "e.g. 400" },
        { name: "accommodation", label: "Accommodation ($)", type: "number", placeholder: "e.g. 200" },
      ],
      calculate: (inputs) => {
        const suitCost = (inputs.suitCost as number) || 0;
        const shoes = (inputs.shoes as number) || 0;
        const accessories = (inputs.accessories as number) || 0;
        const grooming = (inputs.grooming as number) || 0;
        const bachelorParty = (inputs.bachelorParty as number) || 0;
        const weddingGift = (inputs.weddingGift as number) || 0;
        const travel = (inputs.travel as number) || 0;
        const accommodation = (inputs.accommodation as number) || 0;
        const attireCost = suitCost + shoes + accessories + grooming;
        const travelCost = travel + accommodation;
        const totalCost = attireCost + bachelorParty + weddingGift + travelCost;
        if (totalCost <= 0) return null;
        return {
          primary: { label: "Total Groomsman Cost", value: "$" + formatNumber(totalCost, 2) },
          details: [
            { label: "Attire & Grooming", value: "$" + formatNumber(attireCost, 2) },
            { label: "Suit/Tux", value: "$" + formatNumber(suitCost, 2) },
            { label: "Shoes", value: "$" + formatNumber(shoes, 2) },
            { label: "Accessories", value: "$" + formatNumber(accessories, 2) },
            { label: "Bachelor Party", value: "$" + formatNumber(bachelorParty, 2) },
            { label: "Wedding Gift", value: "$" + formatNumber(weddingGift, 2) },
            { label: "Travel & Accommodation", value: "$" + formatNumber(travelCost, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["bridesmaid-cost", "wedding-guest-list", "wedding-registry"],
  faq: [
    { question: "How much does it cost to be a groomsman?", answer: "The average cost of being a groomsman ranges from $800 to $2,000, including suit rental or purchase, shoes, bachelor party, gifts, and travel." },
    { question: "Should groomsmen rent or buy suits?", answer: "Renting is more affordable ($150-$300) for one-time use. Buying ($300-$600) makes sense if the suit can be worn again. The groom often decides." },
  ],
  formula: "Total Cost = Attire + Grooming + Bachelor Party + Gift + Travel + Accommodation",
};
