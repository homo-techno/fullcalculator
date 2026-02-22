import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bridesmaidCostCalculator: CalculatorDefinition = {
  slug: "bridesmaid-cost",
  title: "Bridesmaid Cost Calculator",
  description: "Free bridesmaid cost calculator. Estimate the total cost of being a bridesmaid including dress, shoes, hair, makeup, gifts, and events.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["bridesmaid cost", "bridesmaid budget", "wedding party cost", "bridesmaid expenses", "bridal party"],
  variants: [
    {
      id: "detailed",
      name: "Detailed Cost Breakdown",
      fields: [
        { name: "dressCost", label: "Dress Cost ($)", type: "number", placeholder: "e.g. 200" },
        { name: "alterations", label: "Alterations ($)", type: "number", placeholder: "e.g. 75" },
        { name: "shoes", label: "Shoes ($)", type: "number", placeholder: "e.g. 80" },
        { name: "hairMakeup", label: "Hair & Makeup ($)", type: "number", placeholder: "e.g. 150" },
        { name: "bachelorette", label: "Bachelorette Party ($)", type: "number", placeholder: "e.g. 300" },
        { name: "bridalShower", label: "Bridal Shower Contribution ($)", type: "number", placeholder: "e.g. 100" },
        { name: "weddingGift", label: "Wedding Gift ($)", type: "number", placeholder: "e.g. 100" },
        { name: "travel", label: "Travel Expenses ($)", type: "number", placeholder: "e.g. 400" },
        { name: "accommodation", label: "Accommodation ($)", type: "number", placeholder: "e.g. 200" },
      ],
      calculate: (inputs) => {
        const dressCost = (inputs.dressCost as number) || 0;
        const alterations = (inputs.alterations as number) || 0;
        const shoes = (inputs.shoes as number) || 0;
        const hairMakeup = (inputs.hairMakeup as number) || 0;
        const bachelorette = (inputs.bachelorette as number) || 0;
        const bridalShower = (inputs.bridalShower as number) || 0;
        const weddingGift = (inputs.weddingGift as number) || 0;
        const travel = (inputs.travel as number) || 0;
        const accommodation = (inputs.accommodation as number) || 0;
        const attireCost = dressCost + alterations + shoes + hairMakeup;
        const eventsCost = bachelorette + bridalShower;
        const travelCost = travel + accommodation;
        const totalCost = attireCost + eventsCost + weddingGift + travelCost;
        if (totalCost <= 0) return null;
        return {
          primary: { label: "Total Bridesmaid Cost", value: "$" + formatNumber(totalCost, 2) },
          details: [
            { label: "Attire & Beauty", value: "$" + formatNumber(attireCost, 2) },
            { label: "Dress + Alterations", value: "$" + formatNumber(dressCost + alterations, 2) },
            { label: "Shoes", value: "$" + formatNumber(shoes, 2) },
            { label: "Hair & Makeup", value: "$" + formatNumber(hairMakeup, 2) },
            { label: "Events (Bach + Shower)", value: "$" + formatNumber(eventsCost, 2) },
            { label: "Wedding Gift", value: "$" + formatNumber(weddingGift, 2) },
            { label: "Travel & Accommodation", value: "$" + formatNumber(travelCost, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["groomsmen-cost", "wedding-guest-list", "wedding-registry"],
  faq: [
    { question: "How much does it cost to be a bridesmaid?", answer: "The average cost of being a bridesmaid ranges from $1,000 to $2,500, including dress, shoes, hair, makeup, events, gifts, and travel." },
    { question: "What costs should the bride cover?", answer: "Many brides now cover hair and makeup, bridesmaid gifts, and sometimes the dress. The bachelorette and shower costs are typically split among the bridal party." },
  ],
  formula: "Total Cost = Attire + Beauty + Events + Gift + Travel + Accommodation",
};
