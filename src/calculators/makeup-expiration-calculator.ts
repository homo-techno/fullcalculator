import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const makeupExpirationCalculator: CalculatorDefinition = {
  slug: "makeup-expiration-calculator",
  title: "Makeup Expiration Calculator",
  description: "Track makeup product lifespan and replacement schedule.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["makeup expiration","makeup shelf life","cosmetic expiration"],
  variants: [{
    id: "standard",
    name: "Makeup Expiration",
    description: "Track makeup product lifespan and replacement schedule.",
    fields: [
      { name: "productType", label: "Product Type", type: "select", options: [{ value: "3", label: "Mascara (3 months)" }, { value: "6", label: "Liquid Foundation (6 months)" }, { value: "12", label: "Lipstick (12 months)" }, { value: "24", label: "Powder Products (24 months)" }, { value: "18", label: "Cream Blush (18 months)" }] },
      { name: "openedDate", label: "Months Since Opened", type: "number", min: 0, max: 36, defaultValue: 3 },
      { name: "productCost", label: "Product Cost ($)", type: "number", min: 1, max: 200, defaultValue: 25 },
      { name: "totalProducts", label: "Total Products to Track", type: "number", min: 1, max: 50, defaultValue: 10 },
    ],
    calculate: (inputs) => {
    const shelfLife = parseInt(inputs.productType as string);
    const openedDate = inputs.openedDate as number;
    const productCost = inputs.productCost as number;
    const totalProducts = inputs.totalProducts as number;
    const remainingMonths = Math.max(shelfLife - openedDate, 0);
    const isExpired = openedDate >= shelfLife;
    const annualReplacementCost = productCost * (12 / shelfLife);
    const totalAnnualCost = annualReplacementCost * totalProducts;
    return {
      primary: { label: "Product Status", value: isExpired ? "Expired - Replace Now" : formatNumber(remainingMonths) + " months remaining" },
      details: [
        { label: "Shelf Life", value: formatNumber(shelfLife) + " months" },
        { label: "Replacement Cost Per Year", value: "$" + formatNumber(annualReplacementCost) },
        { label: "Total Annual Replacement Cost", value: "$" + formatNumber(totalAnnualCost) }
      ]
    };
  },
  }],
  relatedSlugs: ["skincare-routine-cost-calculator","perfume-cost-per-wear-calculator"],
  faq: [
    { question: "How long does mascara last?", answer: "Mascara should be replaced every 3 months to prevent bacterial growth." },
    { question: "When should you throw away makeup?", answer: "Follow the PAO symbol on packaging, which shows months after opening." },
    { question: "Can expired makeup cause problems?", answer: "Yes, expired makeup can cause skin irritation, breakouts, and infections." },
  ],
  formula: "Remaining Life = Shelf Life (months) - Months Since Opened",
};
