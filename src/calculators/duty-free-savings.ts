import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dutyFreeSavings: CalculatorDefinition = {
  slug: "duty-free-savings",
  title: "Duty-Free Savings Calculator",
  description:
    "Free online duty-free savings calculator. Calculate how much you save shopping duty-free at airports compared to retail prices.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "duty free",
    "duty free savings",
    "airport shopping",
    "tax free shopping",
    "duty free prices",
  ],
  variants: [
    {
      id: "savings",
      name: "Calculate Duty-Free Savings",
      fields: [
        {
          name: "retailPrice",
          label: "Retail Price at Home ($)",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          name: "productType",
          label: "Product Category",
          type: "select",
          options: [
            { label: "Liquor / Spirits", value: "liquor" },
            { label: "Wine / Champagne", value: "wine" },
            { label: "Cigarettes / Tobacco", value: "tobacco" },
            { label: "Perfume / Fragrance", value: "perfume" },
            { label: "Cosmetics / Skincare", value: "cosmetics" },
            { label: "Chocolate / Confections", value: "chocolate" },
            { label: "Designer Fashion", value: "fashion" },
            { label: "Electronics", value: "electronics" },
          ],
        },
        {
          name: "homeTaxRate",
          label: "Your Home Sales Tax Rate (%)",
          type: "number",
          placeholder: "e.g. 8.5",
        },
      ],
      calculate: (inputs) => {
        const retailPrice = parseFloat(inputs.retailPrice as string) || 0;
        const productType = inputs.productType as string;
        const homeTaxRate = parseFloat(inputs.homeTaxRate as string) || 0;

        // Average duty-free discount by product category
        const discounts: Record<string, number> = {
          liquor: 0.30,
          wine: 0.20,
          tobacco: 0.35,
          perfume: 0.20,
          cosmetics: 0.15,
          chocolate: 0.10,
          fashion: 0.15,
          electronics: 0.05,
        };

        const dutyFreeDiscount = discounts[productType] || 0.15;
        const taxSavings = retailPrice * (homeTaxRate / 100);
        const productDiscount = retailPrice * dutyFreeDiscount;
        const dutyFreePrice = retailPrice - productDiscount - taxSavings;
        const totalSavings = productDiscount + taxSavings;
        const savingsPercent = (totalSavings / retailPrice) * 100;

        return {
          primary: {
            label: "Estimated Duty-Free Price",
            value: "$" + formatNumber(dutyFreePrice, 2),
          },
          details: [
            { label: "Retail Price", value: "$" + formatNumber(retailPrice, 2) },
            { label: "Product Discount", value: "$" + formatNumber(productDiscount, 2) + " (" + formatNumber(dutyFreeDiscount * 100, 0) + "%)" },
            { label: "Tax Savings", value: "$" + formatNumber(taxSavings, 2) },
            { label: "Total Savings", value: "$" + formatNumber(totalSavings, 2) },
            { label: "Savings Percentage", value: formatNumber(savingsPercent, 1) + "%" },
          ],
          note: "Actual duty-free prices vary by airport and retailer. Verify before purchasing.",
        };
      },
    },
  ],
  relatedSlugs: ["customs-duty", "currency-converter-trip", "carry-on-weight"],
  faq: [
    {
      question: "Is duty-free shopping really cheaper?",
      answer:
        "Duty-free shopping removes excise duties and local taxes, saving 10-35% depending on the product. The biggest savings are on liquor, tobacco, and perfume. Electronics and fashion savings are typically smaller.",
    },
    {
      question: "What are the duty-free limits?",
      answer:
        "US travelers can bring back 1 liter of alcohol, 200 cigarettes, and $800 worth of goods duty-free per person. Exceeding these limits may result in customs duties on the overage.",
    },
    {
      question: "When is duty-free NOT a good deal?",
      answer:
        "Duty-free is not always cheapest for electronics, branded chocolate (often cheaper at regular stores), or items on sale at home retailers. Always compare prices before buying.",
    },
  ],
  formula:
    "Duty-Free Price = Retail Price - (Retail Price x Category Discount) - (Retail Price x Tax Rate)\nTotal Savings = Product Discount + Tax Savings",
};
