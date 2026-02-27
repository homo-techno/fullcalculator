import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const halloweenCostumeCostCalculator: CalculatorDefinition = {
  slug: "halloween-costume-cost-calculator",
  title: "Halloween Costume Cost Calculator",
  description:
    "Compare DIY vs store-bought Halloween costume costs. Estimate total spending on materials, accessories, and makeup for your costume.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "halloween costume",
    "costume budget",
    "DIY costume",
    "costume cost",
    "halloween spending",
  ],
  variants: [
    {
      id: "diyVsStore",
      name: "DIY vs Store-Bought",
      description: "Compare making your own costume versus buying one",
      fields: [
        { name: "storeCostumeCost", label: "Store Costume Price ($)", type: "number", placeholder: "e.g. 45", defaultValue: 45 },
        { name: "storeAccessories", label: "Store Accessories ($)", type: "number", placeholder: "e.g. 15", defaultValue: 15 },
        { name: "diyFabric", label: "DIY Fabric/Materials ($)", type: "number", placeholder: "e.g. 15", defaultValue: 15 },
        { name: "diyAccessories", label: "DIY Accessories ($)", type: "number", placeholder: "e.g. 8", defaultValue: 8 },
        { name: "diyTools", label: "DIY Tools/Supplies ($)", type: "number", placeholder: "e.g. 5", defaultValue: 5 },
        { name: "makeup", label: "Makeup/Face Paint ($)", type: "number", placeholder: "e.g. 10", defaultValue: 10 },
        { name: "numPeople", label: "Number of People", type: "number", placeholder: "e.g. 1", defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const storeCostumeCost = parseFloat(inputs.storeCostumeCost as string);
        const storeAccessories = parseFloat(inputs.storeAccessories as string);
        const diyFabric = parseFloat(inputs.diyFabric as string);
        const diyAccessories = parseFloat(inputs.diyAccessories as string);
        const diyTools = parseFloat(inputs.diyTools as string);
        const makeup = parseFloat(inputs.makeup as string);
        const numPeople = parseFloat(inputs.numPeople as string);

        if (isNaN(storeCostumeCost) || isNaN(diyFabric)) return null;

        const people = numPeople || 1;
        const storeTotalPer = (storeCostumeCost || 0) + (storeAccessories || 0) + (makeup || 0);
        const diyTotalPer = (diyFabric || 0) + (diyAccessories || 0) + (diyTools || 0) + (makeup || 0);
        const storeTotal = storeTotalPer * people;
        const diyTotal = diyTotalPer * people;
        const savings = storeTotal - diyTotal;

        return {
          primary: { label: "DIY Savings", value: `$${formatNumber(savings, 2)}` },
          details: [
            { label: "Store-Bought Total (per person)", value: `$${formatNumber(storeTotalPer, 2)}` },
            { label: "DIY Total (per person)", value: `$${formatNumber(diyTotalPer, 2)}` },
            { label: "Store-Bought Total (all)", value: `$${formatNumber(storeTotal, 2)}` },
            { label: "DIY Total (all)", value: `$${formatNumber(diyTotal, 2)}` },
            { label: "Savings Percentage", value: storeTotal > 0 ? `${formatNumber((savings / storeTotal) * 100, 1)}%` : "N/A" },
          ],
          note: savings > 0 ? "DIY is cheaper!" : "Store-bought is cheaper for this costume.",
        };
      },
    },
    {
      id: "familyCostume",
      name: "Family Costume Budget",
      description: "Budget for costumes for the whole family",
      fields: [
        { name: "numAdults", label: "Number of Adults", type: "number", placeholder: "e.g. 2", defaultValue: 2 },
        { name: "adultCost", label: "Cost per Adult Costume ($)", type: "number", placeholder: "e.g. 40", defaultValue: 40 },
        { name: "numKids", label: "Number of Kids", type: "number", placeholder: "e.g. 2", defaultValue: 2 },
        { name: "kidCost", label: "Cost per Kid Costume ($)", type: "number", placeholder: "e.g. 25", defaultValue: 25 },
        { name: "accessories", label: "Total Accessories ($)", type: "number", placeholder: "e.g. 20", defaultValue: 20 },
        { name: "makeup", label: "Total Makeup/Face Paint ($)", type: "number", placeholder: "e.g. 15", defaultValue: 15 },
      ],
      calculate: (inputs) => {
        const numAdults = parseFloat(inputs.numAdults as string);
        const adultCost = parseFloat(inputs.adultCost as string);
        const numKids = parseFloat(inputs.numKids as string);
        const kidCost = parseFloat(inputs.kidCost as string);
        const accessories = parseFloat(inputs.accessories as string);
        const makeup = parseFloat(inputs.makeup as string);

        if (isNaN(numAdults) || isNaN(adultCost)) return null;

        const adultTotal = (numAdults || 0) * (adultCost || 0);
        const kidTotal = (numKids || 0) * (kidCost || 0);
        const totalPeople = (numAdults || 0) + (numKids || 0);
        const grandTotal = adultTotal + kidTotal + (accessories || 0) + (makeup || 0);
        const avgPerPerson = totalPeople > 0 ? grandTotal / totalPeople : 0;

        return {
          primary: { label: "Total Family Costume Budget", value: `$${formatNumber(grandTotal, 2)}` },
          details: [
            { label: "Adult Costumes", value: `$${formatNumber(adultTotal, 2)}` },
            { label: "Kid Costumes", value: `$${formatNumber(kidTotal, 2)}` },
            { label: "Accessories", value: `$${formatNumber(accessories || 0, 2)}` },
            { label: "Makeup/Face Paint", value: `$${formatNumber(makeup || 0, 2)}` },
            { label: "Average per Person", value: `$${formatNumber(avgPerPerson, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["halloween-candy-calculator", "christmas-budget-calculator", "budget-calculator"],
  faq: [
    {
      question: "How much does the average Halloween costume cost?",
      answer:
        "The average American spends about $30-$50 on a Halloween costume. Children's costumes average $25-$35, while adult costumes range from $30-$60 or more for elaborate setups.",
    },
    {
      question: "Is it cheaper to make or buy a Halloween costume?",
      answer:
        "DIY costumes are usually 30-60% cheaper than store-bought. Simple costumes using clothes you already own plus a few accessories can cost under $15. However, very elaborate DIY costumes may cost more than buying.",
    },
  ],
  formula:
    "Store Total = (Costume + Accessories + Makeup) × People; DIY Total = (Fabric + Accessories + Tools + Makeup) × People; Savings = Store Total - DIY Total",
};
