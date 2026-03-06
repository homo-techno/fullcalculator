import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const floralArrangementBudgetCalculator: CalculatorDefinition = {
  slug: "floral-arrangement-budget-calculator",
  title: "Floral Arrangement Budget Calculator",
  description: "Plan your wedding or event floral budget with detailed costs for bridal bouquet, centerpieces, boutonnieres, ceremony flowers, and more.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["floral budget","wedding flowers cost","centerpiece cost","bouquet pricing","event florals"],
  variants: [{
    id: "standard",
    name: "Floral Arrangement Budget",
    description: "Plan your wedding or event floral budget with detailed costs for bridal bouquet, centerpieces, boutonnieres, ceremony flowers, and more.",
    fields: [
      { name: "bridalBouquet", label: "Bridal Bouquet ($)", type: "number", min: 50, max: 1000, defaultValue: 250 },
      { name: "bridesmaidBouquets", label: "Bridesmaid Bouquets Count", type: "number", min: 0, max: 15, defaultValue: 4 },
      { name: "bridesmaidBouquetCost", label: "Each Bridesmaid Bouquet ($)", type: "number", min: 30, max: 300, defaultValue: 85 },
      { name: "centerpieces", label: "Number of Centerpieces", type: "number", min: 0, max: 50, defaultValue: 15 },
      { name: "centerpieceCost", label: "Each Centerpiece ($)", type: "number", min: 30, max: 500, defaultValue: 100 },
      { name: "boutonnieres", label: "Boutonnieres Count", type: "number", min: 0, max: 20, defaultValue: 8 },
      { name: "boutonniereCost", label: "Each Boutonniere ($)", type: "number", min: 5, max: 40, defaultValue: 15 },
      { name: "ceremonyCost", label: "Ceremony Florals ($)", type: "number", min: 0, max: 5000, defaultValue: 500 },
    ],
    calculate: (inputs) => {
    const bridal = inputs.bridalBouquet as number;
    const bmCount = inputs.bridesmaidBouquets as number;
    const bmCost = inputs.bridesmaidBouquetCost as number;
    const cpCount = inputs.centerpieces as number;
    const cpCost = inputs.centerpieceCost as number;
    const boutCount = inputs.boutonnieres as number;
    const boutCost = inputs.boutonniereCost as number;
    const ceremony = inputs.ceremonyCost as number;
    const totalBridesmaid = bmCount * bmCost;
    const totalCenterpieces = cpCount * cpCost;
    const totalBoutonnieres = boutCount * boutCost;
    const total = bridal + totalBridesmaid + totalCenterpieces + totalBoutonnieres + ceremony;
    return {
      primary: { label: "Total Floral Budget", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Bridal Bouquet", value: "$" + formatNumber(bridal) },
        { label: "Bridesmaid Bouquets", value: "$" + formatNumber(Math.round(totalBridesmaid)) },
        { label: "Centerpieces", value: "$" + formatNumber(Math.round(totalCenterpieces)) },
        { label: "Boutonnieres", value: "$" + formatNumber(Math.round(totalBoutonnieres)) },
        { label: "Ceremony Florals", value: "$" + formatNumber(ceremony) }
      ]
    };
  },
  }],
  relatedSlugs: ["wedding-flower-calculator","wedding-budget-calculator","reception-venue-cost-calculator"],
  faq: [
    { question: "How much do wedding flowers cost on average?", answer: "The average wedding floral budget is $2,000 to $5,000. Centerpieces and the bridal bouquet are the largest expenses, while boutonnieres and corsages are modest." },
    { question: "How can you save on wedding flowers?", answer: "Choose in-season flowers, use greenery-heavy designs, repurpose ceremony arrangements at the reception, and consider non-floral elements like candles or lanterns for centerpieces." },
    { question: "How many centerpieces do you need for a wedding?", answer: "You need one centerpiece per guest table. For 100-150 guests with tables of 8-10, plan for 12-18 centerpieces." },
  ],
  formula: "Total = BridalBouquet + (BridesmaidCount x BridesmaidCost) + (Centerpieces x CenterpieceCost) + (Boutonnieres x BoutonniereCost) + CeremonyFlorals",
};
