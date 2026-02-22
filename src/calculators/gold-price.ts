import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const goldPriceCalculator: CalculatorDefinition = {
  slug: "gold-price-calculator",
  title: "Gold Price Calculator",
  description:
    "Free gold price and value calculator. Calculate the value of gold by weight and purity. Convert between gold karats and find melt value of gold jewelry.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "gold price calculator",
    "gold value calculator",
    "gold karat calculator",
    "gold weight calculator",
    "gold melt value",
    "gold purity calculator",
    "gold rate calculator",
  ],
  variants: [
    {
      id: "value",
      name: "Gold Value Calculator",
      description: "Calculate the value of gold based on weight, purity, and current price",
      fields: [
        {
          name: "weight",
          label: "Gold Weight",
          type: "number",
          placeholder: "e.g. 10",
          min: 0,
          step: 0.01,
        },
        {
          name: "weightUnit",
          label: "Weight Unit",
          type: "select",
          options: [
            { label: "Grams", value: "grams" },
            { label: "Ounces (Troy)", value: "ounces" },
            { label: "Tola", value: "tola" },
            { label: "Kilograms", value: "kg" },
          ],
          defaultValue: "grams",
        },
        {
          name: "purity",
          label: "Gold Purity",
          type: "select",
          options: [
            { label: "24K (99.9% Pure)", value: "24" },
            { label: "22K (91.6%)", value: "22" },
            { label: "18K (75%)", value: "18" },
            { label: "14K (58.3%)", value: "14" },
            { label: "10K (41.7%)", value: "10" },
            { label: "9K (37.5%)", value: "9" },
          ],
          defaultValue: "22",
        },
        {
          name: "pricePerGram",
          label: "Gold Price per Gram (24K)",
          type: "number",
          placeholder: "e.g. 6500",
          prefix: "₹",
          min: 0,
          step: 1,
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const weightUnit = inputs.weightUnit as string;
        const purity = parseFloat(inputs.purity as string);
        const pricePerGram = inputs.pricePerGram as number;
        if (!weight || !pricePerGram) return null;

        // Convert to grams
        let weightInGrams = weight;
        if (weightUnit === "ounces") weightInGrams = weight * 31.1035;
        else if (weightUnit === "tola") weightInGrams = weight * 11.6638;
        else if (weightUnit === "kg") weightInGrams = weight * 1000;

        const purityFactor = purity / 24;
        const totalValue = weightInGrams * pricePerGram * purityFactor;
        const pureGoldContent = weightInGrams * purityFactor;

        return {
          primary: { label: "Total Gold Value", value: `₹${formatNumber(totalValue)}` },
          details: [
            { label: "Weight in grams", value: `${formatNumber(weightInGrams, 2)} g` },
            { label: `Purity (${purity}K)`, value: `${formatNumber(purityFactor * 100, 1)}%` },
            { label: "Pure gold content", value: `${formatNumber(pureGoldContent, 2)} g` },
            { label: "Price per gram (24K)", value: `₹${formatNumber(pricePerGram)}` },
            { label: `Price per gram (${purity}K)`, value: `₹${formatNumber(pricePerGram * purityFactor)}` },
          ],
        };
      },
    },
    {
      id: "making-charges",
      name: "Jewelry Cost Calculator",
      description: "Calculate total cost of gold jewelry including making charges and GST",
      fields: [
        {
          name: "weight",
          label: "Gold Weight (grams)",
          type: "number",
          placeholder: "e.g. 10",
          suffix: "g",
          min: 0,
          step: 0.01,
        },
        {
          name: "purity",
          label: "Gold Purity",
          type: "select",
          options: [
            { label: "24K (99.9%)", value: "24" },
            { label: "22K (91.6%)", value: "22" },
            { label: "18K (75%)", value: "18" },
          ],
          defaultValue: "22",
        },
        {
          name: "pricePerGram",
          label: "Gold Price per Gram (24K)",
          type: "number",
          placeholder: "e.g. 6500",
          prefix: "₹",
          min: 0,
        },
        {
          name: "makingChargePercent",
          label: "Making Charges (%)",
          type: "number",
          placeholder: "e.g. 12",
          suffix: "%",
          min: 0,
          max: 50,
          defaultValue: 12,
        },
        {
          name: "gstRate",
          label: "GST Rate",
          type: "select",
          options: [
            { label: "3% (Standard for Gold)", value: "3" },
            { label: "5% (Making charges GST)", value: "5" },
          ],
          defaultValue: "3",
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const purity = parseFloat(inputs.purity as string);
        const pricePerGram = inputs.pricePerGram as number;
        const makingChargePercent = inputs.makingChargePercent as number;
        const gstRate = parseFloat(inputs.gstRate as string);
        if (!weight || !pricePerGram) return null;

        const purityFactor = purity / 24;
        const goldValue = weight * pricePerGram * purityFactor;
        const makingCharges = goldValue * ((makingChargePercent || 0) / 100);
        const subtotal = goldValue + makingCharges;
        const gst = subtotal * (gstRate / 100);
        const totalCost = subtotal + gst;

        return {
          primary: { label: "Total Jewelry Cost", value: `₹${formatNumber(totalCost)}` },
          details: [
            { label: "Gold value", value: `₹${formatNumber(goldValue)}` },
            { label: `Making charges (${makingChargePercent}%)`, value: `₹${formatNumber(makingCharges)}` },
            { label: "Subtotal", value: `₹${formatNumber(subtotal)}` },
            { label: `GST (${gstRate}%)`, value: `₹${formatNumber(gst)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["currency-exchange-calculator", "investment-calculator", "gst-calculator"],
  faq: [
    {
      question: "What is the difference between 24K, 22K, and 18K gold?",
      answer:
        "24K gold is 99.9% pure gold (too soft for jewelry). 22K is 91.6% gold mixed with other metals (standard for Indian jewelry). 18K is 75% gold (common in Western jewelry and watches). Lower karat means more alloy and greater durability.",
    },
    {
      question: "What is a tola?",
      answer:
        "A tola is a traditional Indian unit of weight for gold, equal to 11.6638 grams. Gold prices in India are often quoted per 10 grams or per tola. One tola was historically the weight of a silver rupee coin.",
    },
    {
      question: "What is GST on gold in India?",
      answer:
        "GST on gold in India is 3% on the value of gold. Making charges on jewelry attract 5% GST. So when buying gold jewelry, you pay 3% GST on gold value plus 5% GST on making charges.",
    },
  ],
  formula: "Gold Value = Weight (g) × Price per gram × (Karat / 24)",
};
