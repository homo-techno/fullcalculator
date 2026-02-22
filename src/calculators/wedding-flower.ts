import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weddingFlowerCalculator: CalculatorDefinition = {
  slug: "wedding-flower",
  title: "Wedding Flower Budget Calculator",
  description: "Free wedding flower budget calculator. Estimate costs for bouquets, centerpieces, ceremony arrangements, and other floral decorations for your wedding.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["wedding flowers", "floral budget", "bouquet cost", "centerpieces", "wedding florist"],
  variants: [
    {
      id: "detailed",
      name: "Detailed Floral Budget",
      fields: [
        { name: "bridalBouquets", label: "Bridal Bouquets", type: "number", placeholder: "e.g. 1" },
        { name: "bridesmaidBouquets", label: "Bridesmaid Bouquets", type: "number", placeholder: "e.g. 4" },
        { name: "boutonnieres", label: "Boutonnieres", type: "number", placeholder: "e.g. 8" },
        { name: "corsages", label: "Corsages", type: "number", placeholder: "e.g. 4" },
        { name: "centerpieces", label: "Table Centerpieces", type: "number", placeholder: "e.g. 15" },
        { name: "ceremonyPieces", label: "Ceremony Arrangements", type: "number", placeholder: "e.g. 4" },
        { name: "flowerLevel", label: "Flower Quality Level", type: "select", options: [
          { label: "Budget-Friendly", value: "budget" },
          { label: "Mid-Range", value: "mid" },
          { label: "Premium", value: "premium" },
          { label: "Luxury", value: "luxury" },
        ] },
      ],
      calculate: (inputs) => {
        const bridalBouquets = (inputs.bridalBouquets as number) || 0;
        const bridesmaidBouquets = (inputs.bridesmaidBouquets as number) || 0;
        const boutonnieres = (inputs.boutonnieres as number) || 0;
        const corsages = (inputs.corsages as number) || 0;
        const centerpieces = (inputs.centerpieces as number) || 0;
        const ceremonyPieces = (inputs.ceremonyPieces as number) || 0;
        const flowerLevel = (inputs.flowerLevel as string) || "mid";
        const multiplier = flowerLevel === "budget" ? 0.6 : flowerLevel === "mid" ? 1 : flowerLevel === "premium" ? 1.6 : 2.5;
        const bridalCost = bridalBouquets * 250 * multiplier;
        const bmCost = bridesmaidBouquets * 75 * multiplier;
        const boutCost = boutonnieres * 20 * multiplier;
        const corsCost = corsages * 35 * multiplier;
        const centCost = centerpieces * 150 * multiplier;
        const cerCost = ceremonyPieces * 300 * multiplier;
        const subtotal = bridalCost + bmCost + boutCost + corsCost + centCost + cerCost;
        if (subtotal <= 0) return null;
        const delivery = subtotal * 0.1;
        const total = subtotal + delivery;
        return {
          primary: { label: "Total Flower Budget", value: "$" + formatNumber(total, 2) },
          details: [
            { label: "Bridal Bouquet(s)", value: "$" + formatNumber(bridalCost, 2) },
            { label: "Bridesmaid Bouquets", value: "$" + formatNumber(bmCost, 2) },
            { label: "Boutonnieres", value: "$" + formatNumber(boutCost, 2) },
            { label: "Corsages", value: "$" + formatNumber(corsCost, 2) },
            { label: "Centerpieces", value: "$" + formatNumber(centCost, 2) },
            { label: "Ceremony Arrangements", value: "$" + formatNumber(cerCost, 2) },
            { label: "Delivery & Setup (10%)", value: "$" + formatNumber(delivery, 2) },
          ],
        };
      },
    },
    {
      id: "percentage",
      name: "By Wedding Budget Percentage",
      fields: [
        { name: "totalBudget", label: "Total Wedding Budget ($)", type: "number", placeholder: "e.g. 30000" },
        { name: "flowerPercent", label: "Flower Budget (%)", type: "number", placeholder: "e.g. 8" },
        { name: "tableCount", label: "Number of Tables", type: "number", placeholder: "e.g. 15" },
      ],
      calculate: (inputs) => {
        const totalBudget = (inputs.totalBudget as number) || 0;
        const flowerPercent = (inputs.flowerPercent as number) || 8;
        const tableCount = (inputs.tableCount as number) || 0;
        if (totalBudget <= 0) return null;
        const flowerBudget = totalBudget * (flowerPercent / 100);
        const personalFlowers = flowerBudget * 0.35;
        const centerpieceBudget = flowerBudget * 0.4;
        const ceremonyBudget = flowerBudget * 0.15;
        const miscBudget = flowerBudget * 0.1;
        const perCenterpiece = tableCount > 0 ? centerpieceBudget / tableCount : 0;
        return {
          primary: { label: "Total Flower Budget", value: "$" + formatNumber(flowerBudget, 2) },
          details: [
            { label: "Personal Flowers (35%)", value: "$" + formatNumber(personalFlowers, 2) },
            { label: "Centerpiece Budget (40%)", value: "$" + formatNumber(centerpieceBudget, 2) },
            { label: "Per Centerpiece", value: "$" + formatNumber(perCenterpiece, 2) },
            { label: "Ceremony Flowers (15%)", value: "$" + formatNumber(ceremonyBudget, 2) },
            { label: "Misc/Delivery (10%)", value: "$" + formatNumber(miscBudget, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wedding-guest-list", "wedding-seating", "event-rental"],
  faq: [
    { question: "What percentage of the wedding budget goes to flowers?", answer: "Typically 8-10% of the total wedding budget is allocated to flowers. For a $30,000 wedding, that would be $2,400-$3,000." },
    { question: "How can I save on wedding flowers?", answer: "Consider using seasonal flowers, mixing fresh flowers with greenery, repurposing ceremony arrangements as reception decor, or using fewer but larger statement pieces." },
  ],
  formula: "Total = Sum of (Item Count x Base Price x Quality Multiplier) + 10% Delivery",
};
