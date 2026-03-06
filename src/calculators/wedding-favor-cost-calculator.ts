import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weddingFavorCostCalculator: CalculatorDefinition = {
  slug: "wedding-favor-cost-calculator",
  title: "Wedding Favor Cost Calculator",
  description: "Calculate the total cost of wedding favors including per-item cost, packaging, personalization, and shipping for DIY or purchased options.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["wedding favor cost","party favors budget","wedding gifts for guests","favor packaging cost"],
  variants: [{
    id: "standard",
    name: "Wedding Favor Cost",
    description: "Calculate the total cost of wedding favors including per-item cost, packaging, personalization, and shipping for DIY or purchased options.",
    fields: [
      { name: "guestCount", label: "Number of Guests", type: "number", min: 10, max: 500, defaultValue: 120 },
      { name: "favorType", label: "Favor Type", type: "select", options: [{ value: "2", label: "DIY/Homemade ($2)" }, { value: "4", label: "Standard ($4)" }, { value: "7", label: "Premium ($7)" }, { value: "12", label: "Luxury ($12)" }], defaultValue: "4" },
      { name: "packagingCost", label: "Packaging Per Favor ($)", type: "number", min: 0, max: 5, defaultValue: 1 },
      { name: "personalization", label: "Personalization Per Favor ($)", type: "number", min: 0, max: 5, defaultValue: 0.5 },
      { name: "extraPercent", label: "Extra Favors Buffer (%)", type: "number", min: 0, max: 25, defaultValue: 10 },
    ],
    calculate: (inputs) => {
    const guests = inputs.guestCount as number;
    const favorCost = parseFloat(inputs.favorType as unknown as string);
    const packaging = inputs.packagingCost as number;
    const personalization = inputs.personalization as number;
    const buffer = inputs.extraPercent as number;
    const totalFavors = Math.ceil(guests * (1 + buffer / 100));
    const perFavor = favorCost + packaging + personalization;
    const totalCost = totalFavors * perFavor;
    const costPerGuest = totalCost / guests;
    return {
      primary: { label: "Total Favor Cost", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) },
      details: [
        { label: "Cost Per Favor", value: "$" + formatNumber(Math.round(perFavor * 100) / 100) },
        { label: "Total Favors (with buffer)", value: formatNumber(totalFavors) },
        { label: "Favor Item Cost", value: "$" + formatNumber(favorCost) + " each" },
        { label: "Packaging Total", value: "$" + formatNumber(Math.round(totalFavors * packaging * 100) / 100) },
        { label: "Personalization Total", value: "$" + formatNumber(Math.round(totalFavors * personalization * 100) / 100) },
        { label: "Cost Per Guest", value: "$" + formatNumber(Math.round(costPerGuest * 100) / 100) }
      ]
    };
  },
  }],
  relatedSlugs: ["wedding-budget-calculator","wedding-guest-calculator","wedding-registry-value-calculator"],
  faq: [
    { question: "How much should you spend on wedding favors?", answer: "Most couples spend $2 to $5 per favor. The total favor budget is typically 2-3% of the overall wedding budget." },
    { question: "Do you need wedding favors for every guest?", answer: "Provide one favor per guest or per couple. Order 10% extra to account for last-minute additions and table display needs." },
    { question: "What are affordable wedding favor ideas?", answer: "Popular budget-friendly favors include homemade cookies, seed packets, custom matchboxes, candy bags, or small succulents. DIY options can cost under $2 each." },
  ],
  formula: "Favors Needed = Guests x (1 + Buffer%)
Per Favor = FavorCost + Packaging + Personalization
Total = FavorsNeeded x PerFavor",
};
